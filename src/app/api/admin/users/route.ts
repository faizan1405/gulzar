import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { Role } from '@prisma/client';
import { checkRateLimit } from '@/lib/rateLimit';
import { logAudit } from '@/lib/audit';

async function isAdmin() {
  const session = await auth();
  return session?.user?.role === 'ADMIN';
}

export async function GET(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized. Admin role required.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const roleFilter = searchParams.get('role') as Role | null;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (roleFilter && Object.values(Role).includes(roleFilter)) {
      where.role = roleFilter;
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        requiresPasswordChange: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Admin users GET failed:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized. Admin role required.' }, { status: 403 });
    }

    const session = await auth();

    // Rate limit admin mutations: 20/min
    if (checkRateLimit(`admin-users-patch:${session?.user?.id || 'anon'}`, 20, 60 * 1000)) {
      return NextResponse.json({ error: 'Too many requests. Please slow down.' }, { status: 429 });
    }

    const body = await req.json();
    const { id, role, requiresPasswordChange, name } = body;

    if (!id) {
      return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    // Whitelist updatable fields
    const updateData: Record<string, any> = {};
    if (role !== undefined) updateData.role = role;
    if (requiresPasswordChange !== undefined) updateData.requiresPasswordChange = requiresPasswordChange;
    if (name !== undefined) updateData.name = name;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update.' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        requiresPasswordChange: true,
      },
    });

    await logAudit({
      actorUserId: session?.user?.id || 'unknown',
      action: 'ADMIN_UPDATE_USER',
      targetType: 'User',
      targetId: id,
      metadata: JSON.stringify({ fields: Object.keys(updateData) }),
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }
    console.error('Admin user PATCH failed:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
