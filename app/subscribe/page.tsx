'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SubscribePage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        return
      }

      window.location.href = data.url
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <Link href="/" className="text-[var(--muted)] text-sm mb-8 hover:text-[var(--accent)]">
        ← Back to home
      </Link>

      <div className="w-full max-w-md bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <span className="text-4xl">📖</span>
          <h1 className="text-2xl font-bold mt-3 mb-2">Start Your Story Journey</h1>
          <p className="text-[var(--muted)]">
            12 personalized classic stories delivered to your inbox, one per month for a year.
          </p>
        </div>

        {/* Pricing */}
        <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl p-4 mb-6 text-center">
          <p className="text-3xl font-bold text-[var(--accent)]">$39</p>
          <p className="text-[var(--muted)] text-sm">per year — that&apos;s $3.25 per story</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Your email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-[var(--border)] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-light)] text-[var(--foreground)]"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full bg-[var(--accent)] text-white py-3 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Redirecting to checkout...' : 'Continue to Payment →'}
          </button>
        </form>

        <div className="mt-6 space-y-2">
          {['✓ 12 personalized stories over 12 months', '✓ Classic public domain literature', '✓ Tailored to your name & interests', '✓ Cancel anytime'].map((item) => (
            <p key={item} className="text-sm text-[var(--muted)]">{item}</p>
          ))}
        </div>

        <p className="text-xs text-[var(--muted)] mt-6 text-center">
          Secure payment via Stripe. You&apos;ll complete a short personalization quiz after checkout.
        </p>
      </div>
    </div>
  )
}
