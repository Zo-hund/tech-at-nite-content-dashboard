export const dynamic = 'force-dynamic'

import { getBatchById } from '@/lib/db'
import ReviewClient from '../ReviewClient'
import { notFound } from 'next/navigation'

export default async function BatchPage({
  params,
}: {
  params: Promise<{ batchId: string }>
}) {
  const { batchId } = await params
  const batch = await getBatchById(batchId)
  if (!batch) notFound()
  return <ReviewClient batch={batch} />
}
