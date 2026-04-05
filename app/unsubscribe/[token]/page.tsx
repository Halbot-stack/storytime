import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function UnsubscribePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  const subscriber = await prisma.subscriber.findUnique({
    where: { unsubscribeToken: token },
  })

  if (!subscriber) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold mb-3">Link not found</h1>
          <p className="text-[var(--muted)]">
            This unsubscribe link is invalid or has already been used.
          </p>
          <Link href="/" className="text-[var(--accent)] hover:underline text-sm mt-6 inline-block">
            ← Back to Storytime
          </Link>
        </div>
      </div>
    )
  }

  if (subscriber.status === 'CANCELLED') {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="text-5xl mb-4">✓</div>
          <h1 className="text-2xl font-bold mb-3">Already unsubscribed</h1>
          <p className="text-[var(--muted)]">
            This subscription has already been cancelled. No more stories will be sent.
          </p>
          <Link href="/" className="text-[var(--accent)] hover:underline text-sm mt-6 inline-block">
            ← Back to Storytime
          </Link>
        </div>
      </div>
    )
  }

  // Cancel the subscription
  await prisma.subscriber.update({
    where: { id: subscriber.id },
    data: { status: 'CANCELLED' },
  })

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="text-5xl mb-4">👋</div>
        <h1 className="text-2xl font-bold mb-3">You&apos;ve been unsubscribed</h1>
        <p className="text-[var(--muted)] leading-relaxed mb-6">
          We&apos;ve cancelled your Storytime subscription. No more stories will be sent to{' '}
          <strong>{subscriber.email}</strong>.
        </p>
        <p className="text-[var(--muted)] text-sm mb-8">
          Changed your mind? You can always subscribe again from the homepage.
        </p>
        <Link href="/" className="text-[var(--accent)] hover:underline text-sm">
          ← Back to Storytime
        </Link>
      </div>
    </div>
  )
}
