import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const PROTECTED_PATHS = ['/review', '/history']
const COOKIE_NAME = 'content_session'

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const pathname = req.nextUrl.pathname
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p))

  if (!isProtected) return NextResponse.next()

  const token = req.cookies.get(COOKIE_NAME)?.value
  if (!token) return redirectToLogin(req)

  try {
    const secret = new TextEncoder().encode(process.env.SESSION_SECRET ?? '')
    await jwtVerify(token, secret)
    return NextResponse.next()
  } catch {
    return redirectToLogin(req)
  }
}

function redirectToLogin(req: NextRequest): NextResponse {
  const loginUrl = new URL('/login', req.url)
  loginUrl.searchParams.set('redirect', req.nextUrl.pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/review/:path*', '/history/:path*'],
}
