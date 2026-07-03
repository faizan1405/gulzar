import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getProfileByUserId, getUserPurchases } from '@/lib/profileStore';
import { getDemoUserId } from '@/lib/demoMode';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const simulatedUserId = getDemoUserId(req);
    const activeUserId = session?.user?.id || simulatedUserId;

    if (!activeUserId) {
      return NextResponse.json({ packages: [], hasPaid: false });
    }

    const profile = await getProfileByUserId(activeUserId);
    if (!profile) {
      return NextResponse.json({ packages: [], hasPaid: false });
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

    return NextResponse.json({
      packages: [...new Set(activePackageTypes)],
      hasPaid: profile.hasPaid,
    });
  } catch {
    return NextResponse.json({ packages: [], hasPaid: false });
  }
}
