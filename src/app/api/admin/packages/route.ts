import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import {
  getAllPurchases,
  getCuratedAssignments,
  assignCuratedLead,
  updateCuratedLeadStatus,
  updateHighProfileEligibility,
  confirmMarriage,
  updateSuccessFeeStatus
} from '@/lib/profileStore';
import { ApprovalStatus, PaymentStatus } from '@prisma/client';

async function isAdmin(req: NextRequest) {
  const session = await auth();
  const simulatedAdmin = req.headers.get('x-simulator-admin') === 'true';
  return session?.user?.role === 'ADMIN' || simulatedAdmin;
}

export async function GET(req: NextRequest) {
  try {
    if (!(await isAdmin(req))) {
      return NextResponse.json({ error: 'Unauthorized. Admin role required.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('mode');

    if (mode === 'assignments') {
      const assignments = await getCuratedAssignments();
      return NextResponse.json({ assignments });
    }

    const purchases = await getAllPurchases();
    return NextResponse.json({ purchases });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await isAdmin(req))) {
      return NextResponse.json({ error: 'Unauthorized. Admin role required.' }, { status: 403 });
    }

    const session = await auth();
    const simulatedAdminId = req.headers.get('x-simulator-admin-id') || 'simulated-admin-id';
    const adminUserId = session?.user?.id || simulatedAdminId;

    const body = await req.json();
    const { action } = body;

    if (action === 'assign_lead') {
      const { buyerProfileId, leadProfileId } = body;
      if (!buyerProfileId || !leadProfileId) {
        return NextResponse.json({ error: 'Missing profiles' }, { status: 400 });
      }
      const assignment = await assignCuratedLead(buyerProfileId, leadProfileId);
      return NextResponse.json({ success: true, assignment });
    }

    if (action === 'update_lead_status') {
      const { assignmentId, status } = body;
      if (!assignmentId || !status) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
      }
      const updated = await updateCuratedLeadStatus(assignmentId, status);
      return NextResponse.json({ success: true, assignment: updated });
    }

    if (action === 'update_eligibility') {
      const { purchaseId, status, notes } = body;
      if (!purchaseId || !status) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
      }
      const updated = await updateHighProfileEligibility(purchaseId, status as ApprovalStatus, notes || '', adminUserId);
      return NextResponse.json({ success: true, purchase: updated });
    }

    if (action === 'confirm_marriage') {
      const { purchaseId, confirmed } = body;
      if (!purchaseId || confirmed === undefined) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
      }
      const updated = await confirmMarriage(purchaseId, confirmed, adminUserId);
      return NextResponse.json({ success: true, purchase: updated });
    }

    if (action === 'update_success_fee_status') {
      const { purchaseId, status } = body;
      if (!purchaseId || !status) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
      }
      const updated = await updateSuccessFeeStatus(purchaseId, status as PaymentStatus, adminUserId);
      return NextResponse.json({ success: true, purchase: updated });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
