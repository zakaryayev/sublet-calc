import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Read the built-time base path value injected in HTML by Next is not available here,
// so we rely on a runtime fallback using PUBLIC env (Vercel exposes it at runtime).
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function middleware(req: NextRequest) {
  // Only apply redirect when we actually built with a basePath
  if (BASE && req.nextUrl.pathname === '/') {
    const url = req.nextUrl.clone();
    url.pathname = BASE; // e.g., "/sublet-calculator"
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};
