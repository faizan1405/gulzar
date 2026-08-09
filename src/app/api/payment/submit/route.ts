import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { submitUserPaymentClaim } from '@/lib/packageStore';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { purchaseId, userSubmittedTxnId, userName, userPhone } = body;

    if (!purchaseId || typeof purchaseId !== 'string') {
      return NextResponse.json({ error: 'Purchase ID is required.' }, { status: 400 });
    }

    // The submitUserPaymentClaim uses paymentReferenceId, but the frontend
    // sends the purchase's MongoDB _id.  We accept either: if the value
    // looks like an ObjectId (24 hex chars) we pass it straight through
    // and switch to an id-based lookup in packageStore below.
    const referenceId = purchaseId;

    const updated = await submitUserPaymentClaim(
      referenceId,
      userSubmittedTxnId?.trim() || null,
      userPhone?.trim() || null,
      userName?.trim() || null
    );

    if (!updated) {
      return NextResponse.json({ error: 'Purchase not found or claim could not be saved.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Payment claim submitted. Admin will verify and activate your package shortly.',
    });
  } catch (error) {
    console.error('Payment submit error:', error);
    return NextResponse.json({ error: 'Unable to submit payment claim. Please try again.' }, { status: 500 });
  }
}
