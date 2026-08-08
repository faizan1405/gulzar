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

      window.location.href = '/admin';
    } catch {
      setError('Sign-in failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <span className="admin-login-card__ornament" style={{ top: 14, left: 16 }}>❧</span>
        <span className="admin-login-card__ornament" style={{ top: 14, right: 16, transform: 'scaleX(-1)' }}>❧</span>
        <span className="admin-login-card__ornament" style={{ bottom: 14, left: 16, transform: 'scaleY(-1)' }}>❧</span>
        <span className="admin-login-card__ornament" style={{ bottom: 14, right: 16, transform: 'scale(-1)' }}>❧</span>

        <div className="admin-login-card__header">
          <div className="admin-login-card__brand">Rishte Forever</div>
          <div className="admin-login-card__title">Admin Sign In</div>
          <div className="admin-login-card__subtitle">Enter your admin credentials to access the panel.</div>
        </div>

        <div className="admin-login-card__divider" />

        {error && (
          <div style={{
            padding: '10px 14px',
            borderRadius: 8,
            background: '#fdf2f2',
            border: '1px solid #fde8e8',
            color: '#c81e1e',
            marginBottom: 18,
            fontSize: 13,
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 5 }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              placeholder="Enter admin username"
              className="admin-field-input"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 5 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              className="admin-field-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="admin-btn admin-btn--primary"
            style={{ width: '100%', padding: '12px 20px', marginTop: 6, fontSize: 15, fontWeight: 600 }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="admin-login-card__divider" />

        <p style={{ margin: 0, fontSize: 11.5, color: '#554D49', lineHeight: 1.6, textAlign: 'center' }}>
          Authorized admin access only. Unauthorized access attempts are logged.
        </p>

        <Link
          href="/"
          style={{ display: 'inline-block', marginTop: 14, fontSize: 12, color: 'var(--gold-dark, #8c6a2b)', textDecoration: 'underline', textAlign: 'center', width: '100%' }}
        >
          ← Back to public website
        </Link>
      </div>
    </div>
  );
}
