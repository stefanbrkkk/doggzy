'use client'

import { motion } from 'framer-motion'
import { formatRsd } from '@/lib/utils'
import { duration, ease, viewportOnce } from '@/lib/motion'
import type { DogNeed } from '@/content/dogs'

/** Per-item funding bars. Each bar fills once as it scrolls into view. */
export function NeedsProgress({ needs }: { needs: DogNeed[] }) {
  return (
    <ul className="space-y-4">
      {needs.map((need, index) => {
        const ratio = need.cost === 0 ? 1 : Math.min(1, need.covered / need.cost)
        const percent = Math.round(ratio * 100)

        return (
          <li key={need.label} className="space-y-2">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-sm text-ink">{need.label}</span>
              <span data-numeric className="text-sm text-ink-muted">
                {formatRsd(need.covered)} / {formatRsd(need.cost)}
              </span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-sunken"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
              aria-label={`${need.label}: pokriveno ${percent}%`}
            >
              <motion.div
                className="h-full rounded-full bg-linear-to-r from-brand to-iris-400"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: ratio }}
                viewport={viewportOnce}
                style={{ originX: 0 }}
                transition={{
                  duration: duration.epic,
                  ease: ease.outExpo,
                  delay: index * 0.08,
                }}
              />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
