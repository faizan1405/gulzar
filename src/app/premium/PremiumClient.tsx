'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSimulator } from '../../context/SimulatorContext';
import Navbar from '../../components/Navbar';
import Image from 'next/image';
import { SectionHeading, PremiumPlanCard, PremiumFooter, FloralCorner } from '../../components/NikahComponents';
import PackageInquiryForm from '../../components/PackageInquiryForm';

export default function PremiumClient() {
  const router = useRouter();
  const {
    hasPaid300,
    simulatedPackages,
    handleRazorpayCheckout
  } = useSimulator();

  const [inquiryPackage, setInquiryPackage] = useState<string | null>(null);

  const handleNavigate = (view: string) => {
    router.push('/' + (view === 'home' ? '' : view));
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <div className="container font-sans" style={{ padding: '40px 0 80px 0' }}>
          <SectionHeading
            title="Premium Matrimonial Packages"
            subtitle="Choose a package that fits your matchmaking needs. Keep your monthly membership active to access our search directory."
            scriptText="Premium Services"
            as="h1"
          />

          <div style={{ marginBottom: '40px', borderRadius: 'var(--border-radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-premium)', position: 'relative', height: '300px' }}>
            <Image
              src="/images/nikah-3.jpeg"
              alt="Premium Matrimonial Journey"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
            />
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'linear-gradient(to right, rgba(111, 29, 53, 0.7), rgba(111, 29, 53, 0.1))',
              display: 'flex',
               alignItems: 'center',
              padding: '0 40px'
            }}>
              <div style={{ color: 'white', maxWidth: '500px' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', marginBottom: '12px' }}>A Commitment to Trust</h3>
                <p style={{ fontSize: '15px', lineHeight: '1.6', opacity: 0.9 }}>
                  Our premium packages ensure you connect with verified, serious candidates. 
                  Invest in a beautiful future with complete privacy and dedicated support.
                </p>
              </div>
            </div>
          </div>

          <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px', marginBottom: '60px' }}>
            <PremiumPlanCard
              title="Monthly Membership"
              price={300}
              gstRate={0.18}
              billingText="monthly"
              features={['Browse normal verified profiles', 'Unblur matrimonial photos', 'Access candidate mobile numbers']}
              isActive={hasPaid300}
              ctaText="Buy Monthly Membership"
              onActivate={() => handleRazorpayCheckout('monthly_membership', 300, 'Standard Monthly Membership')}
              onInquire={() => setInquiryPackage('₹300 Monthly Membership')}
              whatsappMessage="Assalamu Alaikum, I want to know more about the ₹300 monthly membership on Rishte Forever."
            />
            <PremiumPlanCard
              title="Good Profile Package"
              price={5500}
              gstRate={0.18}
              billingText="one-time base"
              features={['For handsome & beautiful profile matches', 'Leads provided until marriage', '₹21,000 payable after marriage confirmation']}
              isActive={simulatedPackages.includes('good_profile_package')}
              ctaText="Buy Good Profile Package"
              onActivate={() => handleRazorpayCheckout('good_profile_package', 5500, 'Good Profile Package')}
              onInquire={() => setInquiryPackage('₹5,500 Good Profiles Package')}
              whatsappMessage="Assalamu Alaikum, I am interested in the ₹5,500 Good Profiles Package on Rishte Forever. Please guide me."
              isPopular
            />
            <PremiumPlanCard
              title="Second Marriage Package"
              price={11000}
              gstRate={0.18}
              billingText="one-time fee"
              features={['For second marriage matches', 'Private segregated directory listing', 'Leads provided until marriage', 'No extra after-marriage fee']}
              isActive={simulatedPackages.includes('second_marriage_package')}
              ctaText="Buy Second Marriage Package"
              onActivate={() => handleRazorpayCheckout('second_marriage_package', 11000, 'Second Marriage Package')}
              onInquire={() => setInquiryPackage('₹11,000 Second Marriage Package')}
              whatsappMessage="Assalamu Alaikum, I am interested in the ₹11,000 Second Marriage Package on Rishte Forever. Please guide me."
            />
            <PremiumPlanCard
              title="High Profile Package"
              price={21000}
              gstRate={0.18}
              billingText="one-time base"
              features={['For candidates earning ₹10 lakh+ annually', 'Doctors, engineers, professionals & premium families', 'Leads provided until marriage', '₹25,000 payable after marriage confirmation']}
              isActive={simulatedPackages.includes('high_profile_package')}
              ctaText="Buy High Profile Package"
              onActivate={() => handleRazorpayCheckout('high_profile_package', 21000, 'High Profile Package')}
              onInquire={() => setInquiryPackage('₹21,000 High Profile Package')}
              whatsappMessage="Assalamu Alaikum, I am interested in the ₹21,000 High Profile Package on Rishte Forever. Please guide me."
            />
          </div>

          {/* Features Comparison Grid */}
          <div className="card-theme-wrapper" style={{ padding: '36px', marginBottom: '40px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--deep-maroon)', marginBottom: '24px', textAlign: 'center' }}>Package Comparison Matrix</h3>
            <div className="table-responsive">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', height: '40px', color: 'var(--deep-maroon)', fontWeight: 'bold' }}>
                    <th style={{ textAlign: 'left', padding: '12px' }}>Feature Benefits</th>
                    <th>Good Profile</th>
                    <th>Second Marriage</th>
                    <th>High Profile</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', height: '48px' }}>
                    <td style={{ textAlign: 'left', padding: '12px' }}>Directory Search Access</td>
                    <td>✓</td>
                    <td>✓</td>
                    <td>✓</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', height: '48px' }}>
                    <td style={{ textAlign: 'left', padding: '12px' }}>Unblurred Normal Profiles</td>
                    <td>✓</td>
                    <td>✓</td>
                    <td>✓</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', height: '48px' }}>
                    <td style={{ textAlign: 'left', padding: '12px' }}>Good Profile Unlock</td>
                    <td>✓</td>
                    <td>—</td>
                    <td>—</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', height: '48px' }}>
                    <td style={{ textAlign: 'left', padding: '12px' }}>Leads Provided Until Marriage</td>
                    <td>✓</td>
                    <td>✓</td>
                    <td>✓</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', height: '48px' }}>
                    <td style={{ textAlign: 'left', padding: '12px' }}>Segregated Second Marriage Directory</td>
                    <td>—</td>
                    <td>✓</td>
                    <td>—</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', height: '48px' }}>
                    <td style={{ textAlign: 'left', padding: '12px' }}>Earning ₹10 Lakh+ annually Directory</td>
                    <td>—</td>
                    <td>—</td>
                    <td>✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Package Inquiry Modal overlay */}
      {inquiryPackage && (
        <div className="modal-overlay font-sans" onClick={() => setInquiryPackage(null)}>
          <div className="card-theme-wrapper" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', width: '90%', margin: '20px', border: '2px solid var(--gold-accent)', padding: '32px', position: 'relative' }}>
            <FloralCorner position="tl" color="var(--gold-accent)" />
            <FloralCorner position="tr" color="var(--gold-accent)" />
            <button
              onClick={() => setInquiryPackage(null)}
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
              defaultPackage={inquiryPackage}
              onSuccess={() => setInquiryPackage(null)}
              onCancel={() => setInquiryPackage(null)}
            />
          </div>
        </div>
      )}

      <PremiumFooter onNavigate={handleNavigate} />
    </>
  );
}
