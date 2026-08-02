'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useSession } from '../context/SessionContext';

export default function GlobalLoginModal() {
  const pathname = usePathname();
  const { showLoginModal, setShowLoginModal } = useSession();

  // Close on Escape key + prevent body scroll while modal is open
  useEffect(() => {
    if (!showLoginModal) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowLoginModal(false);
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [showLoginModal, setShowLoginModal]);

  if (!showLoginModal) return null;

  return (
    <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
      <div className="modal-content-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content-inner">
          <h3 className="modal-title-sm">Join Rishte Forever</h3>
          <p className="modal-subtitle">
            Create a profile or log in securely using your Google account to get verified.
          </p>

          <button
            type="button"
            onClick={() => signIn('google', { callbackUrl: pathname || '/' })}
            className="btn-google"
          >
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
              alt="Google logo"
              width={20}
              height={20}
            />
            Continue with Google
          </button>

          <button
            type="button"
            onClick={() => setShowLoginModal(false)}
            className="btn btn-secondary btn-block"
            style={{ marginTop: '14px' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}