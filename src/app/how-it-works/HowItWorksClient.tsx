'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Image from 'next/image';
import { SectionHeading, PremiumFooter } from '../../components/NikahComponents';
import { getFaqPreview } from '../../lib/faqData';

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
    img: '/images/hiw-1.png',
    alt: 'Create Profile',
  },
  {
    num: 2,
    title: 'Telephone Verification Check',
    desc: 'After saving your profile, it enters our admin verification queue. An administrator schedules a telephone call check to verify details, maintain high community integrity, and approve the profile.',
    img: '/images/hiw-2.png',
    alt: 'Verify Details',
  },
  {
    num: 3,
    title: 'Privacy Blur and Unlock Matches',
    desc: 'Photos and phone numbers remain securely blurred to visitors. Activate the standard monthly membership to unblur photos, explore candidates, and access call details.',
    img: '/images/hiw-3.png',
    alt: 'Find Suitable Match',
  },
  {
    num: 4,
    title: 'Start Halal Introductions',
    desc: 'Communicate respectfully. We suggest involving family members as early as possible. Schedule chaperone calls and begin your blessed Nikah preparations with complete trust.',
    img: '/images/hiw-4.png',
    alt: 'Family Discussion Nikah Journey',
  },
];

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

          <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {steps.map((step) => (
              <div
                key={step.num}
                className="hiw-card"
                style={{
                  position: 'relative',
                  borderRadius: 'var(--border-radius-lg)',
                  overflow: 'hidden',
                  boxShadow: '0 20px 60px -12px rgba(111, 29, 53, 0.25)',
                  border: '1px solid rgba(184, 146, 74, 0.35)',
                }}
              >
                {/* Full-cover background image */}
                <Image
                  src={step.img}
                  alt={step.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 900px"
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                  priority={step.num <= 2}
                />

                {/* Gradient overlay — dark at bottom for text legibility */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(to top, rgba(111,29,53,0.93) 0%, rgba(111,29,53,0.55) 42%, rgba(0,0,0,0.06) 100%)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Step number badge — top-left */}
                <div
                  style={{
                    position: 'absolute',
                    top: '24px',
                    left: '28px',
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    border: '2px solid var(--antique-gold)',
                    backgroundColor: 'rgba(184, 146, 74, 0.22)',
                    backdropFilter: 'blur(6px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#F5D78C',
                    fontWeight: '700',
                    fontSize: '17px',
                    zIndex: 2,
                  }}
                >
                  {step.num}
                </div>

                {/* Text overlay — bottom */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '28px 32px 32px',
                    zIndex: 2,
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '22px',
                      color: '#ffffff',
                      marginBottom: '8px',
                      fontWeight: '600',
                      letterSpacing: '0.01em',
                      textShadow: '0 2px 10px rgba(0,0,0,0.35)',
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.88)',
                      fontSize: '14.5px',
                      lineHeight: '1.65',
                      textShadow: '0 1px 4px rgba(0,0,0,0.45)',
                      maxWidth: '620px',
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="arch-container gold-rim" style={{ maxWidth: '760px', margin: '48px auto 0 auto', padding: '32px' }}>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--deep-maroon)', marginBottom: '8px', textAlign: 'center' }}>Frequently Asked Questions</h4>
            <p style={{ textAlign: 'center', fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              A few common questions. See the full list on our FAQ page.
            </p>
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13.5px' }}>
              {getFaqPreview().map((faq) => (
                <p key={faq.id}>
                  <strong>Q: {faq.question}</strong>
                  <br />
                  A: {faq.answer}
                </p>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '26px' }}>
              <Link href="/faq" className="btn btn-primary">View All FAQs</Link>
            </div>
          </div>
        </div>
      </main>
      <PremiumFooter onNavigate={handleNavigate} />
    </>
  );
}
