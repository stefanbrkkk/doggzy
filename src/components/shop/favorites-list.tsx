'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { spring } from '@/lib/motion'
import { routes } from '@/config/site'
import { useShop } from '@/lib/store/shop-store'
import { buttonStyles } from '@/components/ui/button'
import { ProductCard } from './product-card'

export function FavoritesList() {
  const { hydrated, favorites } = useShop()

  if (!hydrated) {
    return (
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-hidden="true">
        {[0, 1, 2, 3].map((card) => (
          <li
            key={card}
            className="h-96 animate-pulse rounded-4xl border border-line bg-elevated"
          />
        ))}
      </ul>
    )
  }

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center gap-5 rounded-5xl border border-dashed border-line py-28 text-center">
        <Heart className="h-8 w-8 text-ink-subtle" aria-hidden="true" />
        <div className="space-y-1.5">
          <p className="text-headline text-ink">Još ništa nije sačuvano</p>
          <p className="text-sm text-ink-muted">
            Klikni na srce na bilo kom proizvodu da ga dodaš ovde.
          </p>
        </div>
        <Link href={routes.shop} className={cn(buttonStyles({ size: 'md' }))}>
          U prodavnicu
        </Link>
      </div>
    )
  }

  return (
    <motion.ul layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <AnimatePresence mode="popLayout">
        {favorites.map((product, index) => (
          <motion.li key={product.id} layout transition={spring.surface}>
            <ProductCard product={product} index={index} />
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  )
}
