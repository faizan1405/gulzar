import HighProfileClient from './HighProfileClient';
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
  const title = "High Profile Matrimonial Matches — Shadi Mubarak";
  const description = "Browse verified high-profile Muslim matrimonial candidates earning ₹10 Lakh+ annually (Doctors, Engineers, Business Owners, and Premium Families).";
  const previewImage = settings?.defaultPreviewImage || "/images/nikah-3.jpeg";
  const imageUrl = previewImage.startsWith('http') ? previewImage : `${siteUrl}${previewImage}`;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: '/packages/high-profile',
    },
    openGraph: {
      title,
      description,
      url: '/packages/high-profile',
      siteName: "Shadi Mubarak",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Shadi Mubarak High Profile Package",
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

export default function HighProfilePage() {
  return <HighProfileClient />;
}
