import { NextRequest, NextResponse } from 'next/server';
import { createLead, getAllLeads } from '@/lib/profileStore';
import { notifyAdminNewLead } from '@/lib/notifications';

// Basic phone validation helper
function isValidPhone(phone: string): boolean {
  const cleanPhone = phone.replace(/\s+/g, '').replace(/[-+()]/g, '');
  return cleanPhone.length >= 10 && /^\d+$/.test(cleanPhone);
}

// Basic HTML sanitization helper
function sanitizeText(str: string): string {
  if (!str) return '';
  return str
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      phone,
      email,
      city,
      message,
      inquiryType,
      interestedPackage,
      interestedProfileId,
      sourcePage
    } = body;

    // 1. Required fields verification
    if (!fullName || !phone || !city || !inquiryType) {
      return NextResponse.json(
        { error: 'Required fields missing: Name, Phone, City, and Inquiry Type are mandatory.' },
        { status: 400 }
      );
    }

    // 2. Validate phone format
    if (!isValidPhone(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format. Please provide a valid phone number with at least 10 digits.' },
        { status: 400 }
      );
    }

    // 3. Sanitize inputs
    const cleanName = sanitizeText(fullName);
    const cleanPhone = phone.trim();
    const cleanEmail = email ? sanitizeText(email) : null;
    const cleanCity = sanitizeText(city);
    const cleanInquiryType = sanitizeText(inquiryType);
    const cleanPackage = interestedPackage ? sanitizeText(interestedPackage) : null;
    const cleanProfileId = interestedProfileId ? sanitizeText(interestedProfileId) : null;
    const cleanSourcePage = sourcePage ? sanitizeText(sourcePage) : null;
    
    // Message length check
    let cleanMessage = message ? sanitizeText(message) : null;
    if (cleanMessage && cleanMessage.length > 1000) {
      cleanMessage = cleanMessage.substring(0, 1000) + '...';
    }

    // 4. Spam protection: check for exact duplicates submitted within the last 2 minutes
    const now = new Date();
    const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);
    const existingLeads = await getAllLeads();
    
    const isDuplicate = existingLeads.some((lead: any) => {
      const createdTime = new Date(lead.createdAt);
      return (
        lead.phone === cleanPhone &&
        lead.fullName.toLowerCase() === cleanName.toLowerCase() &&
        lead.message === cleanMessage &&
        createdTime > twoMinutesAgo
      );
    });

    if (isDuplicate) {
      return NextResponse.json(
        { error: 'Double submission detected. You have already submitted this inquiry. Please wait a moment.' },
        { status: 429 }
      );
    }

    // 5. Store lead
    const newLead = await createLead({
      fullName: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
      city: cleanCity,
      message: cleanMessage,
      inquiryType: cleanInquiryType,
      interestedPackage: cleanPackage,
      interestedProfileId: cleanProfileId,
      sourcePage: cleanSourcePage
    });

    // 6. Notify admin (fires asynchronously in setImmediate, doesn't block client response)
    await notifyAdminNewLead(newLead);

    return NextResponse.json({
      success: true,
      message: 'Alhamdulillah! Your inquiry has been received. We will contact you soon.',
      lead: newLead
    });

  } catch (error: any) {
    console.error('Lead submission endpoint failed:', error);
    return NextResponse.json(
      { error: 'Internal server error processing inquiry.' },
      { status: 500 }
    );
  }
}
