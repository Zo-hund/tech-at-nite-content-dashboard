import type { Platform } from '@/lib/types'

const PLATFORM_STYLES: Record<Platform, string> = {
  facebook: 'bg-blue-900 text-blue-300',
  instagram: 'bg-pink-900 text-pink-300',
  youtube: 'bg-red-900 text-red-300',
  tiktok: 'bg-gray-800 text-gray-300',
}

const PLATFORM_LABELS: Record<Platform, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  youtube: 'YouTube',
  tiktok: 'TikTok',
}

export default function PlatformBadge({ platform }: { platform: Platform }) {
  return (
    <span className={`inline-block text-xs font-semibold px-2 py-1 rounded uppercase tracking-wide ${PLATFORM_STYLES[platform]}`}>
      {PLATFORM_LABELS[platform]}
    </span>
  )
}
