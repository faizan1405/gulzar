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
      <div className="empty-state card-theme-wrapper" style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center', padding: '48px 24px' }}>
        <div className="empty-state-icon" style={{ fontSize: '32px', color: 'var(--gold-accent)' }}>❀</div>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--deep-maroon)', marginTop: '12px' }}>No Matches Found</h3>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
          Try clearing filters or search keywords to explore more candidates.
        </p>
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
