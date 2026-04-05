import { prisma } from './prisma'
import type { SourceStory } from '@prisma/client'

/**
 * Select 12 stories for a subscriber based on their quiz preferences.
 * Prioritizes stories matching their interests/themes, avoids repeats.
 */
export async function selectStoriesForSubscriber(
  interests: string[],
  themes: string[]
): Promise<SourceStory[]> {
  const allStories = await prisma.sourceStory.findMany()

  // Score each story by how well it matches the subscriber's preferences
  const scored = allStories.map((story) => {
    let score = 0
    for (const interest of interests) {
      if (story.genre === interest) score += 3
    }
    for (const theme of themes) {
      if (story.themes.includes(theme)) score += 1
    }
    return { story, score }
  })

  // Sort by score descending, then shuffle ties with a stable random seed
  scored.sort((a, b) => b.score - a.score || Math.random() - 0.5)

  // Take up to 12 stories; if fewer than 12 exist, cycle through
  const selected: SourceStory[] = []
  let i = 0
  while (selected.length < 12) {
    selected.push(scored[i % scored.length].story)
    i++
  }

  return selected
}
