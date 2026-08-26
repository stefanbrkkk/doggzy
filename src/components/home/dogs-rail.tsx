'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { routes } from '@/config/site'
import { dogs } from '@/content/dogs'
import { buttonStyles } from '@/components/ui/button'
import { Container } from '@/components/ui/section'
import { SectionHeader } from '@/components/ui/section'
import { DogCard } from '@/components/dogs/dog-card'

/**
 * Horizontal rail of dog listings.
 *
 * Built on native overflow scrolling with snap points, so it works with a
 * trackpad, a touch swipe, the arrow buttons, and Tab-to-focus — all without a
 * carousel library. Pointer dragging is layered on top for mouse users and
 * cancels the click that would otherwise fire at the end of a drag.
 */
export function DogsRail() {
  const railRef = useRef<HTMLUListElement>(null)
  const [progress, setProgress] = useState(0)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const dragState = useRef({ active: false, startX: 0, startScroll: 0, moved: false })

  const measure = useCallback(() => {
    const rail = railRef.current
    if (!rail) return
    const max = rail.scrollWidth - rail.clientWidth
    setProgress(max <= 0 ? 0 : rail.scrollLeft / max)
    setAtStart(rail.scrollLeft <= 2)
    setAtEnd(rail.scrollLeft >= max - 2)
  }, [])

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    measure()
    rail.addEventListener('scroll', measure, { passive: true })
    const observer = new ResizeObserver(measure)
    observer.observe(rail)
    return () => {
      rail.removeEventListener('scroll', measure)
      observer.disconnect()
    }
  }, [measure])

  const scrollByCard = useCallback((direction: 1 | -1) => {
    const rail = railRef.current
    if (!rail) return
    const card = rail.querySelector('li')
    const step = card ? card.clientWidth + 20 : rail.clientWidth * 0.8
    rail.scrollBy({ left: step * direction, behavior: 'smooth' })
  }, [])

  const onPointerDown = (event: React.PointerEvent<HTMLUListElement>) => {
    if (event.pointerType !== 'mouse') return
    const rail = railRef.current
    if (!rail) return
    dragState.current = {
      active: true,
      startX: event.clientX,
      startScroll: rail.scrollLeft,
      moved: false,
    }
  }

  const onPointerMove = (event: React.PointerEvent<HTMLUListElement>) => {
    const state = dragState.current
    const rail = railRef.current
    if (!state.active || !rail) return
    const delta = event.clientX - state.startX
    if (Math.abs(delta) > 4) state.moved = true
    rail.scrollLeft = state.startScroll - delta
  }

  const endDrag = () => {
    dragState.current.active = false
  }

  // Swallow the click that follows a drag so a card link is not opened.
  const onClickCapture = (event: React.MouseEvent<HTMLUListElement>) => {
    if (dragState.current.moved) {
      event.preventDefault()
      event.stopPropagation()
      dragState.current.moved = false
    }
  }

  return (
    <section className="overflow-hidden py-section">
      <Container>
        <SectionHeader
          eyebrow="Psi"
          title="Neko od njih čeka baš tebe"
          lead="Svaki pas ima javnu stranicu sa troškovima, nalazima i statusom. Ništa nije skriveno."
          action={
            <Link
              href={routes.dogs}
              className={cn(buttonStyles({ variant: 'secondary', size: 'md' }))}
            >
              Svi psi
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
      </Container>

      <div className="relative mt-12">
        <ul
          ref={railRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={onClickCapture}
          className={cn(
            'flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-5 pb-6 sm:px-8',
            // Without scroll-padding the snapport starts at the padding box, so
            // the first card snaps flush to the viewport edge and loses its gutter.
            'scroll-pl-5 sm:scroll-pl-8',
            '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
            'cursor-grab active:cursor-grabbing',
          )}
        >
          {dogs.map((dog) => (
            <li
              key={dog.id}
              className="w-[17rem] shrink-0 snap-start sm:w-[19rem]"
              data-cursor="expand"
              data-cursor-label="Otvori"
            >
              <DogCard dog={dog} className="h-full" />
            </li>
          ))}
          <li aria-hidden="true" className="w-1 shrink-0" />
        </ul>
      </div>

      <Container className="mt-2 flex items-center gap-4">
        <div className="h-px flex-1 bg-line">
          <motion.div
            className="h-full origin-left bg-brand"
            style={{ scaleX: progress || 0.02 }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={atStart}
            aria-label="Prethodni psi"
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink-muted transition-colors hover:border-line-strong hover:text-ink disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={atEnd}
            aria-label="Sledeći psi"
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink-muted transition-colors hover:border-line-strong hover:text-ink disabled:opacity-30"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </Container>
    </section>
  )
}
