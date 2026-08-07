'use client';

import React from 'react';
import { useSession } from '../context/SessionContext';
import SearchableCombobox from './SearchableCombobox';
import { DEFAULT_FIQHS } from '../lib/masterData';

import RegistrationFormHeroImage from './RegistrationFormHeroImage';


export default function MatrimonialRegistrationForm({
  onCancel,
  isModal = false,
}: {
  onCancel?: () => void;
  isModal?: boolean;
}) {
  const {
    userProfile,
    regStep,
    setRegStep,
    registrationError,
    setRegistrationError,
    formData,
    setFormData,
    handleRegisterSubmit,
    masterCastes,
    masterLocations,
    masterMaslaks,
    isSubmittingForm,
  } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingForm) return;
    await handleRegisterSubmit(e);
  };

  const validateStep = (step: number): boolean => {
    setRegistrationError('');
    try {
      if (step === 1) {
        // Core identity — all required
        for (const f of ['fullName', 'dateOfBirth', 'phoneNumber', 'bio']) {
          if (!(formData as Record<string, unknown>)[f]) {
            setRegistrationError('Please fill in all personal details (name, date of birth, phone, and bio).');
            return false;
          }
        }
        const dob = new Date(formData.dateOfBirth);
        if (isNaN(dob.getTime())) {
          setRegistrationError('Please provide a valid date of birth.');
          return false;
        }
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
        if (age < 18) {
          setRegistrationError('Registration is restricted to eligible adults (18 years and older).');
          return false;
        }
      } else if (step === 2) {
        // Location essentials
        if (!formData.state || !formData.city) {
          setRegistrationError('Please fill in your state and city.');
          return false;
        }
      } else if (step === 3) {
        // Professional essentials
        if (!formData.education || !formData.occupation) {
          setRegistrationError('Please provide your education and occupation.');
          return false;
        }
      }
      // Step 4 (community/preferences) is fully optional — no blocking validation
      return true;
    } catch {
      setRegistrationError('An unexpected error occurred. Please try again.');
      return false;
    }
  };

  const handleNextStep = () => {
    if (validateStep(regStep)) {
      setRegStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setRegistrationError('');
    setRegStep((prev) => prev - 1);
  };

  const getStepTitle = () => {
    switch (regStep) {
      case 1: return 'Personal Information';
      case 2: return 'Location';
      case 3: return 'Education & Work';
      case 4: return 'Community & Preferences';
      default: return '';
    }
  };

  return (
    <div
      className={`card-theme-wrapper reg-wizard-card ${isModal ? 'border-0 shadow-none p-0' : ''}`}
      style={isModal ? { padding: 0, boxShadow: 'none', border: 'none', backgroundColor: 'transparent' } : { paddingTop: '16px' }}
    >
      <RegistrationFormHeroImage />

      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <span className="script-accent" style={{ display: 'block', marginBottom: '4px' }}>Bismillah</span>
        <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--deep-maroon)', fontSize: isModal ? '26px' : '32px', marginBottom: '8px', fontWeight: 'bold' }}>
          {userProfile ? 'Update Matrimonial Profile' : 'Register Matrimonial Profile'}
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Step {regStep} of 4 — {getStepTitle()}
        </p>
      </div>

      {/* 4-step progress indicator */}
      <div className="step-indicator-bar">
        <div className={`step-dot ${regStep >= 1 ? 'completed' : ''} ${regStep === 1 ? 'active' : ''}`}>1</div>
        <div className={`step-dot ${regStep >= 2 ? 'completed' : ''} ${regStep === 2 ? 'active' : ''}`}>2</div>
        <div className={`step-dot ${regStep >= 3 ? 'completed' : ''} ${regStep === 3 ? 'active' : ''}`}>3</div>
        <div className={`step-dot ${regStep >= 4 ? 'completed' : ''} ${regStep === 4 ? 'active' : ''}`}>4</div>
      </div>

      <div className="registration-wizard" style={{ maxWidth: '600px', margin: '0 auto', background: 'var(--card-bg)', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>

        {/* Error / success feedback */}
      {registrationError && (
          <div className="error-message" style={{ marginBottom: '20px', padding: '12px 16px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', color: '#991b1b', fontSize: '14px' }}>
            {registrationError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {regStep === 1 && (
            <div>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter your full name"
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
                <label className="form-label">Date of Birth (18+ years) *</label>
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
                  <option value="Single">Single</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  className="form-control"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="+91 9876543210"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">About Me *</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Describe your values, interests, and outlook on marriage..."
                  required
                />
              </div>
            </div>
          )}

          {/* STEP 2 — Location */}
          {regStep === 2 && (
            <div>
              <SearchableCombobox
                label="State / UT *"
                placeholder="Select or search state"
                value={formData.state}
                onChange={(val) => {
                  setFormData({ ...formData, state: val, city: '', district: '', locality: '' });
                }}
                options={Array.from(new Set(masterLocations.map(l => l.state))).map(st => ({
                  value: st, label: st,
                  isHighPriority: st === 'Maharashtra' || st === 'Uttar Pradesh' || st === 'Delhi' || st === 'Jammu & Kashmir'
                }))}
                required
              />

              <SearchableCombobox
                label="District / City *"
                placeholder="Select or search city"
                value={formData.city}
                onChange={(val) => {
                  setFormData({ ...formData, city: val, district: val, locality: '' });
                }}
                options={Array.from(new Set(
                  masterLocations.filter(l => l.state === formData.state).map(l => l.district)
                )).map(dst => ({
                  value: dst, label: dst,
                  isHighPriority: dst === 'Mumbai' || dst === 'Srinagar' || dst === 'Hyderabad' || dst === 'Bengaluru' || dst === 'Lucknow'
                }))}
                required
              />

              <SearchableCombobox
                label="Locality / Area"
                placeholder="Select locality (optional)"
                value={formData.locality}
                onChange={(val) => setFormData({ ...formData, locality: val })}
                options={Array.from(new Set(
                  masterLocations
                    .filter(l => l.state === formData.state && l.district === formData.city && l.locality)
                    .map(l => l.locality!)
                )).map(loc => ({ value: loc, label: loc }))}
              />

              <div className="form-group" style={{ marginTop: '16px' }}>
                <label className="form-label">Country</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="e.g. India"
                />
              </div>
            </div>
          )}

          {/* STEP 3 — Education & Occupation */}
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
                  placeholder="e.g. Doctor, Software Engineer"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Annual Income Range</label>
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

          {/* STEP 4 — Community & Preferences (all optional, no blocking validation) */}
          {regStep === 4 && (
            <div>
              <div className="form-group-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <SearchableCombobox
                  label="Maslak / Sect"
                  placeholder="Select Maslak (optional)"
                  value={formData.maslak}
                  onChange={(val) => setFormData({ ...formData, maslak: val })}
                  options={masterMaslaks.map(m => ({
                    value: m.id, label: m.label, aliases: m.aliases, isDisabled: m.isDisabled,
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
                    <option value="">-- No preference --</option>
                    {DEFAULT_FIQHS.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '16px' }}>
                <SearchableCombobox
                  label="Caste / Biradari"
                  placeholder="Select Caste (optional)"
                  value={formData.biradari}
                  onChange={(val) => setFormData({ ...formData, biradari: val })}
                  options={masterCastes.map(c => ({
                    value: c.id, label: c.label, aliases: c.aliases, isDisabled: c.isDisabled,
                    isHighPriority: c.label === 'Sheikh' || c.label === 'Syed' || c.label === 'Ansari' || c.label === 'Pathan' || c.label === 'Khan'
                  }))}
                />

                <div className="form-group">
                  <label className="form-label">Family Origin</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.familyOrigin}
                    onChange={(e) => setFormData({ ...formData, familyOrigin: e.target.value })}
                    placeholder="e.g. Azamgarh, UP"
                  />
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <label className="form-label" style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>Preferred Match Locations</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '6px', maxHeight: '150px', overflowY: 'auto', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '8px', backgroundColor: '#fafafa' }}>
                  {['Jammu & Kashmir','Ladakh','Lakshadweep','Assam','West Bengal','Kerala','Uttar Pradesh','Bihar','Delhi','Jharkhand','Telangana','Karnataka','Maharashtra','Gujarat','Rajasthan','Uttarakhand','Haryana','Madhya Pradesh']
                    .sort((a, b) => a.localeCompare(b))
                    .map(stateName => {
                      const checked = formData.preferredLocations.includes(stateName);
                      return (
                        <label key={stateName} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              const newLocs = checked
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
                  <input type="checkbox" checked={formData.sameCastePreference} onChange={(e) => setFormData({ ...formData, sameCastePreference: e.target.checked })} />
                  <span>Prefer same Caste/Biradari</span>
                </label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.sameMaslakPreference} onChange={(e) => setFormData({ ...formData, sameMaslakPreference: e.target.checked })} />
                  <span>Prefer same Maslak/Sect</span>
                </label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.willingToRelocate} onChange={(e) => setFormData({ ...formData, willingToRelocate: e.target.checked })} />
                  <span>Open to relocating</span>
                </label>
              </div>
            </div>
          )}

          {/* Consent checkboxes (shown on final step) */}
          {regStep === 4 && (
            <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ display: 'inline-flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                <input type="checkbox" style={{ marginTop: '2px' }} checked={formData.consent} onChange={(e) => setFormData({ ...formData, consent: e.target.checked })} required />
                <span>I consent to a manual phone verification call from the Rishte Forever team to confirm these details.</span>
              </label>
              <label style={{ display: 'inline-flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                <input type="checkbox" style={{ marginTop: '2px' }} checked={formData.terms} onChange={(e) => setFormData({ ...formData, terms: e.target.checked })} required />
                <span>I accept the Rishte Forever Terms of Service and matchmaking guidelines.</span>
              </label>
              <label style={{ display: 'inline-flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                <input type="checkbox" style={{ marginTop: '2px' }} checked={formData.termsAccepted} onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })} required />
                <span>I agree to the <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-brand)', textDecoration: 'underline' }}>Terms &amp; Conditions</a> and <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-brand)', textDecoration: 'underline' }}>Privacy Policy</a>.</span>
              </label>
            </div>
          )}

          {/* Navigation buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', gap: '12px' }}>
            {regStep > 1 && (
              <button type="button" onClick={handlePrevStep} className="btn btn-secondary" disabled={isSubmittingForm}>
                Back
              </button>
            )}
            {onCancel && regStep === 1 && (
              <button type="button" onClick={onCancel} className="btn btn-secondary">
                Cancel
              </button>
            )}
            {regStep < 4 ? (
              <button type="button" onClick={handleNextStep} className="btn btn-primary" style={{ marginLeft: 'auto' }}>
                Next Step
              </button>
            ) : (
              <button type="submit" className="btn btn-gold" style={{ marginLeft: 'auto' }} disabled={isSubmittingForm}>
                {isSubmittingForm ? 'Saving...' : 'Save Profile'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
