import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getProfileByUserId } from '@/lib/profileStore';
import { PREMIUM_PACKAGES } from '@/lib/packages';
import { getAllPackagePricing } from '@/lib/packagePricing';

// Public packages API — returns names/features always, prices only after form completion
export async function GET() {
  try {
    const session = await auth();
    const activeUserId = session?.user?.id;

    // Determine if this user has completed their profile form
    let formComplete = false;
    if (activeUserId) {
      try {
        const profile = await getProfileByUserId(activeUserId);
        formComplete = profile?.profileCompletionStatus === 'COMPLETE';
      } catch {
        // DB unavailable — treat as incomplete
      }
    }

    let dynamicPricing: Record<string, any> = {};
    if (formComplete) {
      try {
        dynamicPricing = await getAllPackagePricing();
      } catch (err) {
        console.error('Failed to load dynamic package pricing:', err);
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
        const pricing = dynamicPricing[pkg.type];
        return {
          ...base,
          basePrice: typeof pricing?.basePrice === 'number' ? pricing.basePrice : pkg.basePrice,
          totalAmount: typeof pricing?.totalAmount === 'number' ? pricing.totalAmount : pkg.totalAmount,
          gstRate: typeof pricing?.gstRate === 'number' ? pricing.gstRate : pkg.gstRate,
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
