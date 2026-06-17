'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Image from 'next/image';
import { SectionHeading, FloralCorner, PremiumFooter } from '../../components/NikahComponents';

export default function SafetyClient() {
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
            title="Matrimonial Safety & Privacy"
            subtitle="We deploy rigorous controls, manual screening, and masking to keep you secure."
            scriptText="Trust Center"
            as="h1"
          />

          <div style={{ maxWidth: '1000px', margin: '0 auto 40px auto', borderRadius: 'var(--border-radius-xl)', overflow: 'hidden', height: '240px', position: 'relative', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-premium)' }}>
            <Image
              src="/images/nikah-2.jpeg"
              alt="Safe Matrimonial Platform"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center 60%' }}
            />
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'linear-gradient(to right, rgba(253, 248, 245, 0.8), rgba(253, 248, 245, 0.4))'
            }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', maxWidth: '1000px', margin: '0 auto' }}>
            <div className="card-theme-wrapper" style={{ padding: '30px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--deep-maroon)', marginBottom: '12px' }}>🛡️ Photo Protection</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Your pictures are never indexed on search engines or visible to standard unauthenticated internet searches. Only logged-in, phone-verified, and standard paid members can access unblurred photos. Read more in our <Link href="/how-it-works" style={{ textDecoration: 'underline', color: 'var(--deep-maroon)', fontWeight: 'bold' }}>process guide</Link>.
              </p>
            </div>

            <div className="card-theme-wrapper" style={{ padding: '30px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--deep-maroon)', marginBottom: '12px' }}>📞 Phone Number Masking</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Your active phone number is redacted to protect you from unsolicited calls. Contact details are shown only to premium members who match your filters and submit a view request.
              </p>
            </div>

            <div className="card-theme-wrapper" style={{ padding: '30px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--deep-maroon)', marginBottom: '12px' }}>👤 Zero Daters Allowed</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                This is not a dating app. Profiles found attempting casual communications or violating Islamic code standards are immediately reported, suspended, and logged in our admin audit log database.
              </p>
            </div>
          </div>

          <div className="card-theme-wrapper" style={{ maxWidth: '800px', margin: '48px auto 0 auto', padding: '40px' }}>
            <FloralCorner position="tl" color="var(--gold-accent)" />
            <FloralCorner position="tr" color="var(--gold-accent)" />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--deep-maroon)', marginBottom: '16px', textAlign: 'center' }}>Safe Matrimonial Advice</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: 'var(--text-dark)' }}>
              <li>Never share credit card information, bank credentials, or send money to matches.</li>
              <li>Involve family members in your matrimonial discussions as early as possible.</li>
              <li>Conduct your initial meetings in public places under safe parameters.</li>
              <li>Report any suspicious behavior immediately via our <Link href="/contact" style={{ textDecoration: 'underline', color: 'var(--deep-maroon)', fontWeight: 'bold' }}>contact panel</Link>.</li>
            </ul>
          </div>
        </div>
      </main>
      <PremiumFooter onNavigate={handleNavigate} />
    </>
  );
}
