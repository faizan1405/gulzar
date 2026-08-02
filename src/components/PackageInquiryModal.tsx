'use client';

import React from 'react';
import PackageInquiryForm from './PackageInquiryForm';

interface PackageInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPackage: string;
}

export const PackageInquiryModal: React.FC<PackageInquiryModalProps> = ({
  isOpen,
  onClose,
  defaultPackage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay font-sans" onClick={onClose}>
      <div className="card-theme-wrapper" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', width: '90%', margin: '20px', border: '2px solid var(--gold-accent)', padding: '32px', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            fontSize: '24px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          ×
        </button>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--deep-maroon)', marginBottom: '16px', textAlign: 'center' }}>
          Package Inquiry & Callback
        </h3>
        <PackageInquiryForm
          defaultPackage={defaultPackage}
          onSuccess={onClose}
          onCancel={onClose}
        />
      </div>
    </div>
  );
};

export default PackageInquiryModal;
