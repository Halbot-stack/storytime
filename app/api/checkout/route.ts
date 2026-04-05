import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  const normalizedEmail = email.toLowerCase().trim()

  // Check if already subscribed and active
  const existing = await prisma.subscriber.findUnique({
    where: { email: normalizedEmail },
  })

  if (existing && existing.status === 'ACTIVE') {
    return NextResponse.json(
      { error: 'This email is already subscribed. Check your inbox for stories!' },
      { status: 400 }
    )
  }

  // Create or find Stripe customer
  let customerId = existing?.stripeCustomerId
  if (!customerId) {
    const customer = await stripe.customers.create({ email: normalizedEmail })
    customerId = customer.id
  }

  // Create Stripe Checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID!,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscribe`,
    customer_email: !customerId ? normalizedEmail : undefined,
    metadata: { email: normalizedEmail },
  })

  return NextResponse.json({ url: session.url })
}
