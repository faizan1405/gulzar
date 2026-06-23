import SafetyClient from './SafetyClient';
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
  const title = "Safety & Privacy Guidelines — Rishte Forever Matrimonial";
  const description = "Learn how Rishte Forever keeps your Muslim matrimonial search safe. Manual verification, telephone check, photo protection, and strict anti-dating policies.";
  const previewImage = settings?.defaultPreviewImage || "/images/nikah-2.jpeg";
  const imageUrl = previewImage.startsWith('http') ? previewImage : `${siteUrl}${previewImage}`;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    keywords: [
      "Safe Muslim matrimonial sites",
      "Matrimonial site safety tips",
      "Muslim matchmaking privacy",
      "Shariah compliant matrimonial site",
      "Verified Muslim profiles safety",
      "Rishte Forever trust safety guidelines"
    ],
    alternates: {
      canonical: '/safety',
    },
    openGraph: {
      title,
      description,
      url: '/safety',
      siteName: "Rishte Forever",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Rishte Forever Trust and Safety",
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
        "name": "Safety & Privacy Guidelines",
        "item": "https://rishteforever.in/safety"
      }
    ]
  };

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <SafetyClient />
    </>
  );
}
