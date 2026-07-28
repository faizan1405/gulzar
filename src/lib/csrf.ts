import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * CSRF token generation and validation.
 *
 * Uses the double-submit cookie pattern:
 * 1. Server sets a CSRF cookie (httpOnly, SameSite=Strict) with a random token.
 * 2. Client sends the same token back in a request header (X-CSRF-Token).
 * 3. Server compares cookie value vs. header value — they must match.
 *
 * This protects against cross-origin requests because a malicious site
 * cannot read httpOnly cookies to copy the token into the request header.
 */

const CSRF_COOKIE_NAME = 'x-csrf-token';
const CSRF_HEADER_NAME = 'x-csrf-token';
const CSRF_TOKEN_LENGTH = 32;

/**
 * Generate a cryptographically random CSRF token.
 */
export function generateCsrfToken(): string {
  const bytes = new Uint8Array(CSRF_TOKEN_LENGTH);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate that the CSRF header matches the CSRF cookie.
 * Returns true if valid, false if missing or mismatched.
 */
export function validateCsrf(req: NextRequest): boolean {
  const cookieToken = req.cookies.get(CSRF_COOKIE_NAME)?.value;
  const headerToken = req.headers.get(CSRF_HEADER_NAME);

  if (!cookieToken || !headerToken) return false;
  if (cookieToken.length !== CSRF_TOKEN_LENGTH) return false;

  // Constant-time comparison to prevent timing attacks
  // Use Node.js crypto.timingSafeEqual (synchronous) since SubtleCrypto's
  // version is async and not suitable for synchronous validation flows.
  try {
    const cookieBuf = Buffer.from(cookieToken);
    const headerBuf = Buffer.from(headerToken);
    const maxLen = Math.max(cookieBuf.length, headerBuf.length);
    const paddedCookie = Buffer.alloc(maxLen, 0);
    const paddedHeader = Buffer.alloc(maxLen, 0);
    cookieBuf.copy(paddedCookie);
    headerBuf.copy(paddedHeader);
    return crypto.timingSafeEqual(paddedCookie, paddedHeader);
  } catch {
    return false;
  }
}

/**
 * Set a CSRF cookie on the response.
 */
export function setCsrfCookie(res: NextResponse, token: string): NextResponse {
  res.cookies.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  });
  return res;
}

export { CSRF_COOKIE_NAME, CSRF_HEADER_NAME };
