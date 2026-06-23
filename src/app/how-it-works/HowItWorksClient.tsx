'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Image from 'next/image';
import { SectionHeading, FloralCorner, PremiumFooter } from '../../components/NikahComponents';

interface Step {
  num: number;
  title: string;
  desc: string;
  img: string;
  alt: string;
}

const steps: Step[] = [
  {
    num: 1,
    title: 'Register Your Biodata',
    desc: 'Sign in securely via Google OAuth. Complete our registration wizard with detailed information on your education, occupation, religious outlook, and family background details.',
    img: '/images/nikah-1.jpeg',
    alt: 'Create Profile',
  },
  {
    num: 2,
    title: 'Telephone Verification Check',
    desc: 'After saving your profile, it enters our admin verification queue. An administrator schedules a telephone call check to verify details, maintain high community integrity, and approve the profile.',
    img: '/images/nikah-2.jpeg',
    alt: 'Verify Details',
  },
  {
    num: 3,
    title: 'Privacy blur and Unlock matches',
    desc: 'Photos and phone numbers remain securely blurred to visitors. Activate the standard monthly membership to unblur photos, explore candidates, and access call details.',
    img: '/images/nikah-3.jpeg',
    alt: 'Find Suitable Match',
  },
  {
    num: 4,
    title: 'Start Halal Introductions',
    desc: 'Communicate respectfully. We suggest involving family members as early as possible. Schedule chaperone calls and begin your blessed Nikah preparations with complete trust.',
    img: '/images/nikah-4.jpeg',
    alt: 'Family Discussion Nikah Journey',
  },
];

// Shared image-area styling reused by every step card (single source of truth).
const imageBoxStyle: React.CSSProperties = {
  flex: 1,
  minWidth: '280px',
  alignSelf: 'stretch',
  minHeight: '220px',
  position: 'relative',
  borderRadius: 'var(--border-radius-md)',
  overflow: 'hidden',
  border: '2px solid var(--gold-accent)',
};

const imageStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
};

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
            title="How Rishte Forever Works"
            subtitle="Discover how our platform ensures family safety, Shariah compatibility, and verified introductions."
            scriptText="Step-by-Step Guide"
            as="h1"
          />

          <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {steps.map((step, idx) => (
              <div
                key={step.num}
                className="card-theme-wrapper"
                style={{
                  display: 'flex',
                  gap: '24px',
                  alignItems: 'center',
                  padding: '30px',
                  flexWrap: 'wrap',
                  flexDirection: idx % 2 === 1 ? 'row-reverse' : 'row',
                }}
              >
                <div style={{ flex: 1, minWidth: '300px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <div style={{ backgroundColor: 'var(--deep-maroon)', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px', flexShrink: 0 }}>{step.num}</div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--deep-maroon)', marginBottom: '8px' }}>{step.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: '1.6' }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
                <div style={imageBoxStyle}>
                  <Image src={step.img} alt={step.alt} fill sizes="(max-width: 768px) 100vw, 50vw" style={imageStyle} />
                </div>
              </div>
            ))}
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
