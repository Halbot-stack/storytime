'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

// ── question definitions ────────────────────────────────────────────────────

const GENRES = [
  { value: 'adventure', label: '⚔️ Adventure', followUp: 'adventure' },
  { value: 'mystery', label: '🔍 Mystery', followUp: 'mystery' },
  { value: 'fairy_tale', label: '✨ Fairy Tales', followUp: 'fairy_tale' },
  { value: 'romance', label: '💕 Romance', followUp: 'romance' },
  { value: 'sci_fi', label: '🚀 Sci-Fi', followUp: 'sci_fi' },
  { value: 'historical', label: '🏛️ Historical', followUp: 'historical' },
]

const FOLLOW_UPS: Record<string, { question: string; options: { value: string; label: string }[] }> = {
  adventure: {
    question: 'What kind of adventure?',
    options: [
      { value: 'pirates', label: '🏴‍☠️ Pirates & treasure' },
      { value: 'wilderness', label: '🌲 Lost in the wild' },
      { value: 'quest', label: '🗺️ An epic quest' },
      { value: 'any_adventure', label: '🎲 Surprise me' },
    ],
  },
  mystery: {
    question: 'What kind of mystery?',
    options: [
      { value: 'detective', label: '🕵️ A clever detective' },
      { value: 'supernatural', label: '👻 Something eerie' },
      { value: 'conspiracy', label: '🔐 A grand conspiracy' },
      { value: 'any_mystery', label: '🎲 Surprise me' },
    ],
  },
  fairy_tale: {
    question: 'What flavor of fairy tale?',
    options: [
      { value: 'classic', label: '👑 Classic kingdoms & magic' },
      { value: 'dark', label: '🌑 Dark & twisty' },
      { value: 'whimsical', label: '🌈 Light & whimsical' },
      { value: 'any_fairy', label: '🎲 Surprise me' },
    ],
  },
  romance: {
    question: 'What kind of romance?',
    options: [
      { value: 'slow_burn', label: '🕯️ Slow burn' },
      { value: 'grand_gesture', label: '💐 Grand gestures' },
      { value: 'forbidden', label: '🌹 Forbidden love' },
      { value: 'any_romance', label: '🎲 Surprise me' },
    ],
  },
  sci_fi: {
    question: 'What era of sci-fi?',
    options: [
      { value: 'classic_scifi', label: '🤖 Classic (robots & rockets)' },
      { value: 'time_travel', label: '⏳ Time travel' },
      { value: 'alien', label: '👽 Alien worlds' },
      { value: 'any_scifi', label: '🎲 Surprise me' },
    ],
  },
  historical: {
    question: 'Which era calls to you?',
    options: [
      { value: 'ancient', label: '🏛️ Ancient civilizations' },
      { value: 'medieval', label: '⚔️ Medieval & knights' },
      { value: 'victorian', label: '🎩 Victorian England' },
      { value: 'any_historical', label: '🎲 Surprise me' },
    ],
  },
}

const THEMES = [
  { value: 'friendship', label: '🤝 Friendship' },
  { value: 'courage', label: '🦁 Courage' },
  { value: 'love', label: '❤️ Love' },
  { value: 'discovery', label: '🔭 Discovery' },
  { value: 'justice', label: '⚖️ Justice' },
  { value: 'redemption', label: '🌅 Redemption' },
]

// ── types ────────────────────────────────────────────────────────────────────

interface FormData {
  protagonistName: string
  pronouns: string
  interests: string[]
  themes: string[]
  ageGroup: string
  additionalNotes: string
  followUpAnswers: string[]
}

type QuestionId =
  | 'name'
  | 'genres'
  | 'genre_followup'
  | 'themes'
  | 'age'
  | 'pronouns'
  | 'notes'
  | 'done'

// ── component ────────────────────────────────────────────────────────────────

export default function QuizPageInner({ token, isDemo = false }: { token: string; isDemo?: boolean }) {
  const router = useRouter()

  const [question, setQuestion] = useState<QuestionId>('name')
  const [visible, setVisible] = useState(true)
  const [form, setForm] = useState<FormData>({
    protagonistName: '',
    pronouns: 'they/them',
    interests: [],
    themes: [],
    ageGroup: 'adult',
    additionalNotes: '',
    followUpAnswers: [],
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const nameRef = useRef<HTMLInputElement>(null)

  // focus name input on mount
  useEffect(() => {
    if (question === 'name') nameRef.current?.focus()
  }, [question])

  // which follow-up genre to show (first selected genre that has a follow-up)
  const followUpGenre = form.interests.find((g) => FOLLOW_UPS[g]) ?? null

  // total question count for progress dots
  const QUESTIONS: QuestionId[] = [
    'name', 'genres', ...(followUpGenre ? ['genre_followup' as QuestionId] : []),
    'themes', 'age', 'pronouns', 'notes',
  ]
  const currentIndex = QUESTIONS.indexOf(question)
  const total = QUESTIONS.length

  function advance(nextQ: QuestionId) {
    setVisible(false)
    setTimeout(() => {
      setQuestion(nextQ)
      setVisible(true)
    }, 220)
  }

  function handleNameContinue() {
    if (!form.protagonistName.trim()) return
    advance('genres')
  }

  function toggleGenre(value: string) {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(value)
        ? prev.interests.filter((v) => v !== value)
        : [...prev.interests, value],
    }))
  }

  function handleGenresContinue() {
    if (form.interests.length === 0) return
    const hasFollowUp = form.interests.some((g) => FOLLOW_UPS[g])
    advance(hasFollowUp ? 'genre_followup' : 'themes')
  }

  function handleFollowUpPick(value: string) {
    setForm((prev) => ({ ...prev, followUpAnswers: [...prev.followUpAnswers, value] }))
    advance('themes')
  }

  function toggleTheme(value: string) {
    setForm((prev) => ({
      ...prev,
      themes: prev.themes.includes(value)
        ? prev.themes.filter((v) => v !== value)
        : [...prev.themes, value],
    }))
  }

  function handleThemesContinue() {
    if (form.themes.length === 0) return
    advance('age')
  }

  function handleAgePick(value: string) {
    setForm((prev) => ({ ...prev, ageGroup: value }))
    advance('pronouns')
  }

  function handlePronounPick(value: string) {
    setForm((prev) => ({ ...prev, pronouns: value }))
    advance('notes')
  }

  async function handleSubmit() {
    if (isDemo) {
      router.push('/quiz/complete')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          protagonistName: form.protagonistName.trim(),
          pronouns: form.pronouns,
          interests: form.interests,
          themes: form.themes,
          ageGroup: form.ageGroup,
          additionalNotes:
            form.additionalNotes.trim() ||
            (form.followUpAnswers.length ? `Preferences: ${form.followUpAnswers.join(', ')}` : ''),
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Something went wrong.'); return }
      router.push('/quiz/complete')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const name = form.protagonistName || 'your hero'

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">

        {/* Progress dots */}
        {question !== 'done' && (
          <div className="flex justify-center gap-2 mb-10">
            {QUESTIONS.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === currentIndex ? '20px' : '8px',
                  height: '8px',
                  backgroundColor: i <= currentIndex ? 'var(--accent)' : 'var(--border)',
                }}
              />
            ))}
          </div>
        )}

        {/* Question card */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.22s ease, transform 0.22s ease',
          }}
        >

          {/* Q: Name */}
          {question === 'name' && (
            <Card>
              <Question>What shall we call the hero of your stories?</Question>
              <Sub>This name will appear in every story we send you.</Sub>
              <input
                ref={nameRef}
                type="text"
                value={form.protagonistName}
                onChange={(e) => setForm((p) => ({ ...p, protagonistName: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleNameContinue()}
                placeholder="e.g. Jordan, Evelyn, Theo…"
                className="w-full px-4 py-3 border border-[var(--border)] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-light)] text-lg mt-2"
              />
              <PrimaryBtn onClick={handleNameContinue} disabled={!form.protagonistName.trim()}>
                That&apos;s the name →
              </PrimaryBtn>
            </Card>
          )}

          {/* Q: Genres */}
          {question === 'genres' && (
            <Card>
              <Question>What kind of stories does <em>{name}</em> love?</Question>
              <Sub>Pick as many as you like — we&apos;ll rotate through them over the year.</Sub>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {GENRES.map((g) => (
                  <ToggleBtn
                    key={g.value}
                    active={form.interests.includes(g.value)}
                    onClick={() => toggleGenre(g.value)}
                  >
                    {g.label}
                  </ToggleBtn>
                ))}
              </div>
              <PrimaryBtn onClick={handleGenresContinue} disabled={form.interests.length === 0}>
                {form.interests.length === 0
                  ? 'Pick at least one'
                  : `${form.interests.length} chosen — continue →`}
              </PrimaryBtn>
            </Card>
          )}

          {/* Q: Genre follow-up */}
          {question === 'genre_followup' && followUpGenre && (
            <Card>
              <Question>{FOLLOW_UPS[followUpGenre].question}</Question>
              <Sub>
                You picked {GENRES.find((g) => g.value === followUpGenre)?.label} — tell us more.
              </Sub>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {FOLLOW_UPS[followUpGenre].options.map((opt) => (
                  <ToggleBtn
                    key={opt.value}
                    active={false}
                    onClick={() => handleFollowUpPick(opt.value)}
                    autoAdvance
                  >
                    {opt.label}
                  </ToggleBtn>
                ))}
              </div>
            </Card>
          )}

          {/* Q: Themes */}
          {question === 'themes' && (
            <Card>
              <Question>What should every great story have?</Question>
              <Sub>These themes will be woven into each of {name}&apos;s stories.</Sub>
              <div className="flex flex-wrap gap-2 mt-4">
                {THEMES.map((t) => (
                  <ToggleBtn
                    key={t.value}
                    active={form.themes.includes(t.value)}
                    onClick={() => toggleTheme(t.value)}
                    pill
                  >
                    {t.label}
                  </ToggleBtn>
                ))}
              </div>
              <PrimaryBtn onClick={handleThemesContinue} disabled={form.themes.length === 0}>
                {form.themes.length === 0
                  ? 'Pick at least one'
                  : `${form.themes.length} chosen — continue →`}
              </PrimaryBtn>
            </Card>
          )}

          {/* Q: Age */}
          {question === 'age' && (
            <Card>
              <Question>Who&apos;s reading {name}&apos;s stories?</Question>
              <Sub>We&apos;ll adjust the language and complexity accordingly.</Sub>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { value: 'child', label: '🧒 A child', sub: 'Ages 6–10' },
                  { value: 'teen', label: '🧑 A teen', sub: 'Ages 11–17' },
                  { value: 'adult', label: '🧓 An adult', sub: 'Ages 18+' },
                ].map((ag) => (
                  <button
                    key={ag.value}
                    onClick={() => handleAgePick(ag.value)}
                    className="py-4 px-2 rounded-xl border text-sm font-medium transition-all hover:border-[var(--accent)] hover:bg-amber-50 text-center"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <div className="text-xl mb-1">{ag.label.split(' ')[0]}</div>
                    <div>{ag.label.split(' ').slice(1).join(' ')}</div>
                    <div className="text-xs text-[var(--muted)] mt-0.5">{ag.sub}</div>
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* Q: Pronouns */}
          {question === 'pronouns' && (
            <Card>
              <Question>How should we refer to {name}?</Question>
              <Sub>We&apos;ll use these pronouns throughout every story.</Sub>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { value: 'he/him', label: 'He / Him' },
                  { value: 'she/her', label: 'She / Her' },
                  { value: 'they/them', label: 'They / Them' },
                ].map((p) => (
                  <button
                    key={p.value}
                    onClick={() => handlePronounPick(p.value)}
                    className="py-4 rounded-xl border text-sm font-medium transition-all hover:border-[var(--accent)] hover:bg-amber-50"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* Q: Notes */}
          {question === 'notes' && (
            <Card>
              <Question>Any final wishes for {name}&apos;s stories?</Question>
              <Sub>Optional — but the more you tell us, the more personal each story becomes.</Sub>
              <textarea
                value={form.additionalNotes}
                onChange={(e) => setForm((p) => ({ ...p, additionalNotes: e.target.value }))}
                placeholder={`e.g. "${name} loves cats", "happy endings please", "set stories in forests"…`}
                rows={3}
                autoFocus
                className="w-full px-4 py-3 border border-[var(--border)] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-light)] text-sm resize-none mt-2"
              />
              {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
              <div className="flex gap-3 mt-2">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 bg-[var(--accent)] text-white py-3 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {submitting ? 'Saving…' : `Start ${name}'s story journey ✓`}
                </button>
              </div>
              <button
                onClick={() => { setForm((p) => ({ ...p, additionalNotes: '' })); handleSubmit() }}
                className="w-full text-center text-sm text-[var(--muted)] mt-2 hover:text-[var(--accent)]"
              >
                Skip this step
              </button>
            </Card>
          )}

        </div>

        {/* Step label */}
        {question !== 'done' && currentIndex >= 0 && (
          <p className="text-center text-xs text-[var(--muted)] mt-6">
            {currentIndex + 1} of {total}
          </p>
        )}
      </div>
    </div>
  )
}

// ── small sub-components ──────────────────────────────────────────────────────

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 shadow-sm space-y-2">
      {children}
    </div>
  )
}

function Question({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-bold leading-snug">{children}</h2>
}

function Sub({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-[var(--muted)] pb-1">{children}</p>
}

function PrimaryBtn({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full bg-[var(--accent)] text-white py-3 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-40 mt-2 text-sm"
    >
      {children}
    </button>
  )
}

function ToggleBtn({
  children,
  active,
  onClick,
  pill,
  autoAdvance,
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
  pill?: boolean
  autoAdvance?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`border font-medium transition-all text-sm ${
        pill ? 'py-2 px-4 rounded-full' : 'py-3 px-4 rounded-xl text-left'
      } ${autoAdvance ? 'hover:border-[var(--accent)] hover:bg-amber-50' : ''}`}
      style={{
        backgroundColor: active ? 'var(--accent)' : 'white',
        color: active ? 'white' : 'var(--foreground)',
        borderColor: active ? 'var(--accent)' : 'var(--border)',
      }}
    >
      {children}
    </button>
  )
}
