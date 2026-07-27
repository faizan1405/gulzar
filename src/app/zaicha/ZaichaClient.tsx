'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Image from 'next/image';
import { SectionHeading, PremiumFooter } from '../../components/NikahComponents';

export default function ZaichaClient() {
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
            title="Zaicha Compatibility Guidance"
            subtitle="Supportive traditional family guidance for marriage compatibility and understanding."
            scriptText="Islamic & Family Harmony"
            as="h1"
          />

          {/* Banner Image */}
          <div style={{ maxWidth: '1000px', margin: '0 auto 40px auto', borderRadius: 'var(--border-radius-xl)', overflow: 'hidden', height: '300px', position: 'relative', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-premium)' }}>
            <Image
              src="/images/commitment.png"
              alt="Zaicha Matrimonial Guidance"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
            />
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'linear-gradient(to right, rgba(111, 29, 53, 0.75), rgba(111, 29, 53, 0.25))',
              display: 'flex',
              alignItems: 'center',
              padding: '0 40px'
            }}>
              <div style={{ color: 'white', maxWidth: '600px' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', marginBottom: '12px' }}>Traditional Guidance & Support</h3>
                <p style={{ fontSize: '15px', lineHeight: '1.6', opacity: 0.9 }}>
                  We support families who value traditional Zaicha compatibility checking as a helpful step in seeking a blessed, stable matrimonial match.
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', maxWidth: '1000px', margin: '0 auto 40px auto' }}>
            {/* What is Zaicha */}
            <div className="card-theme-wrapper" style={{ padding: '30px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--deep-maroon)', marginBottom: '12px' }}>📖 What is Zaicha?</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Zaicha is a traditional astrological or compatibility chart calculation used by families in the Subcontinent to analyze character temperament, matching aspects, timing, and potential family concerns before moving forward with a matrimonial proposal.
              </p>
            </div>

            {/* Islamic POV */}
            <div className="card-theme-wrapper" style={{ padding: '30px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--deep-maroon)', marginBottom: '12px' }}>🕌 Zaicha from an Islamic POV</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                In Islam, compatibility checking is highly encouraged to protect the marriage union. While Zaicha acts as a traditional analysis of character compatibility, it is treated strictly as supportive guidance. Final trust and tawakkul are always placed in Allah (SWT).
              </p>
            </div>

            {/* How it helps families */}
            <div className="card-theme-wrapper" style={{ padding: '30px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--deep-maroon)', marginBottom: '12px' }}>🤝 How it Helps Families</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                It helps parents evaluate compatibility factors objectively, opening conversations about mutual expectations, family values, and future plans. It serves as a secondary check to align thoughts before formal engagement.
              </p>
            </div>
          </div>

          {/* Central Service Messaging Block */}
          <div className="card-theme-wrapper" style={{ maxWidth: '800px', margin: '0 auto 40px auto', padding: '40px', border: '2.5px solid var(--gold-accent)', boxShadow: 'var(--gold-glow-shadow)' }}>
                                    
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--deep-maroon)', marginBottom: '20px', textAlign: 'center', fontWeight: 800 }}>
              We Also Help With Zaicha
            </h3>
            
            <p style={{ fontSize: '15.5px', color: 'var(--text-dark)', lineHeight: '1.8', textAlign: 'center', marginBottom: '20px', fontWeight: '600' }}>
              “We also assist families with Zaicha guidance for marriage compatibility. Zaicha is used by many families as a traditional way to understand compatibility, timing, and family concerns before proceeding with a proposal.”
            </p>

            <div style={{ height: '1.5px', background: 'linear-gradient(90deg, transparent, var(--gold-accent) 50%, transparent)', margin: '24px 0' }} />

            <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.75', textAlign: 'center', fontStyle: 'italic', fontWeight: 500 }}>
              “At Rishte Forever, we present Zaicha as supportive guidance only. Final marriage decisions should always be based on deen, character, family understanding, mutual consent, and proper communication. We do not treat Zaicha as a guarantee or final decision-maker, but as an additional support for families who value this process.”
            </p>
          </div>

          {/* CTA Area */}
          <div className="card-theme-wrapper" style={{ maxWidth: '600px', margin: '0 auto', padding: '36px', textAlign: 'center', backgroundColor: 'var(--soft-cream)' }}>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--deep-maroon)', marginBottom: '12px' }}>
              Interested in Zaicha compatibility guidance?
            </h4>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.5' }}>
              Our expert matchmaking desk is available to assist your family in evaluating traditional charts.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/contact" className="btn btn-gold" style={{ minWidth: '180px' }}>
                Contact Us for Zaicha
              </Link>
              <a
                href={`https://wa.me/919675483125?text=${encodeURIComponent("Assalamu Alaikum, I would like to inquire about Zaicha compatibility guidance for matchmaking on Rishte Forever.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{
                  minWidth: '180px',
                  backgroundColor: '#25D366',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                Inquire on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </main>
      <PremiumFooter onNavigate={handleNavigate} />
    </>
  );
}
