// Performance monitoring and optimization utilities

export interface PerformanceMetrics {
  lcp?: number
  fid?: number
  cls?: number
  fcp?: number
  ttfb?: number
}

// Web Vitals tracking
export function trackWebVitals(metric: any) {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    // Send to analytics service
    console.log('Web Vital:', metric)
    
    // Example: Send to Google Analytics
    if (window.gtag) {
      window.gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        non_interaction: true,
      })
    }
  }
}

// Image optimization helper
export function getOptimizedImageProps(
  src: string,
  width: number,
  height: number,
  quality = 75
) {
  return {
    src,
    width,
    height,
    quality,
    placeholder: 'blur' as const,
    blurDataURL: generateBlurDataURL(width, height),
    loading: 'lazy' as const,
  }
}

// Generate blur placeholder
function generateBlurDataURL(width: number, height: number): string {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  
  if (ctx) {
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, '#f3f4f6')
    gradient.addColorStop(1, '#e5e7eb')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  }
  
  return canvas.toDataURL()
}

// Preload critical resources
export function preloadCriticalResources() {
  if (typeof window !== 'undefined') {
    // Preload fonts
    const fontLinks = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap',
      'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap',
    ]
    
    fontLinks.forEach(href => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'style'
      link.href = href
      document.head.appendChild(link)
    })
    
    // Preload critical images
    const criticalImages = [
      '/og-image.jpg',
      '/images/dogs/bella.svg',
      '/images/dogs/luna.svg',
      '/images/dogs/max.svg',
    ]
    
    criticalImages.forEach(src => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
    })
  }
}

// Intersection Observer for lazy loading
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
) {
  if (typeof window === 'undefined') return null
  
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  }
  
  return new IntersectionObserver(callback, defaultOptions)
}

// Debounce function for performance
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Throttle function for scroll events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Memory usage monitoring
export function monitorMemoryUsage() {
  if (typeof window !== 'undefined' && 'memory' in performance) {
    const memory = (performance as any).memory
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
    }
  }
  return null
}

// Bundle size analyzer helper
export function analyzeBundleSize() {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('Bundle analysis available with: npm run analyze')
  }
}

// Service Worker registration
export function registerServiceWorker() {
  if (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    process.env.NODE_ENV === 'production'
  ) {
    navigator.serviceWorker
      .register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration)
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError)
      })
  }
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}
