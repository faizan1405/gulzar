import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * JWT auth guard for state-changing API routes.
 *
 * Returns null if the request carries a valid JWT session (allowing the
 * handler to continue), or a 401 Response if the token is missing or invalid.
 *
 * GET/HEAD/OPTIONS are allowed through without a token so public read
 * endpoints keep working.
 */
export async function jwtGuard(req: NextRequest): Promise<NextResponse | null> {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return null;
  }

  try {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET });
    if (!token?.sub) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: 'Invalid or expired session.' }, { status: 401 });
  }

  return null;
}
