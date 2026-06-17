import HomeClient from './HomeClient';
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
  const title = "Shadi Mubarak — Trusted Muslim Matrimonial Platform";
  const description = "Shadi Mubarak is a secure, manual-verified Muslim matrimonial site offering verified matches, curated profiles, second marriages, and premium high-profile listings.";
  const previewImage = settings?.defaultPreviewImage || "/images/nikah-1.jpeg";
  const imageUrl = previewImage.startsWith('http') ? previewImage : `${siteUrl}${previewImage}`;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title,
      description,
      url: '/',
      siteName: "Shadi Mubarak",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Shadi Mubarak Matrimonial Services",
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

export default function Home() {
  return <HomeClient />;
}
