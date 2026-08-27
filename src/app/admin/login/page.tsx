import type { Metadata } from 'next'
import { Suspense } from 'react'
import { routes } from '@/config/site'
import { isAuthConfigured } from '@/lib/auth-edge'
import { Container } from '@/components/ui/section'
import { AdminLoginForm } from '@/components/admin/login-form'

/**
 * Rendered per request, never prerendered.
 *
 * `isAuthConfigured()` reads AUTH_SECRET / ADMIN_EMAIL / ADMIN_PASSWORD_HASH,
 * and the form disables its fields when it is false. Statically prerendered,
 * that boolean is frozen from whatever the build machine had — and CI builds
 * with no admin variables at all, which would ship a login page nobody can type
 * into even though the route behind it works.
 */
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Prijava',
  description: 'Prijava za tim koji održava sadržaj sajta.',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  // Explicitly its own, not the layout's `/`. A noindex page that canonicalises
  // to a different URL is the one combination that can pass its signals on to
  // the canonical target — here, the homepage.
  alternates: { canonical: routes.adminLogin },
  openGraph: undefined,
  twitter: undefined,
}

export default function AdminLoginPage() {
  return (
    <section className="grid min-h-[80svh] place-items-center py-32">
      <Container size="narrow" className="max-w-md">
        <Suspense
          fallback={
            <div className="h-96 animate-pulse rounded-5xl border border-line bg-elevated" />
          }
        >
          <AdminLoginForm configured={isAuthConfigured()} />
        </Suspense>
      </Container>
    </section>
  )
}
