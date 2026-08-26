import type { Metadata } from 'next'
import Link from 'next/link'
import { FileCheck2, Receipt, Users } from 'lucide-react'
import { routes } from '@/config/site'
import { Container, Eyebrow, SectionHeader } from '@/components/ui/section'
import { Reveal } from '@/components/motion'
import { DonateForm } from '@/components/donate/donate-form'
import { Faq } from '@/components/ui/faq'
import { dogs } from '@/content/dogs'
import { DogCard } from '@/components/dogs/dog-card'

export const metadata: Metadata = {
  title: 'Doniraj',
  description:
    'Doniraj jednokratno ili mesečno. Svaka uplata dobija poziv na broj i upisuje se u javni dnevnik psa kojem je pomogla.',
  alternates: { canonical: routes.donate },
}

const PROMISES = [
  {
    icon: Receipt,
    title: 'Svaka uplata ima trag',
    body: 'Poziv na broj povezuje tvoju donaciju sa konkretnim unosom u dnevniku psa.',
  },
  {
    icon: FileCheck2,
    title: 'Račun ide uz unos',
    body: 'Uz svaki trošak stoji nalaz ili račun. Ono što nema dokaz označeno je kao nepotvrđeno.',
  },
  {
    icon: Users,
    title: 'Virtuelno starateljstvo',
    body: 'Mesečna podrška jednom psu, sa izveštajem o tome kako je mesec prošao.',
  },
]

const FAQ_ITEMS = [
  {
    question: 'Da li mogu da biram kome ide novac?',
    answer:
      'Da. Možeš da doniraš „tamo gde je najpotrebnije” ili da izabereš konkretnog psa. Ako izabereš psa čije je lečenje u međuvremenu pokriveno, javljamo ti se pre nego što novac preusmerimo.',
  },
  {
    question: 'Šta ako donacija premaši potrebe tog psa?',
    answer:
      'Višak ide u zajednički fond za hitne slučajeve i to zapisujemo u dnevnik tog psa, da se vidi gde je otišao.',
  },
  {
    question: 'Da li dobijam potvrdu?',
    answer:
      'Izvod iz banke je tvoja potvrda o uplati. Ako ti treba potvrda od nas za poresku svrhu, piši nam i pošaljemo je.',
  },
  {
    question: 'Kako se odjavljujem sa mesečne donacije?',
    answer:
      'Mesečne donacije idu preko trajnog naloga u tvojoj banci, pa ga gasiš sam, bez pitanja i bez našeg posredovanja.',
  },
]

export default function DonatePage() {
  const needy = dogs.filter((dog) => dog.needs.some((need) => need.covered < need.cost)).slice(0, 3)

  return (
    <>
      <section className="relative isolate grain overflow-hidden pb-16 pt-36 sm:pt-44">
        <div
          aria-hidden="true"
          data-decor
          className="pointer-events-none absolute inset-x-0 -top-32 -z-10 h-[32rem] bg-[radial-gradient(55%_60%_at_50%_0%,var(--wash-warm),transparent_70%)] opacity-[var(--wash-opacity)]"
        />

        <Container>
          <div className="grid gap-14 lg:grid-cols-[1fr_26rem] lg:items-start lg:gap-16">
            <div>
              <Reveal direction="up" amount={0.4}>
                <Eyebrow>Donacije</Eyebrow>
              </Reveal>
              <Reveal direction="up" delay={0.06}>
                <h1 className="mt-5 max-w-xl text-display text-ink">
                  Doniraj i <span className="text-gradient">proveri gde je otišlo</span>
                </h1>
              </Reveal>
              <Reveal direction="up" delay={0.12}>
                <p className="mt-6 max-w-xl text-lead text-ink-muted">
                  Svaka uplata dobija poziv na broj. Taj broj se pojavljuje u dnevniku psa kojem je
                  pomogla, pored računa koji je platila.
                </p>
              </Reveal>

              <ul className="mt-12 space-y-7">
                {PROMISES.map((promise, index) => {
                  const Icon = promise.icon
                  return (
                    <li key={promise.title}>
                      <Reveal direction="up" delay={0.06 * index}>
                        <div className="flex gap-4">
                          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-line bg-elevated text-brand">
                            <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                          </span>
                          <div>
                            <h2 className="text-sm font-medium text-ink">{promise.title}</h2>
                            <p className="mt-1 max-w-md text-sm leading-relaxed text-ink-muted">
                              {promise.body}
                            </p>
                          </div>
                        </div>
                      </Reveal>
                    </li>
                  )
                })}
              </ul>
            </div>

            <Reveal direction="up" delay={0.1}>
              <DonateForm />
            </Reveal>
          </div>
        </Container>
      </section>

      {needy.length > 0 ? (
        <section className="py-20">
          <Container>
            <SectionHeader
              eyebrow="Otvoreni troškovi"
              title="Kod ovih pasa lečenje još nije pokriveno"
              lead="Na svakoj stranici piše koliko nedostaje i za šta tačno."
            />
            <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {needy.map((dog) => (
                <li key={dog.id}>
                  <DogCard dog={dog} className="h-full" />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      <section className="py-20">
        <Container size="narrow">
          <SectionHeader eyebrow="Pitanja" title="Pre nego što doniraš" />
          <div className="mt-10">
            <Faq items={FAQ_ITEMS} />
          </div>
          <p className="mt-10 text-sm text-ink-subtle">
            Zanima te kompletna slika?{' '}
            <Link
              href={routes.transparency}
              className="text-brand-text underline underline-offset-4"
            >
              Pogledaj stranicu transparentnosti
            </Link>
            .
          </p>
        </Container>
      </section>
    </>
  )
}
