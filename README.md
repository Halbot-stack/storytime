# Storytime — Personalized Story Subscription Site

## What This Is

A full-stack subscription website where visitors pay $39/year to receive 12 personalized classic stories delivered to their inbox — one per month for a year. Each story is pulled from famous public domain works (Sherlock Holmes, Grimm's Fairy Tales, O. Henry, H.G. Wells, etc.) and adapted by Claude AI to feature the subscriber's chosen name, interests, and themes.

## Current Status

**The app is fully built and the code is complete.** It builds without errors and has been tested locally. It is NOT yet live — it still needs third-party accounts set up and environment variables filled in before it can take real payments and send real emails.

---

## What's Built

### Pages
| Route | Purpose |
|---|---|
| `/` | Landing page — pitch, genre grid, sample excerpt, how-it-works, CTA |
| `/subscribe` | Email entry → Stripe Checkout |
| `/success` | Post-payment confirmation page |
| `/quiz/[token]` | Personalization quiz (conversational, one question at a time) |
| `/quiz/demo` | Demo version of quiz — no database needed, for testing |
| `/quiz/complete` | Quiz completion confirmation |
| `/unsubscribe/[token]` | One-click unsubscribe |
| `/admin` | Password-protected admin dashboard |

### How the subscription flow works
1. Visitor clicks Subscribe → enters email → redirected to Stripe Checkout
2. Stripe webhook fires → creates `Subscriber` in database → sends quiz link via email
3. Subscriber clicks quiz link → completes personalization quiz (name, pronouns, genres, themes, age group)
4. Quiz saves preferences → schedules 12 story deliveries (story 1 = next day, stories 2–12 = 1st of each month)
5. Daily Vercel Cron job checks for due stories → calls Claude API to personalize → sends via Resend

### Story personalization
- Claude (`claude-sonnet-4-6`) rewrites each public domain story with the subscriber's protagonist name, pronouns, preferred themes, and age-appropriate language
- ~$0.04 per story, ~$0.48/subscriber/year in AI costs

### Story library
12 seeded public domain stories across 6 genres: adventure, mystery, fairy tales, romance, sci-fi, historical. Seed script is at `prisma/seed.ts`.

---

## Tech Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** — custom warm parchment theme, no component library
- **Prisma v7** + PostgreSQL — NOTE: Prisma v7 requires `@prisma/adapter-pg` — you cannot use `new PrismaClient()` without an adapter
- **Stripe** — one-time $39/year payment
- **Resend** — transactional email (quiz invite, welcome, monthly story delivery)
- **Anthropic Claude API** — story personalization
- **Vercel** — hosting + Cron (daily at 9am UTC for story sends)

---

## What Still Needs to Be Done

These are the remaining steps to go live. Do them in order.

### Step 1 — Neon database (free, ~5 min)
1. Sign up at neon.tech
2. Create a project called `storytime`
3. Copy the connection string into `.env.local` as `DATABASE_URL`
4. Run: `npx prisma migrate dev --name init`
5. Run: `npm run db:seed` (loads the 12 public domain stories)

### Step 2 — Stripe (~15 min)
1. Sign up at stripe.com
2. Create a Product: name "Storytime Annual Subscription", $39, one-time payment
3. Copy the Price ID (`price_...`) → `STRIPE_PRICE_ID` in `.env.local`
4. Copy Secret Key → `STRIPE_SECRET_KEY`
5. Copy Publishable Key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
6. For local testing, install Stripe CLI and run:
   `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
   Copy the webhook secret → `STRIPE_WEBHOOK_SECRET`

### Step 3 — Resend email (~10 min)
1. Sign up at resend.com
2. Add and verify your sending domain (DNS records — they walk you through it)
3. Copy API key → `RESEND_API_KEY`
4. Set `RESEND_FROM_EMAIL` to your verified domain email (e.g. stories@yourdomain.com)

### Step 4 — Anthropic API key (~2 min)
1. Go to console.anthropic.com → API Keys → create one
2. Copy it → `ANTHROPIC_API_KEY`

### Step 5 — Deploy to Vercel (~10 min)
1. Go to vercel.com → "Add New Project" → import the `storytime` GitHub repo
2. Add all environment variables from `.env.local` in the Vercel dashboard
3. Set `NEXT_PUBLIC_BASE_URL` to your Vercel URL (e.g. `https://storytime.vercel.app`)
4. Set `CRON_SECRET` to a long random string
5. Deploy

### Step 6 — Stripe webhook for production
1. In Stripe Dashboard → Webhooks → Add endpoint
2. URL: `https://your-vercel-url.vercel.app/api/webhooks/stripe`
3. Event to listen for: `checkout.session.completed`
4. Copy the webhook secret → update `STRIPE_WEBHOOK_SECRET` in Vercel env vars

### Step 7 — (Optional) Custom domain
1. Buy a domain (e.g. getstorytime.com) at Namecheap or Cloudflare
2. Connect it to Vercel in the Vercel dashboard under "Domains"
3. Update `NEXT_PUBLIC_BASE_URL` to the custom domain

---

## Environment Variables

All of these go in `.env.local` locally and in Vercel dashboard for production:

```
DATABASE_URL                        # Neon Postgres connection string
STRIPE_SECRET_KEY                   # sk_live_... (or sk_test_... for testing)
STRIPE_WEBHOOK_SECRET               # whsec_...
STRIPE_PRICE_ID                     # price_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY  # pk_live_...
RESEND_API_KEY                      # re_...
RESEND_FROM_EMAIL                   # stories@yourdomain.com
RESEND_FROM_NAME                    # Storytime
ANTHROPIC_API_KEY                   # sk-ant-...
NEXT_PUBLIC_BASE_URL                # https://yourdomain.com
ADMIN_PASSWORD                      # password for /admin dashboard
CRON_SECRET                         # secret for /api/cron/send-stories
```

---

## Testing Without Any Backend

Go to `/subscribe` locally and click **"Skip payment and preview the quiz →"** at the bottom (only visible in development). This takes you through the full quiz flow without needing Stripe, a database, or any API keys.

Or go directly to `/quiz/demo`.

---

## Key Files

```
app/
  page.tsx                          # Landing page
  subscribe/page.tsx                # Subscribe form
  quiz/
    QuizInner.tsx                   # Main quiz component (shared by [token] and demo)
    [token]/page.tsx                # Real quiz (requires valid token from DB)
    demo/page.tsx                   # Demo quiz (no DB needed)
  api/
    checkout/route.ts               # Creates Stripe checkout session
    webhooks/stripe/route.ts        # Handles Stripe events → creates subscriber
    quiz/route.ts                   # Saves quiz, schedules 12 stories, sends welcome email
    cron/send-stories/route.ts      # Daily job: personalize + send due stories
    admin/login/route.ts            # Admin cookie auth
  admin/
    page.tsx                        # Admin dashboard (server component)
    AdminClient.tsx                 # Admin dashboard UI (client component)

lib/
  prisma.ts                         # PrismaClient with PrismaPg adapter (required for Prisma v7)
  claude.ts                         # personalizeStory() — calls Claude API
  story-selector.ts                 # Matches subscriber preferences to source stories
  stripe.ts                         # Stripe client
  resend.ts                         # Resend client

components/emails/
  QuizInvite.tsx                    # Email sent after payment: contains quiz link
  Welcome.tsx                       # Email sent after quiz completion
  StoryDelivery.tsx                 # Monthly story email

prisma/
  schema.prisma                     # DB models: Subscriber, QuizResponse, SourceStory, StoryQueue
  seed.ts                           # Seeds 12 public domain stories

vercel.json                         # Cron job config (daily at 9am UTC)
SETUP.md                            # Detailed setup instructions
```

---

## Database Schema

```
Subscriber      id, email, name, stripeCustomerId, quizToken, unsubscribeToken,
                status (PENDING_QUIZ | ACTIVE | COMPLETED | CANCELLED)

QuizResponse    subscriberId, protagonistName, pronouns, interests[], themes[],
                ageGroup, additionalNotes

SourceStory     id, title, author, genre, themes[], originalText, wordCount

StoryQueue      subscriberId, storyNumber (1-12), scheduledDate, sentAt,
                sourceStoryId, personalizedText
```

---

## Important: Prisma v7 Adapter Pattern

This project uses Prisma v7, which requires a database adapter. Do NOT revert to the old pattern. The correct setup is already in `lib/prisma.ts`:

```typescript
import { PrismaPg } from '@prisma/adapter-pg'
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })
```

If you remove the adapter you will get: `"Using engine type 'client' requires either adapter or accelerateUrl"`.
