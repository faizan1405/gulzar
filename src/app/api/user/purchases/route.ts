import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getProfileByUserId, getUserPurchases } from '@/lib/profileStore';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const activeUserId = session?.user?.id;

    if (!activeUserId) {
      return NextResponse.json({ packages: [], hasPaid: false, highProfileApproved: false });
    }

    const profile = await getProfileByUserId(activeUserId);
    if (!profile) {
      return NextResponse.json({ packages: [], hasPaid: false, highProfileApproved: false });
    }

    const purchases = await getUserPurchases(profile.id);
    const now = new Date();
    const activePackageTypes = purchases
      .filter(p =>
        p.paymentStatus === 'PAID' &&
        p.accessStatus === 'ACTIVE' &&
        (!p.expiryDate || new Date(p.expiryDate) > now)
      )
      .map(p => p.packageType);

    const isHpApproved = purchases.some(p => 
      p.packageType === 'high_profile_package' && 
      p.paymentStatus === 'PAID' && 
      p.eligibilityStatus === 'APPROVED'
    );

    return NextResponse.json({
      packages: [...new Set(activePackageTypes)],
      hasPaid: profile.hasPaid,
      highProfileApproved: isHpApproved,
    });
  } catch {
    return NextResponse.json({ packages: [], hasPaid: false, highProfileApproved: false });
  }
}
