'use client';

import React, { useState, useCallback, type ChangeEvent } from 'react';
import { useSession } from '../../../context/SessionContext';
import { PREMIUM_PACKAGES } from '../../../lib/packages';
import {
  AdminPageHeader,
  AdminCard,
  AdminBadge,
  AdminButton,
  AdminField,
  AdminInput,
  AdminSelect,
  AdminTextarea,
  AdminTable,
  AdminAlert,
} from '../../../components/AdminUI';

async function callAdminAction(action: string, payload: Record<string, string | boolean | number | null>) {
  const res = await fetch('/api/admin/packages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...payload }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    alert(data.error || 'Action failed');
    return null;
  }
  return data;
}

function formatINR(n: number) {
  return '₹' + n.toLocaleString('en-IN');
}

export default function PremiumPackagesPage() {
  const {
    profiles,
    adminPurchases,
    adminAssignments,
    handleAssignLead,
    handleUpdateLeadStatus,
    handleUpdateHPStatus,
    handleConfirmMarriage,
    handleUpdateSuccessFee,
    setReloadTrigger,
  } = useSession();

  const [assignBuyerId, setAssignBuyerId] = useState('');
  const [assignLeadId, setAssignLeadId] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectNotes, setRejectNotes] = useState('');
  const [upiTxnInput, setUpiTxnInput] = useState<Record<string, string>>({});
  const [alertMsg, setAlertMsg] = useState('');

  const showAlert = (msg: string) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(''), 4000);
  };

  const onAssign = useCallback(async () => {
    if (!assignBuyerId || !assignLeadId) return;
    try {
      await handleAssignLead(assignBuyerId, assignLeadId);
      setAssignLeadId('');
      showAlert('Lead assigned successfully.');
    } catch {
      showAlert('Failed to assign lead.');
    }
  }, [assignBuyerId, assignLeadId, handleAssignLead]);

  const onApprovePayment = useCallback(async (purchaseId: string) => {
    const upiTxn = upiTxnInput[purchaseId] || '';
    if (!upiTxn.trim() && !confirm('No UPI Transaction ID entered. Approve without UPI Txn ID?')) return;
    const result = await callAdminAction('confirm_payment', {
      purchaseId,
      approve: true,
      upiTransactionId: upiTxn.trim() || null,
    });
    if (result?.success) {
      showAlert('Payment approved! Package activated.');
      setReloadTrigger((prev: number) => prev + 1);
    }
  }, [upiTxnInput, setReloadTrigger]);

  const onRejectPayment = useCallback(async (purchaseId: string) => {
    if (!rejectNotes.trim()) {
      alert('Please enter rejection notes.');
      return;
    }
    const result = await callAdminAction('confirm_payment', {
      purchaseId,
      approve: false,
      rejectionNotes: rejectNotes.trim(),
    });
    if (result?.success) {
      showAlert('Payment rejected.');
      setRejectingId(null);
      setRejectNotes('');
      setReloadTrigger((prev: number) => prev + 1);
    }
  }, [rejectNotes, setReloadTrigger]);

  const getPriceDetails = (pkgType: string) => {
    const pkg = PREMIUM_PACKAGES[pkgType as keyof typeof PREMIUM_PACKAGES];
    if (!pkg) return { name: pkgType, base: 0, gst: 0, total: 0 };
    const gst = Math.round(pkg.basePrice * pkg.gstRate);
    return { name: pkg.name, base: pkg.basePrice, gst, total: pkg.totalAmount };
  };

  return (
    <div>
      <AdminPageHeader title="Premium Packages" subtitle="Monitor purchases, subscriptions, and payments." />

      {alertMsg && <AdminAlert type="success">{alertMsg}</AdminAlert>}

      <AdminCard style={{ marginBottom: 28, padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <AdminTable headers={['Customer', 'Package', 'Amount', 'Payment', 'Txn IDs', 'Mode', 'Date', 'Actions']}>
            {adminPurchases.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: 40 }}>
                  <div className="admin-empty" style={{ padding: 0 }}>
                    <div className="admin-empty__icon">💎</div>
                    <div className="admin-empty__title">No Package Purchases</div>
                    <div className="admin-empty__desc">Purchases will appear here.</div>
                  </div>
                </td>
              </tr>
            ) : (
              adminPurchases.map((purchase) => {
                const details = getPriceDetails(purchase.packageType);
                return (
                  <tr key={purchase.id}>
                    <td>
                      <strong>{purchase.profile?.fullName || 'N/A'}</strong>
                      <div style={{ fontSize: 11, color: '#64748b' }}>
                        {purchase.profile?.phoneNumber || ''} | {purchase.profile?.user?.email || ''}
                      </div>
                    </td>
                    <td><strong>{details.name}</strong></td>
                    <td>
                      <strong>{formatINR(details.total)}</strong>
                      <div style={{ fontSize: 11, color: '#64748b' }}>Base: {formatINR(details.base)} + GST: {formatINR(details.gst)}</div>
                    </td>
                    <td><AdminBadge status={purchase.paymentStatus}>{purchase.paymentStatus}</AdminBadge></td>
                    <td style={{ fontSize: 11, fontFamily: 'monospace' }}>
                      Txn: {purchase.upiTransactionId || purchase.paymentReferenceId || 'N/A'}
                      <br />
                      Ref: {purchase.userSubmittedTxnId || 'N/A'}
                      {purchase.paymentStatus === 'PENDING' && (
                        <AdminInput
                          placeholder="UPI Txn ID"
                          value={upiTxnInput[purchase.id] || ''}
                          onChange={(e) => setUpiTxnInput((prev) => ({ ...prev, [purchase.id]: e.target.value }))}
                          style={{ marginTop: 4, fontSize: 11 }}
                        />
                      )}
                    </td>
                    <td><AdminBadge variant="green">UPI</AdminBadge></td>
                    <td>{new Date(purchase.purchaseDate).toLocaleDateString()}</td>
                    <td>
                      {purchase.paymentStatus === 'PENDING' && (
                        <div style={{ display: 'flex', gap: 4, flexDirection: 'column' }}>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <AdminButton size="sm" variant="success" onClick={() => onApprovePayment(purchase.id)}>Approve</AdminButton>
                            <AdminButton size="sm" variant="danger" onClick={() => setRejectingId(purchase.id)}>Reject</AdminButton>
                          </div>
                          {rejectingId === purchase.id && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                              <AdminTextarea placeholder="Rejection reason" value={rejectNotes} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setRejectNotes(e.target.value)} rows={2} />
                              <AdminButton size="sm" variant="danger" onClick={() => onRejectPayment(purchase.id)}>Confirm Reject</AdminButton>
                            </div>
                          )}
                        </div>
                      )}
                      {purchase.packageType === 'high_profile_package' && purchase.eligibilityStatus === 'PENDING' && (
                        <div style={{ marginTop: 4 }}>
                          <AdminButton size="sm" variant="secondary" onClick={() => handleUpdateHPStatus(purchase.id, 'APPROVED', 'Eligible')}>Approve HP</AdminButton>
                          <AdminButton size="sm" variant="danger" onClick={() => handleUpdateHPStatus(purchase.id, 'REJECTED', 'Not eligible')} style={{ marginLeft: 4 }}>Reject HP</AdminButton>
                        </div>
                      )}
                      {['good_profile_package', 'high_profile_package'].includes(purchase.packageType) && (
                        <div style={{ marginTop: 4 }}>
                          {purchase.marriageConfirmation === 'PENDING' ? (
                            <AdminButton size="sm" variant="success" onClick={() => handleConfirmMarriage(purchase.id, true)}>Confirm Marriage</AdminButton>
                          ) : (
                            <AdminButton size="sm" variant="secondary" onClick={() => handleConfirmMarriage(purchase.id, false)}>Reset Marriage</AdminButton>
                          )}
                        </div>
                      )}
                      {['good_profile_package', 'high_profile_package'].includes(purchase.packageType) && purchase.successFeePaymentStatus === 'PENDING' && (
                        <div style={{ marginTop: 4 }}>
                          <AdminButton size="sm" onClick={() => handleUpdateSuccessFee(purchase.id, 'PAID')}>Mark Fee Paid</AdminButton>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </AdminTable>
        </div>
      </AdminCard>

      <div style={{ marginBottom: 8, fontWeight: 600, fontSize: 14 }}>Assign Lead to Buyer</div>
      <AdminCard>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, alignItems: 'end' }}>
          <AdminField label="Select Curated Buyer">
            <AdminSelect value={assignBuyerId} onChange={(e) => setAssignBuyerId(e.target.value)}>
              <option value="">-- Choose Buyer --</option>
              {[...adminPurchases
                .filter((p) => p.packageType === 'good_profile_package' && p.paymentStatus === 'PAID')]
                .sort((a, b) => (a.profile?.fullName || '').localeCompare(b.profile?.fullName || ''))
                .map((p) => (
                  <option key={p.id} value={p.profileId}>
                    {p.profile?.fullName} ({p.profile?.city})
                  </option>
                ))}
            </AdminSelect>
          </AdminField>
          <AdminField label="Select Match Lead">
            <AdminSelect value={assignLeadId} onChange={(e) => setAssignLeadId(e.target.value)}>
              <option value="">-- Choose Lead --</option>
              {[...profiles.filter((p) => p.verificationStatus === 'APPROVED')]
                .sort((a, b) => a.fullName.localeCompare(b.fullName))
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.fullName} ({p.gender} - {p.occupation})
                  </option>
                ))}
            </AdminSelect>
          </AdminField>
          <AdminButton onClick={onAssign} disabled={!assignBuyerId || !assignLeadId}>Assign Lead</AdminButton>
        </div>
      </AdminCard>

      <div style={{ margin: '24px 0 8px', fontWeight: 600, fontSize: 14 }}>Active Assignments ({adminAssignments.length})</div>
      <AdminCard style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <AdminTable headers={['Curated Buyer', 'Assigned Lead', 'Status', 'Update Status']}>
            {adminAssignments.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: 40 }}>
                  <div className="admin-empty" style={{ padding: 0 }}>
                    <div className="admin-empty__icon">📋</div>
                    <div className="admin-empty__title">No Lead Assignments</div>
                    <div className="admin-empty__desc">Assign a lead above to create an assignment.</div>
                  </div>
                </td>
              </tr>
            ) : (
              adminAssignments.map((a) => (
                <tr key={a.id}>
                  <td>
                    <strong>{a.buyerProfile?.fullName || 'N/A'}</strong>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{a.buyerProfile?.city || 'N/A'} • {a.buyerProfile?.gender}</div>
                  </td>
                  <td>
                    <strong>{a.leadProfile?.fullName || 'N/A'}</strong>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{a.leadProfile?.city || 'N/A'} • {a.leadProfile?.gender}</div>
                  </td>
                  <td><AdminBadge status={a.status}>{a.status}</AdminBadge></td>
                  <td>
                    <AdminSelect
                      value={a.status}
                      onChange={(e) => handleUpdateLeadStatus(a.id, e.target.value)}
                      style={{ minWidth: 140 }}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="INTERESTED">INTERESTED</option>
                      <option value="DECLINED">DECLINED</option>
                      <option value="MARRIED">MARRIED</option>
                    </AdminSelect>
                  </td>
                </tr>
              ))
            )}
          </AdminTable>
        </div>
      </AdminCard>
    </div>
  );
}
