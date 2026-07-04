'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../../context/AppContext';
import { AdminPageHeader, AdminCard, AdminBadge, AdminTable, AdminButton, AdminModal } from '../../../components/AdminUI';

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

function calcAge(dob: string | Date): string {
  const d = new Date(dob);
  if (isNaN(d.getTime())) return '—';
  const age = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
  return `${age} yrs`;
}

export default function AdminProfilesPage() {
  const { } = useApp();

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
        headers: { 'Content-Type': 'application/json' },
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
  }, [search, gender, state, verificationStatus, approvalStatus]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleUpdate = async (profileId: string, updates: Record<string, any>) => {
    setSaving(true);
    setSaveMsg('');
    try {
      const res = await fetch(`/api/admin/profiles/${profileId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (res.ok) {
        setSaveMsg('Saved successfully');
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
        headers: { 'Content-Type': 'application/json' },
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
    <div className="font-sans">
      <AdminPageHeader
        title="Profiles"
        subtitle="View, edit, approve, reject, and manage all matrimonial profiles."
      />

      <AdminCard style={{ marginBottom: '24px' }}>
        <div className="admin-toolbar">
          <div className="admin-toolbar-filters">
            <div>
              <label className="admin-label">Search</label>
              <input
                type="text"
                className="admin-input"
                placeholder="Name, phone..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '200px' }}
              />
            </div>
            <div>
              <label className="admin-label">Gender</label>
              <select className="admin-input" value={gender} onChange={e => setGender(e.target.value)} style={{ width: '120px' }}>
                <option value="">All</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="admin-label">State</label>
              <input
                type="text"
                className="admin-input"
                placeholder="e.g. Maharashtra"
                value={state}
                onChange={e => setState(e.target.value)}
                style={{ width: '150px' }}
              />
            </div>
            <div>
              <label className="admin-label">Verification</label>
              <select className="admin-input" value={verificationStatus} onChange={e => setVerificationStatus(e.target.value)} style={{ width: '140px' }}>
                <option value="">All</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="NEEDS_FOLLOW_UP">Follow Up</option>
              </select>
            </div>
            <div>
              <label className="admin-label">Approval</label>
              <select className="admin-input" value={approvalStatus} onChange={e => setApprovalStatus(e.target.value)} style={{ width: '140px' }}>
                <option value="">All</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        </div>
        <div style={{ fontSize: '12px', color: '#64748b' }}>
          {loading ? 'Loading profiles...' : `Showing ${profiles.length} of ${total} profiles`}
        </div>
      </AdminCard>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>Loading...</div>
      ) : profiles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#64748b', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>No profiles found.</div>
      ) : (
        <AdminTable headers={['Profile', 'Location', 'Profession', 'Status', 'Paid', 'Actions']}>
          {profiles.map(profile => (
            <tr key={profile.id}>
              <td>
                <div style={{ fontWeight: 600, color: '#0f172a' }}>{profile.fullName}</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  {profile.gender} · {calcAge(profile.dateOfBirth)} · {profile.maritalStatus}
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>{profile.phoneNumber}</div>
              </td>
              <td>
                <div style={{ fontWeight: 500 }}>{profile.city || '—'}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{profile.state || ''}</div>
              </td>
              <td>
                <div style={{ fontWeight: 500 }}>{profile.occupation}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{profile.education}</div>
              </td>
              <td>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                  <AdminBadge status={profile.verificationStatus}>V: {profile.verificationStatus}</AdminBadge>
                  <AdminBadge status={profile.adminApprovalStatus || 'PENDING'}>A: {profile.adminApprovalStatus || 'PENDING'}</AdminBadge>
                </div>
              </td>
              <td>
                <AdminBadge status={profile.hasPaid ? 'PAID' : 'NEUTRAL'}>
                  {profile.hasPaid ? 'Paid' : 'Free'}
                </AdminBadge>
              </td>
              <td>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <AdminButton variant="secondary" onClick={() => setSelected(profile)}>
                    Manage
                  </AdminButton>
                  {profile.verificationStatus !== 'APPROVED' && (
                    <AdminButton variant="ghost" onClick={() => handleUpdate(profile.id, { verificationStatus: 'APPROVED', adminApprovalStatus: 'APPROVED' })} style={{ color: '#166534', border: '1px solid #dcfce7', background: '#f0fdf4' }}>
                      Approve
                    </AdminButton>
                  )}
                  {profile.verificationStatus !== 'REJECTED' && (
                    <AdminButton variant="ghost" onClick={() => handleUpdate(profile.id, { verificationStatus: 'REJECTED', adminApprovalStatus: 'REJECTED' })} style={{ color: '#991b1b', border: '1px solid #fecaca', background: '#fef2f2' }}>
                      Reject
                    </AdminButton>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}

      {selected && (
        <AdminModal title={`Manage Profile: ${selected.fullName}`} isOpen={true} onClose={() => setSelected(null)} width="700px">
          
          {saveMsg && (
            <div style={{ background: saveMsg.includes('failed') || saveMsg.includes('error') ? '#fef2f2' : '#f0fdf4', color: saveMsg.includes('failed') || saveMsg.includes('error') ? '#991b1b' : '#166534', padding: '12px 16px', borderRadius: '6px', fontSize: '13px', marginBottom: '20px', border: `1px solid ${saveMsg.includes('failed') || saveMsg.includes('error') ? '#fecaca' : '#dcfce7'}` }}>
              {saveMsg}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div>
              <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: 4, fontWeight: 600 }}>Phone</span>
              <div style={{ fontWeight: 500, color: '#0f172a' }}>{selected.phoneNumber}</div>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: 4, fontWeight: 600 }}>Gender / Age</span>
              <div style={{ fontWeight: 500, color: '#0f172a' }}>{selected.gender} · {calcAge(selected.dateOfBirth)}</div>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: 4, fontWeight: 600 }}>Location</span>
              <div style={{ fontWeight: 500, color: '#0f172a' }}>{selected.city}, {selected.state}</div>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: 4, fontWeight: 600 }}>Occupation</span>
              <div style={{ fontWeight: 500, color: '#0f172a' }}>{selected.occupation}</div>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: 4, fontWeight: 600 }}>Education</span>
              <div style={{ fontWeight: 500, color: '#0f172a' }}>{selected.education}</div>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: 4, fontWeight: 600 }}>Maslak / Biradari</span>
              <div style={{ fontWeight: 500, color: '#0f172a' }}>{selected.maslak || '—'} / {selected.biradari || '—'}</div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', margin: '24px -24px', padding: '24px 24px 0' }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#334155', fontWeight: 600 }}>Admin Controls</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label className="admin-label">Verification Status</label>
                <select
                  className="admin-input"
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
                <label className="admin-label">Admin Approval</label>
                <select
                  className="admin-input"
                  value={selected.adminApprovalStatus || 'PENDING'}
                  onChange={e => setSelected(s => s ? { ...s, adminApprovalStatus: e.target.value } : s)}
                >
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
              <div>
                <label className="admin-label">Category</label>
                <select
                  className="admin-input"
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
                <label className="admin-label">Payment Status</label>
                <select
                  className="admin-input"
                  value={selected.hasPaid ? 'true' : 'false'}
                  onChange={e => setSelected(s => s ? { ...s, hasPaid: e.target.value === 'true' } : s)}
                >
                  <option value="false">Not Paid (Free)</option>
                  <option value="true">Paid / Active</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between', marginTop: '32px' }}>
            <AdminButton variant="danger" onClick={() => handleDelete(selected.id)}>
              Delete Profile
            </AdminButton>
            <div style={{ display: 'flex', gap: '12px' }}>
              <AdminButton variant="secondary" onClick={() => setSelected(null)}>
                Cancel
              </AdminButton>
              <AdminButton
                variant="primary"
                disabled={saving}
                onClick={() => handleUpdate(selected.id, {
                  verificationStatus: selected.verificationStatus,
                  adminApprovalStatus: selected.adminApprovalStatus,
                  category: selected.category,
                  hasPaid: selected.hasPaid,
                })}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </AdminButton>
            </div>
          </div>
        </AdminModal>
      )}
    </div>
  );
}
