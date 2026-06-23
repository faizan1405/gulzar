import React, { Suspense } from 'react';
import SearchClient from './SearchClient';
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
  const title = "Muslim Matrimonial Directory — Rishte Forever";
  const description = "Search call-verified Muslim brides and grooms by sect, maslak, education, occupation, and family background. Safe and privacy-focused.";
  const previewImage = settings?.defaultPreviewImage || "/images/nikah-2.jpeg";
  const imageUrl = previewImage.startsWith('http') ? previewImage : `${siteUrl}${previewImage}`;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    keywords: [
      "Muslim matrimonial website",
      "Muslim marriage bureau",
      "Rishte Forever search",
      "Verified Muslim profiles",
      "Muslim marriage profiles in India",
      "Muslim rishta service"
    ],
    alternates: {
      canonical: '/search',
    },
    openGraph: {
      title,
      description,
      url: '/search',
      siteName: "Rishte Forever",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Search Rishte Forever Matrimonials",
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

export default function SearchPage() {
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
        "name": "Matrimonial Search Directory",
        "item": "https://rishteforever.in/search"
      }
    ]
  };

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <Suspense fallback={<div className="loading-spinner"></div>}>
        <SearchClient />
      </Suspense>
    </>
  );
}
