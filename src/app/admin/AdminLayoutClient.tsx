'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import AdminSidebar from '../../components/AdminSidebar';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const {
    isAdminMobileOpen,
    setIsAdminMobileOpen
  } = useApp();

  const handleExitAdmin = () => {
    router.push('/');
  };

  return (
    <>
      {/* Admin Mobile Bar */}
      <div className="admin-mobile-bar font-sans">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setIsAdminMobileOpen(!isAdminMobileOpen)}
            style={{ background: 'none', border: 'none', color: '#0f172a', fontSize: '24px', cursor: 'pointer', padding: 0 }}
          >
            ☰
          </button>
          <Image
            src="/images/rishte-forever-logo.png"
            alt="Rishte Forever"
            width={100}
            height={38}
            style={{ height: '28px', width: 'auto', background: 'var(--primary-brand)', padding: '4px', borderRadius: '4px' }}
          />
          <span style={{ fontWeight: 'bold', fontFamily: 'var(--font-serif)', color: '#0f172a', fontSize: '14px' }}>
            Admin
          </span>
        </div>
      </div>

      {/* Mobile drawer overlay */}
      {isAdminMobileOpen && (
        <div className="admin-drawer-overlay" onClick={() => setIsAdminMobileOpen(false)} />
      )}

      {/* Main Admin Grid */}
      <div className="admin-grid font-sans">
        <AdminSidebar />
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
          
          {/* Top Header */}
          <header style={{ 
            height: '60px', 
            backgroundColor: '#ffffff', 
            borderBottom: '1px solid #e2e8f0', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'flex-end',
            padding: '0 40px',
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={handleExitAdmin}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  color: '#475569',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                Exit Admin
              </button>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="admin-view-area">
            {children}
          </main>
          
        </div>
      </div>
    </>
  );
}
