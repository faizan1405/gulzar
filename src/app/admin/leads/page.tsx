'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { Lead } from '../../../types';
import { getWhatsAppLink } from '../../../lib/whatsapp';
import { AdminPageHeader, AdminCard, AdminTable, AdminBadge, AdminButton, AdminModal } from '../../../components/AdminUI';

export default function AdminLeadsPage() {
  const { reloadTrigger, setReloadTrigger } = useApp();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [packageFilter, setPackageFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Detail Modal / Drawer states
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [notesInput, setNotesInput] = useState('');
  const [actionError, setActionError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch leads on filter/search updates or trigger refreshes
  useEffect(() => {
    async function fetchLeads() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.set('search', search);
        if (statusFilter) queryParams.set('status', statusFilter);
        if (typeFilter) queryParams.set('inquiryType', typeFilter);
        if (packageFilter) queryParams.set('interestedPackage', packageFilter);

        const url = `/api/admin/leads?${queryParams.toString()}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setLeads(data.leads || []);
        }
      } catch (err) {
        console.error('Failed to fetch admin leads:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeads();
  }, [search, statusFilter, typeFilter, packageFilter, reloadTrigger]);

  // Handle opening lead details
  const handleOpenLead = (lead: Lead) => {
    setSelectedLead(lead);
    setNotesInput(lead.adminNotes || '');
    setActionError('');
  };

  // Perform lead update
  const handleUpdateLead = async (leadId: string, updateData: any) => {
    setIsUpdating(true);
    setActionError('');
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      const data = await res.json();
      if (res.ok) {
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead(data.lead);
        }
        setReloadTrigger((prev: number) => prev + 1);
      } else {
        setActionError(data.error || 'Failed to update lead.');
      }
    } catch {
      setActionError('Network error updating lead.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete lead
  const handleDeleteLead = async (leadId: string) => {
    if (!confirm('Are you sure you want to delete this lead record? This action is permanent.')) return;
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead(null);
        }
        setReloadTrigger((prev: number) => prev + 1);
        alert('Lead record deleted.');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete lead.');
      }
    } catch {
      alert('Network error deleting lead.');
    }
  };

  // Helper for priority badge styling
  const getPriorityStyle = (priority: string) => {
    const styles: Record<string, React.CSSProperties> = {
      high: { color: '#991b1b', fontWeight: 600, background: '#fee2e2', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' },
      normal: { color: '#334155', fontWeight: 500, fontSize: '11px' },
      low: { color: '#64748b', fontSize: '11px' }
    };
    return styles[priority] || {};
  };

  return (
    <div className="font-sans">
      <AdminPageHeader
        title="Leads & Inquiries Manager"
        subtitle="Track customer interest requests, callbacks, packages, and profile inquiries in one location."
      />

      {/* Filter and Search Panel */}
      <AdminCard style={{ marginBottom: '30px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label className="admin-label" htmlFor="adminLeadSearch">Search Keyword</label>
            <input
              id="adminLeadSearch"
              type="text"
              className="admin-input"
              placeholder="Search by name, phone, city, package..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label className="admin-label" htmlFor="adminStatusFilter">Status Filter</label>
            <select
              id="adminStatusFilter"
              className="admin-input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="follow_up">Follow Up</option>
              <option value="converted">Converted</option>
              <option value="closed">Closed</option>
              <option value="spam">Spam</option>
            </select>
          </div>
          <div>
            <label className="admin-label" htmlFor="adminTypeFilter">Inquiry Type</label>
            <select
              id="adminTypeFilter"
              className="admin-input"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="">All Types</option>
              <option value="General Inquiry">General Inquiry</option>
              <option value="Package Inquiry">Package Inquiry</option>
              <option value="Profile Help">Profile Help</option>
              <option value="Verification Help">Verification Help</option>
              <option value="Callback Request">Callback Request</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="admin-label" htmlFor="adminPkgFilter">Interested Package</label>
            <select
              id="adminPkgFilter"
              className="admin-input"
              value={packageFilter}
              onChange={(e) => setPackageFilter(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="">All Packages</option>
              <option value="₹1 Monthly Membership">₹1 Monthly Membership</option>
              <option value="₹1 Good Profiles Package">₹1 Good Profiles</option>
              <option value="₹1 Silver Plan">₹1 Silver Plan</option>
              <option value="₹1 Gold Package">₹1 Gold Package</option>
            </select>
          </div>
        </div>
      </AdminCard>

      {/* Leads Table Card */}
      <AdminCard style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
            <div style={{ fontSize: '16px', fontWeight: 500, color: '#334155' }}>Loading leads...</div>
          </div>
        ) : leads.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
            <div style={{ fontSize: '16px', fontWeight: 500, color: '#334155' }}>No leads found</div>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <AdminTable headers={['Received', 'Name', 'Contact', 'Type', 'Details', 'Priority', 'Status', 'Actions']}>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td>
                  <div style={{ color: '#64748b', fontSize: '12px' }}>
                    {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}<br/>
                    {new Date(lead.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{lead.fullName}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>📍 {lead.city}</div>
                </td>
                <td>
                  <a href={`tel:${lead.phone}`} style={{ color: 'var(--primary-brand)', textDecoration: 'none', fontWeight: 600, display: 'block' }}>
                    {lead.phone}
                  </a>
                  {lead.email && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{lead.email}</div>}
                </td>
                <td>
                  <span style={{ backgroundColor: '#f1f5f9', color: '#475569', fontSize: '11px', padding: '4px 8px', borderRadius: '4px', fontWeight: 500 }}>
                    {lead.inquiryType}
                  </span>
                </td>
                <td>
                  <div style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '13px' }}>
                    {lead.interestedPackage ? (
                      <strong style={{ color: '#b45309' }}>{lead.interestedPackage.split(' ')[1] || lead.interestedPackage}</strong>
                    ) : lead.interestedProfileId ? (
                      <span style={{ color: '#475569' }}>Profile: {lead.interestedProfileId.substring(0, 8)}...</span>
                    ) : (
                      <span style={{ color: '#64748b' }}>{lead.message || '—'}</span>
                    )}
                  </div>
                </td>
                <td>
                  <span style={getPriorityStyle(lead.priority)}>{lead.priority.toUpperCase()}</span>
                </td>
                <td>
                  <AdminBadge status={lead.status === 'converted' ? 'APPROVED' : lead.status === 'spam' || lead.status === 'closed' ? 'REJECTED' : lead.status === 'new' ? 'INFO' : 'PENDING'}>
                    {lead.status.replace('_', ' ').toUpperCase()}
                  </AdminBadge>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <AdminButton onClick={() => handleOpenLead(lead)} variant="secondary" style={{ padding: '4px 8px', fontSize: '11px' }}>
                      View
                    </AdminButton>
                    {lead.phone && (
                      <a
                        href={getWhatsAppLink(lead.phone, `Assalamu Alaikum ${lead.fullName}, this is Rishte Forever support. We received your inquiry and would like to guide you further.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '4px 8px',
                          fontSize: '11px',
                          backgroundColor: '#22c55e',
                          color: '#fff',
                          textDecoration: 'none',
                          borderRadius: '6px',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center'
                        }}
                      >
                        WA
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </AdminTable>
        )}
      </AdminCard>

      {/* Details Modal */}
      {selectedLead && (
        <AdminModal
          title="Inquiry Details"
          isOpen={!!selectedLead}
          onClose={() => setSelectedLead(null)}
          width="700px"
        >
          {actionError && (
            <div style={{ backgroundColor: '#fef2f2', color: '#991b1b', padding: '12px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px', border: '1px solid #fecaca' }}>
              ⚠️ {actionError}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Customer Name</div>
              <div style={{ fontWeight: 600, color: '#0f172a' }}>{selectedLead.fullName}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>City Location</div>
              <div style={{ fontWeight: 500, color: '#0f172a' }}>{selectedLead.city}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Phone Info</div>
              <div style={{ fontWeight: 600, color: '#0f172a' }}>{selectedLead.phone}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Email Info</div>
              <div style={{ fontWeight: 500, color: '#475569' }}>{selectedLead.email || 'None provided'}</div>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, marginBottom: '8px' }}>Inquiry Context</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}>
                Type: {selectedLead.inquiryType}
              </span>
              {selectedLead.interestedPackage && (
                <span style={{ background: '#fef3c7', border: '1px solid #fcd34d', color: '#92400e', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
                  Package: {selectedLead.interestedPackage}
                </span>
              )}
              {selectedLead.interestedProfileId && (
                <span style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', color: '#065f46', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
                  Profile ID: {selectedLead.interestedProfileId}
                </span>
              )}
              {selectedLead.sourcePage && (
                <span style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}>
                  Page: {selectedLead.sourcePage}
                </span>
              )}
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, marginBottom: '8px' }}>Submitted Message</div>
            <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '8px', fontSize: '14px', color: '#334155', border: '1px solid #e2e8f0', lineHeight: 1.6 }}>
              {selectedLead.message || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>No message provided.</span>}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <a
              href={`tel:${selectedLead.phone}`}
              style={{ flex: 1, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--primary-brand)', color: '#fff', padding: '10px', borderRadius: '6px', fontWeight: 600, fontSize: '14px', border: '1px solid rgba(0,0,0,0.1)' }}
            >
              📞 Call Client
            </a>
            <a
              href={getWhatsAppLink(selectedLead.phone, `Assalamu Alaikum ${selectedLead.fullName}, this is Rishte Forever support. We received your inquiry and would like to guide you further.`)}
              target="_blank"
              rel="noopener noreferrer"
              style={{ flex: 1, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#22c55e', color: '#fff', padding: '10px', borderRadius: '6px', fontWeight: 600, fontSize: '14px', border: '1px solid rgba(0,0,0,0.1)' }}
            >
              💬 WhatsApp
            </a>
          </div>

          <div style={{ height: '1px', background: '#e2e8f0', margin: '0 -24px 24px -24px' }}></div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label className="admin-label">Update Status</label>
              <select
                className="admin-input"
                value={selectedLead.status}
                onChange={(e) => handleUpdateLead(selectedLead.id, { status: e.target.value })}
                disabled={isUpdating}
                style={{ width: '100%' }}
              >
                <option value="new">New Inquiry</option>
                <option value="contacted">Contacted</option>
                <option value="follow_up">Follow Up</option>
                <option value="converted">Converted / Active Match</option>
                <option value="closed">Closed</option>
                <option value="spam">Spam / Blocked</option>
              </select>
            </div>
            <div>
              <label className="admin-label">Change Priority</label>
              <select
                className="admin-input"
                value={selectedLead.priority}
                onChange={(e) => handleUpdateLead(selectedLead.id, { priority: e.target.value })}
                disabled={isUpdating}
                style={{ width: '100%' }}
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label className="admin-label">Internal Admin Notes</label>
            <textarea
              className="admin-input"
              rows={4}
              placeholder="Log follow-up calls, family references, or match preferences discussed..."
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              disabled={isUpdating}
              style={{ width: '100%', resize: 'vertical' }}
            />
            <AdminButton
              variant="secondary"
              style={{ marginTop: '12px' }}
              onClick={() => handleUpdateLead(selectedLead.id, { adminNotes: notesInput })}
              disabled={isUpdating}
            >
              {isUpdating ? 'Saving notes...' : 'Save Admin Notes'}
            </AdminButton>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '20px', margin: '0 -24px -24px -24px', padding: '20px 24px', background: '#f8fafc' }}>
            <AdminButton variant="danger" onClick={() => handleDeleteLead(selectedLead.id)}>
              Delete Lead
            </AdminButton>
            <AdminButton variant="ghost" onClick={() => setSelectedLead(null)}>
              Close View
            </AdminButton>
          </div>
        </AdminModal>
      )}
    </div>
  );
}
