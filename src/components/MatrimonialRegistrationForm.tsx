'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import SearchableCombobox from './SearchableCombobox';
import { DEFAULT_FIQHS } from '../lib/masterData';

import RegistrationFormHeroImage from './RegistrationFormHeroImage';

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
    masterMaslaks,
    masterCastes,
    masterLocations,
  } = useApp();

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
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', gap: '12px' }}>
          {regStep > 1 && (
            <button type="button" onClick={handlePrevStep} className="btn btn-secondary">
              Back
            </button>
          )}
          {onCancel && regStep === 1 && (
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Cancel
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
  );
}
