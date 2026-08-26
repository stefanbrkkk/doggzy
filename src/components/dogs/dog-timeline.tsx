'use client'

import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import {
  BadgeCheck,
  CircleAlert,
  Heart,
  HeartHandshake,
  Home,
  Siren,
  Stethoscope,
} from 'lucide-react'
import { cn, formatDate, formatRsd } from '@/lib/utils'
import { duration, ease, viewportOnce } from '@/lib/motion'
import type { TimelineEvent, TimelineType } from '@/content/dogs'

const ICONS: Record<TimelineType, typeof Siren> = {
  prijava: Siren,
  vet: Stethoscope,
  donacija: Heart,
  nega: HeartHandshake,
  udomljenje: Home,
}

const TYPE_LABELS: Record<TimelineType, string> = {
  prijava: 'Prijava',
  vet: 'Veterinar',
  donacija: 'Donacija',
  nega: 'Nega',
  udomljenje: 'Udomljenje',
}

/**
 * The public ledger for one dog.
 *
 * Verified and unverified entries are rendered differently on purpose: an entry
 * without a receipt or a vet's confirmation says so, rather than being quietly
 * dropped. Hiding the gap would defeat the point of publishing the timeline.
 */
export function DogTimeline({ events }: { events: TimelineEvent[] }) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLOListElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 75%', 'end 65%'],
  })
  const lineScale = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 })

  const spent = events
    .filter((event) => event.type !== 'donacija' && typeof event.amount === 'number')
    .reduce((sum, event) => sum + (event.amount ?? 0), 0)

  const raised = events
    .filter((event) => event.type === 'donacija')
    .reduce((sum, event) => sum + (event.amount ?? 0), 0)

  return (
    <div className="space-y-8">
      <dl className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2">
        <div className="bg-elevated p-5">
          <dt className="text-2xs uppercase tracking-widest text-ink-subtle">Potrošeno na negu</dt>
          <dd data-numeric className="mt-1.5 text-headline text-ink">
            {formatRsd(spent)}
          </dd>
        </div>
        <div className="bg-elevated p-5">
          <dt className="text-2xs uppercase tracking-widest text-ink-subtle">
            Prikupljeno donacijama
          </dt>
          <dd data-numeric className="mt-1.5 text-headline text-brand-text">
            {formatRsd(raised)}
          </dd>
        </div>
      </dl>

      <ol ref={ref} className="relative space-y-8 pl-10">
        {/* Rail: a static track with a progress line that draws as you scroll. */}
        <span
          aria-hidden="true"
          className="absolute left-[15px] top-2 h-[calc(100%-1rem)] w-px bg-line"
        />
        {!reduced ? (
          <motion.span
            aria-hidden="true"
            className="absolute left-[15px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-linear-to-b from-brand to-iris-400"
            style={{ scaleY: lineScale }}
          />
        ) : null}

        {events.map((event, index) => {
          const Icon = ICONS[event.type]
          return (
            <motion.li
              key={`${event.date}-${event.title}`}
              className="relative"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: duration.slow, ease: ease.outExpo, delay: index * 0.05 }}
            >
              <span
                aria-hidden="true"
                className="absolute -left-10 top-0.5 grid h-8 w-8 place-items-center rounded-full border border-line bg-elevated text-brand"
              >
                <Icon className="h-4 w-4" />
              </span>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <time dateTime={event.date} className="text-xs text-ink-subtle">
                    {formatDate(event.date)}
                  </time>
                  <span className="text-2xs uppercase tracking-widest text-ink-subtle">
                    {TYPE_LABELS[event.type]}
                  </span>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-2xs',
                      event.verified
                        ? 'border-positive/30 bg-positive/10 text-positive'
                        : 'border-line bg-elevated text-ink-subtle',
                    )}
                  >
                    {event.verified ? (
                      <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                    ) : (
                      <CircleAlert className="h-3 w-3" aria-hidden="true" />
                    )}
                    {event.verified ? 'Potvrđeno' : 'Nepotvrđeno'}
                  </span>
                </div>

                <h3 className="text-base font-medium text-ink">{event.title}</h3>
                <p className="text-sm leading-relaxed text-ink-muted">{event.note}</p>

                {typeof event.amount === 'number' ? (
                  <p
                    data-numeric
                    className={cn(
                      'pt-1 text-sm',
                      event.type === 'donacija' ? 'text-brand-text' : 'text-ink',
                    )}
                  >
                    {event.type === 'donacija' ? '+' : '−'} {formatRsd(event.amount)}
                  </p>
                ) : null}
              </div>
            </motion.li>
          )
        })}
      </ol>
    </div>
  )
}
