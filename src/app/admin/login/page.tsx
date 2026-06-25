'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useSimulator } from '../../../context/SimulatorContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { setIsAdminMode } = useSimulator();
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signIn('google', { callbackUrl: '/admin' });
    } catch {
      setError('Sign-in failed. Please try again.');
      setLoading(false);
    }
  };

  const handleDemoAdmin = () => {
    setIsAdminMode(true);
    router.push('/admin');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #6F1D35 0%, #3a0e1c 60%, #1a0008 100%)',
        padding: '20px',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Decorative background pattern */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(184,146,74,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(184,146,74,0.06) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          background: 'var(--warm-ivory)',
          borderRadius: '24px',
          padding: '48px 40px',
          width: '100%',
          maxWidth: '420px',
          boxShadow: '0 40px 80px -10px rgba(0,0,0,0.5)',
          border: '1.5px solid rgba(184,146,74,0.3)',
          position: 'relative',
          textAlign: 'center',
        }}
      >
        {/* Floral corners */}
        <span style={{ position: 'absolute', top: 12, left: 14, fontSize: 18, opacity: 0.4, color: 'var(--gold-accent)' }}>❧</span>
        <span style={{ position: 'absolute', top: 12, right: 14, fontSize: 18, opacity: 0.4, color: 'var(--gold-accent)', transform: 'scaleX(-1)' }}>❧</span>
        <span style={{ position: 'absolute', bottom: 12, left: 14, fontSize: 18, opacity: 0.4, color: 'var(--gold-accent)', transform: 'scaleY(-1)' }}>❧</span>
        <span style={{ position: 'absolute', bottom: 12, right: 14, fontSize: 18, opacity: 0.4, color: 'var(--gold-accent)', transform: 'scale(-1)' }}>❧</span>

        {/* Logo */}
        <div style={{ marginBottom: '24px' }}>
          <Image
            src="/images/rishte-forever-logo.png"
            alt="Rishte Forever"
            width={160}
            height={60}
            style={{ height: '44px', width: 'auto', margin: '0 auto' }}
          />
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            color: 'var(--deep-maroon)',
            fontSize: '26px',
            fontWeight: 700,
            marginBottom: '6px',
          }}
        >
          Admin Portal
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', marginBottom: '32px' }}>
          Secure access for Rishte Forever team members only.
        </p>

        {/* Divider */}
        <div
          style={{
            height: '1px',
            background: 'linear-gradient(to right, transparent, var(--gold-accent), transparent)',
            marginBottom: '28px',
            opacity: 0.5,
          }}
        />

        {error && (
          <div
            style={{
              background: 'rgba(111,29,53,0.08)',
              border: '1px solid rgba(111,29,53,0.2)',
              borderRadius: '8px',
              padding: '10px 14px',
              marginBottom: '20px',
              color: 'var(--deep-maroon)',
              fontSize: '13px',
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Google Sign-in */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px 20px',
            borderRadius: '10px',
            border: '1.5px solid #dadce0',
            background: '#fff',
            color: '#3c4043',
            fontSize: '15px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            transition: 'all 0.2s',
            opacity: loading ? 0.7 : 1,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            marginBottom: isDemoMode ? '16px' : '0',
          }}
        >
          {/* Google G icon */}
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>

        {/* Demo mode shortcut */}
        {isDemoMode && (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                margin: '16px 0',
                color: 'var(--text-muted)',
                fontSize: '12px',
              }}
            >
              <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
              <span>or demo access</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
            </div>
            <button
              onClick={handleDemoAdmin}
              className="btn btn-gold"
              style={{ width: '100%', padding: '13px', fontSize: '14px', fontWeight: 600 }}
            >
              🎭 Enter as Demo Admin
            </button>
          </>
        )}

        {/* Footer note */}
        <p
          style={{
            marginTop: '28px',
            fontSize: '11.5px',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
          }}
        >
          Only authorized team accounts can access the admin panel.
          <br />
          Unauthorized access attempts are logged.
        </p>

        <a
          href="/"
          style={{
            display: 'inline-block',
            marginTop: '16px',
            fontSize: '12px',
            color: 'var(--gold-dark)',
            textDecoration: 'underline',
          }}
        >
          ← Back to public website
        </a>
      </div>
    </div>
  );
}
