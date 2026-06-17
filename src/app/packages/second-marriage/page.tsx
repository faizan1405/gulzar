import SecondMarriageClient from './SecondMarriageClient';
import { Metadata } from 'next';
import { prisma } from '@/lib/db';

export async function generateMetadata(): Promise<Metadata> {
  let settings = null;
  try {
    settings = await prisma.globalSettings.findFirst();
  } catch (e) {
    console.error("Failed to load settings in metadata", e);
  }
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shadimubarak.in';
  const title = "Second Marriage Matrimonial Directory — Shadi Mubarak";
  const description = "Browse verified second-marriage matches. Tailored private matrimonial directory for divorced, widowed, and serious candidates seeking life partners.";
  const previewImage = settings?.defaultPreviewImage || "/images/nikah-2.jpeg";
  const imageUrl = previewImage.startsWith('http') ? previewImage : `${siteUrl}${previewImage}`;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: '/packages/second-marriage',
    },
    openGraph: {
      title,
      description,
      url: '/packages/second-marriage',
      siteName: "Shadi Mubarak",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Shadi Mubarak Second Marriage Package",
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
  return <SecondMarriageClient />;
}
