'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { AdminPageHeader, AdminCard } from './AdminUI';

export const AdminOverview: React.FC = () => {
  const {
    profiles,
    adminRequests,
    adminPurchases,
    adminAssignments,
    auditLogs
  } = useApp();

  const totalProfiles = profiles.length;
  const pendingVerifications = adminRequests.filter((r) => r.status === 'PENDING').length;
  const verifiedProfiles = profiles.filter((p) => p.verificationStatus === 'APPROVED').length;
  const activeMonthlyMembers = adminPurchases.filter((p) => p.packageType === 'monthly_membership' && p.paymentStatus === 'PAID').length;
  const premiumPurchases = adminPurchases.length;
  const curatedMatches = adminPurchases.filter((p) => p.packageType === 'good_profile_package').length;
  const secondMarriage = adminPurchases.filter((p) => p.packageType === 'second_marriage_package').length;
  const highProfile = adminPurchases.filter((p) => p.packageType === 'high_profile_package').length;
  const completedMatches = adminAssignments.filter((a) => a.status === 'MARRIED').length + adminPurchases.filter((p) => p.marriageConfirmation === 'CONFIRMED').length;
  const totalAuditLogs = auditLogs.length;

  return (
    <div>
      <AdminPageHeader 
        title="Dashboard Overview" 
        subtitle="Real-time matrimonial operations, premium subscriptions, and verification statistics." 
      />

      <div className="admin-stats-grid">
        <AdminCard style={{ position: 'relative' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Total Profiles</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--primary-brand)', lineHeight: 1 }}>{totalProfiles}</div>
          <div style={{ position: 'absolute', bottom: '20px', right: '20px', fontSize: '24px', opacity: 0.15, color: '#0f172a' }}>👥</div>
        </AdminCard>

        <AdminCard style={{ position: 'relative' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Pending Verifications</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--primary-brand)', lineHeight: 1 }}>{pendingVerifications}</div>
          <div style={{ position: 'absolute', bottom: '20px', right: '20px', fontSize: '24px', opacity: 0.15, color: '#0f172a' }}>⏳</div>
        </AdminCard>

        <AdminCard style={{ position: 'relative' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Verified Profiles</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--primary-brand)', lineHeight: 1 }}>{verifiedProfiles}</div>
          <div style={{ position: 'absolute', bottom: '20px', right: '20px', fontSize: '24px', opacity: 0.15, color: '#0f172a' }}>✅</div>
        </AdminCard>

        <AdminCard style={{ position: 'relative' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Active Monthly Members</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--primary-brand)', lineHeight: 1 }}>{activeMonthlyMembers}</div>
          <div style={{ position: 'absolute', bottom: '20px', right: '20px', fontSize: '24px', opacity: 0.15, color: '#0f172a' }}>📅</div>
        </AdminCard>

        <AdminCard style={{ position: 'relative' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Premium Purchases</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--primary-brand)', lineHeight: 1 }}>{premiumPurchases}</div>
          <div style={{ position: 'absolute', bottom: '20px', right: '20px', fontSize: '24px', opacity: 0.15, color: '#0f172a' }}>💎</div>
        </AdminCard>

        <AdminCard style={{ position: 'relative' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Good Profiles Cases</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--primary-brand)', lineHeight: 1 }}>{curatedMatches}</div>
          <div style={{ position: 'absolute', bottom: '20px', right: '20px', fontSize: '24px', opacity: 0.15, color: '#0f172a' }}>🤝</div>
        </AdminCard>

        <AdminCard style={{ position: 'relative' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Silver Plan Cases</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--primary-brand)', lineHeight: 1 }}>{secondMarriage}</div>
          <div style={{ position: 'absolute', bottom: '20px', right: '20px', fontSize: '24px', opacity: 0.15, color: '#0f172a' }}>💍</div>
        </AdminCard>

        <AdminCard style={{ position: 'relative' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Gold Package Cases</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--primary-brand)', lineHeight: 1 }}>{highProfile}</div>
          <div style={{ position: 'absolute', bottom: '20px', right: '20px', fontSize: '24px', opacity: 0.15, color: '#0f172a' }}>👑</div>
        </AdminCard>

        <AdminCard style={{ position: 'relative' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Completed Matches</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--primary-brand)', lineHeight: 1 }}>{completedMatches}</div>
          <div style={{ position: 'absolute', bottom: '20px', right: '20px', fontSize: '24px', opacity: 0.15, color: '#0f172a' }}>❤️</div>
        </AdminCard>

        <AdminCard style={{ position: 'relative' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Audit Logs</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--primary-brand)', lineHeight: 1 }}>{totalAuditLogs}</div>
          <div style={{ position: 'absolute', bottom: '20px', right: '20px', fontSize: '24px', opacity: 0.15, color: '#0f172a' }}>📜</div>
        </AdminCard>
      </div>
    </div>
  );
};

export default AdminOverview;
