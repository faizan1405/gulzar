'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from '../context/SessionContext';
import { signIn } from 'next-auth/react';

export default function RegistrationPopup() {
  const pathname = usePathname();
  const { userProfile, authChecked, isRegistering } = useSession();

  const [isOpen, setIsOpen] = useState(false);
  const [isPermanentlyHidden, setIsPermanentlyHidden] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  const isPermanentlyHiddenRef = useRef(isPermanentlyHidden);
  isPermanentlyHiddenRef.current = isPermanentlyHidden;

  const hasCompletedProfile = userProfile?.profileCompletionStatus === 'COMPLETE';
  const hasCompletedRef = useRef(hasCompletedProfile);
  hasCompletedRef.current = hasCompletedProfile;

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const completed = localStorage.getItem('rf_matrimonial_profile_completed') === 'true';
      if (completed) {
        setIsPermanentlyHidden(true);
      }
    }
  }, []);

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

  const handleCloseWithoutRegistering = useCallback(() => {
    setIsOpen(false);
    if (authChecked && !hasCompletedProfile && !isPermanentlyHidden && !isExcludedPage) {
      startTimer();
    }
  }, [clearTimer, authChecked, hasCompletedProfile, isPermanentlyHidden, isExcludedPage, startTimer]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseWithoutRegistering();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleCloseWithoutRegistering]);

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
          maxWidth: '460px',
          width: '95%',
          margin: '20px auto',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--white)',
          boxShadow: '0 25px 50px -12px rgba(18, 30, 24, 0.4)',
          border: '1.5px solid var(--gold-accent)',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '24px',
          padding: '40px 32px',
          textAlign: 'center',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ marginBottom: '24px' }}>
          <span id="reg-popup-title" style={{ fontFamily: 'var(--font-serif)', color: 'var(--deep-maroon)', fontSize: '22px', fontWeight: 'bold', display: 'block' }}>
            Start Your Journey
          </span>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px', lineHeight: 1.5 }}>
            Sign in with Google to create your matrimonial profile and find your perfect match.
          </p>
        </div>

        <div
          style={{
            height: '1px',
            background: 'linear-gradient(to right, transparent, var(--gold-accent), transparent)',
            marginBottom: '28px',
            opacity: 0.5,
          }}
        />

        <button
          onClick={() => signIn('google', { callbackUrl: '/register' })}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '10px',
            border: '1.5px solid #d1d5db',
            background: '#ffffff',
            color: '#374151',
            fontSize: '15px',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            fontFamily: 'var(--font-sans)',
            transition: 'box-shadow 0.2s ease',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        <p
          style={{
            marginTop: '20px',
            fontSize: '11.5px',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
          }}
        >
          Your Google account is used only for authentication.
        </p>
      </div>
    </div>
  );
}
