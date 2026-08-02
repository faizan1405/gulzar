'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from '../context/SessionContext';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const { isAdminMobileOpen, setIsAdminMobileOpen } = useSession();
  const [referralRate, setReferralRate] = useState(20);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/admin/settings', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.settings?.referralRate) {
            setReferralRate(data.settings.referralRate);
          }
        }
      } catch {
        // keep default 20 if fetch fails
      }
    }
    loadSettings();
  }, []);

  const handleReferralChange = async (value: number) => {
    setReferralRate(value);
    setSaving(true);
    setSaveMsg('');
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referralRate: value }),
      });
      setSaveMsg('Saved!');
      setTimeout(() => setSaveMsg(''), 1500);
    } catch {
      setSaveMsg('Error saving');
    } finally {
      setSaving(false);
    }
  };

  const handleLinkClick = () => {
    setIsAdminMobileOpen(false);
  };

  return (
    <aside className={`admin-nav-list ${isAdminMobileOpen ? 'open' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', paddingLeft: '12px' }}>
        <Image
          src="/images/rishte-forever-logo.png"
          alt="Rishte Forever"
          width={150}
          height={57}
          style={{ height: '36px', width: 'auto', background: 'var(--white)', padding: '6px 8px', borderRadius: '8px' }}
        />
        <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-accent)', fontSize: '16px', fontWeight: 'bold' }}>Admin</span>
      </div>
      
      <div className="admin-nav-section-title">Operations</div>
      <Link
        href="/admin"
        className={`admin-nav-link ${pathname === '/admin' ? 'active' : ''}`}
        onClick={handleLinkClick}
      >
        📊 Overview
      </Link>
      <Link
        href="/admin/profiles"
        className={`admin-nav-link ${pathname === '/admin/profiles' ? 'active' : ''}`}
        onClick={handleLinkClick}
      >
        🧑‍🤝‍🧑 Profiles
      </Link>
      <Link
        href="/admin/verification"
        className={`admin-nav-link ${pathname === '/admin/verification' ? 'active' : ''}`}
        onClick={handleLinkClick}
      >
        👤 Verification Queue
      </Link>
      <Link
        href="/admin/packages"
        className={`admin-nav-link ${pathname === '/admin/packages' ? 'active' : ''}`}
        onClick={handleLinkClick}
      >
        💎 Premium Packages
      </Link>
      <Link
        href="/admin/leads"
        className={`admin-nav-link ${pathname === '/admin/leads' ? 'active' : ''}`}
        onClick={handleLinkClick}
      >
        📥 Leads & Inquiries
      </Link>
      <Link
        href="/admin/events"
        className={`admin-nav-link ${pathname === '/admin/events' ? 'active' : ''}`}
        onClick={handleLinkClick}
      >
        🎊 Event Management
      </Link>
      <Link
        href="/admin/zaicha"
        className={`admin-nav-link ${pathname === '/admin/zaicha' ? 'active' : ''}`}
        onClick={handleLinkClick}
      >
        🌙 Zaicha Inquiries
      </Link>
      <Link
        href="/admin/master-data"
        className={`admin-nav-link ${pathname === '/admin/master-data' ? 'active' : ''}`}
        onClick={handleLinkClick}
      >
        🛠️ Master Data
      </Link>

      <div className="admin-nav-section-title">Logs & Settings</div>
      <Link
        href="/admin/logs"
        className={`admin-nav-link ${pathname === '/admin/logs' ? 'active' : ''}`}
        onClick={handleLinkClick}
      >
        📜 Activity Logs
      </Link>
      <Link
        href="/admin/settings"
        className={`admin-nav-link ${pathname === '/admin/settings' ? 'active' : ''}`}
        onClick={handleLinkClick}
      >
        ⚙️ Settings
      </Link>

      <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(212,163,89,0.3)', paddingTop: '20px', padding: '0 12px' }}>
        <h4 style={{ color: 'var(--gold-accent)', fontSize: '13px', marginBottom: '8px' }}>Referral Rate Control</h4>
        <input
          type="range"
          min="20"
          max="23"
          value={referralRate}
          onChange={(e) => handleReferralChange(parseInt(e.target.value))}
          disabled={saving}
          style={{ width: '100%', accentColor: 'var(--gold-accent)', opacity: saving ? 0.6 : 1 }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginTop: '6px' }}>
          <span>Commission:</span>
          <strong>{referralRate}%</strong>
        </div>
        {saveMsg && <span style={{ fontSize: '10px', color: '#059669' }}>{saveMsg}</span>}
      </div>
    </aside>
  );
};

export default AdminSidebar;
