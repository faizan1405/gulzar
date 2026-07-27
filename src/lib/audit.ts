import { prisma } from '@/lib/db';
import { getValidObjectId } from '@/lib/profileStore';

/**
 * Log an audit event to the AuditLog table.
 * Best-effort: failures are swallowed so audit failures never break the main flow.
 */
export async function logAudit(params: {
  actorUserId: string;
  action: string;
  targetType: string;
  targetId: string;
  metadata?: string | null;
}): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        actorUserId: getValidObjectId(params.actorUserId),
        action: params.action,
        targetType: params.targetType,
        targetId: getValidObjectId(params.targetId),
        metadata: params.metadata || null,
      },
    });
  } catch (err) {
    console.error('[AUDIT LOG FAILED]', params.action, err);
  }
}
