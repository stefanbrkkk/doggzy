export const appConfig = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  stripe: {
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    mockPayments: (process.env.MOCK_PAYMENTS || 'true').toLowerCase() === 'true',
  },
}

export function isStripeConfigured(): boolean {
  return Boolean(appConfig.stripe.secretKey && appConfig.stripe.publishableKey)
}


