'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { cn, formatRsd } from '@/lib/utils'
import { duration, ease } from '@/lib/motion'
import { routes } from '@/config/site'
import { dogNeedTotals, statusLabels, type Dog } from '@/content/dogs'
import { Badge } from '@/components/ui/badge'
import { DogArt } from './dog-art'

const STATUS_TONE: Record<Dog['status'], 'brand' | 'accent' | 'positive' | 'critical'> = {
  'trazi-dom': 'brand',
  'u-lecenju': 'accent',
  udomljen: 'positive',
  nestao: 'critical',
}

export function DogCard({ dog, className }: { dog: Dog; className?: string }) {
  const { cost, covered, progress } = dogNeedTotals(dog)
  const hasNeeds = dog.needs.length > 0

  return (
    <motion.article
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-4xl border border-line bg-elevated',
        'transition-[border-color,transform] duration-500 ease-out-expo hover:-translate-y-1 hover:border-line-strong',
        className,
      )}
      whileHover="hover"
      initial="rest"
      animate="rest"
    >
      <div className="relative aspect-4/3 overflow-hidden">
        <DogArt dog={dog} interactive className="h-full w-full" />

        <div className="absolute left-4 top-4">
          <Badge tone={STATUS_TONE[dog.status]} size="sm">
            {dog.status === 'nestao' ? (
              <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full rounded-full bg-critical animate-pulse-ring" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-critical" />
              </span>
            ) : null}
            {statusLabels[dog.status]}
          </Badge>
        </div>

        <motion.span
          aria-hidden="true"
          variants={{ rest: { opacity: 0, scale: 0.8 }, hover: { opacity: 1, scale: 1 } }}
          transition={{ duration: duration.base, ease: ease.outExpo }}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-canvas/85 text-ink backdrop-blur"
        >
          <ArrowUpRight className="h-4 w-4" />
        </motion.span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-headline text-ink">
            <Link href={routes.dog(dog.slug)} className="after:absolute after:inset-0">
              {dog.name}
            </Link>
          </h3>
          <span className="shrink-0 text-xs text-ink-subtle">{dog.ageLabel}</span>
        </div>

        <p className="flex items-center gap-1.5 text-xs text-ink-subtle">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          {dog.city} · {dog.shelter}
        </p>

        <p className="line-clamp-3 text-sm leading-relaxed text-ink-muted">{dog.summary}</p>

        <div className="mt-auto space-y-2 pt-2">
          {hasNeeds ? (
            <>
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-ink-muted">Pokriveno lečenje</span>
                <span data-numeric className="text-ink">
                  {formatRsd(covered)} / {formatRsd(cost)}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-sunken">
                <motion.div
                  className="h-full rounded-full bg-linear-to-r from-brand to-iris-400"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: progress }}
                  viewport={{ once: true }}
                  style={{ originX: 0 }}
                  transition={{ duration: duration.epic, ease: ease.outExpo }}
                />
              </div>
            </>
          ) : (
            <p className="text-xs text-ink-subtle">
              {dog.status === 'udomljen'
                ? 'Lečenje je zatvoreno. Ceo račun stoji na stranici.'
                : 'Potraga je aktivna — svaka informacija pomaže.'}
            </p>
          )}
        </div>
      </div>
    </motion.article>
  )
}
