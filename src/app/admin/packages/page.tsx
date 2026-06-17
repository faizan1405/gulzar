'use client';

import React, { useState } from 'react';
import { useSimulator } from '../../../context/SimulatorContext';

export default function PremiumPackagesPage() {
  const {
    profiles,
    adminPurchases,
    adminAssignments,
    handleAssignLead,
    handleUpdateLeadStatus,
    handleUpdateHPStatus,
    handleConfirmMarriage,
    handleUpdateSuccessFee
  } = useSimulator();

  const [assignBuyerId, setAssignBuyerId] = useState('');
  const [assignLeadId, setAssignLeadId] = useState('');

  const onAssign = async () => {
    await handleAssignLead(assignBuyerId, assignLeadId);
    setAssignLeadId('');
  };

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-dark)', marginBottom: '8px' }}>
        Premium Purchases & Subscriptions
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', marginBottom: '24px' }}>
        Monitor standard memberships and premium matchmaking checkouts, including dynamic GST logs.
      </p>

      <div className="table-responsive" style={{ backgroundColor: 'var(--white)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '40px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1000px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)', height: '40px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--gold-dark)' }}>
              <th style={{ padding: '12px 8px' }}>Customer / Profile</th>
              <th style={{ padding: '12px 8px' }}>Package Details</th>
              <th style={{ padding: '12px 8px' }}>Amount</th>
              <th style={{ padding: '12px 8px' }}>Payment</th>
              <th style={{ padding: '12px 8px' }}>Transaction IDs</th>
              <th style={{ padding: '12px 8px' }}>Mode</th>
              <th style={{ padding: '12px 8px' }}>Date</th>
              <th style={{ padding: '12px 8px' }}>Actions (HP & Success)</th>
            </tr>
          </thead>
          <tbody>
            {adminPurchases.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '30px' }}>
                  <div className="empty-state">
                    <h3>No Package Purchases</h3>
                  </div>
                </td>
              </tr>
            ) : (
              adminPurchases.map((purchase) => {
                const getPriceDetails = (pkgType: string) => {
                  if (pkgType === 'monthly_membership') return { name: 'Monthly Membership', base: 300, gst: 54, total: 354 };
                  if (pkgType === 'good_profile_package') return { name: 'Good Profile Package', base: 5500, gst: 990, total: 6490 };
                  if (pkgType === 'second_marriage_package') return { name: 'Second Marriage Package', base: 11000, gst: 1980, total: 12980 };
                  if (pkgType === 'high_profile_package') return { name: 'High Profile Package', base: 21000, gst: 3780, total: 24780 };
                  return { name: pkgType, base: 0, gst: 0, total: 0 };
                };
                const details = getPriceDetails(purchase.packageType);
                const isDemo = purchase.razorpayOrderId?.startsWith('order_sim_');

                return (
                  <tr key={purchase.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '13.5px' }}>
                    <td style={{ padding: '12px 8px' }}>
                      <strong>{purchase.profile?.fullName || 'N/A'}</strong>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {purchase.profile?.phoneNumber || 'No phone'} | {(purchase.profile as any)?.user?.email || 'No email'}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>ID: {purchase.profileId.substring(0, 8)}...</div>
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <strong>{details.name}</strong>
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <strong>₹{details.total}</strong>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>(Base: ₹{details.base} + GST: ₹{details.gst})</div>
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{ 
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        backgroundColor: purchase.paymentStatus === 'PAID' ? 'rgba(18, 46, 34, 0.1)' : purchase.paymentStatus === 'FAILED' ? 'rgba(230, 92, 92, 0.1)' : 'rgba(240, 190, 50, 0.1)',
                        color: purchase.paymentStatus === 'PAID' ? 'green' : purchase.paymentStatus === 'FAILED' ? 'red' : 'orange'
                      }}>
                        {purchase.paymentStatus}
                      </span>
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <div style={{ fontSize: '11px', fontFamily: 'monospace' }}>
                        Ord: {purchase.razorpayOrderId || 'N/A'}
                        <br />
                        Pay: {purchase.razorpayPaymentId || 'N/A'}
                      </div>
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        backgroundColor: isDemo ? 'rgba(150, 150, 150, 0.1)' : 'rgba(0, 100, 255, 0.1)',
                        color: isDemo ? '#666' : '#0055ff'
                      }}>
                        {isDemo ? 'Demo (Simulator)' : 'Razorpay'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 8px' }}>{new Date(purchase.purchaseDate).toLocaleDateString()}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', maxWidth: '250px' }}>
                        {purchase.packageType === 'high_profile_package' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '4px', border: '1px solid #eee', borderRadius: '4px' }}>
                            <span style={{ fontSize: '10px', color: '#666' }}>HP Eligibility:</span>
                            <span style={{ fontWeight: 'bold', fontSize: '11px', color: purchase.eligibilityStatus === 'APPROVED' ? 'green' : purchase.eligibilityStatus === 'REJECTED' ? 'red' : 'orange' }}>
                              {purchase.eligibilityStatus}
                            </span>
                            {purchase.eligibilityStatus === 'PENDING' && (
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <button onClick={() => handleUpdateHPStatus(purchase.id, 'APPROVED', 'Eligible candidate approved')} className="btn btn-secondary" style={{ padding: '2px 6px', fontSize: '10px' }}>Approve</button>
                                <button onClick={() => handleUpdateHPStatus(purchase.id, 'REJECTED', 'Criteria not met')} className="btn btn-primary" style={{ padding: '2px 6px', fontSize: '10px', backgroundColor: 'red', borderColor: 'red' }}>Reject</button>
                              </div>
                            )}
                          </div>
                        )}
                        {['good_profile_package', 'high_profile_package'].includes(purchase.packageType) && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '4px', border: '1px solid #eee', borderRadius: '4px' }}>
                            <span style={{ fontSize: '10px', color: '#666' }}>Marriage Confirmed:</span>
                            <span style={{ fontWeight: 'bold', fontSize: '11px', color: purchase.marriageConfirmation === 'CONFIRMED' ? 'green' : 'var(--text-dark)' }}>{purchase.marriageConfirmation}</span>
                            {purchase.marriageConfirmation === 'PENDING' ? (
                              <button onClick={() => handleConfirmMarriage(purchase.id, true)} className="btn btn-gold" style={{ padding: '2px 6px', fontSize: '10px' }}>Confirm</button>
                            ) : (
                              <button onClick={() => handleConfirmMarriage(purchase.id, false)} className="btn btn-secondary" style={{ padding: '2px 6px', fontSize: '10px' }}>Reset</button>
                            )}
                          </div>
                        )}
                        {['good_profile_package', 'high_profile_package'].includes(purchase.packageType) && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '4px', border: '1px solid #eee', borderRadius: '4px' }}>
                            <span style={{ fontSize: '10px', color: '#666' }}>Success Fee:</span>
                            <span style={{ fontWeight: 'bold', fontSize: '11px', color: purchase.successFeePaymentStatus === 'PAID' ? 'green' : 'orange' }}>{purchase.successFeePaymentStatus}</span>
                            {purchase.successFeePaymentStatus === 'PENDING' && (
                              <button onClick={() => handleUpdateSuccessFee(purchase.id, 'PAID')} className="btn btn-gold" style={{ padding: '2px 6px', fontSize: '10px' }}>Mark Paid</button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-dark)', marginBottom: '8px' }}>
        Curated Match Lead Assigner
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', marginBottom: '24px' }}>
        Assign manually verified candidate profiles to premium Curated Matches members.
      </p>

      <div className="card-theme-wrapper" style={{ marginBottom: '30px' }}>
        <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-dark)', marginBottom: '12px' }}>Assign New Lead</h3>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '15px' }}>
          <div style={{ flexGrow: 1, minWidth: '200px' }}>
            <label className="form-label">Select Curated Buyer</label>
            <select className="form-control" value={assignBuyerId} onChange={(e) => setAssignBuyerId(e.target.value)}>
              <option value="">-- Choose Buyer --</option>
              {[...adminPurchases.filter(p => p.packageType === 'good_profile_package' && p.paymentStatus === 'PAID')]
                .sort((a, b) => (a.profile?.fullName || '').localeCompare(b.profile?.fullName || ''))
                .map(p => (
                  <option key={p.id} value={p.profileId}>{p.profile?.fullName} ({p.profile?.city})</option>
                ))}
            </select>
          </div>

          <div style={{ flexGrow: 1, minWidth: '200px' }}>
            <label className="form-label">Select Match Lead</label>
            <select className="form-control" value={assignLeadId} onChange={(e) => setAssignLeadId(e.target.value)}>
              <option value="">-- Choose Lead Profile --</option>
              {[...profiles.filter(p => p.verificationStatus === 'APPROVED')]
                .sort((a, b) => a.fullName.localeCompare(b.fullName))
                .map(p => (
                  <option key={p.id} value={p.id}>{p.fullName} ({p.gender} - {p.occupation})</option>
                ))}
            </select>
          </div>

          <button onClick={onAssign} className="btn btn-gold" style={{ alignSelf: 'flex-end', height: '42px' }}>
            Assign Lead
          </button>
        </div>
      </div>

      <div>
        <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-dark)', marginBottom: '12px', fontSize: '18px' }}>
          Active Assignments ({adminAssignments.length})
        </h3>
        <div className="table-responsive" style={{ backgroundColor: 'var(--white)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', height: '40px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--gold-dark)' }}>
                <th style={{ padding: '12px 8px' }}>Curated Buyer</th>
                <th style={{ padding: '12px 8px' }}>Assigned Match Lead</th>
                <th style={{ padding: '12px 8px' }}>Status</th>
                <th style={{ padding: '12px 8px' }}>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {adminAssignments.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '30px' }}>
                    <div className="empty-state">
                      <h3>No Lead Assignments</h3>
                    </div>
                  </td>
                </tr>
              ) : (
                adminAssignments.map((a) => (
                  <tr key={a.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '13.5px', height: '60px' }}>
                    <td style={{ padding: '12px 8px' }}>
                      <strong>{a.buyerProfile?.fullName || 'N/A'}</strong>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{a.buyerProfile?.city || 'N/A'} • {a.buyerProfile?.gender}</div>
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <strong>{a.leadProfile?.fullName || 'N/A'}</strong>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{a.leadProfile?.city || 'N/A'} • {a.leadProfile?.gender}</div>
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{ 
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        backgroundColor: a.status === 'MARRIED' ? 'rgba(18, 46, 34, 0.1)' : a.status === 'DECLINED' ? 'rgba(230, 92, 92, 0.1)' : 'rgba(240, 190, 50, 0.1)',
                        color: a.status === 'MARRIED' ? 'green' : a.status === 'DECLINED' ? 'red' : 'var(--text-dark)'
                      }}>
                        {a.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <select
                        value={a.status}
                        onChange={(e) => handleUpdateLeadStatus(a.id, e.target.value)}
                        className="form-control"
                        style={{ padding: '6px', fontSize: '12px', width: '130px', height: '34px' }}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="INTERESTED">INTERESTED</option>
                        <option value="DECLINED">DECLINED</option>
                        <option value="MARRIED">MARRIED</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
