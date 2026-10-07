import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { checkRateLimitByName, buildRateLimitHeaders } from '@/lib/rateLimit';
import { logAudit } from '@/lib/audit';
import { jwtGuard } from '@/lib/jwtGuard';
import { safeJsonBody } from '@/lib/requestUtils';
import { getAllPackagePricing, updatePackagePrice, isValidPackageType } from '@/lib/packagePricing';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { error: NextResponse.json({ error: 'Unauthorized. Admin role required.' }, { status: 403 }), session: null };
  }
  return { error: null, session };
}

export async function GET(_req: NextRequest) {
  try {
    const admin = await requireAdmin();
    if (admin.error) return admin.error;

    const session = admin.session;
    const rlResult = await checkRateLimitByName('profiles', session?.user?.id || 'anon');
    if (!rlResult.allowed) {
      return NextResponse.json({ error: 'Too many requests. Please slow down.' }, {
        status: 429, headers: buildRateLimitHeaders(rlResult),
      });
    }

    const pricing = await getAllPackagePricing();
    return NextResponse.json({ success: true, pricing });
  } catch (error) {
    console.error('Failed to get package pricing:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const jwtResult = await jwtGuard(req);
    if (jwtResult) return jwtResult;

    const admin = await requireAdmin();
    if (admin.error) return admin.error;
    const session = admin.session;
    const adminUserId = session?.user?.id;
    if (!adminUserId) {
      return NextResponse.json({ error: 'Unauthorized. Admin role required.' }, { status: 403 });
    }

    const pkgResult = await checkRateLimitByName('adminMutation', adminUserId);
    if (!pkgResult.allowed) {
      return NextResponse.json({ error: 'Too many requests. Please slow down.' }, {
        status: 429, headers: buildRateLimitHeaders(pkgResult),
      });
    }

    const bodyOrResponse = await safeJsonBody(req, { maxSizeKB: 50 });
    if (bodyOrResponse instanceof Response) return bodyOrResponse;
    const body = bodyOrResponse as any;

    const { packageType, basePrice } = body;
    if (!isValidPackageType(packageType)) {
      return NextResponse.json({ error: 'Invalid package type.' }, { status: 400 });
    }

    const numPrice = typeof basePrice === 'number' ? basePrice : parseFloat(basePrice);
    if (typeof numPrice !== 'number' || isNaN(numPrice) || !isFinite(numPrice) || numPrice <= 0) {
      return NextResponse.json({ error: 'Base price must be a valid number greater than 0.' }, { status: 400 });
    }

    const updated = await updatePackagePrice(packageType, numPrice);
    await logAudit({
      actorUserId: adminUserId,
      action: 'ADMIN_UPDATE_PACKAGE_PRICING',
      targetType: 'PackagePricing',
      targetId: packageType,
      metadata: JSON.stringify({ packageType, basePrice: updated.basePrice }),
    });

    return NextResponse.json({ success: true, pricing: updated });
  } catch (error) {
    console.error('Failed to update package pricing:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  return POST(req);
}
