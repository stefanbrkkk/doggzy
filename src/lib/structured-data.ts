import { routes, site } from '@/config/site'
import type { Dog } from '@/content/dogs'
import type { Product } from '@/content/products'
import type { Story } from '@/content/stories'

/**
 * JSON-LD builders.
 *
 * Every field here is backed by something the site actually publishes.
 *
 * In particular: no `aggregateRating` anywhere, no `nonprofitStatus`, and no
 * `sameAs`. The shop has never taken an order, so a rating is a number nobody
 * gave; the association's registration is still in progress; and `sameAs`
 * asserts ownership of profiles. Structured data that overstates is worse than
 * none — it is the version a search engine quotes back, and on this site it
 * would be rendered as stars.
 */

const url = (path: string) => `${site.url}${path}`

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${site.url}#organization`,
    name: site.name,
    url: site.url,
    description: site.description,
    email: site.email,
    areaServed: { '@type': 'Country', name: 'Srbija' },
    knowsLanguage: 'sr-Latn-RS',
  }
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site.url}#website`,
    url: site.url,
    name: site.name,
    inLanguage: 'sr-Latn-RS',
    publisher: { '@id': `${site.url}#organization` },
  }
}

export function productSchema(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    category: product.category,
    url: url(routes.product(product.slug)),
    brand: { '@type': 'Brand', name: site.name },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'RSD',
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: url(routes.product(product.slug)),
    },
  }
}

export function articleSchema(story: Story) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: story.title,
    description: story.dek,
    datePublished: story.publishedAt,
    inLanguage: 'sr-Latn-RS',
    author: { '@type': 'Organization', name: story.author },
    publisher: { '@id': `${site.url}#organization` },
    mainEntityOfPage: url(routes.story(story.slug)),
  }
}

/**
 * A listed dog is not a Product — it is not for sale. `Article` with the dog as
 * the subject is the honest mapping, and it keeps adoption listings out of
 * shopping results.
 */
export function dogSchema(dog: Dog) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${dog.name} — ${dog.city}`,
    description: dog.summary,
    datePublished: dog.arrivedAt,
    dateModified: dog.timeline.at(-1)?.date ?? dog.arrivedAt,
    inLanguage: 'sr-Latn-RS',
    publisher: { '@id': `${site.url}#organization` },
    mainEntityOfPage: url(routes.dog(dog.slug)),
    about: {
      '@type': 'Thing',
      name: dog.name,
      description: `${dog.breedGuess}, ${dog.ageLabel}, ${dog.sex}`,
    },
  }
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      item: url(entry.path),
    })),
  }
}
