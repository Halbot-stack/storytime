import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold mb-4">Payment confirmed!</h1>
        <p className="text-[var(--muted)] text-lg leading-relaxed mb-4">
          Welcome to Storytime! We&apos;re thrilled to have you.
        </p>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 mb-6 text-left space-y-3">
          <p className="text-sm font-medium">Here&apos;s what happens next:</p>
          <p className="text-sm text-[var(--muted)]">
            📧 <strong>Check your email</strong> — we&apos;ve sent you a personalization quiz link.
          </p>
          <p className="text-sm text-[var(--muted)]">
            ✍️ <strong>Complete the quiz</strong> (2 minutes) to tell us your preferences.
          </p>
          <p className="text-sm text-[var(--muted)]">
            📖 <strong>Your first story</strong> arrives within 24 hours of completing the quiz.
          </p>
          <p className="text-sm text-[var(--muted)]">
            📅 After that, <strong>one story per month</strong> for a year.
          </p>
        </div>
        <p className="text-sm text-[var(--muted)] mb-6">
          Can&apos;t find the email? Check your spam folder or reply to this confirmation.
        </p>
        <Link href="/" className="text-[var(--accent)] hover:underline text-sm">
          ← Back to Storytime
        </Link>
      </div>
    </div>
  )
}
