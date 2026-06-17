import SuccessStoriesClient from './SuccessStoriesClient';
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
  const title = "Success Stories — Shadi Mubarak Muslim Matrimonials";
  const description = "Alhamdulillah! Read inspiring success stories of marriage from blessed couples who found their life partners on Shadi Mubarak.";
  const previewImage = settings?.defaultPreviewImage || "/images/nikah-4.jpeg";
  const imageUrl = previewImage.startsWith('http') ? previewImage : `${siteUrl}${previewImage}`;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    keywords: [
      "Muslim matrimonial success stories",
      "Halal marriage stories India",
      "Islamic matrimonial testimonials",
      "Blessed Nikah stories",
      "Shadi Mubarak success stories"
    ],
    alternates: {
      canonical: '/success-stories',
    },
    openGraph: {
      title,
      description,
      url: '/success-stories',
      siteName: "Shadi Mubarak",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Shadi Mubarak Matrimonial Success Stories",
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

export default function SuccessStoriesPage() {
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
        "name": "Success Stories",
        "item": "https://shadimubarak.in/success-stories"
      }
    ]
  };

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <SuccessStoriesClient />
    </>
  );
}
