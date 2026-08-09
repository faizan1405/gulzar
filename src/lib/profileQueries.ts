import { prisma } from './db';
import { VerificationStatus, ProfileCompletionStatus } from '@prisma/client';
import {
  testDbConnection,
  getValidObjectId,
  sanitizeErrorMessage,
  isFallbackAllowed,
  logFallbackWarning,
  inMemoryProfiles,
} from './fallbackStore';
import { redactProfile } from './profilePrivacy';

/* ------------------------------------------------------------------ */
/*  Profile CRUD                                                       */
/* ------------------------------------------------------------------ */

export async function getProfileById(id: string) {
  const isDb = await testDbConnection();
  if (isDb) {
    try {
      const dbId = getValidObjectId(id);
      if (dbId === undefined) return null;
      return await prisma.matrimonialProfile.findUnique({
        where: { id: dbId },
      });
    } catch (e) {
      const msg = sanitizeErrorMessage(e instanceof Error ? e.message : String(e));
      if (!isFallbackAllowed()) {
        throw new Error(`Database query failed: ${msg}`);
      }
      console.error('Database query failed, using fallback', msg);
    }
  } else if (!isFallbackAllowed()) {
    throw new Error('Database is offline or not configured.');
  }
  logFallbackWarning('getProfileById');
  return inMemoryProfiles?.find((p) => p.id === id) || null;
}

export async function getProfileByUserId(userId: string) {
  const isDb = await testDbConnection();
  if (isDb) {
    try {
      const dbUserId = getValidObjectId(userId);
      return await prisma.matrimonialProfile.findUnique({
        where: { userId: dbUserId },
      });
    } catch (e) {
      const msg = sanitizeErrorMessage(e instanceof Error ? e.message : String(e));
      if (!isFallbackAllowed()) {
        throw new Error(`Database query failed: ${msg}`);
      }
      console.error('Database query failed, using fallback', msg);
    }
  } else if (!isFallbackAllowed()) {
    throw new Error('Database is offline or not configured.');
  }
  logFallbackWarning('getProfileByUserId');
  return inMemoryProfiles?.find((p) => p.userId === userId) || null;
}

/** Expose an empty profile array for fallback use */
export function getEmptyProfiles() {
  return [];
}

/**
 * Returns ALL profiles from the database with all sensitive fields redacted by default.
 * Use `getAllProfilesRaw()` for admin contexts that need full data.
 */
export async function getAllProfiles() {
  const dbProfiles = await getAllProfilesRaw();
  return dbProfiles.map((p) =>
    redactProfile(
      { ...p, dateOfBirth: typeof p.dateOfBirth === 'string' ? p.dateOfBirth : p.dateOfBirth.toISOString() },
      false, // viewerHasStandardPkg
      false, // viewerHasSecondMarriagePkg
      false, // viewerHasHighProfilePkg
      false, // viewerHasGoodProfilePkg
      false, // isOwner
      false  // isAdmin
    )
  );
}

/**
 * Admin/internal helper that returns ALL profiles WITHOUT redaction.
 * Callers MUST handle privacy/redaction themselves.
 */
export async function getAllProfilesRaw() {
  const isDb = await testDbConnection();
  if (isDb) {
    try {
      const dbProfiles = await prisma.matrimonialProfile.findMany({
        orderBy: { createdAt: 'desc' },
      });
      if (dbProfiles.length === 0) {
        return [];
      }
      return dbProfiles;
    } catch (e) {
      const msg = sanitizeErrorMessage(e instanceof Error ? e.message : String(e));
      if (!isFallbackAllowed()) {
        throw new Error(`Database query failed: ${msg}`);
      }
      console.error('Database query failed, using fallback', msg);
    }
  } else if (!isFallbackAllowed()) {
    throw new Error('Database is offline or not configured.');
  }
  logFallbackWarning('getAllProfilesRaw');
  return inMemoryProfiles || [];
}

export async function upsertProfile(
  userId: string,
  data: {
    fullName: string;
    gender: string;
    dateOfBirth: string;
    maritalStatus: string;
    phoneNumber: string;
    city?: string | null;
    areaOrLocality?: string | null;
    state?: string | null;
    country?: string | null;
    education: string;
    occupation: string;
    annualIncomeRange: string;
    familyInfo: string;
    bio: string;
    themeColor?: string;
    latitude?: number;
    longitude?: number;
    maslak?: string | null;
    fiqh?: string | null;
    biradari?: string | null;
    biradariAliases?: string[];
    district?: string | null;
    locality?: string | null;
    preferredLocations?: string[];
    sameCastePreference?: boolean;
    sameMaslakPreference?: boolean;
    noCastePreference?: boolean;
    noMaslakPreference?: boolean;
    willingToRelocate?: boolean;
    category?: string | null;

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
  }
) {
  const isDb = await testDbConnection();
  if (isDb) {
    try {
      const dbUserId = getValidObjectId(userId);
      const { category, ...rest } = data;
      const cleanCategory = category === null ? 'normal' : category;
      const dob = new Date(rest.dateOfBirth);
      if (isNaN(dob.getTime())) {
        throw new Error(
          `Invalid dateOfBirth: "${rest.dateOfBirth}". Expected an ISO date string (e.g. "1995-04-12") or a parseable date.`
        );
      }

      return await prisma.matrimonialProfile.upsert({
        where: { userId: dbUserId },
        update: {
          ...rest,
          dateOfBirth: dob,
          ...(cleanCategory !== undefined ? { category: cleanCategory } : {}),
          profileCompletionStatus: 'COMPLETE' as ProfileCompletionStatus,
        },
        create: {
          ...rest,
          dateOfBirth: dob,
          category: cleanCategory || 'normal',
          userId: dbUserId,
          profileCompletionStatus: 'COMPLETE' as ProfileCompletionStatus,
          verificationStatus: 'PENDING' as VerificationStatus,
        },
      });
    } catch (e) {
      const msg = sanitizeErrorMessage(e instanceof Error ? e.message : String(e));
      if (!isFallbackAllowed()) {
        throw new Error(`Database write failed: ${msg}`);
      }
      console.error('Database write failed, using fallback', msg);
    }
  } else if (!isFallbackAllowed()) {
    throw new Error('Database is offline or not configured.');
  }

  // Fallback
  const existingIndex = inMemoryProfiles?.findIndex((p) => p.userId === userId) ?? -1;
  const fallbackDob = new Date(data.dateOfBirth);
  if (isNaN(fallbackDob.getTime())) {
    const fallbackMsg = `Invalid dateOfBirth in fallback path: "${data.dateOfBirth}"`;
    console.error(fallbackMsg);
    if (!isFallbackAllowed()) {
      throw new Error(fallbackMsg);
    }
    return null;
  }
  const profileData = {
    id: `p-${Date.now()}`,
    userId,
    fullName: data.fullName,
    gender: data.gender,
    dateOfBirth: fallbackDob,
    maritalStatus: data.maritalStatus,
    phoneNumber: data.phoneNumber,
    city: data.city || null,
    areaOrLocality: data.areaOrLocality || null,
    state: data.state || null,
    country: data.country || 'India',
    latitude: data.latitude ?? null,
    longitude: data.longitude ?? null,
    education: data.education,
    occupation: data.occupation,
    annualIncomeRange: data.annualIncomeRange,
    familyInfo: data.familyInfo,
    bio: data.bio,
    themeColor: data.themeColor || 'hsl(150, 45%, 18%)',
    verificationStatus: 'PENDING' as VerificationStatus,
    profileCompletionStatus: 'COMPLETE' as ProfileCompletionStatus,
    adminApprovalStatus: 'PENDING',
    hasPaid: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    maslak: data.maslak ?? null,
    fiqh: data.fiqh ?? null,
    biradari: data.biradari ?? null,
    biradariAliases: data.biradariAliases ?? [],
    district: data.district ?? null,
    locality: data.locality ?? null,
    preferredLocations: data.preferredLocations ?? [],
    sameCastePreference: data.sameCastePreference ?? false,
    sameMaslakPreference: data.sameMaslakPreference ?? false,
    noCastePreference: data.noCastePreference ?? false,
    noMaslakPreference: data.noMaslakPreference ?? false,
    willingToRelocate: data.willingToRelocate ?? false,
    category: data.category ?? 'normal',
  };

  if (existingIndex > -1 && inMemoryProfiles) {
    inMemoryProfiles[existingIndex] = {
      ...inMemoryProfiles[existingIndex],
      ...profileData,
      id: inMemoryProfiles[existingIndex].id,
      verificationStatus: inMemoryProfiles[existingIndex].verificationStatus,
    };
    return inMemoryProfiles[existingIndex];
  } else {
    inMemoryProfiles?.unshift(profileData);
    // Create a verification request in the in-memory fallback store
    const { inMemoryRequests } = await import('./fallbackStore');
    inMemoryRequests?.unshift({
      id: `vr-${Date.now()}`,
      profileId: profileData.id,
      status: 'PENDING',
      assignedAdminId: null,
      notes: '',
      verifiedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return profileData;
  }
}

export async function markUserAsPaid(userId: string) {
  const isDb = await testDbConnection();
  if (isDb) {
    try {
      const dbUserId = getValidObjectId(userId);
      return await prisma.matrimonialProfile.update({
        where: { userId: dbUserId },
        data: { hasPaid: true },
      });
    } catch (e) {
      const msg = sanitizeErrorMessage(e instanceof Error ? e.message : String(e));
      if (!isFallbackAllowed()) {
        throw new Error(`Database write failed: ${msg}`);
      }
      console.error('Database write failed, using fallback', msg);
    }
  } else if (!isFallbackAllowed()) {
    throw new Error('Database is offline or not configured.');
  }

  // Fallback
  const profile = inMemoryProfiles?.find((p) => p.userId === userId);
  if (profile) {
    profile.hasPaid = true;
  }
  return profile || null;
}

export async function updateProfileImage(userId: string, imageUrl: string, publicId: string | null) {
  const isDb = await testDbConnection();
  if (isDb) {
    try {
      const dbUserId = getValidObjectId(userId);
      return await prisma.matrimonialProfile.update({
        where: { userId: dbUserId },
        data: {
          profileImageUrl: imageUrl,
          profileImagePublicId: publicId,
          profileImageStatus: 'PENDING',
          uploadedAt: new Date(),
        },
      });
    } catch (e) {
      const msg = sanitizeErrorMessage(e instanceof Error ? e.message : String(e));
      if (!isFallbackAllowed()) {
        throw new Error(`Database write failed: ${msg}`);
      }
      console.error('Database write failed, using fallback', msg);
    }
  } else if (!isFallbackAllowed()) {
    throw new Error('Database is offline or not configured.');
  }

  // Fallback
  const profile = inMemoryProfiles?.find((p) => p.userId === userId);
  if (profile) {
    profile.profileImageUrl = imageUrl;
    profile.profileImagePublicId = publicId;
    profile.profileImageStatus = 'PENDING';
    profile.uploadedAt = new Date();
  }
  return profile || null;
}

/* ------------------------------------------------------------------ */
/*  Partial update (Edit Profile)                                      */
/* ------------------------------------------------------------------ */

export interface ProfilePatch {
  // Basic + extended optional fields (all partial — only what client sent)
  height?: string | null;
  motherTongue?: string | null;
  languages?: string[];
  aboutMe?: string | null;
  nativePlace?: string | null;
  currentLocation?: string | null;
  areaOrLocality?: string | null;
  education?: string;
  highestQualification?: string | null;
  degree?: string | null;
  college?: string | null;
  certifications?: string;
  occupation?: string;
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
  bio?: string;
  familyInfo?: string;
  partnerPref?: string;
}

export async function patchProfile(userId: string, patch: ProfilePatch) {
  const isDb = await testDbConnection();
  if (isDb) {
    try {
      const dbUserId = getValidObjectId(userId);
      // Strip undefined keys — Prisma won't accept undefined for optional fields
      const data: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(patch)) {
        if (v !== undefined) data[k] = v;
      }
      return await prisma.matrimonialProfile.update({
        where: { userId: dbUserId },
        data,
      });
    } catch (e) {
      const msg = sanitizeErrorMessage(e instanceof Error ? e.message : String(e));
      if (!isFallbackAllowed()) {
        throw new Error(`Database write failed: ${msg}`);
      }
      console.error('Database write failed, using fallback', msg);
    }
  } else if (!isFallbackAllowed()) {
    throw new Error('Database is offline or not configured.');
  }

  const profile = inMemoryProfiles?.find((p) => p.userId === userId);
  if (profile) {
    for (const [k, v] of Object.entries(patch)) {
      if (v !== undefined) (profile as unknown as Record<string, unknown>)[k] = v;
    }
    profile.updatedAt = new Date();
  }
  return profile || null;
}

/* ------------------------------------------------------------------ */
/*  Profile completion calculator (single source of truth)             */
/* ------------------------------------------------------------------ */

export interface CompletionSection {
  key: string;
  label: string;
  weight: number;
  complete: boolean;
  fields: string[];
}

export interface CompletionResult {
  percent: number;
  sections: CompletionSection[];
}

const SECTION_DEFS: Array<Omit<CompletionSection, 'complete'>> = [
  {
    key: 'basic',
    label: 'Basic Information',
    weight: 15,
    fields: ['fullName', 'gender', 'dateOfBirth', 'maritalStatus', 'phoneNumber'],
  },
  {
    key: 'location',
    label: 'Location',
    weight: 10,
    fields: ['city', 'state', 'country'],
  },
  {
    key: 'education',
    label: 'Education',
    weight: 10,
    fields: ['education', 'highestQualification', 'degree', 'college'],
  },
  {
    key: 'career',
    label: 'Career',
    weight: 10,
    fields: ['occupation', 'jobTitle', 'company', 'industry'],
  },
  {
    key: 'family',
    label: 'Family',
    weight: 10,
    fields: ['familyInfo', 'fatherOccupation', 'motherOccupation', 'siblings', 'familyType'],
  },
  {
    key: 'lifestyle',
    label: 'Lifestyle',
    weight: 10,
    fields: ['foodPreference', 'hobbies', 'interests'],
  },
  {
    key: 'partner',
    label: 'Partner Preferences',
    weight: 10,
    fields: ['partnerPref', 'partnerAgeMin', 'partnerEducationPref', 'partnerBiradariPref'],
  },
  {
    key: 'about',
    label: 'About Me',
    weight: 10,
    fields: ['bio', 'aboutMe'],
  },
  {
    key: 'photo',
    label: 'Profile Photo',
    weight: 10,
    fields: ['profileImageUrl'],
  },
  {
    key: 'identity',
    label: 'Religious & Community Identity',
    weight: 5,
    fields: ['maslak', 'biradari'],
  },
  {
    key: 'personal',
    label: 'Personal Details',
    weight: 10,
    fields: ['height', 'motherTongue', 'languages'],
  },
];

function isFilled(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'number') return Number.isFinite(value);
  return Boolean(value);
}

export function calculateProfileCompletion(profile: Record<string, unknown> | null | undefined): CompletionResult {
  if (!profile) {
    return {
      percent: 0,
      sections: SECTION_DEFS.map((s) => ({ ...s, complete: false })),
    };
  }

  const sections: CompletionSection[] = SECTION_DEFS.map((def) => {
    const filled = def.fields.filter((f) => isFilled(profile[f])).length;
    return {
      ...def,
      complete: filled >= Math.ceil(def.fields.length / 2),
    };
  });

  const totalWeight = sections.reduce((sum, s) => sum + s.weight, 0);
  const earned = sections.reduce((sum, s) => sum + (s.complete ? s.weight : 0), 0);
  const percent = Math.round((earned / totalWeight) * 100);

  return { percent, sections };
}