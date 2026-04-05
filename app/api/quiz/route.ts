import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { resend, FROM_EMAIL } from '@/lib/resend'
import { selectStoriesForSubscriber } from '@/lib/story-selector'
import { WelcomeEmail } from '@/components/emails/Welcome'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { token, protagonistName, pronouns, interests, themes, ageGroup, additionalNotes } = body

  if (!token || !protagonistName || !pronouns || !interests?.length || !themes?.length || !ageGroup) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const subscriber = await prisma.subscriber.findUnique({ where: { quizToken: token } })

  if (!subscriber) {
    return NextResponse.json({ error: 'Invalid or expired quiz link.' }, { status: 404 })
  }

  if (subscriber.status === 'ACTIVE' || subscriber.quizCompletedAt) {
    return NextResponse.json({ error: 'Quiz already completed.' }, { status: 400 })
  }

  // Save quiz response
  await prisma.quizResponse.create({
    data: {
      subscriberId: subscriber.id,
      protagonistName: protagonistName.trim(),
      pronouns,
      interests,
      themes,
      ageGroup,
      additionalNotes: additionalNotes?.trim() || null,
    },
  })

  // Select 12 stories based on preferences
  const selectedStories = await selectStoriesForSubscriber(interests, themes)

  // Schedule 12 story deliveries
  const now = new Date()
  const storyQueueItems = selectedStories.map((story, index) => {
    const scheduledDate = new Date(now)
    if (index === 0) {
      // First story: deliver tomorrow
      scheduledDate.setDate(scheduledDate.getDate() + 1)
    } else {
      // Subsequent stories: 1st of each following month
      const monthsAhead = index
      scheduledDate.setMonth(now.getMonth() + monthsAhead, 1)
    }
    scheduledDate.setHours(9, 0, 0, 0)

    return {
      subscriberId: subscriber.id,
      storyNumber: index + 1,
      scheduledDate,
      sourceStoryId: story.id,
    }
  })

  await prisma.storyQueue.createMany({ data: storyQueueItems })

  // Update subscriber status
  await prisma.subscriber.update({
    where: { id: subscriber.id },
    data: {
      status: 'ACTIVE',
      name: protagonistName.trim(),
      quizCompletedAt: new Date(),
    },
  })

  // Send welcome email
  const firstStory = storyQueueItems[0]
  const firstStoryDate = firstStory.scheduledDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  await resend.emails.send({
    from: FROM_EMAIL,
    to: subscriber.email,
    subject: `Your Storytime journey begins, ${protagonistName}!`,
    react: WelcomeEmail({ protagonistName, firstStoryDate }),
  })

  return NextResponse.json({ success: true })
}
