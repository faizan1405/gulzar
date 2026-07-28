import { prisma } from './db';
import crypto from 'crypto';
import { DEFAULT_MASLAKS, DEFAULT_FIQHS, DEFAULT_CASTES, DEFAULT_LOCATIONS } from './masterData';

// ------------------------------------------------------------------ //
//  Fallback Master Data Lists (exported so other modules can use them)
// ------------------------------------------------------------------ //

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

// ------------------------------------------------------------------ //
//  In-Memory Fallback State
// ------------------------------------------------------------------ //

interface ProfileRecord {
  id: string; userId: string; fullName: string; gender: string;
  dateOfBirth: Date; maritalStatus: string; phoneNumber: string;
  city: string | null; areaOrLocality: string | null; state: string | null;
  country: string | null; latitude: number | null; longitude: number | null;
  education: string; occupation: string; annualIncomeRange: string;
  familyInfo: string; bio: string; themeColor: string;
  verificationStatus: string; profileCompletionStatus: string;
  adminApprovalStatus: string; hasPaid: boolean;
  createdAt: Date; updatedAt: Date;
  maslak: string | null; fiqh: string | null; biradari: string | null;
  biradariAliases: string[]; district: string | null; locality: string | null;
  preferredLocations: string[]; sameCastePreference: boolean;
  sameMaslakPreference: boolean; noCastePreference: boolean;
  noMaslakPreference: boolean; willingToRelocate: boolean;
  category?: string | null;
  profileImageUrl?: string | null;
  profileImagePublicId?: string | null;
  profileImageStatus?: string;
  uploadedAt?: Date | null;
}
interface VerificationRecord {
  id: string; profileId: string; status: string;
  assignedAdminId: string | null; notes: string | null;
  verifiedAt: Date | null; createdAt: Date; updatedAt: Date;
}
interface AuditRecord {
  id: string; actorUserId: string | null; action: string;
  targetType: string; targetId: string | null;
  metadata: string; createdAt: Date;
}
interface PurchaseRecord {
  id: string; profileId: string; packageType: string;
  basePrice: number; gstRate: number; totalAmount: number;
  billingType: string; successFeeAmount: number;
  paymentReferenceId: string | null; userSubmittedTxnId: string | null;
  upiTransactionId: string | null; paymentMode: string;
  paymentStatus: string; purchaseDate: Date; expiryDate: Date | null;
  accessStatus: string; eligibilityStatus: string;
  marriageConfirmation: string; successFeePaymentStatus: string;
  internalNotes: string | null; createdAt: Date; updatedAt: Date;
}
interface CuratedLeadRecord {
  id: string; buyerProfileId: string; leadProfileId: string;
  status: string; assignedAt: Date; updatedAt: Date;
}
interface LeadRecord {
  id: string; fullName: string; phone: string; email: string | null;
  city: string; message: string | null; inquiryType: string;
  interestedPackage: string | null; interestedProfileId: string | null;
  sourcePage: string | null; status: string; priority: string;
  adminNotes: string; createdAt: Date; updatedAt: Date;
}

const MOCK_PROFILES_DB: ProfileRecord[] = [];
export let inMemoryProfiles: ProfileRecord[] = [];
export let inMemoryRequests: VerificationRecord[] = [];
export let inMemoryLogs: AuditRecord[] = [];
export let inMemoryPurchases: PurchaseRecord[] = [];
export let inMemoryCuratedLeads: CuratedLeadRecord[] = [];
export const inMemoryLeads: LeadRecord[] = [];

// Seed data
const MOCK_AUDIT_LOGS: AuditRecord[] = [];
const MOCK_VERIFICATION_REQUESTS: VerificationRecord[] = [
  {
    id: '60d5ecb86f67a213e4b7b271',
    profileId: '60d5ecb86f67a213e4b7b261',
    status: 'APPROVED',
    assignedAdminId: '60d5ecb86f67a213e4b7b281',
    notes: 'Called user. Verified documents and family background.',
    verifiedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];
const MOCK_PURCHASES: PurchaseRecord[] = [];
const MOCK_CURATED_LEADS: CuratedLeadRecord[] = [];

// Initialize in-memory fallbacks on first load
if (MOCK_PROFILES_DB.length > 0) inMemoryProfiles = [...MOCK_PROFILES_DB];
if (MOCK_VERIFICATION_REQUESTS.length > 0) inMemoryRequests = [...MOCK_VERIFICATION_REQUESTS];
if (MOCK_AUDIT_LOGS.length > 0) inMemoryLogs = [...MOCK_AUDIT_LOGS];
if (MOCK_PURCHASES.length > 0) inMemoryPurchases = [...MOCK_PURCHASES];
if (MOCK_CURATED_LEADS.length > 0) inMemoryCuratedLeads = [...MOCK_CURATED_LEADS];
inMemoryLeads.push(
  {
    id: "lead_mock_1",
    fullName: "Test User One",
    phone: "+00 00000 00001",
    email: "test1@example.invalid",
    city: "Test City",
    message: "Test inquiry for mock data.",
    inquiryType: "Package Inquiry",
    interestedPackage: "Test Package",
    interestedProfileId: null,
    sourcePage: "/premium",
    status: "new",
    priority: "high",
    adminNotes: "Needs urgent callback.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
  },
  {
    id: "lead_mock_2",
    fullName: "Test User Two",
    phone: "+00 00000 00002",
    email: "test2@example.invalid",
    city: "Pune",
    message: "Request details for verification requirements.",
    inquiryType: "Verification Help",
    interestedPackage: null,
    interestedProfileId: null,
    sourcePage: "/contact",
    status: "contacted",
    priority: "normal",
    adminNotes: "Sent document checklist.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 20),
  }
);

// Startup check: warn if in-memory store has data from a previous session
const fallbackProfileCount = inMemoryProfiles?.length ?? 0;
const fallbackLeadCount = inMemoryLeads?.length ?? 0;
const fallbackPurchaseCount = inMemoryPurchases?.length ?? 0;
const fallbackRequestCount = inMemoryRequests?.length ?? 0;
if (
  fallbackProfileCount > 0 ||
  fallbackLeadCount > 0 ||
  fallbackPurchaseCount > 0 ||
  fallbackRequestCount > 0
) {
  console.warn(
    '[FALLBACK STORE] In-memory data detected from previous session — all records were lost during restart. Database is still unavailable.'
  );
}

// ------------------------------------------------------------------ //
//  Shared Helpers
// ------------------------------------------------------------------ //

let isDbConnected: boolean | undefined;

/** Safely sanitize credentials in connection string from error logs */
export function sanitizeErrorMessage(msg: string): string {
  return msg.replace(/(mongodb\+srv:\/\/|mongodb:\/\/|postgresql:\/\/)[^\s@]+@[^\s/]+/g, '$1***:***@***');
}

/** Log a warning when an operation completes in fallback (in-memory) mode */
export function logFallbackWarning(operation: string): void {
  console.warn(`[FALLBACK MODE] ${operation} completed in-memory only. Data will be lost on restart.`);
}

/** Return counts of each entity in the in-memory fallback store */
export function getFallbackStats(): {
  profileCount: number;
  leadCount: number;
  purchaseCount: number;
  notificationCount: number;
} {
  return {
    profileCount: inMemoryProfiles?.length ?? 0,
    leadCount: inMemoryLeads?.length ?? 0,
    purchaseCount: inMemoryPurchases?.length ?? 0,
    notificationCount: inMemoryLogs?.length ?? 0,
  };
}

/** Verify if fallback mode is allowed (never in production unless explicitly configured) */
export function isFallbackAllowed(): boolean {
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_DB_FALLBACK !== 'true') {
    return false;
  }
  return true;
}

/** Check if MongoDB DB is reachable, caching result */
export async function testDbConnection() {
  if (isDbConnected !== undefined) {
    return isDbConnected;
  }
  try {
    await prisma.user.findFirst({ select: { id: true } });
    isDbConnected = true;
    console.log('MongoDB connection active.');
  } catch (error) {
    isDbConnected = false;
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.warn('Database connection check failed:', sanitizeErrorMessage(errorMsg));
    if (!isFallbackAllowed()) {
      throw new Error(`Database connection failed: ${sanitizeErrorMessage(errorMsg)}`);
    }
  }
  return isDbConnected;
}

/** Deterministically map any string ID to a valid 24-character hex MongoDB ObjectId */
export function getValidObjectId(id: string): string {
  if (/^[0-9a-fA-F]{24}$/.test(id)) {
    return id;
  }
  return crypto.createHash('md5').update(id).digest('hex').substring(0, 24);
}

/** Convert null → undefined for Prisma optional string fields */
export function o<T>(val: T | null): T | undefined {
  return val ?? undefined;
}

// ------------------------------------------------------------------ //
//  Fallback Option Initialization
// ------------------------------------------------------------------ //

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
