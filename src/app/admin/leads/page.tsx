'use client';

import React, { useState, useEffect } from 'react';
import { useSimulator } from '../../../context/SimulatorContext';
import { Lead } from '../../../types';
import { getWhatsAppLink } from '../../../lib/whatsapp';
import { SectionHeading, FloralCorner } from '../../../components/NikahComponents';

export default function AdminLeadsPage() {
  const { getSimulatorHeaders, reloadTrigger, setReloadTrigger } = useSimulator();

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
        const headers = getSimulatorHeaders();

        const res = await fetch(url, { headers });
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
  }, [search, statusFilter, typeFilter, packageFilter, reloadTrigger, getSimulatorHeaders]);

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
        headers: getSimulatorHeaders(),
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
        headers: getSimulatorHeaders()
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

  // Helper for status badge styling
  const getStatusBadgeStyle = (status: string) => {
    const styles: Record<string, React.CSSProperties> = {
      new: { backgroundColor: '#d1fae5', color: '#065f46' }, // soft green
      contacted: { backgroundColor: '#dbeafe', color: '#1e40af' }, // soft blue
      follow_up: { backgroundColor: '#fef3c7', color: '#92400e' }, // soft amber
      converted: { backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #10b981' }, // emerald
      closed: { backgroundColor: '#f3f4f6', color: '#374151' }, // grey
      spam: { backgroundColor: '#fee2e2', color: '#991b1b' }, // soft red
    };
    return styles[status] || { backgroundColor: '#e5e7eb', color: '#374151' };
  };

  // Helper for priority badge styling
  const getPriorityStyle = (priority: string) => {
    const styles: Record<string, React.CSSProperties> = {
      high: { color: 'var(--deep-maroon)', fontWeight: 'bold' },
      normal: { color: 'var(--text-dark)' },
      low: { color: 'var(--text-muted)' }
    };
    return styles[priority] || {};
  };

  return (
    <div style={{ padding: '20px 0 60px 0' }} className="font-sans">
      <SectionHeading
        title="Leads & Inquiries Manager"
        subtitle="Track customer interest requests, callbacks, packages, and profile inquiries in one location."
        scriptText="Admin Desk"
      />

      {/* Filter and Search Panel */}
      <div className="card-theme-wrapper" style={{ padding: '24px', marginBottom: '30px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr repeat(3, 180px)', gap: '16px' }} className="grid-mobile-1">
          <div>
            <label className="form-label" htmlFor="adminLeadSearch">Search Keyword</label>
            <input
              id="adminLeadSearch"
              type="text"
              className="form-control"
              placeholder="Search by name, phone, city, package..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="adminStatusFilter">Status Filter</label>
            <select
              id="adminStatusFilter"
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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
            <label className="form-label" htmlFor="adminTypeFilter">Inquiry Type</label>
            <select
              id="adminTypeFilter"
              className="form-control"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
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
            <label className="form-label" htmlFor="adminPkgFilter">Interested Package</label>
            <select
              id="adminPkgFilter"
              className="form-control"
              value={packageFilter}
              onChange={(e) => setPackageFilter(e.target.value)}
            >
              <option value="">All Packages</option>
              <option value="₹300 Monthly Membership">₹300 Monthly Membership</option>
              <option value="₹5,500 Good Profiles Package">₹5,500 Good Profiles</option>
              <option value="₹11,000 Second Marriage Package">₹11,000 Second Marriage</option>
              <option value="₹21,000 High Profile Package">₹21,000 High Profile</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads Table Card */}
      <div className="card-theme-wrapper" style={{ padding: '0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Loading leads...
          </div>
        ) : leads.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No leads found matching current criteria.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--soft-cream)', borderBottom: '2px solid var(--border-color)', height: '44px', color: 'var(--deep-maroon)', fontWeight: 'bold' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Received Date</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Contact Info</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Type</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Details</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Priority</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} style={{ borderBottom: '1px solid var(--border-color)', height: '54px' }} className="table-row-hover">
                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>
                      {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td style={{ padding: '12px', fontWeight: 600, color: 'var(--text-dark)' }}>
                      {lead.fullName}
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'normal' }}>📍 {lead.city}</div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <a href={`tel:${lead.phone}`} style={{ color: 'var(--deep-maroon)', textDecoration: 'underline', fontWeight: '500' }}>
                        {lead.phone}
                      </a>
                      {lead.email && <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{lead.email}</div>}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span className="card-badge" style={{ backgroundColor: 'var(--warm-ivory)', border: '1px solid var(--border-color)', color: 'var(--text-dark)', fontSize: '11px', padding: '3px 8px' }}>
                        {lead.inquiryType}
                      </span>
                    </td>
                    <td style={{ padding: '12px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {lead.interestedPackage ? (
                        <strong style={{ color: 'var(--gold-accent)' }}>{lead.interestedPackage.split(' ')[1] || lead.interestedPackage}</strong>
                      ) : lead.interestedProfileId ? (
                        <span style={{ fontSize: '12px' }}>Profile: {lead.interestedProfileId.substring(0, 8)}...</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>{lead.message || '—'}</span>
                      )}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', ...getPriorityStyle(lead.priority) }}>
                      {lead.priority.toUpperCase()}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span className="card-badge" style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        display: 'inline-block',
                        ...getStatusBadgeStyle(lead.status)
                      }}>
                        {lead.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
                        <button
                          className="btn btn-primary"
                          style={{ padding: '4px 10px', fontSize: '11px' }}
                          onClick={() => handleOpenLead(lead)}
                        >
                          View Details
                        </button>
                        {lead.phone && (
                          <a
                            href={getWhatsAppLink(lead.phone, `Assalamu Alaikum ${lead.fullName}, this is Rishte Forever support. We received your inquiry and would like to guide you further.`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn"
                            style={{
                              padding: '4px 8px',
                              fontSize: '11px',
                              backgroundColor: '#25D366',
                              color: '#ffffff',
                              border: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '4px',
                              textDecoration: 'none',
                              fontWeight: 600
                            }}
                            title="Chat on WhatsApp"
                          >
                            💬 WA
                          </a>
                        )}
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '11px', color: 'var(--deep-maroon)' }}
                          onClick={() => handleDeleteLead(lead.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Drawer / Modal */}
      {selectedLead && (
        <div className="modal-overlay font-sans" onClick={() => setSelectedLead(null)}>
          <div className="card-theme-wrapper" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', width: '95%', margin: '20px', padding: '36px', border: '2px solid var(--gold-accent)', position: 'relative' }}>
            <FloralCorner position="tl" color="var(--gold-accent)" />
            <FloralCorner position="tr" color="var(--gold-accent)" />
            <button
              onClick={() => setSelectedLead(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                fontSize: '24px',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              ×
            </button>

            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--deep-maroon)', fontSize: '24px', marginBottom: '20px' }}>
              Inquiry / Lead Details
            </h3>

            {actionError && (
              <div style={{ backgroundColor: 'rgba(111, 29, 53, 0.08)', color: 'var(--deep-maroon)', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', marginBottom: '16px' }}>
                ⚠️ {actionError}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }} className="grid-mobile-1">
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Customer Name</span>
                <strong style={{ fontSize: '15px', color: 'var(--text-dark)' }}>{selectedLead.fullName}</strong>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>City Location</span>
                <strong style={{ fontSize: '15px', color: 'var(--text-dark)' }}>{selectedLead.city}</strong>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Phone Info</span>
                <strong style={{ fontSize: '15px', color: 'var(--text-dark)' }}>{selectedLead.phone}</strong>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Email Info</span>
                <span style={{ fontSize: '14px', color: 'var(--text-dark)' }}>{selectedLead.email || 'None provided'}</span>
              </div>
            </div>

            <hr style={{ borderColor: 'var(--border-color)', margin: '16px 0' }} />

            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Inquiry Context</span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                <span className="card-badge" style={{ backgroundColor: 'var(--warm-ivory)', border: '1px solid var(--border-color)', fontSize: '12px', padding: '4px 10px' }}>
                  Type: {selectedLead.inquiryType}
                </span>
                {selectedLead.interestedPackage && (
                  <span className="card-badge" style={{ backgroundColor: '#fef3c7', border: '1px solid #f59e0b', color: '#b45309', fontSize: '12px', padding: '4px 10px' }}>
                    Package: {selectedLead.interestedPackage}
                  </span>
                )}
                {selectedLead.interestedProfileId && (
                  <span className="card-badge" style={{ backgroundColor: '#ecfdf5', border: '1px solid #10b981', color: '#047857', fontSize: '12px', padding: '4px 10px' }}>
                    Profile ID: {selectedLead.interestedProfileId}
                  </span>
                )}
                {selectedLead.sourcePage && (
                  <span className="card-badge" style={{ backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', color: '#4b5563', fontSize: '12px', padding: '4px 10px' }}>
                    Page: {selectedLead.sourcePage}
                  </span>
                )}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Submitted Message</span>
              <p style={{ backgroundColor: '#fafafa', padding: '12px', borderRadius: '8px', fontSize: '13.5px', color: 'var(--text-dark)', border: '1.5px solid var(--border-color)', lineHeight: '1.5', marginTop: '6px' }}>
                {selectedLead.message || 'No message provided.'}
              </p>
            </div>

            {/* Quick Contact buttons */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <a
                href={`tel:${selectedLead.phone}`}
                className="btn btn-gold"
                style={{ flex: 1, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px' }}
              >
                📞 Call Client
              </a>
              <a
                href={getWhatsAppLink(selectedLead.phone, `Assalamu Alaikum ${selectedLead.fullName}, this is Rishte Forever support. We received your inquiry and would like to guide you further.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ flex: 1, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px' }}
              >
                💬 WhatsApp
              </a>
            </div>

            <hr style={{ borderColor: 'var(--border-color)', margin: '16px 0' }} />

            {/* Admin actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="form-label" htmlFor="drawerStatus">Update Status</label>
                <select
                  id="drawerStatus"
                  className="form-control"
                  value={selectedLead.status}
                  onChange={(e) => handleUpdateLead(selectedLead.id, { status: e.target.value })}
                  disabled={isUpdating}
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
                <label className="form-label" htmlFor="drawerPriority">Change Priority</label>
                <select
                  id="drawerPriority"
                  className="form-control"
                  value={selectedLead.priority}
                  onChange={(e) => handleUpdateLead(selectedLead.id, { priority: e.target.value })}
                  disabled={isUpdating}
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label className="form-label" htmlFor="drawerNotes">Internal Admin Notes</label>
              <textarea
                id="drawerNotes"
                className="form-control"
                rows={3}
                placeholder="Log follow-up calls, family references, or match preferences discussed..."
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                disabled={isUpdating}
              />
              <button
                type="button"
                className="btn btn-secondary"
                style={{ marginTop: '8px', fontSize: '12px', padding: '6px 12px' }}
                onClick={() => handleUpdateLead(selectedLead.id, { adminNotes: notesInput })}
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving notes...' : 'Save Admin Notes'}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ color: 'var(--deep-maroon)' }}
                onClick={() => {
                  handleDeleteLead(selectedLead.id);
                }}
              >
                Delete Lead
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setSelectedLead(null)}
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
