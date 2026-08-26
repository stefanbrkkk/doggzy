import type { Metadata } from 'next'
import Link from 'next/link'
import { BadgeCheck, CircleAlert, FileText, Scale } from 'lucide-react'
import { cn } from '@/lib/utils'
import { routes } from '@/config/site'
import { dogs } from '@/content/dogs'
import { Container, Eyebrow, SectionHeader } from '@/components/ui/section'
import { buttonStyles } from '@/components/ui/button'
import { CountUp, Reveal } from '@/components/motion'
import { LedgerTable } from '@/components/transparency/ledger-table'

export const metadata: Metadata = {
  title: 'Transparentnost',
  description:
    'Svaki trošak, datum i dokaz na jednom mestu. Uključujući ono što još nije potvrđeno dokumentom.',
  alternates: { canonical: routes.transparency },
}

const PRINCIPLES = [
  {
    icon: FileText,
    title: 'Stavka, ne kategorija',
    body: 'Ne objavljujemo „30% na veterinu”. Objavljujemo koji pregled, kog dana, po kojoj ceni.',
  },
  {
    icon: BadgeCheck,
    title: 'Dokaz uz iznos',
    body: 'Uz trošak ide račun ili nalaz. Bez toga unos ostaje označen kao nepotvrđen.',
  },
  {
    icon: CircleAlert,
    title: 'I ono što ne valja',
    body: 'Kad nešto ne prođe kako smo planirali, to ostaje na stranici. Ne brišemo istoriju.',
  },
  {
    icon: Scale,
    title: 'Bez naknadnih izmena',
    body: 'Unosi se ne prepravljaju. Ispravka se dodaje kao novi unos sa svojim datumom.',
  },
]

export default function TransparencyPage() {
  const allEvents = dogs.flatMap((dog) =>
    dog.timeline.map((event) => ({ ...event, dogName: dog.name, dogSlug: dog.slug })),
  )

  const spent = allEvents
    .filter((event) => event.type !== 'donacija' && typeof event.amount === 'number')
    .reduce((sum, event) => sum + (event.amount ?? 0), 0)

  const raised = allEvents
    .filter((event) => event.type === 'donacija')
    .reduce((sum, event) => sum + (event.amount ?? 0), 0)

  const verifiedShare = Math.round(
    (allEvents.filter((event) => event.verified).length / allEvents.length) * 100,
  )

  return (
    <>
      <section className="relative isolate grain overflow-hidden pb-16 pt-36 sm:pt-44">
        <div
          aria-hidden="true"
          data-decor
          className="pointer-events-none absolute inset-x-0 -top-32 -z-10 h-[32rem] bg-[radial-gradient(55%_60%_at_50%_0%,var(--wash-cool),transparent_70%)] opacity-[var(--wash-opacity)]"
        />

        <Container>
          <div className="max-w-3xl">
            <Reveal direction="up" amount={0.4}>
              <Eyebrow>Transparentnost</Eyebrow>
            </Reveal>
            <Reveal direction="up" delay={0.06}>
              <h1 className="mt-5 text-display text-ink">
                Ceo dnevnik, <span className="text-gradient">bez uređivanja</span>
              </h1>
            </Reveal>
            <Reveal direction="up" delay={0.12}>
              <p className="mt-6 text-lead text-ink-muted">
                Ovo je zbir svih unosa sa stranica pojedinačnih pasa. Isti podaci, na jednom mestu,
                uključujući one koje još nismo potkrepili dokumentom.
              </p>
            </Reveal>
          </div>

          {/* `grid-rows-subgrid` on the cells, so the three labels and the three
              values share tracks. Without it, "Prikupljeno donacijama" wraps to
              two lines in a narrow band of widths and drops its number 16px
              below the two beside it. */}
          <dl className="mt-14 grid gap-px overflow-hidden rounded-4xl border border-line bg-rule sm:grid-cols-3 sm:grid-rows-[auto_auto]">
            <Stat label="Potrošeno na negu" value={<CountUp value={spent} suffix=" RSD" />} />
            <Stat label="Prikupljeno donacijama" value={<CountUp value={raised} suffix=" RSD" />} />
            <Stat
              label="Unosa sa dokazom"
              value={<CountUp value={verifiedShare} suffix="%" grouped={false} />}
            />
          </dl>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          {/* Same subgrid as the stat strip above: one title wraps and one does
              not in every row, so without shared tracks the bodies sit 30px
              apart. */}
          <ul className="grid gap-px overflow-hidden rounded-4xl border border-line bg-rule sm:grid-cols-2 sm:grid-rows-[repeat(6,auto)]">
            {PRINCIPLES.map((principle, index) => {
              const Icon = principle.icon
              return (
                <li
                  key={principle.title}
                  className="grid bg-elevated p-7 sm:row-span-3 sm:grid-rows-subgrid"
                >
                  <Reveal delay={index * 0.05} className="grid sm:row-span-3 sm:grid-rows-subgrid">
                    <Icon className="h-5 w-5 text-brand" aria-hidden="true" />
                    <h2 className="mt-4 text-headline text-ink">{principle.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">{principle.body}</p>
                  </Reveal>
                </li>
              )
            })}
          </ul>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <SectionHeader
            eyebrow="Dnevnik"
            title="Svaki unos, hronološki"
            lead="Klikom na ime psa otvaraš njegovu stranicu sa celim kontekstom."
            action={
              <Link
                href={routes.dogs}
                className={cn(buttonStyles({ variant: 'secondary', size: 'md' }))}
              >
                Svi psi
              </Link>
            }
          />
          <div className="mt-12">
            <LedgerTable events={allEvents} />
          </div>
        </Container>
      </section>

      <section className="pb-section">
        <Container size="narrow">
          <Reveal>
            <div className="rounded-4xl border border-line bg-elevated p-7 sm:p-9">
              <h2 className="text-headline text-ink">Šta ovde još ne piše</h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                Doggzy je na početku. Nemamo revizorski izveštaj, nemamo godišnji finansijski
                pregled i broj partnerskih skloništa je jednocifren. Sve to ćemo objaviti čim bude
                postojalo — a dok ne postoji, nećemo se pretvarati da postoji.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                Iznosi na ovoj stranici odnose se na pse koji su trenutno u evidenciji. Kako se
                mreža širi, ista pravila važe i za nove unose:{' '}
                <strong className="text-ink">stavka, datum, iznos, dokaz</strong>.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid gap-2 bg-elevated p-7 sm:row-span-2 sm:grid-rows-subgrid">
      <dt className="text-2xs uppercase tracking-widest text-ink-subtle">{label}</dt>
      <dd data-numeric className="text-headline text-ink">
        {value}
      </dd>
    </div>
  )
}
