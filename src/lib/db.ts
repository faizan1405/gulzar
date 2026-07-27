import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prisma: PrismaClient;

try {
  prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

  // Prisma 6 removed the typed event listener API; cast to attach runtime hooks
  const anyPrisma = prisma as any;
  anyPrisma.on('error', (err: Error) => {
    console.error('Prisma connection error event:', err.message);
  });
  anyPrisma.on('connect', () => {
    console.log('Prisma connected to database.');
  });

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
  }
} catch (err) {
  console.error('Failed to instantiate PrismaClient — database may be unreachable:', err);
}

export async function testDbConnection(): Promise<boolean> {
  if (!prisma) {
    return false;
  }
  try {
    // Use a lightweight query via the Prisma model API instead of raw SQL
    await (prisma as any).$queryRaw`SELECT 1`;
    return true;
  } catch (err) {
    console.error('Database health check failed:', err);
    return false;
  }
}

export { prisma };
