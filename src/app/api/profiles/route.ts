import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getAllProfiles, getProfileByUserId, getUserPurchases, getDemoProfiles } from '@/lib/profileStore';
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

    const hasStandardPkg = viewerHasPaid || hasPaid300Check() || simulatedPaid || simulatedPackages.includes('monthly_membership');
    const hasSecondMarriagePkg = viewerPurchases.some(p => p.packageType === 'second_marriage_package' && p.paymentStatus === 'PAID') || simulatedPackages.includes('second_marriage_package');
    const hasHighProfilePkg = viewerPurchases.some(p => p.packageType === 'high_profile_package' && p.paymentStatus === 'PAID' && p.eligibilityStatus === 'APPROVED') || (simulatedPackages.includes('high_profile_package') && simulatedHighProfileApproved);
    const hasGoodProfilePkg = viewerPurchases.some(p => p.packageType === 'good_profile_package' && p.paymentStatus === 'PAID') || simulatedPackages.includes('good_profile_package');

    // Fetch all profiles, falling back to bundled demo profiles if the database
    // is completely unreachable (e.g. production deploy before DB is seeded, or
    // MongoDB Atlas cluster paused on free tier).  This guarantees the profiles
    // API never returns a 500 to the client — visitors always see content.
    let allProfiles: Awaited<ReturnType<typeof getAllProfiles>>;
    try {
      allProfiles = await getAllProfiles();
    } catch {
      allProfiles = getDemoProfiles();
    }

    // Only return approved profiles for public browsing, unless admin
    let visibleProfiles = allProfiles.filter(p => p.verificationStatus === 'APPROVED' || isAdmin);

    // Public showcase safety net: if there are fewer than 12 approved profiles
    // available to a non-admin viewer, supplement with bundled approved demo
    // profiles so the directory and featured section are never empty.
    // Demo profiles are de-duplicated by id to avoid showing the same card
    // twice when they have also been seeded into the live database.
    // Privacy redaction below still applies, so photos/contact stay protected.
    if (!isAdmin && visibleProfiles.length < 12) {
      const approvedDemos = getDemoProfiles().filter(p => p.verificationStatus === 'APPROVED');
      const existingIds = new Set(visibleProfiles.map(p => p.id));
      const missingDemos = approvedDemos.filter(p => !existingIds.has(p.id));
      // Sort: high_profile first (featured), then good_profile, then the rest by date desc
      missingDemos.sort((a, b) => {
        const order: Record<string, number> = { high_profile: 0, good_profile: 1, second_marriage: 2, normal: 3 };
        const aOrd = order[(a as any).category || 'normal'] ?? 3;
        const bOrd = order[(b as any).category || 'normal'] ?? 3;
        if (aOrd !== bOrd) return aOrd - bOrd;
        return new Date((b as any).createdAt || 0).getTime() - new Date((a as any).createdAt || 0).getTime();
      });
      const needed = Math.max(0, 12 - visibleProfiles.length);
      visibleProfiles = [...visibleProfiles, ...missingDemos.slice(0, needed)];
    }

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
