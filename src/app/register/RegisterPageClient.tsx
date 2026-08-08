'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useSession } from '../../context/SessionContext';
import Navbar from '../../components/Navbar';
import MatrimonialRegistrationForm from '../../components/MatrimonialRegistrationForm';
import { PremiumFooter } from '../../components/NikahComponents';

export default function RegisterPageClient() {
  const router = useRouter();
  const { isLoggedIn, authChecked, userProfile, setIsRegistering } = useSession();

  useEffect(() => {
    if (!authChecked) return;
    if (!isLoggedIn) return;
    setIsRegistering(true);
  }, [authChecked, isLoggedIn, setIsRegistering]);

  useEffect(() => {
    if (!authChecked) return;
    if (!isLoggedIn) return;
    if (userProfile?.profileCompletionStatus === 'COMPLETE') {
      // Allow editing if ?edit=true is in the URL
      const searchParams = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search)
        : new URLSearchParams();
      if (searchParams.get('edit') === 'true') return;
      const returnProfile = searchParams.get('returnProfile');
      const returnTo = searchParams.get('returnTo');
      if (returnProfile) {
        router.push(`/packages?returnProfile=${encodeURIComponent(returnProfile)}`);
      } else if (returnTo) {
        router.push(returnTo);
      } else {
        router.push('/my-account');
      }
    }
  }, [authChecked, isLoggedIn, userProfile, router]);

  const handleCancelOrNavigate = (view?: string) => {
    setIsRegistering(false);
    if (view && view !== 'home') {
      router.push('/' + view);
    } else {
      router.push('/');
    }
  };

  const handleGoogleSignIn = () => {
    const returnProfile = typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('returnProfile')
      : null;
    const returnTo = typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('returnTo')
      : null;
    let callbackUrl = '/register';
    const params = new URLSearchParams();
    if (returnProfile) params.set('returnProfile', returnProfile);
    if (returnTo) params.set('returnTo', returnTo);
    const qs = params.toString();
    if (qs) callbackUrl = `/register?${qs}`;
    signIn('google', { callbackUrl });
  };

  if (!authChecked) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
        <Navbar />
        <main className="flex-grow font-sans" style={{ padding: '40px 16px', textAlign: 'center' }}>
          <div className="container">
            <p style={{ color: 'var(--text-muted)' }}>Loading…</p>
          </div>
        </main>
        <PremiumFooter onNavigate={(view) => handleCancelOrNavigate(view)} />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
        <Navbar />
        <main className="flex-grow font-sans" style={{ padding: '40px 16px' }}>
          <div className="container" style={{ maxWidth: '520px', margin: '0 auto', textAlign: 'center' }}>
            <div
              className="card-theme-wrapper"
              style={{
                padding: '48px 32px',
                border: '1.5px solid var(--gold-accent)',
                backgroundColor: 'var(--white)',
              }}
            >
              <span style={{ fontSize: '42px', display: 'block', marginBottom: '12px' }}>📝</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--deep-maroon)', fontSize: '26px', marginBottom: '8px', fontWeight: 'bold' }}>
                Sign in to Register
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '28px', lineHeight: 1.6 }}>
                We use Google sign-in to verify your identity. Your Google account is only used for authentication — your matrimonial profile is filled in next.
              </p>
              <button
                onClick={handleGoogleSignIn}
                className="btn"
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1.5px solid #d1d5db',
                  background: '#ffffff',
                  color: '#374151',
                  fontSize: '15px',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </button>
            </div>
          </div>
        </main>
        <PremiumFooter onNavigate={(view) => handleCancelOrNavigate(view)} />
      </div>
    );
  }

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