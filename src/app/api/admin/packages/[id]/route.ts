import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { getValidObjectId } from '@/lib/profileStore';
import { checkRateLimitByName, buildRateLimitHeaders } from '@/lib/rateLimit';
import { logAudit } from '@/lib/audit';
import { jwtGuard } from '@/lib/jwtGuard';
import { safeJsonBody } from '@/lib/requestUtils';

async function isAdmin() {
  const session = await auth();
  return session?.user?.role === 'ADMIN';
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized. Admin role required.' }, { status: 403 });
    }

    const { id } = await params;
    const dbId = getValidObjectId(id);

    const pkg = await prisma.packagePurchase.findUnique({
      where: { id: dbId },
    });

    if (!pkg) {
      return NextResponse.json({ error: 'Package not found.' }, { status: 404 });
    }

    return NextResponse.json({ package: pkg });
  } catch (error) {
    console.error('Admin package GET failed:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const jwtResult = await jwtGuard(req);
    if (jwtResult) return jwtResult;

    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized. Admin role required.' }, { status: 403 });
    }

    const session = await auth();

    // Rate limit admin mutations: 20/min
    const apResult = await checkRateLimitByName('adminMutation', session?.user?.id || 'anon');
    if (!apResult.allowed) {
      return NextResponse.json({ error: 'Too many requests. Please slow down.' }, {
        status: 429, headers: buildRateLimitHeaders(apResult),
      });
    }

    const { id } = await params;
    const bodyOrResponse = await safeJsonBody(req, { maxSizeKB: 50 });
    if (bodyOrResponse instanceof Response) return bodyOrResponse;
    const body = bodyOrResponse as any;

    // The Prisma PackagePurchase model supports these fields directly:
    //   basePrice, totalAmount, gstRate, billingType, successFeeAmount,
    //   paymentStatus, accessStatus, expiryDate, internalNotes, marriageConfirmation,
    //   successFeePaymentStatus, eligibilityStatus, upiTransactionId, userSubmittedTxnId
    const allowed = [
      'basePrice',
      'totalAmount',
      'gstRate',
      'billingType',
      'successFeeAmount',
      'paymentStatus',
      'accessStatus',
      'expiryDate',
      'internalNotes',
      'marriageConfirmation',
      'successFeePaymentStatus',
      'eligibilityStatus',
    ];
    const updateData: Record<string, any> = {};
    for (const key of allowed) {
      if (key in body) updateData[key] = body[key];
    }
    updateData.updatedAt = new Date();

    // Map isActive → accessStatus if the caller sends the convenience field
    if (typeof body.isActive === 'boolean') {
      updateData.accessStatus = body.isActive ? 'ACTIVE' : 'REVOKED';
    }

    const dbId = getValidObjectId(id);

    const updated = await prisma.packagePurchase.update({
      where: { id: dbId },
      data: updateData,
    });

    await logAudit({
      actorUserId: session?.user?.id || 'unknown',
      action: 'ADMIN_UPDATE_PACKAGE',
      targetType: 'PackagePurchase',
      targetId: id,
      metadata: JSON.stringify({ fields: Object.keys(updateData) }),
    });

    return NextResponse.json({ success: true, package: updated });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Package not found.' }, { status: 404 });
    }
    console.error('Admin package PATCH failed:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const jwtResult = await jwtGuard(_req);
    if (jwtResult) return jwtResult;

    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized. Admin role required.' }, { status: 403 });
    }

    const session = await auth();

    // Rate limit admin deletions: 10/min
    const adResult = await checkRateLimitByName('adminDelete', session?.user?.id || 'anon');
    if (!adResult.allowed) {
      return NextResponse.json({ error: 'Too many requests. Please slow down.' }, {
        status: 429, headers: buildRateLimitHeaders(adResult),
      });
    }

    const { id } = await params;
    const dbId = getValidObjectId(id)!;

    await prisma.packagePurchase.delete({ where: { id: dbId } });

    await logAudit({
      actorUserId: session?.user?.id || 'unknown',
      action: 'ADMIN_DELETE_PACKAGE',
      targetType: 'PackagePurchase',
      targetId: id,
      metadata: null,
    });

    return NextResponse.json({ success: true, message: 'Package deleted successfully.' });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Package not found.' }, { status: 404 });
    }
    console.error('Admin package DELETE failed:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
