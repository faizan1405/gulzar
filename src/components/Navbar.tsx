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
          @media (max-width: 1180px) {
            #hamburger-btn { display: flex !important; }
            .nav-menu-desktop { display: none !important; }
          }
        `}</style>

        {/* Left: hamburger (mobile) + primary nav links (desktop) */}
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
              <li>
                <Link href="/zaicha" className={`nav-link nav-link-zaicha ${pathname === '/zaicha' ? 'active' : ''}`}>
                  Zaicha
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Center: logo */}
        <Link href="/" className="logo" id="header-logo-link" style={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src="/images/rishte-forever-logo.png"
            alt="Rishte Forever — Where Faith Meets Forever"
            width={210}
            height={79}
            priority
            style={{ display: 'block' }}
          />
        </Link>

        {/* Right: action buttons */}
        <div className="nav-section nav-right">
          <div className="nav-menu-desktop nav-actions-wrapper">
            {isLoggedIn && (
              <Link
                href="/my-account"
                className="btn btn-secondary nav-btn"
              >
                My Account
              </Link>
            )}
            <Link
              href="/admin"
              className="btn btn-secondary nav-btn"
              id="btn-toggle-admin"
            >
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
                  Login
                </button>
                <button
                  onClick={handleRegisterFree}
                  className="btn btn-gold nav-btn"
                >
                  Register Free
                </button>
              </div>
            )}
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
