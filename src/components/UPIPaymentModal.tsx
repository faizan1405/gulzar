'use client';

import React, { useState } from 'react';

const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID || '9873721207-13@ybl';
const UPI_PAYEE_NAME = process.env.NEXT_PUBLIC_UPI_PAYEE_NAME || 'Rishte Forever';
const QR_CODE_URL = process.env.NEXT_PUBLIC_UPI_QR || '/images/upi-qr.png.jpeg';

// Build UPI deep link for "Pay using any UPI app"
function buildUpiLink(upiId: string, payeeName: string, amount: number, note: string): string {
  const pa = upiId; // payee address
  const pn = encodeURIComponent(payeeName);
  const tr = `TXN_${Date.now()}`;
  const tn = encodeURIComponent(note);
  const am = amount.toFixed(2);
  return `upi://pay?pa=${pa}&pn=${pn}&tr=${tr}&tn=${tn}&am=${am}&cu=INR`;
}

interface UPIPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSubmitted: () => void;
  purchaseId: string;
  amount: number;
  planName: string;
  userName?: string;
  userPhone?: string;
}

export default function UPIPaymentModal({
  isOpen,
  onClose,
  onPaymentSubmitted,
  purchaseId,
  amount,
  planName,
  userName,
  userPhone,
}: UPIPaymentModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [txnId, setTxnId] = useState('');
  const [submitName, setSubmitName] = useState(userName || '');
  const [submitPhone, setSubmitPhone] = useState(userPhone || '');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/payment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purchaseId,
          userSubmittedTxnId: txnId.trim() || null,
          userName: submitName.trim() || null,
          userPhone: submitPhone.trim() || null,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        onPaymentSubmitted();
      } else {
        alert(data.error || 'Failed to submit payment claim.');
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const upiLink = buildUpiLink(UPI_ID, UPI_PAYEE_NAME, amount, planName);

  return (
    <div className="modal-overlay font-sans" onClick={onClose}>
      <div
        className="card-theme-wrapper"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '480px',
          width: '92%',
          margin: '20px auto',
          border: '2px solid var(--gold-accent)',
          padding: '0',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, var(--deep-maroon) 0%, var(--gold-dark) 100%)',
            color: 'white',
            padding: '20px 24px',
            textAlign: 'center',
          }}
        >
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', margin: 0 }}>
            Pay via UPI
          </h3>
          <p style={{ fontSize: '13px', margin: '6px 0 0', opacity: 0.9 }}>
            {planName}
          </p>
        </div>

        <div style={{ padding: '24px' }}>
          {!submitted ? (
            <>
              {/* Amount */}
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <span
                  style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: 'var(--deep-maroon)',
                    fontFamily: 'var(--font-serif)',
                  }}
                >
                  ₹{amount.toLocaleString()}
                </span>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  (incl. 18% GST)
                </p>
              </div>

              {/* QR Code */}
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div
                  style={{
                    display: 'inline-block',
                    padding: '12px',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    border: '1px solid #eee',
                  }}
                >
                  <img
                    src={QR_CODE_URL}
                    alt="UPI QR Code"
                    width={200}
                    height={200}
                    style={{ display: 'block', maxWidth: '200px', height: 'auto' }}
                  />
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                  Scan with any UPI app (GPay, PhonePe, Paytm, etc.)
                </p>
              </div>

              {/* Pay via UPI App Button */}
              <a
                href={upiLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold"
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'center',
                  padding: '14px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  marginBottom: '20px',
                  borderRadius: '8px',
                }}
              >
                💳 Pay ₹{amount.toLocaleString()} with UPI App
              </a>

              {/* Divider */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  margin: '20px 0',
                  gap: '12px',
                }}
              >
                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  OR PAY MANUALLY
                </span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
              </div>

              {/* UPI ID with Copy */}
              <div style={{ marginBottom: '20px' }}>
                <label
                  className="form-label"
                  style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}
                >
                  UPI ID
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#f8f8f8',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                  }}
                >
                  <span style={{ flex: 1, fontSize: '16px', fontFamily: 'monospace', fontWeight: '600' }}>
                    {UPI_ID}
                  </span>
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    style={{
                      background: 'none',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      color: copied ? 'green' : 'var(--deep-maroon)',
                      fontWeight: '600',
                    }}
                  >
                    {copied ? '✓ Copied!' : '📋 Copy'}
                  </button>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Payee: {UPI_PAYEE_NAME}
                </p>
              </div>

              {/* Instructions */}
              <div
                style={{
                  background: 'rgba(111, 29, 53, 0.04)',
                  border: '1px solid rgba(111, 29, 53, 0.1)',
                  borderRadius: '8px',
                  padding: '14px',
                  marginBottom: '20px',
                }}
              >
                <p style={{ fontSize: '13px', color: 'var(--deep-maroon)', margin: 0, lineHeight: '1.6' }}>
                  <strong>How to pay:</strong>
                  <br />
                  1. Open any UPI app (Google Pay, PhonePe, Paytm)
                  <br />
                  2. Scan the QR code <strong>OR</strong> send to <strong>{UPI_ID}</strong>
                  <br />
                  3. Pay the exact amount: <strong>₹{amount.toLocaleString()}</strong>
                  <br />
                  4. Copy your UPI Transaction ID from the app
                  <br />
                  5. Click &quot;I have paid&quot; below
                </p>
              </div>

              {/* Payment Claim Form */}
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '12px' }}>
                  <label className="form-label" style={{ fontSize: '13px' }}>
                    Your Name <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={submitName}
                    onChange={(e) => setSubmitName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    style={{ fontSize: '14px' }}
                  />
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label className="form-label" style={{ fontSize: '13px' }}>
                    Your Phone Number <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    value={submitPhone}
                    onChange={(e) => setSubmitPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    style={{ fontSize: '14px' }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ fontSize: '13px' }}>
                    UPI Transaction ID <span style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>(optional but recommended)</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={txnId}
                    onChange={(e) => setTxnId(e.target.value)}
                    placeholder="e.g. 123456789012 from your UPI app"
                    style={{ fontSize: '14px' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-gold"
                  style={{
                    width: '100%',
                    padding: '14px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    opacity: submitting ? 0.7 : 1,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  {submitting ? 'Submitting...' : '✓ I have paid — Notify Admin'}
                </button>
              </form>

              <button
                onClick={onClose}
                style={{
                  display: 'block',
                  width: '100%',
                  marginTop: '10px',
                  padding: '10px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  textAlign: 'center',
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            /* Success state */
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
              <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--deep-maroon)', marginBottom: '12px' }}>
                Payment Claim Submitted!
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '8px' }}>
                Thank you, <strong>{submitName || 'User'}</strong>! We have received your payment claim for
                <strong> {planName}</strong>.
              </p>
              <p style={{ fontSize: '14px', color: 'var(--deep-maroon)', fontWeight: 600, marginBottom: '4px' }}>
                Alhamdulillah — your package will be activated soon!
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Our admin team will verify your payment and activate your package within a short time.
                You will receive a confirmation via SMS/WhatsApp.
              </p>
              <button
                onClick={onClose}
                className="btn btn-primary"
                style={{ padding: '12px 32px', fontSize: '14px' }}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
