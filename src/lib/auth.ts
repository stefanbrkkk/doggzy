import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import { SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { SESSION_COOKIE, verifySession, type AdminSession } from './auth-edge'

/**
 * Node-runtime half of admin auth: password hashing, sign-in and the session
 * cookie. Never import this from middleware — see auth-edge.ts.
 */

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>

const KEY_LENGTH = 64
const SESSION_SECONDS = 8 * 60 * 60

/**
 * Produces `scrypt:<saltHex>:<hashHex>`. Used by `npm run admin:hash`.
 *
 * The separator is a colon, not the conventional `$`: dotenv expands `$NAME`
 * inside .env values, so a `$`-delimited hash silently loads as the literal
 * string "scrypt" and every login fails with no indication why.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16)
  const derived = await scryptAsync(password, salt, KEY_LENGTH)
  return `scrypt:${salt.toString('hex')}:${derived.toString('hex')}`
}

/**
 * Constant-time password check.
 *
 * Returns false for a malformed stored hash rather than throwing, so a
 * misconfigured deployment fails closed instead of 500-ing on every attempt.
 */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split(':')
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false

  const [, saltHex, hashHex] = parts
  if (!/^[0-9a-f]+$/i.test(saltHex) || !/^[0-9a-f]+$/i.test(hashHex)) return false

  const expected = Buffer.from(hashHex, 'hex')
  if (expected.length !== KEY_LENGTH) return false

  const derived = await scryptAsync(password, Buffer.from(saltHex, 'hex'), KEY_LENGTH)
  return timingSafeEqual(derived, expected)
}

export async function createSession(email: string): Promise<string> {
  const secret = process.env.AUTH_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('AUTH_SECRET nije postavljen ili je kraći od 32 znaka.')
  }

  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(email)
    .setIssuer('doggzy')
    .setAudience('doggzy-admin')
    .setIssuedAt()
    .setExpirationTime(`${SESSION_SECONDS}s`)
    .sign(new TextEncoder().encode(secret))
}

export function sessionCookieOptions() {
  return {
    name: SESSION_COOKIE,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_SECONDS,
  }
}

/** Reads the current admin session inside a server component or route handler. */
export async function getSession(): Promise<AdminSession | null> {
  const store = await cookies()
  return verifySession(store.get(SESSION_COOKIE)?.value)
}
