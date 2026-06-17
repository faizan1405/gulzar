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
  const [honey, setHoney] = useState('');

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
          sourcePage,
          _honey: honey
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
          <p style={{ color: 'var(--text-dark)', fontSize: '13.5px', lineHeight: '1.6', marginBottom: '16px' }}>
            {successMsg} Our matrimonial advisor will contact you to verify details and complete activation steps.
          </p>
          <div style={{ marginTop: '16px' }}>
            <a
              href={`https://wa.me/919557006617?text=${encodeURIComponent(`Assalamu Alaikum, I have submitted an inquiry for the ${interestedPackage} on Shadi Mubarak. Name: ${fullName}, Phone: ${phone}. Please guide me.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{
                backgroundColor: '#25D366',
                color: '#ffffff',
                border: 'none',
                fontSize: '13px',
                fontWeight: 'bold',
                padding: '8px 20px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                textDecoration: 'none',
                borderRadius: '8px',
                transition: 'var(--transition-smooth)'
              }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12.012 2c-5.506 0-9.97 4.478-9.97 10.012 0 1.77.458 3.43 1.258 4.887L2 22l5.253-1.378c1.402.766 3 1.2 4.759 1.2 5.506 0 9.97-4.478 9.97-10.012 0-5.534-4.464-10.012-9.97-10.012zm5.795 13.91c-.244.694-1.22 1.268-1.745 1.355-.472.079-.938.293-3.04-.542-2.527-.998-4.14-3.565-4.267-3.731-.127-.166-.991-1.32-.991-2.518 0-1.2.626-1.79.847-2.029.221-.24.479-.3.639-.3a.46.46 0 0 1 .332.155c.105.155.434 1.058.471 1.139.037.081.062.176.009.282-.053.106-.079.171-.157.262-.078.09-.166.2-.236.269-.079.078-.162.162-.07.32.092.158.411.678.88 1.096.604.538 1.111.704 1.267.782.157.078.249.066.342-.04.093-.106.402-.469.511-.627.109-.158.217-.132.366-.077.148.055.942.443 1.103.524.161.081.268.121.308.19.04.069.04.4-.204 1.094z" />
              </svg>
              Continue on WhatsApp
            </a>
          </div>
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

          <div className="form-group" style={{ display: 'none' }}>
            <label htmlFor="_honey">Do not fill this out if you are human:</label>
            <input type="text" id="_honey" name="_honey" value={honey} onChange={(e) => setHoney(e.target.value)} tabIndex={-1} autoComplete="off" />
          </div>

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
