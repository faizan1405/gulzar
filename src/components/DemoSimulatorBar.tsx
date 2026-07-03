'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSimulator } from '../context/SimulatorContext';
import { PACKAGE_KEYS } from '../lib/packages';
import { isPublicDemoMode } from '../lib/demoEnv';

export const DemoSimulatorBar: React.FC = () => {
  const isDemoMode = isPublicDemoMode();
  const {
    isLoggedIn,
    setIsLoggedIn,
    hasPaid300,
    setHasPaid300,
    simulatedPackages,
    setSimulatedPackages,
    simulatedHighProfileApproved,
    setSimulatedHighProfileApproved,
    isAdminMode,
    setIsAdminMode
  } = useSimulator();

  const router = useRouter();
  const pathname = usePathname();

  if (!isDemoMode) return null;

  const handleAdminToggle = (checked: boolean) => {
    setIsAdminMode(checked);
    if (checked) {
      router.push('/admin');
    } else {
      router.push('/');
    }
  };

  const handleReset = () => {
    setIsLoggedIn(false);
    setHasPaid300(false);
    setSimulatedPackages([]);
    setSimulatedHighProfileApproved(false);
    setIsAdminMode(false);
    if (pathname.startsWith('/admin')) {
      router.push('/');
    }
  };

  // Sync admin state based on current URL path
  React.useEffect(() => {
    const isAdminPath = pathname.startsWith('/admin');
    if (isAdminPath !== isAdminMode) {
      setIsAdminMode(isAdminPath);
    }
  }, [pathname, isAdminMode, setIsAdminMode]);

  return (
    <div className="demo-bar font-sans">
      <span className="demo-bar-label">DEMO MODE — Pricing & Access Simulator</span>
      <div className="demo-bar-controls">
        <label className="demo-bar-checkbox">
          <input
            type="checkbox"
            checked={isLoggedIn}
            onChange={(e) => {
              setIsLoggedIn(e.target.checked);
              if (!e.target.checked) {
                setHasPaid300(false);
                setSimulatedPackages([]);
                setSimulatedHighProfileApproved(false);
              }
            }}
            id="sim-logged-in-checkbox"
          />
          Simulate Login
        </label>
        <label className="demo-bar-checkbox">
          <input
            type="checkbox"
            checked={isLoggedIn && (hasPaid300 || simulatedPackages.includes(PACKAGE_KEYS.MONTHLY))}
            disabled={!isLoggedIn}
            onChange={(e) => {
              const checked = e.target.checked;
              setHasPaid300(checked);
              if (checked) {
                setSimulatedPackages((prev) => Array.from(new Set([...prev, PACKAGE_KEYS.MONTHLY])));
              } else {
                setSimulatedPackages((prev) => prev.filter((p) => p !== PACKAGE_KEYS.MONTHLY));
              }
            }}
            id="sim-paid-300-checkbox"
          />
          Monthly Active (₹300)
        </label>
        <label className="demo-bar-checkbox">
          <input
            type="checkbox"
            checked={isLoggedIn && simulatedPackages.includes(PACKAGE_KEYS.GOOD_PROFILE)}
            disabled={!isLoggedIn}
            onChange={(e) => {
              const checked = e.target.checked;
              if (checked) {
                setSimulatedPackages((prev) => Array.from(new Set([...prev, PACKAGE_KEYS.GOOD_PROFILE])));
              } else {
                setSimulatedPackages((prev) => prev.filter((p) => p !== PACKAGE_KEYS.GOOD_PROFILE));
              }
            }}
            id="sim-good-profile-checkbox"
          />
          Good Profile Paid (₹5,500)
        </label>
        <label className="demo-bar-checkbox">
          <input
            type="checkbox"
            checked={isLoggedIn && simulatedPackages.includes(PACKAGE_KEYS.SILVER)}
            disabled={!isLoggedIn}
            onChange={(e) => {
              const checked = e.target.checked;
              if (checked) {
                setSimulatedPackages((prev) => Array.from(new Set([...prev, PACKAGE_KEYS.SILVER])));
              } else {
                setSimulatedPackages((prev) => prev.filter((p) => p !== PACKAGE_KEYS.SILVER));
              }
            }}
            id="sim-second-marriage-checkbox"
          />
          Silver Plan Paid (₹11,000)
        </label>
        <label className="demo-bar-checkbox">
          <input
            type="checkbox"
            checked={isLoggedIn && simulatedPackages.includes(PACKAGE_KEYS.GOLD)}
            disabled={!isLoggedIn}
            onChange={(e) => {
              const checked = e.target.checked;
              if (checked) {
                setSimulatedPackages((prev) => Array.from(new Set([...prev, PACKAGE_KEYS.GOLD])));
              } else {
                setSimulatedPackages((prev) => prev.filter((p) => p !== PACKAGE_KEYS.GOLD));
                setSimulatedHighProfileApproved(false);
              }
            }}
            id="sim-high-profile-checkbox"
          />
          Gold Package Paid (₹21,000)
        </label>
        {isLoggedIn && simulatedPackages.includes(PACKAGE_KEYS.GOLD) && (
          <label className="demo-bar-checkbox" style={{ color: 'var(--gold-accent)' }}>
            <input
              type="checkbox"
              checked={simulatedHighProfileApproved}
              onChange={(e) => setSimulatedHighProfileApproved(e.target.checked)}
              id="sim-high-profile-approved-checkbox"
            />
            Approved HP Match
          </label>
        )}
        <label className="demo-bar-checkbox">
          <input
            type="checkbox"
            checked={pathname.startsWith('/admin')}
            onChange={(e) => handleAdminToggle(e.target.checked)}
            id="sim-admin-checkbox"
          />
          Admin Dashboard
        </label>
        <button
          type="button"
          onClick={handleReset}
          className="demo-bar-reset"
          id="sim-reset-btn"
          style={{
            marginLeft: '4px',
            padding: '4px 12px',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--gold-accent, #b8924a)',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid var(--gold-accent, #b8924a)',
            borderRadius: '6px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          ↺ Reset Demo
        </button>
      </div>
    </div>
  );
};

export default DemoSimulatorBar;
