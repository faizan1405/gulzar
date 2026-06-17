import GoodProfilesClient from './GoodProfilesClient';
import { Metadata } from 'next';
import { prisma } from '@/lib/db';

export async function generateMetadata(): Promise<Metadata> {
  let settings = null;
  try {
    settings = await prisma.globalSettings.findFirst();
  } catch (e) {
    console.error("Failed to load settings in metadata", e);
  }
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shadimubarak.in';
  const title = "Good Profile Matches — Shadi Mubarak";
  const description = "Explore verified good profile matrimonial matches. Designed for serious candidates seeking handsome and beautiful matrimonial matches with manual phone check verification.";
  const previewImage = settings?.defaultPreviewImage || "/images/nikah-1.jpeg";
  const imageUrl = previewImage.startsWith('http') ? previewImage : `${siteUrl}${previewImage}`;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: '/packages/good-profiles',
    },
    openGraph: {
      title,
      description,
      url: '/packages/good-profiles',
      siteName: "Shadi Mubarak",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Shadi Mubarak Good Profile Package",
        }
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    }
  };
}

export default function GoodProfilesPage() {
  return <GoodProfilesClient />;
}
