'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from '@/context/SessionContext';
import Navbar from '@/components/Navbar';
import { SectionHeading, PremiumPlanCard, PremiumFooter } from '@/components/NikahComponents';
import PackageInquiryModal from '@/components/PackageInquiryModal';
import { PREMIUM_PACKAGES, PACKAGE_KEYS } from '@/lib/packages';
import { getSupportWhatsAppLink } from '../../lib/whatsapp';

export default function MembershipClient() {
  const router = useRouter();
  const {
    isLoggedIn,
    handleUPIPayment,
    userProfile,
    setIsRegistering,
    setRegStep,
    setShowLoginModal,
    activePackages,
  } = useSession();

  const isFormComplete = isLoggedIn && userProfile?.profileCompletionStatus === 'COMPLETE';
  const [inquiryPackage, setInquiryPackage] = useState<string | null>(null);

  const hasPaid300 = activePackages.includes('monthly_membership');
  const hasGoodProfile = activePackages.includes('good_profile_package');
  const hasSilver = activePackages.includes('second_marriage_package');
  const hasGold = activePackages.includes('high_profile_package');

  const handleCompleteForm = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      router.push('/');
      return;
    }
    setIsRegistering(true);
    setRegStep(1);
    router.push('/');
  };

  const handleNavigate = (view: string) => {
    router.push('/' + (view === 'home' ? '' : view));
  };

  const packages = [
    {
      ...PREMIUM_PACKAGES[PACKAGE_KEYS.MONTHLY],
      key: PACKAGE_KEYS.MONTHLY,
      positioning: 'Essential access to verified profiles',
      badge: 'Essential',
      planTier: 'basic' as const,
      isActive: hasPaid300,
      ctaText: 'Start Monthly Membership',
      onActivate: () => handleUPIPayment('monthly_membership', 300, 'Standard Monthly Membership'),
      onInquire: () => setInquiryPackage('₹300 Monthly Membership'),
      whatsappMessage: 'Assalamu Alaikum, I want to know more about the ₹300 monthly membership on Rishte Forever.',
      imageUrl: '/images/monthly_active.png',
    },
    {
      ...PREMIUM_PACKAGES[PACKAGE_KEYS.GOOD_PROFILE],
      key: PACKAGE_KEYS.GOOD_PROFILE,
      positioning: 'Verified profile suggestions with basic matchmaking',
      badge: 'Popular',
      planTier: 'basic' as const,
      isActive: hasGoodProfile,
      ctaText: 'Buy Good Profile Package',
      onActivate: () => handleUPIPayment('good_profile_package', 5500, 'Good Profile Package'),
      onInquire: () => setInquiryPackage('₹5,500 Good Profiles Package'),
      whatsappMessage: 'Assalamu Alaikum, I am interested in the ₹5,500 Good Profiles Package on Rishte Forever. Please guide me.',
      imageUrl: '/images/good_profile.png',
    },
    {
      ...PREMIUM_PACKAGES[PACKAGE_KEYS.SILVER],
      key: PACKAGE_KEYS.SILVER,
      positioning: 'Priority support for serious matchmaking',
      badge: 'Recommended',
      planTier: 'silver' as const,
      isActive: hasSilver,
      ctaText: 'Buy Silver Plan',
      onActivate: () => handleUPIPayment('second_marriage_package', 11000, 'Silver Plan'),
      onInquire: () => setInquiryPackage('₹11,000 Silver Plan'),
      whatsappMessage: 'Assalamu Alaikum, I am interested in the ₹11,000 Silver Plan on Rishte Forever. Please guide me.',
      imageUrl: '/images/second_marriage.png',
    },
    {
      ...PREMIUM_PACKAGES[PACKAGE_KEYS.GOLD],
      key: PACKAGE_KEYS.GOLD,
      positioning: 'Full concierge matchmaking experience',
      badge: 'Premium Choice',
      planTier: 'gold' as const,
      isActive: hasGold,
      ctaText: 'Buy Gold Package',
      onActivate: () => handleUPIPayment('high_profile_package', 21000, 'Gold Package'),
      onInquire: () => setInquiryPackage('₹21,000 Gold Package'),
      whatsappMessage: 'Assalamu Alaikum, I am interested in the ₹21,000 Gold Package on Rishte Forever. Please guide me.',
      imageUrl: '/images/high_profile.png',
    },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-grow" style={{ paddingBottom: '180px' }}>
        <div className="container font-sans" style={{ padding: '40px 0 180px 0' }}>
          <SectionHeading
            title="Rishta Plans"
            subtitle="Choose a membership that fits your journey toward a blessed nikah."
            scriptText="Memberships"
            as="h1"
          />

          {/* Intro trust strip */}
          <div
            className="card-theme-wrapper"
            style={{
              padding: '20px 28px',
              marginBottom: '48px',
              marginTop: '24px',
              borderLeft: '4px solid var(--gold-accent)',
              background: 'linear-gradient(135deg, rgba(111,29,53,0.04), rgba(184,146,74,0.04))',
            }}
          >
            <p style={{ fontSize: '15px', color: 'var(--text-dark)', lineHeight: '1.7' }}>
              All packages include <strong>manual phone verification</strong>, <strong>blurred privacy</strong> by default, and <strong>1-year service validity</strong>.
              GST (18%) is added at checkout — <strong>no hidden fees</strong>.
            </p>
          </div>

          {/* Tier Cards */}
          <div
            className="grid-4"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '32px',
              marginBottom: '60px',
            }}
          >
            {packages.map((pkg) => (
              <PremiumPlanCard
                key={pkg.key}
                title={pkg.name}
                price={pkg.basePrice}
                gstRate={pkg.gstRate}
                billingText={pkg.billingType === 'MONTHLY' ? 'Monthly billing' : 'One-time payment'}
                features={pkg.benefits.slice(0, 6)}
                positioning={pkg.positioning}
                badgeText={pkg.badge}
                planTier={pkg.planTier}
                isActive={pkg.isActive}
                ctaText={pkg.ctaText}
                onActivate={pkg.onActivate}
                onInquire={pkg.onInquire}
                whatsappMessage={pkg.whatsappMessage}
                imageUrl={pkg.imageUrl}
                hidePrices={false}
                isLoggedIn={isLoggedIn}
                onCompleteForm={handleCompleteForm}
                onShowLogin={() => setShowLoginModal(true)}
              />
            ))}
          </div>

          {/* Trust Tiles */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '24px',
              marginBottom: '56px',
            }}
          >
            <div
              className="card-theme-wrapper"
              style={{
                padding: '28px',
                textAlign: 'center',
                borderTop: '3px solid var(--gold-accent)',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>✓</div>
              <h4
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '17px',
                  color: 'var(--deep-maroon)',
                  marginBottom: '8px',
                }}
              >
                Verified Profiles
              </h4>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Every profile undergoes a manual telephone verification check before joining our directory.
              </p>
            </div>
            <div
              className="card-theme-wrapper"
              style={{
                padding: '28px',
                textAlign: 'center',
                borderTop: '3px solid var(--gold-accent)',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔒</div>
              <h4
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '17px',
                  color: 'var(--deep-maroon)',
                  marginBottom: '8px',
                }}
              >
                Privacy First
              </h4>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Photos and contact details stay blurred by default. Sharing is consensual and controlled.
              </p>
            </div>
            <div
              className="card-theme-wrapper"
              style={{
                padding: '28px',
                textAlign: 'center',
                borderTop: '3px solid var(--gold-accent)',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>💬</div>
              <h4
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '17px',
                  color: 'var(--deep-maroon)',
                  marginBottom: '8px',
                }}
              >
                Dedicated Support
              </h4>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Need help choosing? Our team guides you personally via call or WhatsApp. No bots.
              </p>
            </div>
          </div>

          {/* Comparison Matrix */}
          <div
            className="card-theme-wrapper"
            style={{ padding: '36px', marginBottom: '48px' }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '22px',
                color: 'var(--deep-maroon)',
                marginBottom: '24px',
                textAlign: 'center',
              }}
            >
              Package Comparison
            </h3>
            <div className="table-responsive">
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  textAlign: 'center',
                  fontSize: '14px',
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: '2px solid var(--border-color)',
                      color: 'var(--deep-maroon)',
                      fontWeight: 700,
                    }}
                  >
                    <th style={{ textAlign: 'left', padding: '12px' }}>Feature</th>
                    <th>Essential</th>
                    <th>Popular</th>
                    <th>Recommended</th>
                    <th>Premium</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'Directory Search', monthly: true, good: true, silver: true, gold: true },
                    { feature: 'Unblurred Normal Profiles', monthly: true, good: true, silver: true, gold: true },
                    { feature: 'Phone Number Access', monthly: true, good: true, silver: true, gold: true },
                    { feature: '1 Year Service Validity', monthly: true, good: true, silver: true, gold: true },
                    { feature: 'Silver Plan Directory', monthly: false, good: false, silver: true, gold: true },
                    { feature: 'Gold Package Directory', monthly: false, good: false, silver: false, gold: true },
                    { feature: 'Matchmaking Support', monthly: false, good: 'Basic', silver: 'Priority', gold: 'High-Priority' },
                    { feature: 'Profile Shortlisting', monthly: false, good: false, silver: true, gold: true },
                    { feature: 'Family Coordination', monthly: false, good: false, silver: true, gold: true },
                    { feature: 'Dedicated Support Agent', monthly: false, good: false, silver: false, gold: true },
                  ].map((row, i) => (
                    <tr
                      key={i}
                      style={{
                        borderBottom: '1px solid var(--border-color)',
                        height: '44px',
                      }}
                    >
                      <td style={{ textAlign: 'left', padding: '12px', fontWeight: 500 }}>
                        {row.feature}
                      </td>
                      <td>{typeof row.monthly === 'boolean' ? (row.monthly ? '✓' : '—') : row.monthly}</td>
                      <td>{typeof row.good === 'boolean' ? (row.good ? '✓' : '—') : row.good}</td>
                      <td>{typeof row.silver === 'boolean' ? (row.silver ? '✓' : '—') : row.silver}</td>
                      <td>{typeof row.gold === 'boolean' ? (row.gold ? '✓' : '—') : row.gold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Final CTA Strip */}
          <div
            className="card-theme-wrapper"
            style={{
              padding: '40px',
              textAlign: 'center',
              background: 'var(--deep-maroon)',
              color: 'var(--white)',
              borderRadius: 'var(--border-radius-xl)',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '24px',
                marginBottom: '12px',
                color: 'var(--white)',
              }}
            >
              Not sure which plan is right for you?
            </h3>
            <p style={{ fontSize: '15px', opacity: 0.85, marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
              Our team will guide you to the best option based on your needs — no pressure, just honest advice.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/contact" className="btn btn-gold">
                Contact Us
              </Link>
              <a
                href={getSupportWhatsAppLink('Assalamu Alaikum, I need help choosing the right Rishte Forever plan for me.')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{
                  backgroundColor: '#25D366',
                  color: '#ffffff',
                  border: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M12.012 2C6.506 2 2.042 6.478 2.042 12.012 2.042 13.782 2.5 15.442 3.3 17.277L2 22l5.253-1.378c1.402.766 3 1.2 4.759 1.2 5.506 0 9.97-4.478 9.97-10.012 0-5.534-4.464-10.012-9.97-10.012zM17.807 15.91c-.244.694-1.22 1.268-1.745 1.355-.472.079-.938.293-3.04-.542-2.527-.998-4.14-3.565-4.267-3.731-.127-.166-.991-1.32-.991-2.518 0-1.2.626-1.79.847-2.029.221-.24.479-.3.639-.3a.46.46 0 0 1 .332.155c.105.155.434 1.058.471 1.139.037.081.062.176.009.282-.053.106-.079.171-.157.262-.078.09-.166.2-.236.269-.079.078-.162.162-.07.32.092.158.411.678.88 1.096.604.538 1.111.704 1.267.782.157.078.249.066.342-.04.093-.106.402-.469.511-.627.109-.158.217-.132.366-.077.148.055.942.443 1.103.524.161.081.268.121.308.19.04.069.04.4-.204 1.094z" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </main>

      <PackageInquiryModal
        isOpen={!!inquiryPackage}
        onClose={() => setInquiryPackage(null)}
        defaultPackage={inquiryPackage ?? ''}
      />

      <PremiumFooter onNavigate={handleNavigate} />
    </>
  );
}
