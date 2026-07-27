'use client';

import React from 'react';
import VerificationQueue from '../../../components/VerificationQueue';
import { AdminPageHeader } from '../../../components/AdminUI';

export default function VerificationQueuePage() {
  return (
    <div className="font-sans">
      <AdminPageHeader
        title="Verification Call Queue"
        subtitle="Conduct manual telephone checks on newly registered members, log interview notes, and approve or reject profiles."
      />
      <VerificationQueue />
    </div>
  );
}
