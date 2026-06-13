import { prisma } from './db';
import { VerificationStatus, ProfileCompletionStatus, PackageType, PaymentStatus, ApprovalStatus } from '@prisma/client';
import crypto from 'crypto';

// In-Memory Fallback State (if database is offline/unconfigured)
const MOCK_PROFILES_DB: Array<{
  id: string;
  userId: string;
  fullName: string;
  gender: string;
  dateOfBirth: Date;
  maritalStatus: string;
  phoneNumber: string;
  city: string;
  areaOrLocality: string;
  state: string;
  country: string;
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
}> = [
  {
    id: '60d5ecb86f67a213e4b7b261',
    userId: '60d5ecb86f67a213e4b7b251',
    fullName: 'Dr. Sarah Khan',
    gender: 'Female',
    dateOfBirth: new Date(1999, 4, 12),
    maritalStatus: 'Single',
    phoneNumber: '+91-98765-43210',
    city: 'Mumbai',
    areaOrLocality: 'Bandra',
    state: 'Maharashtra',
    country: 'India',
    latitude: 19.076,
    longitude: 72.877,
    education: 'MD, MBBS',
    occupation: 'Pediatrician',
    annualIncomeRange: '₹12 LPA - ₹15 LPA',
    familyInfo: 'Father is a retired professor. Mother is a homemaker. 1 younger brother.',
    bio: 'Looking for a compatible partner who values both Islamic principles and professional growth.',
    themeColor: 'hsl(345, 65%, 28%)', // Royal Crimson
    verificationStatus: 'APPROVED' as VerificationStatus,
    profileCompletionStatus: 'COMPLETE' as ProfileCompletionStatus,
    adminApprovalStatus: 'APPROVED',
    hasPaid: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '60d5ecb86f67a213e4b7b262',
    userId: '60d5ecb86f67a213e4b7b252',
    fullName: 'Aisha Rahman',
    gender: 'Female',
    dateOfBirth: new Date(1995, 8, 20),
    maritalStatus: 'Divorced',
    phoneNumber: '+91-87654-32109',
    city: 'Bangalore',
    areaOrLocality: 'Indiranagar',
    state: 'Karnataka',
    country: 'India',
    latitude: 12.971,
    longitude: 77.594,
    education: 'M.Tech',
    occupation: 'Software Engineer',
    annualIncomeRange: '₹18 LPA - ₹22 LPA',
    familyInfo: 'Noble family. 2 sisters, both married.',
    bio: 'Simple and pious, focusing on daily prayers and family values.',
    themeColor: 'hsl(150, 45%, 18%)', // Deep Emerald
    verificationStatus: 'APPROVED' as VerificationStatus,
    profileCompletionStatus: 'COMPLETE' as ProfileCompletionStatus,
    adminApprovalStatus: 'APPROVED',
    hasPaid: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '60d5ecb86f67a213e4b7b263',
    userId: '60d5ecb86f67a213e4b7b253',
    fullName: 'Adnan Siddiqui',
    gender: 'Male',
    dateOfBirth: new Date(1997, 2, 5),
    maritalStatus: 'Single',
    phoneNumber: '+91-76543-21098',
    city: 'Delhi',
    areaOrLocality: 'Karol Bagh',
    state: 'Delhi',
    country: 'India',
    latitude: 28.613,
    longitude: 77.209,
    education: 'MBA',
    occupation: 'Business Owner (Exports)',
    annualIncomeRange: '₹25 LPA - ₹30 LPA',
    familyInfo: 'Well established business family in Delhi.',
    bio: 'Ambitious, family-oriented, loves travelling and studying history.',
    themeColor: 'hsl(42, 58%, 53%)', // Gold Accent
    verificationStatus: 'APPROVED' as VerificationStatus,
    profileCompletionStatus: 'COMPLETE' as ProfileCompletionStatus,
    adminApprovalStatus: 'APPROVED',
    hasPaid: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];


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
  isDbConnected: boolean | undefined;
};

if (!globalStore.inMemoryProfiles) globalStore.inMemoryProfiles = [...MOCK_PROFILES_DB];
if (!globalStore.inMemoryRequests) globalStore.inMemoryRequests = [...MOCK_VERIFICATION_REQUESTS];
if (!globalStore.inMemoryLogs) globalStore.inMemoryLogs = [...MOCK_AUDIT_LOGS];
if (!globalStore.inMemoryPurchases) globalStore.inMemoryPurchases = [...MOCK_PURCHASES];
if (!globalStore.inMemoryCuratedLeads) globalStore.inMemoryCuratedLeads = [...MOCK_CURATED_LEADS];

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

export async function getAllProfiles() {
  const isDb = await testDbConnection();
  if (isDb) {
    try {
      return await prisma.matrimonialProfile.findMany({
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
    city: string;
    areaOrLocality: string;
    state: string;
    country: string;
    education: string;
    occupation: string;
    annualIncomeRange: string;
    familyInfo: string;
    bio: string;
    themeColor?: string;
    latitude?: number;
    longitude?: number;
  }
) {
  const isDb = await testDbConnection();
  if (isDb) {
    try {
      const dbUserId = getValidObjectId(userId);
      return await prisma.matrimonialProfile.upsert({
        where: { userId: dbUserId },
        update: {
          ...data,
          profileCompletionStatus: 'COMPLETE' as ProfileCompletionStatus,
        },
        create: {
          ...data,
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
    city: data.city,
    areaOrLocality: data.areaOrLocality,
    state: data.state,
    country: data.country,
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
    eligibilityStatus: data.packageType === 'HIGH_PROFILE' ? ('PENDING' as ApprovalStatus) : ('APPROVED' as ApprovalStatus),
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
  const expiryDate = new Date();
  expiryDate.setMonth(expiryDate.getMonth() + 1); // 1 month from now

  if (isDb) {
    try {
      const purchase = await prisma.packagePurchase.findFirst({
        where: { razorpayOrderId: orderId },
      });

      if (!purchase) return null;

      const updatedPurchase = await prisma.packagePurchase.update({
        where: { id: purchase.id },
        data: {
          paymentStatus: 'PAID' as PaymentStatus,
          razorpayPaymentId: paymentId,
          expiryDate: purchase.packageType === 'STANDARD' ? expiryDate : null,
        },
      });

      if (purchase.packageType === 'STANDARD') {
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
    purchase.paymentStatus = 'PAID' as PaymentStatus;
    purchase.razorpayPaymentId = paymentId;
    purchase.expiryDate = purchase.packageType === 'STANDARD' ? expiryDate : null;
    purchase.updatedAt = new Date();

    if (purchase.packageType === 'STANDARD') {
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
          profile: true,
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
