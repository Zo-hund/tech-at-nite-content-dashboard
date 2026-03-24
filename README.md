# Tech At Nite — AI Content Dashboard

Autonomous social media content generation with remote approval. Claude generates daily content at 6 AM CST, emails a review link, and you approve/push to Metricool from any device.

---

## How It Works

1. **6 AM CST** — Vercel Cron fires, Claude generates 9 content pieces across Facebook, Instagram, YouTube, TikTok
2. **Email** — You receive a notification with a "Review & Approve" link
3. **Dashboard** — Approve, edit, or reject each piece
4. **Push** — Approved posts go directly to Metricool (API) or show a formatted copy block

---

## Deploy to Vercel

### Step 1 — GitHub
Push this `dashboard/` folder to a GitHub repo (or monorepo subfolder with root set to `dashboard/`).

### Step 2 — Vercel Project
1. Go to vercel.com → New Project → Import from GitHub
2. Set **Root Directory** to `dashboard` if in a monorepo
3. Framework preset: **Next.js** (auto-detected)

### Step 3 — Vercel Postgres
1. Vercel Dashboard → Storage → Create Database → Postgres
2. Connect it to your project → env vars are auto-added
3. Open the database → Query tab → paste and run `setup.sql`

### Step 4 — Environment Variables
In Vercel Dashboard → Project Settings → Environment Variables, add:

| Variable | Value |
|---|---|
| `ANTHROPIC_API_KEY` | From `C:\Users\Owner\.clawdbot\.env` |
| `DASHBOARD_PASSWORD` | Your chosen login password |
| `SESSION_SECRET` | Run: `openssl rand -hex 32` |
| `CRON_SECRET` | Run: `openssl rand -hex 32` |
| `RESEND_API_KEY` | From resend.com (free signup) |
| `NOTIFICATION_EMAIL` | Your email address |
| `METRICOOL_API_KEY` | Optional — leave blank for copy mode |

### Step 5 — Deploy
Click Deploy. Vercel builds and deploys automatically.

### Step 6 — Verify Cron
Vercel Dashboard → Project → Cron Jobs → confirm `0 12 * * *` appears.

### Step 7 — Test
```bash
# Trigger manual generation to test the full pipeline
curl -X POST https://your-app.vercel.app/api/generate \
  -H "Authorization: Bearer YOUR_DASHBOARD_PASSWORD"
```

Then open `https://your-app.vercel.app` and log in.

---

## Local Development

```bash
# Install dependencies
npm install

# Copy and fill in env vars
cp .env.local.example .env.local
# Edit .env.local with your values

# Run dev server
npm run dev
# Open http://localhost:3000
```

For local dev with Postgres, use a Vercel Postgres connection string or a local Postgres instance.

---

## Prompt Updates

When you edit prompt files in `C:\Users\Owner\ai-content-team\prompts\`, also update the copies in `dashboard/prompts/` — these are what the deployed app uses.

---

## Cron Schedule

`0 12 * * *` UTC = **6:00 AM CST** (winter) / **7:00 AM CDT** (summer)

---

## Metricool API

If `METRICOOL_API_KEY` is set, approved posts push automatically. Otherwise, "Push to Metricool" shows a pre-formatted copy block. Copy mode works without any Metricool plan.
