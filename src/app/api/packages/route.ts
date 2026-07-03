import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getProfileByUserId } from '@/lib/profileStore';
import { PREMIUM_PACKAGES } from '@/lib/packages';
import { getDemoUserId } from '@/lib/demoMode';

// Public packages API — returns names/features always, prices only after form completion
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const simulatedUserId = getDemoUserId(req);
    const simulatedLoggedIn = !!simulatedUserId && req.headers.get('x-simulator-logged-in') === 'true';
    const activeUserId = session?.user?.id || (simulatedLoggedIn ? simulatedUserId : null);

    // Determine if this user has completed their profile form
    let formComplete = simulatedLoggedIn;
    if (activeUserId && !simulatedLoggedIn) {
      try {
        const profile = await getProfileByUserId(activeUserId);
        formComplete = profile?.profileCompletionStatus === 'COMPLETE';
      } catch {
        // DB unavailable — treat as incomplete
      }
    }

    const packages = Object.values(PREMIUM_PACKAGES).map(pkg => {
      const base = {
        type: pkg.type,
        name: pkg.name,
        billingType: pkg.billingType,
        benefits: pkg.benefits,
      };

      if (formComplete) {
        return {
          ...base,
          basePrice: pkg.basePrice,
          totalAmount: pkg.totalAmount,
          gstRate: pkg.gstRate,
          successFeeAmount: pkg.successFeeAmount,
        };
      }

      // Hide all price fields before form completion
      return base;
    });

    return NextResponse.json({ packages, formComplete });
  } catch {
    // Always return package list even on error — just without prices
    const packages = Object.values(PREMIUM_PACKAGES).map(pkg => ({
      type: pkg.type,
      name: pkg.name,
      billingType: pkg.billingType,
      benefits: pkg.benefits,
    }));
    return NextResponse.json({ packages, formComplete: false });
  }
}
