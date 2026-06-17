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
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shadimubarak.in';
  const title = "Shadi Mubarak — Trusted Muslim Matrimonial Website & Marriage Bureau";
  const description = "Shadi Mubarak is India's premium halal Muslim matrimonial website & marriage bureau. Browse verified Muslim profiles and rishta services with manual verification and complete privacy control.";
  const previewImage = settings?.defaultPreviewImage || "/images/nikah-1.jpeg";
  const imageUrl = previewImage.startsWith('http') ? previewImage : `${siteUrl}${previewImage}`;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    keywords: [
      "Muslim matrimonial website",
      "Muslim marriage bureau",
      "Shadi Mubarak",
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
      siteName: "Shadi Mubarak",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Shadi Mubarak Muslim Matrimonial Platform",
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
    "name": "Shadi Mubarak",
    "url": "https://shadimubarak.in",
    "logo": "https://shadimubarak.in/images/nikah-1.jpeg",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-95570-06617",
      "contactType": "customer support"
    },
    "sameAs": [
      "https://www.facebook.com/shadimubarak",
      "https://www.instagram.com/shadimubarak",
      "https://www.youtube.com/shadimubarak",
      "https://www.linkedin.com/company/shadimubarak",
      "https://x.com/shadimubarak"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Shadi Mubarak",
    "url": "https://shadimubarak.in",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://shadimubarak.in/search?q={search_term_string}",
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
