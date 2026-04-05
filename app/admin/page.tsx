import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminClient from './AdminClient'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const adminAuth = cookieStore.get('admin_auth')

  if (adminAuth?.value !== process.env.ADMIN_PASSWORD) {
    redirect('/admin/login')
  }

  const [subscribers, storyQueue] = await Promise.all([
    prisma.subscriber.findMany({
      orderBy: { createdAt: 'desc' },
      include: { quizResponse: true, storyQueue: { orderBy: { storyNumber: 'asc' }, include: { sourceStory: true } } },
    }),
    prisma.storyQueue.findMany({
      where: { sentAt: null, scheduledDate: { lte: new Date() } },
      include: { subscriber: true, sourceStory: true },
    }),
  ])

  const stats = {
    total: subscribers.length,
    active: subscribers.filter((s) => s.status === 'ACTIVE').length,
    pendingQuiz: subscribers.filter((s) => s.status === 'PENDING_QUIZ').length,
    completed: subscribers.filter((s) => s.status === 'COMPLETED').length,
    cancelled: subscribers.filter((s) => s.status === 'CANCELLED').length,
    overdueStories: storyQueue.length,
  }

  return <AdminClient subscribers={subscribers} stats={stats} />
}
