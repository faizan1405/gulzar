'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Image from 'next/image';
import { SectionHeading, FloralCorner, PremiumFooter } from '../../components/NikahComponents';

// Edit leadership names, roles, and bios here — single source for the About page leadership section.
const leadershipTeam = [
  {
    initials: 'AG',
    name: 'Abdulla Gulzar',
    role: 'Founder & CEO',
    bio: 'Abdulla Gulzar founded Rishte Forever with a clear vision: to restore dignity, sincerity, and family values to the matrimonial search. His leadership is guided by a deep commitment to Shariah-compliant practices and a belief that every match deserves the same care as a family introduction, shaping the platform into a trusted space for serious, marriage-minded individuals.',
  },
  {
    initials: 'GT',
    name: 'Ghayasma Tabassum',
    role: 'Managing Director',
    bio: 'Ghayasma Tabassum leads the day-to-day management and operations of Rishte Forever, ensuring every member enjoys a smooth, respectful, and trustworthy experience. Her focus on operational excellence and customer care has been instrumental in building lasting trust within the community and steering the platform toward sustainable, meaningful growth.',
  },
];

export default function AboutClient() {
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
            title="About Rishte Forever"
            subtitle="Dedicated to enabling serious, respectful, and Shariah-compliant matrimonial connections."
            scriptText="Our Values"
            as="h1"
          />

          <div style={{ maxWidth: '800px', margin: '0 auto 40px auto', borderRadius: 'var(--border-radius-xl)', overflow: 'hidden', height: '300px', position: 'relative', boxShadow: 'var(--shadow-premium)' }}>
            <Image
              src="/images/nikah-1.jpeg"
              alt="Islamic Marriage Mission"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
            />
          </div>

          <div className="arch-container max-w-4xl mx-auto p-12 gold-rim gold-glow" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px' }}>
            <FloralCorner position="tl" color="var(--gold-accent)" />
            <FloralCorner position="tr" color="var(--gold-accent)" />
            <FloralCorner position="bl" color="var(--gold-accent)" />
            <FloralCorner position="br" color="var(--gold-accent)" />

            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--deep-maroon)', marginBottom: '16px', textAlign: 'center' }}>
              Serious Connections. Family Values. Absolute Trust.
            </h3>
            
            <div style={{ color: 'var(--text-dark)', fontSize: '15px', lineHeight: '1.7', display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
              <p>
                Welcome to <strong>Rishte Forever</strong>. We created this matrimonial service to bridge the gap between superficial swipe dating apps and traditional arranged matchmaking. Our platform is built for candidates seeking life partners with dignity, family approval, and verified intentions.
              </p>
              <p>
                Unlike generic SaaS matrimonial sites, we treat your profile biodata like a physical wedding invitation card—designed with elegance, respect, and utmost discretion.
              </p>
              <p>
                Every single profile on Rishte Forever undergoes a manual <Link href="/how-it-works" style={{ textDecoration: 'underline', color: 'var(--deep-maroon)', fontWeight: 'bold' }}>telephone verification check</Link>. Photos and active phone numbers are fully masked until <Link href="/premium" style={{ textDecoration: 'underline', color: 'var(--deep-maroon)', fontWeight: 'bold' }}>premium access rules</Link> are met and candidates consent to share details.
              </p>
              <p>
                We pray that Allah blesses your matchmaking journey and grants you a compatible, righteous life partner.
              </p>
            </div>
          </div>

          <div style={{ maxWidth: '900px', margin: '80px auto 0 auto' }}>
            <SectionHeading
              title="Meet Our Leadership"
              subtitle="Guided by vision, trust, and an unwavering commitment to meaningful relationships."
              scriptText="Our Leadership"
              as="h2"
            />
            <div className="leadership-grid">
              {leadershipTeam.map((leader) => (
                <div className="leadership-card" key={leader.initials}>
                  <div className="leadership-badge">{leader.initials}</div>
                  <h4 className="leadership-name">{leader.name}</h4>
                  <p className="leadership-role">{leader.role}</p>
                  <div className="leadership-divider" />
                  <p className="leadership-bio">{leader.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <PremiumFooter onNavigate={handleNavigate} />
    </>
  );
}
