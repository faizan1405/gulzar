'use client';

import React from 'react';
import { useSimulator } from '../context/SimulatorContext';

export const AdminOverview: React.FC = () => {
  const {
    profiles,
    adminRequests,
    adminPurchases,
    adminAssignments,
    auditLogs
  } = useSimulator();

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
      <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-dark)', marginBottom: '8px' }}>
        Dashboard Overview
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', marginBottom: '32px' }}>
        Real-time matrimonial operations, premium subscriptions, and verification statistics.
      </p>

      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <div className="stat-card-label">Total Profiles</div>
            <div className="stat-card-value">{totalProfiles}</div>
          </div>
          <div className="stat-card-icon">👥</div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-card-label">Pending Verifications</div>
            <div className="stat-card-value">{pendingVerifications}</div>
          </div>
          <div className="stat-card-icon">⏳</div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-card-label">Verified Profiles</div>
            <div className="stat-card-value">{verifiedProfiles}</div>
          </div>
          <div className="stat-card-icon">✅</div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-card-label">Active Monthly Members</div>
            <div className="stat-card-value">{activeMonthlyMembers}</div>
          </div>
          <div className="stat-card-icon">📅</div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-card-label">Premium Purchases</div>
            <div className="stat-card-value">{premiumPurchases}</div>
          </div>
          <div className="stat-card-icon">💎</div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-card-label">Good Profiles Cases</div>
            <div className="stat-card-value">{curatedMatches}</div>
          </div>
          <div className="stat-card-icon">🤝</div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-card-label">Silver Plan Cases</div>
            <div className="stat-card-value">{secondMarriage}</div>
          </div>
          <div className="stat-card-icon">💍</div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-card-label">Gold Package Cases</div>
            <div className="stat-card-value">{highProfile}</div>
          </div>
          <div className="stat-card-icon">👑</div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-card-label">Completed Matches</div>
            <div className="stat-card-value">{completedMatches}</div>
          </div>
          <div className="stat-card-icon">❤️</div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-card-label">Audit Logs</div>
            <div className="stat-card-value">{totalAuditLogs}</div>
          </div>
          <div className="stat-card-icon">📜</div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
