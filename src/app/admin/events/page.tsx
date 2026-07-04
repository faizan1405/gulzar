'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../../context/AppContext';
import { Lead } from '../../../types';
import { getWhatsAppLink } from '../../../lib/whatsapp';
import { AdminPageHeader, AdminCard, AdminTable, AdminBadge, AdminButton, AdminModal } from '../../../components/AdminUI';

const EVENT_CATEGORIES = [
  'Event Management',
  'Wedding Planning',
  'Decoration',
  'Catering',
  'Photography',
  'Videography',
  'Makeup & Beauty',
  'Mehendi',
  'Venue',
  'Qazi / Nikah',
  'Music / Entertainment',
  'Invitation Cards',
  'Event Coordination',
];

export default function AdminEventsPage() {
  const { reloadTrigger, setReloadTrigger } = useApp();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selected, setSelected] = useState<Lead | null>(null);
  const [notesInput, setNotesInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (search) q.set('search', search);
      if (statusFilter) q.set('status', statusFilter);
      // Fetch all event-related inquiry types
      const eventType = typeFilter || 'Event Management';
      q.set('inquiryType', eventType);

      const res = await fetch(`/api/admin/leads?${q}`, { headers: { 'Content-Type': 'application/json' } });
      if (res.ok) {
        const data = await res.json();
        // Show all event-type leads even when filter is cleared
        let result: Lead[] = data.leads || [];
        if (!typeFilter) {
          // Re-fetch without type filter and filter client-side for all event categories
          const allRes = await fetch(`/api/admin/leads?${new URLSearchParams({ ...(search ? { search } : {}), ...(statusFilter ? { status: statusFilter } : {}) })}`, { headers: { 'Content-Type': 'application/json' } });
          if (allRes.ok) {
            const allData = await allRes.json();
            result = (allData.leads || []).filter((l: Lead) =>
              EVENT_CATEGORIES.some(cat => l.inquiryType?.toLowerCase().includes(cat.toLowerCase())) ||
              l.sourcePage?.toLowerCase().includes('event') ||
              l.message?.toLowerCase().includes('event') ||
              l.message?.toLowerCase().includes('wedding') ||
              l.message?.toLowerCase().includes('nikah')
            );
          }
        }
        setLeads(result);
      }
    } catch (e) {
      console.error('Failed to fetch event leads', e);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, typeFilter]);

  useEffect(() => { fetchLeads(); }, [fetchLeads, reloadTrigger]);

  const handleUpdate = async (leadId: string, updates: Record<string, any>) => {
    setSaving(true);
    setSaveMsg('');
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (res.ok) {
        setSaveMsg('✓ Updated successfully');
        if (selected?.id === leadId) setSelected(data.lead);
        setReloadTrigger((p: number) => p + 1);
      } else {
        setSaveMsg(data.error || 'Update failed.');
      }
    } catch {
      setSaveMsg('Network error.');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(''), 3000);
    }
  };

  return (
    <div className="font-sans">
      <AdminPageHeader
        title="Event Management Inquiries"
        subtitle="Track wedding planning, venue, catering, photography, mehendi, and all event service requests."
      />

      {/* Stats bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {['new', 'contacted', 'follow_up', 'converted'].map(s => (
          <div key={s} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 16px', fontSize: '13px' }}>
            <span style={{ color: '#64748b', textTransform: 'capitalize', fontWeight: 500 }}>{s.replace('_', ' ')}: </span>
            <strong style={{ color: '#0f172a' }}>
              {leads.filter(l => l.status === s).length}
            </strong>
          </div>
        ))}
        <div style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px 16px', fontSize: '13px' }}>
          <span style={{ color: '#475569', fontWeight: 500 }}>Total: </span>
          <strong style={{ color: '#0f172a' }}>{leads.length}</strong>
        </div>
      </div>

      {/* Filters */}
      <AdminCard style={{ marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px 200px 150px', gap: '16px' }}>
          <div>
            <label className="admin-label">Search</label>
            <input type="text" className="admin-input" placeholder="Name, phone, city…" value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%' }} />
          </div>
          <div>
            <label className="admin-label">Event Category</label>
            <select className="admin-input" value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ width: '100%' }}>
              <option value="">All Event Types</option>
              {EVENT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="admin-label">Status</label>
            <select className="admin-input" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: '100%' }}>
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="follow_up">Follow Up</option>
              <option value="converted">Converted</option>
              <option value="closed">Closed</option>
              <option value="spam">Spam</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <AdminButton onClick={fetchLeads} style={{ width: '100%', height: '38px' }}>
              Refresh
            </AdminButton>
          </div>
        </div>
      </AdminCard>

      {/* Table */}
      <AdminCard style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
            <div style={{ fontSize: '16px', fontWeight: 500, color: '#334155' }}>Loading event inquiries...</div>
          </div>
        ) : leads.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎊</div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>No event inquiries yet. They will appear here once submitted via the website.</div>
          </div>
        ) : (
          <AdminTable headers={['Date', 'Client', 'Service Needed', 'Message', 'Status', 'Actions']}>
            {leads.map(lead => (
              <tr key={lead.id}>
                <td>
                  <div style={{ color: '#64748b', fontSize: '12px' }}>
                    {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{lead.fullName}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>📍 {lead.city}</div>
                  <a href={`tel:${lead.phone}`} style={{ fontSize: '12px', color: 'var(--primary-brand)', textDecoration: 'none', fontWeight: 600, display: 'block', marginTop: '4px' }}>{lead.phone}</a>
                </td>
                <td>
                  <span style={{ backgroundColor: '#f1f5f9', color: '#475569', fontSize: '11px', padding: '4px 8px', borderRadius: '4px', fontWeight: 500 }}>
                    {lead.inquiryType}
                  </span>
                </td>
                <td>
                  <div style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '13px', color: '#475569' }}>
                    {lead.message || '—'}
                  </div>
                </td>
                <td>
                  <AdminBadge status={lead.status === 'converted' ? 'APPROVED' : lead.status === 'spam' || lead.status === 'closed' ? 'REJECTED' : lead.status === 'new' ? 'INFO' : 'PENDING'}>
                    {lead.status.replace('_', ' ').toUpperCase()}
                  </AdminBadge>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <AdminButton onClick={() => { setSelected(lead); setNotesInput(lead.adminNotes || ''); setSaveMsg(''); }} variant="secondary" style={{ padding: '4px 8px', fontSize: '11px' }}>
                      View
                    </AdminButton>
                    <a
                      href={getWhatsAppLink(lead.phone, `Assalamu Alaikum ${lead.fullName}, this is Rishte Forever Event Services. We received your inquiry for ${lead.inquiryType} and would like to discuss further. Jazakallah Khair.`)}
                      target="_blank" rel="noopener noreferrer"
                      style={{ padding: '4px 8px', fontSize: '11px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '6px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', fontWeight: 600 }}
                    >
                      WA
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </AdminTable>
        )}
      </AdminCard>

      {/* Detail modal */}
      {selected && (
        <AdminModal
          title="🎊 Event Inquiry Details"
          isOpen={!!selected}
          onClose={() => setSelected(null)}
          width="600px"
        >
          {saveMsg && (
            <div style={{ background: saveMsg.startsWith('✓') ? '#f0fdf4' : '#fef2f2', color: saveMsg.startsWith('✓') ? '#166534' : '#991b1b', padding: '12px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px', border: `1px solid ${saveMsg.startsWith('✓') ? '#bbf7d0' : '#fecaca'}` }}>
              {saveMsg}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            {[['Client Name', selected.fullName], ['City', selected.city], ['Phone', selected.phone], ['Email', selected.email || '—'], ['Service Type', selected.inquiryType], ['Source', selected.sourcePage || '—']].map(([label, val]) => (
              <div key={label}>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>{label}</div>
                <div style={{ fontWeight: 500, color: '#0f172a' }}>{val}</div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, marginBottom: '8px' }}>Client Message</div>
            <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '8px', fontSize: '14px', color: '#334155', border: '1px solid #e2e8f0', lineHeight: 1.6 }}>
              {selected.message || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>No message provided.</span>}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <a href={`tel:${selected.phone}`} style={{ flex: 1, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--primary-brand)', color: '#fff', padding: '10px', borderRadius: '6px', fontWeight: 600, fontSize: '14px', border: '1px solid rgba(0,0,0,0.1)' }}>📞 Call</a>
            <a href={getWhatsAppLink(selected.phone, `Assalamu Alaikum ${selected.fullName}, this is Rishte Forever Event Services. We received your inquiry for ${selected.inquiryType} and would like to discuss further. Jazakallah Khair.`)} target="_blank" rel="noopener noreferrer" style={{ flex: 1, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#22c55e', color: '#fff', padding: '10px', borderRadius: '6px', fontWeight: 600, fontSize: '14px', border: '1px solid rgba(0,0,0,0.1)' }}>💬 WhatsApp</a>
          </div>

          <div style={{ height: '1px', background: '#e2e8f0', margin: '0 -24px 24px -24px' }}></div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label className="admin-label">Status</label>
              <select className="admin-input" value={selected.status} onChange={e => setSelected(s => s ? { ...s, status: e.target.value } : s)} disabled={saving} style={{ width: '100%' }}>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="follow_up">Follow Up</option>
                <option value="converted">Converted / Booked</option>
                <option value="closed">Closed</option>
                <option value="spam">Spam</option>
              </select>
            </div>
            <div>
              <label className="admin-label">Priority</label>
              <select className="admin-input" value={selected.priority} onChange={e => setSelected(s => s ? { ...s, priority: e.target.value } : s)} disabled={saving} style={{ width: '100%' }}>
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label className="admin-label">Admin Notes</label>
            <textarea className="admin-input" rows={3} value={notesInput} onChange={e => setNotesInput(e.target.value)} disabled={saving} placeholder="Venue discussed, vendor shortlisted, budget confirmed…" style={{ width: '100%', resize: 'vertical' }} />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '20px', margin: '0 -24px -24px -24px', padding: '20px 24px', background: '#f8fafc' }}>
            <AdminButton variant="ghost" onClick={() => setSelected(null)}>Close</AdminButton>
            <AdminButton disabled={saving} onClick={() => handleUpdate(selected.id, { status: selected.status, priority: selected.priority, adminNotes: notesInput })}>
              {saving ? 'Saving...' : 'Save Changes'}
            </AdminButton>
          </div>
        </AdminModal>
      )}
    </div>
  );
}
