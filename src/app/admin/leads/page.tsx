'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from '../../../context/SessionContext';
import { Lead } from '../../../types';
import { getWhatsAppLink } from '../../../lib/whatsapp';
import {
  AdminPageHeader,
  AdminCard,
  AdminBadge,
  AdminButton,
  AdminField,
  AdminInput,
  AdminSelect,
  AdminTextarea,
  AdminTable,
  AdminModal,
  AdminAlert,
  AdminLoading,
} from '../../../components/AdminUI';

const STATUS_OPTIONS = [
  { value: 'new', label: 'New Inquiry' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'follow_up', label: 'Follow Up' },
  { value: 'converted', label: 'Converted' },
  { value: 'closed', label: 'Closed' },
  { value: 'spam', label: 'Spam' },
] as const;

const STATUS_VARIANT: Record<string, 'pending' | 'info' | 'approved' | 'neutral' | 'rejected'> = {
  new: 'pending',
  contacted: 'info',
  follow_up: 'pending',
  converted: 'approved',
  closed: 'neutral',
  spam: 'rejected',
};

export default function AdminLeadsPage() {
  const { getHeaders, reloadTrigger, setReloadTrigger } = useSession();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [packageFilter, setPackageFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [notesInput, setNotesInput] = useState('');
  const [actionError, setActionError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (search) q.set('search', search);
      if (statusFilter) q.set('status', statusFilter);
      if (typeFilter) q.set('inquiryType', typeFilter);
      if (packageFilter) q.set('interestedPackage', packageFilter);

      const res = await fetch(`/api/admin/leads?${q.toString()}`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
    } catch {
      console.error('Failed to fetch admin leads');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, typeFilter, packageFilter, reloadTrigger, getHeaders]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleOpenLead = useCallback((lead: Lead) => {
    setSelectedLead(lead);
    setNotesInput(lead.adminNotes || '');
    setActionError('');
  }, []);

  const handleUpdateLead = useCallback(async (leadId: string, updateData: Record<string, string | boolean | number | null>) => {
    setIsUpdating(true);
    setActionError('');
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(updateData),
      });
      const data = await res.json();
      if (res.ok) {
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead(data.lead);
        }
        setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, ...data.lead } : l)));
        setReloadTrigger((prev: number) => prev + 1);
      } else {
        setActionError(data.error || 'Failed to update lead.');
      }
    } catch {
      setActionError('Network error updating lead.');
    } finally {
      setIsUpdating(false);
    }
  }, [selectedLead, getHeaders, setReloadTrigger]);

  const handleDeleteLead = useCallback(async (leadId: string) => {
    if (!confirm('Delete this lead permanently?')) return;
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, { method: 'DELETE', headers: getHeaders() });
      if (res.ok) {
        if (selectedLead && selectedLead.id === leadId) setSelectedLead(null);
        setReloadTrigger((prev: number) => prev + 1);
      } else {
        alert('Failed to delete lead.');
      }
    } catch {
      alert('Network error deleting lead.');
    }
  }, [selectedLead, getHeaders, setReloadTrigger]);

  return (
    <div>
      <AdminPageHeader
        title="Leads & Inquiries"
        subtitle="Track customer interest requests, callbacks, packages, and profile inquiries."
        actions={
          <AdminButton onClick={fetchLeads} variant="secondary">Refresh</AdminButton>
        }
      />

      <AdminCard>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
          <AdminField label="Search">
            <AdminInput placeholder="Name, phone, city, package…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </AdminField>
          <AdminField label="Status">
            <AdminSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </AdminSelect>
          </AdminField>
          <AdminField label="Inquiry Type">
            <AdminSelect value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="">All Types</option>
              <option value="General Inquiry">General Inquiry</option>
              <option value="Package Inquiry">Package Inquiry</option>
              <option value="Profile Help">Profile Help</option>
              <option value="Verification Help">Verification Help</option>
              <option value="Callback Request">Callback Request</option>
              <option value="Other">Other</option>
            </AdminSelect>
          </AdminField>
          <AdminField label="Interested Package">
            <AdminSelect value={packageFilter} onChange={(e) => setPackageFilter(e.target.value)}>
              <option value="">All Packages</option>
              <option value="Monthly Membership">Monthly Membership</option>
              <option value="Good Profile Package">Good Profile Package</option>
              <option value="Silver Plan">Silver Plan</option>
              <option value="Gold Package">Gold Package</option>
            </AdminSelect>
          </AdminField>
        </div>
        <div style={{ marginTop: 12, fontSize: 12.5, color: '#64748b' }}>
          {loading ? 'Loading…' : `Showing ${leads.length} records`}
        </div>
      </AdminCard>

      {loading ? (
        <AdminCard><AdminLoading /></AdminCard>
      ) : leads.length === 0 ? (
        <AdminCard>
          <div className="admin-empty" style={{ padding: 24 }}>
            <div className="admin-empty__icon">📥</div>
            <div className="admin-empty__title">No leads found</div>
            <div className="admin-empty__desc">Try adjusting the filters above.</div>
          </div>
        </AdminCard>
      ) : (
        <AdminCard style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <AdminTable headers={['Received', 'Name', 'Contact', 'Type', 'Details', 'Priority', 'Status', 'Actions']}>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td style={{ color: '#64748b', whiteSpace: 'nowrap' }}>
                    {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                    })}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{lead.fullName}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>📍 {lead.city}</div>
                  </td>
                  <td>
                    <a href={`tel:${lead.phone}`} style={{ color: 'var(--deep-maroon, #6F1D35)', fontWeight: 500, textDecoration: 'underline' }}>
                      {lead.phone}
                    </a>
                    {lead.email && <div style={{ fontSize: 11, color: '#64748b' }}>{lead.email}</div>}
                  </td>
                  <td><AdminBadge variant="neutral">{lead.inquiryType}</AdminBadge></td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {lead.interestedPackage ? (
                      <strong style={{ color: 'var(--gold-accent, #B8924A)' }}>{lead.interestedPackage.split(' ').slice(1).join(' ')}</strong>
                    ) : lead.interestedProfileId ? (
                      <span style={{ fontSize: 12 }}>Profile: {lead.interestedProfileId.substring(0, 8)}…</span>
                    ) : (
                      <span style={{ color: '#64748b' }}>{lead.message || '—'}</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <AdminBadge variant={lead.priority === 'high' ? 'maroon' : lead.priority === 'low' ? 'info' : 'neutral'}>
                      {lead.priority?.toUpperCase()}
                    </AdminBadge>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <AdminBadge variant={STATUS_VARIANT[lead.status]}>{lead.status.replace('_', ' ').toUpperCase()}</AdminBadge>
                  </td>
                  <td>
                    <div className="admin-table__actions">
                      <AdminButton size="sm" onClick={() => handleOpenLead(lead)}>View</AdminButton>
                      {lead.phone && (
                        <a
                          href={getWhatsAppLink(lead.phone, `Assalamu Alaikum ${lead.fullName}, this is Rishte Forever support.`)}
                          target="_blank" rel="noopener noreferrer"
                          className="admin-btn admin-btn--secondary admin-btn--sm"
                          style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                        >
                          💬 WA
                        </a>
                      )}
                      <AdminButton size="sm" variant="danger" onClick={() => handleDeleteLead(lead.id)}>Delete</AdminButton>
                    </div>
                  </td>
                </tr>
              ))}
            </AdminTable>
          </div>
        </AdminCard>
      )}

      <AdminModal title="Lead Details" isOpen={!!selectedLead} onClose={() => setSelectedLead(null)} width={620}>
        {selectedLead && (
          <>
            {actionError && <AdminAlert type="error">{actionError}</AdminAlert>}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 16 }}>
              <div>
                <div style={modalLabelStyle}>Customer Name</div>
                <strong>{selectedLead.fullName}</strong>
              </div>
              <div>
                <div style={modalLabelStyle}>City</div>
                <strong>{selectedLead.city}</strong>
              </div>
              <div>
                <div style={modalLabelStyle}>Phone</div>
                <strong>{selectedLead.phone}</strong>
              </div>
              <div>
                <div style={modalLabelStyle}>Email</div>
                <span>{selectedLead.email || 'None'}</span>
              </div>
            </div>

            <hr style={{ borderColor: '#e2e8f0', margin: '14px 0' }} />

            <div style={{ marginBottom: 16 }}>
              <div style={modalLabelStyle}>Inquiry Context</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <AdminBadge variant="neutral">Type: {selectedLead.inquiryType}</AdminBadge>
                {selectedLead.interestedPackage && (
                  <AdminBadge variant="orange">{selectedLead.interestedPackage}</AdminBadge>
                )}
                {selectedLead.sourcePage && (
                  <AdminBadge variant="info">Page: {selectedLead.sourcePage}</AdminBadge>
                )}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={modalLabelStyle}>Message</div>
              <div style={{ background: '#fafbfd', padding: 12, borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 13.5, lineHeight: 1.5 }}>
                {selectedLead.message || 'No message provided.'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              <a href={`tel:${selectedLead.phone}`} className="admin-btn admin-btn--secondary" style={{ flex: 1, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                Call
              </a>
              <a
                href={getWhatsAppLink(selectedLead.phone, `Assalamu Alaikum ${selectedLead.fullName}, this is Rishte Forever support.`)}
                target="_blank" rel="noopener noreferrer"
                className="admin-btn admin-btn--primary"
                style={{ flex: 1, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              >
                WhatsApp
              </a>
            </div>

            <hr style={{ borderColor: '#e2e8f0', margin: '14px 0' }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 16 }}>
              <AdminField label="Status">
                <AdminSelect value={selectedLead.status} onChange={(e) => handleUpdateLead(selectedLead.id, { status: e.target.value })} disabled={isUpdating}>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </AdminSelect>
              </AdminField>
              <AdminField label="Priority">
                <AdminSelect value={selectedLead.priority} onChange={(e) => handleUpdateLead(selectedLead.id, { priority: e.target.value })} disabled={isUpdating}>
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                </AdminSelect>
              </AdminField>
            </div>

            <div style={{ marginBottom: 20 }}>
              <AdminField label="Admin Notes">
                <AdminTextarea
                  placeholder="Log follow-up notes…"
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  disabled={isUpdating}
                />
              </AdminField>
              <AdminButton size="sm" variant="secondary" style={{ marginTop: 8 }} onClick={() => handleUpdateLead(selectedLead.id, { adminNotes: notesInput })} disabled={isUpdating}>
                Save Notes
              </AdminButton>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
              <AdminButton variant="danger" onClick={() => handleDeleteLead(selectedLead.id)}>Delete</AdminButton>
              <AdminButton variant="secondary" onClick={() => setSelectedLead(null)}>Close</AdminButton>
            </div>
          </>
        )}
      </AdminModal>
    </div>
  );
}

const modalLabelStyle: React.CSSProperties = {
  fontSize: 10.5,
  color: '#94a3b8',
  fontWeight: 700,
  textTransform: 'uppercase',
  marginBottom: 3,
  letterSpacing: 0.4,
};
