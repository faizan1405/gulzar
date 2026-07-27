import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getAllProfiles } from '@/lib/profileStore';

async function isAdmin(req: NextRequest) {
  const session = await auth();
  return session?.user?.role === 'ADMIN';
}

export async function GET(req: NextRequest) {
  try {
    if (!(await isAdmin(req))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const gender = searchParams.get('gender') || '';
    const state = searchParams.get('state') || '';
    const verificationStatus = searchParams.get('verificationStatus') || '';
    const approvalStatus = searchParams.get('approvalStatus') || '';
    const hasPaid = searchParams.get('hasPaid') || '';

    let profiles = await getAllProfiles();

    if (gender) profiles = profiles.filter((p: any) => p.gender === gender);
    if (state) profiles = profiles.filter((p: any) => p.state?.toLowerCase().includes(state.toLowerCase()));
    if (verificationStatus) profiles = profiles.filter((p: any) => p.verificationStatus === verificationStatus);
    if (approvalStatus) profiles = profiles.filter((p: any) => p.adminApprovalStatus === approvalStatus);
    if (hasPaid === 'true') profiles = profiles.filter((p: any) => p.hasPaid === true);
    if (hasPaid === 'false') profiles = profiles.filter((p: any) => !p.hasPaid);

    if (search) {
      profiles = profiles.filter((p: any) =>
        p.fullName?.toLowerCase().includes(search) ||
        p.city?.toLowerCase().includes(search) ||
        p.state?.toLowerCase().includes(search) ||
        p.phoneNumber?.toLowerCase().includes(search) ||
        p.occupation?.toLowerCase().includes(search) ||
        p.biradari?.toLowerCase().includes(search) ||
        p.maslak?.toLowerCase().includes(search)
      );
    }

    profiles.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ profiles, total: profiles.length });
  } catch (error: any) {
    console.error('Admin profiles GET failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
