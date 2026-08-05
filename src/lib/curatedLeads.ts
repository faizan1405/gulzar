import { prisma } from './db';
import {
  testDbConnection,
  getValidObjectId,
  sanitizeErrorMessage,
  isFallbackAllowed,
  inMemoryCuratedLeads,
  inMemoryProfiles,
} from './fallbackStore';

/* ------------------------------------------------------------------ */
/*  Curated Lead Assignments                                           */
/* ------------------------------------------------------------------ */

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
  inMemoryCuratedLeads?.push(newAssignment);
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

  return (inMemoryCuratedLeads || []).map((a) => ({
    ...a,
    buyerProfile: inMemoryProfiles?.find((prof) => prof.id === a.buyerProfileId) || null,
    leadProfile: inMemoryProfiles?.find((prof) => prof.id === a.leadProfileId) || null,
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
  const assignment = inMemoryCuratedLeads?.find((a) => a.id === assignmentId);
  if (assignment) {
    assignment.status = status;
    assignment.updatedAt = new Date();
  }
  return assignment || null;
}