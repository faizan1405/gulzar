import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.prod' });

const prisma = new PrismaClient();

async function main() {
  console.log("Connecting to:", process.env.DATABASE_URL?.substring(0, 25) + '...');
  try {
    const profiles = await prisma.matrimonialProfile.findMany({
      orderBy: { createdAt: 'desc' },
    });
    console.log("Success! Found profiles:", profiles.length);
  } catch (e) {
    console.error("Prisma Query Failed:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
