import SafetyClient from './SafetyClient';
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
  const title = "Safety & Privacy Guidelines — Shadi Mubarak";
  const description = "Learn how Shadi Mubarak keeps your matrimonial search safe. Manual verification, phone masking, photo protection, and strict anti-dating policies.";
  const previewImage = settings?.defaultPreviewImage || "/images/nikah-2.jpeg";
  const imageUrl = previewImage.startsWith('http') ? previewImage : `${siteUrl}${previewImage}`;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: '/safety',
    },
    openGraph: {
      title,
      description,
      url: '/safety',
      siteName: "Shadi Mubarak",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Shadi Mubarak Trust and Safety",
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

export default function SafetyPage() {
  return <SafetyClient />;
}
