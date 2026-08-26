'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { spring } from '@/lib/motion'
import { statusLabels, type Dog, type DogStatus } from '@/content/dogs'
import { DogCard } from './dog-card'

const ALL = 'sve' as const
type Filter = typeof ALL | DogStatus

const ORDER: DogStatus[] = ['nestao', 'trazi-dom', 'u-lecenju', 'udomljen']

export function DogsBrowser({ dogs }: { dogs: Dog[] }) {
  const [filter, setFilter] = useState<Filter>(ALL)

  const counts = useMemo(() => {
    const map = new Map<Filter, number>([[ALL, dogs.length]])
    for (const status of ORDER) {
      map.set(status, dogs.filter((dog) => dog.status === status).length)
    }
    return map
  }, [dogs])

  const visible = useMemo(
    () => (filter === ALL ? dogs : dogs.filter((dog) => dog.status === filter)),
    [dogs, filter],
  )

  return (
    <div className="space-y-8">
      {/* The cards are h3s. Without this the page jumps h1 to h3, which breaks
          heading-based navigation. */}
      <h2 className="sr-only">Lista pasa</h2>

      <LayoutGroup id="dogs-filter">
        <ul className="flex flex-wrap gap-1.5">
          {[ALL, ...ORDER].map((option) => {
            const active = filter === option
            const count = counts.get(option) ?? 0
            return (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => setFilter(option)}
                  aria-pressed={active}
                  className={cn(
                    'relative rounded-full border border-line px-4 py-2 text-sm transition-colors',
                    active ? 'border-transparent text-brand-ink' : 'text-ink-muted hover:text-ink',
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId="dogs-filter-pill"
                      className="absolute inset-0 rounded-full bg-brand"
                      transition={spring.surface}
                    />
                  ) : null}
                  <span className="relative z-10">
                    {option === ALL ? 'Svi' : statusLabels[option]}{' '}
                    <span data-numeric className="opacity-60">
                      {count}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </LayoutGroup>

      {visible.length === 0 ? (
        <p className="rounded-4xl border border-dashed border-line py-24 text-center text-sm text-ink-muted">
          Trenutno nema pasa u ovoj kategoriji.
        </p>
      ) : (
        <motion.ul layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((dog) => (
              <motion.li
                key={dog.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={spring.surface}
              >
                <DogCard dog={dog} className="h-full" />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  )
}
