'use client';

import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { AdminPageHeader, AdminCard, AdminTable, AdminBadge, AdminButton } from '../../../components/AdminUI';

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
  } = useApp();

  const [assignBuyerId, setAssignBuyerId] = useState('');
  const [assignLeadId, setAssignLeadId] = useState('');

  const onAssign = async () => {
    await handleAssignLead(assignBuyerId, assignLeadId);
    setAssignLeadId('');
  };

  return (
    <div className="font-sans">
      <AdminPageHeader
        title="Premium Purchases & Subscriptions"
        subtitle="Monitor standard memberships and premium matchmaking checkouts, including dynamic GST logs."
      />

      <AdminCard style={{ padding: 0, overflow: 'hidden', marginBottom: '40px' }}>
        {adminPurchases.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>💳</div>
            <div style={{ fontSize: '16px', fontWeight: 500, color: '#334155' }}>No Package Purchases</div>
          </div>
        ) : (
          <AdminTable headers={['Customer', 'Package', 'Amount', 'Payment', 'Transaction', 'Actions']}>
            {adminPurchases.map((purchase) => {
              const getPriceDetails = (pkgType: string) => {
                if (pkgType === 'monthly_membership') return { name: 'Monthly Membership' };
                if (pkgType === 'good_profile_package') return { name: 'Good Profile Package' };
                if (pkgType === 'second_marriage_package') return { name: 'Silver Plan' };
                if (pkgType === 'high_profile_package') return { name: 'Gold Package' };
                return { name: pkgType };
              };
              const details = getPriceDetails(purchase.packageType);
              const isDemo = purchase.razorpayOrderId?.startsWith('order_sim_');

              return (
                <tr key={purchase.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{purchase.profile?.fullName || 'N/A'}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                      {purchase.profile?.phoneNumber || 'No phone'}
                    </div>
                    <code style={{ fontSize: '11px', color: '#94a3b8' }}>ID: {purchase.profileId.substring(0, 8)}...</code>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{details.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{new Date(purchase.purchaseDate).toLocaleDateString()}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>₹{purchase.totalAmount}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      Base: ₹{purchase.basePrice} <br/> GST: ₹{(purchase.totalAmount - purchase.basePrice).toFixed(2).replace(/\.00$/, '')}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                      <AdminBadge status={purchase.paymentStatus}>{purchase.paymentStatus}</AdminBadge>
                      <AdminBadge status={isDemo ? 'INFO' : 'NEUTRAL'}>{isDemo ? 'Demo' : 'Razorpay'}</AdminBadge>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#475569', background: '#f1f5f9', padding: '6px', borderRadius: '4px' }}>
                      <div style={{ marginBottom: '2px' }}><span style={{ color: '#94a3b8' }}>Ord:</span> {purchase.razorpayOrderId || 'N/A'}</div>
                      <div><span style={{ color: '#94a3b8' }}>Pay:</span> {purchase.razorpayPaymentId || 'N/A'}</div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', maxWidth: '250px' }}>
                      {purchase.packageType === 'high_profile_package' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', width: '100%' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>HP Eligibility:</span>
                            <span style={{ fontWeight: 700, fontSize: '11px', color: purchase.eligibilityStatus === 'APPROVED' ? '#166534' : purchase.eligibilityStatus === 'REJECTED' ? '#991b1b' : '#d97706' }}>
                              {purchase.eligibilityStatus}
                            </span>
                          </div>
                          {purchase.eligibilityStatus === 'PENDING' && (
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <AdminButton onClick={() => handleUpdateHPStatus(purchase.id, 'APPROVED', 'Eligible candidate approved')} style={{ padding: '2px 8px', fontSize: '10px', height: '24px' }}>Approve</AdminButton>
                              <AdminButton variant="danger" onClick={() => handleUpdateHPStatus(purchase.id, 'REJECTED', 'Criteria not met')} style={{ padding: '2px 8px', fontSize: '10px', height: '24px' }}>Reject</AdminButton>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {['good_profile_package', 'high_profile_package'].includes(purchase.packageType) && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', width: '100%' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Marriage:</span>
                            <span style={{ fontWeight: 700, fontSize: '11px', color: purchase.marriageConfirmation === 'CONFIRMED' ? '#166534' : '#334155' }}>
                              {purchase.marriageConfirmation}
                            </span>
                          </div>
                          {purchase.marriageConfirmation === 'PENDING' ? (
                            <AdminButton onClick={() => handleConfirmMarriage(purchase.id, true)} style={{ padding: '2px 8px', fontSize: '10px', height: '24px' }}>Confirm Marriage</AdminButton>
                          ) : (
                            <AdminButton variant="secondary" onClick={() => handleConfirmMarriage(purchase.id, false)} style={{ padding: '2px 8px', fontSize: '10px', height: '24px' }}>Reset</AdminButton>
                          )}
                        </div>
                      )}

                      {['good_profile_package', 'high_profile_package'].includes(purchase.packageType) && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', width: '100%' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Success Fee:</span>
                            <span style={{ fontWeight: 700, fontSize: '11px', color: purchase.successFeePaymentStatus === 'PAID' ? '#166534' : '#d97706' }}>
                              {purchase.successFeePaymentStatus}
                            </span>
                          </div>
                          {purchase.successFeePaymentStatus === 'PENDING' && (
                            <AdminButton onClick={() => handleUpdateSuccessFee(purchase.id, 'PAID')} style={{ padding: '2px 8px', fontSize: '10px', height: '24px' }}>Mark Paid</AdminButton>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </AdminTable>
        )}
      </AdminCard>

      <AdminPageHeader
        title="Curated Match Lead Assigner"
        subtitle="Assign manually verified candidate profiles to premium Curated Matches members."
      />

      <AdminCard style={{ marginBottom: '40px' }}>
        <h3 style={{ fontFamily: 'var(--font-serif)', color: '#0f172a', fontSize: '18px', marginBottom: '16px' }}>Assign New Lead</h3>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flexGrow: 1, minWidth: '200px' }}>
            <label className="admin-label">Select Curated Buyer</label>
            <select className="admin-input" value={assignBuyerId} onChange={(e) => setAssignBuyerId(e.target.value)} style={{ width: '100%' }}>
              <option value="">-- Choose Buyer --</option>
              {[...adminPurchases.filter(p => p.packageType === 'good_profile_package' && p.paymentStatus === 'PAID')]
                .sort((a, b) => (a.profile?.fullName || '').localeCompare(b.profile?.fullName || ''))
                .map(p => (
                  <option key={p.id} value={p.profileId}>{p.profile?.fullName} ({p.profile?.city})</option>
                ))}
            </select>
          </div>

          <div style={{ flexGrow: 1, minWidth: '200px' }}>
            <label className="admin-label">Select Match Lead</label>
            <select className="admin-input" value={assignLeadId} onChange={(e) => setAssignLeadId(e.target.value)} style={{ width: '100%' }}>
              <option value="">-- Choose Lead Profile --</option>
              {[...profiles.filter(p => p.verificationStatus === 'APPROVED')]
                .sort((a, b) => a.fullName.localeCompare(b.fullName))
                .map(p => (
                  <option key={p.id} value={p.id}>{p.fullName} ({p.gender} - {p.occupation})</option>
                ))}
            </select>
          </div>

          <AdminButton onClick={onAssign} disabled={!assignBuyerId || !assignLeadId} style={{ height: '38px', padding: '0 24px' }}>
            Assign Lead
          </AdminButton>
        </div>
      </AdminCard>

      <AdminPageHeader
        title={`Active Assignments (${adminAssignments.length})`}
      />

      <AdminCard style={{ padding: 0, overflow: 'hidden' }}>
        {adminAssignments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
            <div style={{ fontSize: '16px', fontWeight: 500, color: '#334155' }}>No Lead Assignments</div>
          </div>
        ) : (
          <AdminTable headers={['Curated Buyer', 'Assigned Match Lead', 'Status', 'Update Status']}>
            {adminAssignments.map((a) => (
              <tr key={a.id}>
                <td>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{a.buyerProfile?.fullName || 'N/A'}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{a.buyerProfile?.city || 'N/A'} • {a.buyerProfile?.gender}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{a.leadProfile?.fullName || 'N/A'}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{a.leadProfile?.city || 'N/A'} • {a.leadProfile?.gender}</div>
                </td>
                <td>
                  <AdminBadge status={a.status}>{a.status}</AdminBadge>
                </td>
                <td>
                  <select
                    value={a.status}
                    onChange={(e) => handleUpdateLeadStatus(a.id, e.target.value)}
                    className="admin-input"
                    style={{ padding: '6px 12px', fontSize: '12px', width: '140px', height: '32px' }}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="INTERESTED">INTERESTED</option>
                    <option value="DECLINED">DECLINED</option>
                    <option value="MARRIED">MARRIED</option>
                  </select>
                </td>
              </tr>
            ))}
          </AdminTable>
        )}
      </AdminCard>
    </div>
  );
}
