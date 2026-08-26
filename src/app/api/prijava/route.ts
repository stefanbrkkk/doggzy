import { NextResponse } from 'next/server'
import { createReference, reportSchema } from '@/lib/schemas'
import { clientKey, rateLimit } from '@/lib/rate-limit'
import { deliverNotification } from '@/lib/notify'

export const runtime = 'nodejs'

const MAX_PHOTO_BYTES = 8 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']

export async function POST(request: Request) {
  const limit = rateLimit(`prijava:${clientKey(request)}`, 8, 10 * 60 * 1000)
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Previše prijava sa iste adrese. Pokušaj kasnije.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
    )
  }

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Neispravan format zahteva.' }, { status: 400 })
  }

  const raw = form.get('payload')
  if (typeof raw !== 'string') {
    return NextResponse.json({ error: 'Nedostaju podaci prijave.' }, { status: 400 })
  }

  let json: unknown
  try {
    json = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: 'Neispravan JSON.' }, { status: 400 })
  }

  const parsed = reportSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Prijava nije potpuna.',
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      },
      { status: 422 },
    )
  }

  const photo = form.get('photo')
  let photoSummary: string | null = null

  if (photo instanceof File && photo.size > 0) {
    if (photo.size > MAX_PHOTO_BYTES) {
      return NextResponse.json({ error: 'Fotografija je veća od 8 MB.' }, { status: 413 })
    }
    if (!ALLOWED_TYPES.includes(photo.type)) {
      return NextResponse.json({ error: 'Nepodržan format fotografije.' }, { status: 415 })
    }
    photoSummary = `${photo.type}, ${Math.round(photo.size / 1024)} kB`
  }

  const reference = createReference()

  // Media storage is not provisioned yet, so the photo is validated and its
  // metadata recorded, but the bytes are intentionally not persisted. Wiring a
  // bucket here is the only change needed to keep the image.
  await deliverNotification({
    subject: `Nova prijava ${reference} — ${parsed.data.kind}`,
    lines: [
      `Referenca: ${reference}`,
      `Tip: ${parsed.data.kind}`,
      `Lokacija: ${parsed.data.location}`,
      `Pas: ${parsed.data.size}, ${parsed.data.colors.join(', ')}`,
      `Opis: ${parsed.data.description}`,
      `Kontakt: ${parsed.data.contactName} — ${parsed.data.contactValue}`,
      `Fotografija: ${photoSummary ?? 'nije priložena'}`,
    ],
  })

  return NextResponse.json({ reference }, { status: 201 })
}
