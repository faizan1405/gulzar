'use client';

import React from 'react';
import VerificationQueue from '../../../components/VerificationQueue';

export default function VerificationQueuePage() {
  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-dark)', marginBottom: '8px' }}>
        Verification Call Queue
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', marginBottom: '24px' }}>
        Conduct manual telephone checks on newly registered members, log interview notes, and approve or reject profiles.
      </p>
      <VerificationQueue />
    </div>
  );
}
