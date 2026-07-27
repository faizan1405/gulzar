import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { submitUserPaymentClaim } from '@/lib/profileStore';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const activeUserId = session.user.id;

    const { purchaseId, userSubmittedTxnId, userName, userPhone } = await req.json();

    if (!purchaseId) {
      return NextResponse.json({ error: 'Missing purchaseId' }, { status: 400 });
    }

    if (!userName && !userPhone) {
      return NextResponse.json({ error: 'Please provide at least your name or phone number.' }, { status: 400 });
    }

    // Submit the user's payment claim
    const purchase = await submitUserPaymentClaim(
      purchaseId,
      userSubmittedTxnId || null,
      userPhone || null,
      userName || null
    );

    if (!purchase) {
      return NextResponse.json({ error: 'Purchase not found. Please try again or contact support.' }, { status: 404 });
    }

    // Notify admin about the pending payment claim (best effort, don't block user)
    try {
      const settings = await prisma.globalSettings.findFirst();
      if (settings?.adminEmail && settings.emailAlertsEnabled) {
        const packageLabel = purchase.packageType.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
        const subject = `New UPI Payment Claim - ${packageLabel} - ₹${purchase.totalAmount}`;
        const body = `
          <h2>New Payment Claim Received</h2>
          <p>A user has submitted a UPI payment claim. Please verify in your UPI app and approve/reject from the admin panel.</p>
          <hr/>
          <p><strong>Package:</strong> ${packageLabel}</p>
          <p><strong>Amount:</strong> ₹${purchase.totalAmount}</p>
          <p><strong>Name:</strong> ${userName || 'Not provided'}</p>
          <p><strong>Phone:</strong> ${userPhone || 'Not provided'}</p>
          <p><strong>UPI Transaction ID:</strong> ${userSubmittedTxnId || 'Not provided'}</p>
          <p><strong>Purchase Reference:</strong> ${purchaseId}</p>
          <hr/>
          <p><a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/packages">Go to Admin Panel &rarr;</a></p>
        `;

        const { sendEmail } = await import('@/lib/notifications');
        await sendEmail(settings.adminEmail, subject, body);

        // Also send SMS if enabled
        if (settings.smsAlertsEnabled && settings.adminPhone) {
          const { sendSMS } = await import('@/lib/notifications');
          await sendSMS(settings.adminPhone, `New UPI payment claim: ${packageLabel} - ₹${purchase.totalAmount}. User: ${userName || userPhone}. Check admin panel.`);
        }
      }
    } catch (e) {
      // Best effort — don't fail the user request if notification fails
      console.error('Admin notification error:', e);
    }

    return NextResponse.json({
      success: true,
      message: 'Payment claim submitted successfully! Admin will confirm your payment shortly.',
    });
  } catch (error) {
    console.error('Failed to submit payment claim:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
