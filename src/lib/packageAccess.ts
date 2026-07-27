// Shared package access helpers used across API routes.
//
// Packages accepted as "paid access":
//   - monthly_membership (also reflected on profile.hasPaid)
//   - second_marriage_package
//   - high_profile_package (requires APPROVED eligibility)
//   - good_profile_package

export interface PackagePurchaseLite {
  packageType: string;
  paymentStatus: string;
  eligibilityStatus?: string;
  accessStatus?: string;
}

export function hasPaidAccess(
  user: { hasPaid?: boolean; [key: string]: any } | null | undefined,
  purchases: PackagePurchaseLite[] | null | undefined
): boolean {
  if (!user && !purchases) return false;
  if (user?.hasPaid) return true;
  if (!purchases || !Array.isArray(purchases)) return false;
  return purchases.some(
    (p) =>
      p.paymentStatus === 'PAID' &&
      (p.packageType === 'monthly_membership' ||
        p.packageType === 'second_marriage_package' ||
        p.packageType === 'high_profile_package' ||
        p.packageType === 'good_profile_package')
  );
}

export function hasStandardPackage(purchases: PackagePurchaseLite[] | null | undefined): boolean {
  if (!purchases || !Array.isArray(purchases)) return false;
  return purchases.some(
    (p) => p.packageType === 'monthly_membership' && p.paymentStatus === 'PAID'
  );
}

export function hasSecondMarriagePackage(purchases: PackagePurchaseLite[] | null | undefined): boolean {
  if (!purchases || !Array.isArray(purchases)) return false;
  return purchases.some(
    (p) =>
      p.packageType === 'second_marriage_package' &&
      p.paymentStatus === 'PAID'
  );
}

export function hasHighProfilePackage(
  purchases: PackagePurchaseLite[] | null | undefined
): boolean {
  if (!purchases || !Array.isArray(purchases)) return false;
  return purchases.some(
    (p) =>
      p.packageType === 'high_profile_package' &&
      p.paymentStatus === 'PAID' &&
      p.eligibilityStatus === 'APPROVED'
  );
}

export function hasGoodProfilePackage(purchases: PackagePurchaseLite[] | null | undefined): boolean {
  if (!purchases || !Array.isArray(purchases)) return false;
  return purchases.some(
    (p) =>
      p.packageType === 'good_profile_package' &&
      p.paymentStatus === 'PAID'
  );
}

// Alias kept for backward-compatibility with callers that imported the inline helper.
export function hasPaid300Check(
  user: { hasPaid?: boolean; [key: string]: any } | null | undefined,
  purchases: PackagePurchaseLite[] | null | undefined
): boolean {
  return hasPaidAccess(user, purchases);
}
