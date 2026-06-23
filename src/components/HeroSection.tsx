'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSimulator } from '../context/SimulatorContext';

export const HeroSection: React.FC = () => {
  const router = useRouter();
  const {
    isLoggedIn,
    setIsRegistering,
    setRegStep,
    setShowLoginModal
  } = useSimulator();

  const handleFindMatch = () => {
    router.push('/search');
  };

  const handleCreateProfile = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      setIsRegistering(true);
      setRegStep(1);
    }
  };

  return (
    <section className="font-sans" style={{ position: 'relative', minHeight: '650px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', overflow: 'hidden' }}>
      {/* Background Image with vignette overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
        <Image
          src="/images/hero-couple.png"
          alt="Happy Muslim couple after Nikah"
          fill
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center 25%' }}
          priority
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle, rgba(253,253,248,0.2) 0%, rgba(253,253,248,0.7) 100%)',
          pointerEvents: 'none'
        }} />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center' }}>
        <div style={{
          maxWidth: '820px',
          width: '100%',
          padding: '48px 36px',
          textAlign: 'center',
          background: 'rgba(255, 253, 248, 0.93)',
          backdropFilter: 'blur(12px)',
          border: '2px solid var(--gold-accent)',
          borderRadius: 'var(--border-radius-xl)',
          boxShadow: 'var(--shadow-hover)',
          position: 'relative'
        }}>
          {/* Floral Corners */}
          <div style={{ position: 'absolute', top: '12px', left: '12px', width: '20px', height: '20px', borderTop: '2px solid var(--gold-accent)', borderLeft: '2px solid var(--gold-accent)' }} />
          <div style={{ position: 'absolute', top: '12px', right: '12px', width: '20px', height: '20px', borderTop: '2px solid var(--gold-accent)', borderRight: '2px solid var(--gold-accent)' }} />
          <div style={{ position: 'absolute', bottom: '12px', left: '12px', width: '20px', height: '20px', borderBottom: '2px solid var(--gold-accent)', borderLeft: '2px solid var(--gold-accent)' }} />
          <div style={{ position: 'absolute', bottom: '12px', right: '12px', width: '20px', height: '20px', borderBottom: '2px solid var(--gold-accent)', borderRight: '2px solid var(--gold-accent)' }} />

          <div className="hero-subtitle" style={{ color: 'var(--gold-dark)', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 700, fontSize: '20px', marginBottom: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%' }}>
            Halal & Safe Matrimonial Invitations
          </div>
          
          <h1 className="hero-title font-serif" style={{ color: 'var(--deep-maroon)', lineHeight: '1.25', fontWeight: '800', fontSize: '46px', margin: '0 0 20px 0', letterSpacing: '-0.5px' }}>
            A Beautiful Beginning Starts With the Right Match
          </h1>
          
          <p className="hero-description" style={{ color: 'var(--text-dark)', fontWeight: 500, fontSize: '16px', lineHeight: '1.8', marginBottom: '36px', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
            Discover verified matrimonial profiles through a respectful, family-friendly platform designed to help you begin your Nikah journey with confidence.
          </p>
          
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '30px' }}>
            <button onClick={handleFindMatch} className="btn btn-gold" style={{ padding: '14px 32px', fontSize: '14px', minWidth: '180px' }}>
              Find Your Match
            </button>
            <button
              onClick={handleCreateProfile}
              className="btn btn-primary"
              style={{ padding: '14px 32px', fontSize: '14px', minWidth: '180px' }}
            >
              Create Your Profile
            </button>
          </div>
          
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', fontWeight: 600, borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><span style={{ color: 'var(--gold-accent)' }}>✓</span> Manually Verified Profiles</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><span style={{ color: 'var(--gold-accent)' }}>✓</span> Complete Privacy Controls</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><span style={{ color: 'var(--gold-accent)' }}>✓</span> Family-Friendly Community</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
