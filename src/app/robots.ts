import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://doggzy.org'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/about',
          '/adopt',
          '/foster',
          '/sponsor',
          '/shop',
          '/donate',
          '/impact',
          '/careers',
          '/contact',
          '/partners',
          '/privacy',
          '/terms',
          '/accessibility',
          '/refunds',
          '/cookies',
        ],
        disallow: [
          '/admin',
          '/api/',
          '/_next/',
          '/test-lang',
          '/basket',
          '/favorites',
          '/*.json',
          '/*?*', // Query parameters
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        disallow: '/',
      },
      {
        userAgent: 'Claude-Web',
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
