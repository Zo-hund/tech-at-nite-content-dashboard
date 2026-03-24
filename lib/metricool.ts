import type { ContentPost, PushResult } from './types'

const PLATFORM_INSTRUCTIONS: Record<string, string> = {
  facebook: 'Metricool → New Post → Facebook',
  instagram: 'Metricool → New Post → Instagram',
  youtube: 'Metricool → New Post → YouTube',
  tiktok: 'Metricool → New Post → TikTok',
}

function formatForCopy(post: ContentPost): string {
  const divider = '━'.repeat(44)
  const header = `── ${post.platform.toUpperCase()} ${post.content_type.replace(/_/g, ' ').toUpperCase()} ──`
  const content = post.edited_content ?? post.raw_content
  return `${header}\n${divider}\n${content}\n${divider}\n📋 ${PLATFORM_INSTRUCTIONS[post.platform] ?? 'Paste into Metricool'}`
}

async function pushViaApi(post: ContentPost): Promise<PushResult> {
  const apiKey = process.env.METRICOOL_API_KEY
  const blogId = process.env.METRICOOL_BLOG_ID

  const content = post.edited_content ?? post.raw_content

  const payload = {
    blogId,
    network: post.platform,
    text: content,
    // Metricool API fields vary by platform — extend as needed once API docs confirmed
  }

  const response = await fetch('https://app.metricool.com/api/v1/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorText = await response.text()
    return { mode: 'api', success: false, error: `Metricool API error ${response.status}: ${errorText}` }
  }

  const data = await response.json()
  return { mode: 'api', success: true, metricool_post_id: data.id ?? data.postId ?? 'unknown' }
}

export async function pushToMetricool(post: ContentPost): Promise<PushResult> {
  if (process.env.METRICOOL_API_KEY) {
    try {
      return await pushViaApi(post)
    } catch (err) {
      console.error('Metricool API push failed, falling back to copy mode:', err)
    }
  }

  // Copy mode fallback
  return {
    mode: 'copy',
    copy_text: formatForCopy(post),
    instructions: PLATFORM_INSTRUCTIONS[post.platform] ?? 'Paste into Metricool',
  }
}
