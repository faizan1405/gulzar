'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useApp } from '../context/AppContext';
import { getProfileImage } from '../lib/helpers';
import { VerifiedBadge, FloralCorner } from './NikahComponents';
import ProfileInterestForm from './ProfileInterestForm';


export const ProfileDetails: React.FC = () => {
  const {
    selectedProfileForDetails,
    setSelectedProfileForDetails,
    isLoggedIn,
    hasPaid300,
    activePackages,
    highProfileApproved,
    setShowLoginModal,
    userProfile,
    handleViewProfile,
  } = useApp();

  const router = useRouter();
  const [showInterestForm, setShowInterestForm] = useState(false);

  // Reset form when modal closes
  React.useEffect(() => {
    if (!selectedProfileForDetails) {
      setShowInterestForm(false);
    }
  }, [selectedProfileForDetails]);

  if (!selectedProfileForDetails) return null;


  const profileCat = (selectedProfileForDetails as any).category || '';
  
  const isSecMarriage = selectedProfileForDetails.maritalStatus !== 'Single' || profileCat === 'second_marriage';
  const isHighProf = 
    profileCat === 'high_profile' ||
    selectedProfileForDetails.occupation.toLowerCase().includes('doctor') ||
    selectedProfileForDetails.occupation.toLowerCase().includes('engineer') ||
    selectedProfileForDetails.occupation.toLowerCase().includes('business') ||
    selectedProfileForDetails.annualIncomeRange.includes('₹10 LPA') ||
    selectedProfileForDetails.annualIncomeRange.includes('₹15 LPA') ||
    selectedProfileForDetails.annualIncomeRange.includes('Above');
  
  const isGoodProfile = profileCat === 'good_profile';

  const hasPaidMonthly = hasPaid300 || activePackages.includes('monthly_membership');
  const hasSecMarriageAccess = activePackages.includes('second_marriage_package');
  const hasHighProfAccess = activePackages.includes('high_profile_package') && highProfileApproved;
  const hasGoodProfileAccess = activePackages.includes('good_profile_package');
  const isFormComplete = isLoggedIn && userProfile?.profileCompletionStatus === 'COMPLETE';

  let modalBlur = !isLoggedIn;
  let modalLockReason = '';
  let modalUnlockText = 'Choose Package';

  if (!isLoggedIn) {
    modalBlur = true;
    modalLockReason = 'Please login or register to view this profile.';
    modalUnlockText = 'Log In to View Profile';
  } else if (!isFormComplete) {
    modalBlur = true;
    modalLockReason = 'Complete your details first to continue.';
    modalUnlockText = 'Complete Form & Unlock Profile';
  } else if (!hasPaidMonthly) {
    modalBlur = true;
    modalLockReason = 'Choose a package to unlock full profile details.';
    modalUnlockText = 'Choose Package';
  } else if (isGoodProfile && !hasGoodProfileAccess) {
    modalBlur = true;
    modalLockReason = 'Buy Good Profile Package for ₹5,500 to view these profiles.';
    modalUnlockText = 'Buy Good Profile Package (₹5,500)';
  } else if (isSecMarriage && !hasSecMarriageAccess) {
    modalBlur = true;
    modalLockReason = 'Second-Marriage Candidate. Access requires Silver Plan.';
    modalUnlockText = 'Unlock Silver Plan (₹11,000)';
  } else if (isHighProf && !hasHighProfAccess) {
    modalBlur = true;
    modalLockReason = 'High-Profile Match. Requires Gold Package & Admin eligibility approval.';
    modalUnlockText = 'Unlock Gold Package (₹21,000)';
  }

  const handleUnlockClick = () => {
    if (selectedProfileForDetails) {
      setSelectedProfileForDetails(null);
      handleViewProfile(selectedProfileForDetails);
    } else if (!isLoggedIn) {
      setSelectedProfileForDetails(null);
      setShowLoginModal(true);
    } else {
      setSelectedProfileForDetails(null);
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
        <div className="modal-body" style={{ position: 'relative', minHeight: '300px' }}>
          <FloralCorner position="tl" color="var(--gold-light)" />
          <FloralCorner position="tr" color="var(--gold-light)" />

          {showInterestForm ? (
            <div style={{ padding: '10px 0' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--deep-maroon)', fontSize: '20px', marginBottom: '16px', textAlign: 'center' }}>
                Express Interest in Match
              </h3>
              <ProfileInterestForm
                profileId={selectedProfileForDetails.id}
                profileName={modalBlur ? 'Protected Candidate Profile' : selectedProfileForDetails.fullName}
                profileCategory={profileCat}
                onSuccess={() => {
                  setShowInterestForm(false);
                  setSelectedProfileForDetails(null);
                }}
                onCancel={() => setShowInterestForm(false)}
              />
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '24px', alignItems: 'center' }}>
                <Image
                  src={getProfileImage(selectedProfileForDetails.gender, 0)}
                  alt={selectedProfileForDetails.fullName}
                  width={120}
                  height={120}
                  style={{
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
            </>
          )}
        </div>
        {!showInterestForm && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--soft-cream)', display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
            <a
              href={`https://wa.me/919675483125?text=${encodeURIComponent(
                modalBlur
                  ? 'Assalamu Alaikum, I am interested in this Rishte Forever profile. Please guide me.'
                  : `Assalamu Alaikum, I am interested in this Rishte Forever profile (Name: ${selectedProfileForDetails.fullName}, ID: ${selectedProfileForDetails.id}). Please guide me.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{
                backgroundColor: '#25D366',
                color: '#ffffff',
                border: 'none',
                fontSize: '13px',
                fontWeight: 'bold',
                padding: '8px 20px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                textDecoration: 'none',
                borderRadius: '8px',
                transition: 'var(--transition-smooth)'
              }}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M12.012 2c-5.506 0-9.97 4.478-9.97 10.012 0 1.77.458 3.43 1.258 4.887L2 22l5.253-1.378c1.402.766 3 1.2 4.759 1.2 5.506 0 9.97-4.478 9.97-10.012 0-5.534-4.464-10.012-9.97-10.012zm5.795 13.91c-.244.694-1.22 1.268-1.745 1.355-.472.079-.938.293-3.04-.542-2.527-.998-4.14-3.565-4.267-3.731-.127-.166-.991-1.32-.991-2.518 0-1.2.626-1.79.847-2.029.221-.24.479-.3.639-.3a.46.46 0 0 1 .332.155c.105.155.434 1.058.471 1.139.037.081.062.176.009.282-.053.106-.079.171-.157.262-.078.09-.166.2-.236.269-.079.078-.162.162-.07.32.092.158.411.678.88 1.096.604.538 1.111.704 1.267.782.157.078.249.066.342-.04.093-.106.402-.469.511-.627.109-.158.217-.132.366-.077.148.055.942.443 1.103.524.161.081.268.121.308.19.04.069.04.4-.204 1.094z" />
              </svg>
              Ask About This Profile
            </a>
            <button
              onClick={() => setShowInterestForm(true)}
              className="btn btn-gold"
              style={{ padding: '8px 20px', fontSize: '13px' }}
            >
              Express Interest
            </button>
            {modalBlur && (
              <button
                onClick={handleUnlockClick}
                className="btn btn-gold"
                style={{ padding: '8px 20px', fontSize: '13px' }}
              >
                {modalUnlockText.split('(')[0]}
              </button>
            )}
            <button
              onClick={() => {
                const shareUrl = `${window.location.origin}/search?profile=${selectedProfileForDetails.id}`;
                const shareText = "Check this profile on Rishte Forever.";
                if (navigator.share) {
                  navigator.share({
                    title: 'Rishte Forever Matrimonial Profile',
                    text: shareText,
                    url: shareUrl
                  }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
                  alert('Profile share link copied to clipboard!');
                }
              }}
              className="btn btn-secondary"
              style={{ padding: '8px 20px', fontSize: '13px', border: '1px solid var(--gold-accent)' }}
              title="Copy Profile Link"
            >
              Share Profile 🔗
            </button>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check this profile on Rishte Forever: ${window.location.origin}/search?profile=${selectedProfileForDetails.id}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{
                backgroundColor: '#25D366',
                color: '#ffffff',
                border: 'none',
                fontSize: '13px',
                fontWeight: 'bold',
                padding: '8px 20px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                textDecoration: 'none',
                borderRadius: '8px',
                transition: 'var(--transition-smooth)'
              }}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M12.012 2c-5.506 0-9.97 4.478-9.97 10.012 0 1.77.458 3.43 1.258 4.887L2 22l5.253-1.378c1.402.766 3 1.2 4.759 1.2 5.506 0 9.97-4.478 9.97-10.012 0-5.534-4.464-10.012-9.97-10.012zm5.795 13.91c-.244.694-1.22 1.268-1.745 1.355-.472.079-.938.293-3.04-.542-2.527-.998-4.14-3.565-4.267-3.731-.127-.166-.991-1.32-.991-2.518 0-1.2.626-1.79.847-2.029.221-.24.479-.3.639-.3a.46.46 0 0 1 .332.155c.105.155.434 1.058.471 1.139.037.081.062.176.009.282-.053.106-.079.171-.157.262-.078.09-.166.2-.236.269-.079.078-.162.162-.07.32.092.158.411.678.88 1.096.604.538 1.111.704 1.267.782.157.078.249.066.342-.04.093-.106.402-.469.511-.627.109-.158.217-.132.366-.077.148.055.942.443 1.103.524.161.081.268.121.308.19.04.069.04.4-.204 1.094z" />
              </svg>
              Share on WhatsApp
            </a>
            <button className="btn btn-secondary" onClick={() => setSelectedProfileForDetails(null)} style={{ padding: '8px 20px', fontSize: '13px' }}>
              Close
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProfileDetails;
