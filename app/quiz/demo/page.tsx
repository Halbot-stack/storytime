import { Suspense } from 'react'
import QuizPageInner from '../QuizInner'

export default function QuizDemoPage() {
  return (
    <Suspense>
      <QuizPageInner token="demo" isDemo />
    </Suspense>
  )
}
