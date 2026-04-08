import { NextRequest, NextResponse } from 'next/server'
import { resend } from '@/lib/resend'

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL
  ? `${process.env.RESEND_FROM_NAME || 'Storytime'} <${process.env.RESEND_FROM_EMAIL}>`
  : 'Storytime <onboarding@resend.dev>'

export async function POST(req: NextRequest) {
  const { email, protagonistName, pronouns, interests, themes, ageGroup, additionalNotes } =
    await req.json()

  if (!email) return NextResponse.json({ error: 'No email provided' }, { status: 400 })

  const genreLabels: Record<string, string> = {
    adventure: 'Adventure', mystery: 'Mystery', fairy_tale: 'Fairy Tales',
    romance: 'Romance', sci_fi: 'Sci-Fi', historical: 'Historical',
  }
  const themeLabels: Record<string, string> = {
    friendship: 'Friendship', courage: 'Courage', love: 'Love',
    discovery: 'Discovery', justice: 'Justice', redemption: 'Redemption',
  }

  const genreList = (interests as string[]).map((g) => genreLabels[g] ?? g).join(', ')
  const themeList = (themes as string[]).map((t) => themeLabels[t] ?? t).join(', ')

  const html = `
    <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #2c1810; padding: 32px;">
      <h1 style="font-size: 24px; margin-bottom: 8px;">📖 Your Storytime preferences</h1>
      <p style="color: #8b7355; margin-bottom: 24px;">Here's a summary of the quiz you just completed.</p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #e8d5b7; font-weight: bold; width: 40%;">Hero's name</td><td style="padding: 10px 0; border-bottom: 1px solid #e8d5b7;">${protagonistName}</td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #e8d5b7; font-weight: bold;">Pronouns</td><td style="padding: 10px 0; border-bottom: 1px solid #e8d5b7;">${pronouns}</td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #e8d5b7; font-weight: bold;">Genres</td><td style="padding: 10px 0; border-bottom: 1px solid #e8d5b7;">${genreList}</td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #e8d5b7; font-weight: bold;">Themes</td><td style="padding: 10px 0; border-bottom: 1px solid #e8d5b7;">${themeList}</td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #e8d5b7; font-weight: bold;">Age group</td><td style="padding: 10px 0; border-bottom: 1px solid #e8d5b7;">${ageGroup}</td></tr>
        ${additionalNotes ? `<tr><td style="padding: 10px 0; font-weight: bold;">Notes</td><td style="padding: 10px 0;">${additionalNotes}</td></tr>` : ''}
      </table>
      <p style="margin-top: 32px; color: #8b7355; font-size: 14px;">Your first personalized story will arrive in your inbox within 24 hours.</p>
    </div>
  `

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `📖 Your Storytime preferences — ${protagonistName}'s story journey`,
      html,
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Failed to send quiz summary email:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
