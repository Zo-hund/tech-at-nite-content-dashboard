import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromCookies } from '@/lib/auth'
import { updatePostStatus, getPostById } from '@/lib/db'
import type { PostStatus } from '@/lib/types'

const VALID_STATUSES: PostStatus[] = ['approved', 'edited', 'rejected', 'pending']

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
): Promise<NextResponse> {
  const authed = await getSessionFromCookies()
  if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { postId } = await params
  const body = await req.json()
  const { status, edited_content } = body as { status: PostStatus; edited_content?: string }

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: `Invalid status: ${status}` }, { status: 400 })
  }

  if (status === 'edited' && !edited_content?.trim()) {
    return NextResponse.json({ error: 'edited_content is required when status is edited' }, { status: 400 })
  }

  const post = await getPostById(postId)
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

  const updated = await updatePostStatus(postId, status, edited_content)
  return NextResponse.json(updated)
}
