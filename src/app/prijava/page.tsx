import type { Metadata } from 'next'
import Link from 'next/link'
import { AlertTriangle, Clock, Eye, PhoneCall, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { routes, site } from '@/config/site'
import { dogs } from '@/content/dogs'
import { Container, Eyebrow, SectionHeader } from '@/components/ui/section'
import { buttonStyles } from '@/components/ui/button'
import { Reveal } from '@/components/motion'
import { DogCard } from '@/components/dogs/dog-card'
import { ReportPanel } from '@/components/phone/report-panel'
import { Faq } from '@/components/ui/faq'

export const metadata: Metadata = {
  title: 'Prijavi psa',
  description:
    'Prijavi nestalog, pronađenog ili ugroženog psa. Prijava traje minut, ne traži nalog i ide direktno ekipi u tvom gradu.',
  alternates: { canonical: routes.report },
}

const AFTER = [
  {
    icon: Clock,
    title: 'Za nekoliko minuta',
    body: 'Prijava stiže dežurnom u tvom gradu. Hitne prijave idu na vrh reda.',
  },
  {
    icon: PhoneCall,
    title: 'U roku od 2 sata',
    body: 'Javljamo se na broj ili email koji si ostavio, da potvrdimo detalje.',
  },
  {
    icon: Eye,
    title: 'Isti dan',
    body: 'Ako je pas nestao, objavljujemo potragu. Ako je ugrožen, izlazi ekipa.',
  },
]

const HELPS = [
  'Tačna adresa ili raskrsnica — bolje nego naziv naselja',
  'Vreme kad si psa poslednji put video',
  'Fotografija, čak i mutna',
  'Da li ima ogrlicu i kakve je boje',
  'Da li prilazi ljudima ili beži',
]

const FAQ_ITEMS = [
  {
    question: 'Da li mi treba nalog?',
    answer:
      'Ne. Prijava se šalje bez registracije. Ostavljaš samo kontakt na koji možemo da se javimo.',
  },
  {
    question: 'Ko vidi moj broj telefona?',
    answer:
      'Samo naš tim i sklonište koje preuzima slučaj. Javno se objavljuju opis i lokacija; fotografija za sada ostaje kod nas, a tvoj kontakt nikada ne izlazi u javnost.',
  },
  {
    question: 'Šta ako nisam siguran da je pas napušten?',
    answer:
      'Prijavi svejedno. Bolje je da proverimo i ispadne da pas ima vlasnika, nego da niko ne ode.',
  },
  {
    question: 'Pas je teško povređen upravo sada.',
    answer:
      'Pošalji prijavu i označi je kao „pas je u opasnosti”, pa odmah pozovi i komunalnu zoohigijenu svog grada. Za Beograd je to 011 2467 111, a opšti broj za hitne službe je 112.',
  },
  {
    question: 'Mogu li da prijavim psa koji nije u Srbiji?',
    answer:
      'Trenutno radimo u Beogradu, Novom Sadu, Nišu, Kragujevcu i Subotici. Prijave iz drugih gradova primamo i prosleđujemo lokalnim udruženjima, ali ne možemo da garantujemo izlazak ekipe.',
  },
]

export default function ReportPage() {
  const missing = dogs.filter((dog) => dog.status === 'nestao')

  return (
    <>
      <section className="relative isolate grain overflow-hidden pb-20 pt-36 sm:pt-44">
        <div
          aria-hidden="true"
          data-decor
          className="pointer-events-none absolute inset-x-0 -top-32 -z-10 h-[34rem] bg-[radial-gradient(60%_60%_at_50%_0%,var(--wash-warm),transparent_70%)] opacity-[var(--wash-opacity)]"
        />

        <Container>
          <div className="grid gap-16 lg:grid-cols-[1fr_23rem] lg:items-start lg:gap-20">
            <div className="max-w-xl">
              <Reveal direction="up" amount={0.4}>
                <Eyebrow>Prijava</Eyebrow>
              </Reveal>
              <Reveal direction="up" delay={0.06}>
                <h1 className="mt-5 text-display text-ink">
                  Prijavi psa.
                  <span className="mt-1 block text-gradient">Ostalo je na nama.</span>
                </h1>
              </Reveal>
              <Reveal direction="up" delay={0.12}>
                <p className="mt-6 text-lead text-ink-muted">
                  Nestao, pronađen ili u nevolji — pet koraka, bez naloga. Prijava ide direktno
                  ljudima koji izlaze na teren.
                </p>
              </Reveal>

              <Reveal direction="up" delay={0.18}>
                <div className="mt-10 rounded-3xl border border-critical/25 bg-critical/8 p-5">
                  <p className="flex items-start gap-3 text-sm leading-relaxed text-ink">
                    <AlertTriangle
                      className="mt-0.5 h-5 w-5 shrink-0 text-critical"
                      aria-hidden="true"
                    />
                    <span>
                      <strong className="font-medium">Ako je pas u neposrednoj opasnosti</strong> —
                      na putu, teško povređen, u zatvorenom vozilu — pošalji prijavu i odmah pozovi
                      zoohigijenu svog grada ili 112.
                    </span>
                  </p>
                </div>
              </Reveal>

              <ol className="mt-12 space-y-7">
                {AFTER.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <li key={item.title}>
                      <Reveal direction="up" delay={0.06 * index}>
                        <div className="flex gap-4">
                          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-line bg-elevated text-brand">
                            <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                          </span>
                          <div>
                            <h2 className="text-sm font-medium text-ink">{item.title}</h2>
                            <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                              {item.body}
                            </p>
                          </div>
                        </div>
                      </Reveal>
                    </li>
                  )
                })}
              </ol>
            </div>

            <Reveal direction="up" delay={0.1} className="w-full justify-self-center">
              <ReportPanel />
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container size="narrow">
          <Reveal>
            <div className="rounded-4xl border border-line bg-elevated p-7 sm:p-9">
              <h2 className="flex items-center gap-2.5 text-headline text-ink">
                <ShieldCheck className="h-5 w-5 text-brand" aria-hidden="true" />
                Šta nam najviše pomaže
              </h2>
              <ul className="mt-6 space-y-3">
                {HELPS.map((help) => (
                  <li key={help} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand"
                    />
                    {help}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </Container>
      </section>

      {missing.length > 0 ? (
        <section className="py-20">
          <Container>
            <SectionHeader
              eyebrow="Aktivne potrage"
              title="Ovi psi se trenutno traže"
              lead="Ako si nekog od njih video, pošalji prijavu sa lokacijom i vremenom."
              action={
                <Link
                  href={routes.dogs}
                  className={cn(buttonStyles({ variant: 'secondary', size: 'md' }))}
                >
                  Svi psi
                </Link>
              }
            />
            <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {missing.map((dog) => (
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
          <SectionHeader eyebrow="Pitanja" title="Pre nego što pošalješ" />
          <div className="mt-10">
            <Faq items={FAQ_ITEMS} />
          </div>
          <p className="mt-10 text-sm text-ink-subtle">
            Nešto drugo?{' '}
            <a
              href={`mailto:${site.reportEmail}`}
              className="text-brand-text underline underline-offset-4"
            >
              {site.reportEmail}
            </a>
          </p>
        </Container>
      </section>
    </>
  )
}
