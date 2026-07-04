import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting test database cleanup...');
  try {
    // 1. Find all test/seed users
    const testUsers = await prisma.user.findMany({
      where: {
        OR: [
          { email: { endsWith: '@rishteforever.test' } },
          { email: 'test_admin@rishteforever.test' },
        ],
      },
      include: {
        profile: {
          include: {
            purchases: true,
          },
        },
      },
    });

    if (testUsers.length === 0) {
      console.log('No test users found to delete.');
      return;
    }

    const testUserIds = testUsers.map((u) => u.id);
    const testProfileIds: string[] = [];
    const testPurchaseIds: string[] = [];

    for (const u of testUsers) {
      if (u.profile) {
        testProfileIds.push(u.profile.id);
        if (u.profile.purchases) {
          testPurchaseIds.push(...u.profile.purchases.map((p) => p.id));
        }
      }
    }

    console.log(`Found ${testUserIds.length} test users, ${testProfileIds.length} test profiles, and ${testPurchaseIds.length} test package purchases.`);

    // 2. Clean up AuditLogs referencing test users, profiles, or purchases
    const deletedLogs = await prisma.auditLog.deleteMany({
      where: {
        OR: [
          { actorUserId: { in: testUserIds } },
          {
            AND: [
              { targetType: 'MatrimonialProfile' },
              { targetId: { in: testProfileIds } },
            ],
          },
          {
            AND: [
              { targetType: 'PackagePurchase' },
              { targetId: { in: testPurchaseIds } },
            ],
          },
        ],
      },
    });
    console.log(`Deleted ${deletedLogs.count} audit logs referencing test records.`);

    // 3. Delete test users (this cascades to profiles, purchases, curated leads, verification requests)
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        id: { in: testUserIds },
      },
    });

    console.log(`Successfully deleted ${deletedUsers.count} test users (including cascading profiles, verification requests, purchases, and lead assignments).`);
    console.log('Database cleanup completed!');
  } catch (error) {
    console.error('Cleanup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
