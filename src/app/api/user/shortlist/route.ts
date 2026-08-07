import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getShortlistedProfiles, toggleShortlist } from '@/lib/services/profileActivityService';
import { redactProfile } from '@/lib/profilePrivacy';
import { prisma } from '@/lib/db';
import { checkRateLimitByName, buildRateLimitHeaders } from '@/lib/rateLimit';
import { logAudit } from '@/lib/audit';
import { jwtGuard } from '@/lib/jwtGuard';
import { safeJsonBody } from '@/lib/requestUtils';
import {
  hasStandardPackage,
  hasSecondMarriagePackage,
  hasHighProfilePackage,
  hasGoodProfilePackage,
} from '@/lib/packageAccess';
import type { ShortlistResult } from '@/types';

// Simple in-memory rate limiter for shortlist POST requests (max 10/min per user)
// Using centralized rateLimitByName for consistency.

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limit GET by user ID
    const slResult = await checkRateLimitByName('shortlistGet', session.user.id);
    if (!slResult.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please slow down.' },
        { status: 429, headers: buildRateLimitHeaders(slResult) }
      );
    }

    const { searchParams } = new URL(req.url);
    let skip = parseInt(searchParams.get('skip') || '0');
    let take = parseInt(searchParams.get('take') || '20');
    if (skip < 0 || isNaN(skip)) skip = 0;
    if (take < 1 || take > 50) take = 20;

    const result: ShortlistResult = await getShortlistedProfiles(session.user.id, skip, take);

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
    const jwtResult = await jwtGuard(req);
    if (jwtResult) return jwtResult;

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const spResult = await checkRateLimitByName('shortlistPost', session.user.id);
    if (!spResult.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a minute.' },
        { status: 429, headers: buildRateLimitHeaders(spResult) }
      );
    }

    const bodyOrResponse = await safeJsonBody(req, { maxSizeKB: 10 });
    if (bodyOrResponse instanceof Response) return bodyOrResponse;
    const body = bodyOrResponse as any;
    const { targetProfileId } = body;
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
