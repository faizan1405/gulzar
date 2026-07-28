import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getAllLeads } from '@/lib/profileStore';
import { checkRateLimitByName, buildRateLimitHeaders } from '@/lib/rateLimit';

async function isAdmin() {
  const session = await auth();
  return session?.user?.role === 'ADMIN';
}

export async function GET(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const session = await auth();
    const rlResult = await checkRateLimitByName('profiles', session?.user?.id || 'anon');
    if (!rlResult.allowed) {
      return NextResponse.json({ error: 'Too many requests. Please slow down.' }, {
        status: 429, headers: buildRateLimitHeaders(rlResult),
      });
    }

    // 2. Parse URL parameters
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const status = searchParams.get('status') || '';
    const inquiryType = searchParams.get('inquiryType') || '';
    const interestedPackage = searchParams.get('interestedPackage') || '';

    let skip = parseInt(searchParams.get('skip') || '0');
    let take = parseInt(searchParams.get('take') || '50');
    if (skip < 0 || isNaN(skip)) skip = 0;
    if (take < 1 || take > 100) take = 50;

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

    const total = leads.length;
    const paged = leads.slice(skip, skip + take);

    return NextResponse.json({ leads: paged, total, skip, take });
  } catch (error: any) {
    console.error('Admin leads GET endpoint failed:', error);
    return NextResponse.json(
      { error: 'Internal server error listing inquiries.' },
      { status: 500 }
    );
  }
}
