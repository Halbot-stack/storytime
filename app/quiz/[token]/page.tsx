'use client'

import { use } from 'react'
import QuizPageInner from '../QuizInner'

export default function QuizPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)
  return <QuizPageInner token={token} />
}
