
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Public paths that don't require authentication
  const publicPaths = ['/landing-page', '/auth', '/api/auth/login', '/api/auth/register']
  
  // Check if it's a public path
  if (publicPaths.includes(pathname) || pathname.startsWith('/api/auth/')) {
    return NextResponse.next()
  }
  
  // Check for user session
  const sessionCookie = request.cookies.get('user-session')
  
  // If no session and trying to access protected route
  if (!sessionCookie && !publicPaths.includes(pathname)) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/landing-page', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
