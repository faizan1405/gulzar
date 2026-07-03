import { NextResponse, type NextRequest } from 'next/server';
import type { Session } from 'next-auth';
import { isDemoMode, parseEnvBoolean, isPublicDemoMode } from './demoEnv';

export { isDemoMode, parseEnvBoolean, isPublicDemoMode };

export const DEMO_DISABLED_MESSAGE = 'This action is disabled in demo mode.';

/**
 * Use this in mutation APIs to check if they are blocked by demo mode.
 */
export function isDemoMutationBlocked() {
  return isDemoMode();
}

/**
 * Use this in mutation APIs to check if they are blocked by demo mode.
 */
export function isDemoMutationBlocked() {
  return isDemoMode();
}

export function getDemoUserId(req: NextRequest) {
  if (!isDemoMode()) return null;
  return req.headers.get('x-simulator-user-id');
}

export function isDemoAdminRequest(req: NextRequest) {
  return isDemoMode() && req.headers.get('x-simulator-admin') === 'true';
}

export function getDemoAdminId(req: NextRequest) {
  if (!isDemoAdminRequest(req)) return null;
  return req.headers.get('x-simulator-admin-id') || 'simulated-admin-id';
}

export function isAdminSessionOrDemo(req: NextRequest, session: Session | null) {
  return session?.user?.role === 'ADMIN' || isDemoAdminRequest(req);
}

export function demoMutationResponse() {
  return NextResponse.json({ error: DEMO_DISABLED_MESSAGE }, { status: 403 });
}

