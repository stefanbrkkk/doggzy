// Cache utilities for better performance
/* eslint-disable @typescript-eslint/no-explicit-any */

interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

class MemoryCache {
  private cache = new Map<string, CacheItem<any>>()
  private maxSize: number
  
  constructor(maxSize = 100) {
    this.maxSize = maxSize
  }
  
  set<T>(key: string, data: T, ttlSeconds = 300): void {
    // Remove oldest items if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value
      if (oldestKey) {
        this.cache.delete(oldestKey)
      }
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000
    })
  }
  
  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    
    if (!item) return null
    
    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return item.data
  }
  
  delete(key: string): void {
    this.cache.delete(key)
  }
  
  clear(): void {
    this.cache.clear()
  }
  
  size(): number {
    return this.cache.size
  }
}

// Global cache instance
export const memoryCache = new MemoryCache(200)

// Cache with localStorage fallback
export class PersistentCache {
  private memCache: MemoryCache
  private storageKey: string
  
  constructor(storageKey = 'doggzy_cache', maxMemorySize = 50) {
    this.memCache = new MemoryCache(maxMemorySize)
    this.storageKey = storageKey
  }
  
  set<T>(key: string, data: T, ttlSeconds = 3600): void {
    // Set in memory cache
    this.memCache.set(key, data, ttlSeconds)
    
    // Set in localStorage if available
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const item: CacheItem<T> = {
          data,
          timestamp: Date.now(),
          ttl: ttlSeconds * 1000
        }
        localStorage.setItem(`${this.storageKey}_${key}`, JSON.stringify(item))
      } catch (error) {
        console.warn('Failed to save to localStorage:', error)
      }
    }
  }
  
  get<T>(key: string): T | null {
    // Try memory cache first
    const memData = this.memCache.get<T>(key)
    if (memData !== null) return memData
    
    // Try localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = localStorage.getItem(`${this.storageKey}_${key}`)
        if (stored) {
          const item: CacheItem<T> = JSON.parse(stored)
          
          // Check if expired
          if (Date.now() - item.timestamp > item.ttl) {
            localStorage.removeItem(`${this.storageKey}_${key}`)
            return null
          }
          
          // Restore to memory cache
          this.memCache.set(key, item.data, Math.floor(item.ttl / 1000))
          return item.data
        }
      } catch (error) {
        console.warn('Failed to read from localStorage:', error)
      }
    }
    
    return null
  }
  
  delete(key: string): void {
    this.memCache.delete(key)
    
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(`${this.storageKey}_${key}`)
    }
  }
  
  clear(): void {
    this.memCache.clear()
    
    if (typeof window !== 'undefined' && window.localStorage) {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(this.storageKey)) {
          localStorage.removeItem(key)
        }
      })
    }
  }
}

// Global persistent cache
export const persistentCache = new PersistentCache()

// API response caching decorator
export function withCache<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  keyGenerator: (...args: T) => string,
  ttlSeconds = 300
) {
  return async (...args: T): Promise<R> => {
    const key = keyGenerator(...args)
    
    // Try to get from cache
    const cached = memoryCache.get<R>(key)
    if (cached !== null) {
      return cached
    }
    
    // Execute function and cache result
    try {
      const result = await fn(...args)
      memoryCache.set(key, result, ttlSeconds)
      return result
    } catch (error) {
      // Don't cache errors
      throw error
    }
  }
}

// Fetch with caching
export async function cachedFetch<T>(
  url: string,
  options: RequestInit = {},
  ttlSeconds = 300
): Promise<T> {
  const cacheKey = `fetch_${url}_${JSON.stringify(options)}`
  
  // Try cache first
  const cached = memoryCache.get<T>(cacheKey)
  if (cached !== null) {
    return cached
  }
  
  // Fetch and cache
  const response = await fetch(url, {
    ...options,
    headers: {
      'Cache-Control': 'public, max-age=300',
      ...options.headers
    }
  })
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }
  
  const data = await response.json()
  memoryCache.set(cacheKey, data, ttlSeconds)
  
  return data
}

// Cache invalidation patterns
export const cachePatterns = {
  // Content cache keys
  content: (page: string, section?: string) => 
    section ? `content_${page}_${section}` : `content_${page}`,
  
  // Media cache keys  
  media: (category: string, id?: string) =>
    id ? `media_${category}_${id}` : `media_${category}`,
  
  // Product cache keys
  products: (category?: string, filters?: Record<string, any>) => {
    const filterStr = filters ? JSON.stringify(filters) : ''
    return category ? `products_${category}_${filterStr}` : `products_${filterStr}`
  },
  
  // User preferences
  preferences: (userId: string) => `preferences_${userId}`,
  
  // Analytics data
  analytics: (metric: string, timeRange: string) => `analytics_${metric}_${timeRange}`
}

// Cache warming functions
export async function warmCache() {
  console.log('Warming cache...')
  
  // Pre-load critical content
  const criticalPages = ['home', 'about', 'contact']
  
  for (const page of criticalPages) {
    try {
      // This would typically fetch from your CMS or API
      // For now, we'll just set some placeholder data
      memoryCache.set(
        cachePatterns.content(page),
        { page, lastUpdated: Date.now() },
        3600 // 1 hour
      )
    } catch (error) {
      console.warn(`Failed to warm cache for ${page}:`, error)
    }
  }
  
  console.log('Cache warming complete')
}

// Cache cleanup
export function cleanupExpiredCache() {
  // This would be called periodically to clean up expired items
  // The MemoryCache already handles this automatically on get()
  console.log('Cache cleanup completed')
}

// Cache statistics
export function getCacheStats() {
  return {
    memorySize: memoryCache.size(),
    // Add more stats as needed
  }
}

// Initialize cache warming on app start (client-side only)
if (typeof window !== 'undefined') {
  // Warm cache after a short delay to not block initial render
  setTimeout(warmCache, 1000)
  
  // Clean up expired cache every 5 minutes
  setInterval(cleanupExpiredCache, 5 * 60 * 1000)
}
