import { PrismaClient, PackageType } from '@prisma/client';

const prisma = new PrismaClient();

const HISTORICAL_PRICING: Record<PackageType, { basePrice: number, gstRate: number, totalAmount: number, successFeeAmount: number }> = {
  monthly_membership: {
    basePrice: 300,
    gstRate: 0.18,
    totalAmount: 354,
    successFeeAmount: 0,
  },
  good_profile_package: {
    basePrice: 5500,
    gstRate: 0.18,
    totalAmount: 6490,
    successFeeAmount: 21000,
  },
  second_marriage_package: {
    basePrice: 11000,
    gstRate: 0.18,
    totalAmount: 12980,
    successFeeAmount: 0,
  },
  high_profile_package: {
    basePrice: 21000,
    gstRate: 0.18,
    totalAmount: 24780,
    successFeeAmount: 25000,
  }
};

// We will restore all purchases created before today's script execution
const CUTOFF_DATE = new Date('2026-07-04T06:20:00.000Z'); 

async function main() {
  console.log('Starting historical data restoration for PackagePurchase records...');

  const purchasesToRestore = await prisma.packagePurchase.findMany({
    where: {
      totalAmount: 1,
      createdAt: {
        lt: CUTOFF_DATE
      }
    }
  });

  console.log(`Found ${purchasesToRestore.length} historical records that were incorrectly set to ₹1.`);

  let restoredCount = 0;

  for (const purchase of purchasesToRestore) {
    const originalPricing = HISTORICAL_PRICING[purchase.packageType];
    
    if (originalPricing) {
      await prisma.packagePurchase.update({
        where: { id: purchase.id },
        data: {
          basePrice: originalPricing.basePrice,
          gstRate: originalPricing.gstRate,
          totalAmount: originalPricing.totalAmount,
          successFeeAmount: originalPricing.successFeeAmount,
        }
      });
      restoredCount++;
    }
  }

  console.log(`Successfully restored ${restoredCount} historical package purchase records.`);
}

main()
  .catch((e) => {
    console.error('Restoration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
