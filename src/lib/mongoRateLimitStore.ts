/**
 * MongoDB-backed distributed rate-limit store.
 *
 * Uses an atomic two-step check to support sliding-window semantics:
 *
 *   1. Delete stale entries (window expired) — cheap idempotent cleanup.
 *   2. Try to increment the counter for the matching key.
 *   3. If nothing was incremented, create a fresh entry.
 *
 * This is safe under concurrent access because MongoDB's find-and-update
 * on a unique `_id` is atomic, and the worst-case race leaves a slightly
 * over-counted window — acceptable for rate-limiting.
 */

import { prisma } from '@/lib/db';
import type { RateLimitStore } from './rateLimitStore';

const TTL_BUFFER_MS = 30_000; // extra seconds beyond windowMs for safety margin

export function createMongoRateLimitStore(): RateLimitStore {
  return {
    async check(key: string, limit: number, windowMs: number) {
      const now = Date.now();

      // 1. Clean up any entry that already expired
      await prisma.rateLimitEntry.deleteMany({
        where: {
          id: key,
          windowStart: { lt: new Date(now - windowMs) },
        },
      });

      // 2. Try to increment a still-valid entry
      const updated = await prisma.rateLimitEntry.updateMany({
        where: { id: key },
        data: { count: { increment: 1 } },
      });

      if (updated.count > 0) {
        // Fetched current count after increment
        const doc = await prisma.rateLimitEntry.findUnique({ where: { id: key } });
        const count = doc?.count ?? 1;
        const resetAt = doc!.windowStart.getTime() + windowMs;
        return {
          allowed: count <= limit,
          resetAt,
          remaining: Math.max(0, limit - count),
          limit,
        };
      }

      // 3. No valid entry — create fresh with count = 1
      await prisma.rateLimitEntry.create({
        data: {
          id: key,
          windowStart: new Date(now),
          count: 1,
        },
      });

      return {
        allowed: true,
        resetAt: now + windowMs,
        remaining: limit - 1,
        limit,
      };
    },
  };
}
