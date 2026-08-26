import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Building2, HandHeart, Stethoscope } from 'lucide-react'
import { cn } from '@/lib/utils'
import { routes, site } from '@/config/site'
import { Container, Eyebrow, SectionHeader } from '@/components/ui/section'
import { buttonStyles } from '@/components/ui/button'
import { Reveal } from '@/components/motion'
import { Faq } from '@/components/ui/faq'

export const metadata: Metadata = {
  title: 'O nama',
  description:
    'Ko smo, šta radimo, dokle smo stigli i šta još ne umemo. Bez zaokruživanja i bez izmišljenih brojeva.',
  alternates: { canonical: routes.about },
}

const PARTNERS = [
  {
    icon: Building2,
    title: 'Skloništa i udruženja',
    body: 'Vode pse na terenu. Od nas dobijaju sredstva, vidljivost i obavezu da objave šta je urađeno.',
  },
  {
    icon: Stethoscope,
    title: 'Veterinari',
    body: 'Leče i potpisuju nalaze. Njihova potvrda je ono što unos u dnevniku čini potvrđenim.',
  },
  {
    icon: HandHeart,
    title: 'Ljudi',
    body: 'Prijavljuju, doniraju, udomljavaju i kupuju. Bez njih ostale dve strane nemaju od čega da rade.',
  },
]

const TIMELINE = [
  {
    period: 'Faza 1 — sada',
    title: 'Beograd, Novi Sad, Niš, Kragujevac, Subotica',
    body: 'Prijave, evidencija pasa i javni dnevnik. Prvi krug partnerskih skloništa i ambulanti.',
    state: 'U toku',
  },
  {
    period: 'Faza 2 — u toku',
    title: 'Naplata i mesečni izveštaj',
    body: 'Prodavnica i starateljski nivoi već stoje na sajtu. Ostaje da povežemo naplatu i da izveštaj o svakom psu stiže automatski, umesto na zahtev.',
    state: 'U toku',
  },
  {
    period: 'Faza 3',
    title: 'Baza znanja i mreža ambulanti',
    body: 'Vodiči za udomitelje i pretraživ spisak veterinara po gradovima, sa cenama osnovnih usluga.',
    state: 'Planirano',
  },
]

const FAQ_ITEMS = [
  {
    question: 'Koliko dugo postojite?',
    answer:
      'Kratko. Doggzy je u ranoj fazi i to je razlog zašto na sajtu nema velikih brojeva — nemamo ih. Ono što imamo je javni dnevnik od prvog dana.',
  },
  {
    question: 'Da li ste registrovano udruženje?',
    answer:
      'Registracija je u toku. Broj računa na stranici za donacije je zato još uvek primer — piše to iznad samog dugmeta, i molimo te da nam pišeš pre uplate da potvrdimo aktuelne podatke.',
  },
  {
    question: 'Da li imate sopstveno sklonište?',
    answer:
      'Nemamo i za sada ga ne planiramo. Radimo sa postojećim skloništima i hraniteljskim porodicama, jer je kapacitet koji već postoji nedovoljno finansiran, a ne nepostojeći.',
  },
  {
    question: 'Kako mogu da se uključim?',
    answer:
      'Ako vodiš sklonište ili ambulantu, piši nam — tražimo partnere za prvi krug. Ako si pojedinac, najkorisnije je da prijaviš psa kad ga vidiš i da podeliš aktivne potrage.',
  },
]

export default function AboutPage() {
  return (
    <>
      <section className="relative isolate grain overflow-hidden pb-16 pt-36 sm:pt-44">
        <div
          aria-hidden="true"
          data-decor
          className="pointer-events-none absolute inset-x-0 -top-32 -z-10 h-[32rem] bg-[radial-gradient(55%_60%_at_50%_0%,var(--wash-warm),transparent_70%)] opacity-[var(--wash-opacity)]"
        />

        {/* The narrow container, matching the prose sections below. The hero
            used to sit in the default one, so the page had two different left
            margins 192px apart with nothing explaining the step. */}
        <Container size="narrow">
          <div>
            <Reveal direction="up" amount={0.4}>
              <Eyebrow>O nama</Eyebrow>
            </Reveal>
            <Reveal direction="up" delay={0.06}>
              <h1 className="mt-5 text-display text-ink">
                Mala organizacija sa <span className="text-gradient">jednim pravilom</span>
              </h1>
            </Reveal>
            <Reveal direction="up" delay={0.12}>
              <p className="mt-6 text-lead text-ink-muted">
                Ako se ne može proveriti, ne objavljujemo to kao činjenicu. To pravilo je razlog
                zašto na ovom sajtu nema ni jednog broja koji ne stoji negde u dnevniku.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container size="narrow">
          <Reveal className="space-y-5">
            <h2 className="text-headline text-ink">Zašto ovako</h2>
            <p className="text-base leading-[1.8] text-ink-muted">
              Ljudi u Srbiji doniraju psima. Ono što najčešće ne dobiju je odgovor na pitanje šta je
              tačno urađeno tim novcem. Ne zato što neko krije — nego zato što je vođenje evidencije
              posao za koji mala udruženja nemaju ni vremena ni alat.
            </p>
            <p className="text-base leading-[1.8] text-ink-muted">
              Doggzy je pokušaj da se taj posao odradi jednom, kako treba, i da bude dostupan svima
              koji rade sa psima. Prijava, evidencija psa, trošak, dokaz, izveštaj donatoru — jedan
              tok umesto pet sveski i tri grupe na mrežama.
            </p>
            <p className="text-base leading-[1.8] text-ink-muted">
              Prodavnica postoji iz istog razloga: donacije variraju iz meseca u mesec, a lečenje ne
              čeka. Profit od prodaje ulazi u isti dnevnik kao i svaka donacija.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <SectionHeader eyebrow="Ko sve učestvuje" title="Tri strane, jedan dnevnik" />
          <ul className="mt-12 grid gap-px overflow-hidden rounded-4xl border border-line bg-rule sm:grid-cols-3">
            {PARTNERS.map((partner, index) => {
              const Icon = partner.icon
              return (
                <li key={partner.title} className="bg-elevated p-7">
                  <Reveal delay={index * 0.06}>
                    <Icon className="h-5 w-5 text-brand" aria-hidden="true" />
                    <h3 className="mt-4 text-headline text-ink">{partner.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">{partner.body}</p>
                  </Reveal>
                </li>
              )
            })}
          </ul>
        </Container>
      </section>

      <section className="py-16">
        <Container size="narrow">
          <SectionHeader eyebrow="Dokle smo stigli" title="Plan, bez ulepšavanja" />
          <ol className="mt-12 space-y-px overflow-hidden rounded-4xl border border-line bg-line">
            {TIMELINE.map((phase, index) => (
              <li key={phase.title} className="bg-elevated p-7">
                <Reveal delay={index * 0.06}>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-2xs uppercase tracking-[0.2em] text-ink-subtle">
                      {phase.period}
                    </span>
                    <span className="rounded-full border border-line px-2.5 py-0.5 text-2xs text-ink-muted">
                      {phase.state}
                    </span>
                  </div>
                  <h3 className="mt-3 text-headline text-ink">{phase.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{phase.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="pb-section pt-16">
        <Container size="narrow">
          <SectionHeader eyebrow="Pitanja" title="Ono što nas najčešće pitaju" />
          <div className="mt-10">
            <Faq items={FAQ_ITEMS} />
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <Link href={routes.contact} className={cn(buttonStyles({ size: 'lg' }))}>
              Javi nam se
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={routes.transparency}
              className={cn(buttonStyles({ variant: 'secondary', size: 'lg' }))}
            >
              Pogledaj dnevnik
            </Link>
          </div>

          <p className="mt-8 text-sm text-ink-subtle">
            {site.city} ·{' '}
            <a
              href={`mailto:${site.email}`}
              className="text-brand-text underline underline-offset-4"
            >
              {site.email}
            </a>
          </p>
        </Container>
      </section>
    </>
  )
}
