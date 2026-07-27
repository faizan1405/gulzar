import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getAllProfiles, getProfileByUserId, getUserPurchases } from '@/lib/profileStore';
import { redactProfile } from '@/lib/profilePrivacy';

// Get all verified profiles
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    const viewerId = session?.user?.id;
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

    function hasPaid300Check() {
      return viewerPurchases.some(p => p.packageType === 'monthly_membership' && p.paymentStatus === 'PAID');
    }

    const hasStandardPkg = viewerHasPaid || hasPaid300Check();
    const hasSecondMarriagePkg = viewerPurchases.some(p => p.packageType === 'second_marriage_package' && p.paymentStatus === 'PAID');
    const hasHighProfilePkg = viewerPurchases.some(p => p.packageType === 'high_profile_package' && p.paymentStatus === 'PAID' && p.eligibilityStatus === 'APPROVED');
    const hasGoodProfilePkg = viewerPurchases.some(p => p.packageType === 'good_profile_package' && p.paymentStatus === 'PAID');

    // Fetch all profiles from the database
    const allProfiles = await getAllProfiles();

    // Only return approved profiles for public browsing, unless admin
    let visibleProfiles = allProfiles.filter(p => p.verificationStatus === 'APPROVED' || isAdmin);

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

    return NextResponse.json({ profiles: redactedProfiles });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
