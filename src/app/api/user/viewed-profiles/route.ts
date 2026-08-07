import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getViewedProfiles, removeViewedProfile, clearAllViewedProfiles, recordProfileView } from '@/lib/services/profileActivityService';
import { redactProfile } from '@/lib/profilePrivacy';
import { prisma } from '@/lib/db';
import {
  hasStandardPackage,
  hasSecondMarriagePackage,
  hasHighProfilePackage,
  hasGoodProfilePackage,
} from '@/lib/packageAccess';
import { jwtGuard } from '@/lib/jwtGuard';
import { safeJsonBody } from '@/lib/requestUtils';
import type { ViewedProfileResult } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    let skip = parseInt(searchParams.get('skip') || '0');
    let take = parseInt(searchParams.get('take') || '20');
    if (skip < 0 || isNaN(skip)) skip = 0;
    if (take < 1 || take > 50) take = 20;

    const result: ViewedProfileResult = await getViewedProfiles(session.user.id, skip, take);
    
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

    // Redact viewed profiles
    const redactedViews = (result.views || []).map((v: any) => ({
      ...v,
      viewedProfile: redactProfile(
        v.viewedProfile as any,
        hasStandardPkg,
        hasSecondMarriagePkg,
        hasHighProfilePkg,
        hasGoodProfilePkg,
        false, // not owner
        isAdmin
      )
    }));

    return NextResponse.json({ ...result, views: redactedViews });
  } catch (error) {
    console.error('Error fetching viewed profiles:', error);
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

    const bodyOrResponse = await safeJsonBody(req, { maxSizeKB: 10 });
    if (bodyOrResponse instanceof Response) return bodyOrResponse;
    const body = bodyOrResponse as any;
    const { viewedProfileId } = body;
    if (!viewedProfileId) {
      return NextResponse.json({ error: 'viewedProfileId is required' }, { status: 400 });
    }

    const result = await recordProfileView(session.user.id, viewedProfileId);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording view:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const jwtResult = await jwtGuard(req);
    if (jwtResult) return jwtResult;

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const viewedProfileId = searchParams.get('viewedProfileId');
    const clearAll = searchParams.get('clearAll') === 'true';

    if (clearAll) {
      const success = await clearAllViewedProfiles(session.user.id);
      return NextResponse.json({ success });
    }

    if (!viewedProfileId) {
      return NextResponse.json({ error: 'viewedProfileId is required' }, { status: 400 });
    }

    const success = await removeViewedProfile(session.user.id, viewedProfileId);
    return NextResponse.json({ success });
  } catch (error) {
    console.error('Error deleting view history:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
