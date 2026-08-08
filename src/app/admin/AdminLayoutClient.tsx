'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from '../../context/SessionContext';
import { AdminSidebar } from '../../components/AdminSidebar';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAdminMobileOpen, setIsAdminMobileOpen } = useSession();

  return (
    <>
      {/* Mobile bar */}
      <div className="admin-mobile-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => setIsAdminMobileOpen(!isAdminMobileOpen)}
            style={{ background: 'none', border: 'none', color: 'inherit', fontSize: 22, cursor: 'pointer', padding: 4 }}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <Image
            src="/images/rishte-forever-logo.png"
            alt="Rishte Forever"
            width={130}
            height={49}
            style={{ height: 28, width: 'auto', background: '#fff', padding: '5px 7px', borderRadius: 7 }}
          />
          <span style={{ fontWeight: 700, fontFamily: 'var(--font-serif,Georgia,serif)', color: 'var(--primary-brand, #6F1D35)', fontSize: 14 }}>
            Admin Panel
          </span>
        </div>
        <button
          onClick={() => router.push('/')}
          style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer', color: '#64748b' }}
        >
          Exit Admin
        </button>
      </div>

      {/* Admin shell */}
      <div className="admin-grid">
        <AdminSidebar />
        <main className="admin-view-area">
          {children}
        </main>
      </div>
    </>
  );
}
