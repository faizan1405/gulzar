import { prisma } from './db';
import { PackageType, PaymentStatus, ApprovalStatus } from '@prisma/client';
import {
  testDbConnection,
  getValidObjectId,
  sanitizeErrorMessage,
  isFallbackAllowed,
  inMemoryPurchases,
  inMemoryProfiles,
  inMemoryLogs,
} from './fallbackStore';

/* ------------------------------------------------------------------ */
/*  Package Purchase Lifecycle                                         */
/* ------------------------------------------------------------------ */

export async function createPackagePurchase(data: {
  profileId: string;
  packageType: PackageType;
  basePrice: number;
  gstRate: number;
  totalAmount: number;
  billingType: string;
  successFeeAmount: number;
  paymentReferenceId?: string;
}) {
  const isDb = await testDbConnection();
  const dbProfileId = getValidObjectId(data.profileId);
  const purchaseData = {
    profileId: dbProfileId,
    packageType: data.packageType,
    basePrice: data.basePrice,
    gstRate: data.gstRate,
    totalAmount: data.totalAmount,
    billingType: data.billingType,
    successFeeAmount: data.successFeeAmount,
    paymentReferenceId: data.paymentReferenceId || `REF_${Date.now()}`,
    userSubmittedTxnId: null as string | null,
    upiTransactionId: null as string | null,
    paymentMode: 'UPI' as const,
    paymentStatus: 'PENDING' as PaymentStatus,
    accessStatus: 'ACTIVE',
    eligibilityStatus: data.packageType === 'high_profile_package' ? ('PENDING' as ApprovalStatus) : ('APPROVED' as ApprovalStatus),
    marriageConfirmation: 'PENDING',
    successFeePaymentStatus: 'PENDING' as PaymentStatus,
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
  inMemoryPurchases?.push(newPurchase);
  return newPurchase;
}

export async function activatePackageByAdmin(
  referenceId: string,
  upiTransactionId: string | null
) {
  const isDb = await testDbConnection();
  const monthlyExpiry = new Date();
  monthlyExpiry.setMonth(monthlyExpiry.getMonth() + 1);
  const yearlyExpiry = new Date();
  yearlyExpiry.setFullYear(yearlyExpiry.getFullYear() + 1);

  function getExpiryForPackage(packageType: string): Date {
    return packageType === 'monthly_membership' ? monthlyExpiry : yearlyExpiry;
  }

  if (isDb) {
    try {
      const purchase = await prisma.packagePurchase.findFirst({
        where: { paymentReferenceId: referenceId },
      });

      if (!purchase) return null;

      // Idempotent: already verified
      if (purchase.paymentStatus === 'PAID') return purchase;

      const updatedPurchase = await prisma.packagePurchase.update({
        where: { id: purchase.id },
        data: {
          paymentStatus: 'PAID' as PaymentStatus,
          upiTransactionId: upiTransactionId,
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
          actorUserId: null,
          action: `PAYMENT_VERIFIED_${purchase.packageType}`,
          targetType: 'PackagePurchase',
          targetId: purchase.id,
          metadata: JSON.stringify({ referenceId, upiTransactionId }),
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
  const purchase = inMemoryPurchases?.find((p) => p.paymentReferenceId === referenceId);
  if (purchase) {
    if (purchase.paymentStatus === 'PAID') return purchase; // idempotent
    purchase.paymentStatus = 'PAID' as PaymentStatus;
    purchase.upiTransactionId = upiTransactionId;
    purchase.expiryDate = getExpiryForPackage(purchase.packageType);
    purchase.updatedAt = new Date();

    if (purchase.packageType === 'monthly_membership') {
      const profile = inMemoryProfiles?.find((p) => p.id === purchase.profileId);
      if (profile) {
        profile.hasPaid = true;
      }
    }

    inMemoryLogs?.unshift({
      id: `log-${Date.now()}`,
      actorUserId: 'system',
      action: `PAYMENT_VERIFIED_${purchase.packageType}`,
      targetType: 'PackagePurchase',
      targetId: purchase.id,
      metadata: JSON.stringify({ referenceId, upiTransactionId }),
      createdAt: new Date(),
    });
  }
  return purchase || null;
}

/**
 * Backwards-compatible alias used by older callers.
 * New code should call `activatePackageByAdmin` directly.
 */
export function verifyPackagePurchase(orderId: string, paymentId: string) {
  return activatePackageByAdmin(orderId, paymentId);
}

/**
 * User claims they have paid — saves their submitted UPI txn id and notifies admin.
 * Does NOT mark the purchase as PAID. Admin must confirm.
 */
export async function submitUserPaymentClaim(
  purchaseId: string,
  userSubmittedTxnId: string | null,
  submittedPhone: string | null,
  submittedName: string | null
) {
  const isDb = await testDbConnection();
  const updatedNotes = `User claimed paid at ${new Date().toISOString()}` +
    (userSubmittedTxnId ? ` | Txn ID: ${userSubmittedTxnId}` : '') +
    (submittedName ? ` | Name: ${submittedName}` : '') +
    (submittedPhone ? ` | Phone: ${submittedPhone}` : '');

  if (isDb) {
    try {
      // Try direct id lookup first (frontend sends the MongoDB _id).
      const byId = getValidObjectId(purchaseId);
      let purchase = byId
        ? await prisma.packagePurchase.findUnique({ where: { id: byId } })
        : null;

      // Fallback to paymentReferenceId if direct id lookup fails.
      if (!purchase) {
        purchase = await prisma.packagePurchase.findFirst({
          where: { paymentReferenceId: purchaseId },
        });
      }

      if (!purchase) return null;

      const updatedPurchase = await prisma.packagePurchase.update({
        where: { id: purchase.id },
        data: {
          userSubmittedTxnId: userSubmittedTxnId,
          internalNotes: updatedNotes,
        },
      });

      await prisma.auditLog.create({
        data: {
          actorUserId: null,
          action: `PAYMENT_CLAIM_SUBMITTED_${purchase.packageType}`,
          targetType: 'PackagePurchase',
          targetId: purchase.id,
          metadata: JSON.stringify({ purchaseId, userSubmittedTxnId }),
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
  const purchase = inMemoryPurchases?.find((p) => p.id === purchaseId || p.paymentReferenceId === purchaseId);
  if (purchase) {
    purchase.userSubmittedTxnId = userSubmittedTxnId;
    purchase.internalNotes = updatedNotes;
    purchase.updatedAt = new Date();

    inMemoryLogs?.unshift({
      id: `log-${Date.now()}`,
      actorUserId: 'system',
      action: `PAYMENT_CLAIM_SUBMITTED_${purchase.packageType}`,
      targetType: 'PackagePurchase',
      targetId: purchase.id,
      metadata: JSON.stringify({ purchaseId, userSubmittedTxnId }),
      createdAt: new Date(),
    });
  }
  return purchase || null;
}

/**
 * Admin rejects a payment claim — marks status as FAILED.
 */
export async function rejectPaymentClaim(referenceId: string, adminNotes: string, adminId: string) {
  const isDb = await testDbConnection();

  if (isDb) {
    try {
      const purchase = await prisma.packagePurchase.findFirst({
        where: { paymentReferenceId: referenceId },
      });
      if (!purchase) return null;

      const updatedPurchase = await prisma.packagePurchase.update({
        where: { id: purchase.id },
        data: {
          paymentStatus: 'FAILED' as PaymentStatus,
          internalNotes: `${purchase.internalNotes || ''}\n[REJECTED by admin ${adminId}]: ${adminNotes}`,
        },
      });

      await prisma.auditLog.create({
        data: {
          actorUserId: getValidObjectId(adminId),
          action: `PAYMENT_REJECTED_${purchase.packageType}`,
          targetType: 'PackagePurchase',
          targetId: purchase.id,
          metadata: JSON.stringify({ referenceId, adminNotes }),
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
  const purchase = inMemoryPurchases?.find((p) => p.paymentReferenceId === referenceId);
  if (purchase) {
    purchase.paymentStatus = 'FAILED' as PaymentStatus;
    purchase.internalNotes = `${purchase.internalNotes || ''}\n[REJECTED by admin ${adminId}]: ${adminNotes}`;
    purchase.updatedAt = new Date();

    inMemoryLogs?.unshift({
      id: `log-${Date.now()}`,
      actorUserId: adminId,
      action: `PAYMENT_REJECTED_${purchase.packageType}`,
      targetType: 'PackagePurchase',
      targetId: purchase.id,
      metadata: JSON.stringify({ referenceId, adminNotes }),
      createdAt: new Date(),
    });
  }
  return purchase || null;
}

/* ------------------------------------------------------------------ */
/*  Purchase Queries                                                   */
/* ------------------------------------------------------------------ */

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
  return inMemoryPurchases?.filter((p) => p.profileId === profileId) || [];
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

  return (inMemoryPurchases || []).map((p) => ({
    ...p,
    profile: inMemoryProfiles?.find((prof) => prof.id === p.profileId) || null,
  }));
}

/* ------------------------------------------------------------------ */
/*  Eligibility & Marriage Confirmation                                 */
/* ------------------------------------------------------------------ */

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
  const purchase = inMemoryPurchases?.find((p) => p.id === purchaseId);
  if (purchase) {
    purchase.eligibilityStatus = status;
    purchase.internalNotes = notes;
    purchase.updatedAt = new Date();

    inMemoryLogs?.unshift({
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
  const purchase = inMemoryPurchases?.find((p) => p.id === purchaseId);
  if (purchase) {
    purchase.marriageConfirmation = statusStr;
    purchase.updatedAt = new Date();

    inMemoryLogs?.unshift({
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
  const purchase = inMemoryPurchases?.find((p) => p.id === purchaseId);
  if (purchase) {
    purchase.successFeePaymentStatus = status;
    purchase.updatedAt = new Date();

    inMemoryLogs?.unshift({
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