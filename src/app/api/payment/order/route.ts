import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import Razorpay from 'razorpay';
import { PREMIUM_PACKAGES, PackageType } from '@/lib/packages';
import { getProfileByUserId, createPackagePurchase } from '@/lib/profileStore';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const simulatedUserId = req.headers.get('x-simulator-user-id');
    const activeUserId = session?.user?.id || simulatedUserId;

    if (!activeUserId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
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

    const baseAmount = pkgDef.basePrice;
    const gstAmount = baseAmount * pkgDef.gstRate;
    const totalAmount = baseAmount + gstAmount;
    const totalAmountPaise = Math.round(totalAmount * 100);

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret || keyId.includes('dummy') || keySecret.includes('dummy')) {
      console.warn('⚠️ [SIMULATOR MODE] Real Razorpay keys missing. Using Simulator Payment for testing only. Not real Razorpay payment.');
      // Create pending purchase in simulator mode
      await createPackagePurchase({
        profileId: profile.id,
        packageType: packageTypeInput,
        basePrice: baseAmount,
        gstRate: pkgDef.gstRate,
        totalAmount: totalAmount,
        billingType: pkgDef.billingType,
        successFeeAmount: pkgDef.successFeeAmount,
        razorpayOrderId: `order_sim_${Date.now()}_${packageTypeInput.toLowerCase()}`,
      });

      return NextResponse.json({
        success: true,
        isSimulated: true,
        orderId: `order_sim_${Date.now()}_${packageTypeInput.toLowerCase()}`,
        amount: totalAmountPaise,
        currency: 'INR',
        keyId: 'rzp_test_dummyKeyId123',
      });
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
      basePrice: baseAmount,
      gstRate: pkgDef.gstRate,
      totalAmount: totalAmount,
      billingType: pkgDef.billingType,
      successFeeAmount: pkgDef.successFeeAmount,
      razorpayOrderId: order.id,
    });

    return NextResponse.json({
      success: true,
      isSimulated: false,
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
