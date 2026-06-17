import ContactClient from './ContactClient';
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
  const title = "Contact Customer Support — Shadi Mubarak Marriage Bureau";
  const description = "Get in touch with Shadi Mubarak customer support. Find our Bandra office address, verified phone number +91-95570-06617, and email details.";
  const previewImage = settings?.defaultPreviewImage || "/images/nikah-1.jpeg";
  const imageUrl = previewImage.startsWith('http') ? previewImage : `${siteUrl}${previewImage}`;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    keywords: [
      "Contact Shadi Mubarak",
      "Muslim marriage bureau phone number",
      "Muslim matrimonial support",
      "Shadi Mubarak support",
      "Shadi Mubarak address"
    ],
    alternates: {
      canonical: '/contact',
    },
    openGraph: {
      title,
      description,
      url: '/contact',
      siteName: "Shadi Mubarak",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Contact Shadi Mubarak Support",
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

export default function ContactPage() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Shadi Mubarak",
    "image": "https://shadimubarak.in/images/nikah-1.jpeg",
    "telePhone": "+91-95570-06617",
    "email": "support@shadimubarak.in",
    "url": "https://shadimubarak.in",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Bandra West",
      "addressLocality": "Mumbai",
      "addressRegion": "Maharashtra",
      "postalCode": "400050",
      "addressCountry": "IN"
    },
    "priceRange": "$$",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "10:00",
      "closes": "18:00"
    }
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
        "name": "Contact Support",
        "item": "https://shadimubarak.in/contact"
      }
    ]
  };

  return (
    <>
      <JsonLd schema={localBusinessSchema} />
      <JsonLd schema={breadcrumbSchema} />
      <ContactClient />
    </>
  );
}
