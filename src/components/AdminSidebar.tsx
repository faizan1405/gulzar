'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from '../context/SessionContext';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const { isAdminMobileOpen, setIsAdminMobileOpen } = useSession();

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
    </aside>
  );
};

export default AdminSidebar;
