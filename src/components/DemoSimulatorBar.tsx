'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSimulator } from '../context/SimulatorContext';

export const DemoSimulatorBar: React.FC = () => {
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

  const handleAdminToggle = (checked: boolean) => {
    setIsAdminMode(checked);
    if (checked) {
      router.push('/admin');
    } else {
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
      <span className="demo-bar-label">DEMO MODE — Verification & Custom Redesign Simulator</span>
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
            checked={hasPaid300 || simulatedPackages.includes('STANDARD')}
            onChange={(e) => {
              const checked = e.target.checked;
              setHasPaid300(checked);
              if (checked) {
                setSimulatedPackages((prev) => Array.from(new Set([...prev, 'STANDARD'])));
              } else {
                setSimulatedPackages((prev) => prev.filter((p) => p !== 'STANDARD'));
              }
            }}
            id="sim-paid-300-checkbox"
          />
          Standard Pkg Paid
        </label>
        <label className="demo-bar-checkbox">
          <input
            type="checkbox"
            checked={simulatedPackages.includes('CURATED')}
            onChange={(e) => {
              const checked = e.target.checked;
              if (checked) {
                setSimulatedPackages((prev) => Array.from(new Set([...prev, 'CURATED'])));
              } else {
                setSimulatedPackages((prev) => prev.filter((p) => p !== 'CURATED'));
              }
            }}
            id="sim-curated-checkbox"
          />
          Curated Paid
        </label>
        <label className="demo-bar-checkbox">
          <input
            type="checkbox"
            checked={simulatedPackages.includes('SECOND_MARRIAGE')}
            onChange={(e) => {
              const checked = e.target.checked;
              if (checked) {
                setSimulatedPackages((prev) => Array.from(new Set([...prev, 'SECOND_MARRIAGE'])));
              } else {
                setSimulatedPackages((prev) => prev.filter((p) => p !== 'SECOND_MARRIAGE'));
              }
            }}
            id="sim-second-marriage-checkbox"
          />
          Second Marriage Paid
        </label>
        <label className="demo-bar-checkbox">
          <input
            type="checkbox"
            checked={simulatedPackages.includes('HIGH_PROFILE')}
            onChange={(e) => {
              const checked = e.target.checked;
              if (checked) {
                setSimulatedPackages((prev) => Array.from(new Set([...prev, 'HIGH_PROFILE'])));
              } else {
                setSimulatedPackages((prev) => prev.filter((p) => p !== 'HIGH_PROFILE'));
                setSimulatedHighProfileApproved(false);
              }
            }}
            id="sim-high-profile-checkbox"
          />
          High Profile Paid
        </label>
        {simulatedPackages.includes('HIGH_PROFILE') && (
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
      </div>
    </div>
  );
};

export default DemoSimulatorBar;
