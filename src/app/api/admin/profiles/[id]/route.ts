import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { getValidObjectId, isFallbackAllowed, logFallbackWarning } from '@/lib/profileStore';
import { checkRateLimitByName, buildRateLimitHeaders } from '@/lib/rateLimit';
import { logAudit } from '@/lib/audit';
import { csrfGuard } from '@/lib/csrfGuard';
import { safeJsonBody } from '@/lib/requestUtils';

async function isAdmin(): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === 'ADMIN';
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const csrfResult = await csrfGuard(req);
    if (csrfResult) return csrfResult;

    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const session = await auth();

    // Rate limit admin mutations: 30/min
    const pResult = await checkRateLimitByName('adminMutation', session?.user?.id || 'anon');
    if (!pResult.allowed) {
      return NextResponse.json({ error: 'Too many requests. Please slow down.' }, {
        status: 429, headers: buildRateLimitHeaders(pResult),
      });
    }

    const { id } = await params;
    const bodyOrResponse = await safeJsonBody(req, { maxSizeKB: 100 });
    if (bodyOrResponse instanceof Response) return bodyOrResponse;
    const body = bodyOrResponse as any;

    // Whitelist updatable fields to prevent mass-assignment
    const allowed = [
      'verificationStatus',
      'adminApprovalStatus',
      'profileCompletionStatus',
      'hasPaid',
      'category',
      'fullName',
      'phoneNumber',
      'city',
      'state',
      'occupation',
      'education',
      'bio',
      'maslak',
      'biradari',
      'themeColor',
      'profileImageUrl',
      'profileImageStatus',
    ];
    const updateData: Record<string, any> = {};
    for (const key of allowed) {
      if (key in body) updateData[key] = body[key];
    }
    updateData.updatedAt = new Date();

    try {
      const dbId = getValidObjectId(id);
      const updated = await prisma.matrimonialProfile.update({
        where: { id: dbId },
        data: updateData,
      });

      await logAudit({
        actorUserId: session?.user?.id || 'unknown',
        action: 'ADMIN_UPDATE_PROFILE',
        targetType: 'MatrimonialProfile',
        targetId: id,
        metadata: JSON.stringify({ fields: Object.keys(updateData) }),
      });

      return NextResponse.json({ success: true, profile: updated });
    } catch (dbErr: any) {
      if (!isFallbackAllowed()) throw dbErr;
      logFallbackWarning('Profile update');
      return NextResponse.json({ success: true, profile: { id, ...updateData } });
    }
  } catch (error: any) {
    console.error('Admin profile PATCH failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const csrfResult = await csrfGuard(req);
    if (csrfResult) return csrfResult;

    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const session = await auth();

    // Rate limit admin deletions: 10/min
    const pDelResult = await checkRateLimitByName('adminDelete', session?.user?.id || 'anon');
    if (!pDelResult.allowed) {
      return NextResponse.json({ error: 'Too many requests. Please slow down.' }, {
        status: 429, headers: buildRateLimitHeaders(pDelResult),
      });
    }

    const { id } = await params;

    try {
      const dbId = getValidObjectId(id);
      await prisma.matrimonialProfile.delete({ where: { id: dbId } });

      await logAudit({
        actorUserId: session?.user?.id || 'unknown',
        action: 'ADMIN_DELETE_PROFILE',
        targetType: 'MatrimonialProfile',
        targetId: id,
        metadata: null,
      });

      return NextResponse.json({ success: true });
    } catch (dbErr: any) {
      if (!isFallbackAllowed()) throw dbErr;
      logFallbackWarning('Profile deletion');
      return NextResponse.json({ success: true });
    }
  } catch (error: any) {
    console.error('Admin profile DELETE failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
