'use client'

import { useState } from 'react'
import type { BatchWithPosts, ContentPost, PostStatus } from '@/lib/types'
import PostCard from '@/components/PostCard'
import BatchSummaryBar from '@/components/BatchSummaryBar'

export default function ReviewClient({ batch }: { batch: BatchWithPosts }) {
  const [posts, setPosts] = useState<ContentPost[]>(batch.posts)

  function handleStatusChange(id: string, status: PostStatus, editedContent?: string) {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status, edited_content: editedContent ?? p.edited_content }
          : p
      )
    )
  }

  const blockNames: Record<string, string> = {
    A: 'Block A — Social, Web & Print',
    B: 'Block B — Agents, Skills & Workflows',
    C: 'Block C — Turn Key Agentic Builds',
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">
          {new Date(batch.date).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {blockNames[batch.service_block]} &nbsp;·&nbsp; Topic: {batch.topic_hint}
        </p>
      </div>

      <BatchSummaryBar posts={posts} />

      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onStatusChange={handleStatusChange} />
        ))}
      </div>
    </div>
  )
}
