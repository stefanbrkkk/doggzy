import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { pageMetadata } from '@/lib/metadata'
import { routes } from '@/config/site'
import { getStory, stories } from '@/content/stories'
import { getDog } from '@/content/dogs'
import { Container } from '@/components/ui/section'
import { buttonStyles } from '@/components/ui/button'
import { Reveal } from '@/components/motion'
import { GenerativeArt } from '@/components/visuals/generative-art'
import { JsonLd } from '@/components/seo/json-ld'
import { articleSchema, breadcrumbSchema } from '@/lib/structured-data'

/**
 * Every slug is enumerable, so an unknown one is a real 404.
 *
 * Without this Next renders the unknown param on demand and serves the
 * `notFound()` page with status 200 and `s-maxage=31536000` — so a mistyped or
 * crawler-invented URL became an indexable page, pinned in the cache for a year.
 */
export const dynamicParams = false

export function generateStaticParams() {
  return stories.map((story) => ({ slug: story.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const story = getStory(slug)

  if (!story) return { title: 'Priča nije pronađena' }

  return pageMetadata({
    title: story.title,
    description: story.dek,
    path: routes.story(story.slug),
    type: 'article',
    publishedTime: story.publishedAt,
  })
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const story = getStory(slug)

  if (!story) notFound()

  const dog = story.dogSlug ? getDog(story.dogSlug) : undefined
  const more = stories.filter((item) => item.slug !== story.slug)

  return (
    <>
      <JsonLd
        data={[
          articleSchema(story),
          breadcrumbSchema([
            { name: 'Priče', path: routes.stories },
            { name: story.title, path: routes.story(story.slug) },
          ]),
        ]}
      />

      <article className="pb-24 pt-32 sm:pt-40">
        <Container size="narrow">
          <Link
            href={routes.stories}
            className="inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            Sve priče
          </Link>

          <header className="mt-8 space-y-5">
            <Reveal direction="up">
              <h1 className="text-display text-ink">{story.title}</h1>
            </Reveal>
            <Reveal direction="up" delay={0.06}>
              <p className="text-lead text-ink-muted">{story.dek}</p>
            </Reveal>
            <Reveal direction="up" delay={0.12}>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-subtle">
                <span>{story.author}</span>
                <time dateTime={story.publishedAt}>{formatDate(story.publishedAt)}</time>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  {story.readingMinutes} min čitanja
                </span>
              </div>
            </Reveal>
          </header>
        </Container>

        <Container className="mt-12">
          <Reveal direction="up" delay={0.06}>
            <div className="overflow-hidden rounded-5xl border border-line">
              <GenerativeArt
                seed={story.slug}
                shape={story.art.shape}
                from={story.art.from}
                to={story.art.to}
                alt={`Ilustracija uz priču „${story.title}”`}
                className="aspect-21/9 w-full"
              />
            </div>
          </Reveal>
        </Container>

        <Container size="narrow" className="mt-16">
          <div className="space-y-12">
            {story.body.map((section, index) => (
              <Reveal key={section.heading ?? index} direction="up" className="space-y-4">
                {section.heading ? (
                  <h2 className="text-headline text-ink">{section.heading}</h2>
                ) : null}
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-base leading-[1.8] text-ink-muted">
                    {paragraph}
                  </p>
                ))}
                {index === 0 ? (
                  <blockquote className="my-10 border-l-2 border-brand pl-6 font-serif text-3xl italic leading-snug text-ink">
                    „{story.pullQuote}”
                  </blockquote>
                ) : null}
              </Reveal>
            ))}
          </div>

          {dog ? (
            <Reveal direction="up" className="mt-16">
              <Link
                href={routes.dog(dog.slug)}
                className="group flex flex-col gap-3 rounded-4xl border border-line bg-elevated p-7 transition-colors hover:border-line-strong sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-2xs uppercase tracking-[0.2em] text-ink-subtle">Proveri sam</p>
                  <p className="mt-2 text-headline text-ink transition-colors group-hover:text-brand-text">
                    Javni dnevnik — {dog.name}
                  </p>
                  <p className="mt-1 text-sm text-ink-muted">
                    Svi iznosi iz ove priče stoje tamo, sa datumima i oznakom potvrde.
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-brand transition-transform duration-300 ease-out-expo group-hover:translate-x-1" />
              </Link>
            </Reveal>
          ) : null}
        </Container>
      </article>

      <section className="pb-section">
        <Container size="narrow">
          <h2 className="text-headline text-ink">Još priča</h2>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {more.map((item) => (
              <li key={item.slug}>
                <Link
                  href={routes.story(item.slug)}
                  className="group flex items-center justify-between gap-6 py-5"
                >
                  <span>
                    <span className="block text-base font-medium text-ink transition-colors group-hover:text-brand-text">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-sm text-ink-muted">{item.dek}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-ink-subtle transition-transform duration-300 ease-out-expo group-hover:translate-x-1 group-hover:text-brand" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <Link
              href={routes.stories}
              className={cn(buttonStyles({ variant: 'secondary', size: 'md' }))}
            >
              Sve priče
            </Link>
          </div>
        </Container>
      </section>
    </>
  )
}
