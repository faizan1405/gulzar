'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useApp } from '../context/AppContext';
import { getProfileImage, getThemeClass } from '../lib/helpers';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import SearchableCombobox from '../components/SearchableCombobox';
import MatrimonialRegistrationForm from '../components/MatrimonialRegistrationForm';

import {
  
  BismillahCalligraphy,
  SectionHeading,
  QuranVerseBlock,
  ProfileCard,
  SuccessStoryCard,
  SafetyFeatureCard,
  FinalCTA,
  PremiumFooter,
  PremiumPlanCard,
  ZaichaPromoCard
} from '../components/NikahComponents';
import PackageInquiryForm from '../components/PackageInquiryForm';

export default function HomeClient() {
  const router = useRouter();
  const [inquiryPackage, setInquiryPackage] = React.useState<string | null>(null);
  const [quickGender, setQuickGender] = React.useState('');
  const [quickAgeMin, setQuickAgeMin] = React.useState('');
  const [quickAgeMax, setQuickAgeMax] = React.useState('');
  const [quickState, setQuickState] = React.useState('');
  const [quickCity, setQuickCity] = React.useState('');
  const [quickCommunity, setQuickCommunity] = React.useState('');
  const [quickCaste, setQuickCaste] = React.useState('');
  const [quickAgeError, setQuickAgeError] = React.useState(false);
  const {
    isLoggedIn,
    hasPaidSubscription,
    activePackages,
    highProfileApproved,
    showLoginModal,
    setShowLoginModal,
    handleGoogleLogin,
    isRegistering,
    setIsRegistering,
    regStep,
    setRegStep,
    registrationError,
    setRegistrationError,
    formData,
    setFormData,
    handleRegisterSubmit,
    handleRazorpayCheckout,
    profiles,
    savedProfiles,
    toggleSaveProfile,
    setSelectedProfileForDetails,
    handleViewProfile,
    userProfile,
    isLoading,
    masterMaslaks,
    masterCastes,
    masterLocations,
  } = useApp();

  const isFormComplete = isLoggedIn && userProfile?.profileCompletionStatus === 'COMPLETE';

  const activeMaslaks = masterMaslaks.filter(m => !m.isDisabled).sort((a, b) => a.label.localeCompare(b.label));
  const activeCastes = masterCastes.filter(c => !c.isDisabled).sort((a, b) => a.label.localeCompare(b.label));
  const activeLocations = masterLocations.filter(l => !l.isDisabled);
  const quickStates = Array.from(new Set(activeLocations.map(l => l.state))).sort((a, b) => a.localeCompare(b));
  const quickCities = quickState
    ? Array.from(new Set(activeLocations.filter(l => l.state === quickState).map(l => l.district))).sort((a, b) => a.localeCompare(b))
    : [];

  const handleQuickSearch = () => {
    const minNum = quickAgeMin ? Number(quickAgeMin) : null;
    const maxNum = quickAgeMax ? Number(quickAgeMax) : null;
    if (minNum !== null && maxNum !== null && minNum > maxNum) {
      setQuickAgeError(true);
      return;
    }
    setQuickAgeError(false);
    const params = new URLSearchParams();
    if (quickGender) params.set('gender', quickGender);
    if (quickAgeMin) params.set('ageMin', quickAgeMin);
    if (quickAgeMax) params.set('ageMax', quickAgeMax);
    if (quickState) params.set('state', quickState);
    if (quickCity) params.set('city', quickCity);
    if (quickCommunity) params.set('community', quickCommunity);
    if (quickCaste) params.set('caste', quickCaste);
    router.push(`/search?${params.toString()}`);
  };

  const handleCompleteForm = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    setIsRegistering(true);
    setRegStep(1);
    // Scroll to top so the wizard is visible
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: string) => {
    setIsRegistering(false);
    router.push('/' + (view === 'home' ? '' : view));
  };


  return (
    <>
      <Navbar />

      {isLoading && <div className="loading-spinner" />}

      <main className="flex-grow">
        {isRegistering ? (
          /* Multi-step onboarding/edit profile wizard */
          <section style={{ padding: '60px 0' }} className="container font-sans">
            <MatrimonialRegistrationForm onCancel={() => setIsRegistering(false)} />
          </section>
        ) : (
          /* Main Homepage */
          <>
            <BismillahCalligraphy />
            <HeroSection />

            {/* Smart Search Quick Action Bar */}
            <div className="container" style={{ position: 'relative', zIndex: '20', marginTop: '-30px' }}>
              <div className="search-panel" style={{ backgroundColor: 'var(--white)', border: '1.5px solid var(--border-color)', borderRadius: 'var(--border-radius-lg)', padding: '24px 36px', boxShadow: 'var(--shadow-premium)' }}>
                <span className="script-accent" style={{ fontSize: '2rem', display: 'block', marginBottom: '8px' }}>Refined Search</span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--deep-maroon)', fontWeight: 'bold', marginBottom: '14px' }}>
                  Quick Match Search
                </h3>

                {quickAgeError && (
                  <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '10px 14px', borderRadius: '8px', marginBottom: '14px', fontSize: '14px', fontWeight: 500 }}>
                    Minimum age cannot be greater than maximum age.
                  </div>
                )}

                {/* Row 1: Gender, Min Age, Max Age, State, City */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label className="form-label">Looking For</label>
                    <select
                      className="form-control"
                      style={{ backgroundColor: 'var(--warm-ivory)' }}
                      value={quickGender}
                      onChange={(e) => setQuickGender(e.target.value)}
                    >
                      <option value="">Any Gender</option>
                      <option value="Female">Bride (Female)</option>
                      <option value="Male">Groom (Male)</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Min Age</label>
                    <select
                      className="form-control"
                      style={{ backgroundColor: 'var(--warm-ivory)' }}
                      value={quickAgeMin}
                      onChange={(e) => { setQuickAgeMin(e.target.value); setQuickAgeError(false); }}
                    >
                      <option value="">Any</option>
                      {Array.from({ length: 53 }, (_, i) => 18 + i).map(age => (
                        <option key={age} value={String(age)}>{age}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Max Age</label>
                    <select
                      className="form-control"
                      style={{ backgroundColor: 'var(--warm-ivory)' }}
                      value={quickAgeMax}
                      onChange={(e) => { setQuickAgeMax(e.target.value); setQuickAgeError(false); }}
                    >
                      <option value="">Any</option>
                      {Array.from({ length: 53 }, (_, i) => 18 + i).map(age => (
                        <option key={age} value={String(age)}>{age}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">State</label>
                    <select
                      className="form-control"
                      style={{ backgroundColor: 'var(--warm-ivory)' }}
                      value={quickState}
                      onChange={(e) => { setQuickState(e.target.value); setQuickCity(''); }}
                    >
                      <option value="">All States</option>
                      {quickStates.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">City</label>
                    <select
                      className="form-control"
                      style={{ backgroundColor: 'var(--warm-ivory)' }}
                      value={quickCity}
                      onChange={(e) => setQuickCity(e.target.value)}
                      disabled={!quickState}
                    >
                      <option value="">All Cities</option>
                      {quickCities.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 2: Community, Caste, Search Button */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px', alignItems: 'flex-end' }}>
                  <div>
                    <label className="form-label">Community</label>
                    <select
                      className="form-control"
                      style={{ backgroundColor: 'var(--warm-ivory)' }}
                      value={quickCommunity}
                      onChange={(e) => setQuickCommunity(e.target.value)}
                    >
                      <option value="">All Communities</option>
                      {activeMaslaks.map(m => (
                        <option key={m.id} value={m.label}>{m.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Caste / Biradari</label>
                    <select
                      className="form-control"
                      style={{ backgroundColor: 'var(--warm-ivory)' }}
                      value={quickCaste}
                      onChange={(e) => setQuickCaste(e.target.value)}
                    >
                      <option value="">All Castes</option>
                      {activeCastes.map(c => (
                        <option key={c.id} value={c.label}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleQuickSearch}
                    className="btn btn-primary"
                    style={{ width: '100%', alignSelf: 'flex-end' }}
                  >
                    Search Now
                  </button>
                </div>
              </div>
            </div>

            <QuranVerseBlock />

            {/* Featured Candidates Preview */}
            <section style={{ backgroundColor: 'var(--soft-cream)', padding: '80px 0' }}>
              <div className="container">
                <SectionHeading
                  title="Featured Candidates"
                  subtitle="Explore recently verified matrimonial profiles. Activate a standard package to unlock details."
                  scriptText="Nikah Matches"
                />

                {isLoading ? (
                  <div style={{ textAlign: 'center', padding: '48px 20px' }}>
                    <div style={{ fontSize: '32px', marginBottom: '12px', animation: 'spin 1.2s linear infinite', display: 'inline-block' }}>⏳</div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '15px', fontWeight: 500 }}>Loading profiles…</p>
                  </div>
                ) : profiles.length > 0 ? (
                  <>
                    <p className="mobile-swipe-hint" aria-hidden="true">Swipe to explore →</p>
                    <div className="grid-3 mobile-swipe-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                      {profiles.slice(0, 6).map((profile, index) => (
                        <ProfileCard
                          key={profile.id}
                          profile={profile}
                          index={index}
                          isLoggedIn={isLoggedIn}
                          isFormComplete={isFormComplete}
                          hasPaidSubscription={hasPaidSubscription}
                          activePackages={activePackages}
                          highProfileApproved={highProfileApproved}
                          savedProfiles={savedProfiles}
                          onToggleSave={toggleSaveProfile}
                          onViewDetails={setSelectedProfileForDetails}
                          onViewProfile={handleViewProfile}
                          onShowLogin={() => setShowLoginModal(true)}
                          getProfileImage={getProfileImage}
                          getThemeClass={getThemeClass}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '48px 20px', backgroundColor: 'var(--white)', borderRadius: '12px', border: '1px dashed var(--gold-accent)' }}>
                    <div style={{ fontSize: '32px', marginBottom: '12px', color: 'var(--gold-accent)' }}>🌙</div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--primary-brand)', marginBottom: '8px' }}>Profiles Coming Soon</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
                      Verified profiles are being added. Register now to be among the first candidates.
                    </p>
                  </div>
                )}

                <div style={{ textAlign: 'center', marginTop: '48px' }}>
                  <button onClick={() => router.push('/search')} className="btn btn-gold" style={{ padding: '12px 36px' }}>
                    Explore More Profiles
                  </button>
                </div>
              </div>
            </section>

            {/* Timeline process */}
            <section style={{ backgroundColor: 'var(--warm-ivory)', padding: '80px 0' }}>
              <div className="container">
                <SectionHeading
                  title="How Rishte Forever Works"
                  subtitle="Designed from the ground up for pure, respectful, and family-approved matches."
                  scriptText="Begin Your Journey"
                />

                <div className="timeline-container">
                  <div className="timeline-line" style={{ top: '50px' }}></div>
                  <div className="timeline-grid">
                    <div className="timeline-step">
                      <div className="timeline-number">1</div>
                      <h3>Create Your Profile</h3>
                      <p>Fill in details about your career, education, and family background, and customize your biodata card accent.</p>
                    </div>
                    <div className="timeline-step">
                      <div className="timeline-number">2</div>
                      <h3>Phone Verification</h3>
                      <p>Our dedicated admin desk contacts you by phone to verify credentials and ensure serious intentions.</p>
                    </div>
                    <div className="timeline-step">
                      <div className="timeline-number">3</div>
                      <h3>Connect and Propose</h3>
                      <p>Once verified and approved, browse compatible matches, request contact shares, and involve family members.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Trust & Family Safety Preview */}
            <section style={{ backgroundColor: 'var(--soft-cream)', padding: '80px 0' }}>
              <div className="container">
                <SectionHeading
                  title="Trust & Family Safety"
                  subtitle="Rest assured that candidate verification and member privacy are our top priorities."
                  scriptText="Halal & Secure"
                />

                <div className="safety-wrapper" style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: '48px', alignItems: 'center' }}>
                  <div style={{ width: '100%' }}>
                    <div style={{ position: 'relative', width: '100%', paddingBottom: '75%', borderRadius: 'var(--border-radius-lg)', border: '1.5px solid var(--gold-accent)', boxShadow: 'var(--shadow-premium)', overflow: 'hidden' }}>
                      <Image
                        src="/images/trust-safety.jpg"
                        alt="Verified Muslim profiles and matchmaking safety - Rishte Forever"
                        fill
                        sizes="(max-width: 768px) 100vw, 500px"
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <SafetyFeatureCard
                      icon="✓"
                      title="100% Manual Phone Screening"
                      desc="We check all users by telephone, confirming details and family preferences before any search publication."
                    />
                    <SafetyFeatureCard
                      icon="✓"
                      title="Contact & Photo Masking"
                      desc="Photos and mobile numbers remain blurred to protect candidate integrity until you authorize sharing."
                    />
                    <SafetyFeatureCard
                      icon="✓"
                      title="Family Inclusion Encouraged"
                      desc="We encourage candidates to involve parents or guardians in match check calls and meetings."
                    />
                    <SafetyFeatureCard
                      icon="✓"
                      title="Islamic Compatibility & Zaicha"
                      desc="We also help families with Zaicha guidance for marriage compatibility, while keeping the final decision based on deen, character, mutual consent, and family understanding."
                    />
                  </div>
                </div>
              </div>
            </section>

            <ZaichaPromoCard />

            {/* Success Stories Preview */}
            <section style={{ backgroundColor: 'var(--warm-ivory)', padding: '80px 0' }}>
              <div className="container">
                <SectionHeading
                  title="Blessed Success Stories"
                  subtitle="Alhamdulillah! Here are matching stories of couples who found their partners on Rishte Forever."
                  scriptText="Success Stories"
                />

                <p className="mobile-swipe-hint" aria-hidden="true">Swipe to explore →</p>
                <div className="grid-3 mobile-swipe-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
                  <SuccessStoryCard
                    names="Dr. Sarah & Tariq"
                    location="Mumbai • Married 2025"
                    story="Rishte Forever made the search simple and extremely respectful. The manual verification check gave my parents peace of mind, and we connected securely."
                    imageIndex={0}
                  />
                  <SuccessStoryCard
                    names="Aisha & Khalid"
                    location="Delhi • Married 2026"
                    story="Alhamdulillah, the Curated Matchmaking package was worth every rupee. Our dedicated advisor sent compatible matches directly, and we tied the knot within months."
                    imageIndex={1}
                  />
                  <SuccessStoryCard
                    names="Adnan & Yasmin"
                    location="Bangalore • Married 2024"
                    story="I loved the privacy features. My photo remained blurred to general visitors, and I had control over who could view my details. We are very happy."
                    imageIndex={2}
                  />
                </div>
              </div>
            </section>

            {/* Premium Teaser Section */}
            <section style={{ backgroundColor: 'var(--soft-cream)', padding: '80px 0' }}>
              <div className="container">
                <SectionHeading
                  title="Tailored Membership Packages"
                  subtitle="Activate standard view permissions or request curated 1-on-1 matches. Transparent fees with dynamic GST billing."
                  scriptText="Choose Your Plan"
                />

                <p className="mobile-swipe-hint" aria-hidden="true">Swipe to compare plans →</p>
                <div className="grid-4 mobile-swipe-row swipe-packages" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px' }}>
                  <PremiumPlanCard
                    title="Monthly Membership"
                    price={1}
                    gstRate={0}
                    billingText="monthly"
                    features={['Browse normal verified profiles', 'Unblur matrimonial photos', 'Access candidate mobile numbers']}
                    isActive={hasPaidSubscription}
                    ctaText="Buy Monthly Membership"
                    onActivate={() => handleRazorpayCheckout('monthly_membership', 1, 'Standard Monthly Membership')}
                    onInquire={() => setInquiryPackage('₹1 Monthly Membership')}
                    whatsappMessage="Assalamu Alaikum, I want to know more about the ₹1 monthly membership on Rishte Forever."
                    imageUrl="/images/monthly_active.png"
                    hidePrices={!isFormComplete}
                    isLoggedIn={isLoggedIn}
                    onCompleteForm={handleCompleteForm}
                    onShowLogin={() => setShowLoginModal(true)}
                  />
                  <PremiumPlanCard
                    title="Good Profile Package"
                    price={1}
                    gstRate={0}
                    billingText="one-time base"
                    features={['Verified profile suggestions', 'Basic matchmaking support', 'Privacy-safe profile sharing', '1 year service validity']}
                    isActive={activePackages.includes('good_profile_package')}
                    ctaText="Buy Good Profile Package"
                    onActivate={() => handleRazorpayCheckout('good_profile_package', 1, 'Good Profile Package')}
                    onInquire={() => setInquiryPackage('₹1 Good Profiles Package')}
                    whatsappMessage="Assalamu Alaikum, I am interested in the ₹1 Good Profiles Package on Rishte Forever. Please guide me."
                    badgeText="Starter"
                    planTier="basic"
                    imageUrl="/images/good_profile.png"
                    hidePrices={!isFormComplete}
                    isLoggedIn={isLoggedIn}
                    onCompleteForm={handleCompleteForm}
                    onShowLogin={() => setShowLoginModal(true)}
                  />
                  <PremiumPlanCard
                    title="Silver Plan"
                    price={1}
                    gstRate={0}
                    billingText="one-time fee"
                    features={[
                      'Everything in Basic Package',
                      'More verified profile suggestions',
                      'Priority matchmaking support',
                      'Profile shortlisting assistance',
                      'Family coordination support',
                      'Regular follow-up support',
                      'Privacy-safe contact assistance',
                      '1 year service validity'
                    ]}
                    isActive={activePackages.includes('second_marriage_package')}
                    ctaText="Buy Silver Plan"
                    onActivate={() => handleRazorpayCheckout('second_marriage_package', 1, 'Silver Plan')}
                    onInquire={() => setInquiryPackage('₹1 Silver Plan')}
                    whatsappMessage="Assalamu Alaikum, I am interested in the ₹1 Silver Plan on Rishte Forever. Please guide me."
                    badgeText="Most Balanced"
                    planTier="silver"
                    imageUrl="/images/second_marriage.png"
                    hidePrices={!isFormComplete}
                    isLoggedIn={isLoggedIn}
                    onCompleteForm={handleCompleteForm}
                    onShowLogin={() => setShowLoginModal(true)}
                  />
                  <PremiumPlanCard
                    title="Gold Package"
                    price={1}
                    gstRate={0}
                    billingText="one-time base"
                    features={[
                      'Everything in Silver Plan',
                      'Premium verified profile suggestions',
                      'High-priority matchmaking assistance',
                      'Personalized profile shortlisting',
                      'Dedicated support assistance',
                      'Family meeting coordination support',
                      'Biodata/profile presentation guidance',
                      'Regular follow-up and progress updates',
                      'Privacy-safe contact assistance',
                      '1 year service validity'
                    ]}
                    isActive={activePackages.includes('high_profile_package')}
                    ctaText="Buy Gold Package"
                    onActivate={() => handleRazorpayCheckout('high_profile_package', 1, 'Gold Package')}
                    onInquire={() => setInquiryPackage('₹1 Gold Package')}
                    whatsappMessage="Assalamu Alaikum, I am interested in the ₹1 Gold Package on Rishte Forever. Please guide me."
                    badgeText="Premium Choice"
                    planTier="gold"
                    imageUrl="/images/high_profile.png"
                    hidePrices={!isFormComplete}
                    isLoggedIn={isLoggedIn}
                    onCompleteForm={handleCompleteForm}
                    onShowLogin={() => setShowLoginModal(true)}
                  />
                </div>
              </div>
            </section>

            {/* Wedding & Event Support Section */}
            <section style={{ backgroundColor: 'var(--soft-cream)', padding: '80px 0' }}>
              <div className="container">
                <SectionHeading
                  title="Wedding & Event Support"
                  subtitle="From finding the right match to planning the perfect celebration — we help families connect with trusted event service partners."
                  scriptText="Celebrate Together"
                />

                <p className="mobile-swipe-hint" aria-hidden="true">Swipe to explore →</p>
                <div
                  className="mobile-swipe-row"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                    gap: '20px',
                  }}
                >
                  {[
                    { emoji: '🌸', name: 'Decoration Partners',       desc: 'Floral, thematic & stage décor' },
                    { emoji: '🏛️', name: 'Wedding Venues',            desc: 'Banquet halls & event spaces' },
                    { emoji: '🍽️', name: 'Catering Services',         desc: 'Authentic halal menu options' },
                    { emoji: '📸', name: 'Photography',               desc: 'Professional event studios' },
                    { emoji: '💄', name: 'Bridal Makeup',             desc: 'Expert bridal artists' },
                    { emoji: '✋', name: 'Mehendi Artists',           desc: 'Traditional & modern designs' },
                    { emoji: '📜', name: 'Invitation Cards',          desc: 'Premium printed & digital' },
                    { emoji: '🕌', name: 'Qazi & Nikah Arrangement',  desc: 'Trusted ceremony services' },
                  ].map((svc) => (
                    <div
                      key={svc.name}
                      style={{
                        backgroundColor: 'var(--white)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--border-radius-lg)',
                        padding: '24px 16px 20px',
                        textAlign: 'center',
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'var(--transition-smooth)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <div
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--soft-cream)',
                          border: '1.5px solid var(--border-color)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '24px',
                        }}
                      >
                        {svc.emoji}
                      </div>
                      <h3
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: '14.5px',
                          color: 'var(--deep-maroon)',
                          fontWeight: 700,
                          margin: 0,
                          lineHeight: 1.3,
                        }}
                      >
                        {svc.name}
                      </h3>
                      <p
                        style={{
                          fontSize: '12.5px',
                          color: 'var(--text-muted)',
                          margin: 0,
                          lineHeight: 1.5,
                        }}
                      >
                        {svc.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: '48px', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => router.push('/event-management')}
                    className="btn btn-gold"
                    style={{ padding: '12px 36px' }}
                  >
                    Explore Event Services
                  </button>
                  <a
                    href={`https://wa.me/919675483125?text=${encodeURIComponent('Assalamu Alaikum, I am interested in Event Management support. Please share details for trusted wedding/event vendors.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{ padding: '12px 36px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp Inquiry
                  </a>
                </div>
              </div>
            </section>

            <FinalCTA
              onRegister={() => {
                if (!isLoggedIn) {
                  setShowLoginModal(true);
                } else {
                  setIsRegistering(true);
                  setRegStep(1);
                }
              }}
              onBrowse={() => router.push('/search')}
              isLoggedIn={isLoggedIn}
              hasProfile={!!userProfile}
            />
          </>
        )}
      </main>

      <PremiumFooter onNavigate={handleNavigate} />

      {/* Google Login Simulator Modal */}
      {showLoginModal && (
        <div className="modal-overlay font-sans">
          <div className="card-theme-wrapper" style={{ maxWidth: '400px', width: '90%', margin: '20px' }}>
                                                            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--deep-maroon)', marginBottom: '12px', fontWeight: 'bold' }}>
                Join Rishte Forever
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.5' }}>
                Create a profile or log in securely using your Google account to get verified.
              </p>

              <button
                onClick={() => signIn('google', { callbackUrl: window.location.href })}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  backgroundColor: '#ffffff',
                  color: '#444',
                  border: '1px solid #ddd',
                }}
              >
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                  alt="Google logo"
                  width={20}
                  height={20}
                />
                Continue with Google
              </button>


              <button
                onClick={() => setShowLoginModal(false)}
                className="btn btn-secondary"
                style={{ width: '100%', marginTop: '12px' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Package Inquiry Modal overlay */}
      {inquiryPackage && (
        <div className="modal-overlay font-sans" onClick={() => setInquiryPackage(null)}>
          <div className="card-theme-wrapper" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', width: '90%', margin: '20px', border: '2px solid var(--gold-accent)', padding: '32px', position: 'relative' }}>
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
    </>
  );
}
