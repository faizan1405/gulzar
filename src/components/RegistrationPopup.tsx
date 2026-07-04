'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useApp } from '../context/AppContext';
import MatrimonialRegistrationForm from './MatrimonialRegistrationForm';
import { FloralCorner } from './NikahComponents';

export default function RegistrationPopup() {
  const pathname = usePathname();
  const { userProfile, authChecked, isRegistering } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [isPermanentlyHidden, setIsPermanentlyHidden] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  const isPermanentlyHiddenRef = useRef(isPermanentlyHidden);
  isPermanentlyHiddenRef.current = isPermanentlyHidden;

  // Profile completion detection: check DB profile completion status field
  const hasCompletedProfile = userProfile?.profileCompletionStatus === 'COMPLETE';
  const hasCompletedRef = useRef(hasCompletedProfile);
  hasCompletedRef.current = hasCompletedProfile;

  // Exclude admin pages, auth callback pages, registration page, and my-account dashboard
  const isExcludedPage = !pathname ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/auth') ||
    pathname === '/register' ||
    pathname.startsWith('/register/') ||
    pathname === '/my-account' ||
    pathname.startsWith('/my-account/');

  const isExcludedRef = useRef(isExcludedPage);
  isExcludedRef.current = isExcludedPage;

  const isRegisteringRef = useRef(isRegistering);
  isRegisteringRef.current = isRegistering;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Check localStorage on initial mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const completed = localStorage.getItem('rf_matrimonial_profile_completed') === 'true';
      if (completed) {
        setIsPermanentlyHidden(true);
      }
    }
  }, []);

  // Stop timer and permanently hide immediately upon successful profile registration
  useEffect(() => {
    if (hasCompletedProfile) {
      clearTimer();
      setIsOpen(false);
      setIsPermanentlyHidden(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('rf_matrimonial_profile_completed', 'true');
      }
    }
  }, [hasCompletedProfile, clearTimer]);

  const handleRegistrationSuccess = useCallback(() => {
    clearTimer();
    setIsOpen(false);
    setIsPermanentlyHidden(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('rf_matrimonial_profile_completed', 'true');
    }
  }, [clearTimer]);

  // Listen for custom registration success event when matrimonial profile is completed
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleCustomSuccess = () => {
      handleRegistrationSuccess();
    };
    window.addEventListener('rf_profile_completed', handleCustomSuccess);
    return () => {
      window.removeEventListener('rf_profile_completed', handleCustomSuccess);
    };
  }, [handleRegistrationSuccess]);

  const startTimer = useCallback(() => {
    clearTimer();

    // Do not start timer if already open, permanently hidden, already has completed profile, auth not checked yet, on excluded page, or actively registering on page
    if (
      isOpenRef.current ||
      isPermanentlyHiddenRef.current ||
      hasCompletedRef.current ||
      !authChecked ||
      isExcludedRef.current ||
      isRegisteringRef.current
    ) {
      return;
    }

    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      if (
        !isOpenRef.current &&
        !isPermanentlyHiddenRef.current &&
        !hasCompletedRef.current &&
        !isExcludedRef.current &&
        !isRegisteringRef.current
      ) {
        setIsOpen(true);
      }
    }, 60000);
  }, [clearTimer, authChecked]);

  // Manage timer lifecycle based on profile completion state, navigation, and open/hidden status
  useEffect(() => {
    if (!authChecked) return;

    if (hasCompletedProfile || isPermanentlyHidden || isExcludedPage || isRegistering) {
      clearTimer();
      if (isExcludedPage || hasCompletedProfile || isRegistering) {
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
  }, [authChecked, hasCompletedProfile, isPermanentlyHidden, isExcludedPage, isRegistering, isOpen, startTimer, clearTimer]);

  // If visitor closes without registering, close modal and show again after another 60s
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

  // Prevent background page scrolling while modal is open
  useEffect(() => {
    if (isOpen && typeof document !== 'undefined') {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen || hasCompletedProfile || isPermanentlyHidden || isExcludedPage || isRegistering) {
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
          maxWidth: '900px',
          width: '95%',
          maxHeight: '90vh',
          margin: '20px auto',
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
            padding: '16px 28px',
            backgroundColor: 'var(--warm-ivory)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0
          }}
        >
          <span id="reg-popup-title" className="modal-title" style={{ fontSize: '20px', color: 'var(--deep-maroon)', fontWeight: 'bold' }}>
            Register Matrimonial Profile
          </span>
          <button
            type="button"
            onClick={handleCloseWithoutRegistering}
            className="modal-close-btn"
            aria-label="Close modal"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '28px',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%'
            }}
          >
            ×
          </button>
        </div>

        {/* Modal Body with Scrolling */}
        <div className="modal-body" style={{ padding: '24px 32px', overflowY: 'auto', flexGrow: 1 }}>
          <MatrimonialRegistrationForm isModal={true} onCancel={handleCloseWithoutRegistering} />
        </div>
      </div>
    </div>
  );
}
