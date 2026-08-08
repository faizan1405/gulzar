import React from 'react';
import Image from 'next/image';
import { VerificationQueue } from '../../../components/VerificationQueue';
import { AdminPageHeader } from '../../../components/AdminUI';

export default function VerificationQueuePage() {
  return (
    <div>
      <AdminPageHeader
        title="Verification Call Queue"
        subtitle="Conduct manual telephone checks on newly registered members, log interview notes, and approve or reject profiles."
      />
      <VerificationQueue />
    </div>
  );
}
