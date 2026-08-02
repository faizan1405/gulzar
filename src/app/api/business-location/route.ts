import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { defaultBusinessLocation, validateSocialUrl } from '@/lib/businessLocation';

export async function GET() {
  try {
    const settings = await prisma.globalSettings.findFirst();

    const address = settings?.officeAddress || defaultBusinessLocation.address;
    const phone = settings?.adminPhone || defaultBusinessLocation.phone;

    const phoneRaw = phone.replace(/[^+\d]/g, '');

    const facebookUrl = validateSocialUrl(settings?.facebookUrl) || defaultBusinessLocation.facebookUrl;
    const instagramUrl = validateSocialUrl(settings?.instagramUrl) || defaultBusinessLocation.instagramUrl;
    const youtubeUrl = validateSocialUrl(settings?.youtubeUrl) || defaultBusinessLocation.youtubeUrl;
    const linkedinUrl = validateSocialUrl(settings?.linkedinUrl) || defaultBusinessLocation.linkedinUrl;
    const twitterUrl = validateSocialUrl(settings?.twitterUrl) || defaultBusinessLocation.twitterUrl;
    const defaultPreviewImage = settings?.defaultPreviewImage || defaultBusinessLocation.defaultPreviewImage;

    const headers = new Headers();
    headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    headers.set('CDN-Cache-Control', 'public, s-maxage=300');

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
    }, { headers });
  } catch (error) {
    console.error('Failed to fetch business location:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
