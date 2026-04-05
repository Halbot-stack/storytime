import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

interface PersonalizeOptions {
  originalText: string
  storyTitle: string
  storyAuthor: string
  protagonistName: string
  pronouns: string
  interests: string[]
  themes: string[]
  ageGroup: string
}

export async function personalizeStory(opts: PersonalizeOptions): Promise<string> {
  const {
    originalText,
    storyTitle,
    storyAuthor,
    protagonistName,
    pronouns,
    interests,
    themes,
    ageGroup,
  } = opts

  const pronounMap: Record<string, { subject: string; object: string; possessive: string }> = {
    'he/him': { subject: 'he', object: 'him', possessive: 'his' },
    'she/her': { subject: 'she', object: 'her', possessive: 'her' },
    'they/them': { subject: 'they', object: 'them', possessive: 'their' },
  }
  const p = pronounMap[pronouns] ?? pronounMap['they/them']

  const audienceNote =
    ageGroup === 'child'
      ? 'Write for a young child (ages 6-10): simple vocabulary, short sentences, gentle tone.'
      : ageGroup === 'teen'
      ? 'Write for a teenager: engaging, slightly more complex language, relatable emotions.'
      : 'Write for an adult: rich language, nuanced emotions, full complexity preserved.'

  const prompt = `You are adapting the classic public domain story "${storyTitle}" by ${storyAuthor} into a personalized version for a subscriber.

PERSONALIZATION REQUIREMENTS:
- Rename the main protagonist to "${protagonistName}" (pronouns: ${p.subject}/${p.object}/${p.possessive})
- Weave in these themes naturally: ${themes.join(', ')}
- The subscriber enjoys: ${interests.join(', ')}
- ${audienceNote}
- Keep the core plot and spirit of the original story intact
- Output a complete, polished short story of approximately 1,200–1,600 words
- Begin directly with the story — no preamble, no "Here is your story:" header
- End the story with a final line that feels complete and satisfying

ORIGINAL STORY:
${originalText}

Now write the personalized version:`

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type from Claude')
  return content.text
}
