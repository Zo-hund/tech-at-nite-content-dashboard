export const dynamic = 'force-dynamic'

import { getAllBatches } from '@/lib/db'
import type { ContentBatch } from '@/lib/types'
import Link from 'next/link'

const BLOCK_LABELS: Record<string, string> = {
  A: 'Block A',
  B: 'Block B',
  C: 'Block C',
}

const STATUS_STYLES: Record<string, string> = {
  pending_review: 'text-gray-400',
  in_review: 'text-amber-400',
  complete: 'text-green-400',
}

export default async function HistoryPage() {
  const batches = await getAllBatches(30)

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Content History</h1>

      {batches.length === 0 ? (
        <p className="text-gray-500">No batches generated yet.</p>
      ) : (
        <div className="space-y-2">
          {batches.map((batch: ContentBatch) => (
            <Link
              key={batch.id}
              href={`/review/${batch.id}`}
              className="flex items-center justify-between bg-brand-card border border-brand-border rounded-lg px-5 py-4 hover:border-brand-accent transition-colors"
            >
              <div>
                <span className="text-white font-medium">
                  {new Date(batch.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span className="ml-3 text-xs text-gray-500">{BLOCK_LABELS[batch.service_block]}</span>
              </div>
              <span className={`text-xs font-medium capitalize ${STATUS_STYLES[batch.status] ?? 'text-gray-400'}`}>
                {batch.status.replace('_', ' ')}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
