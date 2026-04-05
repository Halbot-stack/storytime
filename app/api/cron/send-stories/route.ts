import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { personalizeStory } from '@/lib/claude'
import { resend, FROM_EMAIL } from '@/lib/resend'
import { StoryDeliveryEmail } from '@/components/emails/StoryDelivery'

export async function POST(req: NextRequest) {
  // Verify cron secret to prevent unauthorized calls
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const today = new Date()
  today.setHours(23, 59, 59, 999)

  // Find all unsent stories due today or earlier
  const dueStories = await prisma.storyQueue.findMany({
    where: {
      scheduledDate: { lte: today },
      sentAt: null,
    },
    include: {
      subscriber: {
        include: { quizResponse: true },
      },
      sourceStory: true,
    },
  })

  console.log(`Found ${dueStories.length} stories to send`)

  const results = await Promise.allSettled(
    dueStories.map(async (item) => {
      const { subscriber, sourceStory } = item

      if (!subscriber.quizResponse || !sourceStory) {
        console.warn(`Skipping story ${item.id}: missing quiz response or source story`)
        return
      }

      if (subscriber.status !== 'ACTIVE') {
        console.warn(`Skipping story ${item.id}: subscriber ${subscriber.id} is not active`)
        return
      }

      const { quizResponse } = subscriber

      // Personalize with Claude
      const personalizedText = await personalizeStory({
        originalText: sourceStory.originalText,
        storyTitle: sourceStory.title,
        storyAuthor: sourceStory.author,
        protagonistName: quizResponse.protagonistName,
        pronouns: quizResponse.pronouns,
        interests: quizResponse.interests,
        themes: quizResponse.themes,
        ageGroup: quizResponse.ageGroup,
      })

      const unsubscribeUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe/${subscriber.unsubscribeToken}`

      // Send email
      const emailResult = await resend.emails.send({
        from: FROM_EMAIL,
        to: subscriber.email,
        subject: `Story #${item.storyNumber}: ${sourceStory.title} — just for ${quizResponse.protagonistName}`,
        react: StoryDeliveryEmail({
          storyNumber: item.storyNumber,
          storyTitle: sourceStory.title,
          storyAuthor: sourceStory.author,
          protagonistName: quizResponse.protagonistName,
          personalizedText,
          unsubscribeUrl,
        }),
      })

      // Mark as sent
      await prisma.storyQueue.update({
        where: { id: item.id },
        data: {
          sentAt: new Date(),
          personalizedText,
          emailMessageId: emailResult.data?.id ?? null,
        },
      })

      // Check if this was the last story (story 12)
      if (item.storyNumber === 12) {
        await prisma.subscriber.update({
          where: { id: subscriber.id },
          data: { status: 'COMPLETED' },
        })
      }

      return { subscriberId: subscriber.id, storyNumber: item.storyNumber }
    })
  )

  const sent = results.filter((r) => r.status === 'fulfilled' && r.value).length
  const failed = results.filter((r) => r.status === 'rejected').length

  return NextResponse.json({ sent, failed, total: dueStories.length })
}
