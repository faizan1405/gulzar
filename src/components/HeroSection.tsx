'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSimulator } from '../context/SimulatorContext';
import { DecorativeArch, FloralCorner } from './NikahComponents';

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
    <section className="container font-sans" style={{ padding: '20px 0 60px 0' }}>
      <DecorativeArch className="hero-split">
        <div className="hero-content">
          <div className="hero-subtitle" style={{ color: 'var(--gold-accent)', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            Halal & Safe Matrimonial Invitations
          </div>
          
          <h1 className="hero-title font-serif" style={{ fontSize: '48px', color: 'var(--deep-maroon)', lineHeight: '1.2', fontWeight: 'bold', margin: '16px 0 24px 0' }}>
            A Beautiful Beginning Starts With the Right Match
          </h1>
          
          <p className="hero-description" style={{ fontSize: '15.5px', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '32px' }}>
            Discover verified matrimonial profiles through a respectful, family-friendly platform designed to help you begin your Nikah journey with confidence.
          </p>
          
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <button onClick={handleFindMatch} className="btn btn-gold" style={{ padding: '12px 28px' }}>
              Find Your Match
            </button>
            <button
              onClick={handleCreateProfile}
              className="btn btn-primary"
              style={{ padding: '12px 28px' }}
            >
              Create Your Profile
            </button>
          </div>
          
          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', display: 'flex', gap: '16px', opacity: 0.9, flexWrap: 'wrap' }}>
            <span>✓ Manually Verified Profiles</span>
            <span>✓ Complete Privacy Controls</span>
            <span>✓ Family-Friendly Community</span>
          </div>
        </div>

        <div className="hero-visual-container" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="hero-visual-frame" style={{ width: '90%', borderRadius: 'var(--border-radius-xl)', overflow: 'hidden', border: '1.5px solid var(--gold-accent)', padding: '6px', backgroundColor: '#fff' }}>
            {/* Premium bridal visual representing couples */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=600&h=800"
              alt="Muslim Couple Marriage scene illustration"
              className="hero-visual-img"
              style={{ width: '100%', borderRadius: 'calc(var(--border-radius-xl) - 4px)', objectFit: 'cover' }}
            />
          </div>
          
          <div className="floating-preview-card floating-card-1">
            <span style={{ color: 'var(--gold-accent)' }}>✓</span>
            <div>
              <strong style={{ display: 'block', fontSize: '12.5px', color: 'var(--text-dark)' }}>Verified Biodata</strong>
              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>100% Manual Phone Checked</span>
            </div>
          </div>

          <div className="floating-preview-card floating-card-2">
            <span style={{ color: 'var(--gold-accent)' }}>⭐</span>
            <div>
              <strong style={{ display: 'block', fontSize: '12.5px', color: 'var(--text-dark)' }}>Protected Photos</strong>
              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Blurred for Unpaid Members</span>
            </div>
          </div>
        </div>
      </DecorativeArch>
    </section>
  );
};

export default HeroSection;
