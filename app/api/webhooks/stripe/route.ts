import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { resend, FROM_EMAIL } from '@/lib/resend'
import { QuizInviteEmail } from '@/components/emails/QuizInvite'
import type Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const email = (session.metadata?.email ?? session.customer_email ?? '').toLowerCase()

    if (!email) {
      console.error('No email in checkout session', session.id)
      return NextResponse.json({ received: true })
    }

    // Upsert subscriber
    const subscriber = await prisma.subscriber.upsert({
      where: { email },
      update: {
        stripeCustomerId: session.customer as string,
        status: 'PENDING_QUIZ',
      },
      create: {
        email,
        stripeCustomerId: session.customer as string,
        status: 'PENDING_QUIZ',
      },
    })

    // Send quiz invitation email
    const quizUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/quiz/${subscriber.quizToken}`
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Welcome to Storytime — Complete your personalization quiz!',
      react: QuizInviteEmail({ quizUrl, email }),
    })
  }

  if (event.type === 'customer.subscription.deleted' || event.type === 'charge.dispute.created') {
    const obj = event.data.object as { customer?: string }
    if (obj.customer) {
      await prisma.subscriber.updateMany({
        where: { stripeCustomerId: obj.customer as string },
        data: { status: 'CANCELLED' },
      })
    }
  }

  return NextResponse.json({ received: true })
}
