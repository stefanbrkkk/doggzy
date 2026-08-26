'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'
import { duration, ease } from '@/lib/motion'
import { formatNumber } from '@/lib/utils'
import { useReducedMotionSafe } from '@/lib/use-reduced-motion-safe'

export interface CountUpProps {
  value: number
  className?: string
  /** Rendered before the number, e.g. a currency symbol. */
  prefix?: string
  /** Rendered after the number, e.g. "%" or "+". */
  suffix?: string
  decimals?: number
  durationSeconds?: number
  /** Format with Serbian thousands separators. */
  grouped?: boolean
}

/**
 * Counts from zero to `value` the first time it scrolls into view.
 *
 * The rendered element carries `data-numeric`, which switches it to the
 * tabular-figure mono face so digits never shift width mid-count. Screen
 * readers get the final value immediately via aria-label.
 */
export function CountUp({
  value,
  className,
  prefix = '',
  suffix = '',
  decimals = 0,
  durationSeconds = 1.6,
  grouped = true,
}: CountUpProps) {
  const reduced = useReducedMotionSafe()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  // Always starts at 0, even for reduced motion. Seeding from `reduced` made
  // the first client render differ from the server's, and React discards the
  // server HTML for the whole subtree when the text does not match.
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (reduced) {
      setDisplay(value)
      return
    }
    if (!inView) return

    const controls = animate(0, value, {
      duration: durationSeconds || duration.slow,
      ease: ease.outExpo,
      onUpdate: (latest) => setDisplay(latest),
    })

    return () => controls.stop()
  }, [durationSeconds, inView, reduced, value])

  const rounded = decimals > 0 ? Number(display.toFixed(decimals)) : Math.round(display)
  const text = grouped ? formatNumber(rounded) : rounded.toFixed(decimals)

  return (
    <span
      ref={ref}
      data-numeric
      className={cn('inline-block', className)}
      aria-label={`${prefix}${grouped ? formatNumber(value) : value}${suffix}`}
    >
      <span aria-hidden="true">
        {prefix}
        {text}
        {suffix}
      </span>
    </span>
  )
}
