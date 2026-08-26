import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { routes } from '@/config/site'
import { stories } from '@/content/stories'
import { Container, Eyebrow } from '@/components/ui/section'
import { Reveal } from '@/components/motion'
import { GenerativeArt } from '@/components/visuals/generative-art'

export const metadata: Metadata = {
  title: 'Priče',
  description:
    'Slučajevi ispričani od početka do kraja — sa iznosima, računima i onim što nije prošlo kako smo planirali.',
  alternates: { canonical: routes.stories },
}

export default function StoriesPage() {
  return (
    <>
      <section className="relative isolate grain overflow-hidden pb-12 pt-36 sm:pt-44">
        <div
          aria-hidden="true"
          data-decor
          className="pointer-events-none absolute inset-x-0 -top-32 -z-10 h-[30rem] bg-[radial-gradient(55%_60%_at_50%_0%,var(--wash-cool),transparent_70%)] opacity-[var(--wash-opacity)]"
        />
        <Container>
          <div className="max-w-3xl">
            <Reveal direction="up" amount={0.4}>
              <Eyebrow>Priče</Eyebrow>
            </Reveal>
            <Reveal direction="up" delay={0.06}>
              <h1 className="mt-5 text-display text-ink">
                Slučajevi, <span className="text-gradient">od početka do kraja</span>
              </h1>
            </Reveal>
            <Reveal direction="up" delay={0.12}>
              <p className="mt-6 text-lead text-ink-muted">
                Sa iznosima, računima i onim što nije prošlo kako smo planirali.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="pb-section">
        <Container>
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story, index) => (
              <li key={story.slug}>
                <Reveal delay={index * 0.06} className="h-full">
                  <article className="group flex h-full flex-col overflow-hidden rounded-4xl border border-line bg-elevated transition-[border-color,transform] duration-500 ease-out-expo hover:-translate-y-1 hover:border-line-strong">
                    <div className="aspect-16/10 overflow-hidden">
                      <GenerativeArt
                        seed={story.slug}
                        shape={story.art.shape}
                        from={story.art.from}
                        to={story.art.to}
                        alt={`Ilustracija uz priču „${story.title}”`}
                        interactive
                        className="h-full w-full"
                      />
                    </div>

                    <div className="flex flex-1 flex-col gap-3 p-6">
                      <div className="flex items-center gap-4 text-xs text-ink-subtle">
                        <time dateTime={story.publishedAt}>{formatDate(story.publishedAt)}</time>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                          {story.readingMinutes} min
                        </span>
                      </div>

                      <h2 className="text-headline text-ink transition-colors group-hover:text-brand-text">
                        <Link
                          href={routes.story(story.slug)}
                          className="after:absolute after:inset-0"
                        >
                          {story.title}
                        </Link>
                      </h2>

                      <p className="text-sm leading-relaxed text-ink-muted">{story.dek}</p>

                      <span className="mt-auto flex items-center gap-1.5 pt-3 text-sm text-brand-text">
                        Pročitaj
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-out-expo group-hover:translate-x-1" />
                      </span>
                    </div>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  )
}
