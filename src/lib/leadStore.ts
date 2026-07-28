import { prisma } from './db';
import {
  testDbConnection,
  getValidObjectId,
  sanitizeErrorMessage,
  isFallbackAllowed,
  logFallbackWarning,
  inMemoryLeads,
} from './fallbackStore';

/* ------------------------------------------------------------------ */
/*  Lead CRUD                                                         */
/* ------------------------------------------------------------------ */

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
  inMemoryLeads?.unshift(newLead);
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

  return inMemoryLeads || [];
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
  const lead = inMemoryLeads?.find((l) => l.id === id);
  if (lead) {
    if (data.status !== undefined) lead.status = data.status;
    if (data.priority !== undefined) lead.priority = data.priority;
    if (data.adminNotes !== undefined) lead.adminNotes = data.adminNotes ?? '';
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
  const index = inMemoryLeads?.findIndex((l) => l.id === id) ?? -1;
  if (index > -1 && inMemoryLeads) {
    inMemoryLeads.splice(index, 1);
    return true;
  }
  return false;
}