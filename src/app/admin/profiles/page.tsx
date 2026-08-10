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
  AdminAlert,
  AdminLoading,
  AdminTable,
} from '../../../components/AdminUI';

const VERIFICATION_COLORS: Record<string, string> = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  NEEDS_FOLLOW_UP: 'info',
};

const APPROVAL_COLORS: Record<string, string> = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
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
        setSaveMsg('Saved');
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

  const onSaveChanges = () => {
    if (!selected) return;
    const updates: Record<string, string | boolean | number | null> = {
      verificationStatus: selected.verificationStatus,
      adminApprovalStatus: selected.adminApprovalStatus,
      category: selected.category,
      hasPaid: selected.hasPaid,
      paymentStatus: selected.hasPaid ? (selected.paymentStatusAction || 'paid') : 'free',
    };
    if (selected.hasPaid) {
      updates.packageType = selected.packageType || 'monthly_membership';
    }
    handleUpdate(selected.id, updates);
  };

  return (
    <div>
      <AdminPageHeader
        title="Profiles"
        subtitle="View and manage all matrimonial profiles."
        actions={
          <AdminButton onClick={fetchProfiles} variant="secondary">Refresh</AdminButton>
        }
      />

      <AdminCard>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
          <AdminField label="Search">
            <AdminInput placeholder="Name, city, phone, biradari…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </AdminField>
          <AdminField label="Gender">
            <AdminSelect value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </AdminSelect>
          </AdminField>
          <AdminField label="State">
            <AdminInput placeholder="e.g. Maharashtra" value={state} onChange={(e) => setState(e.target.value)} />
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
        <div style={{ marginTop: 12, fontSize: 12.5, color: '#64748b' }}>
          {loading ? 'Loading…' : `Showing ${profiles.length} of ${total} profiles`}
        </div>
      </AdminCard>

      {loading ? (
        <AdminCard><AdminLoading /></AdminCard>
      ) : profiles.length === 0 ? (
        <AdminCard>
          <div className="admin-empty" style={{ padding: 24 }}>
            <div className="admin-empty__icon">👥</div>
            <div className="admin-empty__title">No profiles found</div>
            <div className="admin-empty__desc">Try adjusting the filters above.</div>
          </div>
        </AdminCard>
      ) : (
        <AdminCard style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
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
                    <AdminBadge variant={VERIFICATION_COLORS[profile.verificationStatus] as any}>
                      {profile.verificationStatus?.replace('_', ' ')}
                    </AdminBadge>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <AdminBadge variant={APPROVAL_COLORS[profile.adminApprovalStatus] as any}>
                      {profile.adminApprovalStatus || 'PENDING'}
                    </AdminBadge>
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
                          Approve
                        </AdminButton>
                      )}
                      {profile.verificationStatus !== 'REJECTED' && (
                        <AdminButton size="sm" variant="danger" onClick={() => handleUpdate(profile.id, { verificationStatus: 'REJECTED', adminApprovalStatus: 'REJECTED' })}>
                          Reject
                        </AdminButton>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </AdminTable>
          </div>
        </AdminCard>
      )}

      <AdminModal title={`Manage — ${selected?.fullName || ''}`} isOpen={!!selected} onClose={() => setSelected(null)} width={640}>
        {selected && (
          <>
            {saveMsg && <AdminAlert type={saveMsg === 'Saved' ? 'success' : 'error'}>{saveMsg}</AdminAlert>}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 18 }}>
              <div>
                <div style={fieldLabelStyle}>Full Name</div>
                <div style={{ fontWeight: 600 }}>{selected.fullName}</div>
              </div>
              <div>
                <div style={fieldLabelStyle}>Phone</div>
                <a href={`tel:${selected.phoneNumber}`} style={{ color: 'var(--deep-maroon, #6F1D35)', fontWeight: 600 }}>{selected.phoneNumber}</a>
              </div>
              <div>
                <div style={fieldLabelStyle}>Gender / Age</div>
                <div>{selected.gender} · {calcAge(selected.dateOfBirth)}</div>
              </div>
              <div>
                <div style={fieldLabelStyle}>Location</div>
                <div>{selected.city}, {selected.state}</div>
              </div>
              <div>
                <div style={fieldLabelStyle}>Occupation</div>
                <div>{selected.occupation}</div>
              </div>
              <div>
                <div style={fieldLabelStyle}>Education</div>
                <div>{selected.education}</div>
              </div>
              <div>
                <div style={fieldLabelStyle}>Maslak</div>
                <div>{selected.maslak || '—'}</div>
              </div>
              <div>
                <div style={fieldLabelStyle}>Biradari</div>
                <div>{selected.biradari || '—'}</div>
              </div>
            </div>

            <hr style={{ borderColor: '#e2e8f0', margin: '16px 0' }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 18 }}>
              <AdminField label="Verification">
                <AdminSelect value={selected.verificationStatus} onChange={(e) => setSelected((s) => s ? { ...s, verificationStatus: e.target.value } : s)}>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="NEEDS_FOLLOW_UP">Follow Up</option>
                </AdminSelect>
              </AdminField>
              <AdminField label="Admin Approval">
                <AdminSelect value={selected.adminApprovalStatus || 'PENDING'} onChange={(e) => setSelected((s) => s ? { ...s, adminApprovalStatus: e.target.value } : s)}>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </AdminSelect>
              </AdminField>
              <AdminField label="Category">
                <AdminSelect value={selected.category || 'normal'} onChange={(e) => setSelected((s) => s ? { ...s, category: e.target.value } : s)}>
                  <option value="normal">Normal</option>
                  <option value="featured">Featured</option>
                  <option value="premium">Premium</option>
                  <option value="second_marriage">Second Marriage</option>
                  <option value="high_profile">High Profile</option>
                </AdminSelect>
              </AdminField>
              <AdminField label="Payment">
                <AdminSelect value={selected.hasPaid ? 'paid' : 'free'} onChange={(e) => {
                  const v = e.target.value as 'paid' | 'free';
                  setSelected((s) => s ? { ...s, hasPaid: v !== 'free', paymentStatusAction: v } : s);
                }}>
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </AdminSelect>
              </AdminField>
              {selected.hasPaid && (
                <AdminField label="Package">
                  <AdminSelect value={selected.packageType || 'monthly_membership'} onChange={(e) => setSelected((s) => s ? { ...s, packageType: e.target.value } : s)}>
                    <option value="monthly_membership">Monthly Membership</option>
                    <option value="good_profile_package">Good Profile Package</option>
                    <option value="second_marriage_package">Silver Plan</option>
                    <option value="high_profile_package">Gold Package</option>
                  </AdminSelect>
                </AdminField>
              )}
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', alignItems: 'center' }}>
              <AdminButton variant="danger" onClick={() => handleDelete(selected.id)}>
                {deleteConfirm === selected.id ? 'Confirm Delete' : 'Delete'}
              </AdminButton>
              <AdminButton onClick={onSaveChanges} disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </AdminButton>
            </div>
          </>
        )}
      </AdminModal>
    </div>
  );
}

const fieldLabelStyle: React.CSSProperties = {
  fontSize: 10.5,
  color: '#94a3b8',
  fontWeight: 700,
  textTransform: 'uppercase',
  marginBottom: 3,
  letterSpacing: 0.4,
};

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
  paymentStatusAction?: 'paid' | 'free';
  packageType?: string;
}
