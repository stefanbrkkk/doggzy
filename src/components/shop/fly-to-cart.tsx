'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ease } from '@/lib/motion'
import { useShop } from '@/lib/store/shop-store'

interface Flight {
  key: number
  from: DOMRect
  to: { x: number; y: number }
}

/**
 * Arcs a token from the product that was just added to the cart button.
 *
 * The destination is read from `[data-cart-target]` at flight time rather than
 * being passed down, so the effect works from anywhere in the tree and survives
 * the header changing size. It renders nothing at all when the header button is
 * off-screen or the visitor prefers reduced motion.
 */
export function FlyToCart() {
  const { flyOrigin } = useShop()
  const reduced = useReducedMotion()
  const [flight, setFlight] = useState<Flight | null>(null)

  useEffect(() => {
    if (!flyOrigin || reduced) return

    const target = document.querySelector('[data-cart-target]')
    if (!target) return

    const targetRect = target.getBoundingClientRect()
    if (targetRect.width === 0) return

    setFlight({
      key: flyOrigin.key,
      from: flyOrigin.rect,
      to: {
        x: targetRect.left + targetRect.width / 2,
        y: targetRect.top + targetRect.height / 2,
      },
    })

    const timer = window.setTimeout(() => setFlight(null), 800)
    return () => window.clearTimeout(timer)
  }, [flyOrigin, reduced])

  return (
    <AnimatePresence>
      {flight ? (
        <motion.span
          key={flight.key}
          aria-hidden="true"
          data-decor
          className="pointer-events-none fixed z-[150] rounded-2xl bg-brand"
          initial={{
            left: flight.from.left,
            top: flight.from.top,
            width: flight.from.width,
            height: flight.from.height,
            opacity: 0.9,
            borderRadius: 24,
          }}
          animate={{
            left: flight.to.x - 8,
            top: flight.to.y - 8,
            width: 16,
            height: 16,
            opacity: 0,
            borderRadius: 999,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.72, ease: ease.inOutQuart }}
        />
      ) : null}
    </AnimatePresence>
  )
}
