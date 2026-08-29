'use client'

import { type ReactNode, Children } from 'react'
import { cn } from '@/lib/utils'

export interface MarqueeProps {
  children: ReactNode
  className?: string
  /** Seconds for one full pass. Larger is slower. */
  speed?: number
  reverse?: boolean
  pauseOnHover?: boolean
  /** Fade the leading and trailing edges into the background. */
  fade?: boolean
}

/**
 * An infinite horizontal ticker.
 *
 * The track is duplicated once and each copy travels -100% of its own width,
 * so the second copy lands exactly where the first started and the loop closes
 * without measuring anything at runtime. The keyframe used to end at -50%,
 * which is half a copy — the ticker snapped a full screen of content back into
 * view once per cycle.
 *
 * Runs as a CSS animation on the compositor, so it costs no main-thread work
 * and keeps ticking during React renders.
 */
export function Marquee({
  children,
  className,
  speed = 42,
  reverse = false,
  pauseOnHover = true,
  fade = true,
}: MarqueeProps) {
  const items = Children.toArray(children)

  return (
    <div
      className={cn(
        'group/marquee relative flex w-full overflow-hidden',
        fade && 'mask-fade-x',
        className,
      )}
    >
      {[0, 1].map((copy) => (
        <div
          key={copy}
          aria-hidden={copy === 1}
          className={cn(
            // `min-w-full` is measured against the container, not against a
            // wrapper, so a short item list still fills the viewport width.
            'flex min-w-full shrink-0 animate-marquee items-center',
            // The global reduced-motion rule collapses durations to 0.01ms,
            // which would snap the track to its end position rather than stop
            // it. Removing the animation outright leaves it correctly parked.
            'motion-reduce:animate-none',
            pauseOnHover && 'group-hover/marquee:[animation-play-state:paused]',
          )}
          style={{
            animationDuration: `${speed}s`,
            animationDirection: reverse ? 'reverse' : 'normal',
          }}
        >
          {items.map((item, index) => (
            <div key={index} className="shrink-0">
              {item}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
