'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useApp } from '../context/AppContext';
import { VerificationRequest } from '../types';

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
        <div className="card-theme-wrapper" style={{ marginBottom: '30px', border: '1.5px solid var(--gold-accent)' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-dark)', marginBottom: '16px' }}>
            Reviewing: {selectedRequest.profile.fullName} (ID: {selectedRequest.profileId})
          </h3>
          
          {selectedRequest.profile.profileImageUrl && (
            <div style={{ marginBottom: '15px', textAlign: 'center' }}>
              <Image 
                src={selectedRequest.profile.profileImageUrl} 
                alt="Uploaded Profile Photo" 
                width={150}
                height={150}
                style={{ objectFit: 'cover', borderRadius: '12px', border: '2px solid var(--border-color)' }}
              />
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                Image Status: <strong>{selectedRequest.profile.profileImageStatus || 'PENDING'}</strong>
              </p>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', margin: '15px 0', fontSize: '13.5px', border: '1px solid var(--border-color)', padding: '20px', borderRadius: '8px', backgroundColor: '#fff' }}>
            <p><strong>Phone:</strong> {selectedRequest.profile.phoneNumber}</p>
            <p><strong>Location:</strong> {selectedRequest.profile.city}, {selectedRequest.profile.state}</p>
            <p style={{ gridColumn: 'span 2' }}><strong>Bio:</strong> {selectedRequest.profile.bio}</p>
            <p style={{ gridColumn: 'span 2' }}><strong>Family Background:</strong> {selectedRequest.profile.familyInfo}</p>
            <p><strong>Submitted On:</strong> {new Date(selectedRequest.createdAt).toLocaleString()}</p>
            <p>
              <strong>Current Status: </strong> 
              <span style={{ 
                padding: '2px 8px', 
                borderRadius: '4px', 
                fontSize: '11px', 
                fontWeight: 'bold',
                backgroundColor: selectedRequest.status === 'APPROVED' ? 'rgba(18, 46, 34, 0.1)' : selectedRequest.status === 'REJECTED' ? 'rgba(230, 92, 92, 0.1)' : 'rgba(240, 190, 50, 0.1)',
                color: selectedRequest.status === 'APPROVED' ? 'green' : selectedRequest.status === 'REJECTED' ? 'red' : 'orange'
              }}>
                {selectedRequest.status}
              </span>
            </p>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 'bold' }}>Phone call verification notes</label>
            <textarea
              className="form-control"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Log observations from manual telephone check..."
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
            <button onClick={() => onSubmitReview('APPROVED')} className="btn btn-gold" style={{ backgroundColor: 'green', borderColor: 'green' }}>
              ✓ Approve Profile
            </button>
            <button onClick={() => onSubmitReview('REJECTED')} className="btn btn-primary" style={{ backgroundColor: 'red', borderColor: 'red' }}>
              ✗ Reject Profile
            </button>
            <button onClick={() => onSubmitReview('NEEDS_FOLLOW_UP')} className="btn btn-secondary">
              Needs Follow Up
            </button>
            <button onClick={() => { setSelectedRequest(null); setNotes(''); }} className="btn btn-secondary" style={{ marginLeft: 'auto' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="table-responsive" style={{ backgroundColor: 'var(--white)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)', height: '40px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--gold-dark)' }}>
              <th style={{ padding: '12px 8px' }}>Profile ID</th>
              <th style={{ padding: '12px 8px' }}>Candidate Name</th>
              <th style={{ padding: '12px 8px' }}>Phone Check Status</th>
              <th style={{ padding: '12px 8px' }}>Submitted Date</th>
              <th style={{ padding: '12px 8px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {adminRequests.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '30px' }}>
                  <div className="empty-state">
                    <h3>No Verification Requests</h3>
                  </div>
                </td>
              </tr>
            ) : (
              adminRequests.map((req) => (
                <tr key={req.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '13.5px', height: '50px' }}>
                  <td style={{ padding: '12px 8px' }}><code style={{ fontSize: '12px' }}>{req.profileId.substring(0, 8)}...</code></td>
                  <td style={{ padding: '12px 8px' }}><strong>{req.profile?.fullName || 'N/A'}</strong></td>
                  <td style={{ padding: '12px 8px' }}>
                    <span style={{
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      backgroundColor: req.status === 'APPROVED' ? 'rgba(18, 46, 34, 0.1)' : req.status === 'REJECTED' ? 'rgba(230, 92, 92, 0.1)' : 'rgba(240, 190, 50, 0.1)',
                      color: req.status === 'APPROVED' ? 'green' : req.status === 'REJECTED' ? 'red' : 'orange'
                    }}>
                      {req.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 8px' }}>{new Date(req.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '12px 8px' }}>
                    {req.profile && (
                      <button
                        onClick={() => {
                          setSelectedRequest(req);
                          setNotes(req.notes || '');
                        }}
                        className="btn btn-gold"
                        style={{ padding: '6px 12px', fontSize: '11px' }}
                      >
                        Review Call
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VerificationQueue;
