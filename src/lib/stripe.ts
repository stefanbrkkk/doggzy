import Stripe from 'stripe'
import { appConfig, isStripeConfigured } from './config'

let stripeClient: Stripe | null = null

export function getStripe(): Stripe | null {
  if (!isStripeConfigured()) return null
  if (!stripeClient) {
    stripeClient = new Stripe(appConfig.stripe.secretKey, {
      apiVersion: '2024-11-20.acacia',
    })
  }
  return stripeClient
}

export async function createMockPaymentIntent(amount: number, currency: string) {
  return {
    id: `pi_${Math.random().toString(36).slice(2, 10)}`,
    client_secret: `cs_${Math.random().toString(36).slice(2, 24)}`,
    amount,
    currency,
    status: 'succeeded',
  }
}


