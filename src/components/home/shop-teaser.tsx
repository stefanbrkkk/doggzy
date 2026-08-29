'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { routes } from '@/config/site'
import { products } from '@/content/products'
import { buttonStyles } from '@/components/ui/button'
import { Container, SectionHeader } from '@/components/ui/section'
import { ProductCard } from '@/components/shop/product-card'

const FEATURED = ['p-gps-ogrlica', 'p-ortho-lezaj', 'p-duks', 'p-poslastice']

export function ShopTeaser() {
  const featured = FEATURED.map((id) => products.find((product) => product.id === id)).filter(
    (product): product is (typeof products)[number] => Boolean(product),
  )

  return (
    <section className="relative py-section">
      <Container>
        <SectionHeader
          eyebrow="Prodavnica"
          title="Kupi psu nešto — plati nekom drugom psu pregled"
          lead="Sav profit ide u negu. Na svakom proizvodu piše tačno koju stavku pokriva."
          action={
            <Link
              href={routes.shop}
              className={cn(buttonStyles({ variant: 'secondary', size: 'md' }))}
            >
              Cela prodavnica
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product, index) => (
            <li key={product.id}>
              <ProductCard product={product} index={index} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
