import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { getValidObjectId, isFallbackAllowed } from '@/lib/profileStore';

async function isAdmin() {
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

    const { id } = await params;
    const body = await req.json();

    // Whitelist updatable fields to prevent mass-assignment
    const allowed = [
      'verificationStatus',
      'adminApprovalStatus',
      'profileCompletionStatus',
      'hasPaid',
      'category',
      'fullName',
      'phoneNumber',
      'city',
      'state',
      'occupation',
      'education',
      'bio',
      'maslak',
      'biradari',
      'themeColor',
      'profileImageUrl',
      'profileImageStatus',
    ];
    const updateData: Record<string, any> = {};
    for (const key of allowed) {
      if (key in body) updateData[key] = body[key];
    }
    updateData.updatedAt = new Date();

    try {
      const dbId = getValidObjectId(id);
      const updated = await prisma.matrimonialProfile.update({
        where: { id: dbId },
        data: updateData,
      });
      return NextResponse.json({ success: true, profile: updated });
    } catch (dbErr: any) {
      if (!isFallbackAllowed()) throw dbErr;
      // In-memory fallback: return success so UI doesn't break
      return NextResponse.json({ success: true, profile: { id, ...updateData } });
    }
  } catch (error: any) {
    console.error('Admin profile PATCH failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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

    const { id } = await params;

    try {
      const dbId = getValidObjectId(id);
      await prisma.matrimonialProfile.delete({ where: { id: dbId } });
      return NextResponse.json({ success: true });
    } catch (dbErr: any) {
      if (!isFallbackAllowed()) throw dbErr;
      return NextResponse.json({ success: true });
    }
  } catch (error: any) {
    console.error('Admin profile DELETE failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
