import { NextResponse } from 'next/server'
import { getStripe, createMockPaymentIntent } from '@/lib/stripe'

type DonationRequestBody = {
  amount: number
  currency?: string
  frequency?: 'one-time' | 'monthly' | 'quarterly' | 'yearly'
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  isAnonymous?: boolean
  dedication?: string
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as DonationRequestBody

    // Basic validation
    if (!body || typeof body.amount !== 'number' || body.amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const frequency = body.frequency || 'one-time'
    const currency = (body.currency || 'USD').toUpperCase()

    const stripe = getStripe()

    if (!stripe) {
      const mock = await createMockPaymentIntent(body.amount * 100, currency)
      return NextResponse.json({
        id: mock.id,
        clientSecret: mock.client_secret,
        amount: body.amount,
        currency,
        frequency,
        status: 'processed',
        mode: 'mock',
      })
    }

    // Create a PaymentIntent in Stripe (amount in cents)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(body.amount * 100),
      currency,
      metadata: {
        frequency,
        donor_email: body.email || '',
        donor_name: `${body.firstName || ''} ${body.lastName || ''}`.trim(),
        dedication: body.dedication || '',
        anonymous: body.isAnonymous ? 'true' : 'false',
      },
      automatic_payment_methods: { enabled: true },
    })

    return NextResponse.json({
      id: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      amount: body.amount,
      currency,
      frequency,
      status: paymentIntent.status,
      mode: 'live',
    })
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}


