'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { signIn } from 'next-auth/react';

export default function AdminLoginPage() {
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
          zIndex: 0,
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'rgba(255, 255, 255, 0.98)',
          borderRadius: '24px',
          padding: '40px 32px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          textAlign: 'center',
          position: 'relative',
          zIndex: 10,
          border: '1px solid rgba(184, 146, 74, 0.2)',
        }}
      >
        {/* Logo wrapper */}
        <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'center' }}>
          <Image
            src="/images/rishte-forever-logo.png"
            alt="Rishte Forever"
            width={180}
            height={68}
            priority
            style={{ objectFit: 'contain' }}
          />
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            color: '#6F1D35',
            fontSize: '28px',
            marginBottom: '8px',
            fontWeight: 700,
          }}
        >
          Rishte Forever Admin
        </h1>
        
        <p
          style={{
            color: '#666',
            fontSize: '14px',
            marginBottom: '32px',
            lineHeight: 1.5,
          }}
        >
          Access the Matrimonial management dashboard. Sign in using your registered admin Google account.
        </p>

        {error && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              background: '#fdf2f2',
              border: '1px solid #fde8e8',
              color: '#c81e1e',
              marginBottom: '20px',
              textAlign: 'left',
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
            marginBottom: '0',
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
      </div>
    </div>
  );
}
