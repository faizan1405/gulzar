// A simple in-memory rate limiter for serverless environments.
// Note: In Vercel, this is scoped per Edge/Serverless function instance.
// For strict global rate limiting, a Redis-based solution (like Upstash) is recommended.

type RateLimitRecord = {
  count: number;
  resetTime: number;
};

const rateLimitMap = new Map<string, RateLimitRecord>();

/**
 * Basic in-memory rate limiter
 * @param ip The client IP address
 * @param limit Max requests allowed in the window
 * @param windowMs Time window in milliseconds
 * @returns true if the rate limit is exceeded, false otherwise
 */
export function checkRateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();

  const record = rateLimitMap.get(ip);
  if (!record) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (now > record.resetTime) {
    // Window expired, reset
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  record.count += 1;
  if (record.count > limit) {
    return true; // Rate limit exceeded
  }

  return false;
}
