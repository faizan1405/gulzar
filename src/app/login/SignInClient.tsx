'use client';

import React, { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

export default function SignInClient() {
  // Get callbackUrl from URL search params on client side
  const getCallbackUrl = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('callbackUrl') || '/';
    }
    return '/';
  };

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Check for auth errors returned by NextAuth
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const authError = params.get('error');
    if (authError) {
      if (authError === 'OAuthAccountNotLinked') {
        setError('This Google account is already linked to a different sign-in method.');
      } else {
        setError('Sign-in failed. Please try again.');
      }
    }
  }, []);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      await signIn('google', { callbackUrl: getCallbackUrl() });
    } catch {
      setError('Sign-in failed. Please try again.');
      setIsLoading(false);
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
        {/* Corner ornaments */}
        <span style={{ position: 'absolute', top: 12, left: 14, fontSize: 18, opacity: 0.4, color: 'var(--gold-accent)' }}>❧</span>
        <span style={{ position: 'absolute', top: 12, right: 14, fontSize: 18, opacity: 0.4, color: 'var(--gold-accent)', transform: 'scaleX(-1)' }}>❧</span>
        <span style={{ position: 'absolute', bottom: 12, left: 14, fontSize: 18, opacity: 0.4, color: 'var(--gold-accent)', transform: 'scaleY(-1)' }}>❧</span>
        <span style={{ position: 'absolute', bottom: 12, right: 14, fontSize: 18, opacity: 0.4, color: 'var(--gold-accent)', transform: 'scale(-1)' }}>❧</span>

        {/* Logo */}
        <div style={{ marginBottom: '8px' }}>
          <Image
            src="/images/rishte-forever-logo.png"
            alt="Rishte Forever"
            width={140}
            height={50}
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            color: 'var(--deep-maroon)',
            fontSize: '24px',
            fontWeight: 700,
            marginBottom: '4px',
          }}
        >
          Welcome
        </h1>
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '14px',
            marginBottom: '28px',
            lineHeight: 1.5,
          }}
        >
          Sign in with your Google account to access your profile and connect with matches.
        </p>

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

        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '10px',
            border: '1.5px solid #d1d5db',
            background: '#ffffff',
            color: '#374151',
            fontSize: '15px',
            fontWeight: 500,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            fontFamily: 'var(--font-sans)',
            transition: 'box-shadow 0.2s ease',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
          }}
        >
          {/* Google icon */}
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
          {isLoading ? 'Signing in...' : 'Continue with Google'}
        </button>

        <p
          style={{
            marginTop: '24px',
            fontSize: '11.5px',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
          }}
        >
          By signing in, you agree to our Terms &amp; Conditions.
          Your Google account is used only for authentication.
        </p>

        <Link
          href="/"
          style={{
            display: 'inline-block',
            marginTop: '16px',
            fontSize: '12px',
            color: 'var(--gold-dark)',
            textDecoration: 'underline',
          }}
        >
          ← Back to Rishte Forever
        </Link>
      </div>
    </div>
  );
}
