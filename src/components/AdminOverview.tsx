'use client';

import React from 'react';
import { useSession } from '../context/SessionContext';
import {
  AdminPageHeader,
  AdminStatCard,
  AdminCard,
  type StatTone,
} from './AdminUI';

export const AdminOverview: React.FC = () => {
  const {
    profiles,
    adminRequests,
    adminPurchases,
    adminAssignments,
    auditLogs,
  } = useSession();

  const metrics = [
    {
      label: 'Total Profiles',
      value: profiles.length,
      icon: '👥',
      tone: 'maroon' as StatTone,
    },
    {
      label: 'Pending Verifications',
      value: adminRequests.filter((r) => r.status === 'PENDING').length,
      icon: '⏳',
      tone: 'orange' as StatTone,
    },
    {
      label: 'Verified Profiles',
      value: profiles.filter((p) => p.verificationStatus === 'APPROVED').length,
      icon: '✅',
      tone: 'green' as StatTone,
    },
    {
      label: 'Active Monthly Members',
      value: adminPurchases.filter((p) => p.packageType === 'monthly_membership' && p.paymentStatus === 'PAID').length,
      icon: '📅',
      tone: 'blue' as StatTone,
    },
    {
      label: 'Premium Purchases',
      value: adminPurchases.length,
      icon: '💎',
      tone: 'purple' as StatTone,
    },
    {
      label: 'Curated Matches',
      value: adminPurchases.filter((p) => p.packageType === 'good_profile_package').length,
      icon: '🤝',
      tone: 'neutral' as StatTone,
    },
    {
      label: 'Silver Plan',
      value: adminPurchases.filter((p) => p.packageType === 'second_marriage_package').length,
      icon: '💍',
      tone: 'orange' as StatTone,
    },
    {
      label: 'Gold Package',
      value: adminPurchases.filter((p) => p.packageType === 'high_profile_package').length,
      icon: '👑',
      tone: 'gold' as StatTone,
    },
    {
      label: 'Completed Matches',
      value:
        adminAssignments.filter((a) => a.status === 'MARRIED').length +
        adminPurchases.filter((p) => p.marriageConfirmation === 'CONFIRMED').length,
      icon: '❤️',
      tone: 'maroon' as StatTone,
    },
    {
      label: 'Audit Logs',
      value: auditLogs.length,
      icon: '📜',
      tone: 'neutral' as StatTone,
    },
  ];

  // Count pending leads
  const pendingLeads = 0;

  return (
    <div>
      <AdminPageHeader
        title="Dashboard Overview"
        subtitle="Real-time matrimonial operations, premium subscriptions, and verification statistics."
      />

      {/* Primary KPI strip */}
      <div className="admin-stats-grid">
        {metrics.map((m) => (
          <AdminStatCard key={m.label} label={m.label} value={m.value} icon={m.icon} tone={m.tone} />
        ))}
      </div>

      {/* Secondary action panels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18, marginTop: 28 }}>
        <AdminCard>
          <div style={{ fontWeight: 600, color: '#334155', marginBottom: 8, fontSize: 13 }}>Verification Queue</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>
            {adminRequests.filter((r) => r.status === 'PENDING').length}
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Pending phone call reviews</div>
        </AdminCard>

        <AdminCard>
          <div style={{ fontWeight: 600, color: '#334155', marginBottom: 8, fontSize: 13 }}>Active Premium Subscriptions</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>
            {adminPurchases.filter((p) => p.paymentStatus === 'PAID').length}
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Paid / active packages</div>
        </AdminCard>

        <AdminCard>
          <div style={{ fontWeight: 600, color: '#334155', marginBottom: 8, fontSize: 13 }}>Active Lead Assignments</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>{adminAssignments.length}</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Curated match assignments in progress</div>
        </AdminCard>
      </div>
    </div>
  );
};
