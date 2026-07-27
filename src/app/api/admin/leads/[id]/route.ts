import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { updateLead, deleteLead } from '@/lib/profileStore';

async function isAdmin(req: NextRequest) {
  const session = await auth();
  return session?.user?.role === 'ADMIN';
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin(req))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
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
    if (!(await isAdmin(req))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    const deleted = await deleteLead(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Lead not found or delete failed.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Lead deleted successfully.' });
  } catch (error: any) {
    console.error('Admin lead DELETE endpoint failed:', error);
    return NextResponse.json(
      { error: 'Internal server error deleting inquiry.' },
      { status: 500 }
    );
  }
}
