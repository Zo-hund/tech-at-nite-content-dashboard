import { sql } from '@vercel/postgres'
import type { ContentBatch, ContentPost, BatchWithPosts, ServiceBlock } from './types'

export async function createBatch(
  date: string,
  serviceBlock: ServiceBlock,
  topicHint: string
): Promise<ContentBatch> {
  const result = await sql<ContentBatch>`
    INSERT INTO content_batches (date, service_block, topic_hint)
    VALUES (${date}, ${serviceBlock}, ${topicHint})
    RETURNING *
  `
  return result.rows[0]
}

export async function getBatchByDate(date: string): Promise<BatchWithPosts | null> {
  const batchResult = await sql<ContentBatch>`
    SELECT * FROM content_batches WHERE date = ${date}
  `
  if (batchResult.rows.length === 0) return null
  const batch = batchResult.rows[0]
  const postsResult = await sql<ContentPost>`
    SELECT * FROM content_posts WHERE batch_id = ${batch.id} ORDER BY sort_order ASC
  `
  return { ...batch, posts: postsResult.rows }
}

export async function getBatchById(id: string): Promise<BatchWithPosts | null> {
  const batchResult = await sql<ContentBatch>`
    SELECT * FROM content_batches WHERE id = ${id}
  `
  if (batchResult.rows.length === 0) return null
  const batch = batchResult.rows[0]
  const postsResult = await sql<ContentPost>`
    SELECT * FROM content_posts WHERE batch_id = ${batch.id} ORDER BY sort_order ASC
  `
  return { ...batch, posts: postsResult.rows }
}

export async function getAllBatches(limit = 30): Promise<ContentBatch[]> {
  const result = await sql<ContentBatch>`
    SELECT * FROM content_batches ORDER BY date DESC LIMIT ${limit}
  `
  return result.rows
}

export async function createPost(
  batchId: string,
  platform: string,
  contentType: string,
  rawContent: string,
  sortOrder: number
): Promise<ContentPost> {
  const result = await sql<ContentPost>`
    INSERT INTO content_posts (batch_id, platform, content_type, raw_content, sort_order)
    VALUES (${batchId}, ${platform}, ${contentType}, ${rawContent}, ${sortOrder})
    RETURNING *
  `
  return result.rows[0]
}

export async function getPostById(id: string): Promise<ContentPost | null> {
  const result = await sql<ContentPost>`
    SELECT * FROM content_posts WHERE id = ${id}
  `
  return result.rows[0] ?? null
}

export async function updatePostStatus(
  id: string,
  status: string,
  editedContent?: string
): Promise<ContentPost> {
  const result = await sql<ContentPost>`
    UPDATE content_posts
    SET status = ${status},
        edited_content = ${editedContent ?? null},
        updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `
  return result.rows[0]
}

export async function updatePostPushed(
  id: string,
  metricoolPostId?: string
): Promise<ContentPost> {
  const result = await sql<ContentPost>`
    UPDATE content_posts
    SET status = 'pushed',
        pushed_at = NOW(),
        metricool_post_id = ${metricoolPostId ?? null},
        updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `
  return result.rows[0]
}
