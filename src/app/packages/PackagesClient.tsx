'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '../../context/SessionContext';
import { getSupportWhatsAppLink } from '../../lib/whatsapp';
import Navbar from '../../components/Navbar';
import PackageInquiryForm from '../../components/PackageInquiryForm';
import {
  SectionHeading,
  PremiumPlanCard,
  PremiumFooter,
} from '../../components/NikahComponents';

export default function PackagesClient() {
  const router = useRouter();
  const [inquiryPackage, setInquiryPackage] = React.useState<string | null>(null);

  const { handleUPIPayment } = useSession();

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
                onActivate={() => handleUPIPayment('monthly_membership', 'Standard Monthly Membership')}
                onInquire={() => setInquiryPackage('₹300 Monthly Membership')}
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
                onActivate={() => handleUPIPayment('good_profile_package', 'Good Profile Package')}
                onInquire={() => setInquiryPackage('₹5,500 Good Profiles Package')}
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
                onActivate={() => handleUPIPayment('second_marriage_package', 'Silver Plan')}
                onInquire={() => setInquiryPackage('₹11,000 Silver Plan')}
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
                onActivate={() => handleUPIPayment('high_profile_package', 'Gold Package')}
                onInquire={() => setInquiryPackage('₹21,000 Gold Package')}
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

      {/* Package Inquiry Modal */}
      {inquiryPackage && (
        <div className="modal-overlay" onClick={() => setInquiryPackage(null)}>
          <div className="card-theme-wrapper modal-inquiry" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setInquiryPackage(null)}
              className="modal-close-btn"
              style={{ position: 'absolute', top: '16px', right: '16px' }}
            >
              ×
            </button>
            <div className="modal-title-center">
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--deep-maroon)', marginBottom: '4px' }}>
                Package Inquiry &amp; Callback
              </h3>
            </div>
            <PackageInquiryForm
              defaultPackage={inquiryPackage}
              onSuccess={() => setInquiryPackage(null)}
              onCancel={() => setInquiryPackage(null)}
            />
          </div>
        </div>
      )}
    </>
  );
}