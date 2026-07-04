import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getProfileByUserId, upsertProfile, getUserPurchases, testDbConnection, getValidObjectId } from '@/lib/profileStore';
import { prisma } from '@/lib/db';
import { redactProfile } from '@/lib/profilePrivacy';
import { getViewerPackageAccess } from '@/lib/accessControl';
import { notifyRegistration, notifyAdminNewProfile } from '@/lib/notifications';
import { checkRateLimit } from '@/lib/rateLimit';

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

    // Fetch user details from database to include in response, handling database-offline gracefully
    let userDetails = null;
    const isDb = await testDbConnection();
    if (isDb) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: targetUserId },
          include: { accounts: true }
        });
        if (user) {
          userDetails = {
            name: user.name,
            email: user.email,
            createdAt: user.createdAt.toISOString(),
            providers: user.accounts.map(a => a.provider)
          };
        }
      } catch (e) {
        console.error('Failed to fetch user details:', e);
      }
    }

    if (!userDetails && !isDb) {
      // In-memory fallback/demo details
      userDetails = {
        name: session?.user?.name || 'Demo User',
        email: session?.user?.email || 'demo@example.com',
        createdAt: new Date().toISOString(),
        providers: ['google']
      };
    }

    if (!profile) {
      return NextResponse.json({ 
        profile: null,
        user: userDetails
      }, { status: 200 });
    }

    // Identify profile category strictly from the stable, admin-assigned
    // `category` field — never infer from occupation/income text or marital
    // status (fragile substring matching misclassifies profiles).
    const profileCat = (profile as any).category || '';
    const isSecondMarriage = profileCat === 'second_marriage';
    const isHighProfile = profileCat === 'high_profile';
    const isGoodProfile = profileCat === 'good_profile';

    // Security check: is the current user allowed to see private fields?
    const isOwner = session?.user?.id === targetUserId;
    const isAdmin = session?.user?.role === 'ADMIN';

    // Fetch viewer profile and purchases to check status. Shared, expiry/
    // accessStatus-aware helper — the same one the list and detail routes use.
    let viewerProfileForAccess: Awaited<ReturnType<typeof getProfileByUserId>> = null;
    let viewerPurchases: Awaited<ReturnType<typeof getUserPurchases>> = [];

    const viewerId = session?.user?.id;
    if (viewerId) {
      viewerProfileForAccess = await getProfileByUserId(viewerId);
      if (viewerProfileForAccess) {
        viewerPurchases = await getUserPurchases(viewerProfileForAccess.id);
      }
    }

    const {
      hasStandard: hasStandardPkg,
      hasSecondMarriage: hasSecondMarriagePkg,
      hasHighProfile: hasHighProfilePkg,
      hasGoodProfile: hasGoodProfilePkg,
    } = getViewerPackageAccess(viewerProfileForAccess, viewerPurchases);

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

    return NextResponse.json({
      profile: redactedProfile,
      isSecondMarriage,
      isHighProfile,
      isGoodProfile,
      user: userDetails,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// Create or update user profile
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const activeUserId = session?.user?.id;

    if (!activeUserId) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    // Rate Limiting (prevent spamming profile updates)
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const limitExceeded = checkRateLimit(`profile_post_${ip}`, 10, 60 * 1000); // Max 10 requests per minute
    if (limitExceeded) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await req.json();

    // 1. Mandatory validations
    if (!body.fullName || !body.gender || !body.dateOfBirth || !body.phoneNumber) {
      return NextResponse.json({ error: 'Required fields are missing: fullName, gender, dateOfBirth, phoneNumber' }, { status: 400 });
    }

    // 2. Validate date and age (Must be 18+)
    const normalizedDateOfBirth = new Date(`${body.dateOfBirth}T00:00:00.000Z`);

    if (!body.dateOfBirth || Number.isNaN(normalizedDateOfBirth.getTime())) {
      return NextResponse.json({ error: 'Invalid date of birth' }, { status: 400 });
    }

    body.dateOfBirth = normalizedDateOfBirth;
    const dob = normalizedDateOfBirth;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    if (age < 18) {
      return NextResponse.json({ error: 'Registration is restricted to eligible adults (18 years and older).' }, { status: 400 });
    }

    // 3. Save profile
    const profile = await upsertProfile(activeUserId, body);

    // 4. Send Notifications (fire-and-forget)
    try {
      const userEmail = session?.user?.email || null;
      notifyRegistration(userEmail, profile.phoneNumber, profile.fullName);
      notifyAdminNewProfile(profile);
    } catch (e) {
      console.error('Registration notifications failed to fire:', e);
    }

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error('Profile upsert failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unable to save your profile. Please try again.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
