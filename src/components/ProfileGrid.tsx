'use client';

import React from 'react';
import { useSimulator } from '../context/SimulatorContext';
import { Profile } from '../types';
import { ProfileCard } from './NikahComponents';
import { getProfileImage, getThemeClass } from '../lib/helpers';

interface ProfileGridProps {
  filteredProfiles: Profile[];
}

export const ProfileGrid: React.FC<ProfileGridProps> = ({ filteredProfiles }) => {
  const {
    isLoggedIn,
    hasPaid300,
    simulatedPackages,
    simulatedHighProfileApproved,
    savedProfiles,
    toggleSaveProfile,
    setSelectedProfileForDetails,
    setShowLoginModal
  } = useSimulator();

  if (filteredProfiles.length === 0) {
    return (
      <div style={{
        maxWidth: '520px',
        margin: '60px auto',
        textAlign: 'center',
        padding: '52px 32px',
        background: 'var(--white)',
        borderRadius: '20px',
        border: '1px solid rgba(184,146,74,0.15)',
        boxShadow: '0 4px 24px rgba(111,29,53,0.06)',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌙</div>
        <h3 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '22px',
          color: 'var(--deep-maroon)',
          marginBottom: '10px',
          fontWeight: 700,
        }}>
          No Profiles Match Your Filters
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: 1.6, marginBottom: '28px' }}>
          Try widening your search — adjust the age range, location, or community filters to discover more compatible matches.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="/search"
            style={{
              padding: '11px 24px',
              background: 'linear-gradient(135deg,var(--deep-maroon),#8b2252)',
              color: '#fff',
              borderRadius: '10px',
              fontSize: '13.5px',
              fontWeight: 700,
              textDecoration: 'none',
              fontFamily: 'var(--font-sans)',
              boxShadow: '0 4px 14px rgba(111,29,53,0.22)',
            }}
          >
            Clear All Filters
          </a>
          <a
            href="/register"
            style={{
              padding: '11px 24px',
              background: 'transparent',
              color: 'var(--deep-maroon)',
              borderRadius: '10px',
              fontSize: '13.5px',
              fontWeight: 700,
              textDecoration: 'none',
              fontFamily: 'var(--font-sans)',
              border: '1.5px solid rgba(111,29,53,0.3)',
            }}
          >
            Register Free
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
      {filteredProfiles.map((profile, idx) => (
        <ProfileCard
          key={profile.id}
          profile={profile}
          index={idx}
          isLoggedIn={isLoggedIn}
          hasPaid300={hasPaid300}
          simulatedPackages={simulatedPackages}
          simulatedHighProfileApproved={simulatedHighProfileApproved}
          savedProfiles={savedProfiles}
          onToggleSave={toggleSaveProfile}
          onViewDetails={setSelectedProfileForDetails}
          onShowLogin={() => setShowLoginModal(true)}
          getProfileImage={getProfileImage}
          getThemeClass={getThemeClass}
        />
      ))}
    </div>
  );
};

export default ProfileGrid;
