import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getVerificationRequests, updateVerificationStatus, getAuditLogs } from '@/lib/profileStore';
import { prisma } from '@/lib/db';
import { notifyVerificationStatus } from '@/lib/notifications';
import { VerificationStatus } from '@prisma/client';

// Helper to check if admin
async function isAdmin() {
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
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// Update verification status
export async function POST(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized. Admin role required.' }, { status: 403 });
    }

    const session = await auth();
    const adminUserId = session?.user?.id || 'admin';

    const body = await req.json();
    const { profileId, status, notes } = body;

    if (!profileId || !status) {
      return NextResponse.json({ error: 'ProfileId and status are required' }, { status: 400 });
    }

    const validStatuses: VerificationStatus[] = ['PENDING', 'APPROVED', 'REJECTED', 'NEEDS_FOLLOW_UP'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid verification status' }, { status: 400 });
    }

    await updateVerificationStatus(profileId, status as VerificationStatus, notes || '', adminUserId);

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
      console.error('Failed to notify verification status', e);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
