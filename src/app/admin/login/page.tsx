import type { Metadata } from 'next'
import { Suspense } from 'react'
import { isAuthConfigured } from '@/lib/auth-edge'
import { Container } from '@/components/ui/section'
import { AdminLoginForm } from '@/components/admin/login-form'

export const metadata: Metadata = {
  title: 'Prijava',
  robots: { index: false, follow: false },
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
