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
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shadimubarak.in';
  const title = "Premium Matrimonial Packages — Shadi Mubarak";
  const description = "Select from our standard monthly membership, curated good profiles, second-marriage directory, or exclusive high-profile matrimonial matching options.";
  const previewImage = settings?.defaultPreviewImage || "/images/nikah-3.jpeg";
  const imageUrl = previewImage.startsWith('http') ? previewImage : `${siteUrl}${previewImage}`;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    keywords: [
      "Muslim matrimonial packages",
      "Muslim marriage bureau rates",
      "Shadi Mubarak pricing",
      "Premium Muslim matchmaking services",
      "Second marriage matrimonial packages",
      "High profile Muslim matchmaking cost"
    ],
    alternates: {
      canonical: '/premium',
    },
    openGraph: {
      title,
      description,
      url: '/premium',
      siteName: "Shadi Mubarak",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Shadi Mubarak Premium Packages",
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
        "item": "https://shadimubarak.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Premium Packages",
        "item": "https://shadimubarak.in/premium"
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
