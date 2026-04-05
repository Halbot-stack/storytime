import Link from 'next/link'

const genres = [
  { icon: '⚔️', label: 'Adventure' },
  { icon: '🔍', label: 'Mystery' },
  { icon: '✨', label: 'Fairy Tales' },
  { icon: '💕', label: 'Romance' },
  { icon: '🚀', label: 'Sci-Fi' },
  { icon: '🏛️', label: 'Historical' },
]

const steps = [
  {
    number: '1',
    title: 'Subscribe',
    description: 'Choose your plan and complete a short quiz about your interests and preferences.',
  },
  {
    number: '2',
    title: 'We Personalize',
    description:
      'Each month we select a classic story and adapt it with your name, themes, and style — just for you.',
  },
  {
    number: '3',
    title: 'Story Arrives',
    description:
      'On the first of each month a beautifully crafted story lands in your inbox. Twelve stories over twelve months.',
  },
]

const sampleExcerpt = `The afternoon sun slanted through the library windows as Morgan turned the last page. Outside, the city hummed with its usual indifference, but in here — in this quiet kingdom of paper and dust — time moved differently.

Morgan had always loved stories. Not the safe, predictable kind, but the ones that reached inside your chest and rearranged something.

Tomorrow would bring its complications. But tonight, there was this: a cup of tea going cold, a pool of lamplight, and the particular silence that only exists when a story has just ended and the world hasn't yet begun again.`

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--card)] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <span className="text-xl font-bold text-[var(--accent)]">Storytime</span>
          </div>
          <Link
            href="/subscribe"
            className="bg-[var(--accent)] text-white px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Subscribe Now
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 py-20 text-center bg-[var(--card)] border-b border-[var(--border)]">
        <div className="max-w-3xl mx-auto">
          <p className="text-[var(--muted)] text-sm uppercase tracking-widest mb-4">
            A story made for you, every month
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-[var(--foreground)] leading-tight mb-6">
            The world&apos;s greatest stories,{' '}
            <span className="text-[var(--accent)]">personalized for you</span>
          </h1>
          <p className="text-lg text-[var(--muted)] max-w-xl mx-auto mb-10 leading-relaxed">
            Each month we take a beloved public domain classic — Sherlock Holmes, Grimm&apos;s
            Fairy Tales, O. Henry, H.G. Wells — and adapt it with your name, your interests, and
            your preferred themes. Twelve months. Twelve stories. All yours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/subscribe"
              className="bg-[var(--accent)] text-white px-8 py-4 rounded-full text-lg font-medium hover:opacity-90 transition-opacity"
            >
              Start Your Subscription — $39/year
            </Link>
          </div>
          <p className="text-sm text-[var(--muted)] mt-4">
            Less than $3.25 per story. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Genres */}
      <section className="px-6 py-16 border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">Stories across every genre</h2>
          <p className="text-[var(--muted)] mb-10">
            Tell us what you love and we&apos;ll match you with the perfect classics.
          </p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            {genres.map((g) => (
              <div
                key={g.label}
                className="flex flex-col items-center gap-2 p-4 bg-[var(--card)] rounded-xl border border-[var(--border)]"
              >
                <span className="text-3xl">{g.icon}</span>
                <span className="text-sm font-medium text-[var(--muted)]">{g.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample */}
      <section className="px-6 py-16 border-b border-[var(--border)] bg-[var(--card)]">
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-[var(--muted)] text-sm uppercase tracking-widest mb-6">
            Sample story excerpt
          </p>
          <blockquote className="border-l-4 border-[var(--accent-light)] pl-6 italic text-[var(--foreground)] text-lg leading-relaxed space-y-4">
            {sampleExcerpt.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </blockquote>
          <p className="text-right text-[var(--muted)] text-sm mt-4">
            — Adapted from a classic, personalized for a subscriber named Morgan
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">How it works</h2>
          <p className="text-[var(--muted)] mb-12">Simple, delightful, and entirely yours.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="w-12 h-12 rounded-full bg-[var(--accent)] text-white text-xl font-bold flex items-center justify-center mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-[var(--muted)] leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center bg-[var(--accent)] text-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready for your first story?</h2>
          <p className="text-lg opacity-90 mb-8">
            Subscribe today and your personalized story journey begins this month.
          </p>
          <Link
            href="/subscribe"
            className="bg-white text-[var(--accent)] px-8 py-4 rounded-full text-lg font-medium hover:opacity-90 transition-opacity inline-block"
          >
            Subscribe for $39/year
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-[var(--border)] text-center text-sm text-[var(--muted)]">
        <p>
          © {new Date().getFullYear()} Storytime. Stories sourced from public domain works via
          Project Gutenberg.
        </p>
      </footer>
    </div>
  )
}
