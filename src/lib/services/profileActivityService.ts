import { prisma } from '../db';
import { MatrimonialProfile } from '@prisma/client';

export async function recordProfileView(viewerUserId: string, viewedProfileId: string) {
  // Get viewer's profile ID
  const viewerProfile = await prisma.matrimonialProfile.findUnique({
    where: { userId: viewerUserId },
    select: { id: true }
  });

  if (!viewerProfile) {
    return { success: false, error: 'Viewer profile not found' };
  }

  // Prevent self-view
  if (viewerProfile.id === viewedProfileId) {
    return { success: false, error: 'Cannot view own profile' };
  }

  try {
    const existingView = await prisma.profileView.findUnique({
      where: {
        viewerId_viewedProfileId: {
          viewerId: viewerProfile.id,
          viewedProfileId: viewedProfileId
        }
      }
    });

    if (existingView) {
      // Avoid rapid incrementing by checking time since last view (e.g. 1 hour)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      if (existingView.lastViewedAt < oneHourAgo) {
        await prisma.profileView.update({
          where: { id: existingView.id },
          data: {
            viewCount: { increment: 1 },
            lastViewedAt: new Date()
          }
        });
      }
    } else {
      await prisma.profileView.create({
        data: {
          viewerId: viewerProfile.id,
          viewedProfileId: viewedProfileId
        }
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error recording profile view:', error);
    return { success: false, error: 'Failed to record view' };
  }
}

export async function getViewedProfiles(userId: string, skip = 0, take = 20) {
  const userProfile = await prisma.matrimonialProfile.findUnique({
    where: { userId },
    select: { id: true }
  });

  if (!userProfile) return { profiles: [], total: 0 };

  const [views, total] = await Promise.all([
    prisma.profileView.findMany({
      where: { viewerId: userProfile.id },
      orderBy: { lastViewedAt: 'desc' },
      skip,
      take,
      include: {
        viewedProfile: true
      }
    }),
    prisma.profileView.count({
      where: { viewerId: userProfile.id }
    })
  ]);

  return { views, total };
}

export async function removeViewedProfile(userId: string, viewedProfileId: string) {
  const userProfile = await prisma.matrimonialProfile.findUnique({
    where: { userId },
    select: { id: true }
  });

  if (!userProfile) return false;

  try {
    await prisma.profileView.delete({
      where: {
        viewerId_viewedProfileId: {
          viewerId: userProfile.id,
          viewedProfileId: viewedProfileId
        }
      }
    });
    return true;
  } catch (error) {
    console.error('Error removing viewed profile:', error);
    return false;
  }
}

export async function clearAllViewedProfiles(userId: string) {
  const userProfile = await prisma.matrimonialProfile.findUnique({
    where: { userId },
    select: { id: true }
  });

  if (!userProfile) return false;

  try {
    await prisma.profileView.deleteMany({
      where: { viewerId: userProfile.id }
    });
    return true;
  } catch (error) {
    console.error('Error clearing viewed profiles:', error);
    return false;
  }
}

// SHORTLIST LOGIC
export async function toggleShortlist(userId: string, targetProfileId: string) {
  const userProfile = await prisma.matrimonialProfile.findUnique({
    where: { userId },
    select: { id: true }
  });

  if (!userProfile) return { success: false, error: 'User profile not found' };
  if (userProfile.id === targetProfileId) return { success: false, error: 'Cannot shortlist yourself' };

  try {
    const existing = await prisma.shortlist.findUnique({
      where: {
        userId_profileId: {
          userId: userProfile.id,
          profileId: targetProfileId
        }
      }
    });

    if (existing) {
      await prisma.shortlist.delete({ where: { id: existing.id } });
      return { success: true, isShortlisted: false };
    } else {
      await prisma.shortlist.create({
        data: {
          userId: userProfile.id,
          profileId: targetProfileId
        }
      });
      return { success: true, isShortlisted: true };
    }
  } catch (error) {
    console.error('Error toggling shortlist:', error);
    return { success: false, error: 'Failed to modify shortlist' };
  }
}

export async function getShortlistedProfiles(userId: string, skip = 0, take = 20) {
  const userProfile = await prisma.matrimonialProfile.findUnique({
    where: { userId },
    select: { id: true }
  });

  if (!userProfile) return { shortlists: [], total: 0 };

  const [shortlists, total] = await Promise.all([
    prisma.shortlist.findMany({
      where: { userId: userProfile.id },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      include: {
        profile: true
      }
    }),
    prisma.shortlist.count({
      where: { userId: userProfile.id }
    })
  ]);

  return { shortlists, total };
}

export async function checkIsShortlisted(userId: string, targetProfileId: string) {
  const userProfile = await prisma.matrimonialProfile.findUnique({
    where: { userId },
    select: { id: true }
  });

  if (!userProfile) return false;

  const existing = await prisma.shortlist.findUnique({
    where: {
      userId_profileId: {
        userId: userProfile.id,
        profileId: targetProfileId
      }
    }
  });

  return !!existing;
}
