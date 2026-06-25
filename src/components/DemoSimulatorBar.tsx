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
            checked={isLoggedIn && (hasPaid300 || simulatedPackages.includes('monthly_membership'))}
            disabled={!isLoggedIn}
            onChange={(e) => {
              const checked = e.target.checked;
              setHasPaid300(checked);
              if (checked) {
                setSimulatedPackages((prev) => Array.from(new Set([...prev, 'monthly_membership'])));
              } else {
                setSimulatedPackages((prev) => prev.filter((p) => p !== 'monthly_membership'));
              }
            }}
            id="sim-paid-300-checkbox"
          />
          Monthly Active (₹300)
        </label>
        <label className="demo-bar-checkbox">
          <input
            type="checkbox"
            checked={isLoggedIn && simulatedPackages.includes('good_profile_package')}
            disabled={!isLoggedIn}
            onChange={(e) => {
              const checked = e.target.checked;
              if (checked) {
                setSimulatedPackages((prev) => Array.from(new Set([...prev, 'good_profile_package'])));
              } else {
                setSimulatedPackages((prev) => prev.filter((p) => p !== 'good_profile_package'));
              }
            }}
            id="sim-good-profile-checkbox"
          />
          Good Profile Paid (₹5,500)
        </label>
        <label className="demo-bar-checkbox">
          <input
            type="checkbox"
            checked={isLoggedIn && simulatedPackages.includes('second_marriage_package')}
            disabled={!isLoggedIn}
            onChange={(e) => {
              const checked = e.target.checked;
              if (checked) {
                setSimulatedPackages((prev) => Array.from(new Set([...prev, 'second_marriage_package'])));
              } else {
                setSimulatedPackages((prev) => prev.filter((p) => p !== 'second_marriage_package'));
              }
            }}
            id="sim-second-marriage-checkbox"
          />
          Silver Plan Paid (₹11,000)
        </label>
        <label className="demo-bar-checkbox">
          <input
            type="checkbox"
            checked={isLoggedIn && simulatedPackages.includes('high_profile_package')}
            disabled={!isLoggedIn}
            onChange={(e) => {
              const checked = e.target.checked;
              if (checked) {
                setSimulatedPackages((prev) => Array.from(new Set([...prev, 'high_profile_package'])));
              } else {
                setSimulatedPackages((prev) => prev.filter((p) => p !== 'high_profile_package'));
                setSimulatedHighProfileApproved(false);
              }
            }}
            id="sim-high-profile-checkbox"
          />
          Gold Package Paid (₹21,000)
        </label>
        {isLoggedIn && simulatedPackages.includes('high_profile_package') && (
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
