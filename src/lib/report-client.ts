import type { ReportDraft } from '@/lib/schemas'

/**
 * How long to wait before treating a silent server as a failed send.
 *
 * A refused connection rejects immediately and a 500 comes back, but a server
 * that accepts the connection and then never answers — an overloaded backend, a
 * stalled proxy — leaves `fetch` pending for as long as the browser allows.
 * Measured at 15s after submit the button still read "Šaljem…" and was still
 * disabled, with no error and no way to retry. On the report flow that is
 * someone standing over a dog they cannot help, watching a spinner.
 *
 * Generous enough for a photo on a slow link, short enough to still be a wait.
 */
const TIMEOUT_MS = 30000

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

  const response = await fetch('/api/prijava', {
    method: 'POST',
    body,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })

  if (!response.ok) {
    throw new Error(`Prijava nije prihvaćena (${response.status})`)
  }

  const data = (await response.json()) as { reference?: string }
  if (!data.reference) {
    throw new Error('Odgovor bez broja prijave')
  }

  return data.reference
}
