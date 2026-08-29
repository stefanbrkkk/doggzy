import type { MetadataRoute } from 'next'
import { site } from '@/config/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Only what has no crawlable HTML to carry its own directive. /korpa and
      // /omiljeno are `noindex` on the page, and a crawler that obeys a
      // disallow never fetches them — so the two mechanisms cancelled out and
      // both URLs, linked from the header on every page, could still be listed
      // as bare URLs with no snippet.
      disallow: ['/admin', '/api/'],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  }
}
