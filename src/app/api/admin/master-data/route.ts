import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import {
  getMasterDataOptions,
  addMaslakOption,
  editMaslakOption,
  toggleDisableMaslakOption,
  addCasteOption,
  editCasteOption,
  toggleDisableCasteOption,
  addLocationOption,
  toggleLocationPriority,
  toggleDisableLocationOption,
  mergeCastes,
  mergeLocations
} from '@/lib/profileStore';
import { checkRateLimitByName, buildRateLimitHeaders } from '@/lib/rateLimit';
import { logAudit } from '@/lib/audit';
import { csrfGuard } from '@/lib/csrfGuard';
import { safeJsonBody } from '@/lib/requestUtils';

async function isAdmin() {
  const session = await auth();
  return session?.user?.role === 'ADMIN';
}

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized. Admin role required.' }, { status: 403 });
    }

    const session = await auth();
    const rlResult = await checkRateLimitByName('profiles', session?.user?.id || 'anon');
    if (!rlResult.allowed) {
      return NextResponse.json({ error: 'Too many requests. Please slow down.' }, {
        status: 429, headers: buildRateLimitHeaders(rlResult),
      });
    }

    const options = await getMasterDataOptions();
    return NextResponse.json(options);
  } catch (error) {
    console.error('Failed to fetch master data options:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const csrfResult = await csrfGuard(req);
    if (csrfResult) return csrfResult;

    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized. Admin role required.' }, { status: 403 });
    }

    const bodyOrResponse = await safeJsonBody(req, { maxSizeKB: 10 });
    if (bodyOrResponse instanceof Response) return bodyOrResponse;
    const body = bodyOrResponse as any;
    const { action } = body;

    const session = await auth();

    // Rate limit admin mutations: 30/min
    const mdResult = await checkRateLimitByName('adminMutation', session?.user?.id || 'anon');
    if (!mdResult.allowed) {
      return NextResponse.json({ error: 'Too many requests. Please slow down.' }, {
        status: 429, headers: buildRateLimitHeaders(mdResult),
      });
    }

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }

    // Maslak actions
    if (action === 'add_maslak') {
      const { label, aliases } = body;
      if (!label) return NextResponse.json({ error: 'Label is required' }, { status: 400 });
      const option = await addMaslakOption(label, aliases || []);
      await logAudit({ actorUserId: session?.user?.id || 'unknown', action: 'ADMIN_ADD_MASLAK', targetType: 'MasterData', targetId: option.id, metadata: label });
      return NextResponse.json({ success: true, option });
    }

    if (action === 'edit_maslak') {
      const { id, label, aliases } = body;
      if (!id || !label) return NextResponse.json({ error: 'Id and label are required' }, { status: 400 });
      const option = await editMaslakOption(id, label, aliases || []);
      await logAudit({ actorUserId: session?.user?.id || 'unknown', action: 'ADMIN_EDIT_MASLAK', targetType: 'MasterData', targetId: id, metadata: label });
      return NextResponse.json({ success: true, option });
    }

    if (action === 'toggle_disable_maslak') {
      const { id, isDisabled } = body;
      if (!id || isDisabled === undefined) return NextResponse.json({ error: 'Id and isDisabled are required' }, { status: 400 });
      const option = await toggleDisableMaslakOption(id, isDisabled);
      await logAudit({ actorUserId: session?.user?.id || 'unknown', action: 'ADMIN_TOGGLE_MASLAK', targetType: 'MasterData', targetId: id, metadata: String(isDisabled) });
      return NextResponse.json({ success: true, option });
    }

    // Caste actions
    if (action === 'add_caste') {
      const { label, aliases } = body;
      if (!label) return NextResponse.json({ error: 'Label is required' }, { status: 400 });
      const option = await addCasteOption(label, aliases || []);
      await logAudit({ actorUserId: session?.user?.id || 'unknown', action: 'ADMIN_ADD_CASTE', targetType: 'MasterData', targetId: option.id, metadata: label });
      return NextResponse.json({ success: true, option });
    }

    if (action === 'edit_caste') {
      const { id, label, aliases } = body;
      if (!id || !label) return NextResponse.json({ error: 'Id and label are required' }, { status: 400 });
      const option = await editCasteOption(id, label, aliases || []);
      await logAudit({ actorUserId: session?.user?.id || 'unknown', action: 'ADMIN_EDIT_CASTE', targetType: 'MasterData', targetId: id, metadata: label });
      return NextResponse.json({ success: true, option });
    }

    if (action === 'toggle_disable_caste') {
      const { id, isDisabled } = body;
      if (!id || isDisabled === undefined) return NextResponse.json({ error: 'Id and isDisabled are required' }, { status: 400 });
      const option = await toggleDisableCasteOption(id, isDisabled);
      await logAudit({ actorUserId: session?.user?.id || 'unknown', action: 'ADMIN_TOGGLE_CASTE', targetType: 'MasterData', targetId: id, metadata: String(isDisabled) });
      return NextResponse.json({ success: true, option });
    }

    // Location actions
    if (action === 'add_location') {
      const { state, district, locality, isHighPriority } = body;
      if (!state || !district) return NextResponse.json({ error: 'State and district are required' }, { status: 400 });
      const option = await addLocationOption(state, district, locality || null, !!isHighPriority);
      await logAudit({ actorUserId: session?.user?.id || 'unknown', action: 'ADMIN_ADD_LOCATION', targetType: 'MasterData', targetId: option.id, metadata: `${state}, ${district}` });
      return NextResponse.json({ success: true, option });
    }

    if (action === 'toggle_location_priority') {
      const { id, isHighPriority } = body;
      if (!id || isHighPriority === undefined) return NextResponse.json({ error: 'Id and isHighPriority are required' }, { status: 400 });
      const option = await toggleLocationPriority(id, isHighPriority);
      await logAudit({ actorUserId: session?.user?.id || 'unknown', action: 'ADMIN_TOGGLE_LOCATION_PRIORITY', targetType: 'MasterData', targetId: id, metadata: String(isHighPriority) });
      return NextResponse.json({ success: true, option });
    }

    if (action === 'toggle_disable_location') {
      const { id, isDisabled } = body;
      if (!id || isDisabled === undefined) return NextResponse.json({ error: 'Id and isDisabled are required' }, { status: 400 });
      const option = await toggleDisableLocationOption(id, isDisabled);
      await logAudit({ actorUserId: session?.user?.id || 'unknown', action: 'ADMIN_TOGGLE_LOCATION', targetType: 'MasterData', targetId: id, metadata: String(isDisabled) });
      return NextResponse.json({ success: true, option });
    }

    // Merge actions
    if (action === 'merge_castes') {
      const { sourceLabel, targetLabel } = body;
      if (!sourceLabel || !targetLabel) return NextResponse.json({ error: 'Source and target labels are required' }, { status: 400 });
      const result = await mergeCastes(sourceLabel, targetLabel);
      await logAudit({ actorUserId: session?.user?.id || 'unknown', action: 'ADMIN_MERGE_CASTES', targetType: 'MasterData', targetId: 'merge', metadata: `${sourceLabel} -> ${targetLabel}` });
      return NextResponse.json({ success: result });
    }

    if (action === 'merge_locations') {
      const { sourceId, targetId } = body;
      if (!sourceId || !targetId) return NextResponse.json({ error: 'Source and target IDs are required' }, { status: 400 });
      const result = await mergeLocations(sourceId, targetId);
      await logAudit({ actorUserId: session?.user?.id || 'unknown', action: 'ADMIN_MERGE_LOCATIONS', targetType: 'MasterData', targetId: 'merge', metadata: `${sourceId} -> ${targetId}` });
      return NextResponse.json({ success: result });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Failed to process master data action:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
