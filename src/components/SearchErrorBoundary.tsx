'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class SearchErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('SearchErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          maxWidth: '600px',
          margin: '80px auto',
          padding: '40px 24px',
          textAlign: 'center',
          backgroundColor: '#FFF',
          borderRadius: '16px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1F2937', marginBottom: '12px' }}>
            Search Directory Temporarily Unavailable
          </h2>
          <p style={{ color: '#6B7280', fontSize: '14.5px', lineHeight: 1.6, marginBottom: '24px' }}>
            We encountered an unexpected issue while rendering profile search. Please reload or reset filters.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              if (typeof window !== 'undefined') {
                window.location.href = '/search';
              }
            }}
            style={{
              padding: '12px 28px',
              backgroundColor: 'var(--deep-maroon, #6f1d35)',
              color: '#FFF',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Reset Filters & Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SearchErrorBoundary;
