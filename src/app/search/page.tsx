import SearchClient from './SearchClient';
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
  const title = "Muslim Matrimonial Directory — Shadi Mubarak";
  const description = "Search call-verified Muslim brides and grooms by sect, maslak, education, occupation, and family background. Safe and privacy-focused.";
  const previewImage = settings?.defaultPreviewImage || "/images/nikah-2.jpeg";
  const imageUrl = previewImage.startsWith('http') ? previewImage : `${siteUrl}${previewImage}`;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: '/search',
    },
    openGraph: {
      title,
      description,
      url: '/search',
      siteName: "Shadi Mubarak",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Search Shadi Mubarak Matrimonials",
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

export default function SearchPage() {
  return <SearchClient />;
}
