'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { cn, formatRsd } from '@/lib/utils'
import { duration, ease, spring } from '@/lib/motion'
import { routes } from '@/config/site'
import { lockScroll } from '@/lib/scroll-lock'
import { MAX_QTY, useShop } from '@/lib/store/shop-store'
import { buttonStyles } from '@/components/ui/button'
import { ProductArt } from '@/components/shop/product-art'

export function CartDrawer() {
  const {
    isCartOpen,
    closeCart,
    entries,
    subtotal,
    shipping,
    total,
    freeShippingThreshold,
    setQuantity,
    removeFromCart,
    itemCount,
  } = useShop()

  const panelRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  // Focus management: trap Tab inside the panel, restore focus on close.
  useEffect(() => {
    if (!isCartOpen) return

    previouslyFocused.current = document.activeElement as HTMLElement | null
    const release = lockScroll()

    const panel = panelRef.current
    panel?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeCart()
        return
      }
      if (event.key !== 'Tab' || !panel) return

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
      previouslyFocused.current?.focus?.()
    }
    // Deliberately keyed on `isCartOpen` alone. `closeCart` is recreated by the
    // provider on every cart mutation, and including it re-ran this effect —
    // and its `panel.focus()` — after each quantity change, yanking focus off
    // the stepper a keyboard user was still using.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCartOpen])

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal)
  const shippingProgress = Math.min(1, subtotal / freeShippingThreshold)

  return (
    <AnimatePresence>
      {isCartOpen ? (
        <div className="fixed inset-0 z-[120]" role="dialog" aria-modal="true" aria-label="Korpa">
          <motion.button
            type="button"
            aria-label="Zatvori korpu"
            className="absolute inset-0 h-full w-full cursor-default bg-black/55 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.fast }}
            onClick={closeCart}
          />

          <motion.div
            ref={panelRef}
            tabIndex={-1}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-line bg-surface outline-none sm:w-[27rem]"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={spring.sheet}
          >
            <header className="flex items-center justify-between border-b border-line px-6 py-5">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-brand" aria-hidden="true" />
                <h2 className="text-headline text-ink">Korpa</h2>
                {itemCount > 0 ? (
                  <span data-numeric className="text-sm text-ink-subtle">
                    {itemCount}
                  </span>
                ) : null}
              </div>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Zatvori korpu"
                className="grid h-9 w-9 place-items-center rounded-lg text-ink-muted transition-colors hover:bg-elevated hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            {entries.length === 0 ? (
              <EmptyCart onClose={closeCart} />
            ) : (
              <>
                <div className="border-b border-line px-6 py-4">
                  <p className="text-sm text-ink-muted">
                    {remainingForFreeShipping > 0 ? (
                      <>
                        Još{' '}
                        <strong className="text-ink">{formatRsd(remainingForFreeShipping)}</strong>{' '}
                        do besplatne dostave
                      </>
                    ) : (
                      <span className="text-positive">Dostava je besplatna.</span>
                    )}
                  </p>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-sunken">
                    <motion.div
                      className="h-full rounded-full bg-linear-to-r from-brand to-iris-400"
                      initial={false}
                      animate={{ scaleX: shippingProgress }}
                      style={{ originX: 0 }}
                      transition={{ duration: duration.slow, ease: ease.outExpo }}
                    />
                  </div>
                </div>

                <ul className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
                  <AnimatePresence initial={false} mode="popLayout">
                    {entries.map((entry) => (
                      <motion.li
                        key={entry.product.id}
                        layout
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }}
                        transition={spring.surface}
                        className="flex gap-4 rounded-2xl border border-line bg-elevated p-3"
                      >
                        <Link
                          href={routes.product(entry.product.slug)}
                          onClick={closeCart}
                          className="h-20 w-20 shrink-0 overflow-hidden rounded-xl"
                        >
                          <ProductArt product={entry.product} className="h-full w-full" />
                        </Link>

                        <div className="flex min-w-0 flex-1 flex-col justify-between">
                          <div>
                            <Link
                              href={routes.product(entry.product.slug)}
                              onClick={closeCart}
                              className="line-clamp-1 text-sm font-medium text-ink hover:text-brand-text"
                            >
                              {entry.product.name}
                            </Link>
                            <p data-numeric className="mt-0.5 text-sm text-ink-muted">
                              {formatRsd(entry.lineTotal)}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <Stepper
                              value={entry.quantity}
                              onChange={(next) => setQuantity(entry.product.id, next)}
                              label={entry.product.name}
                              min={0}
                            />
                            <button
                              type="button"
                              onClick={() => removeFromCart(entry.product.id)}
                              aria-label={`Ukloni ${entry.product.name} iz korpe`}
                              className="grid h-8 w-8 place-items-center rounded-lg text-ink-subtle transition-colors hover:bg-critical/10 hover:text-critical"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <footer className="space-y-4 border-t border-line px-6 py-5">
                  <dl className="space-y-1.5 text-sm">
                    <Row label="Međuzbir" value={formatRsd(subtotal)} />
                    <Row
                      label="Dostava"
                      value={shipping === 0 ? 'Besplatno' : formatRsd(shipping)}
                    />
                    <div className="flex items-baseline justify-between border-t border-line pt-2.5">
                      <dt className="text-base font-medium text-ink">Ukupno</dt>
                      <dd data-numeric className="text-base font-semibold text-ink">
                        {formatRsd(total)}
                      </dd>
                    </div>
                  </dl>

                  <Link
                    href={routes.cart}
                    onClick={closeCart}
                    className={cn(buttonStyles({ size: 'lg', full: true }))}
                  >
                    Pregledaj korpu
                  </Link>
                  <p className="text-center text-xs text-ink-subtle">
                    Sav profit od prodaje ide u negu pasa.
                  </p>
                </footer>
              </>
            )}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <dt className="text-ink-muted">{label}</dt>
      <dd data-numeric className="text-ink">
        {value}
      </dd>
    </div>
  )
}

/**
 * Quantity control. Owns its own bounds rather than trusting each call site:
 * the reducer clamps to MAX_QTY anyway, so a UI that can count past it just
 * shows a total that will change by itself on the next page load.
 *
 * `min` is 0 inside the cart, where stepping below one line removes it, and 1
 * on the product page and in quick view, where there is nothing to remove.
 */
export function Stepper({
  value,
  onChange,
  label,
  min = 1,
}: {
  value: number
  onChange: (next: number) => void
  label: string
  min?: number
}) {
  const atMin = value <= min
  const atMax = value >= MAX_QTY

  return (
    <div className="inline-flex items-center rounded-lg border border-line">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={atMin}
        aria-label={`Smanji količinu — ${label}`}
        className="grid h-8 w-8 place-items-center rounded-l-lg text-ink-muted transition-colors hover:bg-sunken hover:text-ink disabled:pointer-events-none disabled:opacity-40"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span data-numeric className="w-8 text-center text-sm text-ink" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(MAX_QTY, value + 1))}
        disabled={atMax}
        aria-label={`Povećaj količinu — ${label}`}
        className="grid h-8 w-8 place-items-center rounded-r-lg text-ink-muted transition-colors hover:bg-sunken hover:text-ink disabled:pointer-events-none disabled:opacity-40"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
      <div className="relative grid h-20 w-20 place-items-center rounded-full border border-line bg-elevated">
        <ShoppingBag className="h-7 w-7 text-ink-subtle" aria-hidden="true" />
        <span
          aria-hidden="true"
          data-decor
          className="absolute inset-0 rounded-full border border-brand/30 animate-pulse-ring"
        />
      </div>
      <div className="space-y-1.5">
        <p className="text-headline text-ink">Korpa je prazna</p>
        <p className="text-sm text-ink-muted">
          Svaka kupovina plaća konkretnu stavku u nezi nekog psa.
        </p>
      </div>
      <Link href={routes.shop} onClick={onClose} className={cn(buttonStyles({ size: 'md' }))}>
        Pogledaj proizvode
      </Link>
    </div>
  )
}
