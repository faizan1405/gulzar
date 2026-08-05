import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { PaymentStatus } from '@prisma/client';
import { logAudit } from '@/lib/audit';
import crypto from 'crypto';

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || '';

/**
 * Verify Razorpay webhook signature.
 * Razorpay sends X-Razorpay-Signature = HMAC_SHA256(rawBody, webhookSecret)
 */
function verifyRazorpaySignature(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  if (!secret) {
    console.error('Razorpay webhook secret is not configured');
    return false;
  }

  const hmac = crypto.createHmac('sha256', secret);
  const expectedSignature = hmac.update(rawBody).digest('hex');

  // Timing-safe comparison to prevent timing attacks
  try {
    const sigBuf = Buffer.from(signature, 'hex');
    const expectedBuf = Buffer.from(expectedSignature, 'hex');

    // Pad to same length for timing-safe comparison
    const maxLen = Math.max(sigBuf.length, expectedBuf.length);
    const paddedSig = Buffer.alloc(maxLen, 0);
    const paddedExpected = Buffer.alloc(maxLen, 0);
    sigBuf.copy(paddedSig);
    expectedBuf.copy(paddedExpected);

    return crypto.timingSafeEqual(paddedSig, paddedExpected);
  } catch {
    return false;
  }
}

/**
 * GET — Razorpay sends GET for webhook URL verification.
 * Return 200 to confirm the endpoint is alive.
 */
export async function GET() {
  return NextResponse.json({ status: 'ok' });
}

/**
 * POST — Receive webhook events from Razorpay.
 *
 * Supported event types:
 *  - payment.captured        → mark purchase as PAID + ACTIVE
 *  - payment.failed          → mark purchase as FAILED
 *  - payment.refunded        → update refund status
 *  - order.paid              → alternative captured event
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Read raw body for signature verification
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature') || '';

    if (!verifyRazorpaySignature(rawBody, signature, RAZORPAY_WEBHOOK_SECRET)) {
      console.error('Razorpay webhook signature verification failed');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // 2. Parse event
    const event = JSON.parse(rawBody);
    const eventType = event.event || '';

    console.log(`Razorpay webhook received: ${eventType}`);

    // 3. Handle payment.captured
    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const paymentEntity = event.payload?.payment?.entity;
      if (!paymentEntity) {
        return NextResponse.json({ error: 'Missing payment entity' }, { status: 400 });
      }

      const razorpayPaymentId = paymentEntity.id;
      const razorpayOrderId = paymentEntity.order_id;
      const amount = paymentEntity.amount; // in paise
      const amountInRupees = (amount / 100).toFixed(2);
      const method = paymentEntity.method;

      // Find purchase that has a Razorpay order ID stored — match the exact order
      // so we update the correct purchase (not just any purchase with a Razorpay ID).
      const purchase = await prisma.packagePurchase.findFirst({
        where: {
          razorpayOrderId: { equals: razorpayOrderId },
        },
        include: { profile: { include: { user: true } } },
      });

      if (!purchase) {
        console.warn(`Webhook: no purchase found for payment ${razorpayPaymentId}`);
        return NextResponse.json({ received: true, warning: 'Purchase not found' });
      }

      // Avoid double-processing
      if (purchase.paymentStatus === 'PAID' && purchase.accessStatus === 'ACTIVE') {
        console.log(`Webhook: purchase ${purchase.id} already active, skipping`);
        return NextResponse.json({ received: true, message: 'Already processed' });
      }

      // Update purchase — store the Razorpay order ID for future matching
      const updated = await prisma.packagePurchase.update({
        where: { id: purchase.id },
        data: {
          paymentStatus: PaymentStatus.PAID,
          accessStatus: 'ACTIVE',
          razorpayOrderId: razorpayOrderId,
        },
      });

      await logAudit({
        actorUserId: null,
        action: 'RAZORPAY_WEBHOOK_CAPTURED',
        targetType: 'PackagePurchase',
        targetId: purchase.id,
        metadata: `Payment ${razorpayOrderId} via ${method} INR ${amountInRupees}`,
      });

      // Notify user their package is now active
      try {
        const { notifyMembership } = await import('@/lib/notifications');
        const profile = purchase.profile;
        const userEmail = profile?.user?.email ?? null;
        const phoneNumber = profile?.phoneNumber ?? null;
        const fullName = profile?.fullName ?? '';
        notifyMembership(userEmail, phoneNumber, fullName, purchase.packageType);
      } catch (e) {
        console.error('Membership notification failed after webhook:', e);
      }

      return NextResponse.json({ received: true, purchaseId: updated.id });
    }

    // 4. Handle payment.failed
    if (eventType === 'payment.failed') {
      const paymentEntity = event.payload?.payment?.entity;
      if (!paymentEntity) {
        return NextResponse.json({ error: 'Missing payment entity' }, { status: 400 });
      }

      const failureReason = paymentEntity.error_description || 'Payment failed';
      const razorpayOrderId = paymentEntity.order_id;

      const purchase = await prisma.packagePurchase.findFirst({
        where: { razorpayOrderId: { equals: razorpayOrderId } },
      });

      if (purchase) {
        await prisma.packagePurchase.update({
          where: { id: purchase.id },
          data: { paymentStatus: PaymentStatus.FAILED },
        });

        await logAudit({
          actorUserId: null,
          action: 'RAZORPAY_WEBHOOK_FAILED',
          targetType: 'PackagePurchase',
          targetId: purchase.id,
          metadata: failureReason,
        });
      }

      return NextResponse.json({ received: true });
    }

    // 5. Handle payment.refunded
    if (eventType === 'payment.refunded') {
      const paymentEntity = event.payload?.payment?.entity;
      if (!paymentEntity) {
        return NextResponse.json({ error: 'Missing payment entity' }, { status: 400 });
      }

      const razorpayOrderId = paymentEntity.order_id;

      const purchase = await prisma.packagePurchase.findFirst({
        where: { razorpayOrderId: { equals: razorpayOrderId } },
      });

      if (purchase) {
        await prisma.packagePurchase.update({
          where: { id: purchase.id },
          data: {
            paymentStatus: PaymentStatus.FAILED,
            accessStatus: 'EXPIRED',
            internalNotes: `Refunded: ${paymentEntity.refund_status}`,
          },
        });

        await logAudit({
          actorUserId: null,
          action: 'RAZORPAY_WEBHOOK_REFUNDED',
          targetType: 'PackagePurchase',
          targetId: purchase.id,
          metadata: `Refunded: ${paymentEntity.refund_status}`,
        });
      }

      return NextResponse.json({ received: true });
    }

    // 6. Unhandled event type — acknowledge but don't process
    return NextResponse.json({ received: true, ignored: eventType });
  } catch (error) {
    console.error('Razorpay webhook processing error:', error);
    // Return 200 to prevent Razorpay retries for processing errors
    // (we log the error for manual investigation)
    return NextResponse.json({ received: true, error: 'Processing error logged' });
  }
}
