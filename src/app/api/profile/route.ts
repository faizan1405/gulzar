import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getProfileByUserId, getUserPurchases, testDbConnection, getValidObjectId, upsertProfile } from '@/lib/profileStore';
import { prisma } from '@/lib/db';
import { redactProfile } from '@/lib/profilePrivacy';
import { notifyRegistration, notifyAdminNewProfile } from '@/lib/notifications';
import { checkRateLimit } from '@/lib/rateLimit';
import { escapeHTML } from '@/lib/sanitize';
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
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    // Default to the current logged-in user if no specific ID is requested
    const targetUserId = userId || session?.user?.id;

    if (!targetUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await getProfileByUserId(targetUserId);

    if (!profile) {
      return NextResponse.json({ profile: null }, { status: 200 });
    }

    // Identify profile categories
    const profileCat = (profile as any).category || '';
    const isSecondMarriage = (profile.maritalStatus !== 'Single' && profileCat !== '') || profileCat === 'second_marriage';
    const isHighProfile = 
      profileCat === 'high_profile' ||
      profile.occupation.toLowerCase().includes('doctor') ||
      profile.occupation.toLowerCase().includes('engineer') ||
      profile.occupation.toLowerCase().includes('business') ||
      profile.annualIncomeRange.includes('₹10 LPA') ||
      profile.annualIncomeRange.includes('₹15 LPA') ||
      profile.annualIncomeRange.includes('Above');

    const isGoodProfile = profileCat === 'good_profile';

    // Security check: is the current user allowed to see private fields?
    const isOwner = session?.user?.id === targetUserId;
    const isAdmin = session?.user?.role === 'ADMIN';

    // Fetch viewer profile and purchases to check status
    let viewerHasPaid = false;
    let viewerPurchases: Array<{
      id: string;
      packageType: string;
      paymentStatus: string;
      eligibilityStatus?: string;
    }> = [];

    const viewerId = session?.user?.id;
    if (viewerId) {
      const viewerProfile = await getProfileByUserId(viewerId);
      if (viewerProfile) {
        viewerHasPaid = viewerProfile.hasPaid;
        viewerPurchases = await getUserPurchases(viewerProfile.id);
      }
    }

    const hasStandardPkg = hasPaidAccess({ hasPaid: viewerHasPaid }, viewerPurchases) ||
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
      isOwner,
      isAdmin
    );

    // Log access where appropriate
    if (viewerId) {
      const isDb = await testDbConnection();
      const actionMsg = `VIEW_PROFILE_ATTEMPT_${targetUserId}`;
      if (isDb) {
        try {
          await prisma.auditLog.create({
            data: {
              actorUserId: getValidObjectId(viewerId),
              action: actionMsg,
              targetType: 'MatrimonialProfile',
              targetId: targetUserId,
              metadata: JSON.stringify({ isOwner, isAdmin }),
            }
          });
        } catch {}
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
    const ip = (req as any).ip || req.headers.get('x-forwarded-for') || 'anonymous';
    // Max 10 profile updates per minute per IP
    if (checkRateLimit(ip, 10, 60 * 1000)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication Required' }, { status: 401 });
    }

    const body = await req.json();

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
