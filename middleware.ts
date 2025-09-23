import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'

// Admin routes that require authentication
const adminRoutes = [
  '/admin',
  '/api/admin',
]

// Admin routes that should redirect to login if not authenticated
const adminPages = [
  '/admin/dashboard',
  '/admin/stories',
  '/admin/dogs',
  '/admin/media',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for static files and API routes (except admin APIs)
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/forms/') ||
    pathname.startsWith('/api/health/') ||
    pathname.startsWith('/api/placeholder/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }
  
  // Handle admin routes
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
  const isAdminPage = adminPages.some(page => pathname.startsWith(page)) || pathname === '/admin'
  
  if (isAdminRoute || isAdminPage) {
    const authenticated = await isAuthenticated(request)
    
    // If accessing /admin/login and already authenticated, redirect to dashboard
    if (pathname === '/admin/login' && authenticated) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
    
    // If not authenticated and not on login page, redirect to login
    if (!authenticated && pathname !== '/admin/login') {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    // If authenticated and accessing /admin root, redirect to dashboard
    if (authenticated && pathname === '/admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
}
