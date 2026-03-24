import { NextRequest, NextResponse } from 'next/server'
import { createSession, COOKIE_NAME, SESSION_DURATION } from '@/lib/auth'

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { password } = await req.json()

  if (!password || password !== process.env.DASHBOARD_PASSWORD) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const token = await createSession()
  const response = NextResponse.json({ success: true })

  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION,
    path: '/',
  })

  return response
}
