import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Star } from 'lucide-react'
import { formatRsd } from '@/lib/utils'
import { routes } from '@/config/site'
import { getProductBySlug, products, relatedProducts } from '@/content/products'
import { Container } from '@/components/ui/section'
import { Badge } from '@/components/ui/badge'
import { ProductArt } from '@/components/shop/product-art'
import { ProductCard } from '@/components/shop/product-card'
import { ProductPurchase } from '@/components/shop/product-purchase'
import { Reveal } from '@/components/motion'

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) return { title: 'Proizvod nije pronađen' }

  return {
    title: product.name,
    description: product.tagline,
    alternates: { canonical: routes.product(product.slug) },
    openGraph: { title: product.name, description: product.tagline },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) notFound()

  const related = relatedProducts(product)

  return (
    <>
      <section className="pb-16 pt-32 sm:pt-40">
        <Container>
          <Link
            href={routes.shop}
            className="inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            Prodavnica
          </Link>

          <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal direction="up">
              <div className="lg:sticky lg:top-28">
                <div className="overflow-hidden rounded-5xl border border-line">
                  <ProductArt product={product} className="aspect-square w-full" />
                </div>
                <dl className="mt-6 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-3">
                  {product.specs.map((spec) => (
                    <div key={spec.label} className="bg-elevated p-4">
                      <dt className="text-2xs uppercase tracking-widest text-ink-subtle">
                        {spec.label}
                      </dt>
                      <dd className="mt-1 text-sm text-ink">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>

            <div className="space-y-7">
              <Reveal direction="up" delay={0.06}>
                <div className="space-y-4">
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

                  <h1 className="text-title text-ink">{product.name}</h1>
                  <p className="text-lead text-ink-muted">{product.tagline}</p>

                  <div className="flex flex-wrap items-center gap-4">
                    <p className="flex items-baseline gap-3">
                      <span data-numeric className="text-headline text-ink">
                        {formatRsd(product.price)}
                      </span>
                      {product.compareAt ? (
                        <span data-numeric className="text-sm text-ink-subtle line-through">
                          {formatRsd(product.compareAt)}
                        </span>
                      ) : null}
                    </p>
                    <p className="flex items-center gap-1.5 text-sm text-ink-muted">
                      <Star className="h-4 w-4 fill-brand text-brand" aria-hidden="true" />
                      <span data-numeric>{product.rating.toFixed(1)}</span>
                      <span className="text-ink-subtle">
                        (<span data-numeric>{product.reviews}</span> ocena)
                      </span>
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal direction="up" delay={0.12}>
                <div className="rounded-3xl border border-brand/25 bg-brand/8 p-5">
                  <p className="text-2xs uppercase tracking-[0.2em] text-brand-text">Šta plaćaš</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink">{product.impact}</p>
                </div>
              </Reveal>

              <Reveal direction="up" delay={0.16}>
                <ProductPurchase product={product} />
              </Reveal>

              <Reveal direction="up" delay={0.2}>
                <div className="space-y-4 border-t border-line pt-7">
                  <h2 className="text-sm font-medium text-ink">Opis</h2>
                  <p className="text-sm leading-relaxed text-ink-muted">{product.description}</p>
                  <ul className="flex flex-wrap gap-1.5 pt-2">
                    {product.tags.map((tag) => (
                      <li key={tag}>
                        <Badge size="sm">{tag}</Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-section">
        <Container>
          <h2 className="text-headline text-ink">Možda ti treba i ovo</h2>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, index) => (
              <li key={item.id}>
                <ProductCard product={item} index={index} />
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  )
}
