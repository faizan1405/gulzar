import { Profile } from '../types';

export function redactProfile(
  profile: Profile,
  viewerHasStandardPkg: boolean,
  viewerHasSecondMarriagePkg: boolean,
  viewerHasHighProfilePkg: boolean,
  viewerHasGoodProfilePkg: boolean,
  isOwner: boolean,
  isAdmin: boolean
) {
  // Identify profile categories
  const profileCat = (profile as any).category || '';
  const isSecondMarriage = profile.maritalStatus !== 'Single' || profileCat === 'second_marriage';
  const isHighProfile = 
    profileCat === 'high_profile' ||
    profile.occupation.toLowerCase().includes('doctor') ||
    profile.occupation.toLowerCase().includes('engineer') ||
    profile.occupation.toLowerCase().includes('business') ||
    profile.annualIncomeRange.includes('₹10 LPA') ||
    profile.annualIncomeRange.includes('₹15 LPA') ||
    profile.annualIncomeRange.includes('Above');

  const isGoodProfile = profileCat === 'good_profile';

  // Enforce privacy constraints
  const isAuthorizedForSecondMarriage = isOwner || isAdmin || viewerHasSecondMarriagePkg;
  const isAuthorizedForHighProfile = isOwner || isAdmin || viewerHasHighProfilePkg;
  const isAuthorizedForStandard = isOwner || isAdmin || viewerHasStandardPkg;
  const isAuthorizedForGoodProfile = isOwner || isAdmin || (viewerHasStandardPkg && viewerHasGoodProfilePkg);

  if (isGoodProfile && !isAuthorizedForGoodProfile) {
    return {
      id: profile.id,
      fullName: 'Good Profile Candidate (Locked)',
      gender: profile.gender,
      dateOfBirth: new Date(1900, 0, 1),
      maritalStatus: profile.maritalStatus,
      city: profile.city,
      state: profile.state,
      country: profile.country,
      education: 'Hidden (Good Profile Package Required)',
      occupation: 'Hidden',
      annualIncomeRange: 'Hidden',
      bio: 'This profile is in the exclusive Good Profile category. Purchase the Good Profile Package to view full details.',
      themeColor: profile.themeColor,
      verificationStatus: profile.verificationStatus,
      profileCompletionStatus: profile.profileCompletionStatus,
      createdAt: profile.createdAt,
      phoneNumber: '+91-XXXXX-XXXXX',
      latitude: null,
      longitude: null,
      isLockedCategory: 'good_profile_package',
      // Allow filtering without giving away identity
      maslak: profile.maslak,
      fiqh: profile.fiqh,
      biradari: profile.biradari,
      district: profile.district,
      locality: profile.locality,
      profileImageUrl: undefined,
      profileImageStatus: undefined,
    } as unknown as Profile;
  }

  if (isSecondMarriage && !isAuthorizedForSecondMarriage) {
    return {
      id: profile.id,
      fullName: 'Second-Marriage Candidate (Locked)',
      gender: profile.gender,
      dateOfBirth: new Date(1900, 0, 1),
      maritalStatus: profile.maritalStatus,
      city: profile.city,
      state: profile.state,
      country: profile.country,
      education: 'Hidden (Second-Marriage Plan Required)',
      occupation: 'Hidden',
      annualIncomeRange: 'Hidden',
      bio: 'This profile is in the private second-marriage category. Purchase the Second-Marriage Package to unlock full access.',
      themeColor: profile.themeColor,
      verificationStatus: profile.verificationStatus,
      profileCompletionStatus: profile.profileCompletionStatus,
      createdAt: profile.createdAt,
      phoneNumber: '+91-XXXXX-XXXXX',
      latitude: null,
      longitude: null,
      isLockedCategory: 'second_marriage_package',
      maslak: profile.maslak,
      fiqh: profile.fiqh,
      biradari: profile.biradari,
      district: profile.district,
      locality: profile.locality,
      profileImageUrl: undefined,
      profileImageStatus: undefined,
    } as unknown as Profile;
  }

  if (isHighProfile && !isAuthorizedForHighProfile) {
    return {
      id: profile.id,
      fullName: 'High-Profile Candidate (Locked)',
      gender: profile.gender,
      dateOfBirth: new Date(1900, 0, 1),
      maritalStatus: profile.maritalStatus,
      city: profile.city,
      state: profile.state,
      country: profile.country,
      education: 'Hidden (High-Profile Plan & Approval Required)',
      occupation: 'Hidden',
      annualIncomeRange: 'Hidden',
      bio: 'This profile is in the private high-profile category. Purchase the High-Profile Match Package and complete eligibility review to unlock.',
      themeColor: profile.themeColor,
      verificationStatus: profile.verificationStatus,
      profileCompletionStatus: profile.profileCompletionStatus,
      createdAt: profile.createdAt,
      phoneNumber: '+91-XXXXX-XXXXX',
      latitude: null,
      longitude: null,
      isLockedCategory: 'high_profile_package',
      maslak: profile.maslak,
      fiqh: profile.fiqh,
      biradari: profile.biradari,
      district: profile.district,
      locality: profile.locality,
      profileImageUrl: undefined,
      profileImageStatus: undefined,
    } as unknown as Profile;
  }

  if (!isAuthorizedForStandard) {
    // Return redacted profile
    return {
      id: profile.id,
      fullName: 'Profile Locked',
      gender: profile.gender,
      dateOfBirth: new Date(1900, 0, 1), // Redacted
      maritalStatus: profile.maritalStatus,
      city: profile.city,
      areaOrLocality: profile.areaOrLocality,
      state: profile.state,
      country: profile.country,
      education: profile.education,
      occupation: profile.occupation,
      annualIncomeRange: profile.annualIncomeRange,
      bio: 'Unlock this profile by subscribing to our monthly membership.',
      themeColor: profile.themeColor,
      verificationStatus: profile.verificationStatus,
      profileCompletionStatus: profile.profileCompletionStatus,
      createdAt: profile.createdAt,
      phoneNumber: '+91-XXXXX-XXXXX',
      latitude: null,
      longitude: null,

      // Matrimonial identity fields remain visible for filtering
      maslak: profile.maslak,
      fiqh: profile.fiqh,
      biradari: profile.biradari,
      district: profile.district,
      locality: profile.locality,
      preferredLocations: profile.preferredLocations || [],
      sameCastePreference: profile.sameCastePreference,
      sameMaslakPreference: profile.sameMaslakPreference,
      noCastePreference: profile.noCastePreference,
      noMaslakPreference: profile.noMaslakPreference,
      willingToRelocate: profile.willingToRelocate,
      profileImageUrl: undefined,
      profileImageStatus: undefined,
    } as unknown as Profile;
  }

  // Finally, if authorized, only show image if it's approved or user is owner/admin
  if (!isOwner && !isAdmin && (profile as any).profileImageStatus !== 'APPROVED') {
    return {
      ...profile,
      profileImageUrl: undefined,
    } as Profile;
  }

  return profile;
}
