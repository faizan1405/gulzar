'use client';

import React, { useState, useEffect } from 'react';
import { useSimulator } from '../context/SimulatorContext';

interface PackageInquiryFormProps {
  defaultPackage?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const PackageInquiryForm: React.FC<PackageInquiryFormProps> = ({
  defaultPackage = '₹5,500 Good Profiles Package',
  onSuccess,
  onCancel
}) => {
  const { userProfile, isLoggedIn, getSimulatorHeaders, setReloadTrigger } = useSimulator();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [interestedPackage, setInterestedPackage] = useState(defaultPackage);
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Pre-fill user profile fields if logged in
  useEffect(() => {
    if (isLoggedIn && userProfile) {
      setFullName(userProfile.fullName || '');
      setPhone(userProfile.phoneNumber || '');
      setCity(userProfile.city || '');
      if ((userProfile as any).email) {
        setEmail((userProfile as any).email);
      }
    }
  }, [isLoggedIn, userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    const sourcePage = typeof window !== 'undefined' ? window.location.pathname : '/premium';

    try {
      const headers = getSimulatorHeaders();
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          fullName,
          phone,
          email: email || undefined,
          city,
          message: message || undefined,
          inquiryType: 'Package Inquiry',
          interestedPackage,
          sourcePage
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setSuccessMsg(data.message || 'Alhamdulillah! Package inquiry received.');
      setMessage('');
      setReloadTrigger((prev: number) => prev + 1);

      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="package-inquiry-form font-sans">
      {successMsg ? (
        <div style={{
          textAlign: 'center',
          padding: '30px 15px',
          backgroundColor: 'rgba(248, 241, 231, 0.95)',
          borderRadius: 'var(--border-radius-lg)',
          border: '1.5px solid var(--gold-accent)'
        }}>
          <span style={{ fontSize: '42px', display: 'block', marginBottom: '12px' }}>✨</span>
          <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary-brand)', fontSize: '20px', marginBottom: '8px' }}>
            Inquiry Captured
          </h4>
          <p style={{ color: 'var(--text-dark)', fontSize: '13.5px', lineHeight: '1.6' }}>
            {successMsg} Our matrimonial advisor will contact you to verify details and complete activation steps.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {errorMsg && (
            <div style={{
              backgroundColor: 'rgba(111, 29, 53, 0.08)',
              color: 'var(--deep-maroon)',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '12.5px',
              border: '1px solid rgba(111,29,53,0.15)'
            }}>
              ⚠️ {errorMsg}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="pkgFullName">Full Name *</label>
            <input
              id="pkgFullName"
              type="text"
              className="form-control"
              placeholder="Enter your name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="pkgPhone">Phone Number *</label>
            <input
              id="pkgPhone"
              type="tel"
              className="form-control"
              placeholder="e.g. +91 9999999999"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }} className="grid-mobile-1">
            <div className="form-group">
              <label className="form-label" htmlFor="pkgEmail">Email <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>(Optional)</span></label>
              <input
                id="pkgEmail"
                type="email"
                className="form-control"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="pkgCity">City *</label>
              <input
                id="pkgCity"
                type="text"
                className="form-control"
                placeholder="e.g. Mumbai"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="pkgInterestedPackage">Interested Matchmaking Plan *</label>
            <select
              id="pkgInterestedPackage"
              className="form-control"
              value={interestedPackage}
              onChange={(e) => setInterestedPackage(e.target.value)}
              required
              disabled={isSubmitting}
            >
              <option value="₹300 Monthly Membership">₹300 Monthly Membership</option>
              <option value="₹5,500 Good Profiles Package">₹5,500 Good Profiles Package</option>
              <option value="₹11,000 Second Marriage Package">₹11,000 Second Marriage Package</option>
              <option value="₹21,000 High Profile Package">₹21,000 High Profile Package</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="pkgMessage">Additional Preferences / Notes <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>(Optional)</span></label>
            <textarea
              id="pkgMessage"
              className="form-control"
              rows={3}
              placeholder="Tell us about qualifications, age-range, or maslak preferences you are seeking..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            {onCancel && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel}
                style={{ flex: 1, padding: '10px' }}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="btn btn-gold"
              style={{ flex: 2, padding: '10px' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending Request...' : 'Submit Package Inquiry'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PackageInquiryForm;
