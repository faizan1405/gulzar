'use client';

import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';

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
    <div>
      <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-dark)', marginBottom: '8px' }}>
        Admin Verification Audit Logs
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', marginBottom: '24px' }}>
        Track telephone check logs, approvals, and system administrative audits.
      </p>

      <div className="admin-filter-bar">
        <div className="admin-filter-item">
          <label className="form-label">Search Logs</label>
          <input
            type="text"
            className="form-control"
            placeholder="Search by Actor, Action, or Target..."
            value={logSearchQuery}
            onChange={(e) => setLogSearchQuery(e.target.value)}
            style={{ height: '42px' }}
          />
        </div>

        <div className="admin-filter-item">
          <label className="form-label">Action Type</label>
          <select
            className="form-control"
            value={logActionFilter}
            onChange={(e) => setLogActionFilter(e.target.value)}
            style={{ height: '42px' }}
          >
            <option value="All">All Actions</option>
            {actionTypes.map((act) => (
              <option key={act} value={act}>{act}</option>
            ))}
          </select>
        </div>

        <div className="admin-filter-item button-item">
          <button
            className="btn btn-secondary"
            onClick={() => {
              setLogSearchQuery('');
              setLogActionFilter('All');
            }}
            style={{ height: '42px', whiteSpace: 'nowrap' }}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="table-responsive" style={{ backgroundColor: 'var(--white)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)', height: '40px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--gold-dark)' }}>
              <th style={{ padding: '12px 8px' }}>Timestamp</th>
              <th style={{ padding: '12px 8px' }}>Action By</th>
              <th style={{ padding: '12px 8px' }}>Action</th>
              <th style={{ padding: '12px 8px' }}>Target ID</th>
              <th style={{ padding: '12px 8px' }}>Metadata</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '30px' }}>
                  <div className="empty-state">
                    <h3>No Audit Logs Found</h3>
                  </div>
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)', height: '50px', fontSize: '13.5px' }}>
                  <td style={{ padding: '12px 8px' }}>{new Date(log.createdAt).toLocaleString()}</td>
                  <td style={{ padding: '12px 8px' }}><strong>{log.actorUserId || 'System'}</strong></td>
                  <td style={{ padding: '12px 8px' }}>
                    <span style={{
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      backgroundColor: log.action.includes('APPROVE') ? 'rgba(18, 46, 34, 0.1)' : log.action.includes('REJECT') ? 'rgba(230, 92, 92, 0.1)' : 'rgba(212,163,89,0.15)',
                      color: log.action.includes('APPROVE') ? 'green' : log.action.includes('REJECT') ? 'red' : 'var(--gold-dark)'
                    }}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <code style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{log.targetId ? log.targetId.substring(0, 8) + '...' : 'N/A'}</code>
                  </td>
                  <td style={{ padding: '12px 8px', color: 'var(--text-muted)', fontSize: '12px' }}>{log.metadata || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
