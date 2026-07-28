import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from '@/lib/services/notificationService';
import { csrfGuard } from '@/lib/csrfGuard';
import { safeJsonBody } from '@/lib/requestUtils';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    let skip = parseInt(searchParams.get('skip') || '0');
    let take = parseInt(searchParams.get('take') || '20');
    if (skip < 0 || isNaN(skip)) skip = 0;
    if (take < 1 || take > 50) take = 20;

    const result = await getUserNotifications(session.user.id, skip, take);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const csrfResult = await csrfGuard(req);
    if (csrfResult) return csrfResult;

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bodyOrResponse = await safeJsonBody(req, { maxSizeKB: 10 });
    if (bodyOrResponse instanceof Response) return bodyOrResponse;
    const body = bodyOrResponse as any;
    const { notificationId, markAll } = body;

    let result;
    if (markAll) {
      result = await markAllNotificationsAsRead(session.user.id);
    } else if (notificationId) {
      result = await markNotificationAsRead(session.user.id, notificationId);
    } else {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const csrfResult = await csrfGuard(req);
    if (csrfResult) return csrfResult;

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const notificationId = searchParams.get('id');

    if (!notificationId) {
      return NextResponse.json({ error: 'id required' }, { status: 400 });
    }

    const result = await deleteNotification(session.user.id, notificationId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
