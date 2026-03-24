export type Platform = 'facebook' | 'instagram' | 'youtube' | 'tiktok'

export type PostStatus = 'pending' | 'approved' | 'edited' | 'rejected' | 'pushed'

export type BatchStatus = 'pending_review' | 'in_review' | 'complete'

export type ServiceBlock = 'A' | 'B' | 'C'

export type ContentType =
  | 'post'
  | 'reel_script'
  | 'caption'
  | 'hashtags'
  | 'story_ideas'
  | 'short_title'
  | 'description'
  | 'video_script'

export interface ContentBatch {
  id: string
  date: string
  service_block: ServiceBlock
  generated_at: string
  status: BatchStatus
  topic_hint: string | null
}

export interface ContentPost {
  id: string
  batch_id: string
  platform: Platform
  content_type: ContentType
  raw_content: string
  edited_content: string | null
  status: PostStatus
  sort_order: number
  pushed_at: string | null
  metricool_post_id: string | null
  created_at: string
  updated_at: string
}

export interface BatchWithPosts extends ContentBatch {
  posts: ContentPost[]
}

export interface PushResult {
  mode: 'api' | 'copy'
  success?: boolean
  metricool_post_id?: string
  copy_text?: string
  instructions?: string
  error?: string
}
