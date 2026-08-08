'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useSession } from '../context/SessionContext';
import { VerificationRequest } from '../types';
import {
  AdminReviewCard,
  AdminField,
  AdminTextarea,
  AdminButton,
  AdminBadge,
  AdminTable,
  AdminCard,
  AdminEmpty,
  AdminLoading,
} from './AdminUI';

const STATUS_VARIANT: Record<string, 'pending' | 'rejected' | 'info' | 'approved' | 'neutral'> = {
  APPROVED: 'approved',
  REJECTED: 'rejected',
  NEEDS_FOLLOW_UP: 'info',
  PENDING: 'pending',
};

export const VerificationQueue: React.FC = () => {
  const { adminRequests, handleReviewSubmit } = useSession();
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmitReview = async (status: 'APPROVED' | 'REJECTED' | 'NEEDS_FOLLOW_UP') => {
    if (!selectedRequest) return;
    setSubmitting(true);
    await handleReviewSubmit(status, selectedRequest, notes);
    setSelectedRequest(null);
    setNotes('');
    setSubmitting(false);
  };

  if (!adminRequests) {
    return <AdminCard><AdminLoading /></AdminCard>;
  }

  return (
    <div>
      {selectedRequest && selectedRequest.profile && (
        <AdminReviewCard
          title={`Reviewing: ${selectedRequest.profile.fullName} (ID: ${selectedRequest.profileId.substring(0, 8)}…)`}
          onCancel={() => { setSelectedRequest(null); setNotes(''); }}
        >
          {/* Profile Photo */}
          {selectedRequest.profile.profileImageUrl && (
            <div style={{ marginBottom: 16, textAlign: 'center' }}>
              <Image
                src={selectedRequest.profile.profileImageUrl}
                alt="Uploaded Profile Photo"
                width={150}
                height={150}
                style={{ objectFit: 'cover', borderRadius: 10, border: '1.5px solid #e2e8f0' }}
              />
              <p style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>
                Image Status: <strong>{selectedRequest.profile.profileImageStatus || 'PENDING'}</strong>
              </p>
            </div>
          )}

          {/* Profile Info */}
          <div className="admin-review-card__grid">
            <div className="admin-review-card__field">
              <strong>Phone:</strong> {selectedRequest.profile.phoneNumber}
            </div>
            <div className="admin-review-card__field">
              <strong>Location:</strong> {selectedRequest.profile.city}, {selectedRequest.profile.state}
            </div>
            <div className="admin-review-card__field" style={{ gridColumn: 'span 2' }}>
              <strong>Bio:</strong> {selectedRequest.profile.bio}
            </div>
            <div className="admin-review-card__field" style={{ gridColumn: 'span 2' }}>
              <strong>Family Background:</strong> {selectedRequest.profile.familyInfo}
            </div>
            <div className="admin-review-card__field">
              <strong>Submitted On:</strong> {new Date(selectedRequest.createdAt).toLocaleString()}
            </div>
            <div className="admin-review-card__field">
              <strong>Current Status:</strong>{' '}
              <AdminBadge status={selectedRequest.status}>{selectedRequest.status}</AdminBadge>
            </div>
          </div>

          {/* Review Notes */}
          <AdminField label="Phone call verification notes">
            <AdminTextarea
              placeholder="Log observations from manual telephone check…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </AdminField>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
            <AdminButton onClick={() => onSubmitReview('APPROVED')} variant="success" disabled={submitting}>
              ✓ Approve Profile
            </AdminButton>
            <AdminButton onClick={() => onSubmitReview('REJECTED')} variant="danger" disabled={submitting}>
              ✗ Reject Profile
            </AdminButton>
            <AdminButton onClick={() => onSubmitReview('NEEDS_FOLLOW_UP')} variant="secondary" disabled={submitting}>
              Needs Follow Up
            </AdminButton>
            <AdminButton variant="ghost" onClick={() => { setSelectedRequest(null); setNotes(''); }} disabled={submitting}>
              Cancel
            </AdminButton>
          </div>
        </AdminReviewCard>
      )}

      {/* Queue Table */}
      <AdminCard style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <AdminTable headers={['Profile ID', 'Candidate Name', 'Phone Check Status', 'Submitted Date', 'Actions']}>
            {adminRequests.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: 40 }}>
                  <AdminEmpty
                    icon="✅"
                    title="No Verification Requests"
                    description="New profile verification requests will appear here."
                  />
                </td>
              </tr>
            ) : (
              adminRequests.map((req) => (
                <tr key={req.id}>
                  <td><code style={{ fontSize: 12, color: '#64748b' }}>{req.profileId.substring(0, 8)}…</code></td>
                  <td><strong>{req.profile?.fullName || 'N/A'}</strong></td>
                  <td>
                    <AdminBadge status={req.status} variant={STATUS_VARIANT[req.status]}>
                      {req.status}
                    </AdminBadge>
                  </td>
                  <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                  <td>
                    {req.profile && (
                      <AdminButton size="sm" onClick={() => {
                        setSelectedRequest(req);
                        setNotes(req.notes || '');
                      }}>
                        Review Call
                      </AdminButton>
                    )}
                  </td>
                </tr>
              ))
            )}
          </AdminTable>
        </div>
      </AdminCard>
    </div>
  );
};
