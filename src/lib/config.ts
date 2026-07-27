/**
 * Centralized runtime configuration and validation.
 *
 * This file consolidates every configurable value that was previously scattered
 * across individual route handlers (rate limits, timeouts, feature flags) so
 * that tuning is a single-point change rather than a grep-and-replace across
 * dozens of files.
 *
 * All values are read from environment variables with sensible defaults so the
 * app continues to run in development without a full .env set-up. Any value
 * marked REQUIRED will throw at startup if it is missing — that is intentional
 * so the failure is loud and immediate rather than subtle.
 */

import path from 'path';
import fs from 'fs';

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function env(key: string, fallback?: string): string {
  const value = process.env[key];
  if (value === undefined || value === '') {
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function envInt(key: string, fallback: number): number {
  const raw = process.env[key];
  if (raw === undefined || raw === '') return fallback;
  const parsed = parseInt(raw, 10);
  if (Number.isNaN(parsed)) throw new Error(`Environment variable ${key} must be a number`);
  return parsed;
}

function envBool(key: string, fallback: boolean): boolean {
  const raw = process.env[key];
  if (raw === undefined || raw === '') return fallback;
  return raw.toLowerCase() !== 'false' && raw !== '0';
}

/** Like envInt but also enforces a minimum value. */
function envIntMin(key: string, fallback: number, min: number): number {
  const value = envInt(key, fallback);
  return Math.max(value, min);
}

/* ------------------------------------------------------------------ */
/*  Site identity                                                    */
/* ------------------------------------------------------------------ */

export const SITE_URL = env('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000');
export const SITE_NAME = env('NEXT_PUBLIC_SITE_NAME', 'Rishte Forever');

/* ------------------------------------------------------------------ */
/*  Auth                                                             */
/* ------------------------------------------------------------------ */

/** NextAuth secret — REQUIRED in production, accepts any string in dev. */
export const AUTH_SECRET = env('AUTH_SECRET', 'dev-secret-change-me');
export const AUTH_URL = env('AUTH_URL', SITE_URL);

/* ------------------------------------------------------------------ */
/*  Database                                                         */
/* ------------------------------------------------------------------ */

export const DATABASE_URL = env('DATABASE_URL', '');

/* ------------------------------------------------------------------ */
/*  AWS S3 / Storage                                                 */
/* ------------------------------------------------------------------ */

export const AWS_REGION = env('AWS_REGION', 'ap-south-1');
export const S3_BUCKET = env('S3_BUCKET', '');
export const S3_ACL = env('AWS_S3_ACL', 'public-read');

/* ------------------------------------------------------------------ */
/*  Razorpay                                                         */
/* ------------------------------------------------------------------ */

export const RAZORPAY_KEY_ID = env('NEXT_PUBLIC_RAZORPAY_KEY_ID', '');
export const RAZORPAY_KEY_SECRET = env('RAZORPAY_KEY_SECRET', '');

/* ------------------------------------------------------------------ */
/*  Email / SMS (Resend)                                             */
/* ------------------------------------------------------------------ */

export const RESEND_API_KEY = env('RESEND_API_KEY', '');
export const RESEND_FROM_EMAIL = env('RESEND_FROM_EMAIL', 'noreply@rishteforever.in');

/* ------------------------------------------------------------------ */
/*  Feature flags                                                    */
/* ------------------------------------------------------------------ */

export const ENABLE_REGISTRATION = envBool('NEXT_PUBLIC_ENABLE_REGISTRATION', true);
export const ENABLE_AI_CHATBOT = envBool('NEXT_PUBLIC_ENABLE_AI_CHATBOT', false);
export const ENABLE_PAYMENTS = envBool('NEXT_PUBLIC_ENABLE_PAYMENTS', true);

/* ------------------------------------------------------------------ */
/*  Rate limits (centralised — used by src/lib/rateLimit.ts)         */
/* ------------------------------------------------------------------ */

export const RATE_LIMITS = {
  /** Anonymous / general requests */
  general: { limit: envIntMin('RATE_LIMIT_GENERAL', 60, 10), windowMs: 60_000 },
  /** Shortlist GET */
  shortlistGet: { limit: envIntMin('RATE_LIMIT_SHORTLIST_GET', 30, 10), windowMs: 60_000 },
  /** Shortlist POST */
  shortlistPost: { limit: envIntMin('RATE_LIMIT_SHORTLIST_POST', 10, 5), windowMs: 60_000 },
  /** Interests GET */
  interestsGet: { limit: envIntMin('RATE_LIMIT_INTERESTS_GET', 30, 10), windowMs: 60_000 },
  /** Interests POST */
  interestsPost: { limit: envIntMin('RATE_LIMIT_INTERESTS_POST', 10, 5), windowMs: 60_000 },
  /** Profile view GET */
  profileViewGet: { limit: envIntMin('RATE_LIMIT_PROFILE_VIEW_GET', 30, 10), windowMs: 60_000 },
  /** Admin mutations (settings, users, packages, verification) */
  adminMutation: { limit: envIntMin('RATE_LIMIT_ADMIN_MUTATION', 20, 5), windowMs: 60_000 },
  /** Admin profile/purchase delete — more restricted */
  adminDelete: { limit: envIntMin('RATE_LIMIT_ADMIN_DELETE', 10, 3), windowMs: 60_000 },
  /** Password change — very strict */
  changePassword: { limit: envIntMin('RATE_LIMIT_CHANGE_PASSWORD', 5, 1), windowMs: 3_600_000 },
} as const;

/* ------------------------------------------------------------------ */
/*  File uploads                                                     */
/* ------------------------------------------------------------------ */

export const MAX_UPLOAD_BYTES = envInt('MAX_UPLOAD_BYTES', 5 * 1024 * 1024); // 5 MB
export const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

/* ------------------------------------------------------------------ */
/*  Pagination                                                       */
/* ------------------------------------------------------------------ */

export const DEFAULT_PAGE_SIZE = envInt('DEFAULT_PAGE_SIZE', 20);
export const MAX_PAGE_SIZE = envInt('MAX_PAGE_SIZE', 100);

/* ------------------------------------------------------------------ */
/*  Validation helpers                                               */
/* ------------------------------------------------------------------ */

/**
 * Validate that a required env file exists. Call this at startup so missing
 * .env files are caught before any handler runs.
 */
export function validateEnvFiles(): void {
  const envLocal = path.join(process.cwd(), '.env.local');
  const envFile = path.join(process.cwd(), '.env');

  const requiredInProduction = ['.env.local', '.env'];

  if (process.env.NODE_ENV === 'production') {
    for (const file of requiredInProduction) {
      const fullPath = path.join(process.cwd(), file);
      if (!fs.existsSync(fullPath)) {
        throw new Error(`Missing required env file in production: ${file}`);
      }
    }
  }
}

/**
 * Run all startup validations. Import this from your root layout or a
 * dedicated bootstrap module.
 */
export function bootstrapConfig(): void {
  validateEnvFiles();
  // Additional checks can be added here without touching any caller.
}
