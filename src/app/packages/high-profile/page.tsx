import HighProfileClient from './HighProfileClient';
import { Metadata } from 'next';
import { prisma } from '@/lib/db';
import JsonLd from '@/components/JsonLd';

export async function generateMetadata(): Promise<Metadata> {
  let settings = null;
  try {
    settings = await prisma.globalSettings.findFirst();
  } catch (e) {
    console.error("Failed to load settings in metadata", e);
  }
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rishteforever.in';
  const title = "High Profile Matrimonial Matches — Rishte Forever";
  const description = "Browse verified high-profile Muslim matrimonial candidates earning ₹10 Lakh+ annually (Doctors, Engineers, Business Owners, and Premium Families) on Rishte Forever.";
  const previewImage = settings?.defaultPreviewImage || "/images/nikah-3.jpeg";
  const imageUrl = previewImage.startsWith('http') ? previewImage : `${siteUrl}${previewImage}`;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    keywords: [
      "Muslim high profile matchmaking",
      "Premium Muslim matchmaking services",
      "Doctors matrimonial Muslim",
      "Engineers matrimonial Muslim",
      "Rishte Forever High Profile"
    ],
    alternates: {
      canonical: '/packages/high-profile',
    },
    openGraph: {
      title,
      description,
      url: '/packages/high-profile',
      siteName: "Rishte Forever",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Rishte Forever High Profile Package",
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
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://rishteforever.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Premium Packages",
        "item": "https://rishteforever.in/premium"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "High Profile Matches",
        "item": "https://rishteforever.in/packages/high-profile"
      }
    ]
  };

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <HighProfileClient />
    </>
  );
}
