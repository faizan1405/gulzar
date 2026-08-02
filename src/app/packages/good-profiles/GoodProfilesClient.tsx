'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/context/SessionContext';
import Navbar from '@/components/Navbar';
import ProfileGrid from '@/components/ProfileGrid';
import { SectionHeading, PremiumFooter } from '@/components/NikahComponents';
import PackageSidebarCard from '@/components/PackageSidebarCard';
import PackageInquiryModal from '@/components/PackageInquiryModal';

export default function GoodProfilesClient() {
  const { profiles, isLoggedIn, handleUPIPayment, userProfile, setIsRegistering, setRegStep, setShowLoginModal, activePackages } = useSession();
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

            <PackageSidebarCard
              packageName="Good Profile Package"
              basePrice={5500}
              billingText="One-time payment, 1 year validity"
              successFeeAmount={21000}
              benefits={[
                'Verified profile suggestions',
                'Basic matchmaking support',
                'Privacy-safe profile sharing',
                '1 year service validity',
              ]}
              positioning="Verified profile suggestions with basic matchmaking"
              onActivate={() => handleUPIPayment('good_profile_package', 5500, 'Good Profile Package')}
              onInquire={() => setShowInquiry(true)}
              whatsappMessage="Assalamu Alaikum, I am interested in the ₹5,500 Good Profiles Package on Rishte Forever. Please guide me."
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
        defaultPackage="₹5,500 Good Profiles Package"
      />

      <PremiumFooter onNavigate={(view) => window.location.href = `/${view === 'home' ? '' : view}`} />
    </>
  );
}
