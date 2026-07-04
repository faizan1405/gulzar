import crypto from 'node:crypto';
import { readFileSync } from 'node:fs';
import { PrismaClient } from '@prisma/client';

function loadDotEnv(path: string) {
  const raw = readFileSync(path, 'utf-8');
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

loadDotEnv('e:/012/Git Repos of Cleints/Rishte Forever/gulzar/.env');

async function main() {
  const prisma = new PrismaClient();
  const scenario = process.argv[2] || 'with-profile';
  const RUN_ID = crypto.randomBytes(4).toString('hex');

  const user = await prisma.user.create({
    data: {
      name: `[REPRO] ${scenario} ${RUN_ID}`,
      email: `repro-${RUN_ID}-${scenario}@rishteforever.test`,
      role: 'USER',
    },
  });

  if (scenario === 'with-profile') {
    await prisma.matrimonialProfile.create({
      data: {
        userId: user.id,
        fullName: `[REPRO] Candidate ${RUN_ID}`,
        gender: 'Female',
        dateOfBirth: new Date('1998-01-01'),
        maritalStatus: 'Single',
        phoneNumber: '+910000000001',
        city: 'Test City',
        state: 'Test State',
        country: 'India',
        education: 'B.Tech',
        occupation: 'Engineer',
        annualIncomeRange: '5-10',
        familyInfo: 'info',
        bio: 'bio',
        biradari: 'Test',
        verificationStatus: 'PENDING',
        profileCompletionStatus: 'COMPLETE',
        adminApprovalStatus: 'PENDING',
        category: 'normal',
        hasPaid: false,
      },
    });
  }

  const sessionToken = crypto.randomUUID();
  const expires = new Date(Date.now() + 60 * 60 * 1000);
  await prisma.session.create({ data: { sessionToken, userId: user.id, expires } });

  console.log(JSON.stringify({ userId: user.id, sessionToken, scenario }));
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
