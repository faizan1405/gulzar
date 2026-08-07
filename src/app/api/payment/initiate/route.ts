import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PREMIUM_PACKAGES, PackageType } from '@/lib/packages';
import { getProfileByUserId, createPackagePurchase } from '@/lib/profileStore';
import { safeJsonBody } from '@/lib/requestUtils';
import { jwtGuard } from '@/lib/jwtGuard';

export async function POST(req: NextRequest) {
  try {
    const jwtResult = await jwtGuard(req);
    if (jwtResult) return jwtResult;

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const activeUserId = session.user.id;

    const bodyOrResponse = await safeJsonBody(req, { maxSizeKB: 20 });
    if (bodyOrResponse instanceof Response) return bodyOrResponse;
    const body = bodyOrResponse as { packageType?: string };
    const packageTypeInput = (body.packageType || 'monthly_membership') as PackageType;

    const pkgDef = PREMIUM_PACKAGES[packageTypeInput];
    if (!pkgDef) {
      return NextResponse.json({ error: 'Invalid package type' }, { status: 400 });
    }

    const profile = await getProfileByUserId(activeUserId);
    if (!profile) {
      return NextResponse.json({ error: 'Please create your matrimonial profile card first.' }, { status: 400 });
    }
    if (profile.profileCompletionStatus !== 'COMPLETE') {
      return NextResponse.json({ error: 'Please complete your matrimonial profile form before purchasing a package.' }, { status: 400 });
    }

    const totalAmount = pkgDef.totalAmount;

    // Create a pending purchase record
    const purchase = await createPackagePurchase({
      profileId: profile.id,
      packageType: packageTypeInput,
      basePrice: pkgDef.basePrice,
      gstRate: pkgDef.gstRate,
      totalAmount: totalAmount,
      billingType: pkgDef.billingType,
      successFeeAmount: pkgDef.successFeeAmount,
    });

    const referenceId = purchase.paymentReferenceId || purchase.id;

    return NextResponse.json({
      success: true,
      purchaseId: referenceId,
      amount: totalAmount,
      packageName: pkgDef.name,
      upiId: process.env.NEXT_PUBLIC_UPI_ID || '9873721207-13@ybl',
      payeeName: process.env.NEXT_PUBLIC_UPI_PAYEE_NAME || 'Rishte Forever',
      qrCodeUrl: process.env.NEXT_PUBLIC_UPI_QR || '/images/upi-qr.png.jpeg',
    });
  } catch (error) {
    console.error('Failed to initiate payment:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
