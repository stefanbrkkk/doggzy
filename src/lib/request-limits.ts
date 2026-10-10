import { NextResponse } from 'next/server'

/**
 * Body-size ceilings for the public endpoints, in bytes.
 *
 * The report accepts one photo capped at 8 MB, so 9 MB leaves room for the
 * multipart framing and the JSON payload beside it. The contact form carries a
 * 2000-character message and four short fields; 64 kB is generous.
 */
export const BODY_LIMIT = {
  report: 9 * 1024 * 1024,
  login: 16 * 1024,
  contact: 64 * 1024,
} as const

export type CappedBody = { ok: true; request: Request } | { ok: false; response: NextResponse }

/**
 * Reads a request body with a hard byte ceiling and hands back a Request that
 * `formData()` / `json()` can parse.
 *
 * The obvious shape — call `request.formData()` and check `photo.size`
 * afterwards — buffers the entire body first. App Router route handlers have
 * no default body limit, so a 200 MB upload is fully allocated before the 8 MB
 * check ever runs, and a handful of concurrent ones OOM-kill the worker. The
 * per-IP rate limiter is not a mitigation here: it keys on `x-forwarded-for`,
 * which the client controls, so rotating that header buys a fresh budget.
 *
 * `Content-Length` alone is not enough either — it is absent under chunked
 * transfer encoding and is not binding in any case — so the stream is counted
 * as it arrives and cancelled the moment it goes over.
 */
export async function withBodyLimit(request: Request, limit: number): Promise<CappedBody> {
  const declared = Number(request.headers.get('content-length'))
  if (Number.isFinite(declared) && declared > limit) {
    return { ok: false, response: tooLarge() }
  }

  const stream = request.body
  if (!stream) {
    return { ok: false, response: badRequest() }
  }

  const reader = stream.getReader()
  const chunks: Uint8Array[] = []
  let total = 0

  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      if (!value) continue

      total += value.byteLength
      if (total > limit) {
        await reader.cancel()
        return { ok: false, response: tooLarge() }
      }
      chunks.push(value)
    }
  } catch {
    await reader.cancel().catch(() => {})
    return { ok: false, response: badRequest() }
  }

  const body = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) {
    body.set(chunk, offset)
    offset += chunk.byteLength
  }

  // Rebuilt rather than mutated: the original stream is consumed, and the
  // headers carry the content type — including the multipart boundary — that
  // `formData()` needs to parse what we just read.
  return {
    ok: true,
    request: new Request(request.url, {
      method: request.method,
      headers: request.headers,
      body,
    }),
  }
}

function tooLarge() {
  return NextResponse.json({ error: 'Zahtev je prevelik.' }, { status: 413 })
}

function badRequest() {
  return NextResponse.json({ error: 'Neispravan format zahteva.' }, { status: 400 })
}

/** Browser form mutations must originate from this deployment. */
export function rejectCrossOrigin(request: Request): NextResponse | null {
  const origin = request.headers.get('origin')
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: 'Zahtev sa drugog sajta nije dozvoljen.' }, { status: 403 })
  }
  return null
}
