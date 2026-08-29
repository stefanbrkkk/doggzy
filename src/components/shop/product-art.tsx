import type { Product } from '@/content/products'
import { GenerativeArt } from '@/components/visuals/generative-art'

export interface ProductArtProps {
  product: Product
  className?: string
  /** Adds the hover choreography. Turn off for static contexts like the cart. */
  interactive?: boolean
}

/** Cover art for a product, seeded by its stable id. */
export function ProductArt({ product, className, interactive }: ProductArtProps) {
  return (
    <GenerativeArt
      seed={product.id}
      shape={product.art.shape}
      from={product.art.from}
      to={product.art.to}
      alt={`Ilustracija — ${product.name}`}
      className={className}
      interactive={interactive}
    />
  )
}
