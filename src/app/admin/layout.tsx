'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSimulator } from '../../context/SimulatorContext';
import AdminSidebar from '../../components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const {
    isAdminMobileOpen,
    setIsAdminMobileOpen,
    setIsAdminMode
  } = useSimulator();

  const handleExitAdmin = () => {
    setIsAdminMode(false);
    router.push('/');
  };

  return (
    <>
      {/* Admin Mobile Bar */}
      <div className="admin-mobile-bar font-sans">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setIsAdminMobileOpen(!isAdminMobileOpen)}
            style={{ background: 'none', border: 'none', color: 'var(--white)', fontSize: '20px', cursor: 'pointer' }}
          >
            ☰
          </button>
          <span style={{ fontWeight: 'bold', fontFamily: 'var(--font-serif)', color: 'var(--gold-accent)', fontSize: '15px' }}>
            Shadi Mubarak Admin
          </span>
        </div>
        <button
          onClick={handleExitAdmin}
          className="btn btn-gold"
          style={{ padding: '6px 12px', fontSize: '11px' }}
        >
          Exit Admin
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {isAdminMobileOpen && (
        <div className="admin-drawer-overlay" onClick={() => setIsAdminMobileOpen(false)} />
      )}

      {/* Main Admin Grid */}
      <div className="admin-grid container font-sans">
        <AdminSidebar />
        <main className="admin-view-area">
          {children}
        </main>
      </div>
    </>
  );
}
