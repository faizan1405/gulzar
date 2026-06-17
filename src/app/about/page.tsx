import AboutClient from './AboutClient';
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
  const title = "About Us — Shadi Mubarak Muslim Matrimonial Platform";
  const description = "Learn about Shadi Mubarak, India's trusted Muslim matrimonial platform & marriage bureau enabling serious, call-verified, and Shariah-compliant Muslim matchmaking.";
  const previewImage = settings?.defaultPreviewImage || "/images/nikah-1.jpeg";
  const imageUrl = previewImage.startsWith('http') ? previewImage : `${siteUrl}${previewImage}`;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    keywords: [
      "Muslim matrimonial website",
      "Muslim marriage bureau",
      "Shadi Mubarak About Us",
      "Islamic matrimonial platform",
      "Verified Muslim profiles",
      "Halal Muslim matchmaking"
    ],
    alternates: {
      canonical: '/about',
    },
    openGraph: {
      title,
      description,
      url: '/about',
      siteName: "Shadi Mubarak",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "About Shadi Mubarak Matrimonial",
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

export default function AboutPage() {
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
        "name": "About Us",
        "item": "https://shadimubarak.in/about"
      }
    ]
  };

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <AboutClient />
    </>
  );
}
