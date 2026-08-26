'use client'

import { useDeferredValue, useMemo, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { Leaf, PackageCheck, Search, SlidersHorizontal, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { duration, ease, spring } from '@/lib/motion'
import { productCategories, products, type Product, type ProductCategory } from '@/content/products'
import { ProductCard } from './product-card'

type Sort = 'popularno' | 'cena-rastuce' | 'cena-opadajuce' | 'ocena' | 'najnovije'

const SORTS: { value: Sort; label: string }[] = [
  { value: 'popularno', label: 'Najpopularnije' },
  { value: 'najnovije', label: 'Najnovije' },
  { value: 'cena-rastuce', label: 'Cena: niža prvo' },
  { value: 'cena-opadajuce', label: 'Cena: viša prvo' },
  { value: 'ocena', label: 'Najbolje ocenjeno' },
]

const ALL = 'Sve' as const
type Filter = typeof ALL | ProductCategory

/**
 * Catalogue with animated filtering.
 *
 * Filtering is a `layout` animation rather than a re-render swap: cards that
 * survive a filter change glide to their new grid position instead of
 * disappearing and reappearing, which is what makes the grid feel like one
 * object being sorted rather than a page reload.
 */
export function ShopClient() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Filter>(ALL)
  const [sort, setSort] = useState<Sort>('popularno')
  const [ecoOnly, setEcoOnly] = useState(false)
  const [inStockOnly, setInStockOnly] = useState(false)

  // Keeps typing responsive on a long list without debounce timers.
  const deferredQuery = useDeferredValue(query)

  const visible = useMemo(() => {
    const needle = deferredQuery.trim().toLowerCase()

    const filtered = products.filter((product) => {
      if (category !== ALL && product.category !== category) return false
      if (ecoOnly && !product.badges.includes('eko')) return false
      if (inStockOnly && !product.inStock) return false
      if (!needle) return true

      return (
        product.name.toLowerCase().includes(needle) ||
        product.tagline.toLowerCase().includes(needle) ||
        product.description.toLowerCase().includes(needle) ||
        product.tags.some((tag) => tag.toLowerCase().includes(needle))
      )
    })

    // Copy before sorting: `products` is module state shared across renders.
    return [...filtered].sort((a, b) => {
      switch (sort) {
        case 'cena-rastuce':
          return a.price - b.price
        case 'cena-opadajuce':
          return b.price - a.price
        case 'ocena':
          return b.rating - a.rating
        case 'najnovije':
          return a.releasedRank - b.releasedRank
        default:
          return b.reviews - a.reviews
      }
    })
  }, [category, deferredQuery, ecoOnly, inStockOnly, sort])

  const hasFilters = category !== ALL || ecoOnly || inStockOnly || query.length > 0

  const clearAll = () => {
    setQuery('')
    setCategory(ALL)
    setEcoOnly(false)
    setInStockOnly(false)
  }

  return (
    <div className="space-y-10">
      {/* One blurred surface, not two stacked: backdrop-filter re-samples the
          page behind it every frame, and the outer layer was invisible anyway. */}
      <div className="sticky top-20 z-40 -mx-2 rounded-3xl px-2 py-3">
        <div className="glass-strong rounded-3xl p-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle"
              />
              <label htmlFor="shop-search" className="sr-only">
                Pretraži proizvode
              </label>
              <input
                id="shop-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Pretraži proizvode…"
                className="h-11 w-full rounded-xl border border-line-interactive bg-sunken pl-10 pr-4 text-sm text-ink placeholder:text-ink-subtle focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15"
              />
            </div>

            <div className="flex items-center gap-2">
              <Toggle active={ecoOnly} onClick={() => setEcoOnly((value) => !value)} icon={Leaf}>
                Eko
              </Toggle>
              <Toggle
                active={inStockOnly}
                onClick={() => setInStockOnly((value) => !value)}
                icon={PackageCheck}
              >
                Na stanju
              </Toggle>

              <div className="relative">
                <SlidersHorizontal
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle"
                />
                <label htmlFor="shop-sort" className="sr-only">
                  Sortiranje
                </label>
                <select
                  id="shop-sort"
                  value={sort}
                  onChange={(event) => setSort(event.target.value as Sort)}
                  className="h-11 appearance-none rounded-xl border border-line-interactive bg-sunken pl-9 pr-8 text-sm text-ink focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15"
                >
                  {SORTS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <LayoutGroup id="shop-categories">
            <ul className="mt-3 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {[ALL, ...productCategories].map((option) => {
                const active = category === option
                return (
                  <li key={option}>
                    <button
                      type="button"
                      onClick={() => setCategory(option)}
                      aria-pressed={active}
                      className={cn(
                        'relative whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors',
                        active ? 'text-brand-ink' : 'text-ink-muted hover:text-ink',
                      )}
                    >
                      {active ? (
                        <motion.span
                          layoutId="shop-category-pill"
                          className="absolute inset-0 rounded-full bg-brand"
                          transition={spring.surface}
                        />
                      ) : null}
                      <span className="relative z-10">{option}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </LayoutGroup>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-ink-subtle" aria-live="polite">
          <span data-numeric>{visible.length}</span>{' '}
          {visible.length === 1 ? 'proizvod' : visible.length < 5 ? 'proizvoda' : 'proizvoda'}
        </p>
        <AnimatePresence>
          {hasFilters ? (
            <motion.button
              type="button"
              onClick={clearAll}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: duration.fast, ease: ease.swift }}
              className="flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
              Poništi filtere
            </motion.button>
          ) : null}
        </AnimatePresence>
      </div>

      {visible.length === 0 ? (
        <EmptyState onClear={clearAll} />
      ) : (
        <motion.ul layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {visible.map((product: Product, index) => (
              <motion.li key={product.id} layout transition={spring.surface}>
                <ProductCard product={product} index={index} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  )
}

function Toggle({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean
  onClick: () => void
  icon: typeof Leaf
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex h-11 items-center gap-2 rounded-xl border px-3.5 text-sm transition-colors',
        active
          ? 'border-brand bg-brand/12 text-brand-text'
          : 'border-line bg-sunken text-ink-muted hover:text-ink',
      )}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {children}
    </button>
  )
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-4xl border border-dashed border-line py-24 text-center">
      <Search className="h-7 w-7 text-ink-subtle" aria-hidden="true" />
      <div className="space-y-1.5">
        <p className="text-headline text-ink">Ništa ne odgovara pretrazi</p>
        <p className="text-sm text-ink-muted">Probaj drugu reč ili poništi filtere.</p>
      </div>
      <button
        type="button"
        onClick={onClear}
        className="text-sm text-brand-text underline underline-offset-4"
      >
        Poništi filtere
      </button>
    </div>
  )
}
