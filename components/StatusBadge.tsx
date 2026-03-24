import type { PostStatus } from '@/lib/types'

const STATUS_STYLES: Record<PostStatus, string> = {
  pending: 'bg-gray-800 text-gray-400',
  approved: 'bg-green-900 text-green-400',
  edited: 'bg-amber-900 text-amber-400',
  rejected: 'bg-red-900 text-red-400',
  pushed: 'bg-purple-900 text-purple-400',
}

const STATUS_LABELS: Record<PostStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  edited: 'Edited',
  rejected: 'Rejected',
  pushed: 'Pushed',
}

export default function StatusBadge({ status }: { status: PostStatus }) {
  return (
    <span className={`inline-block text-xs font-semibold px-2 py-1 rounded ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}
