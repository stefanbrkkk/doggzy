// Analytics utility with privacy-first approach

export interface AnalyticsEvent {
  name: string
  properties?: Record<string, string | number | boolean>
  timestamp?: string
}

export interface TrackingConsent {
  analytics: boolean
  marketing: boolean
  functional: boolean
  timestamp: string
}

// Check if Do Not Track is enabled
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

// Get user consent from localStorage
export function getTrackingConsent(): TrackingConsent | null {
  if (typeof window === 'undefined') return null
  
  try {
    const stored = localStorage.getItem('doggzy-tracking-consent')
    if (!stored) return null
    
    return JSON.parse(stored) as TrackingConsent
  } catch {
    return null
  }
}

// Set user consent in localStorage
export function setTrackingConsent(consent: Omit<TrackingConsent, 'timestamp'>): void {
  if (typeof window === 'undefined') return
  
  const consentWithTimestamp: TrackingConsent = {
    ...consent,
    timestamp: new Date().toISOString()
  }
  
  localStorage.setItem('doggzy-tracking-consent', JSON.stringify(consentWithTimestamp))
  
  // Trigger consent change event
  window.dispatchEvent(new CustomEvent('trackingConsentChange', {
    detail: consentWithTimestamp
  }))
}

// Check if tracking is allowed
export function isTrackingAllowed(type: keyof Omit<TrackingConsent, 'timestamp'> = 'analytics'): boolean {
  // Always respect Do Not Track
  if (isDoNotTrackEnabled()) return false
  
  const consent = getTrackingConsent()
  if (!consent) return false
  
  return consent[type]
}

// Queue for events when tracking is not yet initialized
const eventQueue: AnalyticsEvent[] = []
let isInitialized = false

// Main tracking function
export function track(name: string, properties?: Record<string, string | number | boolean>): void {
  const event: AnalyticsEvent = {
    name,
    properties,
    timestamp: new Date().toISOString()
  }
  
  // If tracking not allowed, log and return
  if (!isTrackingAllowed('analytics')) {
    console.log('Analytics tracking skipped (Do Not Track or no consent)', event)
    return
  }
  
  // If not initialized, queue the event
  if (!isInitialized) {
    eventQueue.push(event)
    return
  }
  
  // Send to analytics service
  sendEvent(event)
}

// Send event to analytics service
function sendEvent(event: AnalyticsEvent): void {
  // TODO: Implement actual analytics service integration
  // For now, just log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Analytics Event:', event)
  }
  
  // Example integrations:
  
  // Google Analytics 4
  // if (typeof gtag !== 'undefined') {
  //   gtag('event', event.name, event.properties)
  // }
  
  // Plausible Analytics
  // if (typeof plausible !== 'undefined') {
  //   plausible(event.name, { props: event.properties })
  // }
  
  // Custom analytics endpoint
  // fetch('/api/analytics', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(event)
  // }).catch(console.error)
}

// Initialize analytics
export function initializeAnalytics(): void {
  if (isInitialized) return
  
  // Check if tracking is allowed
  if (!isTrackingAllowed('analytics')) {
    console.log('Analytics initialization skipped (Do Not Track or no consent)')
    return
  }
  
  console.log('🚀 Analytics initialized')
  isInitialized = true
  
  // Process queued events
  eventQueue.forEach(sendEvent)
  eventQueue.length = 0
  
  // Track page view
  track('page_view', {
    page: window.location.pathname,
    referrer: document.referrer,
    user_agent: navigator.userAgent
  })
  
  // Listen for consent changes
  window.addEventListener('trackingConsentChange', (event) => {
    const consent = (event as CustomEvent).detail as TrackingConsent
    if (consent.analytics && !isInitialized) {
      initializeAnalytics()
    }
  })
}

// Predefined event helpers
export const analytics = {
  // Page events
  pageView: (page?: string) => track('page_view', { 
    page: page || window.location.pathname 
  }),
  
  // CTA events
  ctaClick: (cta: string, page?: string) => track('cta_clicked', {
    cta,
    page: page || window.location.pathname
  }),
  
  // Form events
  formSubmit: (formType: string, page?: string) => track('form_submitted', {
    form_type: formType,
    page: page || window.location.pathname
  }),
  
  formError: (formType: string, error: string) => track('form_error', {
    form_type: formType,
    error,
    page: window.location.pathname
  }),
  
  // Donation events
  donationStarted: (amount?: number) => track('donation_started', {
    ...(amount !== undefined && { amount }),
    page: window.location.pathname
  }),
  
  donationCompleted: (amount: number, frequency: string) => track('donation_completed', {
    amount,
    frequency,
    page: window.location.pathname
  }),
  
  // Shop events
  productView: (productId: string, productName: string) => track('product_viewed', {
    product_id: productId,
    product_name: productName,
    page: window.location.pathname
  }),
  
  addToCart: (productId: string, productName: string, price: number) => track('add_to_cart', {
    product_id: productId,
    product_name: productName,
    price,
    page: window.location.pathname
  }),
  
  // Engagement events
  videoPlay: (videoName: string) => track('video_played', {
    video_name: videoName,
    page: window.location.pathname
  }),
  
  linkClick: (linkUrl: string, linkText?: string) => track('external_link_clicked', {
    link_url: linkUrl,
    ...(linkText && { link_text: linkText }),
    page: window.location.pathname
  }),
  
  searchPerformed: (query: string, results: number) => track('search_performed', {
    query,
    results_count: results,
    page: window.location.pathname
  }),
  
  // Error events
  error: (errorMessage: string, errorType?: string) => track('error_occurred', {
    error_message: errorMessage,
    ...(errorType && { error_type: errorType }),
    page: window.location.pathname
  })
}

// React hook for analytics
export function useAnalytics() {
  return {
    track,
    isTrackingAllowed,
    getTrackingConsent,
    setTrackingConsent,
    ...analytics
  }
}

// Consent banner utility
export function shouldShowConsentBanner(): boolean {
  if (typeof window === 'undefined') return false
  
  // Don't show if Do Not Track is enabled
  if (isDoNotTrackEnabled()) return false
  
  // Don't show if consent already given
  const consent = getTrackingConsent()
  if (consent) return false
  
  return true
}

// Default consent (essential only)
export const defaultConsent: Omit<TrackingConsent, 'timestamp'> = {
  analytics: false,
  marketing: false,
  functional: true // Essential functionality always allowed
}