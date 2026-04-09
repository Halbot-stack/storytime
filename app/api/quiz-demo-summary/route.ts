import { NextRequest, NextResponse } from 'next/server'
import { resend } from '@/lib/resend'
import { selectStory } from '@/lib/demo-stories'
import { personalizeStory } from '@/lib/claude'

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL
  ? `${process.env.RESEND_FROM_NAME || 'Storytime'} <${process.env.RESEND_FROM_EMAIL}>`
  : 'Storytime <onboarding@resend.dev>'

export async function POST(req: NextRequest) {
  const { email, protagonistName, pronouns, interests, themes, ageGroup, additionalNotes } =
    await req.json()

  if (!email) return NextResponse.json({ error: 'No email provided' }, { status: 400 })

  const story = selectStory(interests as string[], themes as string[])

  let storyText: string
  try {
    storyText = await personalizeStory({
      originalText: story.originalText,
      storyTitle: story.title,
      storyAuthor: story.author,
      protagonistName,
      pronouns,
      interests: interests as string[],
      themes: themes as string[],
      ageGroup,
    })
  } catch (err) {
    console.error('Claude personalization failed:', err)
    return NextResponse.json({ error: 'Story generation failed' }, { status: 500 })
  }

  // Format story paragraphs as HTML
  const storyHtml = storyText
    .split(/\n\n+/)
    .map((p) => `<p style="margin: 0 0 1.2em 0; line-height: 1.8;">${p.trim()}</p>`)
    .join('')

  const html = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #2c1810; padding: 32px; background: #fdf8f0;">
      <p style="color: #a07850; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px;">Your personalized story</p>
      <h1 style="font-size: 28px; margin: 0 0 4px 0;">${story.title}</h1>
      <p style="color: #8b7355; font-size: 14px; margin: 0 0 32px 0;">Based on ${story.author} · Personalized for ${protagonistName}</p>
      <hr style="border: none; border-top: 1px solid #e8d5b7; margin-bottom: 32px;" />
      <div style="font-size: 17px;">
        ${storyHtml}
      </div>
      <hr style="border: none; border-top: 1px solid #e8d5b7; margin-top: 32px; margin-bottom: 24px;" />
      <p style="color: #8b7355; font-size: 13px; text-align: center; margin: 0;">
        Your next story arrives on the 1st of next month.<br/>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}" style="color: #a07850;">storytime</a>
      </p>
    </div>
  `

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `📖 Your story is here, ${protagonistName}`,
      html,
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Failed to send story email:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
