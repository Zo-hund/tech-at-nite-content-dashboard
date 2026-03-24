import { Resend } from 'resend'
import type { ServiceBlock } from './types'

function getClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error('RESEND_API_KEY is not set')
  return new Resend(apiKey)
}

export async function sendReviewNotification(
  batchId: string,
  date: string,
  block: ServiceBlock,
  postCount: number
): Promise<void> {
  const resend = getClient()
  const to = process.env.NOTIFICATION_EMAIL
  if (!to) throw new Error('NOTIFICATION_EMAIL is not set')

  const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

  const reviewUrl = `${baseUrl}/review/${batchId}`

  const blockNames: Record<ServiceBlock, string> = {
    A: 'Block A — Social, Web & Print',
    B: 'Block B — Agents, Skills & Workflows',
    C: 'Block C — Turn Key Agentic Builds',
  }

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  await resend.emails.send({
    from: 'Tech At Nite Content <onboarding@resend.dev>',
    to,
    subject: `[Tech At Nite] Daily content ready — ${formattedDate} (Block ${block})`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0f; color: #e4e4f0; margin: 0; padding: 40px 20px;">
  <div style="max-width: 560px; margin: 0 auto;">
    <h2 style="color: #6c63ff; margin: 0 0 8px;">Tech At Nite Content HQ</h2>
    <h3 style="color: #e4e4f0; margin: 0 0 24px; font-weight: 400;">Your daily content batch is ready for review.</h3>

    <div style="background: #111118; border: 1px solid #1e1e2e; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
      <p style="margin: 0 0 8px;"><strong>Date:</strong> ${formattedDate}</p>
      <p style="margin: 0 0 8px;"><strong>Service Focus:</strong> ${blockNames[block]}</p>
      <p style="margin: 0;"><strong>Total pieces:</strong> ${postCount}</p>
    </div>

    <div style="background: #111118; border: 1px solid #1e1e2e; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
      <p style="margin: 0 0 12px; color: #9999bb;">Today's batch includes:</p>
      <ul style="margin: 0; padding-left: 20px; color: #e4e4f0; line-height: 1.8;">
        <li>Facebook: 1 thought leadership post</li>
        <li>Instagram: Reel script + caption + hashtags + story ideas</li>
        <li>YouTube: Short title options + description</li>
        <li>TikTok: Video script + caption</li>
      </ul>
    </div>

    <a href="${reviewUrl}" style="display: inline-block; background: #6c63ff; color: white; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: 600; font-size: 16px; margin-bottom: 32px;">
      Review &amp; Approve →
    </a>

    <p style="color: #555577; font-size: 13px; margin: 0;">
      Generated at 6:00 AM CST by Tech At Nite AI Content System.<br>
      Approved posts can be pushed to Metricool directly from the dashboard.
    </p>
  </div>
</body>
</html>`,
  })
}
