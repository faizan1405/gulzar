import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { loadDotEnv } from './helpers/loadEnv';

loadDotEnv();

// Real, authenticated, end-to-end verification against the live dev server +
// live database — no Google OAuth / Razorpay network calls are made (this
// sandbox has no way to complete a real OAuth consent screen or reach the
// real Razorpay API). Instead:
//  - "Login" is simulated the same way Auth.js validates any session: by
//    inserting a real Session row and sending its sessionToken as the
//    `authjs.session-token` cookie on real HTTP requests to the running
//    Next.js server. This exercises the exact server-side authorization code
//    (auth(), redactProfile, getViewerPackageAccess) a real Google login
//    would produce — nothing about the request is mocked.
//  - "Payment" is simulated by writing PackagePurchase rows directly via the
//    same Prisma functions the payment/verify route uses internally
//    (createPackagePurchase / a PAID PackagePurchase), per the task's
//    instruction to use mocked Razorpay responses when a live checkout can't
//    be completed. No Razorpay secret is read, generated, or logged.
//
// All records created here are prefixed "[E2E TEST]" / use an
// e2e-test-*@rishteforever.test email and are deleted in `after()`.

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';
const RUN_ID = crypto.randomBytes(4).toString('hex');

let prisma: import('@prisma/client').PrismaClient | null = null;
let serverUp = false;

const createdUserIds: string[] = [];
const createdProfileIds: string[] = [];
const createdSessionTokens: string[] = [];
const createdPurchaseIds: string[] = [];

async function makeSessionCookie(userId: string): Promise<string> {
  const sessionToken = crypto.randomUUID();
  const expires = new Date(Date.now() + 60 * 60 * 1000);
  await prisma!.session.create({ data: { sessionToken, userId, expires } });
  createdSessionTokens.push(sessionToken);
  return `authjs.session-token=${sessionToken}`;
}

async function makeUser(label: string, role: 'USER' | 'ADMIN' = 'USER') {
  const user = await prisma!.user.create({
    data: {
      name: `[E2E TEST] ${label}`,
      email: `e2e-test-${RUN_ID}-${label.replace(/\s+/g, '-').toLowerCase()}@rishteforever.test`,
      role,
    },
  });
  createdUserIds.push(user.id);
  return user;
}

function futureDobFor(age: number): Date {
  const d = new Date();
  d.setFullYear(d.getFullYear() - age);
  return d;
}

async function makeProfile(userId: string, overrides: Record<string, unknown> = {}) {
  const profile = await prisma!.matrimonialProfile.create({
    data: {
      userId,
      fullName: `[E2E TEST] Candidate ${RUN_ID}`,
      gender: 'Female',
      dateOfBirth: futureDobFor(27),
      maritalStatus: 'Single',
      phoneNumber: '+910000000000',
      city: 'Test City',
      state: 'Test State',
      country: 'India',
      education: 'M.Tech (E2E)',
      occupation: 'E2E Test Occupation',
      annualIncomeRange: '₹5 LPA - ₹10 LPA',
      familyInfo: 'E2E test family info — must never leak unauthorized.',
      bio: 'E2E test bio.',
      biradari: 'E2E-Caste',
      verificationStatus: 'APPROVED',
      profileCompletionStatus: 'COMPLETE',
      adminApprovalStatus: 'APPROVED',
      category: 'normal',
      hasPaid: false,
      ...overrides,
    },
  });
  createdProfileIds.push(profile.id);
  return profile;
}

async function makePurchase(profileId: string, overrides: Record<string, unknown> = {}) {
  const purchase = await prisma!.packagePurchase.create({
    data: {
      profileId,
      packageType: 'monthly_membership',
      basePrice: 1,
      gstRate: 0,
      totalAmount: 1,
      billingType: 'ONE_TIME',
      successFeeAmount: 0,
      paymentStatus: 'PAID',
      accessStatus: 'ACTIVE',
      eligibilityStatus: 'APPROVED',
      // Each purchase needs its own unique order id — the schema enforces
      // uniqueness on this column.
      razorpayOrderId: `e2e_test_order_${RUN_ID}_${crypto.randomBytes(6).toString('hex')}`,
      ...overrides,
    },
  });
  createdPurchaseIds.push(purchase.id);
  return purchase;
}

before(async () => {
  try {
    const health = await fetch(`${BASE_URL}/api/profiles`);
    serverUp = health.ok;
  } catch {
    serverUp = false;
  }
  if (!serverUp) return;

  const { PrismaClient } = await import('@prisma/client');
  prisma = new PrismaClient();
});

after(async () => {
  if (!prisma) return;
  // Delete in FK-safe order: purchases -> sessions -> profiles -> users.
  if (createdPurchaseIds.length) {
    await prisma.packagePurchase.deleteMany({ where: { id: { in: createdPurchaseIds } } });
  }
  if (createdSessionTokens.length) {
    await prisma.session.deleteMany({ where: { sessionToken: { in: createdSessionTokens } } });
  }
  if (createdProfileIds.length) {
    await prisma.matrimonialProfile.deleteMany({ where: { id: { in: createdProfileIds } } });
  }
  if (createdUserIds.length) {
    await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
  }
  await prisma.$disconnect();
});

describe('Authenticated end-to-end access control (real dev server + real DB)', () => {
  test('guest (unauthenticated) direct API call: list endpoint never leaks protected fields', async (t) => {
    if (!serverUp || !prisma) return t.skip('dev server / DB not reachable in this environment');

    const targetUser = await makeUser('guest-target-owner');
    const target = await makeProfile(targetUser.id, { category: 'normal' });

    const res = await fetch(`${BASE_URL}/api/profiles`);
    assert.equal(res.status, 200);
    const body = await res.json();
    const found = body.profiles.find((p: any) => p.id === target.id);
    assert.ok(found, 'newly created approved profile should appear in the public listing');
    assert.equal(found.fullName, target.fullName, 'guest must still see the real candidate name');
    assert.equal(found.phoneNumber, '+91-XXXXX-XXXXX', 'guest must never receive the real phone number');
    assert.equal(found.education, undefined, 'guest must never receive education');
    assert.equal(found.occupation, undefined, 'guest must never receive occupation');
    assert.equal(found.annualIncomeRange, undefined, 'guest must never receive income');
    assert.equal(found.familyInfo, undefined, 'guest must never receive family info');
  });

  test('guest direct URL to a profile detail page returns the limited preview, not full data', async (t) => {
    if (!serverUp || !prisma) return t.skip('dev server / DB not reachable in this environment');

    const targetUser = await makeUser('guest-detail-owner');
    const target = await makeProfile(targetUser.id, { category: 'good_profile' });

    const res = await fetch(`${BASE_URL}/api/profiles/${target.id}`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.locked, true);
    assert.equal(body.profile.fullName, target.fullName, 'name stays visible even for a premium category');
    assert.equal(body.profile.phoneNumber, undefined);
    assert.equal(body.profile.education, undefined);
    assert.equal(body.profile.profileImageUrl, undefined);
  });

  test('an unapproved (PENDING) profile is not reachable directly by ID', async (t) => {
    if (!serverUp || !prisma) return t.skip('dev server / DB not reachable in this environment');

    const targetUser = await makeUser('unapproved-owner');
    const target = await makeProfile(targetUser.id, { verificationStatus: 'PENDING', adminApprovalStatus: 'PENDING' });

    const res = await fetch(`${BASE_URL}/api/profiles/${target.id}`);
    assert.equal(res.status, 404, 'an unapproved profile must not be directly viewable');
  });

  test('logged-in user WITHOUT a matrimonial profile is prompted to complete registration, not payment', async (t) => {
    if (!serverUp || !prisma) return t.skip('dev server / DB not reachable in this environment');

    const targetUser = await makeUser('unregistered-target-owner');
    const target = await makeProfile(targetUser.id, { category: 'normal' });

    const viewer = await makeUser('unregistered-viewer');
    const cookie = await makeSessionCookie(viewer.id);

    const res = await fetch(`${BASE_URL}/api/profiles/${target.id}`, { headers: { Cookie: cookie } });
    const body = await res.json();
    assert.equal(body.locked, true);
    assert.equal(body.reason, 'not_logged_in', 'no matrimonial profile yet -> treated as the registration-required state');
    assert.equal(body.profile.phoneNumber, undefined);
  });

  test('registered user WITHOUT any package sees only the limited preview', async (t) => {
    if (!serverUp || !prisma) return t.skip('dev server / DB not reachable in this environment');

    const targetUser = await makeUser('unpaid-target-owner');
    const target = await makeProfile(targetUser.id, { category: 'normal' });

    const viewer = await makeUser('unpaid-viewer');
    await makeProfile(viewer.id, { fullName: `[E2E TEST] Viewer ${RUN_ID}` });
    const cookie = await makeSessionCookie(viewer.id);

    const res = await fetch(`${BASE_URL}/api/profiles/${target.id}`, { headers: { Cookie: cookie } });
    const body = await res.json();
    assert.equal(body.locked, true);
    assert.equal(body.reason, 'no_package');
    assert.equal(body.profile.fullName, target.fullName);
    assert.equal(body.profile.phoneNumber, undefined);
    assert.equal(body.profile.occupation, undefined);
  });

  test('correct-package subscriber sees full protected details for a matching-category profile', async (t) => {
    if (!serverUp || !prisma) return t.skip('dev server / DB not reachable in this environment');

    const targetUser = await makeUser('good-profile-target-owner');
    const target = await makeProfile(targetUser.id, {
      category: 'good_profile',
      profileImageUrl: 'https://example.com/e2e.jpg',
      profileImageStatus: 'APPROVED',
    });

    const viewer = await makeUser('good-profile-viewer');
    const viewerProfile = await makeProfile(viewer.id, { fullName: `[E2E TEST] Viewer ${RUN_ID}` });
    await makePurchase(viewerProfile.id, { packageType: 'monthly_membership' });
    await makePurchase(viewerProfile.id, { packageType: 'good_profile_package' });
    const cookie = await makeSessionCookie(viewer.id);

    const res = await fetch(`${BASE_URL}/api/profiles/${target.id}`, { headers: { Cookie: cookie } });
    const body = await res.json();
    assert.equal(body.locked, false);
    assert.equal(body.profile.phoneNumber, target.phoneNumber, 'matching package must reveal the real phone number');
    assert.equal(body.profile.occupation, target.occupation);
    assert.equal(body.profile.profileImageUrl, target.profileImageUrl, 'approved photo must be revealed');
  });

  test('wrong-package subscriber stays locked and gets a clear "requires another package" signal', async (t) => {
    if (!serverUp || !prisma) return t.skip('dev server / DB not reachable in this environment');

    const targetUser = await makeUser('high-profile-target-owner');
    const target = await makeProfile(targetUser.id, { category: 'high_profile' });

    const viewer = await makeUser('wrong-package-viewer');
    const viewerProfile = await makeProfile(viewer.id, { fullName: `[E2E TEST] Viewer ${RUN_ID}` });
    await makePurchase(viewerProfile.id, { packageType: 'monthly_membership' });
    await makePurchase(viewerProfile.id, { packageType: 'second_marriage_package' }); // wrong package
    const cookie = await makeSessionCookie(viewer.id);

    const res = await fetch(`${BASE_URL}/api/profiles/${target.id}`, { headers: { Cookie: cookie } });
    const body = await res.json();
    assert.equal(body.locked, false, 'canViewFullProfile passes (they do have an active package) — redaction happens at the field level');
    assert.equal(body.profile.isLocked, true);
    assert.equal(body.profile.isLockedCategory, 'high_profile_package', 'must clearly state which package unlocks this profile');
    assert.equal(body.profile.phoneNumber, '+91-XXXXX-XXXXX', 'wrong package must not leak the real phone number');
    assert.equal(body.profile.occupation, undefined, 'wrong package must not leak occupation');
    assert.equal(body.profile.fullName, target.fullName, 'name stays visible while locked');
  });

  test('expired subscription falls back to the limited preview immediately', async (t) => {
    if (!serverUp || !prisma) return t.skip('dev server / DB not reachable in this environment');

    const targetUser = await makeUser('expired-target-owner');
    const target = await makeProfile(targetUser.id, { category: 'normal', occupation: 'Should Not Leak' });

    const viewer = await makeUser('expired-viewer');
    const viewerProfile = await makeProfile(viewer.id, { fullName: `[E2E TEST] Viewer ${RUN_ID}` });
    await makePurchase(viewerProfile.id, {
      packageType: 'monthly_membership',
      expiryDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // expired yesterday
    });
    const cookie = await makeSessionCookie(viewer.id);

    const res = await fetch(`${BASE_URL}/api/profiles/${target.id}`, { headers: { Cookie: cookie } });
    const body = await res.json();
    assert.equal(body.locked, true, 'an expired purchase must not count as an active package');
    assert.equal(body.reason, 'no_package');
    assert.equal(body.profile.occupation, undefined, 'expired subscriber must not receive protected fields');
  });

  test('frontend cannot bypass access control by querying the list endpoint instead of the detail endpoint', async (t) => {
    if (!serverUp || !prisma) return t.skip('dev server / DB not reachable in this environment');

    const targetUser = await makeUser('bypass-target-owner');
    const target = await makeProfile(targetUser.id, { category: 'high_profile', occupation: 'Should Not Leak Via List' });

    const viewer = await makeUser('bypass-viewer');
    const viewerProfile = await makeProfile(viewer.id, { fullName: `[E2E TEST] Viewer ${RUN_ID}` });
    await makePurchase(viewerProfile.id, { packageType: 'monthly_membership' }); // no high_profile package
    const cookie = await makeSessionCookie(viewer.id);

    const res = await fetch(`${BASE_URL}/api/profiles`, { headers: { Cookie: cookie } });
    const body = await res.json();
    const found = body.profiles.find((p: any) => p.id === target.id);
    assert.ok(found);
    assert.equal(found.occupation, undefined, 'the list endpoint must apply the exact same redaction as the detail endpoint');
    assert.equal(found.isLockedCategory, 'high_profile_package');
  });
});
