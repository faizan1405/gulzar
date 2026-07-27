import { Profile } from '../types';

// Masked placeholder used everywhere a real phone number must NOT be exposed.
const MASKED_PHONE = '+91-XXXXX-XXXXX';

/**
 * Server-side privacy gate. Unauthorized viewers must NEVER receive protected
 * fields (real photo URL, phone/contact, full bio, education, occupation,
 * income, precise locality) in the API payload — hiding via CSS is not enough.
 *
 * Authorization tiers:
 *   - owner / admin            -> full profile
 *   - active monthly member    -> full "normal" profiles
 *   - matching premium package -> full profile of that premium category
 *   - everyone else            -> limited card: name, age, caste/community,
 *                                 gender, marital status, coarse city/state only
 */
export function redactProfile(
  profile: Profile,
  viewerHasStandardPkg: boolean,
  viewerHasSecondMarriagePkg: boolean,
  viewerHasHighProfilePkg: boolean,
  viewerHasGoodProfilePkg: boolean,
  isOwner: boolean,
  isAdmin: boolean
) {
  const profileCat = profile.category || '';

  // Identify profile categories strictly from the stable, admin-assigned
  // `category` field — never infer from occupation/income text or marital
  // status. Substring-matching those free-text fields previously misfired
  // (e.g. an income range of "₹5 LPA - ₹10 LPA" contains the substring
  // "₹10 LPA" and would wrongly lock a Good Profile / normal profile behind
  // the High-Profile package).
  const isSecondMarriage = profileCat === 'second_marriage';
  const isHighProfile = profileCat === 'high_profile';
  const isGoodProfile = profileCat === 'good_profile';

  // Enforce privacy constraints
  const isAuthorizedForSecondMarriage = isOwner || isAdmin || viewerHasSecondMarriagePkg;
  const isAuthorizedForHighProfile = isOwner || isAdmin || viewerHasHighProfilePkg;
  const isAuthorizedForStandard = isOwner || isAdmin || viewerHasStandardPkg;
  const isAuthorizedForGoodProfile = isOwner || isAdmin || (viewerHasStandardPkg && viewerHasGoodProfilePkg);

  // Fields kept visible on a locked card so the directory stays useful for
  // filtering (community/location) WITHOUT leaking identity or contact details.
  function communityFields() {
    return {
      maslak: profile.maslak,
      fiqh: profile.fiqh,
      biradari: profile.biradari,
      // City-level district is kept for directory filtering (it's already shown
      // as the card's city); the fine-grained locality/neighbourhood is removed.
      district: profile.district,
      locality: null,
    };
  }

  // Premium-category locked shell: the candidate's name, age and caste/community
  // stay visible (the allowed limited-preview fields — required for every
  // profile, premium or not) but every sensitive field (photo, phone, exact
  // address, education, occupation, income, family info, bio) is stripped
  // because the viewer has not unlocked this profile's package.
  function premiumLockedShell(lockedCategory: string, bioMsg: string) {
    return {
      id: profile.id,
      fullName: profile.fullName,
      gender: profile.gender,
      dateOfBirth: profile.dateOfBirth,
      maritalStatus: profile.maritalStatus,
      city: profile.city,
      areaOrLocality: null,
      state: profile.state,
      country: profile.country,
      education: undefined,
      occupation: undefined,
      annualIncomeRange: undefined,
      familyInfo: undefined,
      partnerPref: undefined,
      bio: bioMsg,
      themeColor: profile.themeColor,
      verificationStatus: profile.verificationStatus,
      profileCompletionStatus: profile.profileCompletionStatus,
      createdAt: profile.createdAt,
      phoneNumber: MASKED_PHONE,
      latitude: null,
      longitude: null,
      category: profileCat,
      isLocked: true,
      isLockedCategory: lockedCategory,
      ...communityFields(),
      preferredLocations: [],
      sameCastePreference: profile.sameCastePreference,
      sameMaslakPreference: profile.sameMaslakPreference,
      noCastePreference: profile.noCastePreference,
      noMaslakPreference: profile.noMaslakPreference,
      willingToRelocate: profile.willingToRelocate,
      profileImageUrl: undefined,
      profileImageStatus: undefined,
    } as unknown as Profile;
  }

  if (isGoodProfile && !isAuthorizedForGoodProfile) {
    return premiumLockedShell(
      'good_profile_package',
      'This profile is in the exclusive Good Profile category. Purchase the Good Profile Package to view full details.'
    );
  }

  if (isSecondMarriage && !isAuthorizedForSecondMarriage) {
    return premiumLockedShell(
      'second_marriage_package',
      'This profile is in the private second-marriage category. Purchase the Second-Marriage Package to unlock full access.'
    );
  }

  if (isHighProfile && !isAuthorizedForHighProfile) {
    return premiumLockedShell(
      'high_profile_package',
      'This profile is in the private high-profile category. Purchase the High-Profile Match Package and complete eligibility review to unlock.'
    );
  }

  if (!isAuthorizedForStandard) {
    // Guest / logged-in-without-subscription: expose ONLY name, age (via DOB),
    // gender, marital status, caste/community and coarse city/state. Everything
    // sensitive (photo, phone, contact, education, occupation, income, precise
    // locality, family info, bio) is removed from the payload.
    return {
      id: profile.id,
      fullName: profile.fullName,
      gender: profile.gender,
      dateOfBirth: profile.dateOfBirth,
      maritalStatus: profile.maritalStatus,
      city: profile.city,
      areaOrLocality: null,
      state: profile.state,
      country: profile.country,
      education: undefined,
      occupation: undefined,
      annualIncomeRange: undefined,
      familyInfo: undefined,
      partnerPref: undefined,
      bio: 'Unlock this profile by subscribing to our monthly membership.',
      themeColor: profile.themeColor,
      verificationStatus: profile.verificationStatus,
      profileCompletionStatus: profile.profileCompletionStatus,
      createdAt: profile.createdAt,
      phoneNumber: MASKED_PHONE,
      latitude: null,
      longitude: null,
      category: profileCat,
      isLocked: true,

      // Community identity kept for filtering; precise locality removed.
      ...communityFields(),
      preferredLocations: [],
      sameCastePreference: profile.sameCastePreference,
      sameMaslakPreference: profile.sameMaslakPreference,
      noCastePreference: profile.noCastePreference,
      noMaslakPreference: profile.noMaslakPreference,
      willingToRelocate: profile.willingToRelocate,
      profileImageUrl: undefined,
      profileImageStatus: undefined,
    } as unknown as Profile;
  }

  // Authorized viewer (non owner/admin): show full profile but only reveal the
  // real photo once it has passed admin approval.
  if (!isOwner && !isAdmin && profile.profileImageStatus !== 'APPROVED') {
    return {
      ...profile,
      profileImageUrl: undefined,
    } as Profile;
  }

  return profile;
}
