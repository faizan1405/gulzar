'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useSimulator } from '../context/SimulatorContext';
import { getProfileImage, getThemeClass } from '../lib/helpers';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import SearchableCombobox from '../components/SearchableCombobox';
import { DEFAULT_FIQHS } from '../lib/masterData';

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
  PremiumPlanCard,
  ZaichaPromoCard
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
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
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
    handleViewProfile,
    userProfile,
    isLoading,
    masterMaslaks,
    masterCastes,
    masterLocations,
  } = useSimulator();

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
                          hasPaid300={hasPaid300}
                          simulatedPackages={simulatedPackages}
                          simulatedHighProfileApproved={simulatedHighProfileApproved}
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
                    price={300}
                    gstRate={0.18}
                    billingText="monthly"
                    features={['Browse normal verified profiles', 'Unblur matrimonial photos', 'Access candidate mobile numbers']}
                    isActive={hasPaid300}
                    ctaText="Buy Monthly Membership"
                    onActivate={() => handleRazorpayCheckout('monthly_membership', 300, 'Standard Monthly Membership')}
                    onInquire={() => setInquiryPackage('₹300 Monthly Membership')}
                    whatsappMessage="Assalamu Alaikum, I want to know more about the ₹300 monthly membership on Rishte Forever."
                    imageUrl="/images/monthly_active.png"
                    hidePrices={!isFormComplete}
                    isLoggedIn={isLoggedIn}
                    onCompleteForm={handleCompleteForm}
                    onShowLogin={() => setShowLoginModal(true)}
                  />
                  <PremiumPlanCard
                    title="Good Profile Package"
                    price={5500}
                    gstRate={0.18}
                    billingText="one-time base"
                    features={['Verified profile suggestions', 'Basic matchmaking support', 'Privacy-safe profile sharing', '1 year service validity']}
                    isActive={simulatedPackages.includes('good_profile_package')}
                    ctaText="Buy Good Profile Package"
                    onActivate={() => handleRazorpayCheckout('good_profile_package', 5500, 'Good Profile Package')}
                    onInquire={() => setInquiryPackage('₹5,500 Good Profiles Package')}
                    whatsappMessage="Assalamu Alaikum, I am interested in the ₹5,500 Good Profiles Package on Rishte Forever. Please guide me."
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
                    price={11000}
                    gstRate={0.18}
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
                    isActive={simulatedPackages.includes('second_marriage_package')}
                    ctaText="Buy Silver Plan"
                    onActivate={() => handleRazorpayCheckout('second_marriage_package', 11000, 'Silver Plan')}
                    onInquire={() => setInquiryPackage('₹11,000 Silver Plan')}
                    whatsappMessage="Assalamu Alaikum, I am interested in the ₹11,000 Silver Plan on Rishte Forever. Please guide me."
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
                    price={21000}
                    gstRate={0.18}
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
                    isActive={simulatedPackages.includes('high_profile_package')}
                    ctaText="Buy Gold Package"
                    onActivate={() => handleRazorpayCheckout('high_profile_package', 21000, 'Gold Package')}
                    onInquire={() => setInquiryPackage('₹21,000 Gold Package')}
                    whatsappMessage="Assalamu Alaikum, I am interested in the ₹21,000 Gold Package on Rishte Forever. Please guide me."
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

              {isDemoMode && (
                <>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      margin: '16px 0',
                      color: 'var(--text-muted)',
                      fontSize: '12px',
                    }}
                  >
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
                    <span>or demo access</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
                  </div>
                  <button
                    onClick={handleGoogleLogin}
                    className="btn btn-gold"
                    style={{ width: '100%', fontWeight: 600 }}
                  >
                    🎭 Continue as Demo User
                  </button>
                </>
              )}

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
