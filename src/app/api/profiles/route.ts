import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getAllProfiles, getProfileByUserId, getUserPurchases } from '@/lib/profileStore';
import { redactProfile } from '@/lib/profilePrivacy';
import { checkRateLimit, checkRateLimitByName, buildRateLimitHeaders } from '@/lib/rateLimit';
import {
  hasPaidAccess,
  hasSecondMarriagePackage,
  hasHighProfilePackage,
  hasGoodProfilePackage,
  hasStandardPackage,
} from '@/lib/packageAccess';

// Get all verified profiles
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    // Rate limit by user (when logged in) or IP
    const ip = (req as any).ip || req.headers.get('x-forwarded-for') || 'anonymous';
    const viewerId = session?.user?.id;
    const rateLimitKey = viewerId ? `profiles-list:${viewerId}` : `profiles-list:${ip}`;
    const plResult = await checkRateLimit(rateLimitKey, 30, 60 * 1000);
    if (!plResult.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please slow down.' },
        { status: 429, headers: buildRateLimitHeaders(plResult) }
      );
    }

    const isAdmin = session?.user?.role === 'ADMIN';

    let viewerHasPaid = false;
    let viewerPurchases: Array<{
      id: string;
      packageType: string;
      paymentStatus: string;
      eligibilityStatus?: string;
    }> = [];

    if (viewerId) {
      try {
        const viewerProfile = await getProfileByUserId(viewerId);
        if (viewerProfile) {
          viewerHasPaid = viewerProfile.hasPaid;
          viewerPurchases = await getUserPurchases(viewerProfile.id);
        }
      } catch {
        // DB unavailable — viewer gets public-only access; profiles still load below.
      }
    }

    const hasStandardPkg = hasPaidAccess({ hasPaid: viewerHasPaid }, viewerPurchases) ||
      hasStandardPackage(viewerPurchases);
    const hasSecondMarriagePkg = hasSecondMarriagePackage(viewerPurchases);
    const hasHighProfilePkg = hasHighProfilePackage(viewerPurchases);
    const hasGoodProfilePkg = hasGoodProfilePackage(viewerPurchases);

    // Fetch all profiles from the database
    const allProfiles = await getAllProfiles();

    // Only return approved profiles for public browsing, unless admin
    const visibleProfiles = allProfiles.filter(p => p.verificationStatus === 'APPROVED' || isAdmin);

    const redactedProfiles = visibleProfiles.map(profile => {
      const isOwner = viewerId === profile.userId;
      return redactProfile(
        profile as any,
        hasStandardPkg,
        hasSecondMarriagePkg,
        hasHighProfilePkg,
        hasGoodProfilePkg,
        isOwner,
        isAdmin
      );
    });

    let skip = parseInt(req.nextUrl.searchParams.get('skip') || '0');
    let take = parseInt(req.nextUrl.searchParams.get('take') || '50');
    if (skip < 0 || isNaN(skip)) skip = 0;
    if (take < 1 || take > 100) take = 50;

    const total = redactedProfiles.length;
    const paged = redactedProfiles.slice(skip, skip + take);

    return NextResponse.json({ profiles: paged, total, skip, take });
  } catch (error) {
    console.error('Failed to fetch profiles:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
