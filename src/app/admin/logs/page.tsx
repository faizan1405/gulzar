'use client';

import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { AdminPageHeader, AdminCard, AdminButton, AdminTable, AdminBadge } from '../../../components/AdminUI';

export default function VerificationLogsPage() {
  const { auditLogs } = useApp();
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [logActionFilter, setLogActionFilter] = useState('All');

  const actionTypes = Array.from(new Set(auditLogs.map((l) => l.action))).sort((a, b) => a.localeCompare(b));

  const filteredLogs = auditLogs.filter((log) => {
    if (logActionFilter !== 'All' && log.action !== logActionFilter) return false;
    if (logSearchQuery.trim()) {
      const q = logSearchQuery.toLowerCase();
      return (
        (log.actorUserId && log.actorUserId.toLowerCase().includes(q)) ||
        log.action.toLowerCase().includes(q) ||
        (log.targetId && log.targetId.toLowerCase().includes(q)) ||
        (log.metadata && log.metadata.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="font-sans">
      <AdminPageHeader
        title="Admin Verification Audit Logs"
        subtitle="Track telephone check logs, approvals, and system administrative audits."
      />

      <AdminCard style={{ marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px 100px', gap: '16px' }}>
          <div>
            <label className="admin-label">Search Logs</label>
            <input
              type="text"
              className="admin-input"
              placeholder="Search by Actor, Action, or Target..."
              value={logSearchQuery}
              onChange={(e) => setLogSearchQuery(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label className="admin-label">Action Type</label>
            <select
              className="admin-input"
              value={logActionFilter}
              onChange={(e) => setLogActionFilter(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="All">All Actions</option>
              {actionTypes.map((act) => (
                <option key={act} value={act}>{act}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <AdminButton
              variant="secondary"
              onClick={() => {
                setLogSearchQuery('');
                setLogActionFilter('All');
              }}
              style={{ width: '100%', height: '38px' }}
            >
              Clear
            </AdminButton>
          </div>
        </div>
      </AdminCard>

      <AdminCard style={{ padding: 0, overflow: 'hidden' }}>
        <AdminTable headers={['Timestamp', 'Action By', 'Action', 'Target ID', 'Metadata']}>
          {filteredLogs.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
                <div style={{ fontSize: '15px', fontWeight: 500 }}>No Audit Logs Found</div>
              </td>
            </tr>
          ) : (
            filteredLogs.map((log) => (
              <tr key={log.id}>
                <td style={{ color: '#475569', fontSize: '13px' }}>
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td style={{ fontWeight: 600, color: '#0f172a' }}>
                  {log.actorUserId || 'System'}
                </td>
                <td>
                  <AdminBadge status={log.action.includes('APPROVE') ? 'APPROVED' : log.action.includes('REJECT') ? 'REJECTED' : 'PENDING'}>
                    {log.action}
                  </AdminBadge>
                </td>
                <td>
                  <code style={{ fontSize: '12px', color: '#64748b', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                    {log.targetId ? log.targetId.substring(0, 8) + '...' : 'N/A'}
                  </code>
                </td>
                <td style={{ color: '#475569', fontSize: '13px' }}>
                  {log.metadata || '—'}
                </td>
              </tr>
            ))
          )}
        </AdminTable>
      </AdminCard>
    </div>
  );
}
