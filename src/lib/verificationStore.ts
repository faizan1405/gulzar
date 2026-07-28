import { prisma } from './db';
import { VerificationStatus } from '@prisma/client';
import {
  testDbConnection,
  getValidObjectId,
  sanitizeErrorMessage,
  isFallbackAllowed,
  logFallbackWarning,
  inMemoryRequests,
  inMemoryProfiles,
  inMemoryLogs,
} from './fallbackStore';

/* ------------------------------------------------------------------ */
/*  Verification & Audit Logs                                          */
/* ------------------------------------------------------------------ */

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
  return (inMemoryRequests || []).map((req) => ({
    ...req,
    profile: inMemoryProfiles?.find((p) => p.id === req.profileId) || null,
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
  if (inMemoryProfiles) {
    const profile = inMemoryProfiles.find((p) => p.id === profileId);
    if (profile) {
      profile.verificationStatus = status;
      profile.adminApprovalStatus = status;
    }
  }

  const reqIndex = inMemoryRequests?.findIndex((r) => r.profileId === profileId) ?? -1;
  if (reqIndex > -1 && inMemoryRequests) {
    inMemoryRequests[reqIndex].status = status;
    inMemoryRequests[reqIndex].notes = notes;
    inMemoryRequests[reqIndex].assignedAdminId = adminId;
    inMemoryRequests[reqIndex].verifiedAt = status === 'APPROVED' ? new Date() : null;
    inMemoryRequests[reqIndex].updatedAt = new Date();
  } else {
    inMemoryRequests?.unshift({
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
  inMemoryLogs?.unshift({
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
  return inMemoryLogs || [];
}

/** Helper used by profileQueries fallback path to create a verification request in-memory */
export function createVerificationRequestFallback(profileId: string) {
  inMemoryRequests?.unshift({
    id: `vr-${Date.now()}`,
    profileId,
    status: 'PENDING',
    assignedAdminId: null,
    notes: '',
    verifiedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}