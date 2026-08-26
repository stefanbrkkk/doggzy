import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export const runtime = 'nodejs'

export async function GET() {
  const session = await getSession()

  // The middleware already rejects anonymous callers; this is defence in depth.
  if (!session) {
    return NextResponse.json({ error: 'Neautorizovano.' }, { status: 401 })
  }

  return NextResponse.json({ email: session.sub, role: session.role })
}
