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
            title="Polished Premium Packages"
            subtitle="Upgrade to access verified contact details or get handpicked matches through curated matchmaking."
            scriptText="Premium Services"
          />

          <div className="grid-4" style={{ marginBottom: '60px' }}>
            <PremiumPlanCard
              title="Standard Monthly"
              price={300}
              gstRate={0.18}
              billingText="per month"
              features={['View unblurred candidate photos', 'Reveal call-verified phone numbers', 'Advanced profile filters', 'Save matching biodatas']}
              isActive={hasPaid300 || simulatedPackages.includes('STANDARD')}
              ctaText="Activate Plan"
              onActivate={() => handleRazorpayCheckout('STANDARD', 300, 'Standard Monthly Membership')}
              isPopular
            />
            <PremiumPlanCard
              title="Curated Matches"
              price={5500}
              gstRate={0.18}
              billingText="one-time base"
              features={['Personal match assistant support', 'Handpicked matches via email/WA', 'Leads provided until marriage', '₹21,000 Success fee on Nikah']}
              isActive={simulatedPackages.includes('CURATED')}
              ctaText="Choose Curated"
              onActivate={() => handleRazorpayCheckout('CURATED', 5500, 'Curated Matches Package')}
            />
            <PremiumPlanCard
              title="Second-Marriage"
              price={11000}
              gstRate={0.18}
              billingText="one-time fee"
              features={['Private separated directory listing', 'Highly confidential biodata share', '1-on-1 advisor counseling checks', 'No success fee matches']}
              isActive={simulatedPackages.includes('SECOND_MARRIAGE')}
              ctaText="Choose Second Marriage"
              onActivate={() => handleRazorpayCheckout('SECOND_MARRIAGE', 11000, 'Second-Marriage Package')}
            />
            <PremiumPlanCard
              title="High-Profile"
              price={21000}
              gstRate={0.18}
              billingText="one-time base"
              features={['For doctors, Masters, business owners', 'Exclusive verified list', 'Dedicated matchmaking desk', '₹25,000 Success fee on Nikah']}
              isActive={simulatedPackages.includes('HIGH_PROFILE')}
              ctaText="Choose High Profile"
              onActivate={() => handleRazorpayCheckout('HIGH_PROFILE', 21000, 'High-Profile Matches Package')}
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
                    <th>Standard</th>
                    <th>Curated</th>
                    <th>Second Marriage</th>
                    <th>High-Profile</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', height: '48px' }}>
                    <td style={{ textAlign: 'left', padding: '12px' }}>Directory Search Access</td>
                    <td>✓</td>
                    <td>✓</td>
                    <td>✓</td>
                    <td>✓</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', height: '48px' }}>
                    <td style={{ textAlign: 'left', padding: '12px' }}>Unblurred Profile Photos</td>
                    <td>✓</td>
                    <td>✓</td>
                    <td>✓ (Private Directory)</td>
                    <td>✓</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', height: '48px' }}>
                    <td style={{ textAlign: 'left', padding: '12px' }}>Call-Verified Phone Shares</td>
                    <td>✓</td>
                    <td>✓</td>
                    <td>✓</td>
                    <td>✓</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', height: '48px' }}>
                    <td style={{ textAlign: 'left', padding: '12px' }}>Dedicated Matchmaker Assistant</td>
                    <td>—</td>
                    <td>✓</td>
                    <td>✓</td>
                    <td>✓</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', height: '48px' }}>
                    <td style={{ textAlign: 'left', padding: '12px' }}>Segregated Divorcee Matching</td>
                    <td>—</td>
                    <td>—</td>
                    <td>✓</td>
                    <td>—</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', height: '48px' }}>
                    <td style={{ textAlign: 'left', padding: '12px' }}>Doctor/Affluent Group Access</td>
                    <td>—</td>
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
