export interface RouteConfig {
  path: string
  canonical?: string
  includeInSitemap?: boolean
  changeFreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
  lastModified?: string
}

export const routes: RouteConfig[] = [
  // Main pages
  {
    path: '/',
    includeInSitemap: true,
    changeFreq: 'weekly',
    priority: 1.0
  },
  {
    path: '/adopt',
    includeInSitemap: true,
    changeFreq: 'weekly',
    priority: 0.9
  },
  {
    path: '/foster',
    includeInSitemap: true,
    changeFreq: 'weekly',
    priority: 0.9
  },
  {
    path: '/donate',
    includeInSitemap: true,
    changeFreq: 'monthly',
    priority: 0.9
  },
  {
    path: '/shop',
    includeInSitemap: true,
    changeFreq: 'weekly',
    priority: 0.8
  },
  {
    path: '/sponsor',
    includeInSitemap: true,
    changeFreq: 'daily',
    priority: 0.8
  },
  
  // Information pages
  {
    path: '/impact',
    includeInSitemap: true,
    changeFreq: 'monthly',
    priority: 0.7
  },
  {
    path: '/partners',
    includeInSitemap: true,
    changeFreq: 'monthly',
    priority: 0.7
  },
  {
    path: '/about',
    includeInSitemap: true,
    changeFreq: 'monthly',
    priority: 0.7
  },
  {
    path: '/careers',
    includeInSitemap: true,
    changeFreq: 'weekly',
    priority: 0.6
  },
  {
    path: '/contact',
    includeInSitemap: true,
    changeFreq: 'monthly',
    priority: 0.6
  },
  {
    path: '/report',
    includeInSitemap: true,
    changeFreq: 'yearly',
    priority: 0.5
  },
  
  // Application pages
  {
    path: '/adopt/apply',
    includeInSitemap: false,
    changeFreq: 'monthly',
    priority: 0.5
  },
  {
    path: '/foster/apply',
    includeInSitemap: false,
    changeFreq: 'monthly',
    priority: 0.5
  },
  {
    path: '/careers/apply',
    includeInSitemap: false,
    changeFreq: 'monthly',
    priority: 0.5
  },
  
  // User pages
  {
    path: '/favorites',
    includeInSitemap: false,
    changeFreq: 'never',
    priority: 0.1
  },
  {
    path: '/basket',
    includeInSitemap: false,
    changeFreq: 'never',
    priority: 0.1
  },
  
  // Legal pages
  {
    path: '/terms',
    includeInSitemap: true,
    changeFreq: 'yearly',
    priority: 0.3
  },
  {
    path: '/privacy',
    includeInSitemap: true,
    changeFreq: 'yearly',
    priority: 0.3
  },
  {
    path: '/cookies',
    includeInSitemap: true,
    changeFreq: 'yearly',
    priority: 0.3
  },
  {
    path: '/accessibility',
    includeInSitemap: true,
    changeFreq: 'yearly',
    priority: 0.3
  },
  {
    path: '/refunds',
    includeInSitemap: true,
    changeFreq: 'yearly',
    priority: 0.3
  },
  
  // Admin pages
  {
    path: '/admin',
    includeInSitemap: false,
    changeFreq: 'never',
    priority: 0.1
  }
]

export const dynamicRoutes = {
  // Future dynamic routes
  products: {
    pattern: '/shop/[slug]',
    includeInSitemap: true,
    changeFreq: 'weekly' as const,
    priority: 0.6
  },
  dogs: {
    pattern: '/sponsor/[slug]',
    includeInSitemap: true,
    changeFreq: 'daily' as const,
    priority: 0.7
  },
  stories: {
    pattern: '/stories/[slug]',
    includeInSitemap: true,
    changeFreq: 'monthly' as const,
    priority: 0.6
  }
}

export function getRouteConfig(path: string): RouteConfig | undefined {
  return routes.find(route => route.path === path)
}

export function getSitemapRoutes(): RouteConfig[] {
  return routes.filter(route => route.includeInSitemap)
}

export function getCanonicalUrl(path: string, baseUrl: string = 'https://doggzy.org'): string {
  const route = getRouteConfig(path)
  if (route?.canonical) {
    return route.canonical
  }
  
  // Remove trailing slash except for root
  const cleanPath = path === '/' ? path : path.replace(/\/$/, '')
  return `${baseUrl}${cleanPath}`
}
