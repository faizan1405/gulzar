import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  hasCompletedOnboarding,
  hasActivePackage,
  getViewerPackageAccess,
  canViewFullProfile,
  buildProfilePreview,
  LOCK_REASONS,
} from '../src/lib/accessControl';

const HOUR = 60 * 60 * 1000;
const future = (ms: number) => new Date(Date.now() + ms);
const past = (ms: number) => new Date(Date.now() - ms);

function purchase(overrides: Record<string, unknown> = {}) {
  return {
    packageType: 'monthly_membership',
    paymentStatus: 'PAID',
    accessStatus: 'ACTIVE',
    expiryDate: null as Date | string | null,
    eligibilityStatus: 'APPROVED',
    ...overrides,
  };
}

describe('hasCompletedOnboarding', () => {
  test('null profile -> false', () => {
    assert.equal(hasCompletedOnboarding(null), false);
  });
  test('incomplete profile -> false', () => {
    assert.equal(hasCompletedOnboarding({ profileCompletionStatus: 'INCOMPLETE' }), false);
  });
  test('complete profile -> true', () => {
    assert.equal(hasCompletedOnboarding({ profileCompletionStatus: 'COMPLETE' }), true);
  });
});

describe('hasActivePackage — expiry and status must gate access', () => {
  test('no purchases -> false', () => {
    assert.equal(hasActivePackage([]), false);
  });
  test('PAID + ACTIVE + no expiry -> true (one-time packages)', () => {
    assert.equal(hasActivePackage([purchase({ expiryDate: null })]), true);
  });
  test('PAID + ACTIVE + future expiry -> true', () => {
    assert.equal(hasActivePackage([purchase({ expiryDate: future(30 * 24 * HOUR) })]), true);
  });
  test('PAID + ACTIVE + PAST expiry -> false (expired subscriber falls back to limited)', () => {
    assert.equal(hasActivePackage([purchase({ expiryDate: past(HOUR) })]), false);
  });
  test('PENDING payment -> false', () => {
    assert.equal(hasActivePackage([purchase({ paymentStatus: 'PENDING' })]), false);
  });
  test('REVOKED access status -> false, even if payment is PAID and not expired', () => {
    assert.equal(hasActivePackage([purchase({ accessStatus: 'REVOKED', expiryDate: future(HOUR) })]), false);
  });
});

describe('getViewerPackageAccess — per-package, expiry-aware, not fragile string matching', () => {
  test('an expired monthly membership purchase no longer counts (unless the profile hasPaid flag says otherwise)', () => {
    const access = getViewerPackageAccess(
      { hasPaid: false },
      [purchase({ packageType: 'monthly_membership', expiryDate: past(HOUR) })]
    );
    assert.equal(access.hasStandard, false);
  });

  test('an expired Good Profile package purchase no longer grants Good Profile access', () => {
    const access = getViewerPackageAccess(
      { hasPaid: true },
      [purchase({ packageType: 'good_profile_package', expiryDate: past(HOUR) })]
    );
    assert.equal(access.hasGoodProfile, false);
  });

  test('an expired Second Marriage package purchase no longer grants access', () => {
    const access = getViewerPackageAccess(
      { hasPaid: true },
      [purchase({ packageType: 'second_marriage_package', expiryDate: past(HOUR) })]
    );
    assert.equal(access.hasSecondMarriage, false);
  });

  test('High Profile package requires PAID + ACTIVE + APPROVED eligibility + not expired, all four', () => {
    const base = { packageType: 'high_profile_package', paymentStatus: 'PAID', accessStatus: 'ACTIVE', eligibilityStatus: 'APPROVED', expiryDate: future(HOUR) };
    assert.equal(getViewerPackageAccess(null, [purchase(base)]).hasHighProfile, true);
    assert.equal(getViewerPackageAccess(null, [purchase({ ...base, eligibilityStatus: 'PENDING' })]).hasHighProfile, false, 'unapproved eligibility must not unlock');
    assert.equal(getViewerPackageAccess(null, [purchase({ ...base, accessStatus: 'REVOKED' })]).hasHighProfile, false);
    assert.equal(getViewerPackageAccess(null, [purchase({ ...base, expiryDate: past(HOUR) })]).hasHighProfile, false);
  });

  test('a Good Profile purchase does not also unlock Second Marriage or High Profile (no implicit hierarchy)', () => {
    const access = getViewerPackageAccess(
      { hasPaid: true },
      [purchase({ packageType: 'good_profile_package', expiryDate: future(HOUR) })]
    );
    assert.equal(access.hasGoodProfile, true);
    assert.equal(access.hasSecondMarriage, false);
    assert.equal(access.hasHighProfile, false);
  });

  test('package matching keys off the exact packageType string, not a display-name lookalike', () => {
    // "Gold Package" is the display label for high_profile_package — passing the
    // label instead of the stable key must NOT match.
    const access = getViewerPackageAccess(null, [purchase({ packageType: 'Gold Package', expiryDate: future(HOUR) })]);
    assert.equal(access.hasHighProfile, false);
  });
});

describe('canViewFullProfile — required gates in order', () => {
  test('not logged in', () => {
    const r = canViewFullProfile(null, []);
    assert.deepEqual(r, { allowed: false, reason: LOCK_REASONS.NOT_LOGGED_IN });
  });
  test('logged in but registration incomplete', () => {
    const r = canViewFullProfile({ profileCompletionStatus: 'INCOMPLETE' }, []);
    assert.equal(r.allowed, false);
    assert.equal(r.reason, LOCK_REASONS.FORM_INCOMPLETE);
  });
  test('registered but no active package', () => {
    const r = canViewFullProfile({ profileCompletionStatus: 'COMPLETE' }, []);
    assert.equal(r.allowed, false);
    assert.equal(r.reason, LOCK_REASONS.NO_PACKAGE);
  });
  test('registered, expired package -> still NO_PACKAGE (falls back to limited)', () => {
    const r = canViewFullProfile({ profileCompletionStatus: 'COMPLETE' }, [purchase({ expiryDate: past(HOUR) })]);
    assert.equal(r.allowed, false);
    assert.equal(r.reason, LOCK_REASONS.NO_PACKAGE);
  });
  test('registered + active package -> allowed', () => {
    const r = canViewFullProfile({ profileCompletionStatus: 'COMPLETE' }, [purchase({ expiryDate: future(HOUR) })]);
    assert.equal(r.allowed, true);
    assert.equal(r.reason, LOCK_REASONS.ALLOWED);
  });
});

describe('buildProfilePreview — the not-logged-in / no-package preview payload', () => {
  test('always shows the real name, even for premium categories', () => {
    for (const category of ['normal', 'good_profile', 'second_marriage', 'high_profile']) {
      const preview = buildProfilePreview({
        id: 'p1',
        fullName: 'Imran Qureshi',
        gender: 'Male',
        dateOfBirth: '1995-01-01',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        maslak: 'Sunni',
        biradari: 'Qureshi',
        category,
        phoneNumber: '+919999999999',
        education: 'B.Tech',
        occupation: 'Engineer',
        profileImageUrl: 'https://example.com/x.jpg',
      });
      assert.equal(preview.fullName, 'Imran Qureshi', `category=${category}`);
    }
  });

  test('never leaks contact/private fields', () => {
    const preview: any = buildProfilePreview({
      id: 'p1',
      fullName: 'Imran Qureshi',
      phoneNumber: '+919999999999',
      education: 'B.Tech',
      occupation: 'Engineer',
      annualIncomeRange: '₹20 LPA',
      familyInfo: 'secret family info',
      profileImageUrl: 'https://example.com/x.jpg',
      category: 'high_profile',
    });
    assert.equal(preview.phoneNumber, undefined);
    assert.equal(preview.education, undefined);
    assert.equal(preview.occupation, undefined);
    assert.equal(preview.annualIncomeRange, undefined);
    assert.equal(preview.familyInfo, undefined);
    assert.equal(preview.profileImageUrl, undefined);
  });
});
