import { NextResponse } from 'next/server'
import { sessionCookieOptions } from '@/lib/auth'
import { rejectCrossOrigin } from '@/lib/request-limits'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const rejected = rejectCrossOrigin(request)
  if (rejected) return rejected

  const response = NextResponse.json({ ok: true })
  response.cookies.set({ ...sessionCookieOptions(), value: '', maxAge: 0 })
  return response
}
