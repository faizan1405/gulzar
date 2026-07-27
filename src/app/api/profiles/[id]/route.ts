import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getProfileById, getProfileByUserId, getUserPurchases } from '@/lib/profileStore';
import { redactProfile } from '@/lib/profilePrivacy';
import {
  canViewFullProfile,
  getViewerPackageAccess,
  buildProfilePreview,
  LOCK_MESSAGES,
  LOCK_REASONS,
} from '@/lib/accessControl';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;

  try {
    const targetProfile = await getProfileById(id);

    if (!targetProfile || targetProfile.verificationStatus !== 'APPROVED') {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const session = await auth();
    const viewerId = session?.user?.id;
    const isAdmin = session?.user?.role === 'ADMIN';

    if (isAdmin) {
      return NextResponse.json({ profile: targetProfile, locked: false });
    }

    const isOwner = viewerId ? viewerId === targetProfile.userId : false;
    if (isOwner) {
      return NextResponse.json({ profile: targetProfile, locked: false });
    }

    let viewerProfile = null;
    let viewerPurchases: Array<{
      packageType: string;
      paymentStatus: string;
      accessStatus: string;
      expiryDate?: Date | null;
      eligibilityStatus?: string;
    }> = [];

    if (viewerId) {
      try {
        viewerProfile = await getProfileByUserId(viewerId);
        if (viewerProfile) {
          viewerPurchases = await getUserPurchases(viewerProfile.id);
        }
      } catch {
        // DB unavailable — viewer gets locked preview
      }
    }

    const access = canViewFullProfile(viewerProfile, viewerPurchases);

    if (!access.allowed) {
      const message =
        access.reason === LOCK_REASONS.NOT_LOGGED_IN ? LOCK_MESSAGES.NOT_LOGGED_IN :
        access.reason === LOCK_REASONS.FORM_INCOMPLETE ? LOCK_MESSAGES.FORM_INCOMPLETE :
        LOCK_MESSAGES.NO_PACKAGE;

      return NextResponse.json({
        profile: buildProfilePreview(targetProfile as Record<string, unknown>),
        locked: true,
        reason: access.reason,
        message,
      });
    }

    const pkgAccess = getViewerPackageAccess(viewerProfile, viewerPurchases);

    const redacted = redactProfile(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      targetProfile as any,
      pkgAccess.hasStandard,
      pkgAccess.hasSecondMarriage,
      pkgAccess.hasHighProfile,
      pkgAccess.hasGoodProfile,
      false,
      false
    );

    return NextResponse.json({ profile: redacted, locked: false });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
