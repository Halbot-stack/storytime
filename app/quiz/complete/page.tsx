import Link from 'next/link'

export default function QuizCompletePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="text-6xl mb-6">📬</div>
        <h1 className="text-3xl font-bold mb-4">You&apos;re all set!</h1>
        <p className="text-[var(--muted)] text-lg leading-relaxed mb-6">
          Your story preferences have been saved. Your first personalized story will arrive in your
          inbox within 24 hours. After that, a new story arrives on the 1st of each month.
        </p>
        <p className="text-[var(--muted)] text-sm mb-8">
          Keep an eye on your inbox — and check your spam folder just in case!
        </p>
        <Link href="/" className="text-[var(--accent)] hover:underline text-sm">
          ← Back to Storytime
        </Link>
      </div>
    </div>
  )
}
