import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getShortlistedProfiles, toggleShortlist } from '@/lib/services/profileActivityService';
import { redactProfile } from '@/lib/profilePrivacy';
import { prisma } from '@/lib/db';
import { checkRateLimit } from '@/lib/rateLimit';
import { logAudit } from '@/lib/audit';
import {
  hasPaidAccess,
  hasStandardPackage,
  hasSecondMarriagePackage,
  hasHighProfilePackage,
  hasGoodProfilePackage,
} from '@/lib/packageAccess';

// Simple in-memory rate limiter for shortlist POST requests (max 10/min per user)
const shortlistPostRateLimitMap = new Map<string, { count: number; resetTime: number }>();
function checkShortlistPostRateLimit(userId: string): boolean {
  const now = Date.now();
  const limit = 10;
  const windowMs = 60 * 1000;
  const record = shortlistPostRateLimitMap.get(userId);
  if (!record || now > record.resetTime) {
    shortlistPostRateLimitMap.set(userId, { count: 1, resetTime: now + windowMs });
    return false;
  }
  record.count += 1;
  return record.count > limit;
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limit GET by user ID
    if (checkRateLimit(`shortlist-get:${session.user.id}`, 30, 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many requests. Please slow down.' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(req.url);
    const skip = parseInt(searchParams.get('skip') || '0');
    const take = parseInt(searchParams.get('take') || '20');

    const result = await getShortlistedProfiles(session.user.id, skip, take);

    // Check viewer's package for privacy redaction
    const viewerPurchases = result.profileId
      ? await prisma.packagePurchase.findMany({
          where: { profileId: result.profileId, paymentStatus: 'PAID', accessStatus: 'ACTIVE' }
        })
      : [];

    const hasStandardPkg = hasStandardPackage(viewerPurchases);
    const hasSecondMarriagePkg = hasSecondMarriagePackage(viewerPurchases);
    const hasHighProfilePkg = hasHighProfilePackage(viewerPurchases);
    const hasGoodProfilePkg = hasGoodProfilePackage(viewerPurchases);
    const isAdmin = session.user.role === 'ADMIN';

    // Redact profiles
    const redactedShortlists = (result.shortlists || []).map((s: any) => ({
      ...s,
      profile: redactProfile(
        s.profile as any,
        hasStandardPkg,
        hasSecondMarriagePkg,
        hasHighProfilePkg,
        hasGoodProfilePkg,
        false,
        isAdmin
      )
    }));

    return NextResponse.json({ ...result, shortlists: redactedShortlists });
  } catch (error) {
    console.error('Error fetching shortlists:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (checkShortlistPostRateLimit(session.user.id)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a minute.' },
        { status: 429 }
      );
    }

    const { targetProfileId } = await req.json();
    if (!targetProfileId) {
      return NextResponse.json({ error: 'targetProfileId is required' }, { status: 400 });
    }

    const result = await toggleShortlist(session.user.id, targetProfileId);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    await logAudit({
      actorUserId: session.user.id,
      action: result.isShortlisted ? 'SHORTLIST_ADD' : 'SHORTLIST_REMOVE',
      targetType: 'Shortlist',
      targetId: targetProfileId,
      metadata: null,
    });

    return NextResponse.json({ success: true, isShortlisted: result.isShortlisted });
  } catch (error) {
    console.error('Error toggling shortlist:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
