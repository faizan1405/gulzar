import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getAllLeads } from '@/lib/profileStore';
import { isAdminSessionOrDemo, isDemoMode } from '@/lib/demoMode';

const DEMO_LEADS = [
  {
    id: 'lead_demo_1',
    fullName: 'Arsalan Khan',
    phone: '+91 98765 43210',
    email: 'arsalan.khan@example.com',
    city: 'Mumbai',
    message: 'Interested in gold package, need details on success fee.',
    inquiryType: 'Package Inquiry',
    interestedPackage: 'Gold Package',
    interestedProfileId: null,
    sourcePage: '/premium',
    status: 'new',
    priority: 'high',
    adminNotes: 'Demo lead. No production record.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'lead_demo_2',
    fullName: 'Yasmin Shaikh',
    phone: '+91 87654 32109',
    email: 'yasmin.s@example.com',
    city: 'Pune',
    message: 'Request details for wedding planning and event management.',
    inquiryType: 'Event Management',
    interestedPackage: null,
    interestedProfileId: null,
    sourcePage: '/event-management',
    status: 'contacted',
    priority: 'normal',
    adminNotes: 'Demo event inquiry.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 72000000).toISOString(),
  },
  {
    id: 'lead_demo_3',
    fullName: 'Nida Fatima',
    phone: '+91 99887 77665',
    email: 'nida.f@example.com',
    city: 'Delhi',
    message: 'Need Zaicha compatibility guidance before family meeting.',
    inquiryType: 'Zaicha Inquiry',
    interestedPackage: null,
    interestedProfileId: null,
    sourcePage: '/zaicha',
    status: 'follow_up',
    priority: 'normal',
    adminNotes: 'Demo Zaicha inquiry.',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 144000000).toISOString(),
  },
];

async function isAdmin(req: NextRequest) {
  const session = await auth();
  return isAdminSessionOrDemo(req, session);
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
    let leads = isDemoMode() ? DEMO_LEADS : await getAllLeads();

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
