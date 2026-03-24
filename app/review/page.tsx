export const dynamic = 'force-dynamic'

import { getBatchByDate } from '@/lib/db'
import ReviewClient from './ReviewClient'

export default async function ReviewPage() {
  const today = new Date().toISOString().split('T')[0]
  const batch = await getBatchByDate(today)

  if (!batch) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-white mb-2">No batch yet for today</h2>
        <p className="text-gray-500 text-sm mb-6">
          Content is generated automatically at 6:00 AM CST.
        </p>
        <TriggerButton />
      </div>
    )
  }

  return <ReviewClient batch={batch} />
}

function TriggerButton() {
  return (
    <form action="/api/generate" method="POST">
      <p className="text-gray-600 text-xs mb-3">Or trigger manually (requires Authorization header)</p>
      <a
        href="#"
        onClick={async (e) => {
          e.preventDefault()
          const password = prompt('Enter your dashboard password to trigger generation:')
          if (!password) return
          const res = await fetch('/api/generate', {
            method: 'POST',
            headers: { Authorization: `Bearer ${password}` },
          })
          if (res.ok) window.location.reload()
          else alert('Failed: check password and try again')
        }}
        className="inline-block bg-brand-accent text-white text-sm font-semibold px-5 py-2 rounded hover:bg-opacity-90 transition-colors"
      >
        Generate Now
      </a>
    </form>
  )
}
