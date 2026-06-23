'use client';

import React from 'react';
import AdminOverview from '../../components/AdminOverview';

export default function AdminOverviewPage() {
  return (
    <div>
      <AdminOverview />
      <div className="card-theme-wrapper" style={{ marginTop: '30px' }}>
        <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-dark)', marginBottom: '12px' }}>Welcome to the Admin Portal</h3>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-dark)' }}>
          This administration console is configured for <strong>Rishte Forever</strong> matrimonial operations. Use the sidebar menu to navigate through pending applicant validations, premium subscription checkouts, matchmaking assignments, and chronological system audit trails.
        </p>
      </div>
    </div>
  );
}
