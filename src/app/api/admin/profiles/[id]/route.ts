import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { getProfileById } from '@/lib/profileStore';
import { safeJsonBody } from '@/lib/requestUtils';
import { checkRateLimit, buildRateLimitHeaders } from '@/lib/rateLimit';
import { RATE_LIMITS } from '@/lib/config';
import { sanitizeErrorMessage } from '@/lib/fallbackStore';

async function isAdmin() {
  const session = await auth();
  return session?.user?.role === 'ADMIN' && session?.user?.authMethod === 'CREDENTIALS';
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const { id } = await ctx.params;
    const profile = await getProfileById(id);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Admin profile GET failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await ctx.params;

    const rateKey = `admin:profile:patch:${id}`;
    const rl = await checkRateLimit(rateKey, RATE_LIMITS.adminMutation.limit, RATE_LIMITS.adminMutation.windowMs);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many requests.' },
        { status: 429, headers: buildRateLimitHeaders(rl) }
      );
    }

    const bodyOrResponse = await safeJsonBody(req, { maxSizeKB: 32 });
    if (bodyOrResponse instanceof Response) return bodyOrResponse;
    const body = bodyOrResponse as Record<string, unknown>;

    const allowedFields = new Set([
      'verificationStatus',
      'adminApprovalStatus',
      'category',
      'hasPaid',
      'paymentStatus',
      'packageType',
      'adminNotes',
    ]);

    const data: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(body)) {
      if (allowedFields.has(k)) data[k] = v;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'No updatable fields provided' }, { status: 400 });
    }

    const profile = await getProfileById(id);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Update the matrimonial profile fields
    const profileUpdate: Record<string, unknown> = {};
    if ('verificationStatus' in data) profileUpdate.verificationStatus = data.verificationStatus;
    if ('adminApprovalStatus' in data) profileUpdate.adminApprovalStatus = data.adminApprovalStatus;
    if ('category' in data) profileUpdate.category = data.category;
    if ('hasPaid' in data) profileUpdate.hasPaid = data.hasPaid;
    if ('adminNotes' in data) profileUpdate.adminNotes = data.adminNotes;

    if (Object.keys(profileUpdate).length > 0) {
      await prisma.matrimonialProfile.update({
        where: { id },
        data: profileUpdate,
      });
    }

    // Payment status / package binding:
    // When admin sets paymentStatus = 'PAID' for a profile, ensure a corresponding
    // PackagePurchase row exists with the chosen packageType. This is what makes
    // /api/user/purchases return the correct active package, which in turn
    // activates entitlements and updates the Membership section.
    if (data.paymentStatus === 'PAID' && data.packageType) {
      const packageType = String(data.packageType);
      const validTypes = ['monthly_membership', 'good_profile_package', 'second_marriage_package', 'high_profile_package'];
      if (!validTypes.includes(packageType)) {
        return NextResponse.json({ error: 'Invalid packageType' }, { status: 400 });
      }

      const yearlyExpiry = new Date();
      yearlyExpiry.setFullYear(yearlyExpiry.getFullYear() + 1);
      const monthlyExpiry = new Date();
      monthlyExpiry.setMonth(monthlyExpiry.getMonth() + 1);
      const expiryDate = packageType === 'monthly_membership' ? monthlyExpiry : yearlyExpiry;

      // Reuse an existing pending/failed purchase for the same profile+package
      const existing = await prisma.packagePurchase.findFirst({
        where: { profileId: id, packageType: packageType as never },
        orderBy: { createdAt: 'desc' },
      });

      if (existing) {
        await prisma.packagePurchase.update({
          where: { id: existing.id },
          data: {
            paymentStatus: 'PAID',
            accessStatus: 'ACTIVE',
            expiryDate,
            eligibilityStatus: packageType === 'high_profile_package' ? existing.eligibilityStatus : 'APPROVED',
            internalNotes: `${existing.internalNotes || ''}\n[Admin marked paid at ${new Date().toISOString()}]`,
          },
        });
      } else {
        await prisma.packagePurchase.create({
          data: {
            profileId: id,
            packageType: packageType as never,
            basePrice: 0,
            gstRate: 0,
            totalAmount: 0,
            billingType: packageType === 'monthly_membership' ? 'MONTHLY' : 'ONE_TIME',
            successFeeAmount: 0,
            paymentReferenceId: `ADMIN_${Date.now()}_${id.slice(-6)}`,
            paymentMode: 'UPI',
            paymentStatus: 'PAID',
            accessStatus: 'ACTIVE',
            eligibilityStatus: packageType === 'high_profile_package' ? 'PENDING' : 'APPROVED',
            marriageConfirmation: 'PENDING',
            successFeePaymentStatus: 'PENDING',
            expiryDate,
            internalNotes: `[Admin marked paid at ${new Date().toISOString()}]`,
          },
        });
      }

      // Keep profile.hasPaid in sync for monthly membership (legacy flag)
      if (packageType === 'monthly_membership') {
        await prisma.matrimonialProfile.update({
          where: { id },
          data: { hasPaid: true },
        });
      }
    } else if (data.paymentStatus === 'NOT_PAID' || data.paymentStatus === 'FAILED') {
      // Revoke paid purchases for this profile that the admin is un-paying.
      // We do NOT delete the records — we mark them FAILED so the audit trail
      // remains intact and the entitlement disappears immediately.
      const packageType = data.packageType ? String(data.packageType) : undefined;
      await prisma.packagePurchase.updateMany({
        where: {
          profileId: id,
          ...(packageType ? { packageType: packageType as never } : {}),
          paymentStatus: 'PAID',
        },
        data: {
          paymentStatus: 'FAILED',
          accessStatus: 'REVOKED',
        },
      });

      if (!packageType || packageType === 'monthly_membership') {
        await prisma.matrimonialProfile.update({
          where: { id },
          data: { hasPaid: false },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin profile PATCH failed:', error);
    return NextResponse.json(
      { error: sanitizeErrorMessage(error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const { id } = await ctx.params;
    await prisma.matrimonialProfile.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin profile DELETE failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
