import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createSession, sessionCookieOptions, verifyPassword } from '@/lib/auth'
import { isAuthConfigured } from '@/lib/auth-edge'
import { clientKey, rateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'

const loginSchema = z.object({
  // Every constraint carries its own Serbian message: the handler returns
  // `issues[0].message` verbatim and the form renders it, so a rule without one
  // put Zod's English default in front of the visitor.
  email: z
    .string({ error: 'Upiši email.' })
    .trim()
    .email('Upiši ispravan email.')
    .max(120, 'Email je predugačak.'),
  password: z
    .string({ error: 'Upiši lozinku.' })
    .min(1, 'Upiši lozinku.')
    .max(200, 'Lozinka je predugačka.'),
})

/** One message for every rejection: never reveal which half was wrong. */
const INVALID = 'Pogrešan email ili lozinka.'

export async function POST(request: Request) {
  if (!isAuthConfigured()) {
    return NextResponse.json(
      {
        error:
          'Prijava nije podešena. Postavi AUTH_SECRET, ADMIN_EMAIL i ADMIN_PASSWORD_HASH u okruženju.',
      },
      { status: 503 },
    )
  }

  // Eight, not five: a shared office IP burns through a tighter budget on
  // ordinary typos, and the lockout then looks like an outage.
  const limit = rateLimit(`admin-login:${clientKey(request)}`, 8, 15 * 60 * 1000)
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Previše pokušaja. Sačekaj pa probaj ponovo.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
    )
  }

  let json: unknown
  try {
    json = await request.json()
  } catch {
    return NextResponse.json({ error: 'Neispravan zahtev.' }, { status: 400 })
  }

  const parsed = loginSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? INVALID }, { status: 422 })
  }

  const email = parsed.data.email.toLowerCase()

  // A second bucket, keyed on the account rather than on the caller. The IP
  // bucket above is best-effort by construction — `x-forwarded-for` is a header
  // — so on its own it left password guessing unlimited to anyone willing to
  // change one line of a request. This one cannot be rotated: there is a single
  // admin credential, and guessing it means hitting this key.
  const accountLimit = rateLimit(`admin-login-acct:${email}`, 8, 15 * 60 * 1000)
  if (!accountLimit.allowed) {
    return NextResponse.json(
      { error: 'Previše pokušaja. Sačekaj pa probaj ponovo.' },
      { status: 429, headers: { 'Retry-After': String(accountLimit.retryAfter) } },
    )
  }
  const expectedEmail = (process.env.ADMIN_EMAIL ?? '').toLowerCase()
  const storedHash = process.env.ADMIN_PASSWORD_HASH ?? ''

  // Always run the hash comparison, even when the email is wrong, so response
  // time does not reveal whether the account exists.
  const passwordOk = await verifyPassword(parsed.data.password, storedHash)

  if (email !== expectedEmail || !passwordOk) {
    return NextResponse.json({ error: INVALID, remaining: limit.remaining }, { status: 401 })
  }

  const token = await createSession(email)
  const response = NextResponse.json({ ok: true })
  response.cookies.set({ ...sessionCookieOptions(), value: token })
  return response
}
