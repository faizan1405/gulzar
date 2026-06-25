import PremiumClient from './PremiumClient';
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
  const title = "Premium Matrimonial Packages — Rishte Forever";
  const description = "Select from our standard monthly membership, curated good profiles, silver plan matches, or exclusive gold package matrimonial matching options.";
  const previewImage = settings?.defaultPreviewImage || "/images/commitment.png";
  const imageUrl = previewImage.startsWith('http') ? previewImage : `${siteUrl}${previewImage}`;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    keywords: [
      "Muslim matrimonial packages",
      "Muslim marriage bureau rates",
      "Rishte Forever pricing",
      "Premium Muslim matchmaking services",
      "Silver plan matrimonial packages",
      "Gold package Muslim matchmaking cost"
    ],
    alternates: {
      canonical: '/premium',
    },
    openGraph: {
      title,
      description,
      url: '/premium',
      siteName: "Rishte Forever",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Rishte Forever Premium Packages",
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

export default function PremiumPage() {
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
      }
    ]
  };

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <PremiumClient />
    </>
  );
}
