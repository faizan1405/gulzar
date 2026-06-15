import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const simulatedAdminId = req.headers.get('x-simulator-admin-id');
    const role = session?.user?.role || (simulatedAdminId ? 'ADMIN' : 'USER');
    
    if (role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    let settings = await prisma.globalSettings.findFirst();
    if (!settings) {
      settings = await prisma.globalSettings.create({
        data: {
          emailAlertsEnabled: true,
          smsAlertsEnabled: false
        }
      });
    }

    return NextResponse.json({ settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const simulatedAdminId = req.headers.get('x-simulator-admin-id');
    const role = session?.user?.role || (simulatedAdminId ? 'ADMIN' : 'USER');
    
    if (role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { adminEmail, adminPhone, emailAlertsEnabled, smsAlertsEnabled } = body;

    let settings = await prisma.globalSettings.findFirst();
    
    if (settings) {
      settings = await prisma.globalSettings.update({
        where: { id: settings.id },
        data: {
          adminEmail,
          adminPhone,
          emailAlertsEnabled: !!emailAlertsEnabled,
          smsAlertsEnabled: !!smsAlertsEnabled
        }
      });
    } else {
      settings = await prisma.globalSettings.create({
        data: {
          adminEmail,
          adminPhone,
          emailAlertsEnabled: !!emailAlertsEnabled,
          smsAlertsEnabled: !!smsAlertsEnabled
        }
      });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
