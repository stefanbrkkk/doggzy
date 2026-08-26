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

const FLIGHT_MS = 640
const MAX_CONCURRENT = 3

/**
 * Arcs a token from the product that was just added to the cart button.
 *
 * The path curves: `x` eases out while `y` accelerates, which reads as an
 * object thrown rather than a box tweened along a diagonal. Several can be in
 * flight at once, so rapid clicks each get their own.
 *
 * The destination is read from `[data-cart-target]` at launch rather than being
 * passed down, so the effect works from anywhere in the tree. It renders
 * nothing when the header button is off-screen or the visitor prefers reduced
 * motion.
 */
export function FlyToCart() {
  const { flyOrigin } = useShop()
  const reduced = useReducedMotion()
  const [flights, setFlights] = useState<Flight[]>([])

  useEffect(() => {
    if (!flyOrigin || reduced) return

    const target = document.querySelector('[data-cart-target]')
    if (!target) return

    const targetRect = target.getBoundingClientRect()
    if (targetRect.width === 0) return

    const flight: Flight = {
      key: flyOrigin.key,
      from: flyOrigin.rect,
      to: {
        x: targetRect.left + targetRect.width / 2,
        y: targetRect.top + targetRect.height / 2,
      },
    }

    setFlights((current) => [...current, flight].slice(-MAX_CONCURRENT))

    const timer = window.setTimeout(() => {
      setFlights((current) => current.filter((item) => item.key !== flight.key))
    }, FLIGHT_MS)

    return () => window.clearTimeout(timer)
  }, [flyOrigin, reduced])

  return (
    <AnimatePresence>
      {flights.map((flight) => {
        const startX = flight.from.left + flight.from.width / 2
        const startY = flight.from.top + flight.from.height / 2
        // Lift the apex above both endpoints so the arc reads as a throw.
        const apexY = Math.min(startY, flight.to.y) - 90

        return (
          <motion.span
            key={flight.key}
            aria-hidden="true"
            data-decor
            className="pointer-events-none fixed left-0 top-0 z-[150] h-4 w-4 rounded-full bg-brand shadow-glow"
            initial={{ x: startX - 8, y: startY - 8, scale: 1.8, opacity: 0.95 }}
            animate={{
              x: flight.to.x - 8,
              y: [startY - 8, apexY, flight.to.y - 8],
              scale: 0.6,
              opacity: [0.95, 1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: FLIGHT_MS / 1000,
              x: { ease: ease.swift },
              y: { ease: [ease.outQuart, [0.4, 0, 1, 1]], times: [0, 0.45, 1] },
              opacity: { times: [0, 0.7, 1] },
              scale: { ease: ease.swift },
            }}
          />
        )
      })}
    </AnimatePresence>
  )
}
