'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from '../context/SessionContext';

interface LeadFormProps {
  defaultInquiryType?: string;
}

export const LeadForm: React.FC<LeadFormProps> = ({
  defaultInquiryType = 'General Inquiry'
}) => {
  const { userProfile, isLoggedIn } = useSession();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [inquiryType, setInquiryType] = useState(defaultInquiryType);
  const [message, setMessage] = useState('');
  const [preferredTime, setPreferredTime] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isLoggedIn && userProfile) {
      setFullName(userProfile.fullName || '');
      setPhone(userProfile.phoneNumber || '');
      setCity(userProfile.city || '');
      if (userProfile.email) {
        setEmail(userProfile.email);
      }
    }
  }, [isLoggedIn, userProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedName = fullName.trim();
    const trimmedPhone = phone.trim();
    const trimmedCity = city.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedPhone || !trimmedCity || !inquiryType) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    let finalMessage = message.trim();
    if (inquiryType === 'Callback Request' && preferredTime.trim()) {
      finalMessage = `[Preferred Callback Time: ${preferredTime.trim()}] ${finalMessage}`.trim();
    }

    const whatsappMessage =
      `👋 Hello Rishte Forever Team,\n\n` +
      `I would like to submit a support request.\n\n` +
      `📌 Contact Details\n` +
      `• Full Name: ${trimmedName}\n` +
      `• Phone Number: ${trimmedPhone}\n` +
      `• Email Address: ${trimmedEmail || 'Not provided'}\n` +
      `• City: ${trimmedCity}\n\n` +
      `📋 Support Details\n` +
      `• Inquiry Purpose: ${inquiryType}\n` +
      `• Message: ${finalMessage || 'Not provided'}\n\n` +
      `Please get in touch with me regarding my request.\n\n` +
      `Thank you!`;

    const whatsappUrl = `https://wa.me/919557006617?text=${encodeURIComponent(whatsappMessage)}`;

    if (typeof window !== 'undefined') {
      window.location.href = whatsappUrl;
    }
  };

  return (
    <div className="lead-form-container font-sans" style={{ position: 'relative' }}>
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
        >
          Send Inquiry Request
        </button>
      </form>
    </div>
  );
};

export default LeadForm;