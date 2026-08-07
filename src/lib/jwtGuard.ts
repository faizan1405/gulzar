import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

/**
 * JWT auth guard for state-changing API routes.
 *
 * Uses `auth()` (proven working in every other route handler) instead of
 * `getToken()` to avoid cookie-resolution mismatches in Auth.js v5 beta.
 *
 * Returns null if the request has a valid session (allowing the handler to
 * continue), or a 401 Response if the session is missing/invalid.
 */
export async function jwtGuard(req: NextRequest): Promise<NextResponse | null> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: 'Invalid or expired session.' }, { status: 401 });
  }

  return null;
}