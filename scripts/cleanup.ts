import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting demo database cleanup...');
  try {
    // 1. Find all demo users
    const demoUsers = await prisma.user.findMany({
      where: {
        OR: [
          { email: { endsWith: '@rishteforever.demo' } },
          { email: 'demo_admin@rishteforever.demo' },
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

    if (demoUsers.length === 0) {
      console.log('No demo users found to delete.');
      return;
    }

    const demoUserIds = demoUsers.map((u) => u.id);
    const demoProfileIds: string[] = [];
    const demoPurchaseIds: string[] = [];

    for (const u of demoUsers) {
      if (u.profile) {
        demoProfileIds.push(u.profile.id);
        if (u.profile.purchases) {
          demoPurchaseIds.push(...u.profile.purchases.map((p) => p.id));
        }
      }
    }

    console.log(`Found ${demoUserIds.length} demo users, ${demoProfileIds.length} demo profiles, and ${demoPurchaseIds.length} demo package purchases.`);

    // 2. Clean up AuditLogs referencing demo users, profiles, or purchases
    const deletedLogs = await prisma.auditLog.deleteMany({
      where: {
        OR: [
          { actorUserId: { in: demoUserIds } },
          {
            AND: [
              { targetType: 'MatrimonialProfile' },
              { targetId: { in: demoProfileIds } },
            ],
          },
          {
            AND: [
              { targetType: 'PackagePurchase' },
              { targetId: { in: demoPurchaseIds } },
            ],
          },
        ],
      },
    });
    console.log(`Deleted ${deletedLogs.count} audit logs referencing demo records.`);

    // 3. Delete demo users (this cascades to profiles, purchases, curated leads, verification requests)
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        id: { in: demoUserIds },
      },
    });

    console.log(`Successfully deleted ${deletedUsers.count} demo users (including cascading profiles, verification requests, purchases, and lead assignments).`);
    console.log('Database cleanup completed!');
  } catch (error) {
    console.error('Cleanup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
