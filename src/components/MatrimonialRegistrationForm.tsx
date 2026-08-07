'use client';

import React from 'react';
import { useSession } from '../context/SessionContext';

export default function MatrimonialRegistrationForm({
  onCancel,
  isModal = false,
}: {
  onCancel?: () => void;
  isModal?: boolean;
}) {
  const {
    userProfile,
    registrationError,
    formData,
    setFormData,
    handleRegisterSubmit,
    isSubmittingForm,
  } = useSession();

  return (
    <div
      className={`card-theme-wrapper reg-wizard-card ${isModal ? 'border-0 shadow-none p-0' : ''}`}
      style={isModal ? { padding: 0, boxShadow: 'none', border: 'none', backgroundColor: 'transparent' } : { paddingTop: '16px' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--deep-maroon)', fontSize: isModal ? '26px' : '32px', marginBottom: '8px', fontWeight: 'bold' }}>
          {userProfile ? 'Update Matrimonial Profile' : 'Register Matrimonial Profile'}
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Complete the required details below. You can add more information later.
        </p>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', background: 'var(--card-bg)', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>

        {/* Error / success feedback */}
        {registrationError && (
          <div className="error-message" style={{ marginBottom: '20px', padding: '12px 16px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', color: '#991b1b', fontSize: '14px' }}>
            {registrationError}
          </div>
        )}

        <form onSubmit={(e) => void handleRegisterSubmit(e)}>
          {/* Personal Information */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Date of Birth *</label>
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

            {/* Location */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">State *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="e.g. Maharashtra"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">City / District *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Mumbai"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Area / Locality</label>
              <input
                type="text"
                className="form-control"
                value={formData.areaOrLocality}
                onChange={(e) => setFormData({ ...formData, areaOrLocality: e.target.value })}
                placeholder="e.g. Andheri West (optional)"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Country</label>
              <input
                type="text"
                className="form-control"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="e.g. India"
              />
            </div>

            {/* Education & Occupation */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
                  placeholder="e.g. Doctor, Engineer"
                  required
                />
              </div>
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

          {/* Terms acceptance */}
          <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'inline-flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                style={{ marginTop: '2px' }}
                checked={formData.termsAccepted}
                onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                required
              />
              <span>I agree to the <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-brand)', textDecoration: 'underline' }}>Terms &amp; Conditions</a> and <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-brand)', textDecoration: 'underline' }}>Privacy Policy</a>.</span>
            </label>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px', gap: '12px' }}>
            {onCancel && (
              <button type="button" onClick={onCancel} className="btn btn-secondary">
                Cancel
              </button>
            )}
            <button type="submit" className="btn btn-gold" disabled={isSubmittingForm}>
              {isSubmittingForm ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}