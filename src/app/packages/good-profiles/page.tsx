import GoodProfilesClient from './GoodProfilesClient';
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
  const title = "Good Profile Matches — Rishte Forever Muslim Matrimonial";
  const description = "Explore verified good profile matrimonial matches on Rishte Forever. Designed for serious candidates seeking handsome and beautiful matrimonial matches with manual phone check verification.";
  const previewImage = settings?.defaultPreviewImage || "/images/nikah-1.jpeg";
  const imageUrl = previewImage.startsWith('http') ? previewImage : `${siteUrl}${previewImage}`;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    keywords: [
      "Verified Muslim profiles",
      "Muslim matrimonial website",
      "Rishte Forever Good Profiles",
      "Handsome Muslim groom profiles",
      "Beautiful Muslim bride profiles"
    ],
    alternates: {
      canonical: '/packages/good-profiles',
    },
    openGraph: {
      title,
      description,
      url: '/packages/good-profiles',
      siteName: "Rishte Forever",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Rishte Forever Good Profile Package",
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
        "name": "Good Profiles Match",
        "item": "https://rishteforever.in/packages/good-profiles"
      }
    ]
  };

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <GoodProfilesClient />
    </>
  );
}
