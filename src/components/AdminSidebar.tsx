'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSimulator } from '../context/SimulatorContext';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const { referralRate, setReferralRate, isAdminMobileOpen, setIsAdminMobileOpen } = useSimulator();

  const handleLinkClick = () => {
    setIsAdminMobileOpen(false);
  };

  return (
    <aside className={`admin-nav-list ${isAdminMobileOpen ? 'open' : ''}`}>
      <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-accent)', marginBottom: '12px', paddingLeft: '12px', fontSize: '20px' }}>
        Shadi Mubarak Admin
      </h2>
      
      <div className="admin-nav-section-title">Operations</div>
      <Link
        href="/admin"
        className={`admin-nav-link ${pathname === '/admin' ? 'active' : ''}`}
        onClick={handleLinkClick}
      >
        📊 Overview
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
          onChange={(e) => setReferralRate(parseInt(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--gold-accent)' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginTop: '6px' }}>
          <span>Commission:</span>
          <strong>{referralRate}%</strong>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
