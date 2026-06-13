'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSimulator } from '../context/SimulatorContext';
import { getProfileImage } from '../lib/helpers';
import { VerifiedBadge, FloralCorner } from './NikahComponents';

export const ProfileDetails: React.FC = () => {
  const {
    selectedProfileForDetails,
    setSelectedProfileForDetails,
    isLoggedIn,
    hasPaid300,
    simulatedPackages,
    simulatedHighProfileApproved,
    setShowLoginModal
  } = useSimulator();

  const router = useRouter();

  if (!selectedProfileForDetails) return null;

  const isSecMarriage = selectedProfileForDetails.maritalStatus !== 'Single';
  const isHighProf = 
    selectedProfileForDetails.occupation.toLowerCase().includes('doctor') ||
    selectedProfileForDetails.occupation.toLowerCase().includes('engineer') ||
    selectedProfileForDetails.occupation.toLowerCase().includes('business') ||
    selectedProfileForDetails.annualIncomeRange.includes('₹10 LPA') ||
    selectedProfileForDetails.annualIncomeRange.includes('₹15 LPA') ||
    selectedProfileForDetails.annualIncomeRange.includes('Above');

  const hasSecMarriageAccess = simulatedPackages.includes('SECOND_MARRIAGE');
  const hasHighProfAccess = simulatedPackages.includes('HIGH_PROFILE') && simulatedHighProfileApproved;

  let modalBlur = !isLoggedIn;
  let modalLockReason = '';
  let modalUnlockText = 'Unlock Standard (₹300)';

  if (!isLoggedIn) {
    modalBlur = true;
    modalLockReason = 'Log in using your secure account to view photos and contact';
    modalUnlockText = 'Log In';
  } else if (isSecMarriage && !hasSecMarriageAccess) {
    modalBlur = true;
    modalLockReason = 'Second-Marriage Candidate. Access requires Second-Marriage package.';
    modalUnlockText = 'Unlock Second-Marriage (₹11,000)';
  } else if (isHighProf && !hasHighProfAccess) {
    modalBlur = true;
    modalLockReason = 'High-Profile Match. Requires High-Profile package & Admin eligibility approval.';
    modalUnlockText = 'Unlock High-Profile (₹21,000)';
  } else if (!hasPaid300 && !simulatedPackages.includes('STANDARD')) {
    modalBlur = true;
    modalLockReason = 'Activate standard membership to view photos and contact';
    modalUnlockText = 'Unlock Standard (₹300)';
  }

  const handleUnlockClick = () => {
    setSelectedProfileForDetails(null);
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      router.push('/premium');
    }
  };

  return (
    <div className="modal-overlay font-sans" onClick={() => setSelectedProfileForDetails(null)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px', border: '2px solid var(--gold-accent)' }}>
        <div className="modal-header">
          <span className="modal-title" style={{ fontFamily: 'var(--font-serif)' }}>Nikkah Biodata details</span>
          <button className="modal-close-btn" onClick={() => setSelectedProfileForDetails(null)}>×</button>
        </div>
        <div className="modal-body" style={{ position: 'relative' }}>
          <FloralCorner position="tl" color="var(--gold-light)" />
          <FloralCorner position="tr" color="var(--gold-light)" />

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '24px', alignItems: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getProfileImage(selectedProfileForDetails.gender, 0)}
              alt={selectedProfileForDetails.fullName}
              style={{
                width: '120px',
                height: '120px',
                objectFit: 'cover',
                borderRadius: '12px',
                border: '1.5px solid var(--gold-accent)',
                filter: modalBlur ? 'blur(10px)' : 'none'
              }}
            />
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--deep-maroon)', fontSize: '24px', fontWeight: 'bold' }}>
                {modalBlur ? 'Protected Candidate Profile' : selectedProfileForDetails.fullName}
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 500 }}>
                {selectedProfileForDetails.gender} • {2026 - new Date(selectedProfileForDetails.dateOfBirth).getFullYear()} Yrs Old
              </p>
              <span style={{ display: 'inline-flex', marginTop: '10px' }}>
                {selectedProfileForDetails.verificationStatus === 'APPROVED' && <VerifiedBadge />}
              </span>
            </div>
          </div>

          <div className="modal-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ gridColumn: 'span 2', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <strong style={{ color: 'var(--deep-maroon)', display: 'block', marginBottom: '4px' }}>Personal Bio & Values</strong>
              <p style={{ color: 'var(--text-dark)', lineHeight: '1.6' }}>
                {modalBlur ? `Details Protected: ${modalLockReason}` : selectedProfileForDetails.bio}
              </p>
            </div>
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <strong style={{ color: 'var(--deep-maroon)', display: 'block', marginBottom: '4px' }}>Education & Career</strong>
              <p style={{ color: 'var(--text-dark)' }}>
                {modalBlur ? 'Hidden' : `${selectedProfileForDetails.education} • ${selectedProfileForDetails.occupation}`}
              </p>
            </div>
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <strong style={{ color: 'var(--deep-maroon)', display: 'block', marginBottom: '4px' }}>Annual Income</strong>
              <p style={{ color: 'var(--text-dark)' }}>
                {modalBlur ? 'Hidden' : selectedProfileForDetails.annualIncomeRange}
              </p>
            </div>
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <strong style={{ color: 'var(--deep-maroon)', display: 'block', marginBottom: '4px' }}>Maslak & Fiqh</strong>
              <p style={{ color: 'var(--text-dark)' }}>
                {modalBlur ? 'Hidden' : (
                  [
                    selectedProfileForDetails.maslak && `Maslak: ${selectedProfileForDetails.maslak}`,
                    selectedProfileForDetails.fiqh && `Fiqh: ${selectedProfileForDetails.fiqh}`
                  ].filter(Boolean).join(' • ') || 'Not specified'
                )}
              </p>
            </div>
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <strong style={{ color: 'var(--deep-maroon)', display: 'block', marginBottom: '4px' }}>Caste / Biradari</strong>
              <p style={{ color: 'var(--text-dark)' }}>
                {modalBlur ? 'Hidden' : (selectedProfileForDetails.biradari || 'Not specified')}
              </p>
            </div>
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <strong style={{ color: 'var(--deep-maroon)', display: 'block', marginBottom: '4px' }}>Current Location</strong>
              <p style={{ color: 'var(--text-dark)' }}>
                {modalBlur ? 'Hidden' : (
                  [
                    selectedProfileForDetails.locality,
                    selectedProfileForDetails.district || selectedProfileForDetails.city,
                    selectedProfileForDetails.state
                  ].filter(Boolean).join(', ') || 'Not specified'
                )}
              </p>
            </div>
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <strong style={{ color: 'var(--deep-maroon)', display: 'block', marginBottom: '4px' }}>Relocation & Preferences</strong>
              <p style={{ color: 'var(--text-dark)' }}>
                {modalBlur ? 'Hidden' : (
                  <>
                    Willing to relocate: {selectedProfileForDetails.willingToRelocate ? 'Yes' : 'No'}
                    {selectedProfileForDetails.preferredLocations && selectedProfileForDetails.preferredLocations.length > 0 && (
                      <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Prefers: {selectedProfileForDetails.preferredLocations.join(', ')}
                      </span>
                    )}
                  </>
                )}
              </p>
            </div>
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', gridColumn: 'span 2' }}>
              <strong style={{ color: 'var(--deep-maroon)', display: 'block', marginBottom: '4px' }}>Family Background</strong>
              <p style={{ color: 'var(--text-dark)', lineHeight: '1.6' }}>
                {modalBlur ? 'Hidden' : selectedProfileForDetails.familyInfo}
              </p>
            </div>
            {selectedProfileForDetails.partnerPref && (
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', gridColumn: 'span 2' }}>
                <strong style={{ color: 'var(--deep-maroon)', display: 'block', marginBottom: '4px' }}>Partner Preferences</strong>
                <p style={{ color: 'var(--text-dark)', lineHeight: '1.6' }}>
                  {modalBlur ? 'Hidden' : selectedProfileForDetails.partnerPref}
                </p>
              </div>
            )}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', gridColumn: 'span 2' }}>
              <strong style={{ color: 'var(--deep-maroon)', display: 'block', marginBottom: '4px' }}>Phone / Contact Information</strong>
              <p style={{ color: 'var(--text-dark)', fontWeight: 'bold', fontSize: '16px' }}>
                {modalBlur ? '+91-XXXXX-XXXXX' : selectedProfileForDetails.phoneNumber}
              </p>
            </div>
          </div>
        </div>
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--soft-cream)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          {modalBlur && (
            <button
              onClick={handleUnlockClick}
              className="btn btn-gold"
              style={{ padding: '8px 20px', fontSize: '13px' }}
            >
              {modalUnlockText.split('(')[0]}
            </button>
          )}
          <button className="btn btn-secondary" onClick={() => setSelectedProfileForDetails(null)} style={{ padding: '8px 20px', fontSize: '13px' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
