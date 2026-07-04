'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';

type IconName =
  | 'home'
  | 'search'
  | 'info'
  | 'crown'
  | 'shield'
  | 'star'
  | 'event'
  | 'user'
  | 'logout'
  | 'lock'
  | 'register';

type NavItem = {
  href: string;
  label: string;
  mobileLabel?: string;
  icon: IconName;
  className?: string;
};

const leftNavItems: NavItem[] = [
  { href: '/', label: 'Home', icon: 'home' },
  { href: '/search', label: 'Browse Profiles', icon: 'search' },
  { href: '/how-it-works', label: 'How It Works', icon: 'info' },
];

const rightNavItems: NavItem[] = [
  {
    href: '/premium',
    label: 'Premium',
    mobileLabel: 'Pricing & Packages',
    icon: 'crown',
  },
  {
    href: '/safety',
    label: 'Safety',
    mobileLabel: 'Safety Guidelines',
    icon: 'shield',
  },
  {
    href: '/zaicha',
    label: 'Zaicha',
    mobileLabel: 'Zaicha Guidance',
    icon: 'star',
    className: 'nav-link-zaicha',
  },
  {
    href: '/event-management',
    label: 'Events',
    mobileLabel: 'Event Management',
    icon: 'event',
  },
];

function NavIcon({
  name,
  className = 'nav-icon',
}: {
  name: IconName;
  className?: string;
}) {
  const commonProps = {
    className,
    viewBox: '0 0 24 24',
    width: 18,
    height: 18,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  switch (name) {
    case 'home':
      return (
        <svg {...commonProps}>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );

    case 'search':
      return (
        <svg {...commonProps}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );

    case 'info':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      );

    case 'crown':
      return (
        <svg {...commonProps}>
          <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
          <path d="M3 20h18a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1z" />
        </svg>
      );

    case 'shield':
      return (
        <svg {...commonProps}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );

    case 'star':
      return (
        <svg {...commonProps} className={`${className} animate-star`}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );

    case 'event':
      return (
        <svg {...commonProps}>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <path d="M9 22V12h6v10" />
          <circle cx="17" cy="5" r="3" />
          <path d="M15.5 3.5l3 3" />
        </svg>
      );

    case 'user':
      return (
        <svg {...commonProps}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );

    case 'logout':
      return (
        <svg {...commonProps}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      );

    case 'lock':
      return (
        <svg {...commonProps}>
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      );

    case 'register':
      return (
        <svg {...commonProps}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="20" y1="8" x2="20" y2="14" />
          <line x1="17" y1="11" x2="23" y2="11" />
        </svg>
      );

    default:
      return null;
  }
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const {
    isLoggedIn,
    setIsRegistering,
    setRegStep,
    setShowLoginModal,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  } = useApp();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const closeRegistrationAndMenu = () => {
    setIsRegistering(false);
    setIsMobileMenuOpen(false);
  };

  const handleRegisterFree = () => {
    setIsMobileMenuOpen(false);

    if (isLoggedIn) {
      setRegStep(1);
      setIsRegistering(true);
      router.push('/');
      return;
    }

    setShowLoginModal(true);
  };

  const handleLoginTrigger = () => {
    setIsMobileMenuOpen(false);
    setShowLoginModal(true);
  };

  const handleLogout = async () => {
    setIsMobileMenuOpen(false);

    try {
      const { signOut } = await import('next-auth/react');
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const renderDesktopLinks = (items: NavItem[]) => (
    <ul className="nav-menu">
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className={[
              'nav-link',
              item.className ?? '',
              isActive(item.href) ? 'active' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={closeRegistrationAndMenu}
            aria-current={isActive(item.href) ? 'page' : undefined}
          >
            <NavIcon name={item.icon} />
            <span>{item.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );

  const mobileLinkStyle = (href: string) => ({
    padding: '10px 16px',
    fontWeight: 700,
    fontSize: '15px',
    color: isActive(href) ? 'var(--deep-maroon)' : 'var(--text-dark)',
    backgroundColor: isActive(href) ? 'var(--soft-cream)' : 'transparent',
    borderRadius: '8px',
    borderLeft: isActive(href)
      ? '4px solid var(--gold-accent)'
      : '4px solid transparent',
    textDecoration: 'none',
    transition: 'var(--transition-smooth)',
  });

  return (
    <header className="header font-sans">
      <div className="header-top-strip" aria-hidden="true">
        <div className="header-top-strip-ornament" />
      </div>

      <div className="container nav-outer-container">
        <div className="nav-container">
          <div className="nav-section nav-left">
            <button
              type="button"
              className="hamburger-btn"
              id="hamburger-btn"
              aria-label={
                isMobileMenuOpen
                  ? 'Close navigation menu'
                  : 'Open navigation menu'
              }
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span aria-hidden="true">☰</span>
            </button>

            <nav
              className="nav-menu-desktop"
              aria-label="Primary navigation"
            >
              {renderDesktopLinks(leftNavItems)}
            </nav>
          </div>

          <div className="logo-arch-wrapper">
            <svg
              className="logo-arch-bg"
              viewBox="0 0 280 120"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M0 120V60c0-22 22-32 47-32 40 0 50-23 93-23s53 23 93 23c25 0 47 10 47 32v60z"
                fill="var(--warm-ivory)"
              />
              <path
                d="M0 120V60c0-22 22-32 47-32 40 0 50-23 93-23s53 23 93 23c25 0 47 10 47 32v60"
                fill="none"
                stroke="var(--gold-accent)"
                strokeWidth="1.5"
              />
              <circle
                cx="140"
                cy="2"
                r="2.5"
                fill="var(--gold-accent)"
              />
              <path
                d="M136 5l4-5 4 5z"
                fill="var(--gold-accent)"
              />
            </svg>

            <div className="logo-arch-content">
              <Link
                href="/"
                className="logo-link"
                id="header-logo-link"
                onClick={closeRegistrationAndMenu}
                aria-label="Go to homepage"
              >
                <Image
                  src="/images/rishte-forever-logo.png"
                  alt="Rishte Forever — Where Faith Meets Forever"
                  width={190}
                  height={70}
                  priority
                />
              </Link>
            </div>
          </div>

          <div className="nav-section nav-right">
            <nav
              className="nav-menu-desktop"
              aria-label="Secondary navigation"
            >
              {renderDesktopLinks(
                rightNavItems.filter((item) => item.href !== '/safety')
              )}
            </nav>

            <div className="nav-actions-wrapper nav-menu-desktop">
              {isLoggedIn && (
                <Link
                  href="/my-account"
                  className="btn btn-secondary nav-btn"
                  onClick={closeRegistrationAndMenu}
                >
                  <NavIcon name="user" className="btn-icon" />
                  <span>My Account</span>
                </Link>
              )}

              {isLoggedIn ? (
                <div className="nav-actions-group">
                  <span className="nav-greeting">Salaam!</span>

                  <button
                    type="button"
                    onClick={() => void handleLogout()}
                    className="btn btn-primary nav-btn"
                    id="btn-logout"
                  >
                    <NavIcon name="logout" className="btn-icon" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="nav-actions-group">
                  <button
                    type="button"
                    onClick={handleLoginTrigger}
                    className="btn btn-secondary nav-btn"
                    id="btn-login-trigger"
                  >
                    <NavIcon name="lock" className="btn-icon" />
                    <span>Login</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          className="modal-overlay font-sans"
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            padding: 0,
            zIndex: 1000,
          }}
        >
          <aside
            id="mobile-navigation"
            aria-label="Mobile navigation"
            style={{
              width: 'min(86vw, 300px)',
              minHeight: '100%',
              padding: '24px',
              backgroundColor: 'var(--cream-bg)',
              boxShadow: 'var(--shadow-toast)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              overflowY: 'auto',
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <Link
                href="/"
                onClick={closeRegistrationAndMenu}
                aria-label="Go to homepage"
              >
                <Image
                  src="/images/rishte-forever-logo.png"
                  alt="Rishte Forever"
                  width={180}
                  height={68}
                  priority
                />
              </Link>

              <button
                type="button"
                className="modal-close-btn"
                aria-label="Close navigation menu"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ×
              </button>
            </div>

            <hr style={{ borderColor: 'var(--border-color)' }} />

            {[...leftNavItems, ...rightNavItems].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeRegistrationAndMenu}
                style={mobileLinkStyle(item.href)}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.mobileLabel ?? item.label}
              </Link>
            ))}

            {isLoggedIn && (
              <Link
                href="/my-account"
                onClick={closeRegistrationAndMenu}
                className="btn btn-secondary"
                style={{ width: '100%', marginTop: '8px' }}
              >
                My Account
              </Link>
            )}

            {isLoggedIn ? (
              <button
                type="button"
                onClick={() => void handleLogout()}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Logout
              </button>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  marginTop: '8px',
                }}
              >
                <button
                  type="button"
                  onClick={handleLoginTrigger}
                  className="btn btn-secondary"
                  style={{ width: '100%' }}
                >
                  Login
                </button>

                <button
                  type="button"
                  onClick={handleRegisterFree}
                  className="btn btn-gold"
                  style={{ width: '100%' }}
                >
                  Register Free
                </button>
              </div>
            )}
          </aside>
        </div>
      )}
    </header>
  );
}
