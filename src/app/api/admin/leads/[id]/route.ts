import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { updateLead, deleteLead, logFallbackWarning } from '@/lib/profileStore';
import { checkRateLimit } from '@/lib/rateLimit';
import { logAudit } from '@/lib/audit';

async function isAdmin(): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === 'ADMIN';
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const session = await auth();

    // Rate limit admin mutations: 20/min
    if (checkRateLimit(`admin-leads-patch:${session?.user?.id || 'anon'}`, 20, 60 * 1000)) {
      return NextResponse.json({ error: 'Too many requests. Please slow down.' }, { status: 429 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status, priority, adminNotes } = body;

    // Validate parameters
    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

    const updated = await updateLead(id, updateData);
    if (!updated) {
      return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });
    }

    await logAudit({
      actorUserId: session?.user?.id || 'unknown',
      action: 'ADMIN_UPDATE_LEAD',
      targetType: 'Lead',
      targetId: id,
      metadata: JSON.stringify(updateData),
    });

    return NextResponse.json({ success: true, lead: updated });
  } catch (error: any) {
    console.error('Admin lead PATCH endpoint failed:', error);
    return NextResponse.json(
      { error: 'Internal server error updating inquiry.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const session = await auth();

    // Rate limit admin mutations: 20/min
    if (checkRateLimit(`admin-leads-delete:${session?.user?.id || 'anon'}`, 20, 60 * 1000)) {
      return NextResponse.json({ error: 'Too many requests. Please slow down.' }, { status: 429 });
    }

    const { id } = await params;
    const deleted = await deleteLead(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Lead not found or delete failed.' }, { status: 404 });
    }

    await logAudit({
      actorUserId: session?.user?.id || 'unknown',
      action: 'ADMIN_DELETE_LEAD',
      targetType: 'Lead',
      targetId: id,
      metadata: null,
    });

    return NextResponse.json({ success: true, message: 'Lead deleted successfully.' });
  } catch (error: any) {
    console.error('Admin lead DELETE endpoint failed:', error);
    return NextResponse.json(
      { error: 'Internal server error deleting inquiry.' },
      { status: 500 }
    );
  }
}
