'use client';

import React, { useState, useEffect } from 'react';
import { useSimulator } from '../../../context/SimulatorContext';

export default function AdminSettingsPage() {
  const { getSimulatorHeaders } = useSimulator();

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

  useEffect(() => {
    fetch('/api/admin/settings', { headers: getSimulatorHeaders() })
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
  // Re-fetch when simulator admin state changes (isAdminMode toggles getSimulatorHeaders ref)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getSimulatorHeaders]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: getSimulatorHeaders(),
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Settings saved successfully!');
      } else {
        setMessage('Error: ' + data.error);
      }
    } catch (err: any) {
      setMessage('Failed to save settings: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8">Loading settings...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Notification Settings</h1>
      
      {message && (
        <div className={`p-4 mb-6 rounded-md ${message.includes('Error') || message.includes('Failed') ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email Address</label>
          <input 
            type="email" 
            value={settings.adminEmail}
            onChange={e => setSettings({...settings, adminEmail: e.target.value})}
            placeholder="admin@rishteforever.in"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
          />
          <p className="text-xs text-gray-500 mt-1">Receive new profile alerts and system notifications here.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Admin Phone Number</label>
          <input 
            type="tel" 
            value={settings.adminPhone}
            onChange={e => setSettings({...settings, adminPhone: e.target.value})}
            placeholder="+919876543210"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
          />
          <p className="text-xs text-gray-500 mt-1">Receive urgent SMS alerts.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Office Address</label>
          <input 
            type="text" 
            value={settings.officeAddress}
            onChange={e => setSettings({...settings, officeAddress: e.target.value})}
            placeholder="Innov8 44 Regal Building, 2nd Floor, Connaught Place, New Delhi - 110001"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
          />
          <p className="text-xs text-gray-500 mt-1">Physical address shown on the contact page and footer.</p>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Social Media & Social Preview Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
              <input 
                type="url" 
                value={settings.facebookUrl}
                onChange={e => setSettings({...settings, facebookUrl: e.target.value})}
                placeholder="https://facebook.com/yourpage"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
              <input 
                type="url" 
                value={settings.instagramUrl}
                onChange={e => setSettings({...settings, instagramUrl: e.target.value})}
                placeholder="https://instagram.com/yourhandle"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
              <input 
                type="url" 
                value={settings.youtubeUrl}
                onChange={e => setSettings({...settings, youtubeUrl: e.target.value})}
                placeholder="https://youtube.com/yourchannel"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
              <input 
                type="url" 
                value={settings.linkedinUrl}
                onChange={e => setSettings({...settings, linkedinUrl: e.target.value})}
                placeholder="https://linkedin.com/company/yourcompany"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">X / Twitter URL</label>
              <input 
                type="url" 
                value={settings.twitterUrl}
                onChange={e => setSettings({...settings, twitterUrl: e.target.value})}
                placeholder="https://x.com/yourhandle"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Social Preview Image URL</label>
              <input 
                type="url" 
                value={settings.defaultPreviewImage}
                onChange={e => setSettings({...settings, defaultPreviewImage: e.target.value})}
                placeholder="https://rishteforever.in/images/og-default.jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
          <input 
            type="checkbox" 
            id="emailAlerts"
            checked={settings.emailAlertsEnabled}
            onChange={e => setSettings({...settings, emailAlertsEnabled: e.target.checked})}
            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
          />
          <label htmlFor="emailAlerts" className="text-sm font-medium text-gray-700">Enable Email Alerts for Admin</label>
        </div>

        <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
          <input 
            type="checkbox" 
            id="smsAlerts"
            checked={settings.smsAlertsEnabled}
            onChange={e => setSettings({...settings, smsAlertsEnabled: e.target.checked})}
            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
          />
          <label htmlFor="smsAlerts" className="text-sm font-medium text-gray-700">Enable SMS Alerts for Admin</label>
        </div>

        <div className="flex justify-end pt-2">
          <button 
            type="submit" 
            disabled={isSaving}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
