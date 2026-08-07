/**
 * Debug test: test NextAuth session cookie handling directly
 *
 * Run with: npx tsx tests/debug-auth.test.ts
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function main() {
  console.log('=== Testing auth flow ===\n');

  // 1. Check session without auth
  console.log('1. GET /api/auth/session (no auth):');
  const sessionRes = await fetch(`${BASE_URL}/api/auth/session`);
  console.log('   Status:', sessionRes.status);
  console.log('   Body:', await sessionRes.json());

  // 2. Check GET /api/profile without auth
  console.log('\n2. GET /api/profile (no auth):');
  const profileRes = await fetch(`${BASE_URL}/api/profile`);
  console.log('   Status:', profileRes.status);
  console.log('   Body:', await profileRes.json());

  // 3. Check POST /api/profile without auth
  console.log('\n3. POST /api/profile (no auth):');
  const postRes = await fetch(`${BASE_URL}/api/profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Test',
      gender: 'MALE',
      dateOfBirth: '1995-01-01',
      maritalStatus: 'NEVER_MARRIED',
      phoneNumber: '+911234567890',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      education: 'B.Tech',
      occupation: 'Engineer',
      annualIncomeRange: '5-10 LPA',
      familyInfo: 'Test',
      bio: 'Test bio',
      termsAccepted: true,
    }),
  });
  console.log('   Status:', postRes.status);
  console.log('   Body:', await postRes.json());

  console.log('\n=== Tests complete ===');
  process.exit(0);
}

main().catch(console.error);
