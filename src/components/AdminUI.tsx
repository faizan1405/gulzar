import React from 'react';

// --- Page Header ---
export const AdminPageHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div style={{ marginBottom: '24px' }}>
    <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary-brand)', fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>
      {title}
    </h1>
    {subtitle && (
      <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
        {subtitle}
      </p>
    )}
  </div>
);

// --- Card ---
export const AdminCard = ({ children, style, className = '' }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) => (
  <div className={`admin-card ${className}`} style={style}>
    {children}
  </div>
);

// --- Badges ---
export const AdminBadge = ({ status, children }: { status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'INFO' | 'NEUTRAL' | string; children: React.ReactNode }) => {
  let className = 'admin-badge admin-badge-neutral';
  
  const s = status.toUpperCase();
  if (s === 'APPROVED' || s === 'COMPLETED' || s === 'PAID' || s === 'MARRIED' || s === 'CONFIRMED') className = 'admin-badge admin-badge-approved';
  else if (s === 'PENDING') className = 'admin-badge admin-badge-pending';
  else if (s === 'REJECTED' || s === 'CANCELLED' || s === 'FAILED') className = 'admin-badge admin-badge-rejected';
  else if (s === 'NEEDS_FOLLOW_UP' || s === 'INFO') className = 'admin-badge admin-badge-info';

  return (
    <span className={className}>
      {children || status}
    </span>
  );
};

// --- Buttons ---
type AdminButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
};

export const AdminButton = ({ variant = 'primary', children, style, className = '', ...props }: AdminButtonProps) => {
  let baseStyle: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: props.disabled ? 'not-allowed' : 'pointer',
    opacity: props.disabled ? 0.6 : 1,
    border: '1px solid transparent',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  };

  if (variant === 'primary') {
    baseStyle = {
      ...baseStyle,
      backgroundColor: 'var(--primary-brand)',
      color: '#fff',
      boxShadow: '0 1px 2px rgba(111, 29, 53, 0.2)',
    };
  } else if (variant === 'secondary') {
    baseStyle = {
      ...baseStyle,
      backgroundColor: '#fff',
      color: '#334155',
      border: '1px solid #cbd5e1',
    };
  } else if (variant === 'danger') {
    baseStyle = {
      ...baseStyle,
      backgroundColor: '#fef2f2',
      color: '#b91c1c',
      border: '1px solid #fecaca',
    };
  } else if (variant === 'ghost') {
    baseStyle = {
      ...baseStyle,
      backgroundColor: 'transparent',
      color: '#475569',
    };
  }

  return (
    <button style={{ ...baseStyle, ...style }} className={className} {...props}>
      {children}
    </button>
  );
};

// --- Table ---
export const AdminTable = ({ headers, children }: { headers: string[]; children: React.ReactNode }) => (
  <div className="admin-table-wrapper">
    <table className="admin-table">
      <thead>
        <tr>
          {headers.map((h, i) => <th key={i}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {children}
      </tbody>
    </table>
  </div>
);

// --- Modal ---
export const AdminModal = ({ title, isOpen, onClose, children, width = '600px' }: { title: string; isOpen: boolean; onClose: () => void; children: React.ReactNode; width?: string }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 10000 }}>
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()} 
        style={{ maxWidth: width, borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      >
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#0f172a', fontFamily: 'var(--font-serif)' }}>{title}</h3>
          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}
          >
            ×
          </button>
        </div>
        <div style={{ padding: '24px', overflowY: 'auto', maxHeight: '75vh' }}>
          {children}
        </div>
      </div>
    </div>
  );
};
