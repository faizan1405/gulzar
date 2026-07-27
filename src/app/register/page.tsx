'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import Navbar from '../../components/Navbar';
import MatrimonialRegistrationForm from '../../components/MatrimonialRegistrationForm';
import { PremiumFooter } from '../../components/NikahComponents';

export default function RegisterPage() {
  const router = useRouter();
  const { setIsRegistering } = useApp();

  const handleCancelOrNavigate = (view?: string) => {
    setIsRegistering(false);
    if (view && view !== 'home') {
      router.push('/' + view);
    } else {
      router.push('/');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      <Navbar />
      <main className="flex-grow font-sans" style={{ padding: '40px 16px' }}>
        <div className="container" style={{ maxWidth: '850px', margin: '0 auto' }}>
          <MatrimonialRegistrationForm onCancel={() => handleCancelOrNavigate('home')} />
        </div>
      </main>
      <PremiumFooter onNavigate={(view) => handleCancelOrNavigate(view)} />
    </div>
  );
}
