import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { verifyPackagePurchase } from '@/lib/profileStore';
import { prisma } from '@/lib/db';
import { notifyMembership } from '@/lib/notifications';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const activeUserId = session?.user?.id;

    if (!activeUserId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { orderId, paymentId, signature } = await req.json();

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
    }

    const profile = await prisma.matrimonialProfile.findUnique({
      where: { userId: activeUserId }
    });

    if (!profile) {
      return NextResponse.json({ error: 'Matrimonial profile not found.' }, { status: 400 });
    }

    const existingPurchase = await prisma.packagePurchase.findFirst({
      where: { razorpayOrderId: orderId }
    });

    if (!existingPurchase) {
      return NextResponse.json({ error: 'Purchase record not found.' }, { status: 400 });
    }

    if (existingPurchase.profileId !== profile.id) {
      return NextResponse.json({ error: 'Mismatched profile ID for this payment.' }, { status: 403 });
    }

    if (existingPurchase.totalAmount !== 1) {
      return NextResponse.json({ error: 'Invalid purchase amount.' }, { status: 400 });
    }
    
    if (existingPurchase.paymentStatus === 'PAID') {
      return NextResponse.json({
        success: true,
        message: 'Payment already verified.',
        purchase: existingPurchase
      });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ error: 'Razorpay secret key not configured' }, { status: 500 });
    }

    // Verify signature cryptographically
    const bodyText = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(bodyText)
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid payment signature. Verification failed.' }, { status: 400 });
    }

    const purchase = await verifyPackagePurchase(orderId, paymentId);

    try {
      if (purchase) {
        const dbPurchase = await prisma.packagePurchase.findUnique({
          where: { id: purchase.id },
          include: { profile: { include: { user: true } } }
        });
        if (dbPurchase && dbPurchase.profile) {
          const userEmail = dbPurchase.profile.user?.email || null;
          notifyMembership(userEmail, dbPurchase.profile.phoneNumber, dbPurchase.profile.fullName, dbPurchase.packageType);
        }
      }
    } catch (e) {
      console.error('Membership notification failed', e);
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and package activated!',
      purchase,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
