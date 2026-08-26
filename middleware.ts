import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE, verifySession } from '@/lib/auth-edge'

/**
 * Guards everything under /admin.
 *
 * Only token verification happens here — the middleware runs on the Edge
 * runtime, where Node's crypto and `next/headers` are unavailable.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value)
  const isLoginRoute = pathname === '/admin/login' || pathname === '/api/admin/login'

  if (isLoginRoute) {
    if (session && pathname === '/admin/login') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return NextResponse.next()
  }

  if (session) return NextResponse.next()

  // API callers get a status they can act on; people get sent to the form.
  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Neautorizovano.' }, { status: 401 })
  }

  const loginUrl = new URL('/admin/login', request.url)
  if (pathname !== '/admin') loginUrl.searchParams.set('dalje', pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
