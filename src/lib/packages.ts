export type PackageType = 'monthly_membership' | 'good_profile_package' | 'second_marriage_package' | 'high_profile_package';

/**
 * Single source of truth for the package keys used across the entire app — the
 * access-control checks, privacy redaction, the payment
 * flow and the API headers all key off these EXACT strings. They must stay in
 * sync with the Prisma `PackageType` enum and the keys of `PREMIUM_PACKAGES`.
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

export const PREMIUM_PACKAGES: Record<PackageType, PackageDefinition> = {
  monthly_membership: {
    type: 'monthly_membership',
    name: 'Monthly Membership',
    basePrice: 1,
    gstRate: 0,
    totalAmount: 1,
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
    basePrice: 1,
    gstRate: 0,
    totalAmount: 1,
    billingType: 'ONE_TIME',
    successFeeAmount: 21000,
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
    basePrice: 1,
    gstRate: 0,
    totalAmount: 1,
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
    basePrice: 1,
    gstRate: 0,
    totalAmount: 1,
    billingType: 'ONE_TIME',
    successFeeAmount: 25000,
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
