'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ChangePasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: password }),
      });

      if (res.ok) {
        // Need to re-authenticate or just reload to trigger layout check and session update
        // We will sign out the user, requiring them to login with the new password
        // or just let the API update the DB and reload the page which fetches the new session
        const { signOut } = await import('next-auth/react');
        await signOut({ redirect: false });
        router.push('/admin/login');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update password.');
        setLoading(false);
      }
    } catch {
      setError('An error occurred. Please try again.');
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
          width: '100%',
          maxWidth: '440px',
          background: 'rgba(255, 255, 255, 0.98)',
          borderRadius: '24px',
          padding: '40px 32px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          position: 'relative',
          zIndex: 10,
          border: '1px solid rgba(184, 146, 74, 0.2)',
        }}
      >
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
            fontSize: '24px',
            marginBottom: '8px',
            fontWeight: 700,
            textAlign: 'center',
          }}
        >
          Change Password
        </h1>
        
        <p
          style={{
            color: '#666',
            fontSize: '14px',
            marginBottom: '32px',
            lineHeight: 1.5,
            textAlign: 'center',
          }}
        >
          For security reasons, you must change your temporary password before accessing the admin dashboard.
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#333', marginBottom: '8px' }}>
              New Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '15px',
                outline: 'none',
              }}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#333', marginBottom: '8px' }}>
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '15px',
                outline: 'none',
              }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px 20px',
              borderRadius: '10px',
              border: 'none',
              background: '#6F1D35',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              marginTop: '8px',
            }}
          >
            {loading ? 'Updating...' : 'Set Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
