'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { spring } from '@/lib/motion'
import type { Product } from '@/content/products'
import { useShop } from '@/lib/store/shop-store'
import { Button } from '@/components/ui/button'
import { Stepper } from './cart-drawer'

/** Quantity picker plus the two purchase actions for a product page. */
export function ProductPurchase({ product }: { product: Product }) {
  const { addToCart, openCart, toggleFavorite, isFavorite, hydrated } = useShop()
  const [quantity, setQuantity] = useState(1)
  const anchorRef = useRef<HTMLDivElement>(null)
  const favorite = hydrated && isFavorite(product.id)

  const add = () => {
    addToCart(product.id, quantity, anchorRef.current?.getBoundingClientRect() ?? null)
    openCart()
  }

  return (
    <div ref={anchorRef} className="space-y-4">
      {product.inStock ? (
        <div className="flex flex-wrap items-center gap-3">
          <Stepper value={quantity} onChange={setQuantity} label={product.name} />

          <Button
            size="lg"
            onClick={add} // A real floor, so the row wraps instead of truncating: `buttonStyles`
            // sets `overflow-hidden`, which zeroes a flex item's automatic
            // minimum size, and the label was hard-clipped mid-word.
            className="min-w-[13rem] flex-1"
          >
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
            className="h-13 w-13 rounded-2xl"
          >
            <motion.span
              animate={favorite ? { scale: [1, 1.3, 1] } : { scale: 1 }}
              transition={spring.pop}
            >
              <Heart className={cn('h-5 w-5', favorite && 'fill-critical text-critical')} />
            </motion.span>
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-elevated p-5 text-sm text-ink-muted">
          Trenutno nije na stanju. Javi nam se na{' '}
          <a
            href="mailto:zdravo@doggzy.rs"
            className="text-brand-text underline underline-offset-4"
          >
            zdravo@doggzy.rs
          </a>{' '}
          i obavestićemo te kad stigne.
        </div>
      )}

      <p className="text-xs text-ink-subtle">
        Besplatna dostava preko 6.000 RSD · Zamena u roku od 14 dana
      </p>
    </div>
  )
}
