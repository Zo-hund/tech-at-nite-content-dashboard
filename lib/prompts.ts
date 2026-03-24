import fs from 'fs'
import path from 'path'

function extractSystemPrompt(filePath: string): string {
  const content = fs.readFileSync(filePath, 'utf-8')
  // Extract text between the first pair of ``` fences
  const match = content.match(/```\n([\s\S]*?)\n```/)
  if (!match) {
    // Fallback: return everything after the first ## System Prompt heading
    const headingMatch = content.match(/## System Prompt\n\n([\s\S]*)/)
    if (headingMatch) return headingMatch[1].trim()
    return content
  }
  return match[1].trim()
}

function getPromptPath(filename: string): string {
  const base = process.env.PROMPTS_BASE_PATH ?? path.join(process.cwd(), 'prompts')
  return path.join(base, filename)
}

export function getFacebookSystemPrompt(): string {
  return extractSystemPrompt(getPromptPath('copywriter-facebook.md'))
}

export function getInstagramSystemPrompt(): string {
  return extractSystemPrompt(getPromptPath('copywriter-instagram.md'))
}

export function getYouTubeSystemPrompt(): string {
  return extractSystemPrompt(getPromptPath('copywriter-youtube.md'))
}

export function getTikTokSystemPrompt(): string {
  return extractSystemPrompt(getPromptPath('copywriter-tiktok.md'))
}
