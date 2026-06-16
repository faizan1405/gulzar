'use client';

import React, { useState } from 'react';
import { useSimulator } from '../../../context/SimulatorContext';
import Navbar from '../../../components/Navbar';
import ProfileGrid from '../../../components/ProfileGrid';
import { SectionHeading, PremiumFooter, PremiumPlanCard, FloralCorner } from '../../../components/NikahComponents';
import PackageInquiryForm from '../../../components/PackageInquiryForm';

export default function GoodProfilesPage() {
  const { profiles, isLoggedIn, simulatedPackages, handleRazorpayCheckout } = useSimulator();
  const [searchQuery, setSearchQuery] = useState('');
  const [showInquiry, setShowInquiry] = useState(false);

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

            <div className="card-theme-wrapper" style={{ padding: '24px', position: 'sticky', top: '100px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--deep-maroon)', fontSize: '20px', marginBottom: '16px' }}>
                Good Profile Package
              </h3>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--deep-maroon)', marginBottom: '8px' }}>
                ₹5,500 <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>+ 18% GST</span>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Unlock access to verified premium candidates characterized by handsome & beautiful appearances.
              </p>
              
              <ul style={{ paddingLeft: '20px', marginBottom: '24px', fontSize: '13.5px', color: 'var(--text-dark)' }}>
                <li style={{ marginBottom: '8px' }}>Leads provided until marriage</li>
                <li style={{ marginBottom: '8px' }}>₹21,000 payable after marriage confirmation</li>
                <li style={{ marginBottom: '8px' }}>Requires active ₹300 Monthly Membership</li>
              </ul>

              <button
                className="btn btn-gold"
                style={{ width: '100%', padding: '12px', fontSize: '15px' }}
                onClick={() => handleRazorpayCheckout('good_profile_package', 5500, 'Good Profile Package')}
                disabled={simulatedPackages.includes('good_profile_package')}
              >
                {simulatedPackages.includes('good_profile_package') ? 'Package Active ✅' : 'Buy Good Profile Package'}
              </button>

              {!simulatedPackages.includes('good_profile_package') && (
                <button
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: '10px', fontSize: '13px', marginTop: '10px' }}
                  onClick={() => setShowInquiry(true)}
                >
                  Inquire & Ask Call back
                </button>
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
              defaultPackage="₹5,500 Good Profiles Package"
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

