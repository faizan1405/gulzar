'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { AdminPageHeader, AdminCard, AdminButton } from '../../../components/AdminUI';

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
      <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
        <div style={{ fontSize: '16px', fontWeight: 500, color: '#334155' }}>Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="font-sans">
      <AdminPageHeader
        title="Website & Admin Settings"
        subtitle="Configure notification preferences, contact details, social media links, and website metadata."
      />

      {message && (
        <div style={{
          padding: '12px 16px',
          marginBottom: '24px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 500,
          backgroundColor: messageType === 'success' ? '#f0fdf4' : '#fef2f2',
          color: messageType === 'success' ? '#166534' : '#991b1b',
          border: `1px solid ${messageType === 'success' ? '#bbf7d0' : '#fecaca'}`,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>{messageType === 'success' ? '✅' : '⚠️'}</span> {message}
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Notification Contact Details */}
        <AdminCard>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '20px' }}>
            Notification & Contact Details
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <label className="admin-label">Admin Email Address</label>
              <input
                type="email"
                className="admin-input"
                value={settings.adminEmail}
                onChange={e => setSettings({ ...settings, adminEmail: e.target.value })}
                placeholder="admin@rishteforever.in"
                style={{ width: '100%' }}
              />
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>Receive new profile alerts and system notifications here.</p>
            </div>
            <div>
              <label className="admin-label">Admin Phone Number</label>
              <input
                type="tel"
                className="admin-input"
                value={settings.adminPhone}
                onChange={e => setSettings({ ...settings, adminPhone: e.target.value })}
                placeholder="+919876543210"
                style={{ width: '100%' }}
              />
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>Used for urgent SMS alerts when enabled.</p>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label className="admin-label">Office Address</label>
              <input
                type="text"
                className="admin-input"
                value={settings.officeAddress}
                onChange={e => setSettings({ ...settings, officeAddress: e.target.value })}
                placeholder="Innov8 44 Regal Building, 2nd Floor, Connaught Place, New Delhi - 110001"
                style={{ width: '100%' }}
              />
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>Physical address shown on the contact page and footer.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '32px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#334155', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.emailAlertsEnabled}
                onChange={e => setSettings({ ...settings, emailAlertsEnabled: e.target.checked })}
                style={{ width: '16px', height: '16px', accentColor: 'var(--primary-brand)', cursor: 'pointer' }}
              />
              <span><strong>Enable Email Alerts</strong> — new profiles, verifications</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#334155', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.smsAlertsEnabled}
                onChange={e => setSettings({ ...settings, smsAlertsEnabled: e.target.checked })}
                style={{ width: '16px', height: '16px', accentColor: 'var(--primary-brand)', cursor: 'pointer' }}
              />
              <span><strong>Enable SMS Alerts</strong> — urgent admin notifications</span>
            </label>
          </div>
        </AdminCard>

        {/* Social Media Links */}
        <AdminCard>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '20px' }}>
            Social Media Links
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <label className="admin-label">Facebook URL</label>
              <input
                type="url"
                className="admin-input"
                value={settings.facebookUrl}
                onChange={e => setSettings({ ...settings, facebookUrl: e.target.value })}
                placeholder="https://facebook.com/yourpage"
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label className="admin-label">Instagram URL</label>
              <input
                type="url"
                className="admin-input"
                value={settings.instagramUrl}
                onChange={e => setSettings({ ...settings, instagramUrl: e.target.value })}
                placeholder="https://instagram.com/yourhandle"
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label className="admin-label">YouTube URL</label>
              <input
                type="url"
                className="admin-input"
                value={settings.youtubeUrl}
                onChange={e => setSettings({ ...settings, youtubeUrl: e.target.value })}
                placeholder="https://youtube.com/yourchannel"
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label className="admin-label">LinkedIn URL</label>
              <input
                type="url"
                className="admin-input"
                value={settings.linkedinUrl}
                onChange={e => setSettings({ ...settings, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/company/yourcompany"
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label className="admin-label">X / Twitter URL</label>
              <input
                type="url"
                className="admin-input"
                value={settings.twitterUrl}
                onChange={e => setSettings({ ...settings, twitterUrl: e.target.value })}
                placeholder="https://x.com/yourhandle"
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label className="admin-label">Default Social Preview Image URL</label>
              <input
                type="url"
                className="admin-input"
                value={settings.defaultPreviewImage}
                onChange={e => setSettings({ ...settings, defaultPreviewImage: e.target.value })}
                placeholder="https://rishteforever.in/images/og-default.jpg"
                style={{ width: '100%' }}
              />
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>OG image shown when links are shared on social media.</p>
            </div>
          </div>
        </AdminCard>

        {/* Save Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
          <AdminButton
            type="submit"
            disabled={isSaving}
            style={{ padding: '10px 32px', fontSize: '14px', minWidth: '160px' }}
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </AdminButton>
        </div>
      </form>
    </div>
  );
}
