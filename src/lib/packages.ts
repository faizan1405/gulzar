export type PackageType = 'monthly_membership' | 'good_profile_package' | 'second_marriage_package' | 'high_profile_package';

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
    basePrice: 300,
    gstRate: 0.18,
    totalAmount: 354,
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
    basePrice: 5500,
    gstRate: 0.18,
    totalAmount: 6490,
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
    basePrice: 11000,
    gstRate: 0.18,
    totalAmount: 12980,
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
    basePrice: 21000,
    gstRate: 0.18,
    totalAmount: 24780,
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
