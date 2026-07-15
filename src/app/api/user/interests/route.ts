import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getSentInterests, getReceivedInterests, sendInterest, respondToInterest, withdrawInterest } from '@/lib/services/interestService';
import { redactProfile } from '@/lib/profilePrivacy';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type'); // 'sent' or 'received'
    const skip = parseInt(searchParams.get('skip') || '0');
    const take = parseInt(searchParams.get('take') || '20');

    let result;
    if (type === 'sent') {
      result = await getSentInterests(session.user.id, skip, take);
    } else {
      result = await getReceivedInterests(session.user.id, skip, take);
    }

    // Check viewer's package for privacy redaction
    const viewerProfile = await prisma.matrimonialProfile.findUnique({
      where: { userId: session.user.id },
      include: { purchases: { where: { paymentStatus: 'PAID', accessStatus: 'ACTIVE' } } }
    });

    const hasStandardPkg = viewerProfile?.purchases?.some(p => p.packageType === 'monthly_membership') || false;
    const hasSecondMarriagePkg = viewerProfile?.purchases?.some(p => p.packageType === 'second_marriage_package') || false;
    const hasHighProfilePkg = viewerProfile?.purchases?.some(p => p.packageType === 'high_profile_package' && p.eligibilityStatus === 'APPROVED') || false;
    const hasGoodProfilePkg = viewerProfile?.purchases?.some(p => p.packageType === 'good_profile_package') || false;
    const isAdmin = session.user.role === 'ADMIN';

    // Redact profiles
    const redactedRequests = (result.requests || []).map((r: any) => {
      const profileToRedact = type === 'sent' ? r.receiver : r.sender;
      
      const redactedProfile = redactProfile(
        profileToRedact,
        hasStandardPkg,
        hasSecondMarriagePkg,
        hasHighProfilePkg,
        hasGoodProfilePkg,
        false,
        isAdmin
      );

      if (type === 'sent') {
        return { ...r, receiver: redactedProfile };
      } else {
        return { ...r, sender: redactedProfile };
      }
    });

    return NextResponse.json({ ...result, requests: redactedRequests });
  } catch (error) {
    console.error('Error fetching interests:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action, receiverProfileId, message, requestId } = body;

    let result;
    if (action === 'SEND') {
      if (!receiverProfileId) return NextResponse.json({ error: 'receiverProfileId required' }, { status: 400 });
      result = await sendInterest(session.user.id, receiverProfileId, message);
    } else if (action === 'ACCEPT' || action === 'REJECT') {
      if (!requestId) return NextResponse.json({ error: 'requestId required' }, { status: 400 });
      result = await respondToInterest(session.user.id, requestId, action);
    } else if (action === 'WITHDRAW') {
      if (!requestId) return NextResponse.json({ error: 'requestId required' }, { status: 400 });
      result = await withdrawInterest(session.user.id, requestId);
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error modifying interest:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
