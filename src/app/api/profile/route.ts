import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getProfileByUserId, getUserPurchases, testDbConnection, getValidObjectId, upsertProfile } from '@/lib/profileStore';
import { prisma } from '@/lib/db';
import { redactProfile } from '@/lib/profilePrivacy';
import { notifyRegistration, notifyAdminNewProfile } from '@/lib/notifications';
import { checkRateLimitByName, checkRateLimit, buildRateLimitHeaders } from '@/lib/rateLimit';
import { escapeHTML } from '@/lib/sanitize';
import { csrfGuard } from '@/lib/csrfGuard';
import { safeJsonBody } from '@/lib/requestUtils';
import {
  hasPaidAccess,
  hasSecondMarriagePackage,
  hasHighProfilePackage,
  hasGoodProfilePackage,
  hasStandardPackage,
} from '@/lib/packageAccess';

// Get user profile
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limit by user ID (not IP)
    const pvResult = await checkRateLimit(`profile:${session.user.id}:get`, 60, 60_000);
    if (!pvResult.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please slow down.' },
        { status: 429, headers: buildRateLimitHeaders(pvResult) }
      );
    }

    const profile = await getProfileByUserId(session.user.id);

    if (!profile) {
      return NextResponse.json({ profile: null }, { status: 200 });
    }

    // Identify profile categories
    const profileCat = (profile as any).category || '';

    // Fetch viewer purchases (always the owner here)
    const viewerPurchases = await getUserPurchases(profile.id);

    const hasStandardPkg = hasPaidAccess({ hasPaid: profile.hasPaid ?? false }, viewerPurchases) ||
      hasStandardPackage(viewerPurchases);
    const hasSecondMarriagePkg = hasSecondMarriagePackage(viewerPurchases);
    const hasHighProfilePkg = hasHighProfilePackage(viewerPurchases);
    const hasGoodProfilePkg = hasGoodProfilePackage(viewerPurchases);

    // Enforce privacy constraints
    const redactedProfile = redactProfile(
      profile as any,
      hasStandardPkg,
      hasSecondMarriagePkg,
      hasHighProfilePkg,
      hasGoodProfilePkg,
      true, // isOwner
      false // isAdmin
    );

    // Log access
    if (session?.user?.id) {
      try {
        const isDb = await testDbConnection();
        if (isDb) {
          await prisma.auditLog.create({
            data: {
              actorUserId: getValidObjectId(session.user.id),
              action: 'VIEW_OWN_PROFILE',
              targetType: 'MatrimonialProfile',
              targetId: session.user.id,
              metadata: null,
            },
          });
        }
      } catch {
        // audit failures must not break the flow
      }
    }

    return NextResponse.json({ profile: redactedProfile });
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// Create or update matrimonial profile
export async function POST(req: NextRequest) {
  try {
    const csrfResult = await csrfGuard(req);
    if (csrfResult) return csrfResult;

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication Required' }, { status: 401 });
    }

    // Max 10 profile updates per minute per user ID
    const puResult = await checkRateLimit(`profile:${session.user.id}:update`, 10, 60_000);
    if (!puResult.allowed) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, {
        status: 429, headers: buildRateLimitHeaders(puResult),
      });
    }

    const bodyOrResponse = await safeJsonBody(req, { maxSizeKB: 100 });
    if (bodyOrResponse instanceof Response) return bodyOrResponse;
    const body = bodyOrResponse as any;

    if (body._honey) {
      // Honeypot check for bots pretending to be authenticated
      return NextResponse.json({ success: true });
    }

    // 1. Server-side validation
    if (body.termsAccepted !== true) {
      return NextResponse.json({ error: 'Please accept the Terms & Conditions before submitting.' }, { status: 400 });
    }

    const requiredFields = [
      'fullName',
      'gender',
      'dateOfBirth',
      'maritalStatus',
      'phoneNumber',
      'city',
      'areaOrLocality',
      'state',
      'country',
      'education',
      'occupation',
      'annualIncomeRange'
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Field '${field}' is required.` }, { status: 400 });
      }
    }

    // 1b. Input length limits
    const lengthLimits: Record<string, number> = {
      fullName: 100,
      city: 100,
      areaOrLocality: 200,
      state: 100,
      country: 100,
      education: 200,
      occupation: 200,
      annualIncomeRange: 100,
      familyInfo: 2000,
      bio: 5000,
    };
    for (const [field, maxLen] of Object.entries(lengthLimits)) {
      if (typeof body[field] === 'string' && body[field].length > maxLen) {
        return NextResponse.json(
          { error: `Field '${field}' exceeds maximum length of ${maxLen} characters.` },
          { status: 400 }
        );
      }
    }

    // 2. Age limit verification (Restricted to eligible adults >= 18)
    const dob = new Date(body.dateOfBirth);
    if (isNaN(dob.getTime())) {
      return NextResponse.json(
        { error: `Invalid date of birth: "${body.dateOfBirth}". Please provide a valid date.` },
        { status: 400 }
      );
    }
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    if (age < 18) {
      return NextResponse.json({ error: 'Registration is restricted to eligible adults (18 years and older).' }, { status: 400 });
    }

    // 3. Sanitize text inputs to prevent XSS
    const textFields = ['fullName', 'city', 'areaOrLocality', 'state', 'country', 'education', 'occupation', 'annualIncomeRange', 'familyInfo', 'bio'];
    for (const field of textFields) {
      if (body[field]) {
        body[field] = escapeHTML(String(body[field]));
      }
    }

    // 4. Save profile
    const profile = await upsertProfile(session.user.id, body);

    if (!profile) {
      return NextResponse.json({ error: 'Profile could not be saved. Please try again.' }, { status: 500 });
    }

    // 4. Send Notifications (fire-and-forget)
    try {
      const userEmail = session?.user?.email || null;
      notifyRegistration(userEmail, profile.phoneNumber, profile.fullName);
      notifyAdminNewProfile(profile);
    } catch (e) {
      console.error(
        `[NOTIFY FAILED] Registration notification failed for profileId=${profile.id} email=${session?.user?.email || 'unknown'}:`,
        e
      );
    }

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error('Failed to create/update profile:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
