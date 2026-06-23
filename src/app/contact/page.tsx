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
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rishteforever.in';
  const title = "Contact Customer Support — Rishte Forever Marriage Bureau";
  const description = "Get in touch with Rishte Forever customer support. Find our New Delhi office address, verified phone number +91-96754-83125, and email details.";
  const previewImage = settings?.defaultPreviewImage || "/images/nikah-1.jpeg";
  const imageUrl = previewImage.startsWith('http') ? previewImage : `${siteUrl}${previewImage}`;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    keywords: [
      "Contact Rishte Forever",
      "Muslim marriage bureau phone number",
      "Muslim matrimonial support",
      "Rishte Forever support",
      "Rishte Forever address"
    ],
    alternates: {
      canonical: '/contact',
    },
    openGraph: {
      title,
      description,
      url: '/contact',
      siteName: "Rishte Forever",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Contact Rishte Forever Support",
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
    "name": "Rishte Forever",
    "image": "https://rishteforever.in/images/nikah-1.jpeg",
    "telePhone": "+91-96754-83125",
    "email": "support@rishteforever.in",
    "url": "https://rishteforever.in",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Innov8 44 Regal Building, 2nd Floor, Property No. 44, Above Madame Tussauds, Regal Building",
      "addressLocality": "Connaught Place, New Delhi",
      "addressRegion": "Delhi",
      "postalCode": "110001",
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
        "item": "https://rishteforever.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Contact Support",
        "item": "https://rishteforever.in/contact"
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
