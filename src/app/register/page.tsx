'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';

// `/register` is a thin entry point. The actual onboarding wizard lives on the
// home page (driven by AppContext state), so this route funnels the user into
// the correct step of that flow instead of 404-ing.
export default function RegisterPage() {
  const router = useRouter();
  const { isLoggedIn, setShowLoginModal, setIsRegistering, setRegStep } = useApp();

  useEffect(() => {
    if (isLoggedIn) {
      // Authenticated users go straight into the onboarding wizard.
      setIsRegistering(true);
      setRegStep(1);
    } else {
      // Guests must authenticate (Google) before a profile can be created.
      setShowLoginModal(true);
    }
    router.replace('/');
  }, [isLoggedIn, router, setShowLoginModal, setIsRegistering, setRegStep]);

  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-sans)',
        color: 'var(--text-muted)',
      }}
    >
      Redirecting to registration…
    </div>
  );
}
