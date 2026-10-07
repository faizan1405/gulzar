export type PackageType = 'monthly_membership' | 'good_profile_package' | 'second_marriage_package' | 'high_profile_package';

/**
 * Single source of truth for the package keys used across the entire app — the
 * access-control checks, privacy redaction, the payment flow and the API all key
 * off these EXACT strings. They must stay in sync with the Prisma `PackageType`
 * enum and the keys of `PREMIUM_PACKAGES`.
 *
 * IMPORTANT: the customer-facing UI labels intentionally differ from the keys.
 * Always reference the key, never the label, in logic:
 *   monthly_membership      → "Monthly Membership"
 *   good_profile_package    → "Good Profile Package"
 *   second_marriage_package → "Silver Plan"      (NOT a separate "silver_plan" key)
 *   high_profile_package    → "Gold Package"     (NOT a separate "gold_package" key)
 */
export const PACKAGE_KEYS = {
  MONTHLY: 'monthly_membership',
  GOOD_PROFILE: 'good_profile_package',
  SILVER: 'second_marriage_package',
  GOLD: 'high_profile_package',
} as const;

export type PackageKey = typeof PACKAGE_KEYS[keyof typeof PACKAGE_KEYS];

export interface PackageDefinition {
  type: PackageType;
  name: string;
  basePrice: number;
  gstRate: number;
  totalAmount: number;
  billingType: 'MONTHLY' | 'ONE_TIME';
  successFeeAmount: number;
  benefits: string[];
}

export const DEFAULT_PACKAGE_BASE_PRICES: Record<PackageType, number> = {
  monthly_membership: 1,
  good_profile_package: 2,
  second_marriage_package: 3,
  high_profile_package: 4,
};

export const GST_RATE = 0.18;

export function round2(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export function calculatePackagePricing(basePrice: number, gstRate: number = GST_RATE) {
  const safeBase = round2(basePrice);
  const gst = round2(safeBase * gstRate);
  const totalAmount = round2(safeBase + gst);
  return {
    basePrice: safeBase,
    gstRate,
    gst,
    totalAmount,
  };
}

export const PREMIUM_PACKAGES: Record<PackageType, PackageDefinition> = {
  monthly_membership: {
    type: 'monthly_membership',
    name: 'Monthly Membership',
    basePrice: DEFAULT_PACKAGE_BASE_PRICES.monthly_membership,
    gstRate: GST_RATE,
    totalAmount: calculatePackagePricing(DEFAULT_PACKAGE_BASE_PRICES.monthly_membership).totalAmount,
    billingType: 'MONTHLY',
    successFeeAmount: 0,
    benefits: [
      'View unblurred normal profiles',
      'Expose basic phone numbers',
      'Search and filter directory',
      'Direct candidate contacts'
    ]
  },
  good_profile_package: {
    type: 'good_profile_package',
    name: 'Good Profile Package',
    basePrice: DEFAULT_PACKAGE_BASE_PRICES.good_profile_package,
    gstRate: GST_RATE,
    totalAmount: calculatePackagePricing(DEFAULT_PACKAGE_BASE_PRICES.good_profile_package).totalAmount,
    billingType: 'ONE_TIME',
    successFeeAmount: 0,
    benefits: [
      'Verified profile suggestions',
      'Basic matchmaking support',
      'Privacy-safe profile sharing',
      '1 year service validity'
    ]
  },
  second_marriage_package: {
    type: 'second_marriage_package',
    name: 'Silver Plan',
    basePrice: DEFAULT_PACKAGE_BASE_PRICES.second_marriage_package,
    gstRate: GST_RATE,
    totalAmount: calculatePackagePricing(DEFAULT_PACKAGE_BASE_PRICES.second_marriage_package).totalAmount,
    billingType: 'ONE_TIME',
    successFeeAmount: 0,
    benefits: [
      'Everything in Basic Package',
      'More verified profile suggestions',
      'Priority matchmaking support',
      'Profile shortlisting assistance',
      'Family coordination support',
      'Regular follow-up support',
      'Privacy-safe contact assistance',
      '1 year service validity'
    ]
  },
  high_profile_package: {
    type: 'high_profile_package',
    name: 'Gold Package',
    basePrice: DEFAULT_PACKAGE_BASE_PRICES.high_profile_package,
    gstRate: GST_RATE,
    totalAmount: calculatePackagePricing(DEFAULT_PACKAGE_BASE_PRICES.high_profile_package).totalAmount,
    billingType: 'ONE_TIME',
    successFeeAmount: 0,
    benefits: [
      'Everything in Silver Plan',
      'Premium verified profile suggestions',
      'High-priority matchmaking assistance',
      'Personalized profile shortlisting',
      'Dedicated support assistance',
      'Family meeting coordination support',
      'Biodata/profile presentation guidance',
      'Regular follow-up and progress updates',
      'Privacy-safe contact assistance',
      '1 year service validity'
    ]
  }
};

/**
 * Canonical display-name lookup for package keys.
 * Used by the Membership section and any component that needs to render
 * a human-readable package name from an internal key.
 */
export const PACKAGE_DISPLAY: Record<string, string> = {
  monthly_membership: 'Monthly Membership',
  good_profile_package: 'Good Profile Package',
  second_marriage_package: 'Silver Plan',
  high_profile_package: 'Gold Package',
};
