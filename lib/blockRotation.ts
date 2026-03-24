import type { ServiceBlock } from './types'

const BLOCK_TOPICS: Record<ServiceBlock, string[]> = {
  A: [
    'social media strategy for local businesses',
    'print design for nonprofits and community orgs',
    'website refresh for small brands on a budget',
    'content calendars for busy founders',
    'brand consistency across digital and print',
    'micro services that replace a full marketing hire',
    'social media audits — what to fix first',
  ],
  B: [
    'AI agents doing work while you sleep',
    'workflow automation for nonprofits',
    'agentic systems for lead generation',
    'AI workflows for educators and trainers',
    'skills and automations that replace repetitive tasks',
    'building your first AI agent without coding',
    'n8n and Zapier vs custom agentic builds',
  ],
  C: [
    'turn-key AI builds for quick deployment',
    'done-for-you agentic systems for founders',
    'rapid AI deployments for small teams',
    'AI product builds for nonprofits',
    'full-stack agentic deployments in under a week',
    'what a turn-key AI build actually includes',
    'Block C case study: what we shipped in 5 days',
  ],
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  return Math.floor(diff / oneDay)
}

export function getBlockForDate(date: Date): ServiceBlock {
  const blocks: ServiceBlock[] = ['A', 'B', 'C']
  const weekOfYear = Math.floor(getDayOfYear(date) / 7)
  return blocks[weekOfYear % 3]
}

export function getTodayBlock(): ServiceBlock {
  return getBlockForDate(new Date())
}

export function getTopicSuggestion(block: ServiceBlock, date: Date = new Date()): string {
  const topics = BLOCK_TOPICS[block]
  const index = getDayOfYear(date) % topics.length
  return topics[index]
}
