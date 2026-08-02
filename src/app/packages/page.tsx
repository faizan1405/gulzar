import MembershipClient from './MembershipClient';
import { Metadata } from 'next';
import { prisma } from '@/lib/db';
import JsonLd from '@/components/JsonLd';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  let settings = null;
  try {
    settings = await prisma.globalSettings.findFirst();
  } catch (e) {
    console.error('Failed to load settings in packages metadata', e);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rishteforever.in';
  const title = 'Rishta Plans — Rishte Forever Muslim Matrimonial';
  const description =
    'Choose a Rishte Forever membership plan: monthly access, good profiles, silver plan, or gold package. All with manual verification and privacy-first approach.';
  const previewImage = settings?.defaultPreviewImage || '/images/nikah-1.jpeg';
  const imageUrl = previewImage.startsWith('http') ? previewImage : `${siteUrl}${previewImage}`;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: '/packages',
    },
    openGraph: {
      title,
      description,
      url: '/packages',
      siteName: 'Rishte Forever',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: 'Rishte Forever Rishta Plans',
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default function PackagesPage() {
  return (
    <>
      <JsonLd schema={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://rishteforever.in' },
          { '@type': 'ListItem', position: 2, name: 'Rishta Plans', item: 'https://rishteforever.in/packages' },
        ],
      }} />
      <MembershipClient />
    </>
  );
}
