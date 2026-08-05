import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prisma: PrismaClient;

try {
  prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
  }
} catch (err) {
  console.error('Fatal: Failed to instantiate PrismaClient — database may be unreachable:', err);
  throw err;
}

export async function testDbConnection(): Promise<boolean> {
  try {
    await prisma.user.findFirst({ select: { id: true } });
    return true;
  } catch (err) {
    console.error('Database health check failed:', err);
    return false;
  }
}

export { prisma };
