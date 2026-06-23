'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSimulator } from '../context/SimulatorContext';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const {
    isLoggedIn,
    setIsLoggedIn,
    setHasPaid300,
    setSimulatedPackages,
    setIsRegistering,
    setRegStep,
    setShowLoginModal,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    userProfile
  } = useSimulator();

  const handleEditProfile = () => {
    router.push('/my-account');
  };

  const handleRegisterFree = () => {
    setIsLoggedIn(true);
    setIsRegistering(true);
    setRegStep(1);
    router.push('/');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setHasPaid300(false);
    setSimulatedPackages([]);
    setIsRegistering(false);
    router.push('/');
  };

  const handleLoginTrigger = () => {
    setShowLoginModal(true);
  };

  return (
    <header className="header font-sans">
      <div className="container nav-container">
        <style>{`
          @media (max-width: 991px) {
            #hamburger-btn { display: flex !important; }
            .nav-menu-desktop { display: none !important; }
          }
        `}</style>

        {/* Left: hamburger (mobile) + primary nav links (desktop) */}
        <div className="nav-section nav-left">
          <button
            className="modal-close-btn"
            style={{ display: 'none', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer' }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            id="hamburger-btn"
          >
            ☰
          </button>
          <nav className="nav-menu-desktop">
            <ul className="nav-menu" style={{ margin: 0, padding: 0 }}>
              <li>
                <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/search" className={`nav-link ${pathname === '/search' ? 'active' : ''}`}>
                  Browse Profiles
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className={`nav-link ${pathname === '/how-it-works' ? 'active' : ''}`}>
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/premium" className={`nav-link ${pathname === '/premium' ? 'active' : ''}`}>
                  Premium
                </Link>
              </li>
              <li>
                <Link href="/safety" className={`nav-link ${pathname === '/safety' ? 'active' : ''}`}>
                  Safety
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Center: logo */}
        <Link href="/" className="logo" id="header-logo-link">
          <Image
            src="/images/rishte-forever-logo.png"
            alt="Rishte Forever — Where Faith Meets Forever"
            width={210}
            height={79}
            priority
          />
        </Link>

        {/* Right: action buttons */}
        <div className="nav-section nav-right nav-menu-desktop">
          {isLoggedIn && (
            <Link
              href="/my-account"
              className="btn btn-secondary"
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              My Account
            </Link>
          )}
          <Link
            href="/admin"
            className="btn btn-secondary"
            id="btn-toggle-admin"
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            {pathname.startsWith('/admin') ? 'View Website' : 'Admin Panel'}
          </Link>
          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary-brand)', fontFamily: 'var(--font-serif)' }}>Salaam!</span>
              <button
                onClick={handleLogout}
                className="btn btn-primary"
                id="btn-logout"
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleLoginTrigger}
                className="btn btn-secondary"
                id="btn-login-trigger"
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                Login
              </button>
              <button
                onClick={handleRegisterFree}
                className="btn btn-gold"
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                Register Free
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div
          className="modal-overlay font-sans"
          onClick={() => setIsMobileMenuOpen(false)}
          style={{ justifyContent: 'flex-start', alignItems: 'stretch', padding: 0, zIndex: 1000 }}
        >
          <div
            style={{
              backgroundColor: 'var(--cream-bg)',
              width: '280px',
              padding: '24px',
              boxShadow: 'var(--shadow-toast)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="logo">
                <Image
                  src="/images/rishte-forever-logo.png"
                  alt="Rishte Forever — Where Faith Meets Forever"
                  width={180}
                  height={68}
                />
              </span>
              <button className="modal-close-btn" onClick={() => setIsMobileMenuOpen(false)}>×</button>
            </div>
            <hr style={{ borderColor: 'var(--border-color)' }} />
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ padding: '10px 0', fontWeight: '500', fontSize: '15px', color: 'inherit', textDecoration: 'none' }}
            >
              Home
            </Link>
            <Link
              href="/search"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ padding: '10px 0', fontWeight: '500', fontSize: '15px', color: 'inherit', textDecoration: 'none' }}
            >
              Browse Profiles
            </Link>
            <Link
              href="/how-it-works"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ padding: '10px 0', fontWeight: '500', fontSize: '15px', color: 'inherit', textDecoration: 'none' }}
            >
              How It Works
            </Link>
            <Link
              href="/premium"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ padding: '10px 0', fontWeight: '500', fontSize: '15px', color: 'inherit', textDecoration: 'none' }}
            >
              Pricing & Packages
            </Link>
            <Link
              href="/safety"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ padding: '10px 0', fontWeight: '500', fontSize: '15px', color: 'inherit', textDecoration: 'none' }}
            >
              Safety Guidelines
            </Link>

            {isLoggedIn && (
              <Link
                href="/my-account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn btn-secondary"
                style={{ width: '100%', textAlign: 'center', display: 'block' }}
              >
                My Account
              </Link>
            )}

            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn btn-secondary"
              style={{ width: '100%', textAlign: 'center', display: 'block' }}
            >
              {pathname.startsWith('/admin') ? 'View Website' : 'Admin Panel'}
            </Link>

            {isLoggedIn ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Logout
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  onClick={() => {
                    handleLoginTrigger();
                    setIsMobileMenuOpen(false);
                  }}
                  className="btn btn-secondary"
                  style={{ width: '100%' }}
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    handleRegisterFree();
                    setIsMobileMenuOpen(false);
                  }}
                  className="btn btn-gold"
                  style={{ width: '100%' }}
                >
                  Register Free
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
