'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../../context/AppContext';
import Navbar from '../../../components/Navbar';
import ProfileGrid from '../../../components/ProfileGrid';
import { SectionHeading, PremiumFooter, PremiumPlanCard, FloralCorner } from '../../../components/NikahComponents';
import PackageInquiryForm from '../../../components/PackageInquiryForm';

export default function GoodProfilesClient() {
  const { profiles, isLoggedIn, activePackages, handleRazorpayCheckout, userProfile, setIsRegistering, setRegStep, setShowLoginModal } = useApp();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showInquiry, setShowInquiry] = useState(false);

  const isFormComplete = isLoggedIn && userProfile?.profileCompletionStatus === 'COMPLETE';
  const isPackageActive = activePackages.includes('good_profile_package');

  const handleCompleteForm = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      router.push('/');
      return;
    }
    setIsRegistering(true);
    setRegStep(1);
    router.push('/');
  };

  // Good profiles filtering
  const goodProfiles = profiles.filter((p) => {
    const isGoodProfile = (p as any).category === 'good_profile';
    if (!isGoodProfile) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.fullName.toLowerCase().includes(q) ||
        p.occupation.toLowerCase().includes(q) ||
        p.education.toLowerCase().includes(q) ||
        (p.city && p.city.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <div className="container font-sans" style={{ padding: '40px 0 80px 0' }}>
          <SectionHeading
            title="Good Profile Matches"
            subtitle="Browse handsome and beautiful profile matches. Unlock access with the Good Profile Package."
            scriptText="Handsome & Beautiful Profiles"
            as="h1"
          />

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 350px',
            gap: '30px',
            marginTop: '30px',
            alignItems: 'start'
          }} className="good-profiles-container">
            <div>
              <div style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="Search Good Profiles (e.g. city, occupation...)"
                  className="form-control"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ flexGrow: 1 }}
                />
              </div>

              <ProfileGrid filteredProfiles={goodProfiles} />
            </div>

            <div className="card-theme-wrapper" style={{ padding: '24px', position: 'sticky', top: '100px', border: '1.5px solid var(--border-color)', boxShadow: 'var(--shadow-premium)' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--deep-maroon)', fontSize: '22px', marginBottom: '16px', fontWeight: 800 }}>
                Good Profile Package
              </h3>
              {isFormComplete ? (
                <div style={{ fontSize: '36px', fontWeight: '800', color: 'var(--deep-maroon)', marginBottom: '8px', fontFamily: 'var(--font-serif)' }}>
                  ₹1
                </div>
              ) : (
                <div style={{ background: 'linear-gradient(135deg,rgba(111,29,53,0.06),rgba(184,146,74,0.06))', border: '1.5px dashed var(--gold-accent)', borderRadius: '10px', padding: '14px', marginBottom: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Pricing available after</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--deep-maroon)' }}>Complete your profile to view pricing</div>
                </div>
              )}
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Unlock access to verified premium candidates characterized by handsome & beautiful appearances.
              </p>

              <ul style={{ paddingLeft: '20px', marginBottom: '24px', fontSize: '13.5px', color: 'var(--text-dark)' }}>
                <li style={{ marginBottom: '8px' }}>Verified profile suggestions</li>
                <li style={{ marginBottom: '8px' }}>Basic matchmaking support</li>
                <li style={{ marginBottom: '8px' }}>Privacy-safe profile sharing</li>
                <li style={{ marginBottom: '8px' }}>1 year service validity</li>
              </ul>

              {isFormComplete ? (
                <button
                  className="btn btn-gold"
                  style={{ width: '100%', padding: '12px', fontSize: '15px' }}
                  onClick={() => handleRazorpayCheckout('good_profile_package', 1, 'Good Profile Package')}
                  disabled={isPackageActive}
                >
                  {isPackageActive ? 'Package Active ✅' : 'Buy Good Profile Package'}
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px', fontSize: '15px' }}
                  onClick={handleCompleteForm}
                >
                  Complete Form to View Price
                </button>
              )}

              {isFormComplete && !isPackageActive && (
                <>
                  <button
                    className="btn btn-secondary"
                    style={{ width: '100%', padding: '10px', fontSize: '13px', marginTop: '10px' }}
                    onClick={() => setShowInquiry(true)}
                  >
                    Inquire & Ask Call back
                  </button>
                  <a
                    href={`https://wa.me/919675483125?text=${encodeURIComponent("Assalamu Alaikum, I am interested in the ₹1 Good Profiles Package on Rishte Forever. Please guide me.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                    style={{
                      width: '100%',
                      padding: '10px',
                      fontSize: '13px',
                      marginTop: '10px',
                      backgroundColor: '#25D366',
                      color: '#ffffff',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      fontWeight: 600
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.114-2.905-6.99C16.246 1.875 13.772 1.84 11.137 1.84c-5.437 0-9.861 4.417-9.865 9.861-.001 1.77.462 3.5 1.34 5.01L1.6 22.2l5.047-1.323zM16.657 13.62c-.252-.127-1.487-.734-1.716-.818-.23-.084-.397-.127-.564.127-.167.253-.648.818-.794.985-.147.168-.294.187-.546.06-2.628-1.31-4.226-2.524-5.155-4.12-.24-.412-.04-.633.16-.833.18-.18.397-.463.595-.694.198-.23.264-.396.396-.66.13-.264.066-.495-.033-.693-.1-.2-.864-2.08-1.186-2.85-.313-.755-.632-.653-.864-.664-.225-.01-.482-.01-.738-.01-.257 0-.676.096-1.03.494-.353.396-1.35 1.32-1.35 3.218 0 1.897 1.382 3.729 1.574 3.993.193.264 2.72 4.153 6.586 5.82 2.68 1.155 3.738 1.258 5.06.1.758-.664 1.488-1.583 1.716-2.296.228-.713.228-1.324.16-1.448-.07-.124-.265-.187-.517-.314z"/>
                    </svg>
                    Chat on WhatsApp
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Inquiry Modal */}
      {showInquiry && (
        <div className="modal-overlay font-sans" onClick={() => setShowInquiry(false)}>
          <div className="card-theme-wrapper" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', width: '90%', margin: '20px', border: '2px solid var(--gold-accent)', padding: '32px', position: 'relative' }}>
            <FloralCorner position="tl" color="var(--gold-accent)" />
            <FloralCorner position="tr" color="var(--gold-accent)" />
            <button
              onClick={() => setShowInquiry(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                fontSize: '24px',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--deep-maroon)', marginBottom: '16px', textAlign: 'center' }}>
              Package Inquiry & Callback
            </h3>
            <PackageInquiryForm
              defaultPackage="₹1 Good Profiles Package"
              onSuccess={() => setShowInquiry(false)}
              onCancel={() => setShowInquiry(false)}
            />
          </div>
        </div>
      )}

      <PremiumFooter onNavigate={(view) => window.location.href = `/${view === 'home' ? '' : view}`} />
    </>
  );
}
