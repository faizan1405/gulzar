'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from '../context/SessionContext';
import { ROUTES } from '../lib/routes';

const navItems = [
  { href: ROUTES.HOME, label: 'Home', icon: 'home' },
  { href: ROUTES.SEARCH, label: 'Browse Profiles', icon: 'search' },
  { href: ROUTES.HOW_IT_WORKS, label: 'How It Works', icon: 'info' },
];

const secondaryItems = [
  { href: ROUTES.PACKAGES, label: 'Packages', icon: 'crown' },
  { href: ROUTES.SAFETY, label: 'Safety', icon: 'shield' },
  { href: ROUTES.ZAICHA, label: 'Zaicha', icon: 'star' },
  { href: ROUTES.EVENT_MANAGEMENT, label: 'Events', icon: 'event' },
];

const Icon: React.FC<{ name: string; size?: number }> = ({ name, size = 16 }) => {
  const props = { viewBox: '0 0 24 24', width: size, height: size, fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (name) {
    case 'home':
      return <svg {...props}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
    case 'search':
      return <svg {...props}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
    case 'info':
      return <svg {...props}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
    case 'crown':
      return <svg {...props}><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/><path d="M3 20h18a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1z"/></svg>;
    case 'shield':
      return <svg {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
    case 'star':
      return <svg {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
    case 'event':
      return <svg {...props}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/><circle cx="17" cy="5" r="3"/><path d="M15.5 3.5 L18.5 6.5"/></svg>;
    case 'lock':
      return <svg {...props}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
    case 'user':
      return <svg {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
    case 'logout':
      return <svg {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
    case 'settings':
      return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33-1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
    case 'add':
      return <svg {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="17" y1="11" x2="23" y2="11"/></svg>;
    default:
      return null;
  }
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    isLoggedIn,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    handleLogout,
  } = useSession();

  return (
    <header className="header font-sans">
      <div className="header-top-strip">
        <div className="header-top-strip-ornament"></div>
      </div>

      <div className="container nav-outer-container">
        {/* Single-row navbar */}
        <nav className="nav-container nav-clean">
          <div className="nav-section nav-left">
            <button
              className="hamburger-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Icon name="event" size={20} />
            </button>
            <div className="nav-links-group">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link ${pathname === item.href ? 'active' : ''}`}
                >
                  <Icon name={item.icon} size={15} />
                  <span className="nav-link-text">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="nav-section nav-center">
            <Link href="/" className="logo-link" id="header-logo-link">
              <Image
                src="/images/rishte-forever-logo.png"
                alt="Rishte Forever — Where Faith Meets Forever"
                width={170}
                height={60}
                priority
              />
            </Link>
          </div>

          <div className="nav-section nav-right">
            <div className="nav-secondary-links">
              {secondaryItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link nav-link-sm ${pathname === item.href ? 'active' : ''}`}
                  title={item.label}
                >
                  <Icon name={item.icon} size={14} />
                </Link>
              ))}
            </div>
            <div className="nav-divider"></div>
            <div className="nav-actions-group">
              {isLoggedIn ? (
                <>
                  <Link href={ROUTES.MY_ACCOUNT} className="btn btn-secondary nav-btn-sm" title="My Account">
                    <Icon name="user" size={14} />
                  </Link>
                  <button onClick={() => { router.push(ROUTES.MY_ACCOUNT); }} className="btn btn-secondary nav-btn-sm salutation">
                    Salaam!
                  </button>
                  <button onClick={handleLogout} className="btn btn-primary nav-btn-sm">
                    <Icon name="logout" size={14} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href={ROUTES.REGISTER} className="btn btn-gold nav-btn-sm">
                    <Icon name="add" size={14} />
                    Register Free
                  </Link>
                  <Link href={ROUTES.LOGIN} className="btn btn-secondary nav-btn-sm">
                    <Icon name="lock" size={14} />
                    Sign In
                  </Link>
                </>
              )}
              <Link href={ROUTES.ADMIN} className="btn btn-ghost nav-btn-sm admin-link" title="Admin">
                <Icon name="settings" size={14} />
              </Link>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <Link href="/" className="logo-link" onClick={() => setIsMobileMenuOpen(false)}>
                <Image
                  src="/images/rishte-forever-logo.png"
                  alt="Rishte Forever"
                  width={150}
                  height={52}
                />
              </Link>
              <button className="modal-close-btn" onClick={() => setIsMobileMenuOpen(false)}>&times;</button>
            </div>

            <div className="mobile-drawer-section">
              <div className="mobile-drawer-label">Menu</div>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`mobile-link ${pathname === item.href ? 'active' : ''}`}
                >
                  <Icon name={item.icon} size={18} />
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mobile-drawer-divider"></div>

            <div className="mobile-drawer-section">
              <div className="mobile-drawer-label">More</div>
              {secondaryItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`mobile-link ${pathname === item.href ? 'active' : ''}`}
                >
                  <Icon name={item.icon} size={18} />
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mobile-drawer-divider"></div>

            <div className="mobile-drawer-section">
              {isLoggedIn ? (
                <>
                  <button onClick={() => { setIsMobileMenuOpen(false); router.push(ROUTES.MY_ACCOUNT); }} className="mobile-link">
                    <Icon name="user" size={18} />
                    My Account
                  </button>
                  <button onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }} className="mobile-link">
                    <Icon name="logout" size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { setIsMobileMenuOpen(false); router.push(ROUTES.REGISTER); }} className="mobile-link">
                    <Icon name="add" size={18} />
                    Register Free
                  </button>
                  <button onClick={() => { setIsMobileMenuOpen(false); router.push(ROUTES.LOGIN); }} className="mobile-link">
                    <Icon name="lock" size={18} />
                    Sign In
                  </button>
                </>
              )}
              <Link href={ROUTES.ADMIN} onClick={() => setIsMobileMenuOpen(false)} className="mobile-link">
                <Icon name="settings" size={18} />
                Admin Panel
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
