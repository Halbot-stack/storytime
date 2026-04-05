import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Storytime — Personalized Classic Stories Delivered Monthly',
  description:
    'Subscribe to receive 12 hand-picked, AI-personalized classic stories delivered to your inbox once a month for a year.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
