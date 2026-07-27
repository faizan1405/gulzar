import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

async function isAdmin(req: NextRequest) {
  const session = await auth();
  return session?.user?.role === 'ADMIN';
}

export async function GET(req: NextRequest) {
  try {
    if (!(await isAdmin(req))) {
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
    if (!(await isAdmin(req))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
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

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
