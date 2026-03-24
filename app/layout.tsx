import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tech At Nite — Content HQ',
  description: 'AI Content Approval Dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-brand-dark text-white">
        <header className="border-b border-brand-border px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-brand-accent font-bold text-lg">Tech At Nite</span>
            <span className="text-gray-500 text-sm ml-2">Content HQ</span>
          </div>
          <nav className="flex gap-6 text-sm text-gray-400">
            <a href="/review" className="hover:text-white transition-colors">Today</a>
            <a href="/history" className="hover:text-white transition-colors">History</a>
          </nav>
        </header>
        <main className="max-w-4xl mx-auto px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
