'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from '../../../context/SessionContext';
import {
  AdminPageHeader,
  AdminCard,
  AdminBadge,
  AdminButton,
  AdminModal,
  AdminField,
  AdminInput,
  AdminSelect,
  AdminTextarea,
  AdminFilterBar,
  AdminTable,
  AdminAlert,
  AdminLoading,
} from '../../../components/AdminUI';

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
  return `${Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24 * 365.25))} yrs`;
}

export default function AdminProfilesPage() {
  const { reloadTrigger } = useSession();

  const [profiles, setProfiles] = useState<AdminProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState('');
  const [gender, setGender] = useState('');
  const [state, setState] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');
  const [approvalStatus, setApprovalStatus] = useState('');

  const [selected, setSelected] = useState<AdminProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState('');

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
    } catch {
      console.error('Failed to fetch profiles');
    } finally {
      setLoading(false);
    }
  }, [search, gender, state, verificationStatus, approvalStatus]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles, reloadTrigger]);

  const handleUpdate = async (profileId: string, updates: Record<string, string | boolean | number | null>) => {
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
        setSaveMsg('✓ Saved');
        setProfiles((prev) => prev.map((p) => (p.id === profileId ? { ...p, ...updates } : p)));
        setSelected((prev) => (prev && prev.id === profileId ? { ...prev, ...updates } : prev));
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
    if (deleteConfirm !== profileId) {
      setDeleteConfirm(profileId);
      setTimeout(() => setDeleteConfirm(''), 4000);
      return;
    }
    try {
      const res = await fetch(`/api/admin/profiles/${profileId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        setProfiles((prev) => prev.filter((p) => p.id !== profileId));
        setSelected(null);
        setDeleteConfirm('');
        setTotal((t) => t - 1);
      } else {
        alert('Delete failed.');
      }
    } catch {
      alert('Network error.');
    }
  };

  return (
    <div style={{ paddingBottom: 60 }}>
      <AdminPageHeader
        title="Profile Management"
        subtitle="View, edit, approve, reject, and manage all matrimonial profiles in one place."
        actions={
          <AdminButton onClick={() => fetchProfiles()} variant="secondary">
            ↻ Refresh
          </AdminButton>
        }
      />

      {/* Filters */}
      <AdminCard style={{ marginBottom: 20 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 14,
          }}
        >
          <AdminField label="Search" htmlFor="pf-search">
            <AdminInput
              id="pf-search"
              placeholder="Name, city, phone, biradari…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </AdminField>
          <AdminField label="Gender">
            <AdminSelect value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </AdminSelect>
          </AdminField>
          <AdminField label="State">
            <AdminInput
              placeholder="e.g. Maharashtra"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </AdminField>
          <AdminField label="Verification">
            <AdminSelect value={verificationStatus} onChange={(e) => setVerificationStatus(e.target.value)}>
              <option value="">All</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="NEEDS_FOLLOW_UP">Follow Up</option>
            </AdminSelect>
          </AdminField>
          <AdminField label="Approval">
            <AdminSelect value={approvalStatus} onChange={(e) => setApprovalStatus(e.target.value)}>
              <option value="">All</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </AdminSelect>
          </AdminField>
        </div>
        <div style={{ marginTop: 10, fontSize: 12.5, color: '#64748b' }}>
          {loading ? 'Loading…' : `Showing ${profiles.length} of ${total} profiles`}
        </div>
      </AdminCard>

      {/* Table */}
      {loading ? (
        <AdminCard>
          <AdminLoading />
        </AdminCard>
      ) : profiles.length === 0 ? (
        <AdminCard>
          <div className="admin-empty" style={{ padding: 24 }}>
            <div className="admin-empty__icon">👥</div>
            <div className="admin-empty__title">No profiles found</div>
            <div className="admin-empty__desc">Try adjusting the filters above.</div>
          </div>
        </AdminCard>
      ) : (
        <AdminTable headers={['Profile', 'Location', 'Profession', 'Verification', 'Approval', 'Paid', 'Actions']}>
          {profiles.map((profile) => (
            <tr key={profile.id}>
              <td>
                <div style={{ fontWeight: 600 }}>{profile.fullName}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>
                  {profile.gender} · {calcAge(profile.dateOfBirth)} · {profile.maritalStatus}
                </div>
                <div style={{ fontSize: 10.5, color: '#64748b' }}>{profile.phoneNumber}</div>
              </td>
              <td>
                <div>{profile.city || '—'}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>{profile.state || ''}</div>
              </td>
              <td>
                <div>{profile.occupation}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>{profile.education}</div>
              </td>
              <td style={{ textAlign: 'center' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '3px 9px',
                  borderRadius: 10,
                  fontSize: 11,
                  fontWeight: 600,
                  ...(VERIFICATION_COLORS[profile.verificationStatus] || {}),
                }}>
                  {profile.verificationStatus?.replace('_', ' ')}
                </span>
              </td>
              <td style={{ textAlign: 'center' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '3px 9px',
                  borderRadius: 10,
                  fontSize: 11,
                  fontWeight: 600,
                  ...(APPROVAL_COLORS[profile.adminApprovalStatus] || {}),
                }}>
                  {profile.adminApprovalStatus || 'PENDING'}
                </span>
              </td>
              <td style={{ textAlign: 'center' }}>
                <AdminBadge variant={profile.hasPaid ? 'approved' : 'neutral'}>
                  {profile.hasPaid ? 'Paid' : 'Free'}
                </AdminBadge>
              </td>
              <td>
                <div className="admin-table__actions">
                  <AdminButton size="sm" onClick={() => setSelected(profile)}>Manage</AdminButton>
                  {profile.verificationStatus !== 'APPROVED' && (
                    <AdminButton size="sm" variant="success" onClick={() => handleUpdate(profile.id, { verificationStatus: 'APPROVED', adminApprovalStatus: 'APPROVED' })}>
                      ✓ Approve
                    </AdminButton>
                  )}
                  {profile.verificationStatus !== 'REJECTED' && (
                    <AdminButton size="sm" variant="danger" onClick={() => handleUpdate(profile.id, { verificationStatus: 'REJECTED', adminApprovalStatus: 'REJECTED' })}>
                      ✗ Reject
                    </AdminButton>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}

      {/* Detail / Edit Modal */}
      <AdminModal title={`Manage Profile — ${selected?.fullName || ''}`} isOpen={!!selected} onClose={() => setSelected(null)} width={640}>
        {selected && (
          <>
            {saveMsg && <AdminAlert type={saveMsg.startsWith('✓') ? 'success' : 'error'}>{saveMsg}</AdminAlert>}

            {/* Identity */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 14,
                marginBottom: 18,
              }}
            >
              <div>
                <div style={{ fontSize: 10.5, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 3, letterSpacing: 0.4 }}>Full Name</div>
                <div style={{ fontWeight: 600 }}>{selected.fullName}</div>
              </div>
              <div>
                <div style={{ fontSize: 10.5, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 3, letterSpacing: 0.4 }}>Phone</div>
                <a href={`tel:${selected.phoneNumber}`} style={{ color: 'var(--deep-maroon, #6F1D35)', fontWeight: 600 }}>{selected.phoneNumber}</a>
              </div>
              <div>
                <div style={{ fontSize: 10.5, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 3, letterSpacing: 0.4 }}>Gender / Age</div>
                <div>{selected.gender} · {calcAge(selected.dateOfBirth)}</div>
              </div>
              <div>
                <div style={{ fontSize: 10.5, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 3, letterSpacing: 0.4 }}>Location</div>
                <div>{selected.city}, {selected.state}</div>
              </div>
              <div>
                <div style={{ fontSize: 10.5, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 3, letterSpacing: 0.4 }}>Occupation</div>
                <div>{selected.occupation}</div>
              </div>
              <div>
                <div style={{ fontSize: 10.5, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 3, letterSpacing: 0.4 }}>Education</div>
                <div>{selected.education}</div>
              </div>
              <div>
                <div style={{ fontSize: 10.5, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 3, letterSpacing: 0.4 }}>Maslak</div>
                <div>{selected.maslak || '—'}</div>
              </div>
              <div>
                <div style={{ fontSize: 10.5, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 3, letterSpacing: 0.4 }}>Biradari</div>
                <div>{selected.biradari || '—'}</div>
              </div>
            </div>

            <hr style={{ borderColor: '#e2e8f0', margin: '16px 0' }} />

            {/* Admin controls */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 14,
                marginBottom: 18,
              }}
            >
              <AdminField label="Verification Status">
                <AdminSelect
                  value={selected.verificationStatus}
                  onChange={(e) => setSelected((s) => s ? { ...s, verificationStatus: e.target.value } : s)}
                >
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="NEEDS_FOLLOW_UP">Needs Follow Up</option>
                </AdminSelect>
              </AdminField>
              <AdminField label="Admin Approval">
                <AdminSelect
                  value={selected.adminApprovalStatus || 'PENDING'}
                  onChange={(e) => setSelected((s) => s ? { ...s, adminApprovalStatus: e.target.value } : s)}
                >
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </AdminSelect>
              </AdminField>
              <AdminField label="Category">
                <AdminSelect
                  value={selected.category || 'normal'}
                  onChange={(e) => setSelected((s) => s ? { ...s, category: e.target.value } : s)}
                >
                  <option value="normal">Normal</option>
                  <option value="featured">Featured</option>
                  <option value="premium">Premium</option>
                  <option value="second_marriage">Second Marriage</option>
                  <option value="high_profile">High Profile</option>
                </AdminSelect>
              </AdminField>
              <AdminField label="Payment Status">
                <AdminSelect
                  value={selected.hasPaid ? 'true' : 'false'}
                  onChange={(e) => setSelected((s) => s ? { ...s, hasPaid: e.target.value === 'true' } : s)}
                >
                  <option value="false">Not Paid (Free)</option>
                  <option value="true">Paid / Active</option>
                </AdminSelect>
              </AdminField>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', alignItems: 'center' }}>
              <AdminButton
                variant="danger"
                onClick={() => handleDelete(selected.id)}
              >
                {deleteConfirm === selected.id ? 'Confirm delete?' : '🗑 Delete Profile'}
              </AdminButton>
              <div style={{ display: 'flex', gap: 10 }}>
                <AdminButton variant="secondary" onClick={() => setSelected(null)}>Cancel</AdminButton>
                <AdminButton
                  disabled={saving}
                  onClick={() => handleUpdate(selected.id, {
                    verificationStatus: selected.verificationStatus,
                    adminApprovalStatus: selected.adminApprovalStatus,
                    category: selected.category,
                    hasPaid: selected.hasPaid,
                  })}
                >
                  {saving ? 'Saving…' : '💾 Save Changes'}
                </AdminButton>
              </div>
            </div>
          </>
        )}
      </AdminModal>
    </div>
  );
}

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
