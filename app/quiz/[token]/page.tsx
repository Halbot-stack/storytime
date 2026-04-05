'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'

const INTERESTS = [
  { value: 'adventure', label: '⚔️ Adventure' },
  { value: 'mystery', label: '🔍 Mystery' },
  { value: 'fairy_tale', label: '✨ Fairy Tales' },
  { value: 'romance', label: '💕 Romance' },
  { value: 'sci_fi', label: '🚀 Sci-Fi' },
  { value: 'historical', label: '🏛️ Historical' },
]

const THEMES = [
  { value: 'friendship', label: 'Friendship' },
  { value: 'courage', label: 'Courage' },
  { value: 'love', label: 'Love' },
  { value: 'discovery', label: 'Discovery' },
  { value: 'justice', label: 'Justice' },
]

interface FormData {
  protagonistName: string
  pronouns: string
  interests: string[]
  themes: string[]
  ageGroup: string
  additionalNotes: string
}

export default function QuizPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<FormData>({
    protagonistName: '',
    pronouns: 'they/them',
    interests: [],
    themes: [],
    ageGroup: 'adult',
    additionalNotes: '',
  })

  function toggleArray(field: 'interests' | 'themes', value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }))
  }

  async function handleSubmit() {
    if (!form.protagonistName.trim()) {
      setError('Please enter a name for your story protagonist.')
      return
    }
    if (form.interests.length === 0) {
      setError('Please select at least one genre you enjoy.')
      return
    }
    if (form.themes.length === 0) {
      setError('Please select at least one theme.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, ...form }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        return
      }

      router.push('/quiz/complete')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className="h-1.5 flex-1 rounded-full"
              style={{
                backgroundColor: s <= step ? 'var(--accent)' : 'var(--border)',
              }}
            />
          ))}
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 shadow-sm">
          <div className="text-center mb-6">
            <span className="text-3xl">📖</span>
            <h1 className="text-xl font-bold mt-2">Personalize Your Stories</h1>
            <p className="text-[var(--muted)] text-sm mt-1">Step {step} of 3</p>
          </div>

          {/* Step 1: Name & Pronouns */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">
                  What name should the protagonist have?
                </label>
                <p className="text-xs text-[var(--muted)] mb-2">
                  This is the hero&apos;s name in your stories. Can be your own name or any name you love.
                </p>
                <input
                  type="text"
                  value={form.protagonistName}
                  onChange={(e) => setForm((p) => ({ ...p, protagonistName: e.target.value }))}
                  placeholder="e.g. Jordan, Evelyn, Theo..."
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-light)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Which pronouns should the protagonist use?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['he/him', 'she/her', 'they/them'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setForm((prev) => ({ ...prev, pronouns: p }))}
                      className="py-2 px-3 rounded-xl border text-sm font-medium transition-colors"
                      style={{
                        backgroundColor: form.pronouns === p ? 'var(--accent)' : 'white',
                        color: form.pronouns === p ? 'white' : 'var(--foreground)',
                        borderColor: form.pronouns === p ? 'var(--accent)' : 'var(--border)',
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Who will be reading these stories?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'child', label: 'A child', sub: 'Ages 6–10' },
                    { value: 'teen', label: 'A teen', sub: 'Ages 11–17' },
                    { value: 'adult', label: 'An adult', sub: 'Ages 18+' },
                  ].map((ag) => (
                    <button
                      key={ag.value}
                      onClick={() => setForm((prev) => ({ ...prev, ageGroup: ag.value }))}
                      className="py-3 px-3 rounded-xl border text-sm font-medium transition-colors text-center"
                      style={{
                        backgroundColor: form.ageGroup === ag.value ? 'var(--accent)' : 'white',
                        color: form.ageGroup === ag.value ? 'white' : 'var(--foreground)',
                        borderColor: form.ageGroup === ag.value ? 'var(--accent)' : 'var(--border)',
                      }}
                    >
                      <div>{ag.label}</div>
                      <div
                        className="text-xs mt-0.5 opacity-70"
                      >
                        {ag.sub}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Genres */}
          {step === 2 && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Which genres do you love? (select all that apply)
              </label>
              <p className="text-xs text-[var(--muted)] mb-4">
                We&apos;ll prioritize these genres when selecting your monthly stories.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {INTERESTS.map((interest) => (
                  <button
                    key={interest.value}
                    onClick={() => toggleArray('interests', interest.value)}
                    className="py-3 px-4 rounded-xl border text-sm font-medium transition-colors text-left"
                    style={{
                      backgroundColor: form.interests.includes(interest.value)
                        ? 'var(--accent)'
                        : 'white',
                      color: form.interests.includes(interest.value) ? 'white' : 'var(--foreground)',
                      borderColor: form.interests.includes(interest.value)
                        ? 'var(--accent)'
                        : 'var(--border)',
                    }}
                  >
                    {interest.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Themes & Notes */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Which themes resonate with you? (select all that apply)
                </label>
                <p className="text-xs text-[var(--muted)] mb-4">
                  These will be woven into the fabric of each story.
                </p>
                <div className="flex flex-wrap gap-2">
                  {THEMES.map((theme) => (
                    <button
                      key={theme.value}
                      onClick={() => toggleArray('themes', theme.value)}
                      className="py-2 px-4 rounded-full border text-sm font-medium transition-colors"
                      style={{
                        backgroundColor: form.themes.includes(theme.value)
                          ? 'var(--accent)'
                          : 'white',
                        color: form.themes.includes(theme.value) ? 'white' : 'var(--foreground)',
                        borderColor: form.themes.includes(theme.value)
                          ? 'var(--accent)'
                          : 'var(--border)',
                      }}
                    >
                      {theme.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Anything else you&apos;d like us to know? (optional)
                </label>
                <textarea
                  value={form.additionalNotes}
                  onChange={(e) => setForm((p) => ({ ...p, additionalNotes: e.target.value }))}
                  placeholder="e.g. I love stories set in forests, or featuring cats, or with happy endings..."
                  rows={3}
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-light)] text-sm resize-none"
                />
              </div>
            </div>
          )}

          {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex-1 py-3 rounded-xl border border-[var(--border)] text-sm font-medium hover:bg-[var(--background)] transition-colors"
              >
                ← Back
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={() => {
                  setError('')
                  if (step === 1 && !form.protagonistName.trim()) {
                    setError('Please enter a protagonist name.')
                    return
                  }
                  if (step === 2 && form.interests.length === 0) {
                    setError('Please select at least one genre.')
                    return
                  }
                  setStep((s) => s + 1)
                }}
                className="flex-1 bg-[var(--accent)] text-white py-3 rounded-xl font-medium hover:opacity-90 transition-opacity text-sm"
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-[var(--accent)] text-white py-3 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
              >
                {loading ? 'Saving...' : 'Complete Quiz ✓'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
