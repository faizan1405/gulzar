import SecondMarriageClient from './SecondMarriageClient';
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
  const title = "Second Marriage Matrimonial Directory — Rishte Forever";
  const description = "Browse verified second-marriage matches on Rishte Forever. Tailored private matrimonial directory for divorced, widowed, and serious candidates seeking life partners.";
  const previewImage = settings?.defaultPreviewImage || "/images/nikah-2.jpeg";
  const imageUrl = previewImage.startsWith('http') ? previewImage : `${siteUrl}${previewImage}`;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    keywords: [
      "Muslim second marriage profiles",
      "Divorced Muslim matrimonial",
      "Widowed Muslim matrimonial",
      "Second marriage marriage bureau",
      "Rishte Forever Second Marriage"
    ],
    alternates: {
      canonical: '/packages/second-marriage',
    },
    openGraph: {
      title,
      description,
      url: '/packages/second-marriage',
      siteName: "Rishte Forever",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Rishte Forever Second Marriage Package",
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

export default function SecondMarriagePage() {
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
        "name": "Second Marriage Matches",
        "item": "https://rishteforever.in/packages/second-marriage"
      }
    ]
  };

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <SecondMarriageClient />
    </>
  );
}
