import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { redactProfile } from '../src/lib/profilePrivacy';
import type { Profile } from '../src/types';

// A protected/private field must never survive redaction unless the viewer is
// fully authorized (owner/admin/matching package).
const PROTECTED_KEYS = [
  'phoneNumber',
  'education',
  'occupation',
  'annualIncomeRange',
  'familyInfo',
  'profileImageUrl',
] as const;

function baseProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    id: 'profile-1',
    userId: 'user-1',
    fullName: 'Ayesha Siddiqui',
    gender: 'Female',
    dateOfBirth: '1998-05-15',
    maritalStatus: 'Single',
    phoneNumber: '+919876543210',
    city: 'Lucknow',
    areaOrLocality: 'Hazratganj',
    state: 'Uttar Pradesh',
    country: 'India',
    education: 'MBA',
    occupation: 'Software Engineer',
    annualIncomeRange: '₹5 LPA - ₹10 LPA',
    familyInfo: 'Father is a govt. officer, mother is a homemaker.',
    bio: 'Looking for a practicing, family-oriented partner.',
    themeColor: 'hsl(150, 45%, 18%)',
    verificationStatus: 'APPROVED',
    profileCompletionStatus: 'COMPLETE',
    createdAt: '2026-01-01T00:00:00.000Z',
    maslak: 'Sunni Hanafi',
    fiqh: 'Hanafi',
    biradari: 'Sheikh',
    district: 'Lucknow',
    locality: 'Hazratganj',
    preferredLocations: [],
    profileImageUrl: 'https://example.com/photo.jpg',
    profileImageStatus: 'APPROVED',
    category: 'normal',
    hasPaid: false,
    ...overrides,
  } as Profile;
}

// No package flags active — used for "guest" / "no package" scenarios.
const NO_ACCESS = [false, false, false, false] as const;

describe('redactProfile — limited preview (guest / no package)', () => {
  test('normal profile shows real name, age-computable DOB, caste and coarse city/state', () => {
    const result: any = redactProfile(baseProfile(), ...NO_ACCESS, false, false);
    assert.equal(result.fullName, 'Ayesha Siddiqui');
    assert.equal(result.dateOfBirth, '1998-05-15');
    assert.equal(result.biradari, 'Sheikh');
    assert.equal(result.city, 'Lucknow');
    assert.equal(result.state, 'Uttar Pradesh');
  });

  test('normal profile hides every protected field', () => {
    const result: any = redactProfile(baseProfile(), ...NO_ACCESS, false, false);
    for (const key of PROTECTED_KEYS) {
      assert.equal(result[key], key === 'phoneNumber' ? '+91-XXXXX-XXXXX' : undefined, `${key} must be redacted`);
    }
    assert.equal(result.areaOrLocality, null);
  });

  for (const category of ['good_profile', 'second_marriage', 'high_profile'] as const) {
    test(`${category} profile still shows real name/age/caste — never masked for being premium`, () => {
      const result: any = redactProfile(baseProfile({ category }), ...NO_ACCESS, false, false);
      assert.equal(result.fullName, 'Ayesha Siddiqui', 'name must never be masked for a premium category');
      assert.notEqual(result.fullName, 'Protected Candidate Profile');
      assert.ok(!String(result.fullName).includes('Locked'));
      assert.ok(!String(result.fullName).startsWith('Profile #RF-'));
      assert.equal(result.dateOfBirth, '1998-05-15');
      assert.equal(result.biradari, 'Sheikh');
      assert.equal(result.isLocked, true);
      assert.equal(result.isLockedCategory, `${category}_package`);
    });

    test(`${category} profile hides every protected field for an unauthorized viewer`, () => {
      const result: any = redactProfile(baseProfile({ category }), ...NO_ACCESS, false, false);
      for (const key of PROTECTED_KEYS) {
        assert.equal(result[key], key === 'phoneNumber' ? '+91-XXXXX-XXXXX' : undefined, `${key} must be redacted`);
      }
    });
  }
});

describe('redactProfile — package matching (stable category field, not fragile text matching)', () => {
  test('a Good Profile category profile with an occupation/income that resembles High Profile text is NOT locked behind High Profile', () => {
    // Regression test: income ranges like "₹5 LPA - ₹10 LPA" contain the
    // substring "₹10 LPA" and occupations can contain words like "business" —
    // the old fragile substring matching misclassified these as High Profile.
    const profile = baseProfile({
      category: 'good_profile',
      occupation: 'Business Development Executive',
      annualIncomeRange: '₹5 LPA - ₹10 LPA',
    });
    // Viewer has Standard + Good Profile package, but NOT High Profile.
    const result: any = redactProfile(profile, true, false, false, true, false, false);
    assert.equal(result.isLocked, undefined, 'should be fully unlocked via the Good Profile package');
    assert.equal(result.occupation, 'Business Development Executive');
    assert.equal(result.annualIncomeRange, '₹5 LPA - ₹10 LPA');
  });

  test('a normal category profile whose income range text contains "₹10 LPA" is NOT locked behind High Profile', () => {
    // Regression test using the exact shape found in production fallback data:
    // category "normal", income "₹5 LPA - ₹10 LPA" (contains the substring
    // "₹10 LPA" that the old heuristic matched against).
    const profile = baseProfile({
      category: 'normal',
      occupation: 'Senior Clerk',
      annualIncomeRange: '₹5 LPA - ₹10 LPA',
    });
    // Viewer only has the Standard monthly membership.
    const result: any = redactProfile(profile, true, false, false, false, false, false);
    assert.equal(result.isLocked, undefined, 'a normal-category profile must unlock with just the standard package');
    assert.equal(result.occupation, 'Senior Clerk');
  });

  test('Second Marriage category is decided by category field, not marital status text', () => {
    // Divorced/widowed but explicitly categorized "normal" by admin.
    const profile = baseProfile({ category: 'normal', maritalStatus: 'Divorced' });
    const result: any = redactProfile(profile, true, false, false, false, false, false);
    assert.equal(result.isLocked, undefined, 'marital status alone must not force the Second-Marriage lock');
    assert.equal(result.occupation, 'Software Engineer');
  });

  test('correct-package subscriber sees full details for their matching category', () => {
    const profile = baseProfile({ category: 'second_marriage' });
    // hasStandard, hasSecondMarriage
    const result: any = redactProfile(profile, true, true, false, false, false, false);
    assert.equal(result.isLocked, undefined);
    assert.equal(result.phoneNumber, '+919876543210');
    assert.equal(result.occupation, 'Software Engineer');
    assert.equal(result.profileImageUrl, 'https://example.com/photo.jpg');
  });

  test('wrong-package subscriber stays locked with the correct required-package label', () => {
    const profile = baseProfile({ category: 'high_profile' });
    // Viewer has Standard + Second Marriage, but not High Profile.
    const result: any = redactProfile(profile, true, true, false, false, false, false);
    assert.equal(result.isLocked, true);
    assert.equal(result.isLockedCategory, 'high_profile_package');
    assert.equal(result.phoneNumber, '+91-XXXXX-XXXXX');
    assert.equal(result.fullName, 'Ayesha Siddiqui', 'name stays visible even though the category is locked');
  });

  test('Good Profile package does not grant Second Marriage or High Profile access', () => {
    const secondMarriageProfile = baseProfile({ category: 'second_marriage' });
    const highProfileProfile = baseProfile({ category: 'high_profile' });
    // hasStandard + hasGoodProfile only.
    const r1: any = redactProfile(secondMarriageProfile, true, false, false, true, false, false);
    const r2: any = redactProfile(highProfileProfile, true, false, false, true, false, false);
    assert.equal(r1.isLocked, true);
    assert.equal(r2.isLocked, true);
  });
});

describe('redactProfile — photo approval gate', () => {
  test('authorized viewer does not get the real photo until admin-approved', () => {
    const profile = baseProfile({ profileImageStatus: 'PENDING' });
    const result: any = redactProfile(profile, true, false, false, false, false, false);
    assert.equal(result.profileImageUrl, undefined);
  });

  test('owner always sees their own pending photo', () => {
    const profile = baseProfile({ profileImageStatus: 'PENDING' });
    const result: any = redactProfile(profile, false, false, false, false, true, false);
    assert.equal(result.profileImageUrl, 'https://example.com/photo.jpg');
  });

  test('admin always sees the real photo regardless of approval state', () => {
    const profile = baseProfile({ profileImageStatus: 'PENDING' });
    const result: any = redactProfile(profile, false, false, false, false, false, true);
    assert.equal(result.profileImageUrl, 'https://example.com/photo.jpg');
  });
});

describe('redactProfile — owner/admin bypass', () => {
  test('owner always sees their own full profile', () => {
    const result: any = redactProfile(baseProfile({ category: 'high_profile' }), ...NO_ACCESS, true, false);
    assert.equal(result.isLocked, undefined);
    assert.equal(result.phoneNumber, '+919876543210');
  });

  test('admin always sees full profile regardless of category', () => {
    const result: any = redactProfile(baseProfile({ category: 'good_profile' }), ...NO_ACCESS, false, true);
    assert.equal(result.isLocked, undefined);
    assert.equal(result.occupation, 'Software Engineer');
  });
});
