'use client'

import { useId } from 'react'
import { cn } from '@/lib/utils'

/**
 * The mark: a paw whose leading toe is a locator pin.
 *
 * It carries the two halves of what Doggzy does — an animal, and finding it —
 * in one shape, and it stays legible down to 16px because every element is a
 * solid form rather than a stroke.
 *
 * The gradient id is generated per instance: several marks share a page (header,
 * footer, preloader) and a fixed id would break every other mark the moment one
 * of them unmounted and took the referenced <defs> with it.
 */
export function LogoMark({
  className,
  animated = false,
}: {
  className?: string
  animated?: boolean
}) {
  const gradientId = `logo-${useId().replace(/:/g, '')}`

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={cn('h-8 w-8', className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="4"
          y1="4"
          x2="28"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--color-ember-300)" />
          <stop offset="0.55" stopColor="var(--color-ember-500)" />
          <stop offset="1" stopColor="var(--color-iris-500)" />
        </linearGradient>
      </defs>

      {/* Pad */}
      <path
        d="M16 17.4c4.2 0 7.6 2.9 7.6 6.4 0 2.5-2 4.2-4.8 4.2-1.1 0-2-.2-2.8-.2s-1.7.2-2.8.2c-2.8 0-4.8-1.7-4.8-4.2 0-3.5 3.4-6.4 7.6-6.4Z"
        fill={`url(#${gradientId})`}
      />
      {/* Outer toes */}
      <ellipse
        cx="7.4"
        cy="14.6"
        rx="3.1"
        ry="3.9"
        transform="rotate(-18 7.4 14.6)"
        fill={`url(#${gradientId})`}
        opacity="0.82"
      />
      <ellipse
        cx="24.6"
        cy="14.6"
        rx="3.1"
        ry="3.9"
        transform="rotate(18 24.6 14.6)"
        fill={`url(#${gradientId})`}
        opacity="0.82"
      />
      <ellipse
        cx="12.2"
        cy="8.6"
        rx="2.9"
        ry="3.7"
        transform="rotate(-8 12.2 8.6)"
        fill={`url(#${gradientId})`}
        opacity="0.62"
      />

      {/* Leading toe, drawn as a locator pin */}
      <g className={animated ? 'origin-[20.4px_8.6px] animate-float' : undefined}>
        <path
          d="M20.4 3.2c2.3 0 4.1 1.8 4.1 4.1 0 2.9-4.1 7-4.1 7s-4.1-4.1-4.1-7c0-2.3 1.8-4.1 4.1-4.1Z"
          fill={`url(#${gradientId})`}
        />
        <circle cx="20.4" cy="7.3" r="1.5" className="fill-canvas" />
      </g>
    </svg>
  )
}

export function Logo({ className, animated }: { className?: string; animated?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark animated={animated} />
      <span className="font-display text-xl font-semibold tracking-tight text-ink">Doggzy</span>
    </span>
  )
}
