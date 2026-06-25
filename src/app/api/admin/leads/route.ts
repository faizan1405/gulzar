import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getAllLeads } from '@/lib/profileStore';

async function isAdmin(req: NextRequest) {
  const session = await auth();
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  const simulatedAdmin = isDemoMode && req.headers.get('x-simulator-admin') === 'true';
  return session?.user?.role === 'ADMIN' || simulatedAdmin;
}

export async function GET(req: NextRequest) {
  try {
    if (!(await isAdmin(req))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // 2. Parse URL parameters
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const status = searchParams.get('status') || '';
    const inquiryType = searchParams.get('inquiryType') || '';
    const interestedPackage = searchParams.get('interestedPackage') || '';

    // 3. Fetch all leads
    let leads = await getAllLeads();

    // 4. Apply filters in-memory (supports DB query outcomes and fallback sandbox state alike)
    if (status) {
      leads = leads.filter((lead: any) => lead.status === status);
    }

    if (inquiryType) {
      leads = leads.filter((lead: any) => lead.inquiryType === inquiryType);
    }

    if (interestedPackage) {
      leads = leads.filter((lead: any) => lead.interestedPackage === interestedPackage);
    }

    if (search) {
      leads = leads.filter((lead: any) => {
        return (
          lead.fullName?.toLowerCase().includes(search) ||
          lead.phone?.toLowerCase().includes(search) ||
          lead.city?.toLowerCase().includes(search) ||
          (lead.interestedPackage && lead.interestedPackage.toLowerCase().includes(search)) ||
          (lead.message && lead.message.toLowerCase().includes(search))
        );
      });
    }

    // Sort newest first
    leads.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ leads });
  } catch (error: any) {
    console.error('Admin leads GET endpoint failed:', error);
    return NextResponse.json(
      { error: 'Internal server error listing inquiries.' },
      { status: 500 }
    );
  }
}
