import type { Metadata } from 'next'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { routes } from '@/config/site'
import { Container } from '@/components/ui/section'
import { buttonStyles } from '@/components/ui/button'

/**
 * Its own metadata, not the layout's.
 *
 * Without this the 404 inherited the homepage title, description, whole social
 * card and `canonical: '/'` — declaring itself a duplicate of the homepage —
 * while Next's own `noindex` sat next to an inherited `googlebot: index,
 * follow`, which is the more specific of the two.
 */
export const metadata: Metadata = {
  title: 'Stranica ne postoji',
  description: 'Traženi link ne postoji na ovom sajtu.',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  alternates: { canonical: undefined },
  openGraph: undefined,
  twitter: undefined,
}

export default function NotFound() {
  return (
    <section className="grid min-h-[70svh] place-items-center py-32">
      <Container size="narrow" className="text-center">
        <p data-numeric className="text-hero leading-none text-gradient">
          404
        </p>
        <h1 className="mt-6 text-title text-ink">Ova stranica ne postoji</h1>
        <p className="mx-auto mt-5 max-w-md text-lead text-ink-muted">
          Možda je link zastareo, a možda smo je premestili dok smo prepravljali sajt.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href={routes.home} className={cn(buttonStyles({ size: 'lg' }))}>
            Nazad na početnu
          </Link>
          <Link
            href={routes.report}
            className={cn(buttonStyles({ variant: 'secondary', size: 'lg' }))}
          >
            Prijavi psa
          </Link>
        </div>
      </Container>
    </section>
  )
}
