'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '../../context/SessionContext';
import { getSupportWhatsAppLink } from '../../lib/whatsapp';
import Navbar from '../../components/Navbar';
import {
  SectionHeading,
  PremiumPlanCard,
  PremiumFooter,
} from '../../components/NikahComponents';

export default function PackagesClient() {
  const router = useRouter();

  const {
    isLoggedIn,
    userProfile,
    handleUPIPayment,
  } = useSession();

  const handleBuyPackage = async (packageType: string, planName: string) => {
    if (!isLoggedIn) {
      router.push('/register');
      return;
    }

    const isFormComplete = userProfile?.profileCompletionStatus === 'COMPLETE';
    if (!isFormComplete) {
      router.push('/register');
      return;
    }

    await handleUPIPayment(packageType, planName);
  };

  const handleNavigate = (view: string) => {
    router.push('/' + (view === 'home' ? '' : view));
  };

  return (
    <>
      <Navbar />

      <main className="flex-grow">
        <div className="home-section home-section-white" style={{ paddingTop: '48px' }}>
          <div className="container">
            <SectionHeading
              title="Rishta Plans"
              subtitle="Choose the plan that fits your journey. All include manual phone verification, privacy-safe browsing, and 1-year validity."
              scriptText="Memberships"
            />

            <div className="packages-grid">
              <PremiumPlanCard
                title="Monthly Membership"
                price={300}
                gstRate={0.18}
                billingText="Monthly billing"
                features={[
                  'Browse verified profiles',
                  'View profile photos',
                  'Access contact numbers',
                  '1 month validity',
                ]}
                badgeText="Starter"
                planTier="basic"
                imageUrl="/images/monthly_active.png"
                ctaText="Start Monthly Membership"
                onActivate={() => handleBuyPackage('monthly_membership', 'Standard Monthly Membership')}
                whatsappMessage="Assalamu Alaikum, I want to know more about the ₹300 monthly membership on Rishte Forever."
              />
              <PremiumPlanCard
                title="Good Profile Package"
                price={5500}
                gstRate={0.18}
                billingText="One-time, 1 year validity"
                features={[
                  'Verified profile suggestions',
                  'Basic matchmaking support',
                  'Privacy-safe profile sharing',
                  '1 year service validity',
                ]}
                badgeText="Popular"
                planTier="basic"
                imageUrl="/images/good_profile.png"
                ctaText="Choose Good Profile Package"
                onActivate={() => handleBuyPackage('good_profile_package', 'Good Profile Package')}
                whatsappMessage="Assalamu Alaikum, I am interested in the ₹5,500 Good Profiles Package on Rishte Forever. Please guide me."
              />
              <PremiumPlanCard
                title="Silver Plan"
                price={11000}
                gstRate={0.18}
                billingText="One-time, 1 year validity"
                features={[
                  'Verified profile suggestions',
                  'Priority matchmaking support',
                  'Profile shortlisting',
                  'Family coordination support',
                  '1 year service validity',
                ]}
                badgeText="Recommended"
                planTier="silver"
                imageUrl="/images/second_marriage.png"
                ctaText="Choose Silver Plan"
                onActivate={() => handleBuyPackage('second_marriage_package', 'Silver Plan')}
                whatsappMessage="Assalamu Alaikum, I am interested in the ₹11,000 Silver Plan on Rishte Forever. Please guide me."
              />
              <PremiumPlanCard
                title="Gold Package"
                price={21000}
                gstRate={0.18}
                billingText="One-time, 1 year validity"
                features={[
                  'Premium verified profile suggestions',
                  'High-priority matchmaking',
                  'Personalized shortlisting',
                  'Family meeting support',
                  '1 year service validity',
                ]}
                badgeText="Premium Choice"
                planTier="gold"
                imageUrl="/images/high_profile.png"
                ctaText="Choose Gold Package"
                onActivate={() => handleBuyPackage('high_profile_package', 'Gold Package')}
                whatsappMessage="Assalamu Alaikum, I am interested in the ₹21,000 Gold Package on Rishte Forever. Please guide me."
              />
            </div>

            <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '15px', color: 'var(--text-muted)' }}>
              Need help choosing?{' '}
              <a
                href={getSupportWhatsAppLink('Assalamu Alaikum, I need help choosing the right matrimonial package on Rishte Forever. Please guide me.')}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'underline', fontWeight: 600, color: 'var(--deep-maroon)' }}
              >
                Chat on WhatsApp to discuss plans →
              </a>
            </p>
          </div>
        </div>
      </main>

      <PremiumFooter onNavigate={handleNavigate} />
    </>
  );
}