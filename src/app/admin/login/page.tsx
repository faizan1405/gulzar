'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid credentials');
        setLoading(false);
        return;
      }

      // Reload so the app re-reads the session cookie
      // and the proxy + AdminLayout both recognise the admin session.
      window.location.href = '/admin';
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
        }}
      >
        <span style={{ position: 'absolute', top: 12, left: 14, fontSize: 18, opacity: 0.4, color: 'var(--gold-accent)' }}>❧</span>
        <span style={{ position: 'absolute', top: 12, right: 14, fontSize: 18, opacity: 0.4, color: 'var(--gold-accent)', transform: 'scaleX(-1)' }}>❧</span>
        <span style={{ position: 'absolute', bottom: 12, left: 14, fontSize: 18, opacity: 0.4, color: 'var(--gold-accent)', transform: 'scaleY(-1)' }}>❧</span>
        <span style={{ position: 'absolute', bottom: 12, right: 14, fontSize: 18, opacity: 0.4, color: 'var(--gold-accent)', transform: 'scale(-1)' }}>❧</span>

        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--deep-maroon)', fontSize: '22px', fontWeight: 700 }}>
            Admin Portal
          </span>
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            color: 'var(--deep-maroon)',
            fontSize: '20px',
            fontWeight: 600,
            marginBottom: '6px',
            textAlign: 'center',
          }}
        >
          Admin Sign In
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '28px', textAlign: 'center' }}>
          Enter your admin credentials to access the panel.
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

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '6px' }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              placeholder="Enter admin username"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1.5px solid #d1d5db',
                fontSize: '15px',
                fontFamily: 'var(--font-sans)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1.5px solid #d1d5db',
                fontSize: '15px',
                fontFamily: 'var(--font-sans)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #6F1D35, #3a0e1c)',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p
          style={{
            marginTop: '28px',
            fontSize: '11.5px',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            textAlign: 'center',
          }}
        >
          Authorized admin access only. Unauthorized access attempts are logged.
        </p>

        <Link
          href="/"
          style={{
            display: 'inline-block',
            marginTop: '16px',
            fontSize: '12px',
            color: 'var(--gold-dark)',
            textDecoration: 'underline',
            textAlign: 'center',
            width: '100%',
          }}
        >
          ← Back to public website
        </Link>
      </div>
    </div>
  );
}