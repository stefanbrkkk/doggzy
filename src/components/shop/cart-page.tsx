'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ShoppingBag, Trash2 } from 'lucide-react'
import { cn, formatRsd } from '@/lib/utils'
import { duration, ease, spring } from '@/lib/motion'
import { routes } from '@/config/site'
import { useShop } from '@/lib/store/shop-store'
import { buttonStyles } from '@/components/ui/button'
import { ProductArt } from './product-art'
import { Stepper } from './cart-drawer'

export function CartPage() {
  const {
    hydrated,
    entries,
    subtotal,
    shipping,
    total,
    freeShippingThreshold,
    setQuantity,
    removeFromCart,
    clearCart,
  } = useShop()

  // The cart lives in localStorage, so there is nothing to render until the
  // client has read it. A skeleton avoids flashing "empty" at returning visitors.
  if (!hydrated) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <ul className="space-y-3" aria-hidden="true">
          {[0, 1].map((row) => (
            <li
              key={row}
              className="h-32 animate-pulse rounded-3xl border border-line bg-elevated"
            />
          ))}
        </ul>
        <div
          className="h-64 animate-pulse rounded-3xl border border-line bg-elevated"
          aria-hidden="true"
        />
        <p className="sr-only">Učitavanje korpe…</p>
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center gap-5 rounded-5xl border border-dashed border-line py-28 text-center">
        <ShoppingBag className="h-8 w-8 text-ink-subtle" aria-hidden="true" />
        <div className="space-y-1.5">
          <p className="text-headline text-ink">Korpa je prazna</p>
          <p className="text-sm text-ink-muted">Sav profit od prodaje ide u negu pasa.</p>
        </div>
        <Link href={routes.shop} className={cn(buttonStyles({ size: 'md' }))}>
          Pogledaj proizvode
        </Link>
      </div>
    )
  }

  const remaining = Math.max(0, freeShippingThreshold - subtotal)

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
      <ul className="space-y-3">
        <AnimatePresence initial={false} mode="popLayout">
          {entries.map((entry) => (
            <motion.li
              key={entry.product.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }}
              transition={spring.surface}
              className="flex gap-5 rounded-3xl border border-line bg-elevated p-4 sm:p-5"
            >
              <Link
                href={routes.product(entry.product.slug)}
                className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl"
              >
                <ProductArt product={entry.product} className="h-full w-full" />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <Link
                      href={routes.product(entry.product.slug)}
                      className="text-base font-medium text-ink transition-colors hover:text-brand-text"
                    >
                      {entry.product.name}
                    </Link>
                    <p className="mt-1 line-clamp-1 text-sm text-ink-subtle">
                      {entry.product.tagline}
                    </p>
                    <p className="mt-2 text-xs text-brand-text">{entry.product.impact}</p>
                  </div>
                  <p data-numeric className="shrink-0 text-base font-semibold text-ink">
                    {formatRsd(entry.lineTotal)}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <Stepper
                    value={entry.quantity}
                    onChange={(next) => setQuantity(entry.product.id, next)}
                    label={entry.product.name}
                  />
                  <button
                    type="button"
                    onClick={() => removeFromCart(entry.product.id)}
                    aria-label={`Ukloni ${entry.product.name}`}
                    className="flex items-center gap-1.5 text-sm text-ink-subtle transition-colors hover:text-critical"
                  >
                    <Trash2 className="h-4 w-4" />
                    Ukloni
                  </button>
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <aside className="space-y-4 rounded-3xl border border-line bg-elevated p-6 lg:sticky lg:top-28">
        <h2 className="text-headline text-ink">Pregled</h2>

        <dl className="space-y-2 text-sm">
          <Row label="Međuzbir" value={formatRsd(subtotal)} />
          <Row label="Dostava" value={shipping === 0 ? 'Besplatno' : formatRsd(shipping)} />
          <div className="flex items-baseline justify-between border-t border-line pt-3">
            <dt className="text-base font-medium text-ink">Ukupno</dt>
            <dd data-numeric className="text-base font-semibold text-ink">
              {formatRsd(total)}
            </dd>
          </div>
        </dl>

        {remaining > 0 ? (
          <div className="space-y-2 rounded-2xl bg-sunken p-3">
            <p className="text-xs text-ink-muted">
              Još{' '}
              <span data-numeric className="text-ink">
                {formatRsd(remaining)}
              </span>{' '}
              do besplatne dostave
            </p>
            <div className="h-1 overflow-hidden rounded-full bg-line-strong">
              <motion.div
                className="h-full rounded-full bg-brand"
                initial={false}
                animate={{ scaleX: Math.min(1, subtotal / freeShippingThreshold) }}
                style={{ originX: 0 }}
                transition={{ duration: duration.slow, ease: ease.outExpo }}
              />
            </div>
          </div>
        ) : null}

        {/* Payments are not connected yet. Saying so beats a button that leads nowhere. */}
        <div className="rounded-2xl border border-line bg-sunken p-4 text-sm leading-relaxed text-ink-muted">
          Naplata još nije uključena. Dok je ne povežemo, pošalji nam korpu na{' '}
          <a
            href="mailto:zdravo@doggzy.rs"
            className="text-brand-text underline underline-offset-4"
          >
            zdravo@doggzy.rs
          </a>{' '}
          i dogovaramo se oko dostave i plaćanja.
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="w-full text-center text-sm text-ink-subtle transition-colors hover:text-critical"
        >
          Isprazni korpu
        </button>
      </aside>
    </div>
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
