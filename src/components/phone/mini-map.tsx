'use client'

import { motion } from 'framer-motion'
import { ease, spring } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { useReducedMotionSafe } from '@/lib/use-reduced-motion-safe'

/**
 * A stylised city map for the report flow.
 *
 * Deliberately abstract: it is not a real tile layer, makes no network request,
 * and never claims to show the visitor's actual position. It exists to make the
 * location step feel like a place rather than a text box, and it is `aria-hidden`
 * because the address input carries the real meaning.
 */
export function MiniMap({ active = false, className }: { active?: boolean; className?: string }) {
  const reduced = useReducedMotionSafe()

  return (
    <div
      className={cn('relative aspect-[16/10] w-full overflow-hidden bg-sunken', className)}
      aria-hidden="true"
    >
      <motion.svg
        viewBox="0 0 320 200"
        className="h-full w-full"
        initial={false}
        // An explicit rest target, not `undefined`: dropping `animate`
        // mid-cycle leaves the element wherever the loop had got to.
        animate={reduced ? { x: 0, y: 0 } : { x: [0, -6, 0], y: [0, 4, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
      >
        <rect width="320" height="200" className="fill-sunken" />

        {/* Park */}
        <path
          d="M18 128 C 34 104, 76 100, 96 118 C 116 136, 104 172, 74 178 C 42 184, 8 156, 18 128 Z"
          className="fill-mint-500/12"
        />
        {/* River */}
        <path
          d="M-10 44 C 60 62, 118 22, 190 46 C 250 66, 286 40, 332 56"
          className="stroke-signal-500/25"
          strokeWidth="13"
          fill="none"
          strokeLinecap="round"
        />

        {/* Street grid */}
        <g className="stroke-ink/12" strokeWidth="1.2">
          {[26, 62, 98, 134, 170].map((y) => (
            <line key={`h${y}`} x1="-10" y1={y} x2="330" y2={y} />
          ))}
          {[34, 82, 130, 178, 226, 274].map((x) => (
            <line key={`v${x}`} x1={x} y1="-10" x2={x + 14} y2="210" />
          ))}
        </g>
        <g className="stroke-ink/22" strokeWidth="2.4">
          <line x1="-10" y1="98" x2="330" y2="98" />
          <line x1="178" y1="-10" x2="192" y2="210" />
        </g>

        {/* Blocks */}
        <g className="fill-ink/6">
          {[
            [40, 104, 34, 24],
            [88, 104, 34, 24],
            [188, 32, 30, 22],
            [236, 32, 30, 22],
            [188, 140, 32, 24],
            [240, 108, 26, 26],
          ].map(([x, y, w, h]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx="3" />
          ))}
        </g>
      </motion.svg>

      {/* Pin, dropped once a location has been entered */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
        <motion.div
          initial={false}
          animate={active ? { y: 0, opacity: 1, scale: 1 } : { y: -14, opacity: 0.45, scale: 0.9 }}
          transition={spring.pop}
          className="relative"
        >
          <svg
            width="26"
            height="34"
            viewBox="0 0 26 34"
            className="drop-shadow-[0_4px_10px_oklch(0_0_0/0.5)]"
          >
            <path
              d="M13 1c6.6 0 12 5.4 12 12 0 8.6-12 20-12 20S1 21.6 1 13C1 6.4 6.4 1 13 1Z"
              className="fill-brand"
            />
            <circle cx="13" cy="13" r="4.4" className="fill-canvas" />
          </svg>
        </motion.div>
      </div>

      {/* Locator pings */}
      {active && !reduced
        ? [0, 0.9].map((delay) => (
            <motion.span
              key={delay}
              className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand/50"
              initial={{ scale: 0.35, opacity: 0.9 }}
              animate={{ scale: 2.4, opacity: 0 }}
              transition={{ duration: 2.4, repeat: Infinity, ease: ease.outQuart, delay }}
            />
          ))
        : null}

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_35%,var(--sunken)_100%)]" />
    </div>
  )
}
