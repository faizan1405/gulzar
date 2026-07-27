import { prisma } from '../db';

export async function createNotification(data: {
  userId: string;
  type: string;
  title: string;
  message: string;
  actionUrl?: string;
  relatedItemType?: string;
  relatedItemId?: string;
}) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        actionUrl: data.actionUrl,
        relatedItemType: data.relatedItemType,
        relatedItemId: data.relatedItemId,
      }
    });
    return { success: true, notification };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, error: 'Failed to create notification' };
  }
}

export async function getUserNotifications(userId: string, skip = 0, take = 20) {
  try {
    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.notification.count({
        where: { userId }
      }),
      prisma.notification.count({
        where: { userId, isRead: false }
      })
    ]);

    return { success: true, notifications, total, unreadCount };
  } catch (error) {
    console.error('Error getting notifications:', error);
    return { success: false, error: 'Failed to get notifications', notifications: [], total: 0, unreadCount: 0 };
  }
}

export async function markNotificationAsRead(userId: string, notificationId: string) {
  try {
    await prisma.notification.update({
      where: { id: notificationId, userId },
      data: { isRead: true, readAt: new Date() }
    });
    return { success: true };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { success: false, error: 'Failed to mark as read' };
  }
}

export async function markAllNotificationsAsRead(userId: string) {
  try {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() }
    });
    return { success: true };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return { success: false, error: 'Failed to mark all as read' };
  }
}

export async function deleteNotification(userId: string, notificationId: string) {
  try {
    await prisma.notification.delete({
      where: { id: notificationId, userId }
    });
    return { success: true };
  } catch (error) {
    console.error('Error deleting notification:', error);
    return { success: false, error: 'Failed to delete notification' };
  }
}
