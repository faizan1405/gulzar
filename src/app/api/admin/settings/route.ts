import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { checkRateLimit } from '@/lib/rateLimit';
import { logAudit } from '@/lib/audit';

async function isAdmin(): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === 'ADMIN';
}

export async function GET(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
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
  } catch (error) {
    console.error('Failed to fetch global settings:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const session = await auth();

    // Rate limit admin mutations: 15/min
    if (checkRateLimit(`admin-settings:${session?.user?.id || 'anon'}`, 15, 60 * 1000)) {
      return NextResponse.json({ error: 'Too many requests. Please slow down.' }, { status: 429 });
    }

    const body = await req.json();
    const { 
      adminEmail, 
      adminPhone, 
      emailAlertsEnabled, 
      smsAlertsEnabled,
      officeAddress,
      facebookUrl,
      instagramUrl,
      youtubeUrl,
      linkedinUrl,
      twitterUrl,
      defaultPreviewImage
    } = body;

    let settings = await prisma.globalSettings.findFirst();
    
    if (settings) {
      settings = await prisma.globalSettings.update({
        where: { id: settings.id },
        data: {
          adminEmail,
          adminPhone,
          emailAlertsEnabled: !!emailAlertsEnabled,
          smsAlertsEnabled: !!smsAlertsEnabled,
          officeAddress,
          facebookUrl,
          instagramUrl,
          youtubeUrl,
          linkedinUrl,
          twitterUrl,
          defaultPreviewImage
        }
      });
    } else {
      settings = await prisma.globalSettings.create({
        data: {
          adminEmail,
          adminPhone,
          emailAlertsEnabled: !!emailAlertsEnabled,
          smsAlertsEnabled: !!smsAlertsEnabled,
          officeAddress,
          facebookUrl,
          instagramUrl,
          youtubeUrl,
          linkedinUrl,
          twitterUrl,
          defaultPreviewImage
        }
      });
    }

    await logAudit({
      actorUserId: session?.user?.id || 'unknown',
      action: 'ADMIN_UPDATE_SETTINGS',
      targetType: 'GlobalSettings',
      targetId: settings.id,
      metadata: 'Global settings update',
    });

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error('Failed to update global settings:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
