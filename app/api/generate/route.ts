import { NextRequest, NextResponse } from 'next/server'
import { generateDailyBatch } from '@/lib/generator'
import { createBatch, createPost, getBatchByDate } from '@/lib/db'
import { getBlockForDate, getTopicSuggestion } from '@/lib/blockRotation'
import { sendReviewNotification } from '@/lib/email'

function isAuthorized(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return false
  const token = authHeader.slice(7)
  const cronSecret = process.env.CRON_SECRET
  const adminPassword = process.env.DASHBOARD_PASSWORD
  return token === cronSecret || token === adminPassword
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  return handleGenerate(req)
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  return handleGenerate(req)
}

async function handleGenerate(req: NextRequest): Promise<NextResponse> {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const today = new Date()
  const dateStr = today.toISOString().split('T')[0] // YYYY-MM-DD

  // Idempotency — skip if batch already exists for today
  const existing = await getBatchByDate(dateStr)
  if (existing) {
    return NextResponse.json({
      message: 'Batch already generated for today',
      batchId: existing.id,
      postCount: existing.posts.length,
    })
  }

  const block = getBlockForDate(today)
  const topic = getTopicSuggestion(block, today)

  // Create batch record
  const batch = await createBatch(dateStr, block, topic)

  // Generate all platform content
  const generatedPosts = await generateDailyBatch(block, topic)

  // Save posts to DB
  for (const post of generatedPosts) {
    await createPost(batch.id, post.platform, post.content_type, post.raw_content, post.sort_order)
  }

  // Send email notification (non-fatal if it fails)
  try {
    await sendReviewNotification(batch.id, dateStr, block, generatedPosts.length)
  } catch (err) {
    console.error('Email notification failed (batch was saved):', err)
  }

  return NextResponse.json({
    message: 'Batch generated successfully',
    batchId: batch.id,
    date: dateStr,
    serviceBlock: block,
    topic,
    postCount: generatedPosts.length,
  })
}
