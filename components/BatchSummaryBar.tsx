import type { ContentPost } from '@/lib/types'

export default function BatchSummaryBar({ posts }: { posts: ContentPost[] }) {
  const approved = posts.filter((p) => ['approved', 'edited'].includes(p.status)).length
  const pending = posts.filter((p) => p.status === 'pending').length
  const rejected = posts.filter((p) => p.status === 'rejected').length
  const pushed = posts.filter((p) => p.status === 'pushed').length

  return (
    <div className="flex gap-6 text-sm py-3 px-4 bg-brand-card border border-brand-border rounded-lg mb-6">
      <span className="text-gray-400">
        Total: <strong className="text-white">{posts.length}</strong>
      </span>
      <span className="text-green-400">
        Approved: <strong>{approved}</strong>
      </span>
      <span className="text-gray-400">
        Pending: <strong className="text-white">{pending}</strong>
      </span>
      <span className="text-amber-400">
        Pushed: <strong>{pushed}</strong>
      </span>
      {rejected > 0 && (
        <span className="text-red-400">
          Rejected: <strong>{rejected}</strong>
        </span>
      )}
    </div>
  )
}
