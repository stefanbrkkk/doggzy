'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Clock } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { routes } from '@/config/site'
import { stories } from '@/content/stories'
import { buttonStyles } from '@/components/ui/button'
import { Container, Eyebrow } from '@/components/ui/section'
import { GenerativeArt } from '@/components/visuals/generative-art'
import { Reveal } from '@/components/motion'
import { useReducedMotionSafe } from '@/lib/use-reduced-motion-safe'

export function StoryFeature() {
  const reduced = useReducedMotionSafe()
  const ref = useRef<HTMLDivElement>(null)
  const [lead, ...rest] = stories

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const artY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <section className="py-section">
      <Container>
        <Reveal direction="up" amount={0.4}>
          <Eyebrow>Priče</Eyebrow>
        </Reveal>

        <div ref={ref} className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <Reveal direction="up" className="order-2 lg:order-1">
            <article className="space-y-6">
              <h2 className="text-display text-ink">
                <Link
                  href={routes.story(lead.slug)}
                  className="transition-colors hover:text-brand-text"
                >
                  {lead.title}
                </Link>
              </h2>

              <p className="text-lead text-ink-muted">{lead.dek}</p>

              <blockquote className="border-l-2 border-brand pl-6 font-serif text-2xl italic leading-snug text-ink">
                „{lead.pullQuote}”
              </blockquote>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-subtle">
                <span>{formatDate(lead.publishedAt)}</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  {lead.readingMinutes} min čitanja
                </span>
              </div>

              <Link
                href={routes.story(lead.slug)}
                className={cn(buttonStyles({ variant: 'secondary', size: 'md' }), 'group/read')}
              >
                Pročitaj priču
                <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out-expo group-hover/read:translate-x-1" />
              </Link>
            </article>
          </Reveal>

          <Reveal direction="up" delay={0.08} className="order-1 lg:order-2">
            <div className="overflow-hidden rounded-5xl border border-line">
              {/* Pinned, not dropped — see the note in site-footer.tsx: the
                  first client render is never `reduced`, so Motion has already
                  written `y: -8%` and nothing would clear it. */}
              <motion.div style={reduced ? { y: '0%' } : { y: artY }} className="scale-110">
                <GenerativeArt
                  seed={lead.slug}
                  shape={lead.art.shape}
                  from={lead.art.from}
                  to={lead.art.to}
                  alt={`Ilustracija uz priču „${lead.title}”`}
                  className="aspect-4/5 w-full"
                />
              </motion.div>
            </div>
          </Reveal>
        </div>

        <ul className="mt-16 grid gap-px overflow-hidden rounded-4xl border border-line bg-rule sm:grid-cols-2">
          {rest.map((story, index) => (
            <li key={story.slug}>
              <Reveal delay={index * 0.06}>
                <Link
                  href={routes.story(story.slug)}
                  className="group flex h-full flex-col gap-3 bg-elevated p-7 transition-colors hover:bg-surface"
                >
                  <span className="text-xs text-ink-subtle">{formatDate(story.publishedAt)}</span>
                  <span className="text-headline text-ink transition-colors group-hover:text-brand-text">
                    {story.title}
                  </span>
                  <span className="text-sm leading-relaxed text-ink-muted">{story.dek}</span>
                  <span className="mt-auto flex items-center gap-1.5 pt-3 text-sm text-brand-text">
                    Pročitaj
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-out-expo group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
