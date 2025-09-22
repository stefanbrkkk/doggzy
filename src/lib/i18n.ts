import { z } from 'zod'
import { useEffect, useCallback } from 'react'

// Supported locales
export const SUPPORTED_LOCALES = ['en', 'es', 'fr'] as const
export type Locale = typeof SUPPORTED_LOCALES[number]
export const DEFAULT_LOCALE: Locale = 'en'

// Translation namespace types
export type TranslationNamespace = 'common' | 'navigation' | 'forms' | 'home' | 'adopt' | 'foster' | 'donate' | 'shop' | 'about'

// Translation cache
const translationCache = new Map<string, Record<string, unknown>>()

// Load translation function
async function loadTranslation(namespace: TranslationNamespace, locale: Locale): Promise<Record<string, unknown>> {
  const cacheKey = `${namespace}.${locale}`
  
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!
  }

  try {
    const translation = await import(`@/i18n/${namespace}.${locale}.json`)
    const data = translation.default || translation
    translationCache.set(cacheKey, data)
    return data
  } catch {
    console.warn(`Failed to load translation ${namespace}.${locale}, falling back to English`)
    
    if (locale !== DEFAULT_LOCALE) {
      return loadTranslation(namespace, DEFAULT_LOCALE)
    }
    
    return {}
  }
}

// Get nested value from object using dot notation
function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const result = path.split('.').reduce((current: unknown, key: string) => {
    return (current as Record<string, unknown>)?.[key]
  }, obj)
  return (result as string) || path
}

// Translation function with interpolation
export function interpolate(template: string, values: Record<string, string | number> = {}): string {
  return template.replace(/{(\w+)}/g, (match, key) => {
    return values[key]?.toString() || match
  })
}

// Create translation function for a specific namespace and locale
export function createTranslationFunction(namespace: TranslationNamespace, locale: Locale = DEFAULT_LOCALE) {
  let translations: Record<string, unknown> = {}
  let loaded = false

  // Async loader
  const loadTranslations = async () => {
    if (!loaded) {
      translations = await loadTranslation(namespace, locale)
      loaded = true
    }
  }

  // Translation function
  const t = (key: string, values?: Record<string, string | number>): string => {
    if (!loaded) {
      console.warn(`Translations not loaded for ${namespace}.${locale}`)
      return key
    }

    const value = getNestedValue(translations, key)
    return values ? interpolate(value, values) : value
  }

  // Return both the function and the loader
  return { t, loadTranslations }
}

// Hook for React components
export function useTranslations(namespace: TranslationNamespace, locale: Locale = DEFAULT_LOCALE) {
  const { t, loadTranslations } = createTranslationFunction(namespace, locale)
  
  // Stabilize the loadTranslations function to prevent useEffect dependency changes
  const stableLoadTranslations = useCallback(() => {
    loadTranslations()
  }, [namespace, locale])
  
  // In a real app, this would use React hooks to manage loading state
  // For now, we'll load synchronously when possible
  useEffect(() => {
    stableLoadTranslations()
  }, [stableLoadTranslations])

  return t
}

// Utility to get browser locale
export function getBrowserLocale(): Locale {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE
  }

  const browserLang = navigator.language.split('-')[0] as Locale
  return SUPPORTED_LOCALES.includes(browserLang) ? browserLang : DEFAULT_LOCALE
}

// Utility to get locale from localStorage
export function getStoredLocale(): Locale {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE
  }

  const stored = localStorage.getItem('doggzy-locale') as Locale
  return SUPPORTED_LOCALES.includes(stored) ? stored : DEFAULT_LOCALE
}

// Utility to store locale in localStorage
export function setStoredLocale(locale: Locale): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('doggzy-locale', locale)
  }
}

// Translation validation schema
export const TranslationSchema = z.record(z.string(), z.any())

// Validate translation file
export function validateTranslation(data: unknown): Record<string, unknown> {
  try {
    return TranslationSchema.parse(data)
  } catch (error) {
    console.error('Invalid translation data:', error)
    return {}
  }
}

// Get all translation keys for a namespace (for development)
export async function getTranslationKeys(namespace: TranslationNamespace, locale: Locale = DEFAULT_LOCALE): Promise<string[]> {
  const translations = await loadTranslation(namespace, locale)
  
  function extractKeys(obj: Record<string, unknown>, prefix = ''): string[] {
    const keys: string[] = []
    
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key
      
      if (typeof value === 'object' && value !== null) {
        keys.push(...extractKeys(value as Record<string, unknown>, fullKey))
      } else {
        keys.push(fullKey)
      }
    }
    
    return keys
  }
  
  return extractKeys(translations)
}

// Find missing translation keys between locales
export async function findMissingKeys(namespace: TranslationNamespace, sourceLocale: Locale = DEFAULT_LOCALE): Promise<Record<Locale, string[]>> {
  const sourceKeys = await getTranslationKeys(namespace, sourceLocale)
  const missing: Record<Locale, string[]> = {} as Record<Locale, string[]>
  
  for (const locale of SUPPORTED_LOCALES) {
    if (locale === sourceLocale) continue
    
    const targetKeys = await getTranslationKeys(namespace, locale)
    missing[locale] = sourceKeys.filter(key => !targetKeys.includes(key))
  }
  
  return missing
}

// Find unused translation keys (requires static analysis in real implementation)
export async function findUnusedKeys(namespace: TranslationNamespace, _locale: Locale = DEFAULT_LOCALE): Promise<string[]> {
  // This would require static code analysis to find which keys are actually used
  // For now, return empty array as placeholder
  console.warn('findUnusedKeys requires static code analysis - not implemented', namespace)
  return []
}
