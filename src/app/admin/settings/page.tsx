'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';

export default function AdminSettingsPage() {
  const { } = useApp();

  const [settings, setSettings] = useState({
    adminEmail: '',
    adminPhone: '',
    emailAlertsEnabled: true,
    smsAlertsEnabled: false,
    officeAddress: '',
    facebookUrl: '',
    instagramUrl: '',
    youtubeUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
    defaultPreviewImage: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    fetch('/api/admin/settings', { headers: { 'Content-Type': 'application/json' } })
      .then(res => res.json())
      .then(data => {
        if (data.settings) {
          setSettings({
            adminEmail: data.settings.adminEmail || '',
            adminPhone: data.settings.adminPhone || '',
            emailAlertsEnabled: data.settings.emailAlertsEnabled,
            smsAlertsEnabled: data.settings.smsAlertsEnabled,
            officeAddress: data.settings.officeAddress || '',
            facebookUrl: data.settings.facebookUrl || '',
            instagramUrl: data.settings.instagramUrl || '',
            youtubeUrl: data.settings.youtubeUrl || '',
            linkedinUrl: data.settings.linkedinUrl || '',
            twitterUrl: data.settings.twitterUrl || '',
            defaultPreviewImage: data.settings.defaultPreviewImage || ''
          });
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  // Re-fetch when simulator admin state changes (isAdminMode toggles ref)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Settings saved successfully!');
        setMessageType('success');
      } else {
        setMessage('Error: ' + data.error);
        setMessageType('error');
      }
    } catch (err: any) {
      setMessage('Failed to save settings: ' + err.message);
      setMessageType('error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
        Loading settings...
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '9px 13px',
    border: '1.5px solid var(--border-color)',
    borderRadius: '8px',
    fontSize: '14px',
    color: 'var(--text-dark)',
    background: 'var(--white)',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '12.5px',
    fontWeight: 'bold',
    color: 'var(--deep-maroon)',
    marginBottom: '6px',
  };

  const hintStyle: React.CSSProperties = {
    fontSize: '11.5px',
    color: 'var(--text-muted)',
    marginTop: '4px',
  };

  const sectionStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  };

  return (
    <div style={{ paddingBottom: '60px' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-dark)', marginBottom: '8px' }}>
        ⚙️ Website & Admin Settings
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', marginBottom: '32px' }}>
        Configure notification preferences, contact details, social media links, and website metadata.
      </p>

      {message && (
        <div style={{
          padding: '12px 18px',
          marginBottom: '24px',
          borderRadius: '8px',
          fontSize: '13.5px',
          fontWeight: '500',
          backgroundColor: messageType === 'success' ? 'rgba(18, 46, 34, 0.08)' : 'rgba(220, 53, 69, 0.08)',
          color: messageType === 'success' ? '#155724' : '#dc3545',
          border: `1px solid ${messageType === 'success' ? 'rgba(18, 46, 34, 0.2)' : 'rgba(220, 53, 69, 0.2)'}`,
        }}>
          {messageType === 'success' ? '✅' : '⚠️'} {message}
        </div>
      )}

      <form onSubmit={handleSave} style={sectionStyle}>

        {/* Notification Contact Details */}
        <div className="card-theme-wrapper">
          <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-dark)', marginBottom: '20px' }}>
            Notification & Contact Details
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="grid-mobile-1">
            <div>
              <label style={labelStyle}>Admin Email Address</label>
              <input
                type="email"
                style={inputStyle}
                value={settings.adminEmail}
                onChange={e => setSettings({ ...settings, adminEmail: e.target.value })}
                placeholder="admin@rishteforever.in"
              />
              <p style={hintStyle}>Receive new profile alerts and system notifications here.</p>
            </div>
            <div>
              <label style={labelStyle}>Admin Phone Number</label>
              <input
                type="tel"
                style={inputStyle}
                value={settings.adminPhone}
                onChange={e => setSettings({ ...settings, adminPhone: e.target.value })}
                placeholder="+919876543210"
              />
              <p style={hintStyle}>Used for urgent SMS alerts when enabled.</p>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Office Address</label>
              <input
                type="text"
                style={inputStyle}
                value={settings.officeAddress}
                onChange={e => setSettings({ ...settings, officeAddress: e.target.value })}
                placeholder="Innov8 44 Regal Building, 2nd Floor, Connaught Place, New Delhi - 110001"
              />
              <p style={hintStyle}>Physical address shown on the contact page and footer.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '32px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'var(--text-dark)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.emailAlertsEnabled}
                onChange={e => setSettings({ ...settings, emailAlertsEnabled: e.target.checked })}
                style={{ width: '16px', height: '16px', accentColor: 'var(--gold-accent)', cursor: 'pointer' }}
              />
              <span><strong>Enable Email Alerts</strong> — new profiles, verifications</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'var(--text-dark)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.smsAlertsEnabled}
                onChange={e => setSettings({ ...settings, smsAlertsEnabled: e.target.checked })}
                style={{ width: '16px', height: '16px', accentColor: 'var(--gold-accent)', cursor: 'pointer' }}
              />
              <span><strong>Enable SMS Alerts</strong> — urgent admin notifications</span>
            </label>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="card-theme-wrapper">
          <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-dark)', marginBottom: '20px' }}>
            Social Media Links
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="grid-mobile-1">
            <div>
              <label style={labelStyle}>Facebook URL</label>
              <input
                type="url"
                style={inputStyle}
                value={settings.facebookUrl}
                onChange={e => setSettings({ ...settings, facebookUrl: e.target.value })}
                placeholder="https://facebook.com/yourpage"
              />
            </div>
            <div>
              <label style={labelStyle}>Instagram URL</label>
              <input
                type="url"
                style={inputStyle}
                value={settings.instagramUrl}
                onChange={e => setSettings({ ...settings, instagramUrl: e.target.value })}
                placeholder="https://instagram.com/yourhandle"
              />
            </div>
            <div>
              <label style={labelStyle}>YouTube URL</label>
              <input
                type="url"
                style={inputStyle}
                value={settings.youtubeUrl}
                onChange={e => setSettings({ ...settings, youtubeUrl: e.target.value })}
                placeholder="https://youtube.com/yourchannel"
              />
            </div>
            <div>
              <label style={labelStyle}>LinkedIn URL</label>
              <input
                type="url"
                style={inputStyle}
                value={settings.linkedinUrl}
                onChange={e => setSettings({ ...settings, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/company/yourcompany"
              />
            </div>
            <div>
              <label style={labelStyle}>X / Twitter URL</label>
              <input
                type="url"
                style={inputStyle}
                value={settings.twitterUrl}
                onChange={e => setSettings({ ...settings, twitterUrl: e.target.value })}
                placeholder="https://x.com/yourhandle"
              />
            </div>
            <div>
              <label style={labelStyle}>Default Social Preview Image URL</label>
              <input
                type="url"
                style={inputStyle}
                value={settings.defaultPreviewImage}
                onChange={e => setSettings({ ...settings, defaultPreviewImage: e.target.value })}
                placeholder="https://rishteforever.in/images/og-default.jpg"
              />
              <p style={hintStyle}>OG image shown when links are shared on social media.</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={isSaving}
            className="btn btn-gold"
            style={{ padding: '12px 32px', fontSize: '14.5px', opacity: isSaving ? 0.7 : 1, cursor: isSaving ? 'wait' : 'pointer' }}
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
