import { NextResponse } from 'next/server'
import { contactSchema } from '@/lib/schemas'
import { clientKey, rateLimit } from '@/lib/rate-limit'
import { deliverNotification } from '@/lib/notify'

export const runtime = 'nodejs'

const TOPIC_LABELS: Record<string, string> = {
  opste: 'Opšte pitanje',
  saradnja: 'Saradnja',
  sklonište: 'Sklonište ili ambulanta',
  mediji: 'Mediji',
  donacije: 'Donacije',
}

export async function POST(request: Request) {
  const limit = rateLimit(`kontakt:${clientKey(request)}`, 5, 15 * 60 * 1000)
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Previše poruka sa iste adrese. Pokušaj kasnije.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
    )
  }

  let json: unknown
  try {
    json = await request.json()
  } catch {
    return NextResponse.json({ error: 'Neispravan JSON.' }, { status: 400 })
  }

  const parsed = contactSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Poruka nije potpuna.',
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      },
      { status: 422 },
    )
  }

  // A filled honeypot means a bot. Answer 200 so it has nothing to learn.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true })
  }

  await deliverNotification({
    subject: `Kontakt — ${TOPIC_LABELS[parsed.data.topic] ?? parsed.data.topic}`,
    replyTo: parsed.data.email,
    lines: [
      `Ime: ${parsed.data.name}`,
      `Email: ${parsed.data.email}`,
      `Tema: ${TOPIC_LABELS[parsed.data.topic] ?? parsed.data.topic}`,
      '',
      parsed.data.message,
    ],
  })

  return NextResponse.json({ ok: true })
}
