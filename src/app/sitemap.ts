import { MetadataRoute } from 'next'
import { blogStoryAdapter } from '@/lib/storage/file-adapter'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://doggzy.org'
  const lastModified = new Date()

  // Main public pages
  const routes = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/adopt`,
      lastModified,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/foster`,
      lastModified,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sponsor`,
      lastModified,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified,
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/stories`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/donate`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/impact`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/partners`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    // Application pages
    {
      url: `${baseUrl}/adopt/apply`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/foster/apply`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/careers/apply`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    // Legal pages
    {
      url: `${baseUrl}/privacy`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/accessibility`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/refunds`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/report`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
  ]

  // Get published stories for dynamic routes
  try {
    const storiesResult = await blogStoryAdapter.getAll(
      { status: 'published', limit: 1000 },
      { field: 'publishedAt', direction: 'desc' }
    )

    const storyRoutes = storiesResult.items.map(story => ({
      url: `${baseUrl}/stories/${story.slug}`,
      lastModified: new Date(story.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    routes.push(...storyRoutes)
  } catch (error) {
    console.error('Failed to generate story routes for sitemap:', error)
  }

  return routes
}
