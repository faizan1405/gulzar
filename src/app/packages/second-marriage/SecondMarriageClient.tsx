'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/context/SessionContext';
import Navbar from '@/components/Navbar';
import ProfileGrid from '@/components/ProfileGrid';
import { SectionHeading, PremiumFooter } from '@/components/NikahComponents';
import PackageSidebarCard from '@/components/PackageSidebarCard';
import PackageInquiryModal from '@/components/PackageInquiryModal';

export default function SecondMarriageClient() {
  const { profiles, isLoggedIn, handleUPIPayment, userProfile, setIsRegistering, setRegStep, setShowLoginModal, activePackages } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showInquiry, setShowInquiry] = useState(false);

  const isFormComplete = isLoggedIn && userProfile?.profileCompletionStatus === 'COMPLETE';
  const isPackageActive = activePackages.includes('second_marriage_package');

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

  // Second marriage filtering
  const secondMarriageProfiles = profiles.filter((p) => {
    const isSecMarriage = p.maritalStatus !== 'Single' || (p as any).category === 'second_marriage';
    if (!isSecMarriage) return false;

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
            title="Second Marriage Directory"
            subtitle="Browse matching divorcee/widow/widower profiles. Unlock access with the Silver Plan."
            scriptText="Second Marriage Matches"
            as="h1"
          />

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 350px',
            gap: '30px',
            marginTop: '30px',
            alignItems: 'start'
          }} className="second-marriage-container">
            <div>
              <div style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="Search Second Marriage (e.g. city, occupation...)"
                  className="form-control"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ flexGrow: 1 }}
                />
              </div>

              <ProfileGrid filteredProfiles={secondMarriageProfiles} />
            </div>

            <PackageSidebarCard
              packageName="Silver Plan"
              basePrice={11000}
              billingText="One-time payment, 1 year validity"
              successFeeAmount={0}
              benefits={[
                'Verified profile suggestions',
                'Priority matchmaking support',
                'Profile shortlisting assistance',
                'Family coordination support',
                '1 year service validity',
              ]}
              positioning="Priority matchmaking with dedicated follow-ups"
              onActivate={() => handleUPIPayment('second_marriage_package', 11000, 'Silver Plan')}
              onInquire={() => setShowInquiry(true)}
              whatsappMessage="Assalamu Alaikum, I am interested in the ₹11,000 Silver Plan on Rishte Forever. Please guide me."
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
        defaultPackage="₹11,000 Silver Plan"
      />

      <PremiumFooter onNavigate={(view) => window.location.href = `/${view === 'home' ? '' : view}`} />
    </>
  );
}
