import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE, verifySession } from '@/lib/auth-edge'

/**
 * Marks a response as depending on the session cookie.
 *
 * Every branch below decides from `SESSION_COOKIE`, and a bare
 * `NextResponse.redirect` goes out with no caching directives at all — so the
 * browser filed the pre-login 307 in its history entry and replayed it after
 * the session existed, dropping a logged-in admin back onto the login form.
 * With a longer history the replay deadlocks into ERR_TOO_MANY_REDIRECTS.
 */
function perSession(response: NextResponse): NextResponse {
  response.headers.set('Cache-Control', 'no-store, must-revalidate')
  response.headers.set('Vary', 'Cookie')
  return response
}

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
      return perSession(NextResponse.redirect(new URL('/admin', request.url)))
    }
    return perSession(NextResponse.next())
  }

  if (session) return perSession(NextResponse.next())

  // API callers get a status they can act on; people get sent to the form.
  if (pathname.startsWith('/api/')) {
    return perSession(NextResponse.json({ error: 'Neautorizovano.' }, { status: 401 }))
  }

  const loginUrl = new URL('/admin/login', request.url)
  if (pathname !== '/admin') loginUrl.searchParams.set('dalje', pathname)
  return perSession(NextResponse.redirect(loginUrl))
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
