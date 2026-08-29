import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Heart, MapPin, Siren } from 'lucide-react'
import { cn, formatDateGenitive, formatRsd } from '@/lib/utils'
import { pageMetadata } from '@/lib/metadata'
import { routes } from '@/config/site'
import { dogNeedTotals, dogs, getDog, statusLabel } from '@/content/dogs'
import { stories } from '@/content/stories'
import { Container } from '@/components/ui/section'
import { Badge } from '@/components/ui/badge'
import { buttonStyles } from '@/components/ui/button'
import { Reveal } from '@/components/motion'
import { DogArt } from '@/components/dogs/dog-art'
import { DogTimeline } from '@/components/dogs/dog-timeline'
import { NeedsProgress } from '@/components/dogs/needs-progress'
import { JsonLd } from '@/components/seo/json-ld'
import { breadcrumbSchema, dogSchema } from '@/lib/structured-data'

/**
 * Every slug is enumerable, so an unknown one is a real 404.
 *
 * Without this Next renders the unknown param on demand and serves the
 * `notFound()` page with status 200 and `s-maxage=31536000` — so a mistyped or
 * crawler-invented URL became an indexable page, pinned in the cache for a year.
 */
export const dynamicParams = false

export function generateStaticParams() {
  return dogs.map((dog) => ({ slug: dog.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const dog = getDog(slug)

  if (!dog) return { title: 'Pas nije pronađen' }

  return pageMetadata({
    title: `${dog.name} — ${statusLabel(dog.status, dog.sex)}`,
    description: dog.summary,
    path: routes.dog(dog.slug),
    type: 'article',
  })
}

export default async function DogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const dog = getDog(slug)

  if (!dog) notFound()

  const totals = dogNeedTotals(dog)
  const relatedStory = stories.find((story) => story.dogSlug === dog.slug)
  const isMissing = dog.status === 'nestao'
  /** Adopted, with nothing left to fund and no sponsorship tier to join. */
  const isClosed = !isMissing && dog.needs.length === 0 && dog.sponsorMonthly === 0

  return (
    <>
      <JsonLd
        data={[
          dogSchema(dog),
          breadcrumbSchema([
            { name: 'Psi', path: routes.dogs },
            { name: dog.name, path: routes.dog(dog.slug) },
          ]),
        ]}
      />

      <section className="pb-16 pt-32 sm:pt-40">
        <Container>
          <Link
            href={routes.dogs}
            className="inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            Svi psi
          </Link>

          <div className="mt-8 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 [&>*]:min-w-0">
            <Reveal direction="up">
              <div className="lg:sticky lg:top-28">
                <div className="overflow-hidden rounded-5xl border border-line">
                  <DogArt
                    dog={dog}
                    className="aspect-4/5 max-h-[55svh] w-full object-cover lg:max-h-none"
                  />
                </div>
              </div>
            </Reveal>

            {/* Capped through the 768-1023px band, where the grid is still one
                column and the prose ran to 130 characters per line. */}
            <div className="max-w-2xl space-y-8 lg:max-w-none">
              <Reveal direction="up" delay={0.06}>
                <div className="space-y-4">
                  <Badge
                    tone={
                      dog.status === 'nestao'
                        ? 'critical'
                        : dog.status === 'udomljen'
                          ? 'positive'
                          : dog.status === 'u-lecenju'
                            ? 'accent'
                            : 'brand'
                    }
                    size="sm"
                  >
                    {statusLabel(dog.status, dog.sex)}
                  </Badge>

                  <h1 className="text-display text-ink">{dog.name}</h1>
                  <p className="text-lead text-ink-muted">{dog.summary}</p>

                  <dl className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-sm">
                    <Meta label="Starost" value={dog.ageLabel} />
                    <Meta label="Pol" value={dog.sex} />
                    <Meta label="Veličina" value={dog.size} />
                    <Meta label="Procena rase" value={dog.breedGuess} />
                  </dl>

                  <p className="flex items-center gap-1.5 text-sm text-ink-subtle">
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    {dog.city} · {dog.shelter} · u evidenciji od {formatDateGenitive(dog.arrivedAt)}
                  </p>
                </div>
              </Reveal>

              <Reveal direction="up" delay={0.1}>
                <div className="flex flex-wrap gap-3">
                  {isMissing ? (
                    <Link href={routes.report} className={cn(buttonStyles({ size: 'lg' }))}>
                      <Siren className="h-4 w-4" />
                      Video sam ovog psa
                    </Link>
                  ) : isClosed ? (
                    /* Nothing left to fund, and /doniraj does not list this dog
                       as a recipient — "Pomozi Bori" sent the reader to a page
                       where Bora could not be chosen. */
                    <Link href={routes.donate} className={cn(buttonStyles({ size: 'lg' }))}>
                      <Heart className="h-4 w-4" />
                      Doniraj nekom ko još čeka
                    </Link>
                  ) : (
                    <Link href={routes.donate} className={cn(buttonStyles({ size: 'lg' }))}>
                      <Heart className="h-4 w-4" />
                      Pomozi {dog.nameDative}
                    </Link>
                  )}

                  {dog.sponsorMonthly > 0 ? (
                    <Link
                      href={routes.donate}
                      className={cn(
                        buttonStyles({ variant: 'secondary', size: 'lg' }),
                        'max-sm:w-full max-sm:whitespace-normal max-sm:text-center',
                      )}
                    >
                      Virtuelno starateljstvo · {formatRsd(dog.sponsorMonthly)}/mes
                    </Link>
                  ) : null}
                </div>
              </Reveal>

              <Reveal direction="up" delay={0.14}>
                <div className="space-y-4 border-t border-line pt-8">
                  <h2 className="text-headline text-ink">Priča</h2>
                  {dog.story.map((paragraph) => (
                    <p key={paragraph} className="text-base leading-relaxed text-ink-muted">
                      {paragraph}
                    </p>
                  ))}

                  <ul className="flex flex-wrap gap-1.5 pt-2">
                    {dog.traits.map((trait) => (
                      <li key={trait}>
                        <Badge size="sm">{trait}</Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              {dog.needs.length > 0 ? (
                <Reveal direction="up" delay={0.18}>
                  <div className="space-y-5 border-t border-line pt-8">
                    <div className="flex items-baseline justify-between gap-4">
                      <h2 className="text-headline text-ink">Šta još treba</h2>
                      <p data-numeric className="text-sm text-ink-muted">
                        {formatRsd(totals.covered)} / {formatRsd(totals.cost)}
                      </p>
                    </div>
                    <NeedsProgress needs={dog.needs} />
                  </div>
                </Reveal>
              ) : null}

              <Reveal direction="up" delay={0.22}>
                <div className="space-y-6 border-t border-line pt-8">
                  <div>
                    <h2 className="text-headline text-ink">Javni dnevnik</h2>
                    <p className="mt-2 text-sm text-ink-muted">
                      Svaki unos ima datum, iznos i oznaku da li je potvrđen dokumentom.
                    </p>
                  </div>
                  <DogTimeline events={dog.timeline} />
                </div>
              </Reveal>

              {relatedStory ? (
                <Reveal direction="up" delay={0.26}>
                  <Link
                    href={routes.story(relatedStory.slug)}
                    className="group block rounded-4xl border border-line bg-elevated p-6 transition-colors hover:border-line-strong"
                  >
                    <p className="text-2xs uppercase tracking-[0.2em] text-ink-subtle">Priča</p>
                    <p className="mt-2 text-headline text-ink transition-colors group-hover:text-brand-text">
                      {relatedStory.title}
                    </p>
                    <p className="mt-2 text-sm text-ink-muted">{relatedStory.dek}</p>
                  </Link>
                </Reveal>
              ) : null}
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-2xs uppercase tracking-widest text-ink-subtle">{label}</dt>
      <dd className="mt-0.5 text-ink">{value}</dd>
    </div>
  )
}
