import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getShortlistedProfiles, toggleShortlist } from '@/lib/services/profileActivityService';
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

    const result = await getShortlistedProfiles(session.user.id, skip, take);
    
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

    // Redact profiles
    const redactedShortlists = result.shortlists.map((s) => ({
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

    const { targetProfileId } = await req.json();
    if (!targetProfileId) {
      return NextResponse.json({ error: 'targetProfileId is required' }, { status: 400 });
    }

    const result = await toggleShortlist(session.user.id, targetProfileId);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, isShortlisted: result.isShortlisted });
  } catch (error) {
    console.error('Error toggling shortlist:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
