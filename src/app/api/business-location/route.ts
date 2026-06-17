import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { defaultBusinessLocation, sanitizeMapsUrl, validateSocialUrl } from '@/lib/businessLocation';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const settings = await prisma.globalSettings.findFirst();
    
    const address = settings?.officeAddress || defaultBusinessLocation.address;
    const phone = settings?.adminPhone || defaultBusinessLocation.phone; // Fallback to default if not set
    
    // Format phoneRaw: remove spaces, plus sign is kept or custom formatted
    const phoneRaw = phone.replace(/[^+\d]/g, '');

    const mapEmbedUrl = sanitizeMapsUrl(settings?.mapEmbedUrl, defaultBusinessLocation.mapEmbedUrl);
    const mapOpenUrl = sanitizeMapsUrl(settings?.mapOpenUrl, defaultBusinessLocation.mapOpenUrl);

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
      mapEmbedUrl,
      mapOpenUrl,
      facebookUrl,
      instagramUrl,
      youtubeUrl,
      linkedinUrl,
      twitterUrl,
      defaultPreviewImage
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
