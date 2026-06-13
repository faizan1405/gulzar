export type PackageType = 'STANDARD' | 'CURATED' | 'SECOND_MARRIAGE' | 'HIGH_PROFILE';

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
  STANDARD: {
    type: 'STANDARD',
    name: 'Standard Monthly',
    basePrice: 300,
    gstRate: 0.18,
    totalAmount: 354,
    billingType: 'MONTHLY',
    successFeeAmount: 0,
    benefits: [
      'View unblurred profile photos',
      'Expose call-verified phone numbers',
      'Search and filter matches',
      'Direct candidate contacts'
    ]
  },
  CURATED: {
    type: 'CURATED',
    name: 'Curated Matches',
    basePrice: 5500,
    gstRate: 0.18,
    totalAmount: 6490,
    billingType: 'ONE_TIME',
    successFeeAmount: 21000,
    benefits: [
      'Custom personal matchmaking',
      'Leads provided until marriage',
      'Separate dashboard support',
      'Success Fee: ₹21,000'
    ]
  },
  SECOND_MARRIAGE: {
    type: 'SECOND_MARRIAGE',
    name: 'Second-Marriage',
    basePrice: 11000,
    gstRate: 0.18,
    totalAmount: 12980,
    billingType: 'ONE_TIME',
    successFeeAmount: 0,
    benefits: [
      'Private segregated directory',
      'Specially customized match leads',
      '1-on-1 advisor calls',
      'No Success Fee'
    ]
  },
  HIGH_PROFILE: {
    type: 'HIGH_PROFILE',
    name: 'High-Profile',
    basePrice: 21000,
    gstRate: 0.18,
    totalAmount: 24780,
    billingType: 'ONE_TIME',
    successFeeAmount: 25000,
    benefits: [
      'For Doctors, Masters & Ultra-affluent',
      'Exclusive private group',
      'Dedicated personal matchmaker',
      'Success Fee: ₹25,000'
    ]
  }
};
