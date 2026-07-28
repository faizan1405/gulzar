/**
 * Backwards-compatible barrel re-export for the split profileStore modules.
 *
 * Historical layout: a single 1867-line file containing utilities, fallback
 * state, profile CRUD, verification, package purchases, leads, curated leads,
 * and master data. That monolithic module has been split into focused domain
 * modules so each can be reasoned about and maintained independently:
 *
 *   • fallbackStore.ts    — in-memory state, DB connection check, sanitizers
 *   • profileQueries.ts   — MatrimonialProfile CRUD
 *   • verificationStore.ts — VerificationRequest + AuditLog
 *   • packageStore.ts     — PackagePurchase lifecycle, eligibility, marriage
 *   • curatedLeads.ts     — CuratedLeadAssignment
 *   • masterDataStore.ts  — MaslakOption / CasteOption / LocationOption + merge
 *   • leadStore.ts        — Lead CRUD
 *
 * Existing call sites continue to import from '@/lib/profileStore'. Each
 * export below points at the new home of the function. New code should
 * prefer importing directly from the domain module to make dependencies
 * explicit.
 */

export {
  // Shared helpers from fallbackStore
  sanitizeErrorMessage,
  logFallbackWarning,
  getFallbackStats,
  isFallbackAllowed,
  testDbConnection,
  getValidObjectId,
} from './fallbackStore';

export {
  // Profile CRUD
  getProfileById,
  getProfileByUserId,
  getEmptyProfiles,
  getAllProfiles,
  upsertProfile,
  markUserAsPaid,
  updateProfileImage,
} from './profileQueries';

export {
  // Verification + audit
  getVerificationRequests,
  updateVerificationStatus,
  getAuditLogs,
} from './verificationStore';

export {
  // Package purchases, eligibility, marriage
  createPackagePurchase,
  verifyPackagePurchase,
  activatePackageByAdmin,
  submitUserPaymentClaim,
  rejectPaymentClaim,
  getUserPurchases,
  getAllPurchases,
  updateHighProfileEligibility,
  confirmMarriage,
  updateSuccessFeeStatus,
} from './packageStore';

export {
  // Curated leads
  assignCuratedLead,
  getCuratedAssignments,
  updateCuratedLeadStatus,
} from './curatedLeads';

export {
  // Master data
  seedMasterDataIfEmpty,
  getMasterDataOptions,
  addMaslakOption,
  editMaslakOption,
  toggleDisableMaslakOption,
  addCasteOption,
  editCasteOption,
  toggleDisableCasteOption,
  addLocationOption,
  toggleLocationPriority,
  toggleDisableLocationOption,
  mergeCastes,
  mergeLocations,
} from './masterDataStore';

export {
  // Lead management
  createLead,
  getAllLeads,
  updateLead,
  deleteLead,
} from './leadStore';