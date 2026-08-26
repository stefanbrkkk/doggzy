'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { duration, ease } from '@/lib/motion'
import { formatNumber } from '@/lib/utils'

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
  const reduced = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const [display, setDisplay] = useState(reduced ? value : 0)

  useEffect(() => {
    if (!inView) return
    if (reduced) {
      setDisplay(value)
      return
    }

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
