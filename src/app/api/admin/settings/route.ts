import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { checkRateLimitByName, buildRateLimitHeaders } from '@/lib/rateLimit';
import { logAudit } from '@/lib/audit';
import { csrfGuard } from '@/lib/csrfGuard';
import { safeJsonBody } from '@/lib/requestUtils';

async function isAdmin(): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === 'ADMIN';
}

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const session = await auth();
    const sResult = await checkRateLimitByName('profiles', session?.user?.id || 'anon');
    if (!sResult.allowed) {
      return NextResponse.json({ error: 'Too many requests. Please slow down.' }, {
        status: 429, headers: buildRateLimitHeaders(sResult),
      });
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
    const csrfResult = await csrfGuard(req);
    if (csrfResult) return csrfResult;

    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const session = await auth();

    // Rate limit admin mutations: 15/min
    const sResult = await checkRateLimitByName('adminMutation', session?.user?.id || 'anon');
    if (!sResult.allowed) {
      return NextResponse.json({ error: 'Too many requests. Please slow down.' }, {
        status: 429, headers: buildRateLimitHeaders(sResult),
      });
    }

    const bodyOrResponse = await safeJsonBody(req, { maxSizeKB: 10 });
    if (bodyOrResponse instanceof Response) return bodyOrResponse;
    const body = bodyOrResponse as any;
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
      defaultPreviewImage,
      referralRate
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
          defaultPreviewImage,
          referralRate: referralRate !== undefined ? referralRate : undefined,
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
          defaultPreviewImage,
          referralRate: referralRate ?? 20,
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
