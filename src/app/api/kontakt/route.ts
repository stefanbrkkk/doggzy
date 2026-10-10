import { NextResponse } from 'next/server'
import { contactSchema } from '@/lib/schemas'
import { clientKey, rateLimit } from '@/lib/rate-limit'
import { BODY_LIMIT, withBodyLimit, rejectCrossOrigin } from '@/lib/request-limits'
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
  const rejected = rejectCrossOrigin(request)
  if (rejected) return rejected

  const limit = rateLimit(`kontakt:${clientKey(request)}`, 5, 15 * 60 * 1000)
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Previše poruka sa iste adrese. Pokušaj kasnije.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
    )
  }

  // Capped before parsing: `json()` buffers the whole body, and the message
  // length rule in the schema cannot run until after that allocation.
  const capped = await withBodyLimit(request, BODY_LIMIT.contact)
  if (!capped.ok) return capped.response

  let json: unknown
  try {
    json = await capped.request.json()
  } catch {
    return NextResponse.json({ error: 'Neispravan JSON.' }, { status: 400 })
  }

  // Checked before validation: a bot that fills the honeypot should get a
  // plain 200 and learn nothing, not a 422 naming the field it tripped.
  if (
    typeof json === 'object' &&
    json !== null &&
    typeof (json as { company?: unknown }).company === 'string' &&
    (json as { company: string }).company.length > 0
  ) {
    return NextResponse.json({ ok: true })
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
