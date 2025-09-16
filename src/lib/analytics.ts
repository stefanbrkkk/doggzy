'use client'

// Lightweight analytics shim. Replace console.log with your provider SDK (GA4, PostHog, etc.)
export function track(event: string, props?: Record<string, unknown>) {
  try {
    // eslint-disable-next-line no-console
    console.log('[track]', event, props || {})
  } catch {}
}


