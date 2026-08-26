'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useAnimate } from 'framer-motion'
import { ArrowRight, Heart, ShoppingBag, Star, X } from 'lucide-react'
import { cn, formatRsd, plural } from '@/lib/utils'
import { duration, spring } from '@/lib/motion'
import { routes } from '@/config/site'
import type { Product } from '@/content/products'
import { lockScroll } from '@/lib/scroll-lock'
import { useShop } from '@/lib/store/shop-store'
import { Badge } from '@/components/ui/badge'
import { Button, buttonStyles } from '@/components/ui/button'
import { ProductArt } from './product-art'
import { Stepper } from './cart-drawer'
import { useReducedMotionSafe } from '@/lib/use-reduced-motion-safe'

/**
 * Quick view.
 *
 * The panel expands out of the card that opened it. The morph is computed here
 * from the card's own bounding box rather than handed to `layoutId`: the card
 * sits inside a 3D tilt, and Motion's layout projection measures that distorted
 * box and lands the panel in the wrong place at the wrong size. Measuring the
 * visual rect ourselves is immune to that, because `getBoundingClientRect`
 * already accounts for the ancestor transform.
 *
 * Deliberately not a second product page — art, price, the impact line and one
 * buy action. Anything that needed scrolling here should have been a
 * navigation, so the full page stays one click away.
 */
export function QuickView({
  product,
  originRect,
  onClose,
}: {
  product: Product | null
  /** Visual box of the card artwork that opened this, for the morph. */
  originRect: DOMRect | null
  onClose: () => void
}) {
  const reduced = useReducedMotionSafe()
  const [scope, animate] = useAnimate<HTMLDivElement>()
  const { addToCart, openCart, toggleFavorite, isFavorite, hydrated } = useShop()
  const [quantity, setQuantity] = useState(1)
  // Gates the first paint. `visibility` rather than `opacity`, so React's style
  // prop never fights the opacity Motion is animating.
  const [ready, setReady] = useState(false)
  const artRef = useRef<HTMLDivElement>(null)
  const restoreFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (product) setQuantity(1)
    else setReady(false)
  }, [product])

  // Runs before paint, so the panel is never seen at its final position first.
  useLayoutEffect(() => {
    const panel = scope.current
    if (!product || !panel) return

    setReady(true)

    if (reduced || !originRect || originRect.width === 0) return

    const box = panel.getBoundingClientRect()
    if (box.width === 0) return

    const scale = Math.min(1, Math.max(0.15, originRect.width / box.width))
    const dx = originRect.left + originRect.width / 2 - (box.left + box.width / 2)
    const dy = originRect.top + originRect.height / 2 - (box.top + box.height / 2)

    void animate(
      panel,
      { x: [dx, 0], y: [dy, 0], scale: [scale, 1], opacity: [0.25, 1] },
      spring.sheet,
    )
  }, [animate, originRect, product, reduced, scope])

  useEffect(() => {
    if (!product) return

    restoreFocus.current = document.activeElement as HTMLElement | null
    const release = lockScroll()
    scope.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const panel = scope.current
      if (!panel) return
      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (focusables.length === 0) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      release()
      restoreFocus.current?.focus?.()
    }
  }, [onClose, product, scope])

  const favorite = Boolean(product) && hydrated && isFavorite(product!.id)

  const add = () => {
    if (!product) return
    addToCart(product.id, quantity, artRef.current?.getBoundingClientRect() ?? null)
    onClose()
    openCart()
  }

  return (
    <AnimatePresence>
      {product ? (
        <div
          className="fixed inset-0 z-[130] grid place-items-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`Brzi pregled — ${product.name}`}
        >
          <motion.button
            type="button"
            aria-label="Zatvori brzi pregled"
            className="absolute inset-0 h-full w-full cursor-default bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.fast }}
            onClick={onClose}
          />

          <motion.div
            ref={scope}
            tabIndex={-1}
            // Hidden until the layout effect has measured and started the morph,
            // so the panel is never seen for a frame at its final position.
            style={{ visibility: ready ? 'visible' : 'hidden' }}
            className="relative grid w-full max-w-3xl overflow-hidden rounded-5xl border border-line bg-elevated outline-none sm:grid-cols-2"
            exit={{ opacity: 0, scale: 0.97, y: 12, transition: { duration: duration.fast } }}
          >
            {/* The morphing element is absolutely positioned inside a plain
                sized cell. If it participated in the panel's grid, layout
                projection and the grid would fight and the panel would collapse
                to the card's width mid-transition. */}
            <div ref={artRef} className="relative aspect-square sm:aspect-auto sm:min-h-[26rem]">
              <ProductArt product={product} className="absolute inset-0 h-full w-full" />
            </div>

            <div className="flex flex-col gap-4 p-6 sm:p-8">
              {product.badges.length > 0 ? (
                <ul className="flex flex-wrap gap-1.5">
                  {product.badges.map((badge) => (
                    <li key={badge}>
                      <Badge tone="brand" size="sm">
                        {badge}
                      </Badge>
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="space-y-2">
                <h2 className="text-headline text-ink">{product.name}</h2>
                <p className="text-sm text-ink-muted">{product.tagline}</p>
              </div>

              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <p data-numeric className="text-headline text-ink">
                  {formatRsd(product.price)}
                </p>
                {product.compareAt ? (
                  <p data-numeric className="text-sm text-ink-subtle line-through">
                    {formatRsd(product.compareAt)}
                  </p>
                ) : null}
                <p className="flex items-center gap-1.5 text-sm text-ink-muted">
                  <Star className="h-4 w-4 fill-brand text-brand" aria-hidden="true" />
                  <span data-numeric>{product.rating.toFixed(1)}</span>
                  <span className="text-ink-subtle">
                    (<span data-numeric>{product.reviews}</span>{' '}
                    {plural(product.reviews, 'ocena', 'ocene', 'ocena')})
                  </span>
                </p>
              </div>

              <p className="rounded-2xl bg-brand/8 px-4 py-3 text-sm leading-relaxed text-brand-text">
                {product.impact}
              </p>

              {product.inStock ? (
                <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
                  <Stepper value={quantity} onChange={setQuantity} label={product.name} />
                  <Button size="md" onClick={add} className="flex-1">
                    <ShoppingBag className="h-4 w-4" />
                    Dodaj u korpu
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    sheen={false}
                    onClick={() => toggleFavorite(product.id)}
                    aria-pressed={favorite}
                    aria-label={favorite ? 'Ukloni iz omiljenih' : 'Dodaj u omiljene'}
                  >
                    <Heart className={cn('h-4 w-4', favorite && 'fill-critical text-critical')} />
                  </Button>
                </div>
              ) : (
                <p className="mt-auto rounded-2xl border border-line bg-sunken p-4 text-sm text-ink-muted">
                  Trenutno nije na stanju.
                </p>
              )}

              <Link
                href={routes.product(product.slug)}
                className={cn(
                  buttonStyles({ variant: 'link', size: 'sm' }),
                  'group/full self-start',
                )}
              >
                Cela stranica proizvoda
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-out-expo group-hover/full:translate-x-1" />
              </Link>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Zatvori brzi pregled"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-canvas/80 text-ink-muted backdrop-blur transition-colors hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  )
}
