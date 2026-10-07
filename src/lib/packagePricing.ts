import { prisma, testDbConnection } from './db';
import { PackageType } from '@prisma/client';
import {
  DEFAULT_PACKAGE_BASE_PRICES,
  GST_RATE,
  calculatePackagePricing,
  round2,
} from './packages';
import { inMemoryPricing, isFallbackAllowed } from './fallbackStore';

export interface PackagePricingInfo {
  packageType: PackageType;
  basePrice: number;
  gstRate: number;
  gst: number;
  totalAmount: number;
  updatedAt?: Date;
}

export const VALID_PACKAGE_TYPES: PackageType[] = [
  'monthly_membership',
  'good_profile_package',
  'second_marriage_package',
  'high_profile_package',
];

export function isValidPackageType(val: any): val is PackageType {
  return VALID_PACKAGE_TYPES.includes(val);
}

/**
 * Get the current base price for a specific package type.
 * Priority: DB record -> inMemory fallback -> default constant.
 */
export async function getPackageBasePrice(packageType: PackageType): Promise<number> {
  const isDb = await testDbConnection();
  if (isDb) {
    try {
      const record = await prisma.packagePricing.findUnique({
        where: { packageType },
      });
      if (record && typeof record.basePrice === 'number' && !isNaN(record.basePrice)) {
        return record.basePrice;
      }
    } catch (e) {
      console.error(`Error reading package pricing for ${packageType}:`, e);
      if (!isFallbackAllowed()) {
        throw e;
      }
    }
  }

  // Fallback
  if (typeof inMemoryPricing?.[packageType] === 'number') {
    return inMemoryPricing[packageType];
  }
  return DEFAULT_PACKAGE_BASE_PRICES[packageType] ?? 1;
}

/**
 * Get pricing calculation for a specific package type.
 */
export async function getCurrentPackagePricing(packageType: PackageType): Promise<PackagePricingInfo> {
  const basePrice = await getPackageBasePrice(packageType);
  const totals = calculatePackagePricing(basePrice, GST_RATE);
  return {
    packageType,
    ...totals,
  };
}

/**
 * Get all current package pricings.
 * Guaranteed to return entries for all 4 packages.
 */
export async function getAllPackagePricing(): Promise<Record<PackageType, PackagePricingInfo>> {
  const isDb = await testDbConnection();
  const dbRecordsMap = new Map<PackageType, { basePrice: number; updatedAt: Date }>();

  if (isDb) {
    try {
      const records = await prisma.packagePricing.findMany();
      for (const rec of records) {
        if (isValidPackageType(rec.packageType) && typeof rec.basePrice === 'number') {
          dbRecordsMap.set(rec.packageType, {
            basePrice: rec.basePrice,
            updatedAt: rec.updatedAt,
          });
        }
      }
    } catch (e) {
      console.error('Error fetching all package pricing from DB:', e);
      if (!isFallbackAllowed()) {
        throw e;
      }
    }
  }

  const result = {} as Record<PackageType, PackagePricingInfo>;

  for (const pkgType of VALID_PACKAGE_TYPES) {
    let basePrice: number;
    let updatedAt: Date | undefined;

    if (dbRecordsMap.has(pkgType)) {
      const dbEntry = dbRecordsMap.get(pkgType)!;
      basePrice = dbEntry.basePrice;
      updatedAt = dbEntry.updatedAt;
    } else if (typeof inMemoryPricing?.[pkgType] === 'number') {
      basePrice = inMemoryPricing[pkgType];
    } else {
      basePrice = DEFAULT_PACKAGE_BASE_PRICES[pkgType];
    }

    const totals = calculatePackagePricing(basePrice, GST_RATE);
    result[pkgType] = {
      packageType: pkgType,
      ...totals,
      updatedAt,
    };
  }

  return result;
}

/**
 * Update package price.
 * Validates price > 0, numeric, finite.
 * Upserts database row and updates memory fallback.
 */
export async function updatePackagePrice(
  packageType: PackageType,
  newBasePrice: number
): Promise<PackagePricingInfo> {
  if (!isValidPackageType(packageType)) {
    throw new Error(`Invalid package type: ${packageType}`);
  }

  if (
    typeof newBasePrice !== 'number' ||
    isNaN(newBasePrice) ||
    !isFinite(newBasePrice) ||
    newBasePrice <= 0
  ) {
    throw new Error('Base price must be a valid positive number greater than 0.');
  }

  const roundedPrice = round2(newBasePrice);
  const isDb = await testDbConnection();
  let updatedAt = new Date();

  if (isDb) {
    try {
      const record = await prisma.packagePricing.upsert({
        where: { packageType },
        create: {
          packageType,
          basePrice: roundedPrice,
        },
        update: {
          basePrice: roundedPrice,
        },
      });
      updatedAt = record.updatedAt;
    } catch (e) {
      console.error(`Failed to update package pricing for ${packageType} in DB:`, e);
      if (!isFallbackAllowed()) {
        throw e;
      }
    }
  }

  // Also keep inMemory state in sync
  if (inMemoryPricing) {
    inMemoryPricing[packageType] = roundedPrice;
  }

  const totals = calculatePackagePricing(roundedPrice, GST_RATE);
  return {
    packageType,
    ...totals,
    updatedAt,
  };
}
