'use client';

import React from 'react';
import Link from 'next/link';
import { getSupportWhatsAppLink } from '../lib/whatsapp';

interface PackageSidebarCardProps {
  packageName: string;
  basePrice: number;
  billingText: string;
  successFeeAmount: number;
  benefits: string[];
  positioning?: string;
  onActivate: () => void;
  onInquire: () => void;
  whatsappMessage: string;
  isFormComplete: boolean;
  isPackageActive: boolean;
  onCompleteForm: () => void;
}

export default function PackageSidebarCard({
  packageName,
  basePrice,
  billingText,
  successFeeAmount,
  benefits,
  positioning,
  onActivate,
  onInquire,
  whatsappMessage,
  isFormComplete,
  isPackageActive,
  onCompleteForm,
}: PackageSidebarCardProps) {
  const waHref = getSupportWhatsAppLink(whatsappMessage);

  return (
    <div
      className="card-theme-wrapper"
      style={{
        padding: '24px',
        position: 'sticky',
        top: '100px',
        border: '1.5px solid var(--border-color)',
        boxShadow: 'var(--shadow-premium)',
      }}
    >
      <h3
        style={{
          fontFamily: 'var(--font-serif)',
          color: 'var(--deep-maroon)',
          fontSize: '22px',
          marginBottom: '16px',
          fontWeight: 800,
        }}
      >
        {packageName}
      </h3>

      {positioning && (
        <p
          style={{
            fontSize: '13px',
            color: 'var(--text-muted)',
            marginBottom: '16px',
            fontStyle: 'italic',
          }}
        >
          {positioning}
        </p>
      )}

      {isFormComplete ? (
        <div
          style={{
            fontSize: '36px',
            fontWeight: '800',
            color: 'var(--deep-maroon)',
            marginBottom: '8px',
            fontFamily: 'var(--font-serif)',
          }}
        >
          ₹{basePrice.toLocaleString('en-IN')}{' '}
          <span
            style={{
              fontSize: '14px',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-sans)',
              fontWeight: 'normal',
            }}
          >
            + GST
          </span>
        </div>
      ) : (
        <div
          style={{
            background:
              'linear-gradient(135deg, rgba(111,29,53,0.06), rgba(184,146,74,0.06))',
            border: '1.5px dashed var(--gold-accent)',
            borderRadius: '10px',
            padding: '14px',
            marginBottom: '8px',
            textAlign: 'center',
          }}
        >
          <div
            style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}
          >
            Pricing available after
          </div>
          <div
            style={{ fontSize: '14px', fontWeight: 700, color: 'var(--deep-maroon)' }}
          >
            Complete your profile to view pricing
          </div>
        </div>
      )}

      <p
        style={{
          fontSize: '14px',
          color: 'var(--text-muted)',
          marginBottom: '8px',
        }}
      >
        {billingText}
      </p>

      {isFormComplete && successFeeAmount > 0 && (
        <p
          style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            marginBottom: '12px',
          }}
        >
          Success fee: ₹{successFeeAmount.toLocaleString('en-IN')} upon successful match
        </p>
      )}

      <ul
        style={{
          paddingLeft: '20px',
          marginBottom: '24px',
          fontSize: '13.5px',
          color: 'var(--text-dark)',
        }}
      >
        {benefits.map((b, i) => (
          <li key={i} style={{ marginBottom: '8px' }}>
            {b}
          </li>
        ))}
      </ul>

      {isFormComplete ? (
        <button
          className="btn btn-gold"
          style={{ width: '100%', padding: '12px', fontSize: '15px' }}
          onClick={onActivate}
          disabled={isPackageActive}
        >
          {isPackageActive ? 'Package Active ✅' : `Buy ${packageName}`}
        </button>
      ) : (
        <button
          className="btn btn-primary"
          style={{ width: '100%', padding: '12px', fontSize: '15px' }}
          onClick={onCompleteForm}
        >
          Complete Form to View Price
        </button>
      )}

      {isFormComplete && !isPackageActive && (
        <>
          <button
            className="btn btn-secondary"
            style={{ width: '100%', padding: '10px', fontSize: '13px', marginTop: '10px' }}
            onClick={onInquire}
          >
            Inquire & Ask Call Back
          </button>
          <Link
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '13px',
              marginTop: '10px',
              backgroundColor: '#25D366',
              color: '#ffffff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 600,
            }}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M12.012 2C6.506 2 2.042 6.478 2.042 12.012 2.042 13.782 2.5 15.442 3.3 17.277L2 22l5.253-1.378c1.402.766 3 1.2 4.759 1.2 5.506 0 9.97-4.478 9.97-10.012 0-5.534-4.464-10.012-9.97-10.012zM17.807 15.91c-.244.694-1.22 1.268-1.745 1.355-.472.079-.938.293-3.04-.542-2.527-.998-4.14-3.565-4.267-3.731-.127-.166-.991-1.32-.991-2.518 0-1.2.626-1.79.847-2.029.221-.24.479-.3.639-.3a.46.46 0 0 1 .332.155c.105.155.434 1.058.471 1.139.037.081.062.176.009.282-.053.106-.079.171-.157.262-.078.09-.166.2-.236.269-.079.078-.162.162-.07.32.092.158.411.678.88 1.096.604.538 1.111.704 1.267.782.157.078.249.066.342-.04.093-.106.402-.469.511-.627.109-.158.217-.132.366-.077.148.055.942.443 1.103.524.161.081.268.121.308.19.04.069.04.4-.204 1.094z" />
            </svg>
            Inquire on WhatsApp
          </Link>
        </>
      )}
    </div>
  );
}
