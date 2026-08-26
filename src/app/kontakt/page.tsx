import type { Metadata } from 'next'
import { Mail, MapPin, Siren } from 'lucide-react'
import Link from 'next/link'
import { routes, site } from '@/config/site'
import { Container, Eyebrow } from '@/components/ui/section'
import { Reveal } from '@/components/motion'
import { ContactForm } from '@/components/contact/contact-form'

export const metadata: Metadata = {
  title: 'Kontakt',
  description:
    'Piši nam — za saradnju, pitanja o donacijama ili ako vodiš sklonište ili ambulantu.',
  alternates: { canonical: routes.contact },
}

export default function ContactPage() {
  return (
    <section className="pb-section pt-36 sm:pt-44">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div>
            <Reveal direction="up" amount={0.4}>
              <Eyebrow>Kontakt</Eyebrow>
            </Reveal>
            <Reveal direction="up" delay={0.06}>
              <h1 className="mt-5 text-display text-ink">Piši nam</h1>
            </Reveal>
            <Reveal direction="up" delay={0.12}>
              <p className="mt-6 max-w-md text-lead text-ink-muted">
                Odgovaramo u roku od dva radna dana. Ako je u pitanju pas u nevolji, ne piši ovde —
                pošalji prijavu, ide odmah dežurnom.
              </p>
            </Reveal>

            <Reveal direction="up" delay={0.18}>
              <Link
                href={routes.report}
                className="mt-8 flex items-start gap-3 rounded-3xl border border-critical/25 bg-critical/8 p-5 transition-colors hover:border-critical/40"
              >
                <Siren className="mt-0.5 h-5 w-5 shrink-0 text-critical" aria-hidden="true" />
                <span className="text-sm leading-relaxed text-ink">
                  <strong className="font-medium">Pas u nevolji?</strong> Idi na prijavu — traje
                  minut i ne prolazi kroz ovo sanduče.
                </span>
              </Link>
            </Reveal>

            <dl className="mt-12 space-y-6">
              <Reveal direction="up" delay={0.22}>
                <div className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-line bg-elevated text-brand">
                    <Mail className="h-[18px] w-[18px]" aria-hidden="true" />
                  </span>
                  <div>
                    <dt className="text-sm font-medium text-ink">Email</dt>
                    <dd className="mt-1">
                      <a
                        href={`mailto:${site.email}`}
                        className="text-sm text-ink-muted transition-colors hover:text-brand-text"
                      >
                        {site.email}
                      </a>
                    </dd>
                  </div>
                </div>
              </Reveal>

              <Reveal direction="up" delay={0.26}>
                <div className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-line bg-elevated text-brand">
                    <MapPin className="h-[18px] w-[18px]" aria-hidden="true" />
                  </span>
                  <div>
                    <dt className="text-sm font-medium text-ink">Gde smo</dt>
                    <dd className="mt-1 text-sm text-ink-muted">{site.city}</dd>
                  </div>
                </div>
              </Reveal>
            </dl>
          </div>

          <Reveal direction="up" delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
