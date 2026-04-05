# Storytime — Setup Guide

## Prerequisites
- Node.js 18+
- A [Neon](https://neon.tech) (or any Postgres) database
- A [Stripe](https://stripe.com) account
- A [Resend](https://resend.com) account
- An [Anthropic](https://console.anthropic.com) API key

---

## 1. Environment Variables

Copy `.env.local` and fill in your values:

```bash
# Database (Neon Postgres)
DATABASE_URL="postgresql://user:password@host/storytime?sslmode=require"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_ID="price_..."              # Create a one-time $39 product in Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Resend
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="stories@yourdomain.com"
RESEND_FROM_NAME="Storytime"

# Anthropic
ANTHROPIC_API_KEY="sk-ant-..."

# App
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
ADMIN_PASSWORD="your-secure-password"
CRON_SECRET="your-secure-cron-secret"
```

---

## 2. Database Setup

```bash
# Run migrations (creates all tables)
npx prisma migrate dev --name init

# Seed the story library (~12 public domain stories)
npm run db:seed
```

---

## 3. Stripe Setup

1. Create a product in the Stripe Dashboard: **$39 one-time payment**
2. Copy the Price ID (`price_...`) into `.env.local` as `STRIPE_PRICE_ID`
3. For local development, use the Stripe CLI to forward webhooks:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook secret (`whsec_...`) into `.env.local` as `STRIPE_WEBHOOK_SECRET`.

For production, set the webhook endpoint in Stripe Dashboard:
- URL: `https://yourdomain.com/api/webhooks/stripe`
- Event: `checkout.session.completed`

---

## 4. Run Locally

```bash
npm run dev
```

Visit:
- `http://localhost:3000` — Landing page
- `http://localhost:3000/subscribe` — Subscription flow
- `http://localhost:3000/admin` — Admin dashboard (requires password)

---

## 5. Deploy to Vercel

```bash
vercel --prod
```

Set all environment variables in the Vercel dashboard. The `vercel.json` cron job will run daily at 9am UTC to send scheduled stories.

**Important:** In production, the cron endpoint at `/api/cron/send-stories` is protected by `CRON_SECRET`. Vercel Cron jobs send the `Authorization: Bearer <CRON_SECRET>` header automatically if you configure it.

---

## 6. Testing End-to-End

1. Start `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
2. Go to `/subscribe`, enter an email, click Continue
3. Use Stripe test card: `4242 4242 4242 4242`, any future expiry, any CVC
4. After payment → check email for quiz link (or check DB for `quizToken`)
5. Complete quiz at `/quiz/[token]`
6. Manually trigger story send:

```bash
curl -X POST http://localhost:3000/api/cron/send-stories \
  -H "Authorization: Bearer your-cron-secret"
```

7. Check email for first story delivery

---

## Admin Dashboard

Visit `/admin` and enter your `ADMIN_PASSWORD`.

Features:
- Subscriber stats (active, pending quiz, completed, cancelled)
- Overdue story count
- Per-subscriber story queue with sent/pending status
- Manual cron trigger button
