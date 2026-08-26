import type { ReportDraft } from '@/lib/schemas'

/**
 * Posts a report and returns its case reference.
 *
 * The photo travels as multipart form data so a large image never has to be
 * base64-inflated into JSON. Throws on any non-OK response, which is what puts
 * the flow into its error state instead of falsely reporting success.
 */
export async function submitReport(draft: ReportDraft, photo: File | null): Promise<string> {
  const body = new FormData()
  body.set('payload', JSON.stringify(draft))
  if (photo) body.set('photo', photo)

  const response = await fetch('/api/prijava', { method: 'POST', body })

  if (!response.ok) {
    throw new Error(`Prijava nije prihvaćena (${response.status})`)
  }

  const data = (await response.json()) as { reference?: string }
  if (!data.reference) {
    throw new Error('Odgovor bez broja prijave')
  }

  return data.reference
}
