import { Metadata } from 'next';
import Link from 'next/link';
import { PREMIUM_PACKAGES, PACKAGE_KEYS } from '@/lib/packages';
import { prisma } from '@/lib/db';
import { auth } from '@/auth';
import JsonLd from '@/components/JsonLd';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  let settings = null;
  try {
    settings = await prisma.globalSettings.findFirst();
  } catch (e) {
    console.error('Failed to load settings in packages metadata', e);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rishteforever.in';
  const title = 'Packages & Plans — Rishte Forever Muslim Matrimonial';
  const description =
    'Choose a Rishte Forever matrimonial package that fits your goals: monthly membership, good profile matches, second marriage, or high-profile plan.';
  const previewImage = settings?.defaultPreviewImage || '/images/nikah-1.jpeg';
  const imageUrl = previewImage.startsWith('http') ? previewImage : `${siteUrl}${previewImage}`;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: '/packages',
    },
    openGraph: {
      title,
      description,
      url: '/packages',
      siteName: 'Rishte Forever',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: 'Rishte Forever Packages',
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

const PACKAGE_LINKS: Record<string, { href: string; cta: string }> = {
  monthly_membership: { href: '/register', cta: 'Start Monthly Membership' },
  good_profile_package: { href: '/packages/good-profiles', cta: 'Choose Good Profile Package' },
  second_marriage_package: { href: '/packages/second-marriage', cta: 'Choose Silver Plan' },
  high_profile_package: { href: '/packages/high-profile', cta: 'Choose Gold Package' },
};

const PACKAGE_BADGE: Record<string, string> = {
  monthly_membership: 'Starter',
  good_profile_package: 'Popular',
  second_marriage_package: 'Recommended',
  high_profile_package: 'Premium',
};

export default async function PackagesPage() {
  const session = await auth();

  // Determine if this user has completed their profile form
  let formComplete = false;
  if (session?.user?.id) {
    try {
      const profile = await prisma.matrimonialProfile.findUnique({
        where: { userId: session.user.id },
        select: { profileCompletionStatus: true },
      });
      formComplete = profile?.profileCompletionStatus === 'COMPLETE';
    } catch {
      // DB unavailable — treat as incomplete
    }
  }

  const canShowPrices = formComplete;
  const packageList = [
    PREMIUM_PACKAGES[PACKAGE_KEYS.MONTHLY],
    PREMIUM_PACKAGES[PACKAGE_KEYS.GOOD_PROFILE],
    PREMIUM_PACKAGES[PACKAGE_KEYS.SILVER],
    PREMIUM_PACKAGES[PACKAGE_KEYS.GOLD],
  ];

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Rishte Forever Matrimonial Packages',
    itemListElement: packageList.map((pkg, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Service',
        name: pkg.name,
        description: pkg.benefits.join(', '),
        ...(canShowPrices ? {
          offers: {
            '@type': 'Offer',
            price: pkg.basePrice,
            priceCurrency: 'INR',
          },
        } : {}),
      },
    })),
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-amber-50">
      <JsonLd schema={structuredData} />
      <section className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
        <header className="text-center mb-10">
          <p className="text-sm font-semibold text-rose-600 uppercase tracking-wider">
            Packages & Plans
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">
            Find the right plan for your rishta journey
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-slate-600">
            Whether you are starting out, exploring verified profiles, planning a second marriage,
            or seeking a high-profile match, Rishte Forever has a transparent plan for you.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packageList.map((pkg) => {
            const linkInfo = PACKAGE_LINKS[pkg.type] ?? { href: '/register', cta: 'Get Started' };
            const badge = PACKAGE_BADGE[pkg.type] ?? 'Plan';
            const isMonthly = pkg.billingType === 'MONTHLY';
            return (
              <article
                key={pkg.type}
                className="flex flex-col rounded-2xl border border-rose-100 bg-white shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-block text-xs font-semibold text-rose-600 bg-rose-50 rounded-full px-2 py-1">
                    {badge}
                  </span>
                  {isMonthly && (
                    <span className="text-xs font-medium text-slate-500">Recurring</span>
                  )}
                </div>
                <h2 className="mt-4 text-xl font-semibold text-slate-900">{pkg.name}</h2>
                <p className="mt-2 text-slate-600 text-sm">
                  {isMonthly ? 'Per month access' : 'One-time, 1 year validity'}
                </p>
                <div className="mt-4">
                  {canShowPrices ? (
                    <>
                      <span className="text-3xl font-bold text-slate-900">₹{pkg.totalAmount.toLocaleString('en-IN')}</span>
                      {pkg.gstRate > 0 && (
                        <span className="ml-1 text-xs text-slate-500">incl. GST</span>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-slate-500">
                      Pricing available after profile completion
                    </p>
                  )}
                </div>
                {canShowPrices && pkg.successFeeAmount > 0 && (
                  <p className="mt-1 text-xs text-slate-500">
                    Success fee: ₹{pkg.successFeeAmount.toLocaleString('en-IN')}
                  </p>
                )}
                <ul className="mt-4 space-y-2 text-sm text-slate-700 flex-1">
                  {pkg.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2">
                      <span aria-hidden className="mt-1 text-rose-500">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={linkInfo.href}
                  className="mt-6 inline-flex items-center justify-center rounded-lg bg-rose-600 text-white font-medium px-4 py-2 hover:bg-rose-700 transition-colors"
                >
                  {linkInfo.cta}
                </Link>
              </article>
            );
          })}
        </div>

        <section className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-700">
          <div className="rounded-xl bg-white border border-slate-100 p-5">
            <h3 className="font-semibold text-slate-900">Transparent pricing</h3>
            <p className="mt-2">
              Every plan shows the base price, GST and total upfront. No hidden charges.
            </p>
          </div>
          <div className="rounded-xl bg-white border border-slate-100 p-5">
            <h3 className="font-semibold text-slate-900">Privacy first</h3>
            <p className="mt-2">
              Verified profiles, manual phone checks and privacy redaction come standard on every plan.
            </p>
          </div>
          <div className="rounded-xl bg-white border border-slate-100 p-5">
            <h3 className="font-semibold text-slate-900">Need help choosing?</h3>
            <p className="mt-2">
              Reach out via the <Link href="/contact" className="text-rose-600 underline">contact page</Link> and our team will guide you.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}