/**
 * Fixed-window rate limiter held in module memory.
 *
 * This is deliberately modest: each serverless instance keeps its own counters,
 * so under horizontal scaling the effective limit is (limit × instances). It
 * stops naive floods and accidental double-submits, and nothing more. Anything
 * that needs a real guarantee — payments, auth — should sit behind a shared
 * store (Redis, Upstash) or the platform's own WAF.
 */

interface Bucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()
const MAX_TRACKED_KEYS = 5000

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  /** Seconds until the window resets. Suitable for a Retry-After header. */
  retryAfter: number
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  const existing = buckets.get(key)

  if (!existing || existing.resetAt <= now) {
    // Opportunistic sweep: keeps the map from growing without bound on a
    // long-lived instance, without needing a timer.
    if (buckets.size > MAX_TRACKED_KEYS) {
      for (const [candidate, bucket] of buckets) {
        if (bucket.resetAt <= now) buckets.delete(candidate)
      }
    }
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1, retryAfter: 0 }
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.ceil((existing.resetAt - now) / 1000),
    }
  }

  existing.count += 1
  return {
    allowed: true,
    remaining: limit - existing.count,
    retryAfter: 0,
  }
}

/**
 * Best-effort client identity behind a proxy. Falls back to a shared bucket.
 *
 * The RIGHTMOST `x-forwarded-for` entry, not the leftmost. A proxy that appends
 * (nginx's `proxy_add_x_forwarded_for`, and most CDNs) puts the address it
 * actually observed at the end; everything to the left of it is whatever the
 * client chose to send. Keying on the leftmost entry let one header rotate the
 * bucket, which on the login route meant unlimited password guessing.
 *
 * Still best-effort — a caller with no proxy in front of it can send any header
 * at all — so anything that must not be brute-forced needs a second bucket
 * keyed on something the caller cannot pick. See the login route.
 */
export function clientKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const entries = forwarded
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean)
    if (entries.length > 0) return entries[entries.length - 1]!
  }
  return request.headers.get('x-real-ip') ?? 'unknown'
}
