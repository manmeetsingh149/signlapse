import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const path = request.nextUrl.pathname
  
  // Only protect the dashboard route
  if (path.startsWith('/dashboard')) {
    // Check if the user is authenticated
    const isLoggedInCookie = request.cookies.get('isLoggedIn')
    const isAuthenticated = isLoggedInCookie?.value === 'true'
    
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }
  
  // Allow all other requests to proceed normally
  return NextResponse.next()
}

// Only run middleware on the dashboard path
export const config = {
  matcher: ['/dashboard/:path*']
} 