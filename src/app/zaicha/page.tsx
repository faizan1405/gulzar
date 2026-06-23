import ZaichaClient from './ZaichaClient';
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
  const title = "Zaicha | Rishte Forever";
  const description = "Traditional Zaicha compatibility guidance for Muslim matrimonial matches. Optional supportive family guidance based on deen and character.";
  const previewImage = settings?.defaultPreviewImage || "/images/commitment.png";
  const imageUrl = previewImage.startsWith('http') ? previewImage : `${siteUrl}${previewImage}`;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    keywords: [
      "Zaicha marriage compatibility",
      "Islamic matrimonial compatibility",
      "Zaicha guidance",
      "Muslim matchmaking support",
      "Rishte Forever Zaicha compatibility"
    ],
    alternates: {
      canonical: '/zaicha',
    },
    openGraph: {
      title,
      description,
      url: '/zaicha',
      siteName: "Rishte Forever",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Rishte Forever Zaicha Guidance",
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

export default function ZaichaPage() {
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
        "name": "Zaicha Guidance",
        "item": "https://rishteforever.in/zaicha"
      }
    ]
  };

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <ZaichaClient />
    </>
  );
}
