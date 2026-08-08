'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AdminAlert } from '../../../components/AdminUI';

export default function ChangePasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

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
        body: JSON.stringify({ currentPassword, newPassword: password }),
      });

      if (res.ok) {
        router.push('/admin');
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
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <span className="admin-login-card__ornament" style={{ top: 14, left: 16 }}>❧</span>
        <span className="admin-login-card__ornament" style={{ top: 14, right: 16, transform: 'scaleX(-1)' }}>❧</span>
        <span className="admin-login-card__ornament" style={{ bottom: 14, left: 16, transform: 'scaleY(-1)' }}>❧</span>
        <span className="admin-login-card__ornament" style={{ bottom: 14, right: 16, transform: 'scale(-1)' }}>❧</span>

        <div className="admin-login-card__header">
          <div style={{ marginBottom: 18, display: 'flex', justifyContent: 'center' }}>
            <Image
              src="/images/rishte-forever-logo.png"
              alt="Rishte Forever"
              width={180}
              height={68}
              priority
              style={{ objectFit: 'contain', height: '50px', width: 'auto' }}
            />
          </div>
          <div className="admin-login-card__title">Change Password</div>
          <div className="admin-login-card__subtitle">
            For security reasons, you must change your temporary password before accessing the admin dashboard.
          </div>
        </div>

        <div className="admin-login-card__divider" />

        {error && <AdminAlert type="error">⚠️ {error}</AdminAlert>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 5 }}>
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="admin-field-input"
              placeholder="Enter your current password"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 5 }}>
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="admin-field-input"
              placeholder="At least 8 characters"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 5 }}>
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="admin-field-input"
              placeholder="Re-enter new password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="admin-btn admin-btn--primary"
            style={{ width: '100%', padding: '12px 20px', marginTop: 6, fontSize: 15, fontWeight: 600 }}
          >
            {loading ? 'Updating…' : 'Set Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
