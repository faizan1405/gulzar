import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting migration to update existing package and subscription records to ₹1...');
  
  // Update all PackagePurchase records in the database
  const result = await prisma.packagePurchase.updateMany({
    data: {
      basePrice: 1.0,
      gstRate: 0.0,
      totalAmount: 1.0,
      successFeeAmount: 0.0,
    },
  });

  console.log(`Success: Updated ${result.count} package purchase records.`);
}

main()
  .catch((e) => {
    console.error('Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
