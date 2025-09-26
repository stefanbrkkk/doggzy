'use client'

// Lightweight analytics shim. Replace console.log with your provider SDK (GA4, PostHog, etc.)
export function track(event: string, props?: Record<string, unknown>) {
  try {
    console.log('[track]', event, props || {})
  } catch {}
}

// Privacy-first approach with Do Not Track support
export function isDoNotTrackEnabled(): boolean {
  if (typeof window === 'undefined') return true
  
  return (
    navigator.doNotTrack === '1' ||
    // @ts-expect-error - Legacy browser support
    navigator.msDoNotTrack === '1' ||
    // @ts-expect-error - Legacy browser support
    window.doNotTrack === '1'
  )
}

// Enhanced tracking function with consent checking
export function trackWithConsent(event: string, props?: Record<string, unknown>) {
  // Respect Do Not Track
  if (isDoNotTrackEnabled()) {
    console.log('Analytics tracking skipped (Do Not Track enabled)', event)
    return
  }
  
  // Basic consent check (can be enhanced with consent management)
  if (typeof window !== 'undefined') {
    try {
      const consent = localStorage.getItem('doggzy-analytics-consent')
      if (consent !== 'true') {
        console.log('Analytics tracking skipped (no consent)', event)
        return
      }
    } catch {
      // localStorage not available, skip tracking
      return
    }
  }
  
  track(event, props)
}

// Predefined event helpers
export const analytics = {
  pageView: (page?: string) => trackWithConsent('page_view', { 
    page: page || (typeof window !== 'undefined' ? window.location.pathname : '') 
  }),
  
  ctaClick: (cta: string, page?: string) => trackWithConsent('cta_clicked', {
    cta,
    page: page || (typeof window !== 'undefined' ? window.location.pathname : '')
  }),
  
  formSubmit: (formType: string, page?: string) => trackWithConsent('form_submitted', {
    form_type: formType,
    page: page || (typeof window !== 'undefined' ? window.location.pathname : '')
  }),
  
  formError: (formType: string, error: string) => trackWithConsent('form_error', {
    form_type: formType,
    error,
    page: typeof window !== 'undefined' ? window.location.pathname : ''
  }),
}

// Simple consent management
export function setAnalyticsConsent(consent: boolean) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('doggzy-analytics-consent', consent.toString())
    } catch {
      // localStorage not available, fail silently
    }
  }
}

export function getAnalyticsConsent(): boolean | null {
  if (typeof window === 'undefined') return null
  
  try {
    const consent = localStorage.getItem('doggzy-analytics-consent')
    if (consent === null) return null
    return consent === 'true'
  } catch {
    // localStorage not available
    return null
  }
}