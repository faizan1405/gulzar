import HowItWorksClient from './HowItWorksClient';
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
  const title = "How It Works — Shadi Mubarak Muslim Matrimonial Process";
  const description = "Learn how Shadi Mubarak matching process works. Create matrimonial biodata, complete manual telephone check verification, and start halal family introductions.";
  const previewImage = settings?.defaultPreviewImage || "/images/nikah-1.jpeg";
  const imageUrl = previewImage.startsWith('http') ? previewImage : `${siteUrl}${previewImage}`;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    keywords: [
      "How Shadi Mubarak Works",
      "Muslim matrimonial process",
      "Muslim matchmaking verification",
      "Islamic matrimonial guidelines",
      "Verified Muslim profiles"
    ],
    alternates: {
      canonical: '/how-it-works',
    },
    openGraph: {
      title,
      description,
      url: '/how-it-works',
      siteName: "Shadi Mubarak",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Shadi Mubarak Matrimonial Process Guide",
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

export default function HowItWorksPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is there a fee to search matches?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Registration is free. Viewing detailed candidate photos and phone numbers requires a Standard Monthly Membership (₹300 + GST)."
        }
      },
      {
        "@type": "Question",
        "name": "How does manual verification work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our support team calls each registered number to confirm biological identities, marital histories, and ensure serious intentions before approval."
        }
      }
    ]
  };

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
        "name": "How It Works",
        "item": "https://shadimubarak.in/how-it-works"
      }
    ]
  };

  return (
    <>
      <JsonLd schema={faqSchema} />
      <JsonLd schema={breadcrumbSchema} />
      <HowItWorksClient />
    </>
  );
}
