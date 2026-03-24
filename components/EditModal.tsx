'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import type { ContentPost } from '@/lib/types'

interface EditModalProps {
  post: ContentPost
  onSave: (editedContent: string) => Promise<void>
  onClose: () => void
}

export default function EditModal({ post, onSave, onClose }: EditModalProps) {
  const [content, setContent] = useState(post.edited_content ?? post.raw_content)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!content.trim()) return
    setSaving(true)
    await onSave(content)
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-brand-card border border-brand-border rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
          <h3 className="font-semibold text-white">Edit Content</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-5">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-64 bg-gray-900 border border-brand-border rounded-md p-3 text-sm text-gray-200 font-mono focus:outline-none focus:border-brand-accent"
          />
          <p className="text-xs text-gray-500 mt-2">{content.length} characters</p>
        </div>

        <div className="flex gap-3 px-5 py-4 border-t border-brand-border">
          <button
            onClick={handleSave}
            disabled={saving || !content.trim()}
            className="bg-brand-accent hover:bg-opacity-90 text-white text-sm font-semibold px-4 py-2 rounded transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save & Approve'}
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-sm px-4 py-2 rounded transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
