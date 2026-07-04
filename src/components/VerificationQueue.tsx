'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useApp } from '../context/AppContext';
import { VerificationRequest } from '../types';
import { AdminCard, AdminTable, AdminBadge, AdminButton } from './AdminUI';

export const VerificationQueue: React.FC = () => {
  const { adminRequests, handleReviewSubmit } = useApp();
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [notes, setNotes] = useState('');

  const onSubmitReview = async (status: 'APPROVED' | 'REJECTED' | 'NEEDS_FOLLOW_UP') => {
    if (!selectedRequest) return;
    await handleReviewSubmit(status, selectedRequest, notes);
    setSelectedRequest(null);
    setNotes('');
  };

  return (
    <div>
      {selectedRequest && selectedRequest.profile && (
        <AdminCard style={{ marginBottom: '24px', border: '2px solid var(--primary-brand)', position: 'relative' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', color: '#0f172a', fontSize: '20px', marginBottom: '16px' }}>
            Reviewing: {selectedRequest.profile.fullName} <span style={{ fontSize: '14px', color: '#64748b', fontFamily: 'var(--font-sans)', fontWeight: 400 }}>(ID: {selectedRequest.profileId.substring(0, 8)}...)</span>
          </h3>
          
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {selectedRequest.profile.profileImageUrl && (
              <div style={{ flexShrink: 0 }}>
                <Image 
                  src={selectedRequest.profile.profileImageUrl} 
                  alt="Uploaded Profile Photo" 
                  width={150}
                  height={150}
                  style={{ objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px', textAlign: 'center' }}>
                  Image Status: <strong>{selectedRequest.profile.profileImageStatus || 'PENDING'}</strong>
                </div>
              </div>
            )}

            <div style={{ flex: 1, minWidth: '300px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Phone</div>
                <div style={{ fontWeight: 500 }}>{selectedRequest.profile.phoneNumber}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Location</div>
                <div style={{ fontWeight: 500 }}>{selectedRequest.profile.city}, {selectedRequest.profile.state}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Submitted On</div>
                <div style={{ fontWeight: 500 }}>{new Date(selectedRequest.createdAt).toLocaleString()}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Current Status</div>
                <AdminBadge status={selectedRequest.status}>{selectedRequest.status}</AdminBadge>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Bio</div>
                <div style={{ fontSize: '13px', lineHeight: 1.5 }}>{selectedRequest.profile.bio}</div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Family Background</div>
                <div style={{ fontSize: '13px', lineHeight: 1.5 }}>{selectedRequest.profile.familyInfo}</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '24px' }}>
            <label className="admin-label">Phone call verification notes</label>
            <textarea
              className="admin-input"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Log observations from manual telephone check..."
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
            <AdminButton onClick={() => onSubmitReview('APPROVED')} style={{ background: '#166534', color: '#fff' }}>
              ✓ Approve Profile
            </AdminButton>
            <AdminButton onClick={() => onSubmitReview('REJECTED')} variant="danger">
              ✗ Reject Profile
            </AdminButton>
            <AdminButton onClick={() => onSubmitReview('NEEDS_FOLLOW_UP')} variant="secondary">
              Needs Follow Up
            </AdminButton>
            <AdminButton onClick={() => { setSelectedRequest(null); setNotes(''); }} variant="ghost" style={{ marginLeft: 'auto' }}>
              Cancel
            </AdminButton>
          </div>
        </AdminCard>
      )}

      <AdminCard style={{ padding: 0, overflow: 'hidden' }}>
        {adminRequests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📞</div>
            <div style={{ fontSize: '16px', fontWeight: 500, color: '#334155' }}>No Verification Requests</div>
            <p>The queue is currently empty.</p>
          </div>
        ) : (
          <AdminTable headers={['Profile ID', 'Candidate Name', 'Phone Check Status', 'Submitted Date', 'Actions']}>
            {adminRequests.map((req) => (
              <tr key={req.id}>
                <td>
                  <code style={{ fontSize: '12px', color: '#475569', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                    {req.profileId.substring(0, 8)}...
                  </code>
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{req.profile?.fullName || 'N/A'}</div>
                </td>
                <td>
                  <AdminBadge status={req.status}>{req.status}</AdminBadge>
                </td>
                <td>
                  <div style={{ color: '#475569', fontSize: '13px' }}>{new Date(req.createdAt).toLocaleDateString()}</div>
                </td>
                <td>
                  {req.profile && (
                    <AdminButton
                      onClick={() => {
                        setSelectedRequest(req);
                        setNotes(req.notes || '');
                      }}
                      variant="secondary"
                    >
                      Review Call
                    </AdminButton>
                  )}
                </td>
              </tr>
            ))}
          </AdminTable>
        )}
      </AdminCard>
    </div>
  );
};

export default VerificationQueue;
