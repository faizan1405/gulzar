'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSimulator } from '../../../context/SimulatorContext';
import { Lead } from '../../../types';
import { getWhatsAppLink } from '../../../lib/whatsapp';
import { SectionHeading, FloralCorner } from '../../../components/NikahComponents';

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

const STATUS_COLORS: Record<string, React.CSSProperties> = {
  new:        { background: '#d1fae5', color: '#065f46' },
  contacted:  { background: '#dbeafe', color: '#1e40af' },
  follow_up:  { background: '#fef3c7', color: '#92400e' },
  converted:  { background: '#ecfdf5', color: '#047857', border: '1px solid #10b981' },
  closed:     { background: '#f3f4f6', color: '#374151' },
  spam:       { background: '#fee2e2', color: '#991b1b' },
};

export default function AdminEventsPage() {
  const { getSimulatorHeaders, reloadTrigger, setReloadTrigger } = useSimulator();
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

      const res = await fetch(`/api/admin/leads?${q}`, { headers: getSimulatorHeaders() });
      if (res.ok) {
        const data = await res.json();
        // Show all event-type leads even when filter is cleared
        let result: Lead[] = data.leads || [];
        if (!typeFilter) {
          // Re-fetch without type filter and filter client-side for all event categories
          const allRes = await fetch(`/api/admin/leads?${new URLSearchParams({ ...(search ? { search } : {}), ...(statusFilter ? { status: statusFilter } : {}) })}`, { headers: getSimulatorHeaders() });
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
  }, [search, statusFilter, typeFilter, getSimulatorHeaders]);

  useEffect(() => { fetchLeads(); }, [fetchLeads, reloadTrigger]);

  const handleUpdate = async (leadId: string, updates: Record<string, any>) => {
    setSaving(true);
    setSaveMsg('');
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: { ...getSimulatorHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (res.ok) {
        setSaveMsg('✓ Updated');
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
    <div style={{ padding: '20px 0 60px' }} className="font-sans">
      <SectionHeading
        title="Event Management Inquiries"
        subtitle="Track wedding planning, venue, catering, photography, mehendi, and all event service requests."
        scriptText="Admin Desk"
      />

      {/* Stats bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {['new', 'contacted', 'follow_up', 'converted'].map(s => (
          <div key={s} style={{ background: 'var(--warm-ivory)', border: '1.5px solid var(--border-color)', borderRadius: '10px', padding: '10px 16px', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>{s.replace('_', ' ')}: </span>
            <strong style={{ color: 'var(--deep-maroon)' }}>
              {leads.filter(l => l.status === s).length}
            </strong>
          </div>
        ))}
        <div style={{ background: 'var(--warm-ivory)', border: '1.5px solid var(--border-color)', borderRadius: '10px', padding: '10px 16px', fontSize: '12px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Total: </span>
          <strong style={{ color: 'var(--deep-maroon)' }}>{leads.length}</strong>
        </div>
      </div>

      {/* Filters */}
      <div className="card-theme-wrapper" style={{ padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px 200px 200px', gap: '14px' }} className="grid-mobile-1">
          <div>
            <label className="form-label">Search</label>
            <input type="text" className="form-control" placeholder="Name, phone, city…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div>
            <label className="form-label">Event Category</label>
            <select className="form-control" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="">All Event Types</option>
              {EVENT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Status</label>
            <select className="form-control" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
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
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={fetchLeads}>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card-theme-wrapper" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>Loading event inquiries…</div>
        ) : leads.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎊</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No event inquiries yet. They will appear here once submitted via the website.</div>
          </div>
        ) : (
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--soft-cream)', borderBottom: '2px solid var(--border-color)', color: 'var(--deep-maroon)', fontWeight: 'bold', height: '44px' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Client</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Service Needed</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Message</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map(lead => (
                  <tr key={lead.id} style={{ borderBottom: '1px solid var(--border-color)' }} className="table-row-hover">
                    <td style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '12px' }}>
                      {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 600 }}>{lead.fullName}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>📍 {lead.city}</div>
                      <a href={`tel:${lead.phone}`} style={{ fontSize: '11px', color: 'var(--deep-maroon)' }}>{lead.phone}</a>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span className="card-badge" style={{ background: 'var(--warm-ivory)', border: '1px solid var(--border-color)', fontSize: '11px', padding: '3px 9px' }}>
                        {lead.inquiryType}
                      </span>
                    </td>
                    <td style={{ padding: '12px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '12px', color: 'var(--text-muted)' }}>
                      {lead.message || '—'}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{ display: 'inline-block', padding: '3px 9px', borderRadius: '10px', fontSize: '11px', fontWeight: 600, ...(STATUS_COLORS[lead.status] || {}) }}>
                        {lead.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button className="btn btn-primary" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={() => { setSelected(lead); setNotesInput(lead.adminNotes || ''); setSaveMsg(''); }}>
                          View
                        </button>
                        <a
                          href={getWhatsAppLink(lead.phone, `Assalamu Alaikum ${lead.fullName}, this is Rishte Forever. We received your event service inquiry and would like to discuss further.`)}
                          target="_blank" rel="noopener noreferrer"
                          style={{ padding: '4px 8px', fontSize: '11px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '4px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', fontWeight: 600 }}
                        >
                          💬 WA
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="card-theme-wrapper" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px', width: '95%', margin: '20px', padding: '36px', border: '2px solid var(--gold-accent)', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <FloralCorner position="tl" color="var(--gold-accent)" />
            <FloralCorner position="tr" color="var(--gold-accent)" />
            <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: 16, right: 16, fontSize: 24, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>×</button>

            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--deep-maroon)', fontSize: '22px', marginBottom: '20px' }}>
              🎊 Event Inquiry Details
            </h3>

            {saveMsg && (
              <div style={{ background: saveMsg.startsWith('✓') ? '#d1fae5' : '#fee2e2', color: saveMsg.startsWith('✓') ? '#065f46' : '#991b1b', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', marginBottom: '16px' }}>
                {saveMsg}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }} className="grid-mobile-1">
              {[['Client Name', selected.fullName], ['City', selected.city], ['Phone', selected.phone], ['Email', selected.email || '—'], ['Service Type', selected.inquiryType], ['Source', selected.sourcePage || '—']].map(([label, val]) => (
                <div key={label}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>{label}</span>
                  <strong style={{ fontSize: '14px' }}>{val}</strong>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Client Message</span>
              <p style={{ background: '#fafafa', padding: '12px', borderRadius: '8px', border: '1.5px solid var(--border-color)', fontSize: '13.5px', lineHeight: 1.5 }}>
                {selected.message || 'No message provided.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <a href={`tel:${selected.phone}`} className="btn btn-gold" style={{ flex: 1, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>📞 Call</a>
              <a href={getWhatsAppLink(selected.phone, `Assalamu Alaikum ${selected.fullName}, this is Rishte Forever Event Services. We received your inquiry for ${selected.inquiryType} and would like to discuss further. Jazakallah Khair.`)} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ flex: 1, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>💬 WhatsApp</a>
            </div>

            <hr style={{ borderColor: 'var(--border-color)', margin: '16px 0' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label className="form-label">Status</label>
                <select className="form-control" value={selected.status} onChange={e => setSelected(s => s ? { ...s, status: e.target.value } : s)} disabled={saving}>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="follow_up">Follow Up</option>
                  <option value="converted">Converted / Booked</option>
                  <option value="closed">Closed</option>
                  <option value="spam">Spam</option>
                </select>
              </div>
              <div>
                <label className="form-label">Priority</label>
                <select className="form-control" value={selected.priority} onChange={e => setSelected(s => s ? { ...s, priority: e.target.value } : s)} disabled={saving}>
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label className="form-label">Admin Notes</label>
              <textarea className="form-control" rows={3} value={notesInput} onChange={e => setNotesInput(e.target.value)} disabled={saving} placeholder="Venue discussed, vendor shortlisted, budget confirmed…" />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setSelected(null)}>Close</button>
              <button className="btn btn-gold" disabled={saving} onClick={() => handleUpdate(selected.id, { status: selected.status, priority: selected.priority, adminNotes: notesInput })}>
                {saving ? 'Saving…' : '💾 Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
