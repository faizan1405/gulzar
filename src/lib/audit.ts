import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { getValidObjectId } from '@/lib/profileStore';

/**
 * Log an audit event to the AuditLog table.
 * Best-effort: failures are swallowed so audit failures never break the main flow.
 */
export async function logAudit(params: {
  actorUserId: string | null;
  action: string;
  targetType: string;
  targetId: string;
  metadata?: string | null;
}): Promise<void> {
  const auditData: Record<string, unknown> = {
    action: params.action,
    targetType: params.targetType,
    targetId: getValidObjectId(params.targetId),
    metadata: params.metadata || null,
  };
  if (params.actorUserId != null) {
    auditData.actorUserId = getValidObjectId(params.actorUserId);
  }
  try {
    await prisma.auditLog.create({
      data: auditData as Prisma.AuditLogUncheckedCreateInput,
    });
  } catch (err) {
    console.error('[AUDIT LOG FAILED]', params.action, err);
  }
}
