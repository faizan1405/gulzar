export interface Profile {
  id: string;
  userId: string;
  fullName: string;
  gender: string;
  dateOfBirth: string | Date;
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
  createdAt: string | Date;
  updatedAt?: string | Date;
  uploadedAt?: Date | string | null;

  // Extended optional fields
  height?: string | null;
  motherTongue?: string | null;
  languages?: string[];
  aboutMe?: string | null;
  nativePlace?: string | null;
  currentLocation?: string | null;
  highestQualification?: string | null;
  degree?: string | null;
  college?: string | null;
  certifications?: string;
  jobTitle?: string | null;
  company?: string | null;
  industry?: string | null;
  workLocation?: string | null;
  employmentType?: string | null;
  careerDetails?: string | null;
  foodPreference?: string | null;
  smoking?: string | null;
  drinking?: string | null;
  hobbies?: string[];
  interests?: string | null;
  sports?: string | null;
  fitness?: string | null;
  travel?: string | null;
  fatherOccupation?: string | null;
  motherOccupation?: string | null;
  siblings?: string | null;
  familyType?: string | null;
  familyValues?: string | null;
  familyBackground?: string | null;
  partnerAgeMin?: number | null;
  partnerAgeMax?: number | null;
  partnerHeightMin?: string | null;
  partnerHeightMax?: string | null;
  partnerPreferredLocations?: string[];
  partnerEducationPref?: string | null;
  partnerProfessionPref?: string | null;
  partnerBiradariPref?: string | null;
  partnerMaritalStatusPref?: string | null;
  partnerLifestylePref?: string | null;
  partnerExpectations?: string | null;
  partnerOtherPrefs?: string | null;
  additionalPhotoUrls?: string[];

  // New Matrimonial Identity Fields
  maslak: string | null;
  fiqh: string | null;
  biradari: string | null;
  biradariAliases?: string[];
  district: string | null;
  locality: string | null;
  preferredLocations: string[];
  sameCastePreference?: boolean;
  sameMaslakPreference?: boolean;
  noCastePreference?: boolean;
  noMaslakPreference?: boolean;
  willingToRelocate?: boolean;
  familyOrigin?: string;

  // Media
  profileImageUrl?: string | null;
  profileImagePublicId?: string | null;
  profileImageStatus?: string;
  category?: string | null;
  hasPaid?: boolean;
  highProfileApproved?: boolean;
  email?: string | null;
}


export interface VerificationRequest {
  id: string;
  profileId: string;
  status: string;
  assignedAdminId: string | null;
  notes: string | null;
  verifiedAt: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  profile: Profile | null;
}

export interface AuditLog {
  id: string;
  actorUserId: string | null;
  action: string;
  targetType: string;
  targetId: string | null;
  metadata: string;
  createdAt: string | Date;
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
  paymentReferenceId: string | null;
  userSubmittedTxnId: string | null;
  upiTransactionId: string | null;
  paymentMode: string;
  paymentStatus: string;
  purchaseDate: string | Date;
  expiryDate: string | Date | null;
  accessStatus: string;
  eligibilityStatus: string;
  marriageConfirmation: string;
  successFeePaymentStatus: string;
  internalNotes: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  profile?: (Profile & { user?: { email?: string } }) | null;
}

export interface CuratedLeadAssignment {
  id: string;
  buyerProfileId: string;
  leadProfileId: string;
  status: string;
  assignedAt: string | Date;
  updatedAt: string | Date;
  buyerProfile?: Profile | null;
  leadProfile?: Profile | null;
}

export interface MaslakOption {
  id: string;
  label: string;
  aliases: string[];
  isDisabled: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CasteOption {
  id: string;
  label: string;
  aliases: string[];
  isDisabled: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface LocationOption {
  id: string;
  state: string;
  district: string;
  locality: string | null;
  isHighPriority: boolean;
  isDisabled: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Lead {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  city: string;
  message: string | null;
  inquiryType: string;
  interestedPackage: string | null;
  interestedProfileId: string | null;
  sourcePage: string | null;
  status: string;
  priority: string;
  adminNotes: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface InterestRequest {
  id: string;
  senderProfileId: string;
  receiverProfileId: string;
  status: string;
  message: string | null;
  createdAt: string;
  updatedAt: string;
  receiverProfile?: Profile | null;
  senderProfile?: Profile | null;
}

export interface Shortlist {
  id: string;
  shortlisterProfileId: string;
  shortlistedProfileId: string;
  createdAt: string;
  shortlistedProfile?: Profile | null;
  shortlisterProfile?: Profile | null;
}

export interface ProfileView {
  id: string;
  viewerProfileId: string;
  viewedProfileId: string;
  viewedAt: string;
  viewerProfile?: Profile | null;
  viewedProfile?: Profile | null;
}

export interface InterestResult {
  requests: Record<string, unknown>[];
  total: number;
  profileId: string;
}

export interface ShortlistResult {
  shortlists: Record<string, unknown>[];
  total: number;
  profileId: string;
}

export interface ViewedProfileResult {
  views: Record<string, unknown>[];
  total: number;
  profileId: string;
}

