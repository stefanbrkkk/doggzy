import type { Metadata } from 'next'
import { routes } from '@/config/site'
import { dogs } from '@/content/dogs'
import { Container, Eyebrow } from '@/components/ui/section'
import { Reveal } from '@/components/motion'
import { DogsBrowser } from '@/components/dogs/dogs-browser'

export const metadata: Metadata = {
  title: 'Psi',
  description:
    'Psi koji traže dom, koji su u lečenju i oni koji se trenutno traže. Svaki ima javnu stranicu sa troškovima i nalazima.',
  alternates: { canonical: routes.dogs },
}

export default function DogsPage() {
  return (
    <>
      <section className="relative isolate grain overflow-hidden pb-12 pt-36 sm:pt-44">
        <div
          aria-hidden="true"
          data-decor
          className="pointer-events-none absolute inset-x-0 -top-32 -z-10 h-[30rem] bg-[radial-gradient(55%_60%_at_50%_0%,var(--wash-warm),transparent_70%)] opacity-[var(--wash-opacity)]"
        />
        <Container>
          <div className="max-w-3xl">
            <Reveal direction="up" amount={0.4}>
              <Eyebrow>Psi</Eyebrow>
            </Reveal>
            <Reveal direction="up" delay={0.06}>
              <h1 className="mt-5 text-display text-ink">
                Svaki pas ima <span className="text-gradient">svoju stranicu</span>
              </h1>
            </Reveal>
            <Reveal direction="up" delay={0.12}>
              <p className="mt-6 text-lead text-ink-muted">
                Na njoj stoji sve: kad je stigao, šta mu je bilo, koliko je koštalo i ko je to
                platio. Ništa se ne briše kad se lečenje završi.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="pb-section">
        <Container>
          <DogsBrowser dogs={dogs} />
        </Container>
      </section>
    </>
  )
}
