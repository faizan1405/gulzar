'use client';

import React, { useState, useEffect } from 'react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    adminEmail: '',
    adminPhone: '',
    emailAlertsEnabled: true,
    smsAlertsEnabled: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data.settings) {
          setSettings({
            adminEmail: data.settings.adminEmail || '',
            adminPhone: data.settings.adminPhone || '',
            emailAlertsEnabled: data.settings.emailAlertsEnabled,
            smsAlertsEnabled: data.settings.smsAlertsEnabled
          });
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
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
            placeholder="admin@shadimubarak.com"
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
