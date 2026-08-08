import React from 'react';

// --- Page Header ---
export const AdminPageHeader = ({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) => (
  <div className="admin-page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
    <div>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
    {actions && <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{actions}</div>}
  </div>
);

// --- Card ---
export const AdminCard = ({
  children,
  style,
  className = '',
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) => (
  <div className={`admin-card ${className}`} style={style}>
    {children}
  </div>
);

// --- Stat Card ---
export type StatTone = 'maroon' | 'gold' | 'green' | 'blue' | 'purple' | 'neutral';

export const AdminStatCard = ({
  label,
  value,
  icon,
  tone = 'neutral',
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  tone?: StatTone;
}) => (
  <div className={`admin-stat-card admin-stat-card--${tone}`}>
    <div className="admin-stat-card__body">
      <div className="admin-stat-card__label">{label}</div>
      <div className="admin-stat-card__value">{value}</div>
    </div>
    {icon && <div className="admin-stat-card__icon">{icon}</div>}
  </div>
);

// --- Badges ---
export type AdminBadgeVariant =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'info'
  | 'neutral'
  | 'maroon'
  | 'orange'
  | 'green';

const statusToVariant: Record<string, AdminBadgeVariant> = {
  PENDING: 'pending',
  NEEDS_FOLLOW_UP: 'info',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'approved',
  PAID: 'approved',
  MARRIED: 'approved',
  CONFIRMED: 'approved',
  ACTIVE: 'approved',
  CANCELLED: 'rejected',
  FAILED: 'rejected',
  INTERESTED: 'info',
  CONTACTED: 'info',
  NEW: 'pending',
};

export const AdminBadge = ({
  status,
  children,
  variant,
}: {
  status?: string;
  children?: React.ReactNode;
  variant?: AdminBadgeVariant;
}) => {
  const resolved: AdminBadgeVariant =
    variant ?? (status ? statusToVariant[status.toUpperCase()] ?? 'neutral' : 'neutral');
  return (
    <span className={`admin-badge admin-badge--${resolved}`}>
      {children || status}
    </span>
  );
};

// --- Buttons ---
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';

type AdminButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: 'sm' | 'md';
};

export const AdminButton = ({
  variant = 'primary',
  size = 'md',
  children,
  style,
  className = '',
  ...props
}: AdminButtonProps) => (
  <button
    className={`admin-btn admin-btn--${variant}${size === 'sm' ? ' admin-btn--sm' : ''} ${className}`}
    style={style}
    {...props}
  >
    {children}
  </button>
);

// --- Input / Select / Textarea ---
export const AdminField = ({
  label,
  htmlFor,
  children,
  hint,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
  hint?: string;
}) => (
  <div className="admin-field">
    <label htmlFor={htmlFor} className="admin-field-label">{label}</label>
    {children}
    {hint && <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 4 }}>{hint}</div>}
  </div>
);

export const AdminInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={`admin-field-input ${props.className || ''}`} />
);

export const AdminSelect = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select {...props} className={`admin-field-select ${props.className || ''}`} />
);

export const AdminTextarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className={`admin-field-input ${props.className || ''}`}
    style={{ minHeight: 80, resize: 'vertical', ...(props.style || {}) }}
  />
);

// --- Filter Bar ---
export const AdminFilterBar = ({
  children,
  resultCount,
  loading,
  totalLabel = 'items',
}: {
  children: React.ReactNode;
  resultCount?: number;
  loading?: boolean;
  totalLabel?: string;
}) => (
  <div className="admin-filter-bar">
    <div className="admin-filter-grid">{children}</div>
    {resultCount !== undefined && (
      <div style={{ marginTop: 10, fontSize: 12.5, color: '#64748b' }}>
        {loading ? 'Loading…' : `Showing ${resultCount} ${totalLabel}`}
      </div>
    )}
  </div>
);

// --- Table ---
export const AdminTable = ({
  headers,
  children,
}: {
  headers: string[];
  children: React.ReactNode;
}) => (
  <div className="admin-table-wrapper">
    <table className="admin-table">
      <thead>
        <tr>
          {headers.map((h, i) => <th key={i}>{h}</th>)}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

// --- Empty State ---
export const AdminEmpty = ({
  icon = '📭',
  title,
  description,
}: {
  icon?: string;
  title: string;
  description?: string;
}) => (
  <div className="admin-empty">
    <div className="admin-empty__icon">{icon}</div>
    <div className="admin-empty__title">{title}</div>
    {description && <div className="admin-empty__desc">{description}</div>}
  </div>
);

// --- Loading ---
export const AdminLoading = ({ message = 'Loading…' }: { message?: string }) => (
  <div className="admin-loading">
    <div className="admin-spinner" />
    <span>{message}</span>
  </div>
);

// --- Modal ---
export const AdminModal = ({
  title,
  isOpen,
  onClose,
  children,
  width = 640,
  footer,
}: {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: number;
  footer?: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div
        className="admin-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: width }}
      >
        <div className="admin-modal__header">
          <h3 className="admin-modal__title">{title}</h3>
          <button className="admin-modal__close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="admin-modal__body">{children}</div>
        {footer && <div className="admin-modal__footer">{footer}</div>}
      </div>
    </div>
  );
};

// --- Alert ---
export const AdminAlert = ({
  type,
  children,
}: {
  type: 'error' | 'success';
  children: React.ReactNode;
}) => (
  <div className={`admin-alert admin-alert--${type}`}>{children}</div>
);

// --- Review Card (Profile verification) ---
export const AdminReviewCard = ({
  title,
  children,
  onCancel,
}: {
  title: string;
  children: React.ReactNode;
  onCancel?: () => void;
}) => (
  <div className="admin-review-card">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
      <div className="admin-review-card__title">{title}</div>
      {onCancel && (
        <button
          className="admin-modal__close"
          onClick={onCancel}
          aria-label="Close"
        >
          ×
        </button>
      )}
    </div>
    {children}
  </div>
);
