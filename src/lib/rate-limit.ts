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

/** Best-effort client identity behind a proxy. Falls back to a shared bucket. */
export function clientKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]!.trim()
  return request.headers.get('x-real-ip') ?? 'unknown'
}
