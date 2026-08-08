'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '../../context/SessionContext';
import { getSupportWhatsAppLink } from '../../lib/whatsapp';
import Navbar from '../../components/Navbar';
import {
  SectionHeading,
  PremiumPlanCard,
  PremiumFooter,
} from '../../components/NikahComponents';
import UPIPaymentModal from '../../components/UPIPaymentModal';

interface PlanDef {
  title: string;
  price: number;
  gstRate: number;
  billingText: string;
  features: string[];
  badgeText: string;
  planTier: string;
  imageUrl: string;
  ctaText: string;
  packageType: string;
  whatsappMessage: string;
}

const PLANS: PlanDef[] = [
  {
    title: 'Monthly Membership',
    price: 300,
    gstRate: 0.18,
    billingText: 'Monthly billing',
    features: [
      'Browse verified profiles',
      'View profile photos',
      'Access contact numbers',
      '1 month validity',
    ],
    badgeText: 'Starter',
    planTier: 'basic',
    imageUrl: '/images/monthly_active.png',
    ctaText: 'Start Monthly Membership',
    packageType: 'monthly_membership',
    whatsappMessage: 'Assalamu Alaikum, I want to know more about the ₹300 monthly membership on Rishte Forever.',
  },
  {
    title: 'Good Profile Package',
    price: 5500,
    gstRate: 0.18,
    billingText: 'One-time, 1 year validity',
    features: [
      'Verified profile suggestions',
      'Basic matchmaking support',
      'Privacy-safe profile sharing',
      '1 year service validity',
    ],
    badgeText: 'Popular',
    planTier: 'basic',
    imageUrl: '/images/good_profile.png',
    ctaText: 'Choose Good Profile Package',
    packageType: 'good_profile_package',
    whatsappMessage: 'Assalamu Alaikum, I am interested in the ₹5,500 Good Profiles Package on Rishte Forever. Please guide me.',
  },
  {
    title: 'Silver Plan',
    price: 11000,
    gstRate: 0.18,
    billingText: 'One-time, 1 year validity',
    features: [
      'Verified profile suggestions',
      'Priority matchmaking support',
      'Profile shortlisting',
      'Family coordination support',
      '1 year service validity',
    ],
    badgeText: 'Recommended',
    planTier: 'silver',
    imageUrl: '/images/second_marriage.png',
    ctaText: 'Choose Silver Plan',
    packageType: 'second_marriage_package',
    whatsappMessage: 'Assalamu Alaikum, I am interested in the ₹11,000 Silver Plan on Rishte Forever. Please guide me.',
  },
  {
    title: 'Gold Package',
    price: 21000,
    gstRate: 0.18,
    billingText: 'One-time, 1 year validity',
    features: [
      'Premium verified profile suggestions',
      'High-priority matchmaking',
      'Personalized shortlisting',
      'Family meeting support',
      '1 year service validity',
    ],
    badgeText: 'Premium Choice',
    planTier: 'gold',
    imageUrl: '/images/high_profile.png',
    ctaText: 'Choose Gold Package',
    packageType: 'high_profile_package',
    whatsappMessage: 'Assalamu Alaikum, I am interested in the ₹21,000 Gold Package on Rishte Forever. Please guide me.',
  },
];

export default function PackagesClient() {
  const router = useRouter();

  const {
    isLoggedIn,
    userProfile,
    handleUPIPayment,
    showUPIModal,
    setShowUPIModal,
    upiModalData,
    setUpiModalData,
    accountData,
  } = useSession();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Collect user name & phone for the payment modal
  const userName = useMemo(
    () => userProfile?.fullName || accountData?.name || '',
    [userProfile, accountData]
  );
  const userPhone = useMemo(
    () => userProfile?.phoneNumber || accountData?.phone || '',
    [userProfile, accountData]
  );

  const handleBuyPackage = async (packageType: string, planName: string) => {
    if (!isLoggedIn) {
      router.push('/login?returnTo=/packages');
      return;
    }

    const isFormComplete = userProfile?.profileCompletionStatus === 'COMPLETE';
    if (!isFormComplete) {
      router.push('/register?returnTo=/packages');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');
    try {
      await handleUPIPayment(packageType, planName);
    } catch {
      setErrorMessage(
        'Unable to initiate payment. Please try again or contact support.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoginToView = () => {
    router.push('/login?returnTo=/packages');
  };

  const handlePaymentSubmitted = () => {
    // After the user submits their payment claim, close the modal
    // and reload data so the session context picks up any changes.
    setShowUPIModal(false);
    setUpiModalData(null);
    // Trigger a reload so loadAllData re-runs and activePackages refreshes
    window.location.reload();
  };

  const handleCloseModal = () => {
    setShowUPIModal(false);
    setUpiModalData(null);
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

            {/* Error / Processing indicator */}
            {errorMessage && (
              <div
                style={{
                  background: 'rgba(111,29,53,0.08)',
                  border: '1px solid rgba(111,29,53,0.2)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  marginBottom: '24px',
                  color: 'var(--deep-maroon)',
                  fontSize: '14px',
                  textAlign: 'center',
                }}
              >
                {errorMessage}{' '}
                <button
                  onClick={() => setErrorMessage('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--deep-maroon)',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Dismiss
                </button>
              </div>
            )}

            <div className="packages-grid">
              {PLANS.map((plan) => (
                <PremiumPlanCard
                  key={plan.packageType}
                  title={plan.title}
                  price={plan.price}
                  gstRate={plan.gstRate}
                  billingText={plan.billingText}
                  features={plan.features}
                  badgeText={plan.badgeText}
                  planTier={plan.planTier}
                  imageUrl={plan.imageUrl}
                  ctaText={plan.ctaText}
                  onActivate={() => {
                    if (!isLoggedIn) {
                      handleLoginToView();
                    } else {
                      handleBuyPackage(plan.packageType, plan.title);
                    }
                  }}
                  whatsappMessage={plan.whatsappMessage}
                  hidePrices={!isLoggedIn || userProfile?.profileCompletionStatus !== 'COMPLETE'}
                  isLoggedIn={isLoggedIn}
                  loginCtaText="Login to View Plans"
                />
              ))}
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

      {/* UPI Payment Modal */}
      <UPIPaymentModal
        isOpen={showUPIModal}
        onClose={handleCloseModal}
        onPaymentSubmitted={handlePaymentSubmitted}
        purchaseId={upiModalData?.purchaseId || ''}
        amount={upiModalData?.amount || 0}
        planName={upiModalData?.planName || ''}
        userName={userName}
        userPhone={userPhone}
      />

      {/* Processing overlay */}
      {isProcessing && (
        <div
          className="modal-overlay"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
          }}
        >
          <div
            className="card-theme-wrapper"
            style={{
              padding: '32px 40px',
              textAlign: 'center',
              maxWidth: '360px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                border: '4px solid var(--border-color)',
                borderTopColor: 'var(--deep-maroon)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px',
              }}
            />
            <p style={{ fontSize: '15px', color: 'var(--text-muted)' }}>
              Setting up your payment…
            </p>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      )}
    </>
  );
}