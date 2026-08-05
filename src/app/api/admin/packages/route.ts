import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import {
  getAllPurchases,
  getCuratedAssignments,
  assignCuratedLead,
  updateCuratedLeadStatus,
  updateHighProfileEligibility,
  confirmMarriage,
  updateSuccessFeeStatus,
  activatePackageByAdmin,
  rejectPaymentClaim,
} from '@/lib/profileStore';
import { ApprovalStatus, PaymentStatus } from '@prisma/client';
import { checkRateLimitByName, buildRateLimitHeaders } from '@/lib/rateLimit';
import { logAudit } from '@/lib/audit';
import { csrfGuard } from '@/lib/csrfGuard';
import { safeJsonBody } from '@/lib/requestUtils';

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    if (admin.error) return admin.error;

    const session = admin.session;
    const rlResult = await checkRateLimitByName('profiles', session?.user?.id || 'anon');
    if (!rlResult.allowed) {
      return NextResponse.json({ error: 'Too many requests. Please slow down.' }, {
        status: 429, headers: buildRateLimitHeaders(rlResult),
      });
    }

    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode');

    let skip = parseInt(searchParams.get('skip') || '0');
    let take = parseInt(searchParams.get('take') || '50');
    if (skip < 0 || isNaN(skip)) skip = 0;
    if (take < 1 || take > 100) take = 50;

    if (mode === 'assignments') {
      const assignments = await getCuratedAssignments();
      return NextResponse.json({ assignments, total: assignments.length, skip: 0, take: assignments.length });
    }

    const purchases = await getAllPurchases();
    const total = purchases.length;
    const paged = purchases.slice(skip, skip + take);
    return NextResponse.json({ purchases: paged, total, skip, take });
  } catch (error) {
    console.error('Failed to fetch packages/purchases:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { error: NextResponse.json({ error: 'Unauthorized. Admin role required.' }, { status: 403 }), session: null };
  }
  return { error: null, session };
}

export async function POST(req: NextRequest) {
  try {
    const csrfResult = await csrfGuard(req);
    if (csrfResult) return csrfResult;

    const admin = await requireAdmin();
    if (admin.error) return admin.error;
    const session = admin.session;
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized. Admin role required.' }, { status: 403 });
    }

    const adminUserId = session.user.id;

    // Rate limit admin mutations: 30/min
    const pkgResult = await checkRateLimitByName('adminMutation', adminUserId);
    if (!pkgResult.allowed) {
      return NextResponse.json({ error: 'Too many requests. Please slow down.' }, {
        status: 429, headers: buildRateLimitHeaders(pkgResult),
      });
    }

    const bodyOrResponse = await safeJsonBody(req, { maxSizeKB: 50 });
    if (bodyOrResponse instanceof Response) return bodyOrResponse;
    const body = bodyOrResponse as any;
    const { action } = body;

    if (action === 'assign_lead') {
      const { buyerProfileId, leadProfileId } = body;
      if (!buyerProfileId || !leadProfileId) {
        return NextResponse.json({ error: 'Missing profiles' }, { status: 400 });
      }
      const assignment = await assignCuratedLead(buyerProfileId, leadProfileId);
      await logAudit({ actorUserId: adminUserId, action: 'ADMIN_ASSIGN_LEAD', targetType: 'CuratedAssignment', targetId: assignment.id, metadata: `${buyerProfileId} -> ${leadProfileId}` });
      return NextResponse.json({ success: true, assignment });
    }

    if (action === 'update_lead_status') {
      const { assignmentId, status } = body;
      if (!assignmentId || !status) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
      }
      const updated = await updateCuratedLeadStatus(assignmentId, status);
      await logAudit({ actorUserId: adminUserId, action: 'ADMIN_UPDATE_LEAD_STATUS', targetType: 'CuratedAssignment', targetId: assignmentId, metadata: status });
      return NextResponse.json({ success: true, assignment: updated });
    }

    if (action === 'update_eligibility') {
      const { purchaseId, status, notes } = body;
      if (!purchaseId || !status) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
      }
      const updated = await updateHighProfileEligibility(purchaseId, status as ApprovalStatus, notes || '', adminUserId);
      await logAudit({ actorUserId: adminUserId, action: 'ADMIN_UPDATE_ELIGIBILITY', targetType: 'PackagePurchase', targetId: purchaseId, metadata: status });
      return NextResponse.json({ success: true, purchase: updated });
    }

    if (action === 'confirm_marriage') {
      const { purchaseId, confirmed } = body;
      if (!purchaseId || confirmed === undefined) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
      }
      const updated = await confirmMarriage(purchaseId, confirmed, adminUserId);
      await logAudit({ actorUserId: adminUserId, action: 'ADMIN_CONFIRM_MARRIAGE', targetType: 'PackagePurchase', targetId: purchaseId, metadata: String(confirmed) });
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

    // NEW: Admin approves the user's UPI payment claim — activates the package
    if (action === 'confirm_payment') {
      const { purchaseId, upiTransactionId, approve } = body;
      if (!purchaseId || approve === undefined) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
      }
      if (approve) {
        const updated = await activatePackageByAdmin(purchaseId, upiTransactionId || null);
        if (!updated) {
          return NextResponse.json({ error: 'Purchase not found' }, { status: 404 });
        }
        // Send user notification that their package is now active
        try {
          const { prisma } = await import('@/lib/db');
          const fullPurchase = await prisma.packagePurchase.findUnique({
            where: { id: updated.id },
            include: { profile: { include: { user: true } } },
          });
          if (fullPurchase && fullPurchase.profile) {
            const { notifyMembership } = await import('@/lib/notifications');
            const userEmail = fullPurchase.profile.user?.email || null;
            notifyMembership(userEmail, fullPurchase.profile.phoneNumber, fullPurchase.profile.fullName, fullPurchase.packageType);
          }
        } catch (e) {
          console.error('Membership notification failed after UPI confirmation:', e);
        }
        await logAudit({ actorUserId: adminUserId, action: 'ADMIN_APPROVE_PAYMENT', targetType: 'PackagePurchase', targetId: purchaseId, metadata: 'Payment claim approved and package activated' });
        return NextResponse.json({ success: true, purchase: updated, message: 'Payment approved and package activated!' });
      } else {
        const { rejectionNotes } = body;
        const updated = await rejectPaymentClaim(purchaseId, rejectionNotes || 'Payment not received', adminUserId);
        if (!updated) {
          return NextResponse.json({ error: 'Purchase not found' }, { status: 404 });
        }
        await logAudit({ actorUserId: adminUserId, action: 'ADMIN_REJECT_PAYMENT', targetType: 'PackagePurchase', targetId: purchaseId, metadata: 'Payment claim rejected' });
        return NextResponse.json({ success: true, purchase: updated, message: 'Payment rejected.' });
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Failed to process package admin action:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
