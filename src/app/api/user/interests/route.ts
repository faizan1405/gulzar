import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getSentInterests, getReceivedInterests, sendInterest, respondToInterest, withdrawInterest } from '@/lib/services/interestService';
import { redactProfile } from '@/lib/profilePrivacy';
import { prisma } from '@/lib/db';
import { checkRateLimit } from '@/lib/rateLimit';
import { logAudit } from '@/lib/audit';
import {
  hasPaidAccess,
  hasStandardPackage,
  hasSecondMarriagePackage,
  hasHighProfilePackage,
  hasGoodProfilePackage,
} from '@/lib/packageAccess';

// Simple in-memory rate limiter for interest POST requests (max 10/min per user)
const interestPostRateLimitMap = new Map<string, { count: number; resetTime: number }>();
function checkInterestPostRateLimit(userId: string): boolean {
  const now = Date.now();
  const limit = 10;
  const windowMs = 60 * 1000;
  const record = interestPostRateLimitMap.get(userId);
  if (!record || now > record.resetTime) {
    interestPostRateLimitMap.set(userId, { count: 1, resetTime: now + windowMs });
    return false;
  }
  record.count += 1;
  return record.count > limit;
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limit GET by user ID
    if (checkRateLimit(`interests-get:${session.user.id}`, 30, 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many requests. Please slow down.' },
        { status: 429 }
      );
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
    const viewerPurchases = result.profileId
      ? await prisma.packagePurchase.findMany({
          where: { profileId: result.profileId, paymentStatus: 'PAID', accessStatus: 'ACTIVE' }
        })
      : [];

    const hasStandardPkg = hasStandardPackage(viewerPurchases);
    const hasSecondMarriagePkg = hasSecondMarriagePackage(viewerPurchases);
    const hasHighProfilePkg = hasHighProfilePackage(viewerPurchases);
    const hasGoodProfilePkg = hasGoodProfilePackage(viewerPurchases);
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

    if (checkInterestPostRateLimit(session.user.id)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a minute.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { action, receiverProfileId, message, requestId } = body;

    // Input length limits
    if (typeof message === 'string' && message.length > 2000) {
      return NextResponse.json({ error: 'Message too long (max 2000 characters).' }, { status: 400 });
    }

    let result;
    if (action === 'SEND') {
      if (!receiverProfileId) return NextResponse.json({ error: 'receiverProfileId required' }, { status: 400 });
      result = await sendInterest(session.user.id, receiverProfileId, message);
      if (result.success) {
        await logAudit({ actorUserId: session.user.id, action: 'INTEREST_SEND', targetType: 'Interest', targetId: receiverProfileId, metadata: null });
      }
    } else if (action === 'ACCEPT' || action === 'REJECT') {
      if (!requestId) return NextResponse.json({ error: 'requestId required' }, { status: 400 });
      result = await respondToInterest(session.user.id, requestId, action);
      if (result.success) {
        await logAudit({ actorUserId: session.user.id, action: `INTEREST_${action}`, targetType: 'Interest', targetId: requestId, metadata: null });
      }
    } else if (action === 'WITHDRAW') {
      if (!requestId) return NextResponse.json({ error: 'requestId required' }, { status: 400 });
      result = await withdrawInterest(session.user.id, requestId);
      if (result.success) {
        await logAudit({ actorUserId: session.user.id, action: 'INTEREST_WITHDRAW', targetType: 'Interest', targetId: requestId, metadata: null });
      }
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
