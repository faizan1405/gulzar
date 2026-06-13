import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getProfileByUserId, upsertProfile, getUserPurchases, testDbConnection, getValidObjectId } from '@/lib/profileStore';
import { prisma } from '@/lib/db';

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
    const isSecondMarriage = profile.maritalStatus !== 'Single';
    const isHighProfile = 
      profile.occupation.toLowerCase().includes('doctor') ||
      profile.occupation.toLowerCase().includes('engineer') ||
      profile.occupation.toLowerCase().includes('business') ||
      profile.annualIncomeRange.includes('₹10 LPA') ||
      profile.annualIncomeRange.includes('₹15 LPA') ||
      profile.annualIncomeRange.includes('Above');

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
    
    // Support simulator headers
    const simulatedUserId = req.headers.get('x-simulator-user-id');
    const simulatedPaid = req.headers.get('x-simulator-paid') === 'true';
    const simulatedPackagesHeader = req.headers.get('x-simulator-packages') || '';
    const simulatedPackages = simulatedPackagesHeader.split(',').map(p => p.trim());
    const simulatedHighProfileApproved = req.headers.get('x-simulator-high-profile-approved') === 'true';

    const viewerId = session?.user?.id || simulatedUserId;
    if (viewerId) {
      const viewerProfile = await getProfileByUserId(viewerId);
      if (viewerProfile) {
        viewerHasPaid = viewerProfile.hasPaid;
        viewerPurchases = await getUserPurchases(viewerProfile.id);
      }
    }

    const hasStandardPkg = viewerHasPaid || hasPaid300Check() || simulatedPaid;
    const hasSecondMarriagePkg = viewerPurchases.some(p => p.packageType === 'SECOND_MARRIAGE' && p.paymentStatus === 'PAID') || simulatedPackages.includes('SECOND_MARRIAGE');
    const hasHighProfilePkg = viewerPurchases.some(p => p.packageType === 'HIGH_PROFILE' && p.paymentStatus === 'PAID' && p.eligibilityStatus === 'APPROVED') || (simulatedPackages.includes('HIGH_PROFILE') && simulatedHighProfileApproved);

    function hasPaid300Check() {
      return viewerPurchases.some(p => p.packageType === 'STANDARD' && p.paymentStatus === 'PAID');
    }

    // Enforce privacy constraints
    const isAuthorizedForSecondMarriage = isOwner || isAdmin || hasSecondMarriagePkg;
    const isAuthorizedForHighProfile = isOwner || isAdmin || hasHighProfilePkg;
    const isAuthorizedForStandard = isOwner || isAdmin || hasStandardPkg;

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
              metadata: JSON.stringify({ isSecondMarriage, isHighProfile, authorized: isAuthorizedForStandard }),
            }
          });
        } catch {}
      }
    }

    if (isSecondMarriage && !isAuthorizedForSecondMarriage) {
      return NextResponse.json({
        profile: {
          id: profile.id,
          fullName: 'Second-Marriage Candidate (Locked)',
          gender: profile.gender,
          dateOfBirth: new Date(1900, 0, 1),
          maritalStatus: profile.maritalStatus,
          city: profile.city,
          state: profile.state,
          country: profile.country,
          education: 'Hidden (Second-Marriage Plan Required)',
          occupation: 'Hidden',
          annualIncomeRange: 'Hidden',
          bio: 'This profile is in the private second-marriage category. Purchase the Second-Marriage Package to unlock full access.',
          themeColor: profile.themeColor,
          verificationStatus: profile.verificationStatus,
          profileCompletionStatus: profile.profileCompletionStatus,
          createdAt: profile.createdAt,
          phoneNumber: '+91-XXXXX-XXXXX',
          latitude: null,
          longitude: null,
          isLockedCategory: 'SECOND_MARRIAGE'
        }
      });
    }

    if (isHighProfile && !isAuthorizedForHighProfile) {
      return NextResponse.json({
        profile: {
          id: profile.id,
          fullName: 'High-Profile Candidate (Locked)',
          gender: profile.gender,
          dateOfBirth: new Date(1900, 0, 1),
          maritalStatus: profile.maritalStatus,
          city: profile.city,
          state: profile.state,
          country: profile.country,
          education: 'Hidden (High-Profile Plan & Approval Required)',
          occupation: 'Hidden',
          annualIncomeRange: 'Hidden',
          bio: 'This profile is in the private high-profile category. Purchase the High-Profile Match Package and complete eligibility review to unlock.',
          themeColor: profile.themeColor,
          verificationStatus: profile.verificationStatus,
          profileCompletionStatus: profile.profileCompletionStatus,
          createdAt: profile.createdAt,
          phoneNumber: '+91-XXXXX-XXXXX',
          latitude: null,
          longitude: null,
          isLockedCategory: 'HIGH_PROFILE'
        }
      });
    }

    if (!isAuthorizedForStandard) {
      // Return redacted profile
      return NextResponse.json({
        profile: {
          id: profile.id,
          fullName: 'Profile Locked',
          gender: profile.gender,
          dateOfBirth: new Date(1900, 0, 1), // Redacted
          maritalStatus: profile.maritalStatus,
          city: profile.city,
          areaOrLocality: profile.areaOrLocality,
          state: profile.state,
          country: profile.country,
          education: profile.education,
          occupation: profile.occupation,
          annualIncomeRange: profile.annualIncomeRange,
          bio: profile.bio,
          themeColor: profile.themeColor,
          verificationStatus: profile.verificationStatus,
          profileCompletionStatus: profile.profileCompletionStatus,
          createdAt: profile.createdAt,
          phoneNumber: '+91-XXXXX-XXXXX',
          latitude: null,
          longitude: null,

          // Matrimonial identity fields
          maslak: profile.maslak,
          fiqh: profile.fiqh,
          biradari: profile.biradari,
          district: profile.district,
          locality: profile.locality,
          preferredLocations: profile.preferredLocations || [],
          sameCastePreference: profile.sameCastePreference,
          sameMaslakPreference: profile.sameMaslakPreference,
          noCastePreference: profile.noCastePreference,
          noMaslakPreference: profile.noMaslakPreference,
          willingToRelocate: profile.willingToRelocate,
        }
      });
    }


    return NextResponse.json({ profile });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// Create or update matrimonial profile
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    // Support simulated login as well for easy testing
    const simulatedUserId = req.headers.get('x-simulator-user-id');
    const activeUserId = session?.user?.id || simulatedUserId;

    if (!activeUserId) {
      return NextResponse.json({ error: 'Authentication Required' }, { status: 401 });
    }

    const body = await req.json();

    // 1. Server-side validation
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
      'annualIncomeRange',
      'familyInfo',
      'bio'
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Field '${field}' is required.` }, { status: 400 });
      }
    }

    // 2. Age limit verification (Restricted to eligible adults >= 18)
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
    return NextResponse.json({ success: true, profile });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
