import { PaymentStatus, PackageType, ApprovalStatus } from '@prisma/client';

export const LOCK_MESSAGES = {
  NOT_LOGGED_IN: 'Please login or register to view this profile.',
  FORM_INCOMPLETE: 'Complete your details first to continue.',
  NO_PACKAGE: 'Choose a package to unlock full profile details.',
  PACKAGE_ACTIVE: 'Your package is active. You can now view full profiles.',
} as const;

export const LOCK_REASONS = {
  NOT_LOGGED_IN: 'not_logged_in',
  FORM_INCOMPLETE: 'form_incomplete',
  NO_PACKAGE: 'no_package',
  ALLOWED: 'allowed',
} as const;

export type LockReason = typeof LOCK_REASONS[keyof typeof LOCK_REASONS];

interface MinimalProfile {
  profileCompletionStatus: string;
  hasPaid?: boolean;
}

interface MinimalPurchase {
  packageType: string;
  paymentStatus: string;
  accessStatus: string;
  expiryDate?: Date | string | null;
  eligibilityStatus?: string;
  profileId?: string;
  marriageConfirmation?: string;
}

export function hasCompletedOnboarding(profile: MinimalProfile | null): boolean {
  return profile?.profileCompletionStatus === 'COMPLETE';
}

function isActivePaid(pkg: PackageType, purchases: MinimalPurchase[]): boolean {
  const now = new Date();
  return purchases.some(p =>
    p.packageType === pkg &&
    p.paymentStatus === PaymentStatus.PAID &&
    p.accessStatus === 'ACTIVE' &&
    (p.expiryDate == null || new Date(p.expiryDate) > now)
  );
}

function isEligibleForPremiumPackage(pkg: PackageType, purchases: MinimalPurchase[]): boolean {
  if (pkg !== 'good_profile_package' && pkg !== 'high_profile_package') return true;
  return purchases.some(p =>
    p.packageType === pkg &&
    p.eligibilityStatus === ApprovalStatus.APPROVED &&
    p.marriageConfirmation === 'CONFIRMED' &&
    p.paymentStatus === PaymentStatus.PAID &&
    p.accessStatus === 'ACTIVE'
  );
}

export function hasActivePackage(
  purchases: MinimalPurchase[],
  profileId?: string
): boolean {
  const now = new Date();
  return purchases.some(p => {
    if (p.paymentStatus !== PaymentStatus.PAID || p.accessStatus !== 'ACTIVE') return false;
    // Purchases must belong to the viewer's own profile
    if (profileId && p.profileId && p.profileId !== profileId) return false;
    if (p.expiryDate == null) return true;
    return new Date(p.expiryDate) > now;
  });
}

export function getViewerPackageAccess(
  viewerProfile: { hasPaid: boolean; id?: string } | null,
  purchases: MinimalPurchase[]
) {
  const viewerProfileId = viewerProfile?.id;

  const hasMonthly = (viewerProfile?.hasPaid ?? false) || isActivePaid('monthly_membership', purchases);
  const hasGoodProfile = isEligibleForPremiumPackage('good_profile_package', purchases);
  const hasSecondMarriage = isActivePaid('second_marriage_package', purchases);
  const hasHighProfile = isActivePaid('high_profile_package', purchases) &&
    isEligibleForPremiumPackage('high_profile_package', purchases);

  return {
    hasStandard: hasMonthly,
    hasGoodProfile,
    hasSecondMarriage,
    hasHighProfile,
  };
}

export function canViewFullProfile(
  viewerProfile: MinimalProfile | null,
  viewerPurchases: MinimalPurchase[],
  viewerProfileId?: string
): { allowed: boolean; reason: LockReason } {
  if (!viewerProfile) {
    return { allowed: false, reason: LOCK_REASONS.NOT_LOGGED_IN };
  }
  if (!hasCompletedOnboarding(viewerProfile)) {
    return { allowed: false, reason: LOCK_REASONS.FORM_INCOMPLETE };
  }
  if (!hasActivePackage(viewerPurchases, viewerProfileId)) {
    return { allowed: false, reason: LOCK_REASONS.NO_PACKAGE };
  }
  return { allowed: true, reason: LOCK_REASONS.ALLOWED };
}

export function buildProfilePreview(profile: Record<string, unknown>) {
  const dob = profile.dateOfBirth ? new Date(profile.dateOfBirth as string) : null;
  const age = dob ? Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : null;
  const category = (profile.category as string) ?? 'normal';

  // Every active/approved profile — normal or premium category alike — must
  // show its real candidate name in the limited preview. Only contact/private
  // fields are protected here, never identity.
  return {
    id: profile.id,
    fullName: profile.fullName,
    gender: profile.gender,
    age,
    city: profile.city ?? null,
    state: profile.state ?? null,
    maslak: profile.maslak ?? null,
    biradari: profile.biradari ?? null,
    maritalStatus: profile.maritalStatus ?? null,
    category,
    verificationStatus: profile.verificationStatus,
    themeColor: profile.themeColor ?? null,
    // No contact, education, occupation, income, precise location or photo.
    isLocked: true,
  };
}
