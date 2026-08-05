import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@rishteforever.in';
  const adminPassword = 'Rishte@Admin2026';

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (existing) {
    console.log('Admin user already exists:', adminEmail);
    await prisma.$disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      name: 'Admin',
      role: 'ADMIN',
      accountStatus: 'ACTIVE',
      passwordHash,
    },
  });

  console.log('Admin user created:');
  console.log('  Email:    ', adminEmail);
  console.log('  Password: ', adminPassword);
  console.log('  User ID:  ', admin.id);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
