'use client'

import Link from 'next/link'
import { ArrowRight, Heart, Siren } from 'lucide-react'
import { cn } from '@/lib/utils'
import { routes } from '@/config/site'
import { buttonStyles } from '@/components/ui/button'
import { Container } from '@/components/ui/section'
import { Magnetic, Reveal, Spotlight } from '@/components/motion'

export function ClosingCta() {
  return (
    <section className="pb-8 pt-16">
      <Container>
        <Spotlight size={520} className="rounded-6xl">
          <div className="relative overflow-hidden rounded-6xl border border-line bg-elevated px-6 py-20 text-center grain sm:px-14">
            <div
              aria-hidden="true"
              data-decor
              className="pointer-events-none absolute inset-x-0 -top-24 h-64 bg-[radial-gradient(60%_100%_at_50%_100%,var(--wash-warm),transparent_70%)] opacity-[var(--wash-opacity)]"
            />

            <Reveal>
              <p className="text-2xs uppercase tracking-[0.24em] text-ink-subtle">
                Ako si dovde stigao
              </p>
            </Reveal>

            <Reveal delay={0.06}>
              <h2 className="mx-auto mt-5 max-w-3xl text-display text-ink">
                Najbrža stvar koju možeš da uradiš je{' '}
                <span className="text-gradient">jedna prijava</span>
              </h2>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mx-auto mt-6 max-w-xl text-lead text-ink-muted">
                Traje minut, ne traži nalog, i ide direktno ljudima koji izlaze na teren.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <Magnetic strength={16}>
                  <Link
                    href={routes.report}
                    className={cn(buttonStyles({ size: 'xl' }), 'group/cta')}
                  >
                    <Siren className="h-5 w-5" />
                    Prijavi psa
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 ease-out-expo group-hover/cta:translate-x-1" />
                  </Link>
                </Magnetic>
                <Magnetic strength={12}>
                  <Link
                    href={routes.donate}
                    className={cn(buttonStyles({ variant: 'outline', size: 'xl' }))}
                  >
                    <Heart className="h-5 w-5" />
                    Doniraj
                  </Link>
                </Magnetic>
              </div>
            </Reveal>
          </div>
        </Spotlight>
      </Container>
    </section>
  )
}
