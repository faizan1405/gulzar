export interface Profile {
  id: string;
  userId: string;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  maritalStatus: string;
  phoneNumber: string;
  city: string | null;
  areaOrLocality: string | null;
  state: string | null;
  country: string | null;
  education: string;
  occupation: string;
  annualIncomeRange: string;
  familyInfo: string;
  bio: string;
  themeColor: string;
  verificationStatus: string;
  profileCompletionStatus: string;
  partnerPref?: string;
  createdAt: string;

  // New Matrimonial Identity Fields
  maslak: string | null;
  fiqh: string | null;
  biradari: string | null;
  biradariAliases?: string[];
  district: string | null;
  locality: string | null;
  preferredLocations: string[];
  sameCastePreference: boolean;
  sameMaslakPreference: boolean;
  noCastePreference: boolean;
  noMaslakPreference: boolean;
  willingToRelocate: boolean;
}


export interface VerificationRequest {
  id: string;
  profileId: string;
  status: string;
  assignedAdminId: string | null;
  notes: string | null;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  profile: Profile | null;
}

export interface AuditLog {
  id: string;
  actorUserId: string | null;
  action: string;
  targetType: string;
  targetId: string | null;
  metadata: string;
  createdAt: string;
}

export interface PackagePurchase {
  id: string;
  profileId: string;
  packageType: string;
  basePrice: number;
  gstRate: number;
  totalAmount: number;
  billingType: string;
  successFeeAmount: number;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  paymentStatus: string;
  purchaseDate: string;
  expiryDate: string | null;
  accessStatus: string;
  eligibilityStatus: string;
  marriageConfirmation: string;
  successFeePaymentStatus: string;
  internalNotes: string | null;
  createdAt: string;
  updatedAt: string;
  profile?: Profile | null;
}

export interface CuratedLeadAssignment {
  id: string;
  buyerProfileId: string;
  leadProfileId: string;
  status: string;
  assignedAt: string;
  updatedAt: string;
  buyerProfile?: Profile | null;
  leadProfile?: Profile | null;
}

export interface MaslakOption {
  id: string;
  label: string;
  aliases: string[];
  isDisabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CasteOption {
  id: string;
  label: string;
  aliases: string[];
  isDisabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LocationOption {
  id: string;
  state: string;
  district: string;
  locality: string | null;
  isHighPriority: boolean;
  isDisabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}
