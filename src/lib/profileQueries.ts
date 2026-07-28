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

export async function getAllProfiles() {
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
  logFallbackWarning('getAllProfiles');
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
    (profile as any).profileImageUrl = imageUrl;
    (profile as any).profileImagePublicId = publicId;
    (profile as any).profileImageStatus = 'PENDING';
    (profile as any).uploadedAt = new Date();
  }
  return profile || null;
}