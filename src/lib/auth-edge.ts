import { jwtVerify } from 'jose'

/**
 * Token verification only.
 *
 * Kept free of `next/headers`, `node:crypto` and anything else Node-only,
 * because the middleware runs on the Edge runtime. The previous implementation
 * imported the full auth module into middleware, which pulled in `cookies()`
 * and made every admin request fail before it reached a handler.
 */

export const SESSION_COOKIE = 'doggzy_admin'

export interface AdminSession {
  sub: string
  role: 'admin'
}

function secretKey(): Uint8Array | null {
  const secret = process.env.AUTH_SECRET
  // A short secret is a configuration error, not a fallback to "no auth".
  if (!secret || secret.length < 32) return null
  return new TextEncoder().encode(secret)
}

export async function verifySession(token: string | undefined): Promise<AdminSession | null> {
  if (!token) return null

  const key = secretKey()
  if (!key) return null

  try {
    const { payload } = await jwtVerify(token, key, {
      issuer: 'doggzy',
      audience: 'doggzy-admin',
    })

    if (payload.role !== 'admin' || typeof payload.sub !== 'string') return null

    return { sub: payload.sub, role: 'admin' }
  } catch {
    // Expired, tampered with, or signed by a different secret.
    return null
  }
}

/** True when the deployment has enough configuration for admin login to work. */
export function isAuthConfigured(): boolean {
  return Boolean(
    process.env.AUTH_SECRET &&
      process.env.AUTH_SECRET.length >= 32 &&
      process.env.ADMIN_EMAIL &&
      process.env.ADMIN_PASSWORD_HASH,
  )
}
