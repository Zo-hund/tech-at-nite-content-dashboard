import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromCookies } from '@/lib/auth'
import { getPostById, updatePostPushed } from '@/lib/db'
import { pushToMetricool } from '@/lib/metricool'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
): Promise<NextResponse> {
  const authed = await getSessionFromCookies()
  if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { postId } = await params
  const post = await getPostById(postId)
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

  if (!['approved', 'edited'].includes(post.status)) {
    return NextResponse.json(
      { error: 'Post must be approved or edited before pushing' },
      { status: 400 }
    )
  }

  const result = await pushToMetricool(post)

  if (result.mode === 'api' && result.success) {
    await updatePostPushed(postId, result.metricool_post_id)
  } else if (result.mode === 'copy') {
    // Mark as pushed (self-reported — user will copy manually)
    await updatePostPushed(postId)
  }

  return NextResponse.json(result)
}
