'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSimulator } from '../../../context/SimulatorContext';
import { SectionHeading, FloralCorner } from '../../../components/NikahComponents';

interface AdminProfile {
  id: string;
  fullName: string;
  gender: string;
  dateOfBirth: string | Date;
  maritalStatus: string;
  phoneNumber: string;
  city: string | null;
  state: string | null;
  education: string;
  occupation: string;
  verificationStatus: string;
  adminApprovalStatus: string;
  hasPaid: boolean;
  profileCompletionStatus: string;
  maslak: string | null;
  biradari: string | null;
  category: string | null;
  profileImageUrl?: string | null;
  createdAt: string | Date;
}

const VERIFICATION_COLORS: Record<string, React.CSSProperties> = {
  PENDING:         { background: '#fef3c7', color: '#92400e' },
  APPROVED:        { background: '#d1fae5', color: '#065f46' },
  REJECTED:        { background: '#fee2e2', color: '#991b1b' },
  NEEDS_FOLLOW_UP: { background: '#ede9fe', color: '#5b21b6' },
};

const APPROVAL_COLORS: Record<string, React.CSSProperties> = {
  PENDING:  { background: '#fef3c7', color: '#92400e' },
  APPROVED: { background: '#d1fae5', color: '#065f46' },
  REJECTED: { background: '#fee2e2', color: '#991b1b' },
};

function calcAge(dob: string | Date): string {
  const d = new Date(dob);
  if (isNaN(d.getTime())) return '—';
  const age = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
  return `${age} yrs`;
}

export default function AdminProfilesPage() {
  const { getSimulatorHeaders } = useSimulator();

  const [profiles, setProfiles] = useState<AdminProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Filters
  const [search, setSearch] = useState('');
  const [gender, setGender] = useState('');
  const [state, setState] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');
  const [approvalStatus, setApprovalStatus] = useState('');

  // Selected profile for detail/edit panel
  const [selected, setSelected] = useState<AdminProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (search) q.set('search', search);
      if (gender) q.set('gender', gender);
      if (state) q.set('state', state);
      if (verificationStatus) q.set('verificationStatus', verificationStatus);
      if (approvalStatus) q.set('approvalStatus', approvalStatus);

      const res = await fetch(`/api/admin/profiles?${q}`, {
        headers: getSimulatorHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setProfiles(data.profiles || []);
        setTotal(data.total || 0);
      }
    } catch (e) {
      console.error('Failed to fetch profiles', e);
    } finally {
      setLoading(false);
    }
  }, [search, gender, state, verificationStatus, approvalStatus, getSimulatorHeaders]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleUpdate = async (profileId: string, updates: Record<string, any>) => {
    setSaving(true);
    setSaveMsg('');
    try {
      const res = await fetch(`/api/admin/profiles/${profileId}`, {
        method: 'PATCH',
        headers: { ...getSimulatorHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (res.ok) {
        setSaveMsg('✓ Saved');
        setProfiles(prev => prev.map(p => p.id === profileId ? { ...p, ...updates } : p));
        if (selected?.id === profileId) setSelected(prev => prev ? { ...prev, ...updates } : prev);
      } else {
        setSaveMsg(data.error || 'Save failed.');
      }
    } catch {
      setSaveMsg('Network error.');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(''), 3000);
    }
  };

  const handleDelete = async (profileId: string) => {
    if (!confirm('Permanently delete this profile? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/admin/profiles/${profileId}`, {
        method: 'DELETE',
        headers: getSimulatorHeaders(),
      });
      if (res.ok) {
        setProfiles(prev => prev.filter(p => p.id !== profileId));
        if (selected?.id === profileId) setSelected(null);
        setTotal(t => t - 1);
      } else {
        const data = await res.json();
        alert(data.error || 'Delete failed.');
      }
    } catch {
      alert('Network error.');
    }
  };

  return (
    <div style={{ padding: '20px 0 60px' }} className="font-sans">
      <SectionHeading
        title="Profile Management"
        subtitle="View, edit, approve, reject, and manage all matrimonial profiles in one place."
        scriptText="Admin Desk"
      />

      {/* Filters */}
      <div className="card-theme-wrapper" style={{ padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr repeat(4, 160px)', gap: '14px' }} className="grid-mobile-1">
          <div>
            <label className="form-label">Search</label>
            <input
              type="text"
              className="form-control"
              placeholder="Name, city, phone, biradari…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Gender</label>
            <select className="form-control" value={gender} onChange={e => setGender(e.target.value)}>
              <option value="">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label className="form-label">State</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Maharashtra"
              value={state}
              onChange={e => setState(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Verification</label>
            <select className="form-control" value={verificationStatus} onChange={e => setVerificationStatus(e.target.value)}>
              <option value="">All</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="NEEDS_FOLLOW_UP">Follow Up</option>
            </select>
          </div>
          <div>
            <label className="form-label">Approval</label>
            <select className="form-control" value={approvalStatus} onChange={e => setApprovalStatus(e.target.value)}>
              <option value="">All</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
        <div style={{ marginTop: '10px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
          {loading ? 'Loading…' : `Showing ${profiles.length} of ${total} profiles`}
        </div>
      </div>

      {/* Table */}
      <div className="card-theme-wrapper" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>Loading profiles…</div>
        ) : profiles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>No profiles found.</div>
        ) : (
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--soft-cream)', borderBottom: '2px solid var(--border-color)', color: 'var(--deep-maroon)', fontWeight: 'bold', height: '44px' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Profile</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Location</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Profession</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Verification</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Approval</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Paid</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map(profile => (
                  <tr key={profile.id} style={{ borderBottom: '1px solid var(--border-color)' }} className="table-row-hover">
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{profile.fullName}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {profile.gender} · {calcAge(profile.dateOfBirth)} · {profile.maritalStatus}
                      </div>
                      <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{profile.phoneNumber}</div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontSize: '13px' }}>{profile.city || '—'}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{profile.state || ''}</div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontSize: '13px' }}>{profile.occupation}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{profile.education}</div>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 9px',
                        borderRadius: '10px',
                        fontSize: '11px',
                        fontWeight: 600,
                        ...(VERIFICATION_COLORS[profile.verificationStatus] || {}),
                      }}>
                        {profile.verificationStatus?.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 9px',
                        borderRadius: '10px',
                        fontSize: '11px',
                        fontWeight: 600,
                        ...(APPROVAL_COLORS[profile.adminApprovalStatus] || {}),
                      }}>
                        {profile.adminApprovalStatus || 'PENDING'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 8px',
                        borderRadius: '10px',
                        fontSize: '11px',
                        fontWeight: 600,
                        background: profile.hasPaid ? '#d1fae5' : '#f3f4f6',
                        color: profile.hasPaid ? '#065f46' : '#6b7280',
                      }}>
                        {profile.hasPaid ? 'Paid' : 'Free'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                          className="btn btn-primary"
                          style={{ padding: '4px 10px', fontSize: '11px' }}
                          onClick={() => setSelected(profile)}
                        >
                          Manage
                        </button>
                        {profile.verificationStatus !== 'APPROVED' && (
                          <button
                            className="btn btn-gold"
                            style={{ padding: '4px 10px', fontSize: '11px' }}
                            onClick={() => handleUpdate(profile.id, { verificationStatus: 'APPROVED', adminApprovalStatus: 'APPROVED' })}
                          >
                            ✓ Approve
                          </button>
                        )}
                        {profile.verificationStatus !== 'REJECTED' && (
                          <button
                            className="btn btn-secondary"
                            style={{ padding: '4px 10px', fontSize: '11px', color: 'var(--deep-maroon)' }}
                            onClick={() => handleUpdate(profile.id, { verificationStatus: 'REJECTED', adminApprovalStatus: 'REJECTED' })}
                          >
                            ✗ Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail / Edit Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div
            className="card-theme-wrapper"
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: '620px',
              width: '95%',
              margin: '20px',
              padding: '36px',
              border: '2px solid var(--gold-accent)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <FloralCorner position="tl" color="var(--gold-accent)" />
            <FloralCorner position="tr" color="var(--gold-accent)" />

            <button
              onClick={() => setSelected(null)}
              style={{ position: 'absolute', top: 16, right: 16, fontSize: 24, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >×</button>

            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--deep-maroon)', fontSize: '22px', marginBottom: '20px' }}>
              Manage Profile — {selected.fullName}
            </h3>

            {saveMsg && (
              <div style={{ background: saveMsg.startsWith('✓') ? '#d1fae5' : '#fee2e2', color: saveMsg.startsWith('✓') ? '#065f46' : '#991b1b', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', marginBottom: '16px' }}>
                {saveMsg}
              </div>
            )}

            {/* Identity */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }} className="grid-mobile-1">
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Full Name</span>
                <div style={{ fontWeight: 600 }}>{selected.fullName}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Phone</span>
                <a href={`tel:${selected.phoneNumber}`} style={{ color: 'var(--deep-maroon)', fontWeight: 600 }}>{selected.phoneNumber}</a>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Gender / Age</span>
                <div>{selected.gender} · {calcAge(selected.dateOfBirth)}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Location</span>
                <div>{selected.city}, {selected.state}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Occupation</span>
                <div>{selected.occupation}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Education</span>
                <div>{selected.education}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Maslak</span>
                <div>{selected.maslak || '—'}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Biradari</span>
                <div>{selected.biradari || '—'}</div>
              </div>
            </div>

            <hr style={{ borderColor: 'var(--border-color)', margin: '16px 0' }} />

            {/* Admin controls */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }} className="grid-mobile-1">
              <div>
                <label className="form-label">Verification Status</label>
                <select
                  className="form-control"
                  value={selected.verificationStatus}
                  onChange={e => setSelected(s => s ? { ...s, verificationStatus: e.target.value } : s)}
                >
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="NEEDS_FOLLOW_UP">Needs Follow Up</option>
                </select>
              </div>
              <div>
                <label className="form-label">Admin Approval</label>
                <select
                  className="form-control"
                  value={selected.adminApprovalStatus || 'PENDING'}
                  onChange={e => setSelected(s => s ? { ...s, adminApprovalStatus: e.target.value } : s)}
                >
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
              <div>
                <label className="form-label">Category</label>
                <select
                  className="form-control"
                  value={selected.category || 'normal'}
                  onChange={e => setSelected(s => s ? { ...s, category: e.target.value } : s)}
                >
                  <option value="normal">Normal</option>
                  <option value="featured">Featured</option>
                  <option value="premium">Premium</option>
                  <option value="second_marriage">Second Marriage</option>
                  <option value="high_profile">High Profile</option>
                </select>
              </div>
              <div>
                <label className="form-label">Payment Status</label>
                <select
                  className="form-control"
                  value={selected.hasPaid ? 'true' : 'false'}
                  onChange={e => setSelected(s => s ? { ...s, hasPaid: e.target.value === 'true' } : s)}
                >
                  <option value="false">Not Paid (Free)</option>
                  <option value="true">Paid / Active</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
              <button
                className="btn btn-secondary"
                style={{ color: 'var(--deep-maroon)', fontSize: '13px' }}
                onClick={() => handleDelete(selected.id)}
              >
                🗑 Delete Profile
              </button>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-secondary" style={{ fontSize: '13px' }} onClick={() => setSelected(null)}>
                  Cancel
                </button>
                <button
                  className="btn btn-gold"
                  style={{ fontSize: '13px' }}
                  disabled={saving}
                  onClick={() => handleUpdate(selected.id, {
                    verificationStatus: selected.verificationStatus,
                    adminApprovalStatus: selected.adminApprovalStatus,
                    category: selected.category,
                    hasPaid: selected.hasPaid,
                  })}
                >
                  {saving ? 'Saving…' : '💾 Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
