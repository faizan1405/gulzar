import { NextResponse } from 'next/server';

const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim());

const ALLOWED_METHODS = 'GET, POST, PUT, PATCH, DELETE, OPTIONS';
const ALLOWED_HEADERS = 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With';

function getOrigin(origin: string | null): string {
  if (!origin) return ALLOWED_ORIGINS[0];
  return ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
}

export function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigin = getOrigin(origin);
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': ALLOWED_METHODS,
    'Access-Control-Allow-Headers': ALLOWED_HEADERS,
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'true',
  };
}

export function applyCors(res: NextResponse, origin: string | null): NextResponse {
  const headers = getCorsHeaders(origin);
  for (const [key, value] of Object.entries(headers)) {
    res.headers.set(key, value);
  }
  return res;
}

/**
 * Return a 204 preflight response for CORS OPTIONS requests.
 */
export function corsPreflightResponse(origin: string | null): NextResponse {
  const res = new NextResponse(null, { status: 204 });
  return applyCors(res, origin);
}
