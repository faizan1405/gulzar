'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/context/SessionContext';
import Navbar from '@/components/Navbar';
import ProfileGrid from '@/components/ProfileGrid';
import { SectionHeading, PremiumFooter } from '@/components/NikahComponents';
import PackageSidebarCard from '@/components/PackageSidebarCard';
import PackageInquiryModal from '@/components/PackageInquiryModal';

export default function HighProfileClient() {
  const { profiles, isLoggedIn, handleUPIPayment, userProfile, setIsRegistering, setRegStep, setShowLoginModal, activePackages } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showInquiry, setShowInquiry] = useState(false);

  const isFormComplete = isLoggedIn && userProfile?.profileCompletionStatus === 'COMPLETE';
  const isPackageActive = activePackages.includes('high_profile_package');

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
            as="h1"
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

            <PackageSidebarCard
              packageName="Gold Package"
              basePrice={21000}
              billingText="One-time payment, 1 year validity"
              successFeeAmount={25000}
              benefits={[
                'Premium verified profile suggestions',
                'High-priority matchmaking assistance',
                'Personalized profile shortlisting',
                'Family meeting coordination support',
                '1 year service validity',
              ]}
              positioning="Full concierge matchmaking experience"
              onActivate={() => handleUPIPayment('high_profile_package', 21000, 'Gold Package')}
              onInquire={() => setShowInquiry(true)}
              whatsappMessage="Assalamu Alaikum, I am interested in the ₹21,000 Gold Package on Rishte Forever. Please guide me."
              isFormComplete={isFormComplete}
              isPackageActive={isPackageActive}
              onCompleteForm={handleCompleteForm}
            />
          </div>
        </div>
      </main>

      <PackageInquiryModal
        isOpen={showInquiry}
        onClose={() => setShowInquiry(false)}
        defaultPackage="₹21,000 Gold Package"
      />

      <PremiumFooter onNavigate={(view) => window.location.href = `/${view === 'home' ? '' : view}`} />
    </>
  );
}
