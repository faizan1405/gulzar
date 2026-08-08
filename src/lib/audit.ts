import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { getValidObjectId } from '@/lib/profileStore';

/**
 * Log an audit event to the AuditLog table.
 * Best-effort: failures are swallowed so audit failures never break the main flow.
 *
 * NOTE: Currently a no-op for development ease. The signature is preserved
 *       so all existing call sites continue to work without modification.
 *       Re-enable the DB write below when audit logging is needed.
 */
export async function logAudit(params: {
  actorUserId: string | null;
  action: string;
  targetType: string;
  targetId: string;
  metadata?: string | null;
}): Promise<void> {
  // No-op for development — all audit logging disabled
  return;

  // --- Original implementation (re-enable when needed) ---
  // const auditData: Record<string, unknown> = {
  //   action: params.action,
  //   targetType: params.targetType,
  //   targetId: getValidObjectId(params.targetId),
  //   metadata: params.metadata || null,
  // };
  // if (params.actorUserId != null) {
  //   auditData.actorUserId = getValidObjectId(params.actorUserId);
  // }
  // try {
  //   await prisma.auditLog.create({
  //     data: auditData as Prisma.AuditLogUncheckedCreateInput,
  //   });
  // } catch (err) {
  //   console.error('[AUDIT LOG FAILED]', params.action, err);
  // }
}