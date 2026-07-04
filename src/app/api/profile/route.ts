import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getProfileByUserId, upsertProfile, getUserPurchases, testDbConnection, getValidObjectId } from '@/lib/profileStore';
import { prisma } from '@/lib/db';
import { redactProfile } from '@/lib/profilePrivacy';
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

    if (!profile) {
      return NextResponse.json({ profile: null }, { status: 200 });
    }

    // Identify profile categories
    const profileCat = (profile as any).category || '';
    const isSecondMarriage = profile.maritalStatus !== 'Single' || profileCat === 'second_marriage';
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

    function hasPaidSubscriptionCheck() {
      return viewerPurchases.some(p => p.packageType === 'monthly_membership' && p.paymentStatus === 'PAID');
    }

    const hasStandardPkg = viewerHasPaid || hasPaidSubscriptionCheck();
    const hasSecondMarriagePkg = viewerPurchases.some(p => p.packageType === 'second_marriage_package' && p.paymentStatus === 'PAID');
    const hasHighProfilePkg = viewerPurchases.some(p => p.packageType === 'high_profile_package' && p.paymentStatus === 'PAID' && p.eligibilityStatus === 'APPROVED');
    const hasGoodProfilePkg = viewerPurchases.some(p => p.packageType === 'good_profile_package' && p.paymentStatus === 'PAID');

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

    // 2. Validate age (Must be 18+)
    const dob = new Date(body.dateOfBirth);
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
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
