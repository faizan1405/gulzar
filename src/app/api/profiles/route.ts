import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getAllProfiles, getProfileByUserId, getUserPurchases } from '@/lib/profileStore';
import { redactProfile } from '@/lib/profilePrivacy';

// Get all verified profiles
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    // Support simulator headers
    const simulatedUserId = req.headers.get('x-simulator-user-id');
    const simulatedPaid = req.headers.get('x-simulator-paid') === 'true';
    const simulatedPackagesHeader = req.headers.get('x-simulator-packages') || '';
    const simulatedPackages = simulatedPackagesHeader.split(',').map(p => p.trim());
    const simulatedHighProfileApproved = req.headers.get('x-simulator-high-profile-approved') === 'true';
    const simulatedAdmin = req.headers.get('x-simulator-admin') === 'true';

    const viewerId = session?.user?.id || simulatedUserId;
    const isAdmin = session?.user?.role === 'ADMIN' || simulatedAdmin;

    let viewerHasPaid = false;
    let viewerPurchases: Array<{
      id: string;
      packageType: string;
      paymentStatus: string;
      eligibilityStatus?: string;
    }> = [];

    if (viewerId) {
      const viewerProfile = await getProfileByUserId(viewerId);
      if (viewerProfile) {
        viewerHasPaid = viewerProfile.hasPaid;
        viewerPurchases = await getUserPurchases(viewerProfile.id);
      }
    }

    function hasPaid300Check() {
      return viewerPurchases.some(p => p.packageType === 'monthly_membership' && p.paymentStatus === 'PAID');
    }

    const hasStandardPkg = viewerHasPaid || hasPaid300Check() || simulatedPaid || simulatedPackages.includes('monthly_membership');
    const hasSecondMarriagePkg = viewerPurchases.some(p => p.packageType === 'second_marriage_package' && p.paymentStatus === 'PAID') || simulatedPackages.includes('second_marriage_package');
    const hasHighProfilePkg = viewerPurchases.some(p => p.packageType === 'high_profile_package' && p.paymentStatus === 'PAID' && p.eligibilityStatus === 'APPROVED') || (simulatedPackages.includes('high_profile_package') && simulatedHighProfileApproved);
    const hasGoodProfilePkg = viewerPurchases.some(p => p.packageType === 'good_profile_package' && p.paymentStatus === 'PAID') || simulatedPackages.includes('good_profile_package');

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

    return NextResponse.json({ profiles: redactedProfiles });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
