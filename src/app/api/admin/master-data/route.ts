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

async function isAdmin(req: NextRequest) {
  const session = await auth();
  return session?.user?.role === 'ADMIN';
}

export async function GET(req: NextRequest) {
  try {
    if (!(await isAdmin(req))) {
      return NextResponse.json({ error: 'Unauthorized. Admin role required.' }, { status: 403 });
    }
    const options = await getMasterDataOptions();
    return NextResponse.json(options);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await isAdmin(req))) {
      return NextResponse.json({ error: 'Unauthorized. Admin role required.' }, { status: 403 });
    }

    const body = await req.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }

    // Maslak actions
    if (action === 'add_maslak') {
      const { label, aliases } = body;
      if (!label) return NextResponse.json({ error: 'Label is required' }, { status: 400 });
      const option = await addMaslakOption(label, aliases || []);
      return NextResponse.json({ success: true, option });
    }

    if (action === 'edit_maslak') {
      const { id, label, aliases } = body;
      if (!id || !label) return NextResponse.json({ error: 'Id and label are required' }, { status: 400 });
      const option = await editMaslakOption(id, label, aliases || []);
      return NextResponse.json({ success: true, option });
    }

    if (action === 'toggle_disable_maslak') {
      const { id, isDisabled } = body;
      if (!id || isDisabled === undefined) return NextResponse.json({ error: 'Id and isDisabled are required' }, { status: 400 });
      const option = await toggleDisableMaslakOption(id, isDisabled);
      return NextResponse.json({ success: true, option });
    }

    // Caste actions
    if (action === 'add_caste') {
      const { label, aliases } = body;
      if (!label) return NextResponse.json({ error: 'Label is required' }, { status: 400 });
      const option = await addCasteOption(label, aliases || []);
      return NextResponse.json({ success: true, option });
    }

    if (action === 'edit_caste') {
      const { id, label, aliases } = body;
      if (!id || !label) return NextResponse.json({ error: 'Id and label are required' }, { status: 400 });
      const option = await editCasteOption(id, label, aliases || []);
      return NextResponse.json({ success: true, option });
    }

    if (action === 'toggle_disable_caste') {
      const { id, isDisabled } = body;
      if (!id || isDisabled === undefined) return NextResponse.json({ error: 'Id and isDisabled are required' }, { status: 400 });
      const option = await toggleDisableCasteOption(id, isDisabled);
      return NextResponse.json({ success: true, option });
    }

    // Location actions
    if (action === 'add_location') {
      const { state, district, locality, isHighPriority } = body;
      if (!state || !district) return NextResponse.json({ error: 'State and district are required' }, { status: 400 });
      const option = await addLocationOption(state, district, locality || null, !!isHighPriority);
      return NextResponse.json({ success: true, option });
    }

    if (action === 'toggle_location_priority') {
      const { id, isHighPriority } = body;
      if (!id || isHighPriority === undefined) return NextResponse.json({ error: 'Id and isHighPriority are required' }, { status: 400 });
      const option = await toggleLocationPriority(id, isHighPriority);
      return NextResponse.json({ success: true, option });
    }

    if (action === 'toggle_disable_location') {
      const { id, isDisabled } = body;
      if (!id || isDisabled === undefined) return NextResponse.json({ error: 'Id and isDisabled are required' }, { status: 400 });
      const option = await toggleDisableLocationOption(id, isDisabled);
      return NextResponse.json({ success: true, option });
    }

    // Merge actions
    if (action === 'merge_castes') {
      const { sourceLabel, targetLabel } = body;
      if (!sourceLabel || !targetLabel) return NextResponse.json({ error: 'Source and target labels are required' }, { status: 400 });
      const result = await mergeCastes(sourceLabel, targetLabel);
      return NextResponse.json({ success: result });
    }

    if (action === 'merge_locations') {
      const { sourceId, targetId } = body;
      if (!sourceId || !targetId) return NextResponse.json({ error: 'Source and target IDs are required' }, { status: 400 });
      const result = await mergeLocations(sourceId, targetId);
      return NextResponse.json({ success: result });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
