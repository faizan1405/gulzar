import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getVerificationRequests, updateVerificationStatus, getAuditLogs } from '@/lib/profileStore';
import { prisma } from '@/lib/db';
import { notifyVerificationStatus } from '@/lib/notifications';
import { VerificationStatus } from '@prisma/client';
import { checkRateLimit } from '@/lib/rateLimit';
import { logAudit } from '@/lib/audit';

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

    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('mode');

    if (mode === 'audit') {
      const logs = await getAuditLogs();
      return NextResponse.json({ logs });
    }

    const requests = await getVerificationRequests();
    return NextResponse.json({ requests });
  } catch (error) {
    console.error('Failed to fetch verification requests:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// Update verification status
export async function POST(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized. Admin role required.' }, { status: 403 });
    }

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized. User ID required.' }, { status: 401 });
    }

    // Rate limit admin mutations: 20/min
    if (checkRateLimit(`admin-verification:${session?.user?.id}`, 20, 60 * 1000)) {
      return NextResponse.json({ error: 'Too many requests. Please slow down.' }, { status: 429 });
    }

    const body = await req.json();
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
