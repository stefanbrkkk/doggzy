import { NextResponse } from 'next/server'
import { isAuthConfigured } from '@/lib/auth-edge'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Liveness probe plus a configuration read-out.
 *
 * Reports whether the optional integrations are wired without ever echoing a
 * secret — booleans only.
 */
export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      time: new Date().toISOString(),
      config: {
        adminAuth: isAuthConfigured(),
        emailDelivery: Boolean(process.env.RESEND_API_KEY && process.env.NOTIFY_TO),
        siteUrl: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
      },
    },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
