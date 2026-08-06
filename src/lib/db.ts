import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = (() => {
  // Lazy singleton — avoids crashing the module on Vercel cold-start
  // when the database is temporarily unreachable during function init.
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client;
  }

  return client;
})();

export async function testDbConnection(): Promise<boolean> {
  try {
    await prisma.user.findFirst({ select: { id: true } });
    return true;
  } catch (err) {
    console.error('Database health check failed:', err);
    return false;
  }
}
