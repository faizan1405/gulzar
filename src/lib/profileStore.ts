import { prisma } from './db';
import { VerificationStatus, ProfileCompletionStatus, PackageType, PaymentStatus, ApprovalStatus } from '@prisma/client';
import crypto from 'crypto';
import { DEFAULT_MASLAKS, DEFAULT_FIQHS, DEFAULT_CASTES, DEFAULT_LOCATIONS } from './masterData';

// Fallback Master Data Lists
export let MOCK_MASLAK_OPTIONS: Array<{
  id: string;
  label: string;
  aliases: string[];
  isDisabled: boolean;
}> = [];

export let MOCK_CASTE_OPTIONS: Array<{
  id: string;
  label: string;
  aliases: string[];
  isDisabled: boolean;
}> = [];

export let MOCK_LOCATION_OPTIONS: Array<{
  id: string;
  state: string;
  district: string;
  locality: string | null;
  isHighPriority: boolean;
  isDisabled: boolean;
}> = [];

export function initFallbackOptions() {
  if (MOCK_MASLAK_OPTIONS.length === 0) {
    MOCK_MASLAK_OPTIONS = DEFAULT_MASLAKS.map((m, idx) => ({
      id: `maslak-${idx}`,
      label: m.label,
      aliases: m.aliases,
      isDisabled: false
    }));
  }
  if (MOCK_CASTE_OPTIONS.length === 0) {
    MOCK_CASTE_OPTIONS = DEFAULT_CASTES.map((c, idx) => ({
      id: `caste-${idx}`,
      label: c.label,
      aliases: c.aliases,
      isDisabled: false
    }));
  }
  if (MOCK_LOCATION_OPTIONS.length === 0) {
    MOCK_LOCATION_OPTIONS = DEFAULT_LOCATIONS.map((l, idx) => ({
      id: `loc-${idx}`,
      state: l.state,
      district: l.district,
      locality: l.locality || null,
      isHighPriority: l.isHighPriority || false,
      isDisabled: false
    }));
  }
}

import { fallbackProfiles } from './fallbackProfiles';

// In-Memory Fallback State (if database is offline/unconfigured)
const MOCK_PROFILES_DB: Array<{
  id: string;
  userId: string;
  fullName: string;
  gender: string;
  dateOfBirth: Date;
  maritalStatus: string;
  phoneNumber: string;
  city: string | null;
  areaOrLocality: string | null;
  state: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  education: string;
  occupation: string;
  annualIncomeRange: string;
  familyInfo: string;
  bio: string;
  themeColor: string;
  verificationStatus: VerificationStatus;
  profileCompletionStatus: ProfileCompletionStatus;
  adminApprovalStatus: string;
  hasPaid: boolean;
  createdAt: Date;
  updatedAt: Date;
  maslak: string | null;
  fiqh: string | null;
  biradari: string | null;
  biradariAliases: string[];
  district: string | null;
  locality: string | null;
  preferredLocations: string[];
  sameCastePreference: boolean;
  sameMaslakPreference: boolean;
  noCastePreference: boolean;
  noMaslakPreference: boolean;
  willingToRelocate: boolean;
  category?: string | null;
}> = fallbackProfiles.map(p => ({
  id: p.id,
  userId: p.userId,
  fullName: p.fullName,
  gender: p.gender,
  dateOfBirth: new Date(p.dateOfBirth),
  maritalStatus: p.maritalStatus,
  phoneNumber: p.phoneNumber,
  city: p.city,
  areaOrLocality: p.locality,
  state: p.state,
  country: p.country,
  latitude: null,
  longitude: null,
  education: p.education,
  occupation: p.occupation,
  annualIncomeRange: p.annualIncomeRange,
  familyInfo: p.familyInfo,
  bio: p.bio,
  themeColor: p.themeColor,
  verificationStatus: p.verificationStatus as VerificationStatus,
  profileCompletionStatus: p.profileCompletionStatus as ProfileCompletionStatus,
  adminApprovalStatus: p.verificationStatus === 'APPROVED' ? 'APPROVED' : (p.verificationStatus === 'REJECTED' ? 'REJECTED' : 'PENDING'),
  hasPaid: p.hasPaid,
  createdAt: new Date(p.regDate),
  updatedAt: new Date(p.regDate),
  maslak: p.maslak,
  fiqh: p.fiqh,
  biradari: p.biradari,
  biradariAliases: [],
  district: p.city,
  locality: p.locality,
  preferredLocations: [p.state],
  sameCastePreference: false,
  sameMaslakPreference: false,
  noCastePreference: true,
  noMaslakPreference: true,
  willingToRelocate: true,
  category: p.category,
}));



const MOCK_AUDIT_LOGS: Array<{
  id: string;
  actorUserId: string | null;
  action: string;
  targetType: string;
  targetId: string | null;
  metadata: string;
  createdAt: Date;
}> = [];
const MOCK_VERIFICATION_REQUESTS: Array<{
  id: string;
  profileId: string;
  status: VerificationStatus;
  assignedAdminId: string | null;
  notes: string | null;
  verifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}> = [
  {
    id: '60d5ecb86f67a213e4b7b271',
    profileId: '60d5ecb86f67a213e4b7b261',
    status: 'APPROVED' as VerificationStatus,
    assignedAdminId: '60d5ecb86f67a213e4b7b281',
    notes: 'Called user. Verified documents and family background.',
    verifiedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

const MOCK_PURCHASES: Array<{
  id: string;
  profileId: string;
  packageType: PackageType;
  basePrice: number;
  gstRate: number;
  totalAmount: number;
  billingType: string;
  successFeeAmount: number;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  paymentStatus: PaymentStatus;
  purchaseDate: Date;
  expiryDate: Date | null;
  accessStatus: string;
  eligibilityStatus: ApprovalStatus;
  marriageConfirmation: string;
  successFeePaymentStatus: PaymentStatus;
  internalNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
}> = [];

const MOCK_CURATED_LEADS: Array<{
  id: string;
  buyerProfileId: string;
  leadProfileId: string;
  status: string;
  assignedAt: Date;
  updatedAt: Date;
}> = [];

// Global objects for in-memory fallbacks to survive hot reloads
const globalStore = globalThis as unknown as {
  inMemoryProfiles: typeof MOCK_PROFILES_DB | undefined;
  inMemoryRequests: typeof MOCK_VERIFICATION_REQUESTS | undefined;
  inMemoryLogs: typeof MOCK_AUDIT_LOGS | undefined;
  inMemoryPurchases: typeof MOCK_PURCHASES | undefined;
  inMemoryCuratedLeads: typeof MOCK_CURATED_LEADS | undefined;
  inMemoryLeads: any[] | undefined;
  isDbConnected: boolean | undefined;
};

if (!globalStore.inMemoryProfiles) globalStore.inMemoryProfiles = [...MOCK_PROFILES_DB];
if (!globalStore.inMemoryRequests) globalStore.inMemoryRequests = [...MOCK_VERIFICATION_REQUESTS];
if (!globalStore.inMemoryLogs) globalStore.inMemoryLogs = [...MOCK_AUDIT_LOGS];
if (!globalStore.inMemoryPurchases) globalStore.inMemoryPurchases = [...MOCK_PURCHASES];
if (!globalStore.inMemoryCuratedLeads) globalStore.inMemoryCuratedLeads = [...MOCK_CURATED_LEADS];
if (!globalStore.inMemoryLeads) {
  globalStore.inMemoryLeads = [
    {
      id: "lead_mock_1",
      fullName: "Arsalan Khan",
      phone: "+91 98765 43210",
      email: "arsalan.khan@example.com",
      city: "Mumbai",
      message: "Interested in gold package, need details on success fee details.",
      inquiryType: "Package Inquiry",
      interestedPackage: "₹21,000 Gold Package",
      interestedProfileId: null,
      sourcePage: "/premium",
      status: "new",
      priority: "high",
      adminNotes: "Needs urgent callback.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    },
    {
      id: "lead_mock_2",
      fullName: "Yasmin Shaikh",
      phone: "+91 87654 32109",
      email: "yasmin.s@example.com",
      city: "Pune",
      message: "Request details for verification requirements.",
      inquiryType: "Verification Help",
      interestedPackage: null,
      interestedProfileId: null,
      sourcePage: "/contact",
      status: "contacted",
      priority: "normal",
      adminNotes: "Sent document checklist.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 20),
    }
  ];
}


// Safely sanitize credentials in connection string from error logs
export function sanitizeErrorMessage(msg: string): string {
  return msg.replace(/(mongodb\+srv:\/\/|mongodb:\/\/|postgresql:\/\/)[^\s@]+@[^\s/]+/g, '$1***:***@***');
}

// Verify if fallback mode is allowed (never in production mode unless explicitly configured)
export function isFallbackAllowed(): boolean {
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_DB_FALLBACK !== 'true') {
    return false;
  }
  return true;
}

// Check if MongoDB DB is reachable, caching result
export async function testDbConnection() {
  if (globalStore.isDbConnected !== undefined) {
    return globalStore.isDbConnected;
  }
  try {
    // Attempt a lightweight query
    await prisma.user.findFirst({ select: { id: true } });
    globalStore.isDbConnected = true;
    console.log('MongoDB connection active.');
  } catch (error) {
    globalStore.isDbConnected = false;
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.warn('Database connection check failed:', sanitizeErrorMessage(errorMsg));
    if (!isFallbackAllowed()) {
      throw new Error(`Database connection failed: ${sanitizeErrorMessage(errorMsg)}`);
    }
  }
  return globalStore.isDbConnected;
}

// Deterministically map any string/mock ID to a valid 24-character hex MongoDB ObjectId
export function getValidObjectId(id: string): string {
  if (/^[0-9a-fA-F]{24}$/.test(id)) {
    return id;
  }
  return crypto.createHash('md5').update(id).digest('hex').substring(0, 24);
}

export async function getProfileById(id: string) {
  const isDb = await testDbConnection();
  if (isDb) {
    try {
      const dbId = getValidObjectId(id);
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
  return globalStore.inMemoryProfiles?.find((p) => p.id === id) || null;
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
  return globalStore.inMemoryProfiles?.find((p) => p.userId === userId) || null;
}

// Expose the bundled fallback profiles (used as a public showcase fallback)
export function getFallbackProfiles() {
  return MOCK_PROFILES_DB;
}

export async function getAllProfiles() {
  const isDb = await testDbConnection();
  if (isDb) {
    try {
      const dbProfiles = await prisma.matrimonialProfile.findMany({
        orderBy: { createdAt: 'desc' },
      });
      // environment was never seeded), serve the bundled fallback profiles so the
      // public directory and featured section are never empty. Once real
      // profiles exist this branch never runs, so nothing is duplicated.
      if (dbProfiles.length === 0) {
        return MOCK_PROFILES_DB;
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
  return globalStore.inMemoryProfiles || [];
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

    // New Matrimonial Identity Fields
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
      
      return await prisma.matrimonialProfile.upsert({
        where: { userId: dbUserId },
        update: {
          ...rest,
          ...(cleanCategory !== undefined ? { category: cleanCategory } : {}),
          profileCompletionStatus: 'COMPLETE' as ProfileCompletionStatus,
        },
        create: {
          ...rest,
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
  const existingIndex = globalStore.inMemoryProfiles?.findIndex((p) => p.userId === userId) ?? -1;
  const profileData = {
    id: `p-${Date.now()}`,
    userId,
    fullName: data.fullName,
    gender: data.gender,
    dateOfBirth: new Date(data.dateOfBirth),
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
    // New fields:
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

  if (existingIndex > -1 && globalStore.inMemoryProfiles) {
    globalStore.inMemoryProfiles[existingIndex] = {
      ...globalStore.inMemoryProfiles[existingIndex],
      ...profileData,
      id: globalStore.inMemoryProfiles[existingIndex].id,
      verificationStatus: globalStore.inMemoryProfiles[existingIndex].verificationStatus,
    };
    return globalStore.inMemoryProfiles[existingIndex];
  } else {
    globalStore.inMemoryProfiles?.unshift(profileData);
    // Create verification request
    globalStore.inMemoryRequests?.unshift({
      id: `vr-${Date.now()}`,
      profileId: profileData.id,
      status: 'PENDING' as VerificationStatus,
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
  const profile = globalStore.inMemoryProfiles?.find((p) => p.userId === userId);
  if (profile) {
    profile.hasPaid = true;
  }
  return profile || null;
}

export async function getVerificationRequests() {
  const isDb = await testDbConnection();
  if (isDb) {
    try {
      return await prisma.verificationRequest.findMany({
        include: {
          profile: true,
        },
        orderBy: { createdAt: 'desc' },
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

  // Fallback: Map request profiles
  return (globalStore.inMemoryRequests || []).map((req) => ({
    ...req,
    profile: globalStore.inMemoryProfiles?.find((p) => p.id === req.profileId) || null,
  }));
}

export async function updateVerificationStatus(
  profileId: string,
  status: VerificationStatus,
  notes: string,
  adminId: string
) {
  const isDb = await testDbConnection();
  if (isDb) {
    try {
      const dbProfileId = getValidObjectId(profileId);
      const dbAdminId = getValidObjectId(adminId);

      // Find or create verification request
      const existingReq = await prisma.verificationRequest.findFirst({
        where: { profileId: dbProfileId },
      });

      if (existingReq) {
        await prisma.verificationRequest.update({
          where: { id: existingReq.id },
          data: {
            status,
            notes,
            assignedAdminId: dbAdminId,
            verifiedAt: status === 'APPROVED' ? new Date() : null,
          },
        });
      } else {
        await prisma.verificationRequest.create({
          data: {
            profileId: dbProfileId,
            status,
            notes,
            assignedAdminId: dbAdminId,
            verifiedAt: status === 'APPROVED' ? new Date() : null,
          },
        });
      }

      // Update profile status
      await prisma.matrimonialProfile.update({
        where: { id: dbProfileId },
        data: {
          verificationStatus: status,
          adminApprovalStatus: status,
        },
      });

      // Create Audit Log
      await prisma.auditLog.create({
        data: {
          actorUserId: dbAdminId,
          action: `VERIFICATION_STATUS_CHANGE_${status}`,
          targetType: 'MatrimonialProfile',
          targetId: dbProfileId,
          metadata: JSON.stringify({ notes }),
        },
      });

      return true;
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

  // Fallback logic
  if (globalStore.inMemoryProfiles) {
    const profile = globalStore.inMemoryProfiles.find((p) => p.id === profileId);
    if (profile) {
      profile.verificationStatus = status;
      profile.adminApprovalStatus = status;
    }
  }

  const reqIndex = globalStore.inMemoryRequests?.findIndex((r) => r.profileId === profileId) ?? -1;
  if (reqIndex > -1 && globalStore.inMemoryRequests) {
    globalStore.inMemoryRequests[reqIndex].status = status;
    globalStore.inMemoryRequests[reqIndex].notes = notes;
    globalStore.inMemoryRequests[reqIndex].assignedAdminId = adminId;
    globalStore.inMemoryRequests[reqIndex].verifiedAt = status === 'APPROVED' ? new Date() : null;
    globalStore.inMemoryRequests[reqIndex].updatedAt = new Date();
  } else {
    globalStore.inMemoryRequests?.unshift({
      id: `vr-${Date.now()}`,
      profileId,
      status,
      assignedAdminId: adminId,
      notes,
      verifiedAt: status === 'APPROVED' ? new Date() : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Write audit log
  globalStore.inMemoryLogs?.unshift({
    id: `log-${Date.now()}`,
    actorUserId: adminId,
    action: `VERIFICATION_STATUS_CHANGE_${status}`,
    targetType: 'MatrimonialProfile',
    targetId: profileId,
    metadata: JSON.stringify({ notes }),
    createdAt: new Date(),
  });

  return true;
}

export async function getAuditLogs() {
  const isDb = await testDbConnection();
  if (isDb) {
    try {
      return await prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
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
  return globalStore.inMemoryLogs || [];
}

export async function createPackagePurchase(data: {
  profileId: string;
  packageType: PackageType;
  basePrice: number;
  gstRate: number;
  totalAmount: number;
  billingType: string;
  successFeeAmount: number;
  razorpayOrderId: string;
}) {
  const isDb = await testDbConnection();
  const dbProfileId = getValidObjectId(data.profileId);
  const purchaseData = {
    ...data,
    profileId: dbProfileId,
    paymentStatus: 'PENDING' as PaymentStatus,
    accessStatus: 'ACTIVE',
    eligibilityStatus: data.packageType === 'high_profile_package' ? ('PENDING' as ApprovalStatus) : ('APPROVED' as ApprovalStatus),
    marriageConfirmation: 'PENDING',
    successFeePaymentStatus: 'PENDING' as PaymentStatus,
    razorpayPaymentId: null,
    expiryDate: null,
    internalNotes: '',
  };

  if (isDb) {
    try {
      return await prisma.packagePurchase.create({
        data: purchaseData,
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
  const newPurchase = {
    id: `purchase-${Date.now()}`,
    ...purchaseData,
    profileId: data.profileId, // keep original in fallback
    purchaseDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  globalStore.inMemoryPurchases?.push(newPurchase);
  return newPurchase;
}

export async function verifyPackagePurchase(orderId: string, paymentId: string) {
  const isDb = await testDbConnection();
  const monthlyExpiry = new Date();
  monthlyExpiry.setMonth(monthlyExpiry.getMonth() + 1); // 1 month for monthly plan
  const yearlyExpiry = new Date();
  yearlyExpiry.setFullYear(yearlyExpiry.getFullYear() + 1); // 1 year for premium packages

  function getExpiryForPackage(packageType: string): Date {
    return packageType === 'monthly_membership' ? monthlyExpiry : yearlyExpiry;
  }

  if (isDb) {
    try {
      const purchase = await prisma.packagePurchase.findFirst({
        where: { razorpayOrderId: orderId },
      });

      if (!purchase) return null;

      // Idempotent: already verified
      if (purchase.paymentStatus === 'PAID') return purchase;

      const updatedPurchase = await prisma.packagePurchase.update({
        where: { id: purchase.id },
        data: {
          paymentStatus: 'PAID' as PaymentStatus,
          razorpayPaymentId: paymentId,
          expiryDate: getExpiryForPackage(purchase.packageType),
        },
      });

      if (purchase.packageType === 'monthly_membership') {
        await prisma.matrimonialProfile.update({
          where: { id: purchase.profileId },
          data: { hasPaid: true },
        });
      }

      await prisma.auditLog.create({
        data: {
          actorUserId: null, // 'system' is not an ObjectId
          action: `PAYMENT_VERIFIED_${purchase.packageType}`,
          targetType: 'PackagePurchase',
          targetId: purchase.id,
          metadata: JSON.stringify({ orderId, paymentId }),
        },
      });

      return updatedPurchase;
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
  const purchase = globalStore.inMemoryPurchases?.find((p) => p.razorpayOrderId === orderId);
  if (purchase) {
    if (purchase.paymentStatus === 'PAID') return purchase; // idempotent
    purchase.paymentStatus = 'PAID' as PaymentStatus;
    purchase.razorpayPaymentId = paymentId;
    purchase.expiryDate = getExpiryForPackage(purchase.packageType);
    purchase.updatedAt = new Date();

    if (purchase.packageType === 'monthly_membership') {
      const profile = globalStore.inMemoryProfiles?.find((p) => p.id === purchase.profileId);
      if (profile) {
        profile.hasPaid = true;
      }
    }

    globalStore.inMemoryLogs?.unshift({
      id: `log-${Date.now()}`,
      actorUserId: 'system',
      action: `PAYMENT_VERIFIED_${purchase.packageType}`,
      targetType: 'PackagePurchase',
      targetId: purchase.id,
      metadata: JSON.stringify({ orderId, paymentId }),
      createdAt: new Date(),
    });
  }
  return purchase || null;
}

export async function getUserPurchases(profileId: string) {
  const isDb = await testDbConnection();
  if (isDb) {
    try {
      const dbProfileId = getValidObjectId(profileId);
      return await prisma.packagePurchase.findMany({
        where: { profileId: dbProfileId },
        orderBy: { purchaseDate: 'desc' },
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
  return globalStore.inMemoryPurchases?.filter((p) => p.profileId === profileId) || [];
}

export async function getAllPurchases() {
  const isDb = await testDbConnection();
  if (isDb) {
    try {
      return await prisma.packagePurchase.findMany({
        include: {
          profile: {
            include: { user: true }
          }
        },
        orderBy: { purchaseDate: 'desc' },
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

  return (globalStore.inMemoryPurchases || []).map((p) => ({
    ...p,
    profile: globalStore.inMemoryProfiles?.find((prof) => prof.id === p.profileId) || null,
  }));
}

export async function assignCuratedLead(buyerProfileId: string, leadProfileId: string) {
  const isDb = await testDbConnection();
  if (isDb) {
    try {
      const dbBuyerId = getValidObjectId(buyerProfileId);
      const dbLeadId = getValidObjectId(leadProfileId);
      return await prisma.curatedLeadAssignment.create({
        data: {
          buyerProfileId: dbBuyerId,
          leadProfileId: dbLeadId,
          status: 'PENDING',
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
  const newAssignment = {
    id: `assignment-${Date.now()}`,
    buyerProfileId,
    leadProfileId,
    status: 'PENDING',
    assignedAt: new Date(),
    updatedAt: new Date(),
  };
  globalStore.inMemoryCuratedLeads?.push(newAssignment);
  return newAssignment;
}

export async function getCuratedAssignments() {
  const isDb = await testDbConnection();
  if (isDb) {
    try {
      return await prisma.curatedLeadAssignment.findMany({
        include: {
          buyerProfile: true,
          leadProfile: true,
        },
        orderBy: { assignedAt: 'desc' },
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

  return (globalStore.inMemoryCuratedLeads || []).map((a) => ({
    ...a,
    buyerProfile: globalStore.inMemoryProfiles?.find((prof) => prof.id === a.buyerProfileId) || null,
    leadProfile: globalStore.inMemoryProfiles?.find((prof) => prof.id === a.leadProfileId) || null,
  }));
}

export async function updateCuratedLeadStatus(assignmentId: string, status: string) {
  const isDb = await testDbConnection();
  if (isDb) {
    try {
      const dbAssignmentId = getValidObjectId(assignmentId);
      return await prisma.curatedLeadAssignment.update({
        where: { id: dbAssignmentId },
        data: { status },
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
  const assignment = globalStore.inMemoryCuratedLeads?.find((a) => a.id === assignmentId);
  if (assignment) {
    assignment.status = status;
    assignment.updatedAt = new Date();
  }
  return assignment || null;
}

export async function updateHighProfileEligibility(purchaseId: string, status: ApprovalStatus, notes: string, adminId: string) {
  const isDb = await testDbConnection();
  if (isDb) {
    try {
      const dbPurchaseId = getValidObjectId(purchaseId);
      const dbAdminId = getValidObjectId(adminId);
      const updated = await prisma.packagePurchase.update({
        where: { id: dbPurchaseId },
        data: {
          eligibilityStatus: status,
          internalNotes: notes,
        },
      });

      await prisma.auditLog.create({
        data: {
          actorUserId: dbAdminId,
          action: `HIGH_PROFILE_ELIGIBILITY_${status}`,
          targetType: 'PackagePurchase',
          targetId: dbPurchaseId,
          metadata: JSON.stringify({ notes }),
        },
      });

      return updated;
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
  const purchase = globalStore.inMemoryPurchases?.find((p) => p.id === purchaseId);
  if (purchase) {
    purchase.eligibilityStatus = status;
    purchase.internalNotes = notes;
    purchase.updatedAt = new Date();

    globalStore.inMemoryLogs?.unshift({
      id: `log-${Date.now()}`,
      actorUserId: adminId,
      action: `HIGH_PROFILE_ELIGIBILITY_${status}`,
      targetType: 'PackagePurchase',
      targetId: purchaseId,
      metadata: JSON.stringify({ notes }),
      createdAt: new Date(),
    });
  }
  return purchase || null;
}

export async function confirmMarriage(purchaseId: string, confirmed: boolean, adminId: string) {
  const isDb = await testDbConnection();
  const statusStr = confirmed ? 'CONFIRMED' : 'PENDING';
  if (isDb) {
    try {
      const dbPurchaseId = getValidObjectId(purchaseId);
      const dbAdminId = getValidObjectId(adminId);
      const updated = await prisma.packagePurchase.update({
        where: { id: dbPurchaseId },
        data: {
          marriageConfirmation: statusStr,
        },
      });

      await prisma.auditLog.create({
        data: {
          actorUserId: dbAdminId,
          action: `MARRIAGE_CONFIRMATION_${statusStr}`,
          targetType: 'PackagePurchase',
          targetId: dbPurchaseId,
          metadata: '',
        },
      });

      return updated;
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
  const purchase = globalStore.inMemoryPurchases?.find((p) => p.id === purchaseId);
  if (purchase) {
    purchase.marriageConfirmation = statusStr;
    purchase.updatedAt = new Date();

    globalStore.inMemoryLogs?.unshift({
      id: `log-${Date.now()}`,
      actorUserId: adminId,
      action: `MARRIAGE_CONFIRMATION_${statusStr}`,
      targetType: 'PackagePurchase',
      targetId: purchaseId,
      metadata: '',
      createdAt: new Date(),
    });
  }
  return purchase || null;
}

export async function updateSuccessFeeStatus(purchaseId: string, status: PaymentStatus, adminId: string) {
  const isDb = await testDbConnection();
  if (isDb) {
    try {
      const dbPurchaseId = getValidObjectId(purchaseId);
      const dbAdminId = getValidObjectId(adminId);
      const updated = await prisma.packagePurchase.update({
        where: { id: dbPurchaseId },
        data: {
          successFeePaymentStatus: status,
        },
      });

      await prisma.auditLog.create({
        data: {
          actorUserId: dbAdminId,
          action: `SUCCESS_FEE_PAYMENT_${status}`,
          targetType: 'PackagePurchase',
          targetId: dbPurchaseId,
          metadata: '',
        },
      });

      return updated;
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
  const purchase = globalStore.inMemoryPurchases?.find((p) => p.id === purchaseId);
  if (purchase) {
    purchase.successFeePaymentStatus = status;
    purchase.updatedAt = new Date();

    globalStore.inMemoryLogs?.unshift({
      id: `log-${Date.now()}`,
      actorUserId: adminId,
      action: `SUCCESS_FEE_PAYMENT_${status}`,
      targetType: 'PackagePurchase',
      targetId: purchaseId,
      metadata: '',
      createdAt: new Date(),
    });
  }
  return purchase || null;
}

export async function seedMasterDataIfEmpty() {
  const isDb = await testDbConnection();
  if (isDb) {
    try {
      const mCount = await prisma.maslakOption.count();
      if (mCount === 0) {
        await prisma.maslakOption.createMany({
          data: DEFAULT_MASLAKS.map(m => ({ label: m.label, aliases: m.aliases, isDisabled: false }))
        });
        console.log('Seeded Maslak options to DB.');
      }
      const cCount = await prisma.casteOption.count();
      if (cCount === 0) {
        await prisma.casteOption.createMany({
          data: DEFAULT_CASTES.map(c => ({ label: c.label, aliases: c.aliases, isDisabled: false }))
        });
        console.log('Seeded Caste options to DB.');
      }
      const lCount = await prisma.locationOption.count();
      if (lCount === 0) {
        await prisma.locationOption.createMany({
          data: DEFAULT_LOCATIONS.map(l => ({
            state: l.state,
            district: l.district,
            locality: l.locality || null,
            isHighPriority: l.isHighPriority || false,
            isDisabled: false
          }))
        });
        console.log('Seeded Location options to DB.');
      }
    } catch (e) {
      console.error('Failed to seed empty master data options in DB:', e);
    }
  }
}

export async function getMasterDataOptions() {
  const isDb = await testDbConnection();
  if (isDb) {
    try {
      await seedMasterDataIfEmpty();
      const maslaks = await prisma.maslakOption.findMany();
      const castes = await prisma.casteOption.findMany();
      const locations = await prisma.locationOption.findMany();
      return { maslaks, castes, locations };
    } catch (e) {
      console.error('Error fetching master data from DB, using fallback', e);
    }
  }
  initFallbackOptions();
  return {
    maslaks: MOCK_MASLAK_OPTIONS,
    castes: MOCK_CASTE_OPTIONS,
    locations: MOCK_LOCATION_OPTIONS
  };
}

export async function addMaslakOption(label: string, aliases: string[]) {
  const isDb = await testDbConnection();
  if (isDb) {
    return await prisma.maslakOption.create({
      data: { label, aliases, isDisabled: false }
    });
  }
  initFallbackOptions();
  const newOpt = { id: `maslak-${Date.now()}`, label, aliases, isDisabled: false };
  MOCK_MASLAK_OPTIONS.push(newOpt);
  return newOpt;
}

export async function editMaslakOption(id: string, label: string, aliases: string[]) {
  const isDb = await testDbConnection();
  if (isDb) {
    return await prisma.maslakOption.update({
      where: { id: getValidObjectId(id) },
      data: { label, aliases }
    });
  }
  initFallbackOptions();
  const opt = MOCK_MASLAK_OPTIONS.find(o => o.id === id);
  if (opt) {
    opt.label = label;
    opt.aliases = aliases;
  }
  return opt;
}

export async function toggleDisableMaslakOption(id: string, isDisabled: boolean) {
  const isDb = await testDbConnection();
  if (isDb) {
    return await prisma.maslakOption.update({
      where: { id: getValidObjectId(id) },
      data: { isDisabled }
    });
  }
  initFallbackOptions();
  const opt = MOCK_MASLAK_OPTIONS.find(o => o.id === id);
  if (opt) {
    opt.isDisabled = isDisabled;
  }
  return opt;
}

export async function addCasteOption(label: string, aliases: string[]) {
  const isDb = await testDbConnection();
  if (isDb) {
    return await prisma.casteOption.create({
      data: { label, aliases, isDisabled: false }
    });
  }
  initFallbackOptions();
  const newOpt = { id: `caste-${Date.now()}`, label, aliases, isDisabled: false };
  MOCK_CASTE_OPTIONS.push(newOpt);
  return newOpt;
}

export async function editCasteOption(id: string, label: string, aliases: string[]) {
  const isDb = await testDbConnection();
  if (isDb) {
    return await prisma.casteOption.update({
      where: { id: getValidObjectId(id) },
      data: { label, aliases }
    });
  }
  initFallbackOptions();
  const opt = MOCK_CASTE_OPTIONS.find(o => o.id === id);
  if (opt) {
    opt.label = label;
    opt.aliases = aliases;
  }
  return opt;
}

export async function toggleDisableCasteOption(id: string, isDisabled: boolean) {
  const isDb = await testDbConnection();
  if (isDb) {
    return await prisma.casteOption.update({
      where: { id: getValidObjectId(id) },
      data: { isDisabled }
    });
  }
  initFallbackOptions();
  const opt = MOCK_CASTE_OPTIONS.find(o => o.id === id);
  if (opt) {
    opt.isDisabled = isDisabled;
  }
  return opt;
}

export async function addLocationOption(state: string, district: string, locality: string | null, isHighPriority: boolean) {
  const isDb = await testDbConnection();
  if (isDb) {
    return await prisma.locationOption.create({
      data: { state, district, locality: locality || null, isHighPriority, isDisabled: false }
    });
  }
  initFallbackOptions();
  const newOpt = { id: `loc-${Date.now()}`, state, district, locality, isHighPriority, isDisabled: false };
  MOCK_LOCATION_OPTIONS.push(newOpt);
  return newOpt;
}

export async function toggleLocationPriority(id: string, isHighPriority: boolean) {
  const isDb = await testDbConnection();
  if (isDb) {
    return await prisma.locationOption.update({
      where: { id: getValidObjectId(id) },
      data: { isHighPriority }
    });
  }
  initFallbackOptions();
  const opt = MOCK_LOCATION_OPTIONS.find(o => o.id === id);
  if (opt) {
    opt.isHighPriority = isHighPriority;
  }
  return opt;
}

export async function toggleDisableLocationOption(id: string, isDisabled: boolean) {
  const isDb = await testDbConnection();
  if (isDb) {
    return await prisma.locationOption.update({
      where: { id: getValidObjectId(id) },
      data: { isDisabled }
    });
  }
  initFallbackOptions();
  const opt = MOCK_LOCATION_OPTIONS.find(o => o.id === id);
  if (opt) {
    opt.isDisabled = isDisabled;
  }
  return opt;
}

export async function mergeCastes(sourceLabel: string, targetLabel: string) {
  const isDb = await testDbConnection();
  if (isDb) {
    await prisma.matrimonialProfile.updateMany({
      where: { biradari: sourceLabel },
      data: { biradari: targetLabel }
    });
    
    const targetOpt = await prisma.casteOption.findFirst({
      where: { label: targetLabel }
    });
    if (targetOpt) {
      const updatedAliases = Array.from(new Set([...targetOpt.aliases, sourceLabel]));
      await prisma.casteOption.update({
        where: { id: targetOpt.id },
        data: { aliases: updatedAliases }
      });
    }

    await prisma.casteOption.updateMany({
      where: { label: sourceLabel },
      data: { isDisabled: true }
    });
    
    return true;
  }

  initFallbackOptions();
  if (globalStore.inMemoryProfiles) {
    globalStore.inMemoryProfiles.forEach(p => {
      if (p.biradari === sourceLabel) {
        p.biradari = targetLabel;
      }
    });
  }

  const targetOpt = MOCK_CASTE_OPTIONS.find(o => o.label === targetLabel);
  if (targetOpt) {
    targetOpt.aliases = Array.from(new Set([...targetOpt.aliases, sourceLabel]));
  }

  const sourceOpt = MOCK_CASTE_OPTIONS.find(o => o.label === sourceLabel);
  if (sourceOpt) {
    sourceOpt.isDisabled = true;
  }

  return true;
}

export async function mergeLocations(sourceId: string, targetId: string) {
  const isDb = await testDbConnection();
  if (isDb) {
    const source = await prisma.locationOption.findUnique({ where: { id: getValidObjectId(sourceId) } });
    const target = await prisma.locationOption.findUnique({ where: { id: getValidObjectId(targetId) } });
    if (!source || !target) return false;

    await prisma.matrimonialProfile.updateMany({
      where: {
        state: source.state,
        district: source.district,
        locality: source.locality
      },
      data: {
        state: target.state,
        district: target.district,
        locality: target.locality,
        city: target.district,
        areaOrLocality: target.locality || target.district
      }
    });

    await prisma.locationOption.update({
      where: { id: source.id },
      data: { isDisabled: true }
    });

    return true;
  }

  initFallbackOptions();
  const source = MOCK_LOCATION_OPTIONS.find(o => o.id === sourceId);
  const target = MOCK_LOCATION_OPTIONS.find(o => o.id === targetId);
  if (!source || !target) return false;

  if (globalStore.inMemoryProfiles) {
    globalStore.inMemoryProfiles.forEach(p => {
      if (p.state === source.state && p.district === source.district && p.locality === source.locality) {
        p.state = target.state;
        p.district = target.district;
        p.locality = target.locality;
        p.city = target.district;
        p.areaOrLocality = target.locality || target.district;
      }
    });
  }

  source.isDisabled = true;
  return true;
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
  const profile = globalStore.inMemoryProfiles?.find((p) => p.userId === userId);
  if (profile) {
    (profile as any).profileImageUrl = imageUrl;
    (profile as any).profileImagePublicId = publicId;
    (profile as any).profileImageStatus = 'PENDING';
    (profile as any).uploadedAt = new Date();
  }
  return profile || null;
}

export async function createLead(data: {
  fullName: string;
  phone: string;
  email?: string | null;
  city: string;
  message?: string | null;
  inquiryType: string;
  interestedPackage?: string | null;
  interestedProfileId?: string | null;
  sourcePage?: string | null;
}) {
  const isDb = await testDbConnection();
  if (isDb) {
    try {
      return await prisma.lead.create({
        data: {
          fullName: data.fullName,
          phone: data.phone,
          email: data.email || null,
          city: data.city,
          message: data.message || null,
          inquiryType: data.inquiryType,
          interestedPackage: data.interestedPackage || null,
          interestedProfileId: data.interestedProfileId || null,
          sourcePage: data.sourcePage || null,
          status: "new",
          priority: "normal",
          adminNotes: ""
        }
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
  const newLead = {
    id: `lead_${Date.now()}`,
    fullName: data.fullName,
    phone: data.phone,
    email: data.email || null,
    city: data.city,
    message: data.message || null,
    inquiryType: data.inquiryType,
    interestedPackage: data.interestedPackage || null,
    interestedProfileId: data.interestedProfileId || null,
    sourcePage: data.sourcePage || null,
    status: "new",
    priority: "normal",
    adminNotes: "",
    createdAt: new Date(),
    updatedAt: new Date()
  };
  globalStore.inMemoryLeads?.unshift(newLead);
  return newLead;
}

export async function getAllLeads() {
  const isDb = await testDbConnection();
  if (isDb) {
    try {
      return await prisma.lead.findMany({
        orderBy: { createdAt: 'desc' }
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

  return globalStore.inMemoryLeads || [];
}

export async function updateLead(id: string, data: {
  status?: string;
  priority?: string;
  adminNotes?: string | null;
}) {
  const isDb = await testDbConnection();
  if (isDb) {
    try {
      const dbId = getValidObjectId(id);
      return await prisma.lead.update({
        where: { id: dbId },
        data
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
  const lead = globalStore.inMemoryLeads?.find((l) => l.id === id);
  if (lead) {
    if (data.status !== undefined) lead.status = data.status;
    if (data.priority !== undefined) lead.priority = data.priority;
    if (data.adminNotes !== undefined) lead.adminNotes = data.adminNotes;
    lead.updatedAt = new Date();
  }
  return lead || null;
}

export async function deleteLead(id: string) {
  const isDb = await testDbConnection();
  if (isDb) {
    try {
      const dbId = getValidObjectId(id);
      await prisma.lead.delete({
        where: { id: dbId }
      });
      return true;
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
  const index = globalStore.inMemoryLeads?.findIndex((l) => l.id === id) ?? -1;
  if (index > -1 && globalStore.inMemoryLeads) {
    globalStore.inMemoryLeads.splice(index, 1);
    return true;
  }
  return false;
}



