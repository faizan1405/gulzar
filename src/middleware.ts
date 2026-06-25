import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Lightweight middleware — no Prisma or NextAuth, safe on the Edge runtime.
// Sets x-pathname so server-component layouts can read the current route path.
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set('x-pathname', request.nextUrl.pathname);
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
