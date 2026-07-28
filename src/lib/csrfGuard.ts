import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { validateCsrf, CSRF_COOKIE_NAME } from './csrf';

/**
 * CSRF guard for state-changing API routes.
 *
 * Usage: add `await csrfGuard(req)` at the top of POST/PATCH/DELETE handlers.
 * GET requests are exempt (safe method).
 */
export async function csrfGuard(req: NextRequest): Promise<NextResponse | null> {
  // Safe methods don't need CSRF protection
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return null;
  }

  if (!validateCsrf(req)) {
    return NextResponse.json(
      { error: 'Invalid or missing CSRF token.', code: 'CSRF_FAILED' },
      { status: 403 }
    );
  }

  return null;
}

/**
 * CSRF initialization middleware.
 * Sets a CSRF cookie on GET/HEAD requests so the client can read it
 * and send it back in the X-CSRF-Token header on subsequent mutations.
 *
 * Wrap GET responses with this: `return csrfInit(res)(yourResponse)`
 */
export function csrfInit(initialToken?: string): (res: NextResponse) => NextResponse {
  return (res: NextResponse) => {
    const token = initialToken || crypto.randomUUID();
    res.cookies.set(CSRF_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });
    // Also expose a non-httpOnly version so client-side JS can read it
    res.cookies.set(CSRF_COOKIE_NAME + '-client', token, {
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24,
    });
    return res;
  };
}
