import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database backup...');
  try {
    const users = await prisma.user.findMany();
    const accounts = await prisma.account.findMany();
    const sessions = await prisma.session.findMany();
    const verificationTokens = await prisma.verificationToken.findMany();
    const matrimonialProfiles = await prisma.matrimonialProfile.findMany();
    const packagePurchases = await prisma.packagePurchase.findMany();
    const curatedLeadAssignments = await prisma.curatedLeadAssignment.findMany();
    const verificationRequests = await prisma.verificationRequest.findMany();
    const auditLogs = await prisma.auditLog.findMany();

    const backupData = {
      timestamp: new Date().toISOString(),
      counts: {
        users: users.length,
        accounts: accounts.length,
        sessions: sessions.length,
        verificationTokens: verificationTokens.length,
        matrimonialProfiles: matrimonialProfiles.length,
        packagePurchases: packagePurchases.length,
        curatedLeadAssignments: curatedLeadAssignments.length,
        verificationRequests: verificationRequests.length,
        auditLogs: auditLogs.length,
      },
      data: {
        users,
        accounts,
        sessions,
        verificationTokens,
        matrimonialProfiles,
        packagePurchases,
        curatedLeadAssignments,
        verificationRequests,
        auditLogs,
      }
    };

    const backupsDir = path.join(__dirname, '../backups');
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }

    const timestampStr = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup_${timestampStr}.json`;
    const filepath = path.join(backupsDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(backupData, null, 2), 'utf-8');
    console.log(`Backup completed successfully! Saved to: ${filepath}`);
    console.log('Counts:', backupData.counts);
  } catch (error) {
    console.error('Backup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
