/**
 * Distributed rate-limit store interface.
 *
 * Concrete implementations must be safe for concurrent access across
 * multiple function instances / serverless workers.
 */

export interface RateLimitStore {
  /**
   * Check whether the request is allowed and record it atomically.
   *
   * @param key        Unique identifier (user ID, IP, etc.)
   * @param limit      Max requests in the window
   * @param windowMs   Window length in milliseconds
   * @returns Object with allowed state and reset timestamp
   */
  check(key: string, limit: number, windowMs: number): Promise<{
    allowed: boolean;
    resetAt: number;
    remaining: number;
    limit: number;
  }>;

  /**
   * Optional: manually expire entries (best-effort).  The store
   * should also handle TTL/expiry internally.
   */
  cleanup?(): Promise<void> | void;
}
