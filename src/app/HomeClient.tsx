'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSimulator } from '../context/SimulatorContext';
import { getProfileImage, getThemeClass } from '../lib/helpers';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import SearchableCombobox from '../components/SearchableCombobox';
import { DEFAULT_FIQHS, QUICK_MATCH_LOCATIONS } from '../lib/masterData';

import {
  FloralCorner,
  BismillahCalligraphy,
  SectionHeading,
  QuranVerseBlock,
  ProfileCard,
  SuccessStoryCard,
  SafetyFeatureCard,
  FinalCTA,
  PremiumFooter,
  PremiumPlanCard
} from '../components/NikahComponents';
import PackageInquiryForm from '../components/PackageInquiryForm';


// Theme options matching original config
const THEME_COLORS = [
  { name: 'Emerald Green', value: 'emerald' },
  { name: 'Royal Crimson', value: 'crimson' },
  { name: 'Gold Accent', value: 'gold' },
  { name: 'Ocean Navy', value: 'navy' },
  { name: 'Rose Petal', value: 'rose' },
  { name: 'Teal Whisper', value: 'teal' },
  { name: 'Plum Royalty', value: 'plum' },
  { name: 'Saffron Glow', value: 'saffron' }
];

export default function HomeClient() {
  const router = useRouter();
  const [inquiryPackage, setInquiryPackage] = React.useState<string | null>(null);
  const [quickLocation, setQuickLocation] = React.useState('All India');
  const {
    isLoggedIn,
    hasPaid300,
    simulatedPackages,
    simulatedHighProfileApproved,
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
    userProfile,
    isLoading,
    masterMaslaks,
    masterCastes,
    masterLocations,
  } = useSimulator();

  const handleNextStep = () => {
    if (regStep === 1) {
      if (!formData.fullName || !formData.dateOfBirth || !formData.phoneNumber || !formData.bio) {
        setRegistrationError('Please fill in all personal details.');
        return;
      }
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
      if (age < 18) {
        setRegistrationError('Registration is restricted to eligible adults (18 years and older).');
        return;
      }
    } else if (regStep === 2) {
      if (!formData.city || !formData.state) {
        setRegistrationError('Please fill in your current state and city.');
        return;
      }
    } else if (regStep === 3) {
      if (!formData.education || !formData.occupation) {
        setRegistrationError('Please provide your education and occupation info.');
        return;
      }
    } else if (regStep === 4) {
      // Community Preferences step has optional inputs, no mandatory validation required
    } else if (regStep === 5) {
      if (!formData.familyInfo) {
        setRegistrationError('Please enter family background details.');
        return;
      }
    }
    setRegistrationError('');
    setRegStep(regStep + 1);
  };

  const handlePrevStep = () => {
    setRegistrationError('');
    setRegStep(regStep - 1);
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
            <div className="card-theme-wrapper reg-wizard-card">
              <FloralCorner position="tl" color="var(--gold-accent)" />
              <FloralCorner position="tr" color="var(--gold-accent)" />
              <FloralCorner position="bl" color="var(--gold-accent)" />
              <FloralCorner position="br" color="var(--gold-accent)" />

              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <span className="script-accent" style={{ display: 'block', marginBottom: '4px' }}>Bismillah</span>
                <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--deep-maroon)', fontSize: '32px', marginBottom: '8px' }}>
                  {userProfile ? 'Update Matrimonial Profile' : 'Register Matrimonial Profile'}
                </h2>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                  Step {regStep} of 6 — {
                    regStep === 1 ? 'Personal Information' :
                    regStep === 2 ? 'Location Details' :
                    regStep === 3 ? 'Professional Details' :
                    regStep === 4 ? 'Community & Family Preferences' :
                    regStep === 5 ? 'Family Background & Bio' : 'Consent & Themes'
                  }
                </p>
              </div>

              <div className="step-indicator-bar">
                <div className={`step-dot ${regStep >= 1 ? 'completed' : ''} ${regStep === 1 ? 'active' : ''}`}>1</div>
                <div className={`step-dot ${regStep >= 2 ? 'completed' : ''} ${regStep === 2 ? 'active' : ''}`}>2</div>
                <div className={`step-dot ${regStep >= 3 ? 'completed' : ''} ${regStep === 3 ? 'active' : ''}`}>3</div>
                <div className={`step-dot ${regStep >= 4 ? 'completed' : ''} ${regStep === 4 ? 'active' : ''}`}>4</div>
                <div className={`step-dot ${regStep >= 5 ? 'completed' : ''} ${regStep === 5 ? 'active' : ''}`}>5</div>
                <div className={`step-dot ${regStep >= 6 ? 'completed' : ''} ${regStep === 6 ? 'active' : ''}`}>6</div>
              </div>

              {registrationError && (
                <div style={{ backgroundColor: 'rgba(111, 29, 53, 0.08)', color: 'var(--deep-maroon)', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', border: '1px solid rgba(111,29,53,0.15)' }}>
                  ⚠️ {registrationError}
                </div>
              )}

              <form onSubmit={handleRegisterSubmit}>
                {regStep === 1 && (
                  <div>
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Enter legal full name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Gender *</label>
                      <select
                        className="form-control"
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Date of Birth (Eligible adults &gt;= 18) *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Marital Status *</label>
                      <select
                        className="form-control"
                        value={formData.maritalStatus}
                        onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                      >
                        <option value="Divorced">Divorced</option>
                        <option value="Single">Single</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number (Call Verification Required) *</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        placeholder="e.g. +91 9876543210"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">About Me (Bio) *</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Describe your values, hobbies, and outlook on marriage..."
                        required
                      />
                    </div>
                  </div>
                )}

                {regStep === 2 && (
                  <div>
                    <SearchableCombobox
                      label="State / UT *"
                      placeholder="Select or search state (e.g. Maharashtra)"
                      value={formData.state}
                      onChange={(val) => {
                        setFormData({
                          ...formData,
                          state: val,
                          district: '',
                          city: '',
                          locality: '',
                          areaOrLocality: ''
                        });
                      }}
                      options={Array.from(new Set(masterLocations.map(l => l.state))).map(st => ({
                        value: st,
                        label: st,
                        isHighPriority: st === 'Maharashtra' || st === 'Uttar Pradesh' || st === 'Delhi' || st === 'Jammu & Kashmir'
                      }))}
                      required
                    />

                    <SearchableCombobox
                      label="District / City *"
                      placeholder="Select or search district/city"
                      value={formData.district}
                      onChange={(val) => {
                        setFormData({
                          ...formData,
                          district: val,
                          city: val,
                          locality: '',
                          areaOrLocality: val
                        });
                      }}
                      options={Array.from(new Set(masterLocations.filter(l => l.state === formData.state).map(l => l.district))).map(dst => ({
                        value: dst,
                        label: dst,
                        isHighPriority: dst === 'Mumbai' || dst === 'Srinagar' || dst === 'Hyderabad' || dst === 'Bengaluru' || dst === 'Lucknow'
                      }))}
                      required
                    />

                    <SearchableCombobox
                      label="Locality / Area"
                      placeholder="Select or search locality (optional)"
                      value={formData.locality}
                      onChange={(val) => {
                        setFormData({
                          ...formData,
                          locality: val,
                          areaOrLocality: val || formData.district
                        });
                      }}
                      options={Array.from(new Set(masterLocations.filter(l => l.state === formData.state && l.district === formData.district && l.locality).map(l => l.locality!))).map(loc => ({
                        value: loc,
                        label: loc
                      }))}
                    />

                    <div className="form-group">
                      <label className="form-label">Country *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        placeholder="e.g. India"
                        required
                      />
                    </div>
                  </div>
                )}

                {regStep === 3 && (
                  <div>
                    <div className="form-group">
                      <label className="form-label">Education *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.education}
                        onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                        placeholder="e.g. MBBS, M.Tech, B.Com"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Occupation *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.occupation}
                        onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                        placeholder="e.g. Pediatrician, Software Engineer"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Annual Income Range *</label>
                      <select
                        className="form-control"
                        value={formData.annualIncomeRange}
                        onChange={(e) => setFormData({ ...formData, annualIncomeRange: e.target.value })}
                      >
                        <option value="Under ₹3 LPA">Under ₹3 LPA</option>
                        <option value="₹3 LPA - ₹5 LPA">₹3 LPA - ₹5 LPA</option>
                        <option value="₹5 LPA - ₹10 LPA">₹5 LPA - ₹10 LPA</option>
                        <option value="₹10 LPA - ₹15 LPA">₹10 LPA - ₹15 LPA</option>
                        <option value="₹15 LPA - ₹25 LPA">₹15 LPA - ₹25 LPA</option>
                        <option value="Above ₹25 LPA">Above ₹25 LPA</option>
                      </select>
                    </div>
                  </div>
                )}

                {regStep === 4 && (
                  <div>
                    <div className="form-group-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <SearchableCombobox
                        label="Maslak / Sect"
                        placeholder="Select or search Maslak/Sect"
                        value={formData.maslak}
                        onChange={(val) => setFormData({ ...formData, maslak: val })}
                        options={masterMaslaks.map(m => ({
                          value: m.id,
                          label: m.label,
                          aliases: m.aliases,
                          isDisabled: m.isDisabled,
                          isHighPriority: m.label.includes('Barelvi') || m.label.includes('Deobandi') || m.label === 'Sunni' || m.label === 'Shia'
                        }))}
                      />

                      <div className="form-group">
                        <label className="form-label">Fiqh / School of Thought</label>
                        <select
                          className="form-control"
                          value={formData.fiqh}
                          onChange={(e) => setFormData({ ...formData, fiqh: e.target.value })}
                        >
                          <option value="">-- No preference / Not selected --</option>
                          {DEFAULT_FIQHS.map(f => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-group-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '15px' }}>
                      <SearchableCombobox
                        label="Caste / Biradari"
                        placeholder="Select or search Caste/Biradari"
                        value={formData.biradari}
                        onChange={(val) => setFormData({ ...formData, biradari: val })}
                        options={masterCastes.map(c => ({
                          value: c.id,
                          label: c.label,
                          aliases: c.aliases,
                          isDisabled: c.isDisabled,
                          isHighPriority: c.label === 'Sheikh / Shaikh' || c.label === 'Syed / Sayyid' || c.label === 'Ansari' || c.label === 'Pathan' || c.label === 'Khan'
                        }))}
                      />

                      <div className="form-group">
                        <label className="form-label">Family Origin (Ancestral City/Town)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.familyOrigin}
                          onChange={(e) => setFormData({ ...formData, familyOrigin: e.target.value })}
                          placeholder="e.g. Azamgarh, UP"
                        />
                      </div>
                    </div>

                    <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                      <label className="form-label" style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>Preferred Match Locations</label>
                      <div className="preferred-locations-checkboxes" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px', maxHeight: '160px', overflowY: 'auto', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '8px', backgroundColor: '#fafafa' }}>
                        {[
                          'Jammu & Kashmir', 'Ladakh', 'Lakshadweep', 'Assam', 'West Bengal',
                          'Kerala', 'Uttar Pradesh', 'Bihar', 'Delhi', 'Jharkhand',
                          'Telangana', 'Karnataka', 'Maharashtra', 'Gujarat', 'Rajasthan',
                          'Uttarakhand', 'Haryana', 'Madhya Pradesh'
                        ].sort((a, b) => a.localeCompare(b)).map(stateName => {
                          const isChecked = formData.preferredLocations.includes(stateName);
                          return (
                            <label key={stateName} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  const newLocs = isChecked
                                    ? formData.preferredLocations.filter(l => l !== stateName)
                                    : [...formData.preferredLocations, stateName];
                                  setFormData({ ...formData, preferredLocations: newLocs });
                                }}
                              />
                              {stateName}
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={formData.sameCastePreference}
                          onChange={(e) => setFormData({ ...formData, sameCastePreference: e.target.checked })}
                        />
                        <span>Prefer matchmaking within the same Caste/Biradari</span>
                      </label>

                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={formData.sameMaslakPreference}
                          onChange={(e) => setFormData({ ...formData, sameMaslakPreference: e.target.checked })}
                        />
                        <span>Prefer matchmaking within the same Maslak/Sect</span>
                      </label>

                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={formData.willingToRelocate}
                          onChange={(e) => setFormData({ ...formData, willingToRelocate: e.target.checked })}
                        />
                        <span>Open / willing to relocate to other regions or states</span>
                      </label>
                    </div>
                  </div>
                )}

                {regStep === 5 && (
                  <div>
                    <div className="form-group">
                      <label className="form-label">Family Details (Parents, Siblings background) *</label>
                      <textarea
                        className="form-control"
                        rows={4}
                        value={formData.familyInfo}
                        onChange={(e) => setFormData({ ...formData, familyInfo: e.target.value })}
                        placeholder="Provide family background, parents occupation, number of siblings etc..."
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Partner Preferences Summary</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={formData.partnerPref}
                        onChange={(e) => setFormData({ ...formData, partnerPref: e.target.value })}
                        placeholder="Preferred age, education, and religiosity..."
                      />
                    </div>
                  </div>
                )}

                {regStep === 6 && (
                  <div>
                    <div className="form-group">
                      <label className="form-label">Assigned Profile Theme *</label>
                      <select
                        className="form-control"
                        value={formData.themeColor}
                        onChange={(e) => setFormData({ ...formData, themeColor: e.target.value })}
                      >
                        {THEME_COLORS.map((tc) => (
                          <option key={tc.value} value={tc.value}>
                            {tc.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group" style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', margin: '20px 0' }}>
                      <input
                        type="checkbox"
                        style={{ marginTop: '4px' }}
                        checked={formData.consent}
                        onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                        required
                      />
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        I consent to manual phone verification call from Rishte Forever Admin team to confirm these profile details.
                      </span>
                    </div>

                    <div className="form-group" style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', margin: '20px 0' }}>
                      <input
                        type="checkbox"
                        style={{ marginTop: '4px' }}
                        checked={formData.terms}
                        onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                        required
                      />
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        I accept the Rishte Forever Terms of Service and Shariah-compliant match guidelines.
                      </span>
                    </div>
                  </div>
                )}

                {regStep === 6 && (
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '15px' }}>
                    <input
                      type="checkbox"
                      style={{ marginTop: '4px' }}
                      checked={formData.termsAccepted}
                      onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                    />
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      I agree to the <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-brand)', textDecoration: 'underline' }}>Terms &amp; Conditions</a> and <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-brand)', textDecoration: 'underline' }}>Privacy Policy</a>.
                    </span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                  {regStep > 1 && (
                    <button type="button" onClick={handlePrevStep} className="btn btn-secondary">
                      Back
                    </button>
                  )}
                  {regStep < 6 ? (
                    <button type="button" onClick={handleNextStep} className="btn btn-primary" style={{ marginLeft: 'auto' }}>
                      Next Step
                    </button>
                  ) : (
                    <button type="submit" className="btn btn-gold" style={{ marginLeft: 'auto' }}>
                      Save Profile
                    </button>
                  )}
                </div>

              </form>
            </div>
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
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--deep-maroon)', fontWeight: 'bold', marginBottom: '18px' }}>
                  Quick Match Search
                </h3>
                <div className="search-panel-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) 160px', gap: '20px', alignItems: 'flex-end' }}>
                  <div>
                    <label className="form-label">Looking For</label>
                    <select className="form-control" style={{ backgroundColor: 'var(--warm-ivory)' }}>
                      <option>Bride (Female)</option>
                      <option>Groom (Male)</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Age Range</label>
                    <select className="form-control" style={{ backgroundColor: 'var(--warm-ivory)' }}>
                      <option>18 - 25 Yrs</option>
                      <option>26 - 32 Yrs</option>
                      <option>33 - 40 Yrs</option>
                      <option>40+ Yrs</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">STATE / CITY LOCATION</label>
                    <select 
                      className="form-control" 
                      style={{ backgroundColor: 'var(--warm-ivory)' }}
                      value={quickLocation}
                      onChange={(e) => setQuickLocation(e.target.value)}
                    >
                      {QUICK_MATCH_LOCATIONS.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Caste / Community</label>
                    <select className="form-control" style={{ backgroundColor: 'var(--warm-ivory)' }}>
                      <option>All Communities</option>
                      <option>Hanafi</option>
                      <option>Sheikh</option>
                      <option>Sunni</option>
                      <option>Syed</option>
                    </select>
                  </div>
                  <button onClick={() => router.push(`/search?location=${encodeURIComponent(quickLocation)}`)} className="btn btn-primary" style={{ width: '100%' }}>
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

                {profiles.length > 0 ? (
                  <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                    {profiles.slice(0, 6).map((profile, index) => (
                      <ProfileCard
                        key={profile.id}
                        profile={profile}
                        index={index}
                        isLoggedIn={isLoggedIn}
                        hasPaid300={hasPaid300}
                        simulatedPackages={simulatedPackages}
                        simulatedHighProfileApproved={simulatedHighProfileApproved}
                        savedProfiles={savedProfiles}
                        onToggleSave={toggleSaveProfile}
                        onViewDetails={setSelectedProfileForDetails}
                        onShowLogin={() => setShowLoginModal(true)}
                        getProfileImage={getProfileImage}
                        getThemeClass={getThemeClass}
                      />
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '48px 20px', backgroundColor: 'var(--white)', borderRadius: '12px', border: '1px dashed var(--gold-accent)' }}>
                    <div style={{ fontSize: '32px', marginBottom: '12px', color: 'var(--gold-accent)' }}>📭</div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--primary-brand)', marginBottom: '8px' }}>No Featured Candidates</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
                      No featured candidates available right now. Please explore all profiles or check again soon.
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
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600&h=450"
                        alt="Verified Muslim profiles and matchmaking safety - Rishte Forever"
                        fill
                        sizes="(max-width: 768px) 100vw, 500px"
                        style={{ objectFit: 'cover' }}
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
                  </div>
                </div>
              </div>
            </section>

            {/* Success Stories Preview */}
            <section style={{ backgroundColor: 'var(--warm-ivory)', padding: '80px 0' }}>
              <div className="container">
                <SectionHeading
                  title="Blessed Success Stories"
                  subtitle="Alhamdulillah! Here are matching stories of couples who found their partners on Rishte Forever."
                  scriptText="Success Stories"
                />

                <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
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

                <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px' }}>
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
            <FloralCorner position="tl" color="var(--gold-accent)" />
            <FloralCorner position="tr" color="var(--gold-accent)" />
            <FloralCorner position="bl" color="var(--gold-accent)" />
            <FloralCorner position="br" color="var(--gold-accent)" />

            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--deep-maroon)', marginBottom: '12px', fontWeight: 'bold' }}>
                Join Rishte Forever
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.5' }}>
                Create a profile or log in securely using your Google account to get verified.
              </p>

              <button
                onClick={handleGoogleLogin}
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
    </>
  );
}
