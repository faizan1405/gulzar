'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSimulator } from '../../context/SimulatorContext';
import Navbar from '../../components/Navbar';
import { SectionHeading, PremiumPlanCard, PremiumFooter } from '../../components/NikahComponents';

export default function PremiumPage() {
  const router = useRouter();
  const {
    hasPaid300,
    simulatedPackages,
    handleRazorpayCheckout
  } = useSimulator();

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
          />

          <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginBottom: '60px' }}>
            <PremiumPlanCard
              title="Good Profile Package"
              price={5500}
              gstRate={0.18}
              billingText="one-time base"
              features={['For handsome & beautiful profile matches', 'Leads provided until marriage', '₹21,000 payable after marriage confirmation']}
              isActive={simulatedPackages.includes('good_profile_package')}
              ctaText="Buy Good Profile Package"
              onActivate={() => handleRazorpayCheckout('good_profile_package', 5500, 'Good Profile Package')}
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
            />
          </div>

          {/* Features Comparison Grid */}
          <div className="card-theme-wrapper" style={{ padding: '36px' }}>
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
      <PremiumFooter onNavigate={handleNavigate} />
    </>
  );
}
