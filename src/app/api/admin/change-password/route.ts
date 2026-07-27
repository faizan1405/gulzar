import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { checkRateLimit } from '@/lib/rateLimit';
import { logAudit } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limit: max 5 password changes per hour per admin
    if (checkRateLimit(`change-password:${session.user.id}`, 5, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many password change attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const { currentPassword, newPassword } = await req.json();

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long.' }, { status: 400 });
    }

    // Fetch current user to verify existing password
    const userRecord = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { passwordHash: true },
    });

    if (!userRecord?.passwordHash) {
      return NextResponse.json({ error: 'No password set. Contact support.' }, { status: 400 });
    }

    const isValid = await bcrypt.compare(currentPassword || '', userRecord.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        passwordHash,
        requiresPasswordChange: false,
      },
    });

    await logAudit({
      actorUserId: session.user.id,
      action: 'ADMIN_CHANGE_OWN_PASSWORD',
      targetType: 'User',
      targetId: session.user.id,
      metadata: 'Password changed by admin',
    });

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
