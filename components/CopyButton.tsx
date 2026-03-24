'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 text-sm px-3 py-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
    >
      {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
      {copied ? 'Copied!' : label}
    </button>
  )
}
