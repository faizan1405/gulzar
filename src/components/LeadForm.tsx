'use client';

import React, { useState, useEffect } from 'react';
import { useSimulator } from '../context/SimulatorContext';

interface LeadFormProps {
  defaultInquiryType?: string;
  onSuccess?: () => void;
}

export const LeadForm: React.FC<LeadFormProps> = ({
  defaultInquiryType = 'General Inquiry',
  onSuccess
}) => {
  const { userProfile, isLoggedIn, getSimulatorHeaders, setReloadTrigger } = useSimulator();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [inquiryType, setInquiryType] = useState(defaultInquiryType);
  const [message, setMessage] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [honey, setHoney] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Pre-fill logged-in user profile details
  useEffect(() => {
    if (isLoggedIn && userProfile) {
      setFullName(userProfile.fullName || '');
      setPhone(userProfile.phoneNumber || '');
      setCity(userProfile.city || '');
      // Email is on the NextAuth user session or profile, let's check if available
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

    // Construct request body
    const sourcePage = typeof window !== 'undefined' ? window.location.pathname : '/contact';
    
    // If it's a callback request, append preferred time to the message
    let finalMessage = message;
    if (inquiryType === 'Callback Request' && preferredTime) {
      finalMessage = `[Preferred Callback Time: ${preferredTime}] ${message}`.trim();
    }

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
          message: finalMessage || undefined,
          inquiryType,
          sourcePage,
          _honey: honey
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setSuccessMsg(data.message || 'Alhamdulillah! Inquiry submitted successfully.');
      
      // Reset non-prefilled fields
      setMessage('');
      setPreferredTime('');
      
      // Trigger context refresh if any admin dashboard needs to reload the new lead
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
    <div className="lead-form-container font-sans" style={{ position: 'relative' }}>
      {successMsg ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          backgroundColor: 'rgba(248, 241, 231, 0.9)',
          borderRadius: 'var(--border-radius-lg)',
          border: '1.5px solid var(--gold-accent)',
          boxShadow: 'var(--shadow-premium)'
        }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>🕊️</span>
          <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary-brand)', fontSize: '22px', marginBottom: '10px' }}>
            Submission Successful
          </h3>
          <p style={{ color: 'var(--text-dark)', fontSize: '14.5px', maxWidth: '380px', margin: '0 auto', lineHeight: '1.6', marginBottom: '20px' }}>
            {successMsg}
          </p>
          <div style={{ marginTop: '20px' }}>
            <a
              href={`https://wa.me/919675483125?text=${encodeURIComponent(`Assalamu Alaikum, I have submitted an inquiry on Shadi Mubarak. Name: ${fullName}, Phone: ${phone}, Type: ${inquiryType}. Please guide me.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{
                backgroundColor: '#25D366',
                color: '#ffffff',
                border: 'none',
                fontSize: '13.5px',
                fontWeight: 'bold',
                padding: '10px 24px',
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
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {errorMsg && (
            <div style={{
              backgroundColor: 'rgba(111, 29, 53, 0.08)',
              color: 'var(--deep-maroon)',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '13px',
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
            <label className="form-label" htmlFor="fullName">Full Name <span style={{ color: 'var(--deep-maroon)' }}>*</span></label>
            <input
              id="fullName"
              type="text"
              className="form-control"
              placeholder="Enter your name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="grid-mobile-1">
            <div className="form-group">
              <label className="form-label" htmlFor="phone">Phone Number <span style={{ color: 'var(--deep-maroon)' }}>*</span></label>
              <input
                id="phone"
                type="tel"
                className="form-control"
                placeholder="e.g. +91 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>(Optional)</span></label>
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="grid-mobile-1">
            <div className="form-group">
              <label className="form-label" htmlFor="city">City Location <span style={{ color: 'var(--deep-maroon)' }}>*</span></label>
              <input
                id="city"
                type="text"
                className="form-control"
                placeholder="e.g. Mumbai"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="inquiryType">Inquiry Purpose <span style={{ color: 'var(--deep-maroon)' }}>*</span></label>
              <select
                id="inquiryType"
                className="form-control"
                value={inquiryType}
                onChange={(e) => setInquiryType(e.target.value)}
                required
                disabled={isSubmitting}
              >
                <option value="General Inquiry">General Inquiry</option>
                <option value="Package Inquiry">Package Inquiry</option>
                <option value="Profile Help">Profile Help</option>
                <option value="Verification Help">Verification Help</option>
                <option value="Callback Request">Callback Request</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {inquiryType === 'Callback Request' && (
            <div className="form-group">
              <label className="form-label" htmlFor="preferredTime">Preferred Time for Call <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>(Optional)</span></label>
              <input
                id="preferredTime"
                type="text"
                className="form-control"
                placeholder="e.g. 10 AM - 12 PM, Evening, or any specific time"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="message">Message Details <span style={{ color: 'var(--text-muted)' }}>(Optional)</span></label>
            <textarea
              id="message"
              className="form-control"
              rows={4}
              placeholder="Provide context or details about your request..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            className="btn btn-gold"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px'
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-small" style={{
                  display: 'inline-block',
                  width: '14px',
                  height: '14px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }} />
                Submitting Request...
              </>
            ) : (
              'Send Inquiry Request'
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default LeadForm;
