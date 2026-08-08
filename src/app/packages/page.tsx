import { Metadata } from 'next';
import { prisma } from '@/lib/db';
import PackagesClient from './PackagesClient';
import JsonLd from '../../components/JsonLd';

export async function generateMetadata(): Promise<Metadata> {
  let settings = null;
  try {
    settings = await prisma.globalSettings.findFirst();
  } catch (e) {
    console.error("Failed to load settings in metadata", e);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rishteforever.com';
  const title = "Matrimonial Packages & Plans — Rishte Forever";
  const description = "Explore Rishte Forever matrimonial packages: Monthly Membership, Good Profile Package, Silver Plan, and Gold Package. All plans include manual verification, privacy-safe browsing, and 1-year validity.";
  const previewImage = settings?.defaultPreviewImage || "/images/nikah-1.jpeg";
  const imageUrl = previewImage.startsWith('http') ? previewImage : `${siteUrl}${previewImage}`;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    keywords: [
      "matrimonial packages",
      "Muslim marriage plans",
      "Rishte Forever pricing",
      "matrimonial membership",
      "Muslim matchmaking packages",
      "silver plan matrimonial",
      "gold package Muslim rishta"
    ],
    alternates: {
      canonical: '/packages',
    },
    openGraph: {
      title,
      description,
      url: '/packages',
      siteName: "Rishte Forever",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Rishte Forever Matrimonial Packages",
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

export default function PackagesPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://rishteforever.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Packages",
        "item": "https://rishteforever.com/packages"
      }
    ]
  };

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <PackagesClient />
    </>
  );
}