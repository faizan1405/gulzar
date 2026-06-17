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
    <section className="font-sans" style={{ position: 'relative', minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', overflow: 'hidden' }}>
      {/* Background Image */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
        <Image
          src="/images/nikah-1.jpeg"
          alt="Premium Islamic Matrimonial Nikah"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority
        />
        {/* Soft Cream/Gradient Overlay for readability */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to bottom, rgba(253, 248, 245, 0.85), rgba(253, 248, 245, 0.95))'
        }} />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '800px' }}>
        <div className="hero-subtitle" style={{ color: 'var(--gold-accent)', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: '20px', marginBottom: '16px', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
          Halal & Safe Matrimonial Invitations
        </div>
        
        <h1 className="hero-title font-serif" style={{ color: 'var(--deep-maroon)', lineHeight: '1.2', fontWeight: 'bold', margin: '0 0 24px 0' }}>
          A Beautiful Beginning Starts With the Right Match
        </h1>
        
        <p className="hero-description" style={{ color: 'var(--text-dark)', opacity: 0.85, lineHeight: '1.7', marginBottom: '40px', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
          Discover verified matrimonial profiles through a respectful, family-friendly platform designed to help you begin your Nikah journey with confidence.
        </p>
        
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
          <button onClick={handleFindMatch} className="btn btn-gold" style={{ padding: '14px 32px', fontSize: '16px' }}>
            Find Your Match
          </button>
          <button
            onClick={handleCreateProfile}
            className="btn btn-primary"
            style={{ padding: '14px 32px', fontSize: '16px' }}
          >
            Create Your Profile
          </button>
        </div>
        
        <div style={{ fontSize: '14px', color: 'var(--text-dark)', display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', fontWeight: 500 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ color: 'var(--gold-accent)' }}>✓</span> Manually Verified Profiles</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ color: 'var(--gold-accent)' }}>✓</span> Complete Privacy Controls</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ color: 'var(--gold-accent)' }}>✓</span> Family-Friendly Community</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
