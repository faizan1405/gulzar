'use client';

import React, { useState, useEffect } from 'react';
import { useSimulator } from '../context/SimulatorContext';

interface ProfileInterestFormProps {
  profileId: string;
  profileName?: string;
  profileCategory?: string | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ProfileInterestForm: React.FC<ProfileInterestFormProps> = ({
  profileId,
  profileName = 'Protected Profile',
  profileCategory,
  onSuccess,
  onCancel
}) => {
  const { userProfile, isLoggedIn, getSimulatorHeaders, setReloadTrigger } = useSimulator();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [message, setMessage] = useState('');
  const [packageInterest, setPackageInterest] = useState('');
  const [honey, setHoney] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Pre-fill user profile fields
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

  // Set default package interest if profile has a category
  useEffect(() => {
    if (profileCategory === 'good_profile') {
      setPackageInterest('₹5,500 Good Profiles Package');
    } else if (profileCategory === 'second_marriage') {
      setPackageInterest('₹11,000 Silver Plan');
    } else if (profileCategory === 'high_profile') {
      setPackageInterest('₹21,000 Gold Package');
    }
  }, [profileCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    const sourcePage = typeof window !== 'undefined' ? `${window.location.pathname}?id=${profileId}` : `/search?id=${profileId}`;

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
          inquiryType: 'Profile Help',
          interestedPackage: packageInterest || undefined,
          interestedProfileId: profileId,
          sourcePage,
          _honey: honey
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setSuccessMsg(data.message || 'Alhamdulillah! Interest request sent successfully.');
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
    <div className="profile-interest-form font-sans">
      {successMsg ? (
        <div style={{
          textAlign: 'center',
          padding: '24px 12px',
          backgroundColor: 'rgba(248, 241, 231, 0.95)',
          borderRadius: 'var(--border-radius-lg)',
          border: '1.5px solid var(--gold-accent)'
        }}>
          <span style={{ fontSize: '36px', display: 'block', marginBottom: '8px' }}>❤️</span>
          <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary-brand)', fontSize: '18px', marginBottom: '6px' }}>
            Interest Expressed
          </h4>
          <p style={{ color: 'var(--text-dark)', fontSize: '13px', lineHeight: '1.5' }}>
            {successMsg} Our admin team will verify your request and contact you to proceed.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            backgroundColor: 'var(--warm-ivory)',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            fontSize: '13px',
            color: 'var(--text-dark)',
            marginBottom: '8px'
          }}>
            📍 Expressing interest in candidate: <strong>{profileName}</strong>
            <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Note: Contact information and photos will remain secure. Admin will facilitate contact sharing after eligibility verification.
            </span>
          </div>

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

          <div className="form-group" style={{ display: 'none' }}>
            <label htmlFor="_honey">Do not fill this out if you are human:</label>
            <input type="text" id="_honey" name="_honey" value={honey} onChange={(e) => setHoney(e.target.value)} tabIndex={-1} autoComplete="off" />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="interestFullName">Your Full Name *</label>
            <input
              id="interestFullName"
              type="text"
              className="form-control"
              placeholder="Enter your name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="grid-mobile-1">
            <div className="form-group">
              <label className="form-label" htmlFor="interestPhone">Phone Number *</label>
              <input
                id="interestPhone"
                type="tel"
                className="form-control"
                placeholder="e.g. +91 9999999999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="interestCity">Your City *</label>
              <input
                id="interestCity"
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
            <label className="form-label" htmlFor="interestEmail">Email <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>(Optional)</span></label>
            <input
              id="interestEmail"
              type="email"
              className="form-control"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="interestPackage">Are you interested in any Premium Package? <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>(Optional)</span></label>
            <select
              id="interestPackage"
              className="form-control"
              value={packageInterest}
              onChange={(e) => setPackageInterest(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="">-- No Package / Not Interested --</option>
              <option value="₹300 Monthly Membership">₹300 Monthly Membership</option>
              <option value="₹5,500 Good Profiles Package">₹5,500 Good Profiles Package</option>
              <option value="₹11,000 Silver Plan">₹11,000 Silver Plan</option>
              <option value="₹21,000 Gold Package">₹21,000 Gold Package</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="interestMessage">Message to Candidate / Admin <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>(Optional)</span></label>
            <textarea
              id="interestMessage"
              className="form-control"
              rows={2}
              placeholder="Mention your own education/occupation or messages for the family..."
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
                style={{ flex: 1, padding: '8px' }}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="btn btn-gold"
              style={{ flex: 2, padding: '8px' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting Interest...' : 'Express Interest'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfileInterestForm;
