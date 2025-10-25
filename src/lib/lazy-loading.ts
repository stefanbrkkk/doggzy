import React, { lazy } from 'react'

// Lazy load components for better performance
export const LazyHeroSection = lazy(() => 
  import('@/components/hero-section').then(module => ({ default: module.HeroSection }))
)

export const LazyImpactStats = lazy(() => 
  import('@/components/impact-stats').then(module => ({ default: module.ImpactStats }))
)

export const LazySuccessStories = lazy(() => 
  import('@/components/success-stories').then(module => ({ default: module.SuccessStories }))
)

export const LazyGlobalPartners = lazy(() => 
  import('@/components/global-partners').then(module => ({ default: module.GlobalPartners }))
)

export const LazyShopPreview = lazy(() => 
  import('@/components/home/shop-preview').then(module => ({ default: module.ShopPreview }))
)

// Admin components
export const LazyMediaManagement = lazy(() => 
  import('@/app/admin/media/page').then(module => ({ default: module.default }))
)

// Utility function for creating lazy components with loading fallback
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) {
  const LazyComponent = lazy(importFn)
  
  return function LazyWrapper(props: React.ComponentProps<T>) {
    return (
      <React.Suspense fallback={fallback ? React.createElement(fallback) : <div>Loading...</div>}>
        <LazyComponent {...props} />
      </React.Suspense>
    )
  }
}

// Loading skeleton components
export const ComponentSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
  </div>
)

export const HeroSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center animate-pulse">
    <div className="container mx-auto px-4">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          <div className="flex gap-4">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          </div>
        </div>
        <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
      </div>
    </div>
  </div>
)
