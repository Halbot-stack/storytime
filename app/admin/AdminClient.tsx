'use client'

import { useState } from 'react'

interface StoryQueueItem {
  storyNumber: number
  scheduledDate: Date
  sentAt: Date | null
  sourceStory: { title: string } | null
}

interface Subscriber {
  id: string
  email: string
  name: string | null
  status: string
  createdAt: Date
  quizCompletedAt: Date | null
  quizResponse: { protagonistName: string; interests: string[]; themes: string[] } | null
  storyQueue: StoryQueueItem[]
}

interface Stats {
  total: number
  active: number
  pendingQuiz: number
  completed: number
  cancelled: number
  overdueStories: number
}

export default function AdminClient({
  subscribers,
  stats,
}: {
  subscribers: Subscriber[]
  stats: Stats
}) {
  const [selected, setSelected] = useState<Subscriber | null>(null)
  const [triggerLoading, setTriggerLoading] = useState(false)
  const [triggerResult, setTriggerResult] = useState<string | null>(null)

  async function triggerCron() {
    setTriggerLoading(true)
    setTriggerResult(null)
    try {
      const res = await fetch('/api/cron/send-stories', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET || ''}` },
      })
      const data = await res.json()
      setTriggerResult(`Sent: ${data.sent}, Failed: ${data.failed}, Total: ${data.total}`)
    } catch {
      setTriggerResult('Error triggering cron')
    } finally {
      setTriggerLoading(false)
    }
  }

  const statusColors: Record<string, string> = {
    ACTIVE: '#22c55e',
    PENDING_QUIZ: '#f59e0b',
    COMPLETED: '#3b82f6',
    CANCELLED: '#ef4444',
  }

  return (
    <div className="min-h-screen p-8" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">📖 Storytime Admin</h1>

        {/* Stats */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total },
            { label: 'Active', value: stats.active },
            { label: 'Pending Quiz', value: stats.pendingQuiz },
            { label: 'Completed', value: stats.completed },
            { label: 'Cancelled', value: stats.cancelled },
            { label: 'Overdue Stories', value: stats.overdueStories, warn: stats.overdueStories > 0 },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white border rounded-xl p-4 text-center"
              style={{ borderColor: stat.warn ? '#ef4444' : '#e5e7eb' }}
            >
              <p className="text-2xl font-bold" style={{ color: stat.warn ? '#ef4444' : '#111' }}>
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Cron trigger */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-8 flex items-center gap-4">
          <div className="flex-1">
            <p className="font-medium text-sm">Manual Story Send</p>
            <p className="text-xs text-gray-500">
              Triggers the cron job to send all overdue stories now.
            </p>
          </div>
          <button
            onClick={triggerCron}
            disabled={triggerLoading}
            className="bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            {triggerLoading ? 'Sending...' : 'Send Overdue Stories'}
          </button>
          {triggerResult && (
            <p className="text-sm text-gray-600">{triggerResult}</p>
          )}
        </div>

        {/* Subscribers table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold">Subscribers ({subscribers.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Protagonist</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Stories Sent</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Detail</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub, i) => {
                  const sentCount = sub.storyQueue.filter((q) => q.sentAt).length
                  return (
                    <tr key={sub.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-3 font-mono text-xs">{sub.email}</td>
                      <td className="px-6 py-3">
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: statusColors[sub.status] || '#999' }}
                        >
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-gray-600">
                        {sub.quizResponse?.protagonistName ?? '—'}
                      </td>
                      <td className="px-6 py-3 text-gray-600">
                        {sentCount} / 12
                      </td>
                      <td className="px-6 py-3 text-gray-500 text-xs">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() => setSelected(sub === selected ? null : sub)}
                          className="text-blue-600 hover:underline text-xs"
                        >
                          {sub === selected ? 'Hide' : 'View'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Expanded detail */}
          {selected && (
            <div className="border-t border-gray-200 px-6 py-4 bg-blue-50">
              <h3 className="font-medium mb-3">{selected.email} — Story Queue</h3>
              {selected.quizResponse ? (
                <p className="text-xs text-gray-600 mb-3">
                  Interests: {selected.quizResponse.interests.join(', ')} | Themes:{' '}
                  {selected.quizResponse.themes.join(', ')}
                </p>
              ) : (
                <p className="text-xs text-gray-500 mb-3 italic">Quiz not completed yet</p>
              )}
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                {selected.storyQueue.map((item) => (
                  <div
                    key={item.storyNumber}
                    className="bg-white border rounded-lg p-2 text-center"
                    style={{ borderColor: item.sentAt ? '#22c55e' : '#e5e7eb' }}
                  >
                    <p className="text-xs font-medium">#{item.storyNumber}</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {item.sourceStory?.title ?? '?'}
                    </p>
                    <p className="text-xs mt-1" style={{ color: item.sentAt ? '#22c55e' : '#f59e0b' }}>
                      {item.sentAt ? '✓ Sent' : new Date(item.scheduledDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
