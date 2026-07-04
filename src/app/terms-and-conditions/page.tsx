'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { SectionHeading, PremiumFooter } from '../../components/NikahComponents';

export default function TermsAndConditionsPage() {
  const router = useRouter();

  const handleNavigate = (view: string) => {
    router.push('/' + (view === 'home' ? '' : view));
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <div className="container font-sans" style={{ padding: '40px 0 80px 0' }}>
          <SectionHeading
            title="Terms & Conditions"
            subtitle="Please read our terms of service and Shariah-compliant match guidelines."
            scriptText="Legal Terms"
            as="h1"
          />

          <div className="card-theme-wrapper" style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px', lineHeight: '1.8', color: 'var(--text-dark)' }}>
                                    
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--deep-maroon)', marginBottom: '16px' }}>1. Introduction</h2>
            <p style={{ marginBottom: '24px' }}>Welcome to Rishte Forever. By accessing or using our matrimonial platform, you agree to be bound by these Terms & Conditions. Our service is designed to facilitate Shariah-compliant matchmaking for Muslim singles.</p>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--deep-maroon)', marginBottom: '16px' }}>2. Eligibility</h2>
            <p style={{ marginBottom: '24px' }}>You must be at least 18 years of age (or the legal age of marriage in your jurisdiction) to register an account and use our services. By using Rishte Forever, you represent and warrant that you have the right, authority, and capacity to enter into this agreement.</p>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--deep-maroon)', marginBottom: '16px' }}>3. Profile Information Accuracy</h2>
            <p style={{ marginBottom: '24px' }}>Users must provide true, accurate, and current information during registration. Any false, misleading, or deceptive information will result in immediate account suspension or removal.</p>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--deep-maroon)', marginBottom: '16px' }}>4. Manual Phone Verification Consent</h2>
            <p style={{ marginBottom: '24px' }}>To maintain the integrity of our platform, we require manual phone verification. By registering, you explicitly consent to receiving a verification call from the Rishte Forever Admin team to confirm your profile details.</p>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--deep-maroon)', marginBottom: '16px' }}>5. Shariah-Compliant Match Guidelines</h2>
            <p style={{ marginBottom: '24px' }}>Users are expected to conduct themselves in a respectful, modest, and Islamic manner. Casual dating or non-matrimonial intentions are strictly prohibited and will lead to termination of the account.</p>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--deep-maroon)', marginBottom: '16px' }}>6. User Responsibilities & Privacy</h2>
            <p style={{ marginBottom: '24px' }}>You are responsible for maintaining the confidentiality of your login credentials. You must respect the privacy of other members, including their contact visibility and photo preferences.</p>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--deep-maroon)', marginBottom: '16px' }}>7. Premium Membership & Payment Terms</h2>
            <p style={{ marginBottom: '24px' }}>Certain features require a premium membership. All payments are securely processed. Fees are non-refundable unless explicitly stated otherwise in a specific promotional offer.</p>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--deep-maroon)', marginBottom: '16px' }}>8. No Guarantee of Marriage</h2>
            <p style={{ marginBottom: '24px' }}>While we strive to provide high-quality, verified profiles, Rishte Forever does not guarantee that you will find a match or successfully marry through our platform.</p>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--deep-maroon)', marginBottom: '16px' }}>9. Prohibited Misuse</h2>
            <p style={{ marginBottom: '24px' }}>Spamming, creating fake profiles, requesting money from other members, or using the platform for commercial purposes is strictly forbidden. We reserve the right to remove any profile at our discretion.</p>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--deep-maroon)', marginBottom: '16px' }}>10. Success Fee After Marriage</h2>
            <p style={{ marginBottom: '12px' }}>Rishte Forever may charge a success fee after a marriage is finalized through our platform, as clearly mentioned on our website, membership plan, or written agreement.</p>
            <p style={{ marginBottom: '12px' }}>By using our services, the user agrees to pay the applicable success fee within <strong>3 months from the date of marriage confirmation</strong>.</p>
            <p style={{ marginBottom: '24px' }}>If the user fails to pay the agreed success fee within this period, Rishte Forever reserves the right to recover the pending amount through legal action as per applicable law.</p>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--deep-maroon)', marginBottom: '16px' }}>11. Contact & Support</h2>
            <p>If you have any questions about these Terms, please reach out to us via our Support or Contact pages.</p>
          </div>
        </div>
      </main>
      <PremiumFooter onNavigate={handleNavigate} />
    </>
  );
}
