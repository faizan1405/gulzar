import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/db';
import { corsPreflightResponse, applyCors } from '@/lib/cors';

export async function proxy(request: NextRequest) {
  const origin = request.headers.get('origin');
  const pathname = request.nextUrl.pathname;

  // Handle CORS preflight early
  if (request.method === 'OPTIONS') {
    return corsPreflightResponse(origin);
  }

  // Admin route protection
  if (pathname.startsWith('/admin')) {
    const token = await getToken({ req: request });
    if (!token || token.role !== 'ADMIN') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Block suspended admins
    if (token.accountStatus === 'SUSPENDED') {
      return NextResponse.redirect(new URL('/suspended', request.url));
    }

    // Invalidate session if tokenVersion has changed (password changed elsewhere)
    const sessionTokenVersion = (token.tokenVersion as number) || 1;
    const dbUser = await prisma.user.findUnique({
      where: { id: token.sub as string },
      select: { tokenVersion: true },
    });
    if (dbUser && dbUser.tokenVersion !== sessionTokenVersion) {
      return NextResponse.redirect(new URL('/login?reason=session_expired', request.url));
    }
  }

  // Redirect legacy /premium URL to /packages
  if (pathname === '/premium') {
    return NextResponse.redirect(new URL('/packages', request.url), 301);
  }

  // Forward pathname via x-pathname header
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);
  const response = NextResponse.next({ request: { headers: requestHeaders } });

  // Apply CORS headers to all API responses
  if (pathname.startsWith('/api')) {
    applyCors(response, origin);

    // CSRF token cookie initialization
    const csrfToken = crypto.randomUUID();
    response.cookies.set('x-csrf-token', csrfToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    // Non-httpOnly copy for client-side JS to read
    response.cookies.set('x-csrf-token-client', csrfToken, {
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24,
    });
  } else {
    applyCors(response, origin);
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*', '/premium'],
};
