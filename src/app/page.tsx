import HomeClient from './HomeClient';
import { Metadata } from 'next';
import { prisma } from '@/lib/db';
import JsonLd from '../components/JsonLd';

export async function generateMetadata(): Promise<Metadata> {
  let settings = null;
  try {
    settings = await prisma.globalSettings.findFirst();
  } catch (e) {
    console.error("Failed to load settings in metadata", e);
  }
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rishteforever.in';
  const title = "Rishte Forever — Trusted Muslim Matrimonial Website & Marriage Bureau";
  const description = "Rishte Forever is India's premium halal Muslim matrimonial website & marriage bureau. Browse verified Muslim profiles and rishta services with manual verification and complete privacy control.";
  const previewImage = settings?.defaultPreviewImage || "/images/nikah-1.jpeg";
  const imageUrl = previewImage.startsWith('http') ? previewImage : `${siteUrl}${previewImage}`;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    keywords: [
      "Muslim matrimonial website",
      "Muslim marriage bureau",
      "Rishte Forever",
      "Muslim rishta service",
      "Islamic matrimonial platform",
      "Verified Muslim profiles",
      "Muslim second marriage profiles",
      "Muslim high profile matchmaking",
      "Muslim marriage profiles in India"
    ],
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title,
      description,
      url: '/',
      siteName: "Rishte Forever",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Rishte Forever Muslim Matrimonial Platform",
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

export default function Home() {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Rishte Forever",
    "url": "https://rishteforever.in",
    "logo": "https://rishteforever.in/images/rishte-forever-logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-96754-83125",
      "contactType": "customer support"
    },
    "sameAs": [
      "https://www.facebook.com/rishteforever",
      "https://www.instagram.com/rishteforever",
      "https://www.youtube.com/rishteforever",
      "https://www.linkedin.com/company/rishteforever",
      "https://x.com/rishteforever"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Rishte Forever",
    "url": "https://rishteforever.in",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://rishteforever.in/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <JsonLd schema={orgSchema} />
      <JsonLd schema={websiteSchema} />
      <HomeClient />
    </>
  );
}
