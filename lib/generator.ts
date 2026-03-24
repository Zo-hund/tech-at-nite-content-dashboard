import Anthropic from '@anthropic-ai/sdk'
import type { ServiceBlock } from './types'
import {
  getFacebookSystemPrompt,
  getInstagramSystemPrompt,
  getYouTubeSystemPrompt,
  getTikTokSystemPrompt,
} from './prompts'

const MODEL = 'claude-sonnet-4-6'

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set')
  return new Anthropic({ apiKey })
}

async function callClaude(system: string, userMessage: string): Promise<string> {
  const client = getClient()
  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 1500,
    system,
    messages: [{ role: 'user', content: userMessage }],
  })
  const block = message.content[0]
  if (block.type !== 'text') throw new Error('Unexpected response type from Claude')
  return block.text
}

function parseSections(text: string): Record<string, string> {
  const sections: Record<string, string> = {}
  const parts = text.split(/\n##\s+/)
  // First part before any ## heading is 'main'
  sections['main'] = parts[0].trim()
  for (let i = 1; i < parts.length; i++) {
    const newline = parts[i].indexOf('\n')
    if (newline === -1) {
      sections[parts[i].trim().toLowerCase()] = ''
    } else {
      const key = parts[i].slice(0, newline).trim().toLowerCase()
      const value = parts[i].slice(newline + 1).trim()
      sections[key] = value
    }
  }
  return sections
}

export interface GeneratedPost {
  platform: string
  content_type: string
  raw_content: string
  sort_order: number
}

export async function generateDailyBatch(
  block: ServiceBlock,
  topic: string
): Promise<GeneratedPost[]> {
  const posts: GeneratedPost[] = []

  // --- FACEBOOK ---
  const fbInput = `Topic: ${topic}
Service Block: ${block}
Tone: educational
CTA goal: comment`

  const fbResponse = await callClaude(getFacebookSystemPrompt(), fbInput)
  posts.push({
    platform: 'facebook',
    content_type: 'post',
    raw_content: fbResponse.trim(),
    sort_order: 0,
  })

  // --- INSTAGRAM ---
  const igInput = `Topic: ${topic}
Format: reel script
Service Block: ${block}
Tone: aspirational
CTA: comment AGENT

After the reel script, also provide the following sections using ## headers:

## Caption
[caption text]

## Hashtags
[15-20 hashtags]

## Story Ideas
[2 story ideas for Instagram Stories]`

  const igResponse = await callClaude(getInstagramSystemPrompt(), igInput)
  const igSections = parseSections(igResponse)

  posts.push({
    platform: 'instagram',
    content_type: 'reel_script',
    raw_content: igSections['main'] || igResponse.trim(),
    sort_order: 1,
  })
  posts.push({
    platform: 'instagram',
    content_type: 'caption',
    raw_content: igSections['caption'] || '',
    sort_order: 2,
  })
  posts.push({
    platform: 'instagram',
    content_type: 'hashtags',
    raw_content: igSections['hashtags'] || '',
    sort_order: 3,
  })
  posts.push({
    platform: 'instagram',
    content_type: 'story_ideas',
    raw_content: igSections['story ideas'] || '',
    sort_order: 4,
  })

  // --- YOUTUBE ---
  const ytInput = `Video type: Short
Topic: ${topic}
Service Block: ${block}
Target keyword: ${topic.split(' ').slice(0, 4).join(' ')}

Provide 3 title options followed by a full description using these ## headers:

## Title Options
1. [title]
2. [title]
3. [title]

## Description
[full description]`

  const ytResponse = await callClaude(getYouTubeSystemPrompt(), ytInput)
  const ytSections = parseSections(ytResponse)

  posts.push({
    platform: 'youtube',
    content_type: 'short_title',
    raw_content: ytSections['title options'] || ytSections['main'] || ytResponse.trim(),
    sort_order: 5,
  })
  posts.push({
    platform: 'youtube',
    content_type: 'description',
    raw_content: ytSections['description'] || '',
    sort_order: 6,
  })

  // --- TIKTOK ---
  const ttInput = `Topic: ${topic}
Format: hot take
Service Block: ${block}
Energy level: high-energy
CTA: comment AGENT

After the main script, provide:

## Caption
[1-3 line caption]

## Hashtags
[3-5 hashtags]`

  const ttResponse = await callClaude(getTikTokSystemPrompt(), ttInput)
  const ttSections = parseSections(ttResponse)

  posts.push({
    platform: 'tiktok',
    content_type: 'video_script',
    raw_content: ttSections['main'] || ttResponse.trim(),
    sort_order: 7,
  })
  posts.push({
    platform: 'tiktok',
    content_type: 'caption',
    raw_content: ttSections['caption'] || '',
    sort_order: 8,
  })

  return posts
}
