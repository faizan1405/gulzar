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
  } = useSession();

  const metrics = [
    { label: 'Total Profiles', value: profiles.length, icon: '👥', tone: 'maroon' as StatTone },
    { label: 'Pending Verifications', value: adminRequests.filter((r) => r.status === 'PENDING').length, icon: '⏳', tone: 'orange' as StatTone },
    { label: 'Verified Profiles', value: profiles.filter((p) => p.verificationStatus === 'APPROVED').length, icon: '✅', tone: 'green' as StatTone },
    { label: 'Active Monthly Members', value: adminPurchases.filter((p) => p.packageType === 'monthly_membership' && p.paymentStatus === 'PAID').length, icon: '📅', tone: 'blue' as StatTone },
    { label: 'Premium Purchases', value: adminPurchases.length, icon: '💎', tone: 'purple' as StatTone },
    { label: 'Curated Matches', value: adminPurchases.filter((p) => p.packageType === 'good_profile_package').length, icon: '🤝', tone: 'neutral' as StatTone },
    { label: 'Silver Plan', value: adminPurchases.filter((p) => p.packageType === 'second_marriage_package').length, icon: '💍', tone: 'orange' as StatTone },
    { label: 'Gold Package', value: adminPurchases.filter((p) => p.packageType === 'high_profile_package').length, icon: '👑', tone: 'gold' as StatTone },
    { label: 'Completed Matches', value: adminAssignments.filter((a) => a.status === 'MARRIED').length, icon: '❤️', tone: 'maroon' as StatTone },
  ];

  return (
    <div>
      <AdminPageHeader title="Dashboard" subtitle="Overview of profiles, verifications, and subscriptions." />

      <div className="admin-stats-grid">
        {metrics.map((m) => (
          <AdminStatCard key={m.label} label={m.label} value={m.value} icon={m.icon} tone={m.tone} />
        ))}
      </div>
    </div>
  );
};
