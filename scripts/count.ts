import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.matrimonialProfile.groupBy({
    by: ['category'],
    where: {
      verificationStatus: 'APPROVED',
      adminApprovalStatus: 'APPROVED',
      profileCompletionStatus: 'COMPLETE'
    },
    _count: {
      id: true
    }
  });
  console.log(categories);
}
main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
