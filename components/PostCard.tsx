'use client'

import { useState } from 'react'
import { Check, Pencil, X, Send } from 'lucide-react'
import type { ContentPost, PostStatus, PushResult } from '@/lib/types'
import PlatformBadge from './PlatformBadge'
import StatusBadge from './StatusBadge'
import CopyButton from './CopyButton'
import EditModal from './EditModal'

interface PostCardProps {
  post: ContentPost
  onStatusChange: (id: string, status: PostStatus, editedContent?: string) => void
}

const CONTENT_TYPE_LABELS: Record<string, string> = {
  post: 'Post',
  reel_script: 'Reel Script',
  caption: 'Caption',
  hashtags: 'Hashtags',
  story_ideas: 'Story Ideas',
  short_title: 'Short — Title Options',
  description: 'Description',
  video_script: 'Video Script',
}

export default function PostCard({ post, onStatusChange }: PostCardProps) {
  const [editing, setEditing] = useState(false)
  const [pushing, setPushing] = useState(false)
  const [pushResult, setPushResult] = useState<PushResult | null>(null)
  const [localStatus, setLocalStatus] = useState<PostStatus>(post.status)

  const displayContent = post.edited_content ?? post.raw_content
  const isRejected = localStatus === 'rejected'
  const isApprovedOrEdited = localStatus === 'approved' || localStatus === 'edited'
  const isPushed = localStatus === 'pushed'

  async function updateStatus(status: PostStatus, editedContent?: string) {
    const res = await fetch(`/api/posts/${post.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, edited_content: editedContent }),
    })
    if (res.ok) {
      setLocalStatus(status)
      onStatusChange(post.id, status, editedContent)
    }
  }

  async function handlePush() {
    setPushing(true)
    const res = await fetch(`/api/posts/${post.id}/push`, { method: 'POST' })
    const result: PushResult = await res.json()
    setPushResult(result)
    if (result.mode === 'api' && result.success) {
      setLocalStatus('pushed')
      onStatusChange(post.id, 'pushed')
    } else if (result.mode === 'copy') {
      setLocalStatus('pushed')
      onStatusChange(post.id, 'pushed')
    }
    setPushing(false)
  }

  async function handleEdit(editedContent: string) {
    await updateStatus('edited', editedContent)
    setEditing(false)
  }

  if (isRejected) {
    return (
      <div className="border border-brand-border rounded-lg p-4 opacity-40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PlatformBadge platform={post.platform} />
          <span className="text-sm text-gray-500">{CONTENT_TYPE_LABELS[post.content_type] ?? post.content_type}</span>
          <StatusBadge status={localStatus} />
        </div>
        <button
          onClick={() => updateStatus('pending')}
          className="text-xs text-gray-500 hover:text-white transition-colors"
        >
          Restore
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="bg-brand-card border border-brand-border rounded-xl p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <PlatformBadge platform={post.platform} />
            <span className="text-sm text-gray-400">{CONTENT_TYPE_LABELS[post.content_type] ?? post.content_type}</span>
          </div>
          <StatusBadge status={localStatus} />
        </div>

        {/* Content */}
        <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed bg-gray-900 rounded-md p-4 max-h-64 overflow-y-auto">
          {displayContent}
        </pre>

        {/* Copy mode result */}
        {pushResult?.mode === 'copy' && pushResult.copy_text && (
          <div className="bg-gray-900 border border-brand-border rounded-md p-4 space-y-2">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
              Formatted for Metricool
            </p>
            <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono max-h-40 overflow-y-auto">
              {pushResult.copy_text}
            </pre>
            <div className="flex items-center gap-3">
              <CopyButton text={pushResult.copy_text} label="Copy to Clipboard" />
              {pushResult.instructions && (
                <span className="text-xs text-gray-500">{pushResult.instructions}</span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        {!isPushed && (
          <div className="flex flex-wrap gap-2 pt-1">
            {localStatus === 'pending' && (
              <>
                <button
                  onClick={() => updateStatus('approved')}
                  className="flex items-center gap-2 text-sm px-3 py-2 rounded bg-green-900 hover:bg-green-800 text-green-300 transition-colors"
                >
                  <Check size={14} /> Approve
                </button>
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 text-sm px-3 py-2 rounded bg-amber-900 hover:bg-amber-800 text-amber-300 transition-colors"
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  onClick={() => updateStatus('rejected')}
                  className="flex items-center gap-2 text-sm px-3 py-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-400 transition-colors"
                >
                  <X size={14} /> Reject
                </button>
              </>
            )}

            {isApprovedOrEdited && (
              <>
                <button
                  onClick={handlePush}
                  disabled={pushing}
                  className="flex items-center gap-2 text-sm px-3 py-2 rounded bg-brand-accent hover:bg-opacity-90 text-white transition-colors disabled:opacity-50"
                >
                  <Send size={14} /> {pushing ? 'Pushing...' : 'Push to Metricool'}
                </button>
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 text-sm px-3 py-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-400 transition-colors"
                >
                  <Pencil size={14} /> Edit
                </button>
              </>
            )}
          </div>
        )}

        {isPushed && !pushResult && (
          <p className="text-xs text-purple-400">Pushed to Metricool</p>
        )}
      </div>

      {editing && (
        <EditModal
          post={{ ...post, edited_content: post.edited_content ?? null }}
          onSave={handleEdit}
          onClose={() => setEditing(false)}
        />
      )}
    </>
  )
}
