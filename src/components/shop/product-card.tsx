'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Expand, Heart, Plus } from 'lucide-react'
import { cn, formatRsd } from '@/lib/utils'
import { duration, ease, spring } from '@/lib/motion'
import { routes } from '@/config/site'
import type { Product, ProductBadge } from '@/content/products'
import { useShop } from '@/lib/store/shop-store'
import { Badge } from '@/components/ui/badge'
import { TiltCard } from '@/components/motion'
import { ProductArt } from './product-art'

const BADGE_TONE: Record<ProductBadge, 'brand' | 'accent' | 'positive' | 'neutral'> = {
  bestseler: 'brand',
  novo: 'accent',
  eko: 'positive',
  ograničeno: 'neutral',
}

export function ProductCard({
  product,
  index = 0,
  onQuickView,
}: {
  product: Product
  index?: number
  /** When provided, the card offers a quick-view affordance on hover. */
  onQuickView?: (product: Product, originRect: DOMRect | null) => void
}) {
  const { addToCart, toggleFavorite, isFavorite, openCart, hydrated } = useShop()
  const artRef = useRef<HTMLDivElement>(null)
  const favorite = hydrated && isFavorite(product.id)

  const handleAdd = () => {
    addToCart(product.id, 1, artRef.current?.getBoundingClientRect() ?? null)
    openCart()
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      // Leaving is quick and un-staggered: a filter that takes a second to
      // settle reads as lag, not as polish.
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.16, ease: ease.swift } }}
      transition={{ duration: duration.base, ease: ease.outExpo, delay: Math.min(index, 5) * 0.03 }}
      className="group h-full"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-4xl border border-line bg-elevated transition-[border-color,transform] duration-500 ease-out-expo group-hover:-translate-y-1 group-hover:border-line-strong">
        {/* Only the artwork tilts. Controls stay in an untransformed layer so
            their hit areas match what the pointer can see. */}
        <TiltCard
          max={8}
          lift={12}
          className="aspect-square overflow-hidden"
          layerClassName="absolute inset-0"
          layer={<ProductArt product={product} interactive className="h-full w-full" />}
        >
          <div ref={artRef} className="absolute inset-0">
            {onQuickView ? (
              <button
                type="button"
                onClick={() =>
                  onQuickView(product, artRef.current?.getBoundingClientRect() ?? null)
                }
                data-cursor="expand"
                data-cursor-label="Pogledaj"
                aria-label={`Brzi pregled — ${product.name}`}
                className="absolute inset-0 z-10 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-brand"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'pointer-events-none absolute inset-x-4 bottom-4 flex h-10 items-center justify-center gap-2',
                    'rounded-xl border border-line-strong bg-canvas/80 text-sm text-ink backdrop-blur',
                    'translate-y-3 opacity-0 transition-all duration-300 ease-out-expo',
                    'group-hover:translate-y-0 group-hover:opacity-100',
                    'group-focus-within:translate-y-0 group-focus-within:opacity-100',
                  )}
                >
                  <Expand className="h-4 w-4" />
                  Brzi pregled
                </span>
              </button>
            ) : null}

            {product.badges.length > 0 ? (
              <ul className="pointer-events-none absolute inset-x-4 top-4 pr-11 z-20 flex flex-wrap gap-1.5">
                {product.badges.map((badge) => (
                  <li key={badge}>
                    <Badge tone={BADGE_TONE[badge]} size="sm">
                      {badge}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : null}

            {!product.inStock ? (
              <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center bg-canvas/70 backdrop-blur-sm">
                <span className="rounded-full border border-line bg-elevated px-4 py-1.5 text-xs text-ink-muted">
                  Trenutno nedostupno
                </span>
              </div>
            ) : null}

            <FavoriteButton
              active={favorite}
              productName={product.name}
              onToggle={() => toggleFavorite(product.id)}
            />
          </div>
        </TiltCard>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-medium leading-snug text-ink">
              <Link
                href={routes.product(product.slug)}
                className="transition-colors hover:text-brand-text focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
              >
                {product.name}
              </Link>
            </h3>
            <div className="shrink-0 text-right">
              <p data-numeric className="text-base font-semibold text-ink">
                {formatRsd(product.price)}
              </p>
              {product.compareAt ? (
                <p data-numeric className="text-xs text-ink-subtle line-through">
                  {formatRsd(product.compareAt)}
                </p>
              ) : null}
            </div>
          </div>

          <p className="line-clamp-2 text-sm text-ink-subtle">{product.tagline}</p>

          <p className="rounded-xl bg-brand/8 px-3 py-2 text-xs leading-relaxed text-brand-text">
            {product.impact}
          </p>

          <button
            type="button"
            onClick={handleAdd}
            disabled={!product.inStock}
            className={cn(
              'mt-auto flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-medium',
              'border border-line bg-surface text-ink transition-all duration-300 ease-out-expo',
              'hover:border-transparent hover:bg-brand hover:text-brand-ink',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
              'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40',
            )}
          >
            <Plus className="h-4 w-4" />
            Dodaj u korpu
          </button>
        </div>
      </div>
    </motion.article>
  )
}

/**
 * Heart toggle with a one-shot particle burst. The particles are decorative and
 * unmount as soon as they finish, so nothing keeps animating off-screen.
 */
function FavoriteButton({
  active,
  productName,
  onToggle,
}: {
  active: boolean
  productName: string
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      aria-label={active ? `Ukloni ${productName} iz omiljenih` : `Dodaj ${productName} u omiljene`}
      // The pill reads 36px by design; the pseudo-element grows the touch
      // target to 44 without changing a pixel of the layout. Same technique the
      // report flow's chips use. It sits above the quick-view overlay (`z-20`
      // over `z-10`), so a thumb aiming at the heart gets the heart.
      className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full bg-canvas/80 text-ink-muted backdrop-blur transition-colors hover:text-critical focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand before:absolute before:-inset-1 before:content-['']"
    >
      <motion.span
        animate={active ? { scale: [1, 1.35, 1] } : { scale: 1 }}
        transition={spring.pop}
      >
        <Heart
          className={cn('h-4 w-4 transition-colors', active && 'fill-critical text-critical')}
        />
      </motion.span>

      <AnimatePresence>
        {active
          ? Array.from({ length: 6 }).map((_, particle) => (
              <motion.span
                key={particle}
                aria-hidden="true"
                data-decor
                className="pointer-events-none absolute h-1 w-1 rounded-full bg-critical"
                initial={{ scale: 1, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: 0,
                  x: Math.cos((particle / 6) * Math.PI * 2) * 22,
                  y: Math.sin((particle / 6) * Math.PI * 2) * 22,
                  opacity: 0,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: ease.outQuart }}
              />
            ))
          : null}
      </AnimatePresence>
    </button>
  )
}
