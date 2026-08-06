import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/db';
import { corsPreflightResponse, applyCors } from '@/lib/cors';

export async function proxy(request: NextRequest) {
  const origin = request.headers.get('origin');
  const pathname = request.nextUrl.pathname;

  // Skip NextAuth routes — let the auth handler process OAuth callbacks cleanly
  if (pathname.startsWith('/api/auth/')) {
    return NextResponse.next();
  }

  // Handle CORS preflight early
  if (request.method === 'OPTIONS') {
    return corsPreflightResponse(origin);
  }

  // Admin route protection — login page is public
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    let token: Awaited<ReturnType<typeof getToken>> = null;
    try {
      token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET });
    } catch {
      // Missing or invalid session token — treat as unauthenticated
    }
    if (!token || token.role !== 'ADMIN') {
      const loginUrl = new URL('/admin/login', request.url);
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
      return NextResponse.redirect(new URL('/', request.url));
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
  // Match all admin and API routes EXCEPT auth.
  // Auth routes are handled entirely by NextAuth — never proxy them.
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/leads/:path*',
    '/api/packages/:path*',
    '/api/payment/:path*',
    '/api/profile/:path*',
    '/api/profiles/:path*',
    '/api/user/:path*',
    '/api/business-location/:path*',
    '/api/chatbot/:path*',
    '/premium',
  ],
};
