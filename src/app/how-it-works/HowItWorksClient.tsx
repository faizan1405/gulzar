'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Image from 'next/image';
import { SectionHeading, FloralCorner, PremiumFooter } from '../../components/NikahComponents';

export default function HowItWorksClient() {
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
            title="How Shadi Mubarak Works"
            subtitle="Discover how our platform ensures family safety, Shariah compatibility, and verified introductions."
            scriptText="Step-by-Step Guide"
            as="h1"
          />

          <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div className="card-theme-wrapper" style={{ display: 'flex', gap: '24px', alignItems: 'center', padding: '30px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '300px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div style={{ backgroundColor: 'var(--deep-maroon)', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px', flexShrink: 0 }}>1</div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--deep-maroon)', marginBottom: '8px' }}>Register Your Biodata</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: '1.6' }}>
                    Sign in securely via Google OAuth. Complete our registration wizard with detailed information on your education, occupation, religious outlook, and family background details.
                  </p>
                </div>
              </div>
              <div style={{ width: '160px', height: '160px', position: 'relative', borderRadius: 'var(--border-radius-md)', overflow: 'hidden', border: '2px solid var(--gold-accent)' }}>
                <Image src="/images/nikah-1.jpeg" alt="Create Profile" fill style={{ objectFit: 'cover' }} />
              </div>
            </div>

            <div className="card-theme-wrapper" style={{ display: 'flex', gap: '24px', alignItems: 'center', padding: '30px', flexWrap: 'wrap', flexDirection: 'row-reverse' }}>
              <div style={{ flex: 1, minWidth: '300px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div style={{ backgroundColor: 'var(--deep-maroon)', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px', flexShrink: 0 }}>2</div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--deep-maroon)', marginBottom: '8px' }}>Telephone Verification Check</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: '1.6' }}>
                    After saving your profile, it enters our admin verification queue. An administrator schedules a telephone call check to verify details, maintain high community integrity, and approve the profile.
                  </p>
                </div>
              </div>
              <div style={{ width: '160px', height: '160px', position: 'relative', borderRadius: 'var(--border-radius-md)', overflow: 'hidden', border: '2px solid var(--gold-accent)' }}>
                <Image src="/images/nikah-2.jpeg" alt="Verify Details" fill style={{ objectFit: 'cover' }} />
              </div>
            </div>

            <div className="card-theme-wrapper" style={{ display: 'flex', gap: '24px', alignItems: 'center', padding: '30px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '300px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div style={{ backgroundColor: 'var(--deep-maroon)', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px', flexShrink: 0 }}>3</div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--deep-maroon)', marginBottom: '8px' }}>Privacy blur and Unlock matches</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: '1.6' }}>
                    Photos and phone numbers remain securely blurred to visitors. Activate the standard monthly membership to unblur photos, explore candidates, and access call details.
                  </p>
                </div>
              </div>
              <div style={{ width: '160px', height: '160px', position: 'relative', borderRadius: 'var(--border-radius-md)', overflow: 'hidden', border: '2px solid var(--gold-accent)' }}>
                <Image src="/images/nikah-3.jpeg" alt="Find Suitable Match" fill style={{ objectFit: 'cover' }} />
              </div>
            </div>

            <div className="card-theme-wrapper" style={{ display: 'flex', gap: '24px', alignItems: 'center', padding: '30px', flexWrap: 'wrap', flexDirection: 'row-reverse' }}>
              <div style={{ flex: 1, minWidth: '300px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div style={{ backgroundColor: 'var(--deep-maroon)', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px', flexShrink: 0 }}>4</div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--deep-maroon)', marginBottom: '8px' }}>Start Halal Introductions</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: '1.6' }}>
                    Communicate respectfully. We suggest involving family members as early as possible. Schedule chaperone calls and begin your blessed Nikah preparations with complete trust.
                  </p>
                </div>
              </div>
              <div style={{ width: '160px', height: '160px', position: 'relative', borderRadius: 'var(--border-radius-md)', overflow: 'hidden', border: '2px solid var(--gold-accent)' }}>
                <Image src="/images/nikah-4.jpeg" alt="Family Discussion Nikah Journey" fill style={{ objectFit: 'cover' }} />
              </div>
            </div>
          </div>

          <div className="arch-container max-w-2xl mx-auto p-8 text-center gold-rim gold-glow" style={{ maxWidth: '600px', margin: '48px auto 0 auto', padding: '32px', textAlign: 'center' }}>
            <FloralCorner position="tl" />
            <FloralCorner position="br" />
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--deep-maroon)', marginBottom: '12px' }}>Frequently Asked Questions</h4>
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px', fontSize: '13.5px' }}>
              <p><strong>Q: Is there a fee to search matches?</strong><br />A: Registration is free. Viewing detailed candidate photos and phone numbers requires a Standard Monthly Membership (₹300 + GST).</p>
              <p><strong>Q: How does manual verification work?</strong><br />A: Our support team calls each registered number to confirm biological identities, marital histories, and ensure serious intentions before approval.</p>
            </div>
          </div>
        </div>
      </main>
      <PremiumFooter onNavigate={handleNavigate} />
    </>
  );
}
