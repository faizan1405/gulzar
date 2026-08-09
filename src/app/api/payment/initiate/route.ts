import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getProfileByUserId } from '@/lib/profileStore';
import { createPackagePurchase, submitUserPaymentClaim } from '@/lib/packageStore';
import { PREMIUM_PACKAGES, PACKAGE_DISPLAY } from '@/lib/packages';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { packageType } = body;

    if (!packageType || !PREMIUM_PACKAGES[packageType as keyof typeof PREMIUM_PACKAGES]) {
      return NextResponse.json({ error: 'Invalid package selected.' }, { status: 400 });
    }

    const profile = await getProfileByUserId(session.user.id);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found. Please complete registration first.' }, { status: 404 });
    }

    if (profile.profileCompletionStatus !== 'COMPLETE') {
      return NextResponse.json({ error: 'Please complete your profile before purchasing.' }, { status: 400 });
    }

    const pkg = PREMIUM_PACKAGES[packageType as keyof typeof PREMIUM_PACKAGES];

    const purchase = await createPackagePurchase({
      profileId: profile.id,
      packageType: pkg.type as any,
      basePrice: pkg.basePrice,
      gstRate: pkg.gstRate,
      totalAmount: pkg.totalAmount,
      billingType: pkg.billingType as any,
      successFeeAmount: pkg.successFeeAmount,
    });

    if (!purchase) {
      return NextResponse.json({ error: 'Failed to create purchase. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      purchaseId: purchase.id,
      amount: purchase.totalAmount,
      upiId: process.env.NEXT_PUBLIC_UPI_ID || '',
      qrCodeUrl: process.env.NEXT_PUBLIC_UPI_QR || '',
      planName: PACKAGE_DISPLAY[pkg.type] || pkg.name,
    });
  } catch (error) {
    console.error('Payment initiate error:', error);
    return NextResponse.json({ error: 'Unable to initiate payment. Please try again.' }, { status: 500 });
  }
}
