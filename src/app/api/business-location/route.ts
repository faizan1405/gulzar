import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { defaultBusinessLocation, validateSocialUrl } from '@/lib/businessLocation';

export async function GET(req: NextRequest) {
  try {
    const settings = await prisma.globalSettings.findFirst();
    
    const address = settings?.officeAddress || defaultBusinessLocation.address;
    const phone = settings?.adminPhone || defaultBusinessLocation.phone; // Fallback to default if not set
    
    // Format phoneRaw: remove spaces, plus sign is kept or custom formatted
    const phoneRaw = phone.replace(/[^+\d]/g, '');

    // Validate social URLs
    const facebookUrl = validateSocialUrl(settings?.facebookUrl) || defaultBusinessLocation.facebookUrl;
    const instagramUrl = validateSocialUrl(settings?.instagramUrl) || defaultBusinessLocation.instagramUrl;
    const youtubeUrl = validateSocialUrl(settings?.youtubeUrl) || defaultBusinessLocation.youtubeUrl;
    const linkedinUrl = validateSocialUrl(settings?.linkedinUrl) || defaultBusinessLocation.linkedinUrl;
    const twitterUrl = validateSocialUrl(settings?.twitterUrl) || defaultBusinessLocation.twitterUrl;
    const defaultPreviewImage = settings?.defaultPreviewImage || defaultBusinessLocation.defaultPreviewImage;

    return NextResponse.json({
      name: defaultBusinessLocation.name,
      address,
      phone,
      phoneRaw,
      facebookUrl,
      instagramUrl,
      youtubeUrl,
      linkedinUrl,
      twitterUrl,
      defaultPreviewImage
    });
  } catch (error) {
    console.error('Failed to fetch business location:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
