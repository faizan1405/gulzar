import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getViewedProfiles, removeViewedProfile, clearAllViewedProfiles, recordProfileView } from '@/lib/services/profileActivityService';
import { redactProfile } from '@/lib/profilePrivacy';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const skip = parseInt(searchParams.get('skip') || '0');
    const take = parseInt(searchParams.get('take') || '20');

    const result = await getViewedProfiles(session.user.id, skip, take);
    
    // Check viewer's package for privacy redaction
    const viewerProfile = await prisma.matrimonialProfile.findUnique({
      where: { userId: session.user.id },
      include: { purchases: { where: { paymentStatus: 'PAID', accessStatus: 'ACTIVE' } } }
    });

    const hasStandardPkg = viewerProfile?.purchases?.some(p => p.packageType === 'monthly_membership') || false;
    const hasSecondMarriagePkg = viewerProfile?.purchases?.some(p => p.packageType === 'second_marriage_package') || false;
    const hasHighProfilePkg = viewerProfile?.purchases?.some(p => p.packageType === 'high_profile_package' && p.eligibilityStatus === 'APPROVED') || false;
    const hasGoodProfilePkg = viewerProfile?.purchases?.some(p => p.packageType === 'good_profile_package') || false;
    const isAdmin = session.user.role === 'ADMIN';

    // Redact viewed profiles
    const redactedViews = (result.views || []).map((v) => ({
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
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { viewedProfileId } = await req.json();
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
