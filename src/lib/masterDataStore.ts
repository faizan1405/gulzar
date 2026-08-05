import { prisma } from './db';
import { DEFAULT_MASLAKS, DEFAULT_CASTES, DEFAULT_LOCATIONS } from './masterData';
import {
  testDbConnection,
  getValidObjectId,
  MOCK_MASLAK_OPTIONS,
  MOCK_CASTE_OPTIONS,
  MOCK_LOCATION_OPTIONS,
  inMemoryProfiles,
} from './fallbackStore';

/* ------------------------------------------------------------------ */
/*  Master Data Seeding                                                */
/* ------------------------------------------------------------------ */

export async function seedMasterDataIfEmpty() {
  const isDb = await testDbConnection();
  if (isDb) {
    try {
      const mCount = await prisma.maslakOption.count();
      if (mCount === 0) {
        await prisma.maslakOption.createMany({
          data: DEFAULT_MASLAKS.map(m => ({ label: m.label, aliases: m.aliases, isDisabled: false }))
        });
        console.log('Seeded Maslak options to DB.');
      }
      const cCount = await prisma.casteOption.count();
      if (cCount === 0) {
        await prisma.casteOption.createMany({
          data: DEFAULT_CASTES.map(c => ({ label: c.label, aliases: c.aliases, isDisabled: false }))
        });
        console.log('Seeded Caste options to DB.');
      }
      const lCount = await prisma.locationOption.count();
      if (lCount === 0) {
        await prisma.locationOption.createMany({
          data: DEFAULT_LOCATIONS.map(l => ({
            state: l.state,
            district: l.district,
            locality: l.locality || null,
            isHighPriority: l.isHighPriority || false,
            isDisabled: false
          }))
        });
        console.log('Seeded Location options to DB.');
      }
    } catch (e) {
      console.error('Failed to seed empty master data options in DB:', e);
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Master Data Queries                                                */
/* ------------------------------------------------------------------ */

export async function getMasterDataOptions() {
  const isDb = await testDbConnection();
  if (isDb) {
    try {
      await seedMasterDataIfEmpty();
      const maslaks = await prisma.maslakOption.findMany();
      const castes = await prisma.casteOption.findMany();
      const locations = await prisma.locationOption.findMany();
      return { maslaks, castes, locations };
    } catch (e) {
      console.error('Error fetching master data from DB, using fallback', e);
    }
  }
  // Fallback
  return {
    maslaks: MOCK_MASLAK_OPTIONS,
    castes: MOCK_CASTE_OPTIONS,
    locations: MOCK_LOCATION_OPTIONS
  };
}

/* ------------------------------------------------------------------ */
/*  Maslak CRUD                                                       */
/* ------------------------------------------------------------------ */

export async function addMaslakOption(label: string, aliases: string[]) {
  const isDb = await testDbConnection();
  if (isDb) {
    return await prisma.maslakOption.create({
      data: { label, aliases, isDisabled: false }
    });
  }
  const newOpt = { id: `maslak-${Date.now()}`, label, aliases, isDisabled: false };
  MOCK_MASLAK_OPTIONS.push(newOpt);
  return newOpt;
}

export async function editMaslakOption(id: string, label: string, aliases: string[]) {
  const isDb = await testDbConnection();
  if (isDb) {
    return await prisma.maslakOption.update({
      where: { id: getValidObjectId(id) },
      data: { label, aliases }
    });
  }
  const opt = MOCK_MASLAK_OPTIONS.find(o => o.id === id);
  if (opt) {
    opt.label = label;
    opt.aliases = aliases;
  }
  return opt;
}

export async function toggleDisableMaslakOption(id: string, isDisabled: boolean) {
  const isDb = await testDbConnection();
  if (isDb) {
    return await prisma.maslakOption.update({
      where: { id: getValidObjectId(id) },
      data: { isDisabled }
    });
  }
  const opt = MOCK_MASLAK_OPTIONS.find(o => o.id === id);
  if (opt) {
    opt.isDisabled = isDisabled;
  }
  return opt;
}

/* ------------------------------------------------------------------ */
/*  Caste CRUD                                                        */
/* ------------------------------------------------------------------ */

export async function addCasteOption(label: string, aliases: string[]) {
  const isDb = await testDbConnection();
  if (isDb) {
    return await prisma.casteOption.create({
      data: { label, aliases, isDisabled: false }
    });
  }
  const newOpt = { id: `caste-${Date.now()}`, label, aliases, isDisabled: false };
  MOCK_CASTE_OPTIONS.push(newOpt);
  return newOpt;
}

export async function editCasteOption(id: string, label: string, aliases: string[]) {
  const isDb = await testDbConnection();
  if (isDb) {
    return await prisma.casteOption.update({
      where: { id: getValidObjectId(id) },
      data: { label, aliases }
    });
  }
  const opt = MOCK_CASTE_OPTIONS.find(o => o.id === id);
  if (opt) {
    opt.label = label;
    opt.aliases = aliases;
  }
  return opt;
}

export async function toggleDisableCasteOption(id: string, isDisabled: boolean) {
  const isDb = await testDbConnection();
  if (isDb) {
    return await prisma.casteOption.update({
      where: { id: getValidObjectId(id) },
      data: { isDisabled }
    });
  }
  const opt = MOCK_CASTE_OPTIONS.find(o => o.id === id);
  if (opt) {
    opt.isDisabled = isDisabled;
  }
  return opt;
}

/* ------------------------------------------------------------------ */
/*  Location CRUD                                                     */
/* ------------------------------------------------------------------ */

export async function addLocationOption(state: string, district: string, locality: string | null, isHighPriority: boolean) {
  const isDb = await testDbConnection();
  if (isDb) {
    return await prisma.locationOption.create({
      data: { state, district, locality: locality || null, isHighPriority, isDisabled: false }
    });
  }
  const newOpt = { id: `loc-${Date.now()}`, state, district, locality, isHighPriority, isDisabled: false };
  MOCK_LOCATION_OPTIONS.push(newOpt);
  return newOpt;
}

export async function toggleLocationPriority(id: string, isHighPriority: boolean) {
  const isDb = await testDbConnection();
  if (isDb) {
    return await prisma.locationOption.update({
      where: { id: getValidObjectId(id) },
      data: { isHighPriority }
    });
  }
  const opt = MOCK_LOCATION_OPTIONS.find(o => o.id === id);
  if (opt) {
    opt.isHighPriority = isHighPriority;
  }
  return opt;
}

export async function toggleDisableLocationOption(id: string, isDisabled: boolean) {
  const isDb = await testDbConnection();
  if (isDb) {
    return await prisma.locationOption.update({
      where: { id: getValidObjectId(id) },
      data: { isDisabled }
    });
  }
  const opt = MOCK_LOCATION_OPTIONS.find(o => o.id === id);
  if (opt) {
    opt.isDisabled = isDisabled;
  }
  return opt;
}

/* ------------------------------------------------------------------ */
/*  Merge Operations                                                   */
/* ------------------------------------------------------------------ */

export async function mergeCastes(sourceLabel: string, targetLabel: string) {
  const isDb = await testDbConnection();
  if (isDb) {
    await prisma.matrimonialProfile.updateMany({
      where: { biradari: sourceLabel },
      data: { biradari: targetLabel }
    });

    const targetOpt = await prisma.casteOption.findFirst({
      where: { label: targetLabel }
    });
    if (targetOpt) {
      const updatedAliases = Array.from(new Set([...targetOpt.aliases, sourceLabel]));
      await prisma.casteOption.update({
        where: { id: targetOpt.id },
        data: { aliases: updatedAliases }
      });
    }

    await prisma.casteOption.updateMany({
      where: { label: sourceLabel },
      data: { isDisabled: true }
    });

    return true;
  }

  // Fallback
  if (inMemoryProfiles) {
    inMemoryProfiles.forEach(p => {
      if (p.biradari === sourceLabel) {
        p.biradari = targetLabel;
      }
    });
  }

  const targetOpt = MOCK_CASTE_OPTIONS.find(o => o.label === targetLabel);
  if (targetOpt) {
    targetOpt.aliases = Array.from(new Set([...targetOpt.aliases, sourceLabel]));
  }

  const sourceOpt = MOCK_CASTE_OPTIONS.find(o => o.label === sourceLabel);
  if (sourceOpt) {
    sourceOpt.isDisabled = true;
  }

  return true;
}

export async function mergeLocations(sourceId: string, targetId: string) {
  const isDb = await testDbConnection();
  if (isDb) {
    const source = await prisma.locationOption.findUnique({ where: { id: getValidObjectId(sourceId) } });
    const target = await prisma.locationOption.findUnique({ where: { id: getValidObjectId(targetId) } });
    if (!source || !target) return false;

    await prisma.matrimonialProfile.updateMany({
      where: {
        state: source.state,
        district: source.district,
        locality: source.locality
      },
      data: {
        state: target.state,
        district: target.district,
        locality: target.locality,
        city: target.district,
        areaOrLocality: target.locality || target.district
      }
    });

    await prisma.locationOption.update({
      where: { id: source.id },
      data: { isDisabled: true }
    });

    return true;
  }

  // Fallback
  const source = MOCK_LOCATION_OPTIONS.find(o => o.id === sourceId);
  const target = MOCK_LOCATION_OPTIONS.find(o => o.id === targetId);
  if (!source || !target) return false;

  if (inMemoryProfiles) {
    inMemoryProfiles.forEach(p => {
      if (p.state === source.state && p.district === source.district && p.locality === source.locality) {
        p.state = target.state;
        p.district = target.district;
        p.locality = target.locality;
        p.city = target.district;
        p.areaOrLocality = target.locality || target.district;
      }
    });
  }

  source.isDisabled = true;
  return true;
}