'use client';

import React, { useState } from 'react';
import { useSimulator } from '../../../context/SimulatorContext';
import Navbar from '../../../components/Navbar';
import ProfileGrid from '../../../components/ProfileGrid';
import { SectionHeading, PremiumFooter, FloralCorner } from '../../../components/NikahComponents';
import PackageInquiryForm from '../../../components/PackageInquiryForm';

export default function HighProfilePage() {
  const { profiles, isLoggedIn, simulatedPackages, handleRazorpayCheckout } = useSimulator();
  const [searchQuery, setSearchQuery] = useState('');
  const [showInquiry, setShowInquiry] = useState(false);

  // High Profile filtering
  const highProfiles = profiles.filter((p) => {
    const isHighProfile =
      (p as any).category === 'high_profile' ||
      p.occupation.toLowerCase().includes('doctor') ||
      p.occupation.toLowerCase().includes('engineer') ||
      p.occupation.toLowerCase().includes('business') ||
      p.occupation.toLowerCase().includes('professional') ||
      p.annualIncomeRange.includes('₹10 LPA') ||
      p.annualIncomeRange.includes('₹15 LPA') ||
      p.annualIncomeRange.includes('Above');
      
    if (!isHighProfile) return false;

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
            title="High Profile Matches"
            subtitle="Browse premium candidates earning ₹10 Lakh+ annually (Doctors, Engineers, Business Owners & Premium Families)."
            scriptText="Exclusive Premium Directory"
          />

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 350px',
            gap: '30px',
            marginTop: '30px',
            alignItems: 'start'
          }} className="high-profile-container">
            <div>
              <div style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="Search High Profiles (e.g. city, occupation...)"
                  className="form-control"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ flexGrow: 1 }}
                />
              </div>

              <ProfileGrid filteredProfiles={highProfiles} />
            </div>

            <div className="card-theme-wrapper" style={{ padding: '24px', position: 'sticky', top: '100px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--deep-maroon)', fontSize: '20px', marginBottom: '16px' }}>
                High Profile Package
              </h3>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--deep-maroon)', marginBottom: '8px' }}>
                ₹21,000 <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>+ 18% GST</span>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Unlock access to our exclusive verified tier of ultra-affluent and highly-educated matches.
              </p>
              
              <ul style={{ paddingLeft: '20px', marginBottom: '24px', fontSize: '13.5px', color: 'var(--text-dark)' }}>
                <li style={{ marginBottom: '8px' }}>For candidates earning ₹10 LPA+</li>
                <li style={{ marginBottom: '8px' }}>Leads provided until marriage</li>
                <li style={{ marginBottom: '8px' }}>₹25,000 payable after marriage confirmation</li>
              </ul>

              <button
                className="btn btn-gold"
                style={{ width: '100%', padding: '12px', fontSize: '15px' }}
                onClick={() => handleRazorpayCheckout('high_profile_package', 21000, 'High Profile Package')}
                disabled={simulatedPackages.includes('high_profile_package')}
              >
                {simulatedPackages.includes('high_profile_package') ? 'Package Active ✅' : 'Buy High Profile Package'}
              </button>

              {!simulatedPackages.includes('high_profile_package') && (
                <>
                  <button
                    className="btn btn-secondary"
                    style={{ width: '100%', padding: '10px', fontSize: '13px', marginTop: '10px' }}
                    onClick={() => setShowInquiry(true)}
                  >
                    Inquire & Ask Call back
                  </button>
                  <a
                    href={`https://wa.me/919557006617?text=${encodeURIComponent("Assalamu Alaikum, I am interested in the ₹21,000 High Profile Package on Shadi Mubarak. Please guide me.")}`}
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
                      gap: '6px',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      fontWeight: 600
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M12.012 2c-5.506 0-9.97 4.478-9.97 10.012 0 1.77.458 3.43 1.258 4.887L2 22l5.253-1.378c1.402.766 3 1.2 4.759 1.2 5.506 0 9.97-4.478 9.97-10.012 0-5.534-4.464-10.012-9.97-10.012zm5.795 13.91c-.244.694-1.22 1.268-1.745 1.355-.472.079-.938.293-3.04-.542-2.527-.998-4.14-3.565-4.267-3.731-.127-.166-.991-1.32-.991-2.518 0-1.2.626-1.79.847-2.029.221-.24.479-.3.639-.3a.46.46 0 0 1 .332.155c.105.155.434 1.058.471 1.139.037.081.062.176.009.282-.053.106-.079.171-.157.262-.078.09-.166.2-.236.269-.079.078-.162.162-.07.32.092.158.411.678.88 1.096.604.538 1.111.704 1.267.782.157.078.249.066.342-.04.093-.106.402-.469.511-.627.109-.158.217-.132.366-.077.148.055.942.443 1.103.524.161.081.268.121.308.19.04.069.04.4-.204 1.094z" />
                    </svg>
                    Inquire on WhatsApp
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
              defaultPackage="₹21,000 High Profile Package"
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

