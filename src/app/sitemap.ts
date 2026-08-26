import type { MetadataRoute } from 'next'
import { routes, site } from '@/config/site'
import { products } from '@/content/products'
import { dogs } from '@/content/dogs'
import { stories } from '@/content/stories'

/** Every indexable route. Cart and favourites are excluded — they are personal. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const url = (path: string) => `${site.url}${path}`

  const staticEntries: MetadataRoute.Sitemap = (
    [
      { url: url(routes.home), priority: 1, changeFrequency: 'weekly' },
      { url: url(routes.report), priority: 0.9, changeFrequency: 'monthly' },
      { url: url(routes.dogs), priority: 0.9, changeFrequency: 'daily' },
      { url: url(routes.donate), priority: 0.8, changeFrequency: 'monthly' },
      { url: url(routes.shop), priority: 0.8, changeFrequency: 'weekly' },
      { url: url(routes.transparency), priority: 0.8, changeFrequency: 'weekly' },
      { url: url(routes.stories), priority: 0.7, changeFrequency: 'weekly' },
      { url: url(routes.about), priority: 0.6, changeFrequency: 'monthly' },
      { url: url(routes.contact), priority: 0.5, changeFrequency: 'yearly' },
      { url: url(routes.privacy), priority: 0.3, changeFrequency: 'yearly' },
      { url: url(routes.terms), priority: 0.3, changeFrequency: 'yearly' },
      { url: url(routes.accessibility), priority: 0.3, changeFrequency: 'yearly' },
    ] satisfies MetadataRoute.Sitemap
  ).map((entry) => ({ ...entry, lastModified: now }))

  return [
    ...staticEntries,
    ...dogs.map((dog) => ({
      url: url(routes.dog(dog.slug)),
      lastModified: new Date(dog.timeline.at(-1)?.date ?? dog.arrivedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...products.map((product) => ({
      url: url(routes.product(product.slug)),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...stories.map((story) => ({
      url: url(routes.story(story.slug)),
      lastModified: new Date(story.publishedAt),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ]
}
