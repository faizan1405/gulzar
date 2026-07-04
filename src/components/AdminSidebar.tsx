'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '../context/AppContext';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const { referralRate, setReferralRate, isAdminMobileOpen, setIsAdminMobileOpen } = useApp();

  const handleLinkClick = () => {
    setIsAdminMobileOpen(false);
  };

  return (
    <aside className={`admin-nav-list ${isAdminMobileOpen ? 'open' : ''}`}>
      <div style={{ padding: '0 12px', marginBottom: '24px' }}>
        <Link href="/admin" onClick={handleLinkClick} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Image
            src="/images/rishte-forever-logo.png"
            alt="Rishte Forever"
            width={120}
            height={45}
            style={{ height: '32px', width: 'auto', background: 'var(--primary-brand)', padding: '4px', borderRadius: '6px' }}
          />
          <span style={{ fontFamily: 'var(--font-serif)', color: '#1e293b', fontSize: '18px', fontWeight: 700 }}>Admin</span>
        </Link>
      </div>
      
      <div className="admin-nav-section-title">Operations</div>
      <Link
        href="/admin"
        className={`admin-nav-link ${pathname === '/admin' ? 'active' : ''}`}
        onClick={handleLinkClick}
      >
        <span>📊</span> Overview
      </Link>
      <Link
        href="/admin/profiles"
        className={`admin-nav-link ${pathname === '/admin/profiles' ? 'active' : ''}`}
        onClick={handleLinkClick}
      >
        <span>🧑‍🤝‍🧑</span> Profiles
      </Link>
      <Link
        href="/admin/verification"
        className={`admin-nav-link ${pathname === '/admin/verification' ? 'active' : ''}`}
        onClick={handleLinkClick}
      >
        <span>👤</span> Verification Queue
      </Link>
      <Link
        href="/admin/packages"
        className={`admin-nav-link ${pathname === '/admin/packages' ? 'active' : ''}`}
        onClick={handleLinkClick}
      >
        <span>💎</span> Premium Packages
      </Link>
      <Link
        href="/admin/leads"
        className={`admin-nav-link ${pathname === '/admin/leads' ? 'active' : ''}`}
        onClick={handleLinkClick}
      >
        <span>📥</span> Leads & Inquiries
      </Link>
      <Link
        href="/admin/events"
        className={`admin-nav-link ${pathname === '/admin/events' ? 'active' : ''}`}
        onClick={handleLinkClick}
      >
        <span>🎊</span> Event Management
      </Link>
      <Link
        href="/admin/zaicha"
        className={`admin-nav-link ${pathname === '/admin/zaicha' ? 'active' : ''}`}
        onClick={handleLinkClick}
      >
        <span>🌙</span> Zaicha Inquiries
      </Link>
      <Link
        href="/admin/master-data"
        className={`admin-nav-link ${pathname === '/admin/master-data' ? 'active' : ''}`}
        onClick={handleLinkClick}
      >
        <span>🛠️</span> Master Data
      </Link>

      <div className="admin-nav-section-title">System</div>
      <Link
        href="/admin/logs"
        className={`admin-nav-link ${pathname === '/admin/logs' ? 'active' : ''}`}
        onClick={handleLinkClick}
      >
        <span>📜</span> Activity Logs
      </Link>
      <Link
        href="/admin/settings"
        className={`admin-nav-link ${pathname === '/admin/settings' ? 'active' : ''}`}
        onClick={handleLinkClick}
      >
        <span>⚙️</span> Settings
      </Link>

      <div style={{ marginTop: 'auto', borderTop: '1px solid #e2e8f0', paddingTop: '24px', paddingBottom: '16px', paddingLeft: '12px', paddingRight: '12px' }}>
        <h4 style={{ color: '#475569', fontSize: '12px', fontWeight: 600, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Referral Control</h4>
        <input
          type="range"
          min="20"
          max="23"
          value={referralRate}
          onChange={(e) => setReferralRate(parseInt(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--primary-brand)' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '8px', color: '#64748b' }}>
          <span>Commission:</span>
          <strong style={{ color: '#1e293b' }}>{referralRate}%</strong>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
