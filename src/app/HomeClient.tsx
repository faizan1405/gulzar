'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from '../context/SessionContext';
import { getProfileImage, getThemeClass } from '../lib/helpers';
import { getSupportWhatsAppLink } from '../lib/whatsapp';
import Navbar from '../components/Navbar';
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
    handleUPIPayment,
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
    activePackages,
    hasPaid300,
    highProfileApproved,
  } = useSession();

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

  const handleNavigate = (view: string) => {
    router.push('/' + (view === 'home' ? '' : view));
  };

  const eventServices = [
    { emoji: '🌸', name: 'Decoration Partners', desc: 'Floral, thematic & stage décor' },
    { emoji: '🏛️', name: 'Wedding Venues', desc: 'Banquet halls & event spaces' },
    { emoji: '🍽️', name: 'Catering Services', desc: 'Authentic halal menu options' },
    { emoji: '📸', name: 'Photography', desc: 'Professional event studios' },
    { emoji: '💄', name: 'Bridal Makeup', desc: 'Expert bridal artists' },
    { emoji: '✋', name: 'Mehendi Artists', desc: 'Traditional & modern designs' },
    { emoji: '📜', name: 'Invitation Cards', desc: 'Premium printed & digital' },
    { emoji: '🕌', name: 'Qazi & Nikah Arrangement', desc: 'Trusted ceremony services' },
  ];

  return (
    <>
      <Navbar />

      {isLoading && <div className="loading-spinner" />}

      <main className="flex-grow">
        <BismillahCalligraphy />

        {/* Smart Search */}
        <div className="container">
          <div className="search-panel-wrap">
            <div className="search-panel">
              <span className="script-accent">Refined Search</span>
              <h2 className="search-panel-title">Quick Match Search</h2>

              {quickAgeError && (
                <div className="search-panel-error">
                  Minimum age cannot be greater than maximum age.
                </div>
              )}

              <div className="search-row-1">
                <div>
                  <label className="form-label">Looking For</label>
                  <select className="form-control" value={quickGender} onChange={(e) => setQuickGender(e.target.value)}>
                    <option value="">Any Gender</option>
                    <option value="Female">Bride (Female)</option>
                    <option value="Male">Groom (Male)</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Min Age</label>
                  <select className="form-control" value={quickAgeMin} onChange={(e) => { setQuickAgeMin(e.target.value); setQuickAgeError(false); }}>
                    <option value="">Any</option>
                    {Array.from({ length: 53 }, (_, i) => 18 + i).map(age => (
                      <option key={age} value={String(age)}>{age}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Max Age</label>
                  <select className="form-control" value={quickAgeMax} onChange={(e) => { setQuickAgeMax(e.target.value); setQuickAgeError(false); }}>
                    <option value="">Any</option>
                    {Array.from({ length: 53 }, (_, i) => 18 + i).map(age => (
                      <option key={age} value={String(age)}>{age}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">State</label>
                  <select className="form-control" value={quickState} onChange={(e) => { setQuickState(e.target.value); setQuickCity(''); }}>
                    <option value="">All States</option>
                    {quickStates.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">City</label>
                  <select className="form-control" value={quickCity} onChange={(e) => setQuickCity(e.target.value)} disabled={!quickState}>
                    <option value="">All Cities</option>
                    {quickCities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="search-row-2">
                <div>
                  <label className="form-label">Community</label>
                  <select className="form-control" value={quickCommunity} onChange={(e) => setQuickCommunity(e.target.value)}>
                    <option value="">All Communities</option>
                    {activeMaslaks.map(m => <option key={m.id} value={m.label}>{m.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Caste / Biradari</label>
                  <select className="form-control" value={quickCaste} onChange={(e) => setQuickCaste(e.target.value)}>
                    <option value="">All Castes</option>
                    {activeCastes.map(c => <option key={c.id} value={c.label}>{c.label}</option>)}
                  </select>
                </div>
                <button onClick={handleQuickSearch} className="btn btn-primary search-submit-btn">
                  Search Now
                </button>
              </div>
            </div>
          </div>
        </div>

        <QuranVerseBlock />

        {/* Featured Candidates */}
        <section className="home-section home-section-cream">
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
                <p className="swipe-hint" aria-hidden="true">Swipe to explore →</p>
                <div className="profiles-grid">
                  {profiles.slice(0, 6).map((profile, index) => (
                    <ProfileCard
                      key={profile.id}
                      profile={profile}
                      index={index}
                      isLoggedIn={isLoggedIn}
                      isFormComplete={isFormComplete}
                      hasPaidSubscription={hasPaid300}
                      activePackages={activePackages}
                      highProfileApproved={highProfileApproved}
                      savedProfiles={savedProfiles}
                      onToggleSave={toggleSaveProfile}
                      onViewDetails={setSelectedProfileForDetails}
                      onViewProfile={handleViewProfile}
                      getProfileImage={getProfileImage}
                      getThemeClass={getThemeClass}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="empty-state">
                <div style={{ fontSize: '32px', marginBottom: '12px', color: 'var(--gold-accent)' }}>🌙</div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--primary-brand)', marginBottom: '8px' }}>Profiles Coming Soon</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
                  Verified profiles are being added. Register now to be among the first candidates.
                </p>
              </div>
            )}

            <div className="section-actions">
              <button onClick={() => router.push('/search')} className="btn btn-gold">
                Explore More Profiles
              </button>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="home-section home-section-white">
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

        {/* Trust & Safety */}
        <section className="home-section home-section-cream">
          <div className="container">
            <SectionHeading
              title="Trust & Family Safety"
              subtitle="Rest assured that candidate verification and member privacy are our top priorities."
              scriptText="Halal & Secure"
            />

            <div className="safety-wrapper">
              <div className="safety-image-frame">
                <Image
                  src="/images/trust-safety.jpg"
                  alt="Verified Muslim profiles and matchmaking safety - Rishte Forever"
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
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

        {/* Success Stories */}
        <section className="home-section home-section-white">
          <div className="container">
            <SectionHeading
              title="Blessed Success Stories"
              subtitle="Alhamdulillah! Here are matching stories of couples who found their partners on Rishte Forever."
              scriptText="Success Stories"
            />

            <p className="swipe-hint" aria-hidden="true">Swipe to explore →</p>
            <div className="stories-grid">
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

        {/* Packages Overview */}
        <section className="home-section home-section-cream">
          <div className="container">
            <SectionHeading
              title="Rishta Plans"
              subtitle="Choose the plan that fits your journey. All include manual phone verification, privacy-safe browsing, and 1-year validity."
              scriptText="Memberships"
            />

            <div className="packages-grid">
              <PremiumPlanCard
                title="Monthly Membership"
                price={300}
                gstRate={0.18}
                billingText="Monthly billing"
                features={[
                  'Browse verified profiles',
                  'View profile photos',
                  'Access contact numbers',
                  '1 month validity',
                ]}
                badgeText="Starter"
                planTier="basic"
                imageUrl="/images/monthly_active.png"
                ctaText="Start Monthly Membership"
                onActivate={() => handleUPIPayment('monthly_membership', 'Standard Monthly Membership')}
                onInquire={() => setInquiryPackage('₹300 Monthly Membership')}
                whatsappMessage="Assalamu Alaikum, I want to know more about the ₹300 monthly membership on Rishte Forever."
              />
              <PremiumPlanCard
                title="Good Profile Package"
                price={5500}
                gstRate={0.18}
                billingText="One-time, 1 year validity"
                features={[
                  'Verified profile suggestions',
                  'Basic matchmaking support',
                  'Privacy-safe profile sharing',
                  '1 year service validity',
                ]}
                badgeText="Popular"
                planTier="basic"
                imageUrl="/images/good_profile.png"
                ctaText="Choose Good Profile Package"
                onActivate={() => handleUPIPayment('good_profile_package', 'Good Profile Package')}
                onInquire={() => setInquiryPackage('₹5,500 Good Profiles Package')}
                whatsappMessage="Assalamu Alaikum, I am interested in the ₹5,500 Good Profiles Package on Rishte Forever. Please guide me."
              />
              <PremiumPlanCard
                title="Silver Plan"
                price={11000}
                gstRate={0.18}
                billingText="One-time, 1 year validity"
                features={[
                  'Verified profile suggestions',
                  'Priority matchmaking support',
                  'Profile shortlisting',
                  'Family coordination support',
                  '1 year service validity',
                ]}
                badgeText="Recommended"
                planTier="silver"
                imageUrl="/images/second_marriage.png"
                ctaText="Choose Silver Plan"
                onActivate={() => handleUPIPayment('second_marriage_package', 'Silver Plan')}
                onInquire={() => setInquiryPackage('₹11,000 Silver Plan')}
                whatsappMessage="Assalamu Alaikum, I am interested in the ₹11,000 Silver Plan on Rishte Forever. Please guide me."
              />
              <PremiumPlanCard
                title="Gold Package"
                price={21000}
                gstRate={0.18}
                billingText="One-time, 1 year validity"
                features={[
                  'Premium verified profile suggestions',
                  'High-priority matchmaking',
                  'Personalized shortlisting',
                  'Family meeting support',
                  '1 year service validity',
                ]}
                badgeText="Premium Choice"
                planTier="gold"
                imageUrl="/images/high_profile.png"
                ctaText="Choose Gold Package"
                onActivate={() => handleUPIPayment('high_profile_package', 'Gold Package')}
                onInquire={() => setInquiryPackage('₹21,000 Gold Package')}
                whatsappMessage="Assalamu Alaikum, I am interested in the ₹21,000 Gold Package on Rishte Forever. Please guide me."
              />
            </div>

            <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '15px', color: 'var(--text-muted)' }}>
              Need help choosing?{' '}
              <span style={{ textDecoration: 'underline', fontWeight: 600, color: 'var(--deep-maroon)', cursor: 'pointer' }}>
                Chat on WhatsApp to discuss plans →
              </span>
            </p>
          </div>
        </section>

        {/* Wedding & Event Support */}
        <section className="home-section home-section-white">
          <div className="container">
            <SectionHeading
              title="Wedding & Event Support"
              subtitle="From finding the right match to planning the perfect celebration — we help families connect with trusted event service partners."
              scriptText="Celebrate Together"
            />

            <p className="swipe-hint" aria-hidden="true">Swipe to explore →</p>
            <div className="event-grid">
              {eventServices.map((svc) => (
                <div key={svc.name} className="event-card">
                  <div className="event-icon">{svc.emoji}</div>
                  <h3 className="event-card-title">{svc.name}</h3>
                  <p className="event-card-desc">{svc.desc}</p>
                </div>
              ))}
            </div>

            <div className="section-actions">
              <button onClick={() => router.push('/event-management')} className="btn btn-gold">
                Explore Event Services
              </button>
              <a
                href={getSupportWhatsAppLink('Assalamu Alaikum, I am interested in Event Management support. Please share details for trusted wedding/event vendors.')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                <svg className="icon-flex-shrink" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Inquiry
              </a>
            </div>
          </div>
        </section>

        <FinalCTA
          onRegister={() => {
            if (isLoggedIn && userProfile?.profileCompletionStatus === 'COMPLETE') {
              router.push('/my-account');
            } else {
              router.push('/register');
            }
          }}
          onBrowse={() => router.push('/search')}
          isLoggedIn={isLoggedIn}
          hasProfile={!!userProfile}
        />
      </main>

      <PremiumFooter onNavigate={handleNavigate} />

      {/* Package Inquiry Modal */}
      {inquiryPackage && (
        <div className="modal-overlay" onClick={() => setInquiryPackage(null)}>
          <div className="card-theme-wrapper modal-inquiry" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setInquiryPackage(null)}
              className="modal-close-btn"
              style={{ position: 'absolute', top: '16px', right: '16px' }}
            >
              ×
            </button>
            <div className="modal-title-center">
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--deep-maroon)', marginBottom: '4px' }}>
                Package Inquiry &amp; Callback
              </h3>
            </div>
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
