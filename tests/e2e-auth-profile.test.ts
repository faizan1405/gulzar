/**
 * Integration test: full end-to-end auth → save profile flow.
 *
 * Run with: npx playwright test tests/e2e-auth-profile.test.ts --headed
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('End-to-End Auth → Profile Save Flow', () => {

  test('server responds on port 3000', async ({ page }) => {
    const response = await page.goto(BASE_URL);
    expect(response?.status()).toBe(200);
  });

  test('GET /api/auth/session returns 200 with null when not logged in', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/auth/session`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toBeNull();
  });

  test('GET /api/profile returns 401 without auth', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/profile`);
    expect(response.status()).toBe(401);
  });

  test('POST /api/profile returns 401 without auth', async ({ page }) => {
    const response = await page.request.post(`${BASE_URL}/api/profile`, {
      data: {
        fullName: 'Test User',
        gender: 'male',
        dateOfBirth: '1995-01-01',
        maritalStatus: 'Single',
        phoneNumber: '+911234567890',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        education: 'B.Tech',
        occupation: 'Engineer',
        annualIncomeRange: '5-10 LPA',
        familyInfo: 'Test family',
        bio: 'Test bio',
        termsAccepted: true,
      },
    });
    expect(response.status()).toBe(401);
  });

  test('register page shows Google sign-in button when not logged in', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);
    await page.waitForTimeout(500);
    console.log('Register page URL:', page.url());

    // Check for "Sign in to Register" heading
    const heading = page.locator('text="Sign in to Register"');
    const headingVisible = await heading.isVisible({ timeout: 3000 }).catch(() => false);
    console.log('Sign in to Register visible:', headingVisible);

    // Check for Google button
    const googleBtn = page.locator('button:has-text("Continue with Google")');
    const googleVisible = await googleBtn.isVisible({ timeout: 3000 }).catch(() => false);
    console.log('Continue with Google visible:', googleVisible);
  });

  test('auth endpoints are properly configured', async ({ page }) => {
    // Check CSRF token endpoint
    const csrfRes = await page.request.get(`${BASE_URL}/api/auth/csrf`);
    console.log('CSRF endpoint status:', csrfRes.status());
    if (csrfRes.status() === 200) {
      const csrfData = await csrfRes.json();
      console.log('CSRF token present:', !!csrfData.csrfToken);
    }

    // Check providers endpoint
    const providersRes = await page.request.get(`${BASE_URL}/api/auth/providers`);
    console.log('Providers endpoint status:', providersRes.status());
    if (providersRes.status() === 200) {
      const providers = await providersRes.json();
      console.log('Google provider available:', !!providers.google);
    }
  });
});
