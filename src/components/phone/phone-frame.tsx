'use client'

import { type ReactNode, useRef } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'
import { spring } from '@/lib/motion'
import { useReducedMotionSafe } from '@/lib/use-reduced-motion-safe'

export interface PhoneFrameProps {
  children: ReactNode
  className?: string
  /** Time shown in the status bar. Fixed by default so SSR and client agree. */
  statusTime?: string
  /** Tilts toward the pointer. Off for contexts where the phone is already busy. */
  tilt?: boolean
  /** Coloured bloom behind the device, as if the screen were lighting the page. */
  glow?: boolean
  label?: string
}

/**
 * Device chrome for the in-page app demos.
 *
 * Everything is CSS and SVG — no image assets, no 3D model — so it stays sharp
 * at any size, re-colours with the theme, and costs nothing to load. The screen
 * is a normal DOM subtree, which means whatever runs inside it is genuinely
 * interactive and reachable by keyboard and screen readers.
 */
export function PhoneFrame({
  children,
  className,
  statusTime = '9:41',
  tilt = true,
  glow = true,
  label = 'Prikaz aplikacije',
}: PhoneFrameProps) {
  const reduced = useReducedMotionSafe()
  const ref = useRef<HTMLDivElement>(null)

  const rotateX = useSpring(useMotionValue(0), spring.pointer)
  const rotateY = useSpring(useMotionValue(0), spring.pointer)
  const sheenX = useMotionValue(50)
  const sheenY = useMotionValue(0)
  const sheen = useMotionTemplate`linear-gradient(${sheenY}deg, transparent 30%, oklch(1 0 0 / 0.14) ${sheenX}%, transparent 70%)`

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!tilt || reduced || event.pointerType !== 'mouse') return
    const element = ref.current
    if (!element) return
    const rect = element.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    rotateY.set((px - 0.5) * 14)
    rotateX.set((0.5 - py) * 10)
    sheenX.set(20 + px * 60)
    sheenY.set(100 + py * 60)
  }

  const reset = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <div className={cn('relative isolate mx-auto w-full max-w-[22rem]', className)}>
      {glow ? (
        <div
          aria-hidden="true"
          data-decor
          className="pointer-events-none absolute inset-x-6 top-16 -z-10 h-3/4 rounded-full bg-brand/25 blur-[90px]"
        />
      ) : null}

      <div style={{ perspective: '1400px' }}>
        <motion.div
          ref={ref}
          onPointerMove={handleMove}
          onPointerLeave={reset}
          onPointerCancel={reset}
          style={{ rotateX, rotateY }}
          // Flat, not `preserve-3d`. Nothing inside the frame carries its own
          // 3D transform — body, bezel, screen and side hardware are coplanar —
          // so the perspective-projected tilt renders pixel-identically either
          // way. With `preserve-3d` Chromium hit-tests the screen subtree
          // against a plane that does not match where it paints: with the
          // pointer resting inside the phone (which is unavoidable to reach any
          // control) more than half the report flow stopped responding to
          // clicks, and the aim point landed on the phone body instead.
          className="relative"
        >
          {/* Titanium body */}
          <div
            className={cn(
              'relative rounded-[3rem] p-[3px]',
              'bg-[linear-gradient(150deg,oklch(0.72_0.01_60),oklch(0.32_0.008_60)_28%,oklch(0.18_0.006_60)_52%,oklch(0.46_0.01_60)_78%,oklch(0.24_0.008_60))]',
              'shadow-[0_40px_90px_-30px_oklch(0_0_0/0.75),0_0_0_1px_oklch(0_0_0/0.5)]',
            )}
          >
            {/* Inner bezel */}
            <div className="relative overflow-hidden rounded-[2.85rem] bg-black p-[9px]">
              <div
                className="relative aspect-[9/19.5] w-full overflow-hidden rounded-[2.35rem] bg-canvas"
                role="group"
                aria-label={label}
              >
                {/* Status bar */}
                {/* Entirely decorative chrome, including the clock — a screen
                    reader announcing a fake 9:41 inside the demo is noise. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-7 pt-3.5 text-[11px] font-medium text-ink"
                >
                  {/* Decoration, like the signal icons beside it: a screen
                      reader reading the demo should not open with "9:41". */}
                  <span data-numeric aria-hidden="true">
                    {statusTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <SignalIcon />
                    <WifiIcon />
                    <BatteryIcon />
                  </span>
                </div>

                {/* Dynamic island */}
                <div
                  aria-hidden="true"
                  className="absolute left-1/2 top-2.5 z-30 h-[26px] w-[86px] -translate-x-1/2 rounded-full bg-black"
                >
                  <span className="absolute right-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[oklch(0.28_0.03_240)]" />
                </div>

                <div className="absolute inset-0 pt-12">{children}</div>

                {/* Home indicator */}
                <div
                  aria-hidden="true"
                  className="absolute bottom-2 left-1/2 z-20 h-1 w-28 -translate-x-1/2 rounded-full bg-ink/25"
                />
              </div>
            </div>

            {/* Glass sheen, driven by pointer position */}
            {!reduced ? (
              <motion.div
                aria-hidden="true"
                data-decor
                className="pointer-events-none absolute inset-0 rounded-[3rem] mix-blend-overlay"
                style={{ backgroundImage: sheen }}
              />
            ) : null}
          </div>

          {/* Side hardware */}
          <span
            aria-hidden="true"
            className="absolute -left-[3px] top-[22%] h-8 w-[3px] rounded-l bg-[oklch(0.4_0.01_60)]"
          />
          <span
            aria-hidden="true"
            className="absolute -left-[3px] top-[31%] h-12 w-[3px] rounded-l bg-[oklch(0.4_0.01_60)]"
          />
          <span
            aria-hidden="true"
            className="absolute -left-[3px] top-[41%] h-12 w-[3px] rounded-l bg-[oklch(0.4_0.01_60)]"
          />
          <span
            aria-hidden="true"
            className="absolute -right-[3px] top-[32%] h-20 w-[3px] rounded-r bg-[oklch(0.4_0.01_60)]"
          />
        </motion.div>
      </div>
    </div>
  )
}

function SignalIcon() {
  return (
    <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
      <rect x="0" y="7.5" width="3" height="3.5" rx="1" opacity="0.95" />
      <rect x="4.6" y="5" width="3" height="6" rx="1" opacity="0.95" />
      <rect x="9.2" y="2.5" width="3" height="8.5" rx="1" opacity="0.95" />
      <rect x="13.8" y="0" width="3" height="11" rx="1" opacity="0.4" />
    </svg>
  )
}

function WifiIcon() {
  return (
    <svg
      width="15"
      height="11"
      viewBox="0 0 15 11"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    >
      <path d="M1 3.6a9.6 9.6 0 0 1 13 0" />
      <path d="M3.4 6.3a6.1 6.1 0 0 1 8.2 0" />
      <path d="M5.9 8.9a2.6 2.6 0 0 1 3.2 0" />
    </svg>
  )
}

function BatteryIcon() {
  return (
    <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
      <rect
        x="0.6"
        y="0.6"
        width="20"
        height="10.8"
        rx="3"
        stroke="currentColor"
        strokeOpacity="0.4"
      />
      <rect x="2.2" y="2.2" width="14" height="7.6" rx="1.8" fill="currentColor" />
      <path d="M22.4 4.2v3.6a2 2 0 0 0 0-3.6Z" fill="currentColor" fillOpacity="0.4" />
    </svg>
  )
}
