'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useApp } from '../context/AppContext';
import LeadForm from './LeadForm';
import { FloralCorner } from './NikahComponents';

export default function RegistrationPopup() {
  const pathname = usePathname();
  const { isLoggedIn, authChecked } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [isPermanentlyHidden, setIsPermanentlyHidden] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  const isPermanentlyHiddenRef = useRef(isPermanentlyHidden);
  isPermanentlyHiddenRef.current = isPermanentlyHidden;

  const isLoggedInRef = useRef(isLoggedIn);
  isLoggedInRef.current = isLoggedIn;

  // Exclude admin pages, auth callback pages, and the registration page itself
  const isExcludedPage = !pathname ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/auth') ||
    pathname === '/register' ||
    pathname.startsWith('/register/');

  const isExcludedRef = useRef(isExcludedPage);
  isExcludedRef.current = isExcludedPage;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Check localStorage on initial mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hidden = localStorage.getItem('rf_registration_popup_permanently_hidden') === 'true';
      if (hidden) {
        setIsPermanentlyHidden(true);
      }
    }
  }, []);

  // Stop timer and permanently hide immediately upon successful login
  useEffect(() => {
    if (isLoggedIn) {
      clearTimer();
      setIsOpen(false);
      setIsPermanentlyHidden(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('rf_registration_popup_permanently_hidden', 'true');
      }
    }
  }, [isLoggedIn, clearTimer]);

  const handleRegistrationSuccess = useCallback(() => {
    clearTimer();
    setIsOpen(false);
    setIsPermanentlyHidden(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('rf_registration_popup_permanently_hidden', 'true');
    }
  }, [clearTimer]);

  // Listen for custom registration success events from forms across the site
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleCustomSuccess = () => {
      handleRegistrationSuccess();
    };
    window.addEventListener('rf_registration_success', handleCustomSuccess);
    return () => {
      window.removeEventListener('rf_registration_success', handleCustomSuccess);
    };
  }, [handleRegistrationSuccess]);

  const startTimer = useCallback(() => {
    clearTimer();

    // Do not start timer if already open, permanently hidden, logged in, auth not checked yet, or on excluded page
    if (isOpenRef.current || isPermanentlyHiddenRef.current || isLoggedInRef.current || !authChecked || isExcludedRef.current) {
      return;
    }

    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      if (!isOpenRef.current && !isPermanentlyHiddenRef.current && !isLoggedInRef.current && !isExcludedRef.current) {
        setIsOpen(true);
      }
    }, 60000);
  }, [clearTimer, authChecked]);

  // Manage timer lifecycle based on auth state, navigation, and open/hidden status
  useEffect(() => {
    if (!authChecked) return;

    if (isLoggedIn || isPermanentlyHidden || isExcludedPage) {
      clearTimer();
      if (isExcludedPage || isLoggedIn) {
        setIsOpen(false);
      }
      return;
    }

    if (!isOpen) {
      startTimer();
    }

    return () => {
      clearTimer();
    };
  }, [authChecked, isLoggedIn, isPermanentlyHidden, isExcludedPage, isOpen, startTimer, clearTimer]);

  // If visitor closes without registering, show again after another 60s
  const handleCloseWithoutRegistering = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Handle Escape key accessibility
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseWithoutRegistering();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleCloseWithoutRegistering]);

  if (!isOpen || isLoggedIn || isPermanentlyHidden || isExcludedPage) {
    return null;
  }

  return (
    <div
      className="modal-overlay font-sans"
      style={{ zIndex: 10000 }}
      onClick={handleCloseWithoutRegistering}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reg-popup-title"
    >
      <div
        className="modal-content card-theme-wrapper"
        style={{
          maxWidth: '560px',
          width: '94%',
          maxHeight: '90vh',
          margin: '20px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--white)',
          boxShadow: '0 25px 50px -12px rgba(18, 30, 24, 0.4)',
          border: '1.5px solid var(--gold-accent)',
          position: 'relative',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <FloralCorner position="tl" color="var(--gold-accent)" />
        <FloralCorner position="tr" color="var(--gold-accent)" />
        <FloralCorner position="bl" color="var(--gold-accent)" />
        <FloralCorner position="br" color="var(--gold-accent)" />

        {/* Modal Header */}
        <div
          className="modal-header"
          style={{
            borderBottom: '1px solid var(--border-color)',
            padding: '16px 24px',
            backgroundColor: 'var(--warm-ivory)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0
          }}
        >
          <span id="reg-popup-title" className="modal-title" style={{ fontSize: '18px', color: 'var(--deep-maroon)', fontWeight: 'bold' }}>
            Rishte Forever Matrimonial
          </span>
          <button
            type="button"
            onClick={handleCloseWithoutRegistering}
            className="modal-close-btn"
            aria-label="Close modal"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '26px',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%'
            }}
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ padding: '24px', overflowY: 'auto', flexGrow: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '22px' }}>
            <span className="script-accent" style={{ display: 'block', marginBottom: '4px', fontSize: '22px' }}>Bismillah</span>
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--deep-maroon)', fontSize: '26px', marginBottom: '8px', fontWeight: 'bold' }}>
              Register Free Today
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: '0 auto', maxWidth: '440px', lineHeight: '1.5' }}>
              Welcome! You are browsing as an unregistered visitor. Complete this short form to register your inquiry and get connected with verified Muslim matches.
            </p>
          </div>

          <LeadForm
            defaultInquiryType="General Inquiry"
            onSuccess={handleRegistrationSuccess}
          />
        </div>
      </div>
    </div>
  );
}
