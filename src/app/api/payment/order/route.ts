import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import Razorpay from 'razorpay';
import { PREMIUM_PACKAGES, PackageType } from '@/lib/packages';
import { getProfileByUserId, createPackagePurchase } from '@/lib/profileStore';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const activeUserId = session?.user?.id;

    if (!activeUserId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const packageTypeInput = (body.packageType || 'monthly_membership') as PackageType;

    const pkgDef = PREMIUM_PACKAGES[packageTypeInput];
    if (!pkgDef) {
      return NextResponse.json({ error: 'Invalid package type' }, { status: 400 });
    }

    const baseAmount = 1;
    const gstAmount = 0;
    const totalAmount = 1;
    const totalAmountPaise = 100;

    const profile = await getProfileByUserId(activeUserId);
    if (!profile) {
      return NextResponse.json({ error: 'Please create your matrimonial profile card first.' }, { status: 400 });
    }
    if (profile.profileCompletionStatus !== 'COMPLETE') {
      return NextResponse.json({ error: 'Please complete your matrimonial profile form before purchasing a package.' }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json({ error: 'Razorpay payment gateway is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.' }, { status: 500 });
    }

    const razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const order = await razorpayInstance.orders.create({
      amount: totalAmountPaise,
      currency: 'INR',
      receipt: `receipt_sub_${profile.id}_${Date.now()}`,
    });

    // Create pending purchase record in DB
    await createPackagePurchase({
      profileId: profile.id,
      packageType: packageTypeInput,
      basePrice: 1,
      gstRate: 0,
      totalAmount: 1,
      billingType: pkgDef.billingType,
      successFeeAmount: 0,
      razorpayOrderId: order.id,
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
