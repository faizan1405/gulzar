'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { SectionHeading, FloralCorner, PremiumFooter } from '../../components/NikahComponents';

export default function PrivacyPolicyPage() {
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
            title="Privacy Policy"
            subtitle="How we collect, use, and protect your personal information."
            scriptText="Your Privacy"
            as="h1"
          />

          <div className="card-theme-wrapper" style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px', lineHeight: '1.8', color: 'var(--text-dark)' }}>
            <FloralCorner position="tl" color="var(--gold-accent)" />
            <FloralCorner position="tr" color="var(--gold-accent)" />
            
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--deep-maroon)', marginBottom: '16px' }}>1. Information We Collect</h2>
            <p style={{ marginBottom: '24px' }}>We collect personal information such as your name, date of birth, location, education, occupation, religious preferences, and contact details when you register a profile on Rishte Forever.</p>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--deep-maroon)', marginBottom: '16px' }}>2. How Profile Data is Used</h2>
            <p style={{ marginBottom: '24px' }}>Your data is used strictly for matchmaking purposes. We display your profile information to other registered, verified members to help you find a suitable Shariah-compliant match.</p>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--deep-maroon)', marginBottom: '16px' }}>3. Phone Verification & Admin Review</h2>
            <p style={{ marginBottom: '24px' }}>Your phone number is required for manual verification by our Admin team. This process ensures the authenticity of profiles and creates a secure environment for all members.</p>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--deep-maroon)', marginBottom: '16px' }}>4. Photo & Contact Privacy</h2>
            <p style={{ marginBottom: '24px' }}>We respect your privacy. Photos and contact numbers remain blurred or hidden from public visitors and standard profiles until you authorize sharing or someone activates a compatible premium plan to view them.</p>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--deep-maroon)', marginBottom: '16px' }}>5. Data Sharing Policy</h2>
            <p style={{ marginBottom: '24px' }}>We do not sell, trade, or rent your personal information to third parties. Data is only shared with potential matches within the secure environment of our platform.</p>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--deep-maroon)', marginBottom: '16px' }}>6. Payment Information Note</h2>
            <p style={{ marginBottom: '24px' }}>All payment transactions are processed through secure, encrypted, third-party payment gateways. Rishte Forever does not store your credit card or sensitive banking details on our servers.</p>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--deep-maroon)', marginBottom: '16px' }}>7. Cookies & Analytics</h2>
            <p style={{ marginBottom: '24px' }}>We may use cookies to enhance your browsing experience, keep you logged in, and analyze website traffic. You can adjust your browser settings to decline cookies if preferred.</p>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--deep-maroon)', marginBottom: '16px' }}>8. Data Security</h2>
            <p style={{ marginBottom: '24px' }}>We implement strict security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--deep-maroon)', marginBottom: '16px' }}>9. User Rights & Profile Deletion</h2>
            <p style={{ marginBottom: '24px' }}>You have the right to review, update, or request the deletion of your profile data at any time. Upon marriage or if you wish to leave, you can request account removal from your settings or by contacting admin.</p>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--deep-maroon)', marginBottom: '16px' }}>10. Contact Us</h2>
            <p>If you have any questions or concerns regarding this Privacy Policy, please reach out via our Contact Support page.</p>
          </div>
        </div>
      </main>
      <PremiumFooter onNavigate={handleNavigate} />
    </>
  );
}
