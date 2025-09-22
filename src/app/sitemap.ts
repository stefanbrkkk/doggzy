import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://doggzy.org'
  
  const routes = [
    '',
    '/about',
    '/adopt',
    '/adopt/apply',
    '/foster',
    '/foster/apply',
    '/donate',
    '/shop',
    '/sponsor',
    '/impact',
    '/careers',
    '/careers/apply',
    '/contact',
    '/partners',
    '/privacy',
    '/terms',
    '/cookies',
    '/accessibility',
    '/refunds',
    '/report'
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 
                     route.includes('apply') ? 'monthly' : 
                     route.includes('shop') || route.includes('adopt') || route.includes('foster') || route.includes('sponsor') ? 'weekly' : 
                     'monthly',
    priority: route === '' ? 1 : 
              route === '/adopt' || route === '/donate' || route === '/foster' ? 0.9 : 
              route === '/shop' || route === '/sponsor' || route === '/impact' ? 0.8 : 
              route.includes('apply') ? 0.7 : 
              0.6,
  }))
}