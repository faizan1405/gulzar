/**
 * Centralized rate limiting for Rishte Forever.
 *
 * Design decisions
 * ---------------
 * • A pluggable store backs every endpoint. The default is an in-memory
 *   sliding-window map (sufficient for single-instance or co-located Vercel
 *   Fluid Compute workers where function instances are reused across
 *   requests). For strictly global rate-limiting across *all* instances the
 *   `RateLimitStore` interface allows swapping in a MongoDB-backed store
 *   (see HIGH 6.2 — src/lib/mongoRateLimitStore.ts).
 * • All limits live in src/lib/config.ts under RATE_LIMITS. Route handlers
 *   should never pass magic numbers — they call `checkRateLimitByName`.
 * • Every response that exceeds the limit carries RFC 6585 headers
 *   (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, Retry-After)
 *   so clients and reverse-proxies can back off gracefully.
 */

import { NextResponse } from 'next/server';
import { RATE_LIMITS } from '@/lib/config';
import type { RateLimitStore } from './rateLimitStore';

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

export interface RateLimitPreset {
  /** Max requests allowed in the window */
  limit: number;
  /** Window length in milliseconds */
  windowMs: number;
}

type PresetName = keyof typeof RATE_LIMITS;

interface RateLimitState {
  /** Sliding-window start timestamp (ms) */
  windowStart: number;
  /** Requests seen in current window */
  count: number;
}

export interface RateLimitResult {
  allowed: boolean;
  /** When the window resets (epoch ms) */
  resetAt: number;
  /** Requests remaining in current window */
  remaining: number;
  /** The limit that was applied */
  limit: number;
}

export type RateLimitHeaders = Record<string, string>;

/* ------------------------------------------------------------------ */
/*  In-memory store (default)                                         */
/* ------------------------------------------------------------------ */

class InMemoryRateLimitStore implements RateLimitStore {
  private readonly store = new Map<string, RateLimitState>();
  private cleanupTimer: ReturnType<typeof setInterval> | null = null;
  private static readonly CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

  private startCleanup(): void {
    if (this.cleanupTimer) return;
    this.cleanupTimer = setInterval(() => {
      const now = Date.now();
      for (const [key, state] of this.store) {
        // Approximate max window (1 hour) — entries beyond this are stale
        if (now > state.windowStart + 3_600_000) {
          this.store.delete(key);
        }
      }
    }, InMemoryRateLimitStore.CLEANUP_INTERVAL_MS);
  }

  private getState(key: string, windowMs: number): RateLimitState {
    const now = Date.now();
    const state = this.store.get(key);

    if (!state || now > state.windowStart + windowMs) {
      const fresh: RateLimitState = { windowStart: now, count: 0 };
      this.store.set(key, fresh);
      return fresh;
    }

    return state;
  }

  async check(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
    this.startCleanup();
    const state = this.getState(key, windowMs);
    state.count += 1;

    const remaining = Math.max(0, limit - state.count);
    const resetAt = state.windowStart + windowMs;

    return {
      allowed: state.count <= limit,
      resetAt,
      remaining,
      limit,
    };
  }
}

/* ------------------------------------------------------------------ */
/*  Pluggable store — default to in-memory; MongoDB store selected    */
/*  when DISTRIBUTED_RATE_LIMIT_ENABLED=1 in the environment.          */
/* ------------------------------------------------------------------ */

let _store: RateLimitStore | null = null;

async function getStore(): Promise<RateLimitStore> {
  if (_store) return _store;

  if (process.env.DISTRIBUTED_RATE_LIMIT_ENABLED === '1') {
    // Dynamic import keeps the MongoDB path optional and tree-shaken
    // out of cold paths when it's not used.
    const { createMongoRateLimitStore } = await import('./mongoRateLimitStore');
    _store = createMongoRateLimitStore();
  } else {
    _store = new InMemoryRateLimitStore();
  }
  return _store;
}

/**
 * Override the rate-limit store (mostly useful for tests).
 */
export function setRateLimitStore(store: RateLimitStore | null): void {
  _store = store;
}

/* ------------------------------------------------------------------ */
/*  Public API                                                        */
/* ------------------------------------------------------------------ */

/**
 * Check a rate limit by raw parameters.
 *
 * @param key Unique identifier (e.g. "user:abc" or IP address).
 * @param limit Max requests in the window.
 * @param windowMs Window length in ms.
 * @returns Detailed result including remaining quota and reset timestamp.
 *
 * NOTE: Currently a pass-through (always allows) for development ease.
 *       Re-enable the store.check() call below when rate limiting is needed.
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  // Pass-through — no rate limiting in development
  return {
    allowed: true,
    resetAt: Date.now() + windowMs,
    remaining: limit,
    limit,
  };

  // --- Original implementation (re-enable when needed) ---
  // const store = await getStore();
  // return store.check(key, limit, windowMs);
}

/**
 * Check a rate limit by preset name from src/lib/config.ts.
 *
 * All named presets:
 *   general, shortlistGet, shortlistPost, interestsGet, interestsPost,
 *   profileViewGet, adminMutation, adminDelete, changePassword
 *
 * @param preset One of the keys of RATE_LIMITS.
 * @param key Unique identifier (user ID, IP, etc.).
 */
export async function checkRateLimitByName(
  preset: PresetName,
  key: string
): Promise<RateLimitResult> {
  const cfg = RATE_LIMITS[preset];
  return checkRateLimit(key, cfg.limit, cfg.windowMs);
}

/**
 * Build RFC 6585 rate-limit response headers from a RateLimitResult.
 */
export function buildRateLimitHeaders(result: RateLimitResult): RateLimitHeaders {
  const headers: RateLimitHeaders = {
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': new Date(result.resetAt).toISOString(),
  };

  if (!result.allowed) {
    const retryAfter = Math.max(1, Math.ceil((result.resetAt - Date.now()) / 1000));
    headers['Retry-After'] = String(retryAfter);
  }

  return headers;
}

/**
 * Convenience: check + build a 429 response in one call.
 */
export async function rateLimitResponse(
  result: RateLimitResult,
  message = 'Too many requests. Please slow down.'
): Promise<NextResponse> {
  const headers: Record<string, string> = { ...buildRateLimitHeaders(result) };
  return NextResponse.json({ error: message }, {
    status: 429,
    headers,
  });
}
