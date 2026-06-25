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
      {/* Top decorative maroon bar with gold crest ornament */}
      <div className="header-top-strip">
        <div className="header-top-strip-ornament"></div>
      </div>

      <div className="container nav-outer-container">
        <div className="nav-container">
          <style>{`
            @media (max-width: 1280px) {
              #hamburger-btn { display: flex !important; }
              .nav-menu-desktop { display: none !important; }
            }
          `}</style>

          {/* Left Column (Row 1): Hamburger (mobile) + primary nav links (desktop) */}
          <div className="nav-section nav-left">
            <button
              className="hamburger-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              id="hamburger-btn"
            >
              ☰
            </button>
            <nav className="nav-menu-desktop">
              <ul className="nav-menu">
                <li>
                  <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
                    <svg className="nav-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/search" className={`nav-link ${pathname === '/search' ? 'active' : ''}`}>
                    <svg className="nav-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    Browse Profiles
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className={`nav-link ${pathname === '/how-it-works' ? 'active' : ''}`}>
                    <svg className="nav-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    How It Works
                  </Link>
                </li>
              </ul>
            </nav>
            {/* Vertical separator */}
            <div className="nav-left-divider nav-menu-desktop"></div>
          </div>

          {/* Center Column (Spans Row 1 & 2): Centered logo inside a Mughal arch cutout */}
          <div className="logo-arch-wrapper">
            <svg className="logo-arch-bg" viewBox="0 0 280 120" preserveAspectRatio="none">
              <path d="M 0,120 L 0,60 C 0,38 22,28 47,28 C 87,28 97,5 140,5 C 183,5 193,28 233,28 C 258,28 280,38 280,60 L 280,120 Z" fill="var(--warm-ivory)" />
              <path d="M 0,120 L 0,60 C 0,38 22,28 47,28 C 87,28 97,5 140,5 C 183,5 193,28 233,28 C 258,28 280,38 280,60 L 280,120" fill="none" stroke="var(--gold-accent)" strokeWidth="1.5" />
              {/* Gold Ornament Peak detail */}
              <circle cx="140" cy="2" r="2.5" fill="var(--gold-accent)" />
              <path d="M 136,5 L 140,0 L 144,5 Z" fill="var(--gold-accent)" />
            </svg>
            <div className="logo-arch-content">
              <Link href="/" className="logo-link" id="header-logo-link">
                <Image
                  src="/images/rishte-forever-logo.png"
                  alt="Rishte Forever — Where Faith Meets Forever"
                  width={190}
                  height={70}
                  priority
                  style={{ display: 'block', height: 'auto', width: '100%', maxWidth: '190px' }}
                />
              </Link>
            </div>
          </div>

          {/* Right Column (Row 1): Premium/Safety/Zaicha nav links */}
          <div className="nav-section nav-right-links">
            {/* Vertical separator */}
            <div className="nav-right-divider nav-menu-desktop"></div>
            <nav className="nav-menu-desktop">
              <ul className="nav-menu">
                <li>
                  <Link href="/premium" className={`nav-link ${pathname === '/premium' ? 'active' : ''}`}>
                    <svg className="nav-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"></path>
                      <path d="M3 20h18a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1z"></path>
                    </svg>
                    Premium
                  </Link>
                </li>
                <li>
                  <Link href="/safety" className={`nav-link ${pathname === '/safety' ? 'active' : ''}`}>
                    <svg className="nav-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                    Safety
                  </Link>
                </li>
                <li>
                  <Link href="/zaicha" className={`nav-link nav-link-zaicha ${pathname === '/zaicha' ? 'active' : ''}`}>
                    <svg className="nav-icon animate-star" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    Zaicha
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Right Column (Row 2): Action buttons */}
          <div className="nav-section nav-right-actions">
            <div className="nav-menu-desktop nav-actions-wrapper">
              {isLoggedIn && (
                <Link
                  href="/my-account"
                  className="btn btn-secondary nav-btn"
                >
                  <svg className="btn-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  My Account
                </Link>
              )}
              <Link
                href="/admin"
                className="btn btn-secondary nav-btn"
                id="btn-toggle-admin"
              >
                <svg className="btn-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                {pathname.startsWith('/admin') ? 'View Website' : 'Admin Panel'}
              </Link>
              {isLoggedIn ? (
                <div className="nav-actions-group">
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary-brand)', fontFamily: 'var(--font-serif)', display: 'inline-flex', alignItems: 'center' }}>Salaam!</span>
                  <button
                    onClick={handleLogout}
                    className="btn btn-primary nav-btn"
                    id="btn-logout"
                  >
                    <svg className="btn-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Logout
                  </button>
                </div>
              ) : (
                <div className="nav-actions-group">
                  <button
                    onClick={handleLoginTrigger}
                    className="btn btn-secondary nav-btn"
                    id="btn-login-trigger"
                  >
                    <svg className="btn-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    Login
                  </button>
                  <button
                    onClick={handleRegisterFree}
                    className="btn btn-gold nav-btn"
                  >
                    <svg className="btn-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="8.5" cy="7" r="4"></circle>
                      <line x1="20" y1="8" x2="20" y2="14"></line>
                      <line x1="17" y1="11" x2="23" y2="11"></line>
                    </svg>
                    Register Free
                  </button>
                </div>
              )}
            </div>
          </div>
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
              style={{
                padding: '10px 16px',
                fontWeight: '700',
                fontSize: '15px',
                color: pathname === '/' ? 'var(--deep-maroon)' : 'var(--text-dark)',
                backgroundColor: pathname === '/' ? 'var(--soft-cream)' : 'transparent',
                borderRadius: '8px',
                borderLeft: pathname === '/' ? '4px solid var(--gold-accent)' : '4px solid transparent',
                textDecoration: 'none',
                transition: 'var(--transition-smooth)'
              }}
            >
              Home
            </Link>
            <Link
              href="/search"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                padding: '10px 16px',
                fontWeight: '700',
                fontSize: '15px',
                color: pathname === '/search' ? 'var(--deep-maroon)' : 'var(--text-dark)',
                backgroundColor: pathname === '/search' ? 'var(--soft-cream)' : 'transparent',
                borderRadius: '8px',
                borderLeft: pathname === '/search' ? '4px solid var(--gold-accent)' : '4px solid transparent',
                textDecoration: 'none',
                transition: 'var(--transition-smooth)'
              }}
            >
              Browse Profiles
            </Link>
            <Link
              href="/how-it-works"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                padding: '10px 16px',
                fontWeight: '700',
                fontSize: '15px',
                color: pathname === '/how-it-works' ? 'var(--deep-maroon)' : 'var(--text-dark)',
                backgroundColor: pathname === '/how-it-works' ? 'var(--soft-cream)' : 'transparent',
                borderRadius: '8px',
                borderLeft: pathname === '/how-it-works' ? '4px solid var(--gold-accent)' : '4px solid transparent',
                textDecoration: 'none',
                transition: 'var(--transition-smooth)'
              }}
            >
              How It Works
            </Link>
            <Link
              href="/premium"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                padding: '10px 16px',
                fontWeight: '700',
                fontSize: '15px',
                color: pathname === '/premium' ? 'var(--deep-maroon)' : 'var(--text-dark)',
                backgroundColor: pathname === '/premium' ? 'var(--soft-cream)' : 'transparent',
                borderRadius: '8px',
                borderLeft: pathname === '/premium' ? '4px solid var(--gold-accent)' : '4px solid transparent',
                textDecoration: 'none',
                transition: 'var(--transition-smooth)'
              }}
            >
              Pricing & Packages
            </Link>
            <Link
              href="/safety"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                padding: '10px 16px',
                fontWeight: '700',
                fontSize: '15px',
                color: pathname === '/safety' ? 'var(--deep-maroon)' : 'var(--text-dark)',
                backgroundColor: pathname === '/safety' ? 'var(--soft-cream)' : 'transparent',
                borderRadius: '8px',
                borderLeft: pathname === '/safety' ? '4px solid var(--gold-accent)' : '4px solid transparent',
                textDecoration: 'none',
                transition: 'var(--transition-smooth)'
              }}
            >
              Safety Guidelines
            </Link>
            <Link
              href="/zaicha"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                padding: '10px 16px',
                fontWeight: '700',
                fontSize: '15px',
                color: pathname === '/zaicha' ? 'var(--deep-maroon)' : 'var(--text-dark)',
                backgroundColor: pathname === '/zaicha' ? 'var(--soft-cream)' : 'transparent',
                borderRadius: '8px',
                borderLeft: pathname === '/zaicha' ? '4px solid var(--gold-accent)' : '4px solid transparent',
                textDecoration: 'none',
                transition: 'var(--transition-smooth)'
              }}
            >
              Zaicha Guidance
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
