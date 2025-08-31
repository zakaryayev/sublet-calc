import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  // Only redirect the exact root path
  if (req.nextUrl.pathname === '/' && !req.nextUrl.pathname.startsWith('/sublet-calculator')) {
    const url = req.nextUrl.clone()
    url.pathname = '/sublet-calculator'
    return NextResponse.redirect(url, 307)
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sublet-calculator (our basePath)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sublet-calculator).*)',
  ]
}
