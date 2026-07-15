import { prisma } from '../db';
import { createNotification } from './notificationService';

export async function sendInterest(senderUserId: string, receiverProfileId: string, message?: string) {
  const senderProfile = await prisma.matrimonialProfile.findUnique({
    where: { userId: senderUserId },
    include: { user: true }
  });

  if (!senderProfile) return { success: false, error: 'Sender profile not found' };
  if (senderProfile.id === receiverProfileId) return { success: false, error: 'Cannot send interest to yourself' };

  const receiverProfile = await prisma.matrimonialProfile.findUnique({
    where: { id: receiverProfileId },
    include: { user: true }
  });

  if (!receiverProfile) return { success: false, error: 'Receiver profile not found' };

  // Rate limiting could go here (e.g. check how many interests sent today)
  const sentToday = await prisma.interestRequest.count({
    where: {
      senderId: senderProfile.id,
      createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    }
  });

  if (sentToday > 20) {
    return { success: false, error: 'Daily interest limit reached' };
  }

  try {
    const existing = await prisma.interestRequest.findUnique({
      where: {
        senderId_receiverId: {
          senderId: senderProfile.id,
          receiverId: receiverProfile.id
        }
      }
    });

    if (existing) {
      if (existing.status === 'PENDING') return { success: false, error: 'Interest already sent and is pending' };
      if (existing.status === 'ACCEPTED') return { success: false, error: 'Interest already accepted' };
      
      // If rejected or withdrawn, maybe allow resending after some time, but for now just update it to pending
      await prisma.interestRequest.update({
        where: { id: existing.id },
        data: { status: 'PENDING', message, updatedAt: new Date() }
      });
    } else {
      await prisma.interestRequest.create({
        data: {
          senderId: senderProfile.id,
          receiverId: receiverProfile.id,
          status: 'PENDING',
          message
        }
      });
    }

    // Create Notification for receiver
    await createNotification({
      userId: receiverProfile.userId,
      type: 'INTEREST_RECEIVED',
      title: 'New Interest Received',
      message: `${senderProfile.fullName} has sent you an interest.`,
      actionUrl: '/my-account/interests',
      relatedItemType: 'InterestRequest',
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending interest:', error);
    return { success: false, error: 'Failed to send interest' };
  }
}

export async function respondToInterest(userId: string, requestId: string, action: 'ACCEPT' | 'REJECT') {
  const receiverProfile = await prisma.matrimonialProfile.findUnique({
    where: { userId },
    select: { id: true, fullName: true, userId: true }
  });

  if (!receiverProfile) return { success: false, error: 'Profile not found' };

  try {
    const request = await prisma.interestRequest.findUnique({
      where: { id: requestId },
      include: { sender: true }
    });

    if (!request) return { success: false, error: 'Request not found' };
    if (request.receiverId !== receiverProfile.id) return { success: false, error: 'Unauthorized' };
    if (request.status !== 'PENDING') return { success: false, error: 'Request is not pending' };

    const newStatus = action === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED';

    await prisma.interestRequest.update({
      where: { id: requestId },
      data: { status: newStatus, respondedAt: new Date() }
    });

    // Notify the sender
    await createNotification({
      userId: request.sender.userId,
      type: `INTEREST_${newStatus}`,
      title: `Interest ${newStatus === 'ACCEPTED' ? 'Accepted' : 'Declined'}`,
      message: `${receiverProfile.fullName} has ${newStatus === 'ACCEPTED' ? 'accepted' : 'declined'} your interest.`,
      actionUrl: '/my-account/interests',
      relatedItemType: 'InterestRequest',
      relatedItemId: request.id
    });

    return { success: true };
  } catch (error) {
    console.error('Error responding to interest:', error);
    return { success: false, error: 'Failed to respond to interest' };
  }
}

export async function withdrawInterest(userId: string, requestId: string) {
  const senderProfile = await prisma.matrimonialProfile.findUnique({
    where: { userId },
    select: { id: true }
  });

  if (!senderProfile) return { success: false, error: 'Profile not found' };

  try {
    const request = await prisma.interestRequest.findUnique({
      where: { id: requestId }
    });

    if (!request) return { success: false, error: 'Request not found' };
    if (request.senderId !== senderProfile.id) return { success: false, error: 'Unauthorized' };
    if (request.status !== 'PENDING') return { success: false, error: 'Can only withdraw pending requests' };

    await prisma.interestRequest.update({
      where: { id: requestId },
      data: { status: 'WITHDRAWN', withdrawnAt: new Date() }
    });

    return { success: true };
  } catch (error) {
    console.error('Error withdrawing interest:', error);
    return { success: false, error: 'Failed to withdraw interest' };
  }
}

export async function getSentInterests(userId: string, skip = 0, take = 20) {
  const senderProfile = await prisma.matrimonialProfile.findUnique({
    where: { userId },
    select: { id: true }
  });

  if (!senderProfile) return { requests: [], total: 0 };

  const [requests, total] = await Promise.all([
    prisma.interestRequest.findMany({
      where: { senderId: senderProfile.id },
      orderBy: { updatedAt: 'desc' },
      skip,
      take,
      include: {
        receiver: true
      }
    }),
    prisma.interestRequest.count({
      where: { senderId: senderProfile.id }
    })
  ]);

  return { requests, total };
}

export async function getReceivedInterests(userId: string, skip = 0, take = 20) {
  const receiverProfile = await prisma.matrimonialProfile.findUnique({
    where: { userId },
    select: { id: true }
  });

  if (!receiverProfile) return { requests: [], total: 0 };

  const [requests, total] = await Promise.all([
    prisma.interestRequest.findMany({
      where: { receiverId: receiverProfile.id },
      orderBy: { updatedAt: 'desc' },
      skip,
      take,
      include: {
        sender: true
      }
    }),
    prisma.interestRequest.count({
      where: { receiverId: receiverProfile.id }
    })
  ]);

  return { requests, total };
}
