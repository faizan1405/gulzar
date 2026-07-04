import { chromium } from 'playwright';
import { PrismaClient } from '@prisma/client';
import { loadDotEnv } from './helpers/loadEnv';
import crypto from 'crypto';
import assert from 'assert';
import fs from 'fs';
import path from 'path';

loadDotEnv();

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';
const RUN_ID = crypto.randomBytes(4).toString('hex');
const prisma = new PrismaClient();

const createdUserIds: string[] = [];
const createdProfileIds: string[] = [];
const createdSessionTokens: string[] = [];

const OUT_DIR = path.join(process.cwd(), 'tests', 'screenshots');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function makeSessionCookie(userId: string): Promise<string> {
  const sessionToken = crypto.randomUUID();
  const expires = new Date(Date.now() + 60 * 60 * 1000);
  await prisma.session.create({ data: { sessionToken, userId, expires } });
  createdSessionTokens.push(sessionToken);
  return sessionToken;
}

async function makeUser(label: string) {
  const user = await prisma.user.create({
    data: {
      name: `[E2E MyAccount TEST] ${label}`,
      email: `e2e-myaccount-${RUN_ID}-${label.replace(/\s+/g, '-').toLowerCase()}@rishteforever.test`,
      role: 'USER',
    },
  });
  createdUserIds.push(user.id);
  return user;
}

async function makeProfile(userId: string) {
  const profile = await prisma.matrimonialProfile.create({
    data: {
      userId,
      fullName: `[E2E MyAccount TEST] Candidate ${RUN_ID}`,
      gender: 'Female',
      dateOfBirth: new Date(1995, 5, 15),
      maritalStatus: 'Single',
      phoneNumber: '+919876543210',
      city: 'Test City',
      state: 'Test State',
      country: 'India',
      education: 'M.Tech',
      occupation: 'Software Engineer',
      annualIncomeRange: '₹10 LPA - ₹15 LPA',
      familyInfo: 'Test family info',
      bio: 'Test bio',
      biradari: 'Caste',
      verificationStatus: 'APPROVED',
      profileCompletionStatus: 'COMPLETE',
      adminApprovalStatus: 'APPROVED',
      category: 'normal',
      hasPaid: false,
    },
  });
  createdProfileIds.push(profile.id);
  return profile;
}

async function cleanup() {
  console.log('Cleaning up test records...');
  try {
    if (createdSessionTokens.length) {
      await prisma.session.deleteMany({ where: { sessionToken: { in: createdSessionTokens } } });
    }
    if (createdProfileIds.length) {
      await prisma.matrimonialProfile.deleteMany({ where: { id: { in: createdProfileIds } } });
    }
    if (createdUserIds.length) {
      await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
    }
  } catch (err) {
    console.error('Error during cleanup:', err);
  } finally {
    await prisma.$disconnect();
  }
}

async function runTests() {
  const browser = await chromium.launch({ headless: true });
  const failures: string[] = [];

  const runTest = async (name: string, fn: (page: any, context: any) => Promise<void>) => {
    console.log(`Running test: ${name}...`);
    // Initialize contexts with desktop viewport size by default
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    try {
      await fn(page, context);
      console.log(`  ✅ PASS: ${name}`);
    } catch (e: any) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(e);
      try {
        const screenshotPath = path.join(OUT_DIR, `fail-${name.replace(/\s+/g, '-').replace(/\//g, '_').toLowerCase()}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`  📸 Failure screenshot saved to: ${screenshotPath}`);
      } catch (screenshotErr) {
        console.error('  Failed to capture failure screenshot:', screenshotErr);
      }
      failures.push(`${name}: ${e.message}`);
    } finally {
      await page.close();
      await context.close();
    }
  };

  try {
    // 1. Guest redirect test
    await runTest('Logged-out visitor gets redirected to Home page', async (page) => {
      await page.goto(`${BASE_URL}/my-account`);
      await page.waitForTimeout(1000);
      const url = page.url();
      assert.ok(url === `${BASE_URL}/` || url === `${BASE_URL}`, `Expected redirect to homepage, got ${url}`);
    });

    // 2. Logged-in with complete profile
    const userA = await makeUser('Complete Profile User');
    const profileA = await makeProfile(userA.id);
    const tokenA = await makeSessionCookie(userA.id);

    await runTest('Logged-in user with complete profile stays on /my-account', async (page, context) => {
      await context.addCookies([{ name: 'authjs.session-token', value: tokenA, domain: 'localhost', path: '/' }]);
      await page.goto(`${BASE_URL}/my-account`);
      await page.waitForSelector('text=Account Information', { timeout: 30000 });
      const url = page.url();
      assert.equal(url, `${BASE_URL}/my-account`);

      // Check fields
      const emailText = await page.locator('text=Email Address').locator('xpath=..').textContent();
      assert.ok(emailText.includes(userA.email), `Expected email ${userA.email} to be displayed, got ${emailText}`);
      
      const phoneText = await page.locator('text=Phone Number').locator('xpath=..').textContent();
      assert.ok(phoneText.includes(profileA.phoneNumber), `Expected phone ${profileA.phoneNumber} to be displayed, got ${phoneText}`);

      // Verify edit button is "Edit Profile Information"
      const buttonText = await page.locator('button:has-text("Edit Profile")').textContent();
      assert.ok(buttonText.includes('Edit Profile Information'), `Expected button "Edit Profile Information", got "${buttonText}"`);
    });

    // 3. Logged-in without profile
    const userB = await makeUser('No Profile User');
    const tokenB = await makeSessionCookie(userB.id);

    await runTest('Logged-in user without profile stays on /my-account with placeholders', async (page, context) => {
      await context.addCookies([{ name: 'authjs.session-token', value: tokenB, domain: 'localhost', path: '/' }]);
      await page.goto(`${BASE_URL}/my-account`);
      await page.waitForSelector('text=Account Information', { timeout: 30000 });
      const url = page.url();
      assert.equal(url, `${BASE_URL}/my-account`);

      // Check account details
      const emailText = await page.locator('text=Email Address').locator('xpath=..').textContent();
      assert.ok(emailText.includes(userB.email), `Expected email ${userB.email} to be displayed, got ${emailText}`);

      const phoneText = await page.locator('text=Phone Number').locator('xpath=..').textContent();
      assert.ok(phoneText.includes('Profile not completed'), `Expected phone placeholder "Profile not completed", got ${phoneText}`);

      // Verify button is "Complete Profile"
      const buttonText = await page.locator('button:has-text("Complete Profile")').textContent();
      assert.ok(buttonText.includes('Complete Profile'), `Expected button "Complete Profile", got "${buttonText}"`);

      // Verify no photo upload button is visible
      const hasChoosePhoto = await page.locator('text=Choose Photo').isVisible();
      assert.equal(hasChoosePhoto, false, 'Choose Photo upload button should not be visible for users without profile');
    });

    // 4. API mock profile: null
    await runTest('Profile API returns profile: null shows My Account with placeholders', async (page, context) => {
      await context.addCookies([{ name: 'authjs.session-token', value: tokenB, domain: 'localhost', path: '/' }]);
      await page.route('**/api/profile', (route: any) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            profile: null,
            user: {
              name: 'Mocked User B',
              email: 'mockb@test.com',
              createdAt: new Date().toISOString(),
              providers: ['google']
            }
          })
        });
      });
      await page.goto(`${BASE_URL}/my-account`);
      await page.waitForSelector('text=Account Information', { timeout: 30000 });
      
      const emailText = await page.locator('text=Email Address').locator('xpath=..').textContent();
      assert.ok(emailText.includes('mockb@test.com'), `Expected mocked email mockb@test.com, got ${emailText}`);

      const phoneText = await page.locator('text=Phone Number').locator('xpath=..').textContent();
      assert.ok(phoneText.includes('Profile not completed'));
    });

    // 5. API mock 500
    await runTest('Profile API returns 500 shows Retry error state', async (page, context) => {
      await context.addCookies([{ name: 'authjs.session-token', value: tokenB, domain: 'localhost', path: '/' }]);
      await page.route('**/api/profile', (route: any) => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal server error simulator' })
        });
      });
      await page.goto(`${BASE_URL}/my-account`);
      await page.waitForSelector('text=We couldn\'t load your account.', { timeout: 30000 });
      
      const isRetryVisible = await page.locator('button:has-text("Retry")').isVisible();
      assert.ok(isRetryVisible, 'Retry button should be visible in API error state');
    });

    // 6. Navbar click test
    await runTest('Navbar click navigates to /my-account without redirecting', async (page, context) => {
      await context.addCookies([{ name: 'authjs.session-token', value: tokenB, domain: 'localhost', path: '/' }]);
      await page.goto(`${BASE_URL}/`);
      
      // Let it load public profiles and complete loading
      await page.waitForTimeout(2000);
      
      // Wait for Navbar My Account button to be visible and click it
      await page.waitForSelector('a:has-text("My Account")', { state: 'visible', timeout: 30000 });
      await page.click('a:has-text("My Account")');
      await page.waitForURL('**/my-account', { timeout: 30000 });
      await page.waitForSelector('text=Account Information', { timeout: 30000 });
      
      assert.equal(page.url(), `${BASE_URL}/my-account`);
    });

    // 7. Refresh test
    await runTest('Refreshing my-account keeps user on my-account', async (page, context) => {
      await context.addCookies([{ name: 'authjs.session-token', value: tokenB, domain: 'localhost', path: '/' }]);
      await page.goto(`${BASE_URL}/my-account`);
      await page.waitForSelector('text=Account Information', { timeout: 30000 });
      
      await page.reload();
      await page.waitForSelector('text=Account Information', { timeout: 30000 });
      assert.equal(page.url(), `${BASE_URL}/my-account`);
    });

    // 8. Mobile Viewport test
    await runTest('Mobile viewport displays account details properly', async (page, context) => {
      await context.addCookies([{ name: 'authjs.session-token', value: tokenB, domain: 'localhost', path: '/' }]);
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(`${BASE_URL}/my-account`);
      await page.waitForSelector('text=Account Information', { timeout: 30000 });
      
      const titleVisible = await page.locator('h1:has-text("My Account")').isVisible();
      assert.ok(titleVisible, 'Title "My Account" should be visible in mobile view');
    });

  } finally {
    await browser.close();
    await cleanup();
  }

  if (failures.length) {
    console.error(`\n❌ Some tests failed (${failures.length}):`);
    failures.forEach(f => console.error(`  - ${f}`));
    process.exit(1);
  } else {
    console.log('\n✨ All tests passed successfully!');
    process.exit(0);
  }
}

runTests();
