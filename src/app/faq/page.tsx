import FAQClient from './FAQClient';
import { Metadata } from 'next';
import { prisma } from '@/lib/db';
import JsonLd from '@/components/JsonLd';
import { getFaqJsonLd } from '@/lib/faqData';

export async function generateMetadata(): Promise<Metadata> {
  let settings = null;
  try {
    settings = await prisma.globalSettings.findFirst();
  } catch (e) {
    console.error('Failed to load settings in metadata', e);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rishteforever.in';
  const title = 'Frequently Asked Questions — Rishte Forever Matrimonial';
  const description =
    'Answers about registration, telephone verification, profile visibility, privacy, memberships and packages on Rishte Forever, the trusted Muslim matrimonial platform.';
  const previewImage = settings?.defaultPreviewImage || '/images/nikah-1.jpeg';
  const imageUrl = previewImage.startsWith('http') ? previewImage : `${siteUrl}${previewImage}`;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    keywords: [
      'Rishte Forever FAQ',
      'Muslim matrimonial FAQ',
      'matrimonial verification questions',
      'matrimonial membership questions',
      'Muslim marriage platform help',
      'matrimonial privacy questions',
    ],
    alternates: {
      canonical: '/faq',
    },
    openGraph: {
      title,
      description,
      url: '/faq',
      siteName: 'Rishte Forever',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: 'Rishte Forever Frequently Asked Questions',
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default function FAQPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rishteforever.in';

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Frequently Asked Questions',
        item: `${siteUrl}/faq`,
      },
    ],
  };

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={getFaqJsonLd()} />
      <FAQClient />
    </>
  );
}
