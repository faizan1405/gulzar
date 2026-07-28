import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getVerificationRequests, updateVerificationStatus, getAuditLogs } from '@/lib/profileStore';
import { prisma } from '@/lib/db';
import { notifyVerificationStatus } from '@/lib/notifications';
import { VerificationStatus } from '@prisma/client';
import { checkRateLimitByName, buildRateLimitHeaders } from '@/lib/rateLimit';
import { logAudit } from '@/lib/audit';
import { csrfGuard } from '@/lib/csrfGuard';
import { safeJsonBody } from '@/lib/requestUtils';

// Helper to check if admin
async function isAdmin(): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === 'ADMIN';
}

// Get all verification requests
export async function GET(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized. Admin role required.' }, { status: 403 });
    }

    const session = await auth();
    const rlResult = await checkRateLimitByName('profiles', session?.user?.id || 'anon');
    if (!rlResult.allowed) {
      return NextResponse.json({ error: 'Too many requests. Please slow down.' }, {
        status: 429, headers: buildRateLimitHeaders(rlResult),
      });
    }

    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('mode');

    let skip = parseInt(searchParams.get('skip') || '0');
    let take = parseInt(searchParams.get('take') || '20');
    if (skip < 0 || isNaN(skip)) skip = 0;
    if (take < 1 || take > 50) take = 20;

    if (mode === 'audit') {
      const logs = await getAuditLogs();
      const total = logs.length;
      const paged = logs.slice(skip, skip + take);
      return NextResponse.json({ logs: paged, total, skip, take });
    }

    const requests = await getVerificationRequests();
    const total = requests.length;
    const paged = requests.slice(skip, skip + take);
    return NextResponse.json({ requests: paged, total, skip, take });
  } catch (error) {
    console.error('Failed to fetch verification requests:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// Update verification status
export async function POST(req: NextRequest) {
  try {
    const csrfResult = await csrfGuard(req);
    if (csrfResult) return csrfResult;

    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized. Admin role required.' }, { status: 403 });
    }

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized. User ID required.' }, { status: 401 });
    }

    // Rate limit admin mutations: 20/min
    const vResult = await checkRateLimitByName('adminMutation', session.user.id);
    if (!vResult.allowed) {
      return NextResponse.json({ error: 'Too many requests. Please slow down.' }, {
        status: 429, headers: buildRateLimitHeaders(vResult),
      });
    }

    const bodyOrResponse = await safeJsonBody(req, { maxSizeKB: 10 });
    if (bodyOrResponse instanceof Response) return bodyOrResponse;
    const body = bodyOrResponse as any;
    const { profileId, status, notes } = body;

    if (!profileId || !status) {
      return NextResponse.json({ error: 'ProfileId and status are required' }, { status: 400 });
    }

    const validStatuses: VerificationStatus[] = ['PENDING', 'APPROVED', 'REJECTED', 'NEEDS_FOLLOW_UP'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid verification status' }, { status: 400 });
    }

    await updateVerificationStatus(profileId, status as VerificationStatus, notes || '', session.user.id);

    try {
      const profile = await prisma.matrimonialProfile.findUnique({
        where: { id: profileId },
        include: { user: true }
      });
      if (profile) {
        const userEmail = profile.user?.email || null;
        notifyVerificationStatus(userEmail, profile.phoneNumber, profile.fullName, status);
      }
    } catch (e) {
      console.error(
        `[NOTIFY FAILED] Verification notification failed for profileId=${profileId} status=${status}:`,
        e
      );
    }

    await logAudit({
      actorUserId: session?.user?.id || 'unknown',
      action: 'ADMIN_VERIFY_PROFILE',
      targetType: 'MatrimonialProfile',
      targetId: profileId,
      metadata: status,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update verification status:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
