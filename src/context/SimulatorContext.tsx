'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DEFAULT_MASLAKS, DEFAULT_CASTES, DEFAULT_LOCATIONS } from '../lib/masterData';
import {
  Profile,
  VerificationRequest,
  AuditLog,
  PackagePurchase,
  CuratedLeadAssignment,
  MaslakOption,
  CasteOption,
  LocationOption
} from '../types';

interface SimulatorContextType {
  // Gated profile view flow
  pendingProfileId: string | null;
  setPendingProfileId: (val: string | null) => void;
  handleViewProfile: (profile: Profile) => void;

  // Simulator & Session States
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  hasPaid300: boolean;
  setHasPaid300: (val: boolean) => void;
  simulatedPackages: string[];
  setSimulatedPackages: (val: string[] | ((prev: string[]) => string[])) => void;
  simulatedHighProfileApproved: boolean;
  setSimulatedHighProfileApproved: (val: boolean) => void;
  isAdminMode: boolean;
  setIsAdminMode: (val: boolean) => void;
  referralRate: number;
  setReferralRate: (val: number) => void;
  showLoginModal: boolean;
  setShowLoginModal: (val: boolean) => void;
  reloadTrigger: number;
  setReloadTrigger: (val: number | ((prev: number) => number)) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (val: boolean) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;

  // Profile List / Search Filters / Details
  profiles: Profile[];
  setProfiles: (val: Profile[]) => void;
  savedProfiles: string[];
  setSavedProfiles: (val: string[] | ((prev: string[]) => string[])) => void;
  selectedProfileForDetails: Profile | null;
  setSelectedProfileForDetails: (val: Profile | null) => void;

  // Current User Profile Form & Registration State
  userProfile: Profile | null;
  setUserProfile: (val: Profile | null) => void;
  isRegistering: boolean;
  setIsRegistering: (val: boolean) => void;
  regStep: number;
  setRegStep: (val: number | ((prev: number) => number)) => void;
  registrationError: string;
  setRegistrationError: (val: string) => void;

  // Admin Dashboard States
  adminRequests: VerificationRequest[];
  setAdminRequests: (val: VerificationRequest[]) => void;
  auditLogs: AuditLog[];
  setAuditLogs: (val: AuditLog[]) => void;
  adminPurchases: PackagePurchase[];
  setAdminPurchases: (val: PackagePurchase[]) => void;
  adminAssignments: CuratedLeadAssignment[];
  setAdminAssignments: (val: CuratedLeadAssignment[]) => void;
  isAdminMobileOpen: boolean;
  setIsAdminMobileOpen: (val: boolean) => void;

  // Master Data Options States
  masterMaslaks: MaslakOption[];
  setMasterMaslaks: (val: MaslakOption[]) => void;
  masterCastes: CasteOption[];
  setMasterCastes: (val: CasteOption[]) => void;
  masterLocations: LocationOption[];
  setMasterLocations: (val: LocationOption[]) => void;

  // Onboarding Wizard Form Data
  formData: typeof initialFormData;
  setFormData: React.Dispatch<React.SetStateAction<typeof initialFormData>>;

  // Actions (gated flow is in handleViewProfile above)
  getSimulatorHeaders: () => Record<string, string>;
  handleGoogleLogin: () => void;
  toggleSaveProfile: (id: string) => void;
  handleRegisterSubmit: (e: React.FormEvent) => Promise<void>;
  handleRazorpayCheckout: (packageType: string, amountInRupees?: number, planName?: string) => Promise<void>;
  handleReviewSubmit: (status: 'APPROVED' | 'REJECTED' | 'NEEDS_FOLLOW_UP', request: VerificationRequest, notes: string) => Promise<void>;
  handleAssignLead: (buyerId: string, leadId: string) => Promise<void>;
  handleUpdateLeadStatus: (assignmentId: string, status: string) => Promise<void>;
  handleUpdateHPStatus: (purchaseId: string, status: 'APPROVED' | 'REJECTED', notes: string) => Promise<void>;
  handleConfirmMarriage: (purchaseId: string, confirmed: boolean) => Promise<void>;
  handleUpdateSuccessFee: (purchaseId: string, status: string) => Promise<void>;
  submitMasterAction: (actionData: Record<string, unknown>) => Promise<boolean>;
}

const initialFormData = {
  fullName: '',
  gender: 'Female',
  dateOfBirth: '',
  maritalStatus: 'Single',
  phoneNumber: '',
  city: '',
  areaOrLocality: '',
  state: '',
  country: 'India',
  education: '',
  occupation: '',
  annualIncomeRange: '₹3 LPA - ₹5 LPA',
  familyInfo: '',
  bio: '',
  partnerPref: '',
  themeColor: 'emerald',
  consent: false,
  terms: false,
  termsAccepted: false,

  // New Matrimonial Identity Fields
  maslak: '',
  fiqh: '',
  biradari: '',
  district: '',
  locality: '',
  preferredLocations: [] as string[],
  sameCastePreference: false,
  sameMaslakPreference: false,
  noCastePreference: false,
  noMaslakPreference: false,
  willingToRelocate: false,
  familyOrigin: '',
};

// localStorage key for persisting demo simulator selections across refreshes
const DEMO_STATE_KEY = 'rf-demo-sim-state';

const IS_DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

/**
 * In demo mode the simulated user never has a real DB-backed profile
 * (`/api/profile` returns 401 for `simulated-user-123`). So that package access
 * can be driven purely by the demo bar toggles, we hand the app a synthetic,
 * already-complete & approved profile. This makes `isFormComplete` true so the
 * package toggles actually unlock profile cards instead of getting stuck behind
 * the "Complete Form" gate.
 */
function buildDemoUserProfile(): Profile {
  return {
    id: 'demo-sim-profile',
    userId: 'simulated-user-123',
    fullName: 'Demo Member',
    gender: 'Female',
    dateOfBirth: '1995-06-15',
    maritalStatus: 'Single',
    phoneNumber: '+91 99999 99999',
    city: 'Mumbai',
    areaOrLocality: 'Bandra',
    state: 'Maharashtra',
    country: 'India',
    education: 'Post Graduate',
    occupation: 'Professional',
    annualIncomeRange: '₹5 LPA - ₹10 LPA',
    familyInfo: 'Demo family background.',
    bio: 'Synthetic profile used by the Pricing & Access Simulator.',
    themeColor: 'emerald',
    verificationStatus: 'APPROVED',
    profileCompletionStatus: 'COMPLETE',
    createdAt: new Date().toISOString(),
    maslak: null,
    fiqh: null,
    biradari: null,
    district: null,
    locality: null,
    preferredLocations: [],
  } as Profile;
}

const SimulatorContext = createContext<SimulatorContextType | undefined>(undefined);

export const SimulatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();

  // --- States ---
  const [pendingProfileId, setPendingProfileId] = useState<string | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasPaid300, setHasPaid300] = useState(false);
  const [simulatedPackages, setSimulatedPackages] = useState<string[]>([]);
  const [simulatedHighProfileApproved, setSimulatedHighProfileApproved] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [referralRate, setReferralRate] = useState(21);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // True once demo selections have been restored from localStorage; gates the
  // persistence writer so it never overwrites saved state with defaults on mount.
  const [demoHydrated, setDemoHydrated] = useState(false);

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [savedProfiles, setSavedProfiles] = useState<string[]>([]);
  const [selectedProfileForDetails, setSelectedProfileForDetails] = useState<Profile | null>(null);

  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [regStep, setRegStep] = useState(1);
  const [registrationError, setRegistrationError] = useState('');

  const [adminRequests, setAdminRequests] = useState<VerificationRequest[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [adminPurchases, setAdminPurchases] = useState<PackagePurchase[]>([]);
  const [adminAssignments, setAdminAssignments] = useState<CuratedLeadAssignment[]>([]);
  const [isAdminMobileOpen, setIsAdminMobileOpen] = useState(false);

  // Master Data Options
  const [masterMaslaks, setMasterMaslaks] = useState<MaslakOption[]>(() =>
    DEFAULT_MASLAKS.map((m, idx) => ({ id: `maslak-${idx}`, label: m.label, aliases: m.aliases, isDisabled: false }))
  );
  const [masterCastes, setMasterCastes] = useState<CasteOption[]>(() =>
    DEFAULT_CASTES.map((c, idx) => ({ id: `caste-${idx}`, label: c.label, aliases: c.aliases, isDisabled: false }))
  );
  const [masterLocations, setMasterLocations] = useState<LocationOption[]>(() =>
    DEFAULT_LOCATIONS.map((l, idx) => ({
      id: `loc-${idx}`,
      state: l.state,
      district: l.district,
      locality: l.locality || null,
      isHighPriority: l.isHighPriority || false,
      isDisabled: false
    }))
  );

  const [formData, setFormData] = useState(initialFormData);

  // Tracks isLoading transitions to run post-load logic for the gated profile flow
  const wasLoadingRef = useRef(false);

  // Detect a real NextAuth (Google) session on first mount. Runs in BOTH demo
  // and production modes so a real Google login reflects in the UI even while
  // the demo simulator is enabled. The demo "Continue as Demo User" button sets
  // isLoggedIn directly, so skip if it's already set. We hit /api/auth/session
  // (not /api/profile) so a freshly signed-in Google user with no matrimonial
  // profile yet still counts as logged in.
  useEffect(() => {
    if (isLoggedIn) return; // simulator (or a prior run) already set this

    async function detectRealSession() {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const session = await res.json();
          if (session?.user) {
            setIsLoggedIn(true); // triggers loadAllData via its dependency
          }
        }
      } catch {
        // no session or network error — stay logged out
      }
    }

    detectRealSession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally runs once on mount

  // Restore demo simulator selections from localStorage on first mount (demo
  // mode only). Done in an effect (not a lazy useState initializer) to avoid a
  // server/client hydration mismatch — the first paint always matches the SSR
  // "logged-out" state, then we hydrate the saved selections.
  useEffect(() => {
    if (!IS_DEMO_MODE) {
      setDemoHydrated(true);
      return;
    }
    try {
      const raw = window.localStorage.getItem(DEMO_STATE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (typeof saved.isLoggedIn === 'boolean') setIsLoggedIn(saved.isLoggedIn);
        if (typeof saved.hasPaid300 === 'boolean') setHasPaid300(saved.hasPaid300);
        if (Array.isArray(saved.simulatedPackages)) setSimulatedPackages(saved.simulatedPackages);
        if (typeof saved.simulatedHighProfileApproved === 'boolean') {
          setSimulatedHighProfileApproved(saved.simulatedHighProfileApproved);
        }
        if (typeof saved.isAdminMode === 'boolean') setIsAdminMode(saved.isAdminMode);
      }
    } catch {
      // corrupt or unavailable storage — start fresh
    }
    // Belt-and-suspenders: if the visitor landed directly on /admin (typed URL
    // or refreshed), treat admin mode as active now — this ensures the very
    // first loadAllData run uses isAdminMode=true instead of waiting for the
    // DemoSimulatorBar path-sync effect (which runs later in the tree).
    if (window.location.pathname.startsWith('/admin')) {
      setIsAdminMode(true);
    }
    setDemoHydrated(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist demo simulator selections whenever they change (demo mode only).
  // Guarded by demoHydrated so the initial mount render doesn't clobber the
  // values we just restored above.
  useEffect(() => {
    if (!IS_DEMO_MODE || !demoHydrated) return;
    try {
      window.localStorage.setItem(
        DEMO_STATE_KEY,
        JSON.stringify({ isLoggedIn, hasPaid300, simulatedPackages, simulatedHighProfileApproved, isAdminMode })
      );
    } catch {
      // storage full / unavailable — non-fatal for the demo
    }
  }, [demoHydrated, isLoggedIn, hasPaid300, simulatedPackages, simulatedHighProfileApproved, isAdminMode]);

  // Headers generator
  const getSimulatorHeaders = useCallback(() => {
    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
    if (!isDemoMode) {
      return { 'Content-Type': 'application/json' } as Record<string, string>;
    }
    
    // Admin is only asserted while the simulator is actually in admin mode.
    // Sending it unconditionally made every demo request look like an admin,
    // which bypassed server-side privacy redaction so the package toggles had
    // no effect on the data the directory returned.
    return {
      'Content-Type': 'application/json',
      'x-simulator-user-id': 'simulated-user-123',
      'x-simulator-logged-in': isLoggedIn ? 'true' : 'false',
      'x-simulator-paid': hasPaid300 ? 'true' : 'false',
      'x-simulator-admin': isAdminMode ? 'true' : 'false',
      'x-simulator-admin-id': isAdminMode ? 'simulated-admin-999' : '',
      'x-simulator-packages': simulatedPackages.join(','),
      'x-simulator-high-profile-approved': simulatedHighProfileApproved ? 'true' : 'false',
    } as Record<string, string>;
  }, [isLoggedIn, hasPaid300, simulatedPackages, simulatedHighProfileApproved, isAdminMode]);

  // Fetch all data
  useEffect(() => {
    async function loadAllData() {
      setIsLoading(true);
      try {
        const simulatorHeaders = getSimulatorHeaders();

        // 1. Fetch current user profile
        if (isLoggedIn && IS_DEMO_MODE) {
          // DEMO MODE: the simulated user has no real DB profile, so give the app
          // a synthetic complete profile. This keeps `isFormComplete` true so the
          // demo bar package toggles are the single source of access. We also skip
          // the /api/user/purchases merge below — re-adding DB packages would fight
          // the tester un-toggling a package. We intentionally do NOT touch
          // isRegistering here, so the "Register Free" flow can still open the
          // wizard on demand.
          setUserProfile(buildDemoUserProfile());
        } else if (isLoggedIn) {
          const res = await fetch('/api/profile', { headers: simulatorHeaders });
          const data = await res.json();
          if (data.profile) {
            setUserProfile(data.profile);
            if (data.profile.hasPaid) {
              setHasPaid300(true);
            }
            setFormData({
              fullName: data.profile.fullName || '',
              gender: data.profile.gender || 'Female',
              dateOfBirth: data.profile.dateOfBirth ? new Date(data.profile.dateOfBirth).toISOString().substring(0, 10) : '',
              maritalStatus: data.profile.maritalStatus || 'Single',
              phoneNumber: data.profile.phoneNumber || '',
              city: data.profile.city || '',
              areaOrLocality: data.profile.areaOrLocality || '',
              state: data.profile.state || '',
              country: data.profile.country || 'India',
              education: data.profile.education || '',
              occupation: data.profile.occupation || '',
              annualIncomeRange: data.profile.annualIncomeRange || '₹3 LPA - ₹5 LPA',
              familyInfo: data.profile.familyInfo || '',
              bio: data.profile.bio || '',
              partnerPref: data.profile.partnerPref || '',
              themeColor: data.profile.themeColor || 'emerald',
              consent: true,
              terms: true,
              termsAccepted: true,
              maslak: data.profile.maslak || '',
              fiqh: data.profile.fiqh || '',
              biradari: data.profile.biradari || '',
              district: data.profile.district || '',
              locality: data.profile.locality || '',
              preferredLocations: data.profile.preferredLocations || [],
              sameCastePreference: data.profile.sameCastePreference || false,
              sameMaslakPreference: data.profile.sameMaslakPreference || false,
              noCastePreference: data.profile.noCastePreference || false,
              noMaslakPreference: data.profile.noMaslakPreference || false,
              willingToRelocate: data.profile.willingToRelocate || false,
              familyOrigin: data.profile.familyOrigin || '',
            });

            // If profile exists but is incomplete, show the registration wizard
            if (data.profile.profileCompletionStatus !== 'COMPLETE') {
              setIsRegistering(true);
              setRegStep(1);
            } else {
              setIsRegistering(false);
            }

            // Sync active packages from DB into state (so page-refresh preserves access)
            try {
              const resPkg = await fetch('/api/user/purchases', { headers: simulatorHeaders });
              if (resPkg.ok) {
                const pkgData = await resPkg.json();
                if (pkgData.packages && pkgData.packages.length > 0) {
                  setSimulatedPackages(prev => Array.from(new Set([...prev, ...pkgData.packages])));
                }
                if (pkgData.hasPaid) {
                  setHasPaid300(true);
                }
              }
            } catch {
              // ignore — purchases will just be empty if DB is down
            }
          } else {
            setUserProfile(null);
            setIsRegistering(true);
            setRegStep(1);
          }
        } else {
          setUserProfile(null);
          setIsRegistering(false);
        }

        // 2a. Fetch public profiles
        const resProfiles = await fetch('/api/profiles', { headers: simulatorHeaders });
        const dataProfiles = await resProfiles.json();
        if (dataProfiles.profiles) {
          setProfiles(dataProfiles.profiles);
          
          // Check query parameters to open profile details automatically if a profile id is provided
          if (typeof window !== 'undefined') {
            const searchParams = new URLSearchParams(window.location.search);
            const profileId = searchParams.get('profile');
            if (profileId) {
              const matched = dataProfiles.profiles.find((p: any) => p.id === profileId);
              if (matched) {
                setSelectedProfileForDetails(matched);
              }
            }
          }
        }

        // Only fetch admin dashboards and options if user is in admin mode
        if (isAdminMode) {
          // 2b. Fetch admin requests
          const resReq = await fetch('/api/admin/verification', { headers: simulatorHeaders });
          if (resReq.ok) {
            const dataReq = await resReq.json();
            if (dataReq.requests) {
              setAdminRequests(dataReq.requests);
            }
          }

          // 3. Fetch audit logs
          const resLogs = await fetch('/api/admin/verification?mode=audit', { headers: simulatorHeaders });
          if (resLogs.ok) {
            const dataLogs = await resLogs.json();
            if (dataLogs.logs) {
              setAuditLogs(dataLogs.logs);
            }
          }

          // 4. Fetch premium purchases
          const resPurchases = await fetch('/api/admin/packages', { headers: simulatorHeaders });
          if (resPurchases.ok) {
            const dataPurchases = await resPurchases.json();
            if (dataPurchases.purchases) {
              setAdminPurchases(dataPurchases.purchases);
            }
          }

          // 5. Fetch curated assignments
          const resAssignments = await fetch('/api/admin/packages?mode=assignments', { headers: simulatorHeaders });
          if (resAssignments.ok) {
            const dataAssignments = await resAssignments.json();
            if (dataAssignments.assignments) {
              setAdminAssignments(dataAssignments.assignments);
            }
          }

          // 6. Fetch master data options
          const resMaster = await fetch('/api/admin/master-data', { headers: simulatorHeaders });
          if (resMaster.ok) {
            const dataMaster = await resMaster.json();
            setMasterMaslaks(dataMaster.maslaks || []);
            setMasterCastes(dataMaster.castes || []);
            setMasterLocations(dataMaster.locations || []);
          }
        }
      } catch (err) {
        console.error('Failed fetching database state', err);
      } finally {
        setIsLoading(false);
      }
    }


    loadAllData();
  }, [isLoggedIn, hasPaid300, simulatedPackages, simulatedHighProfileApproved, reloadTrigger, getSimulatorHeaders, isAdminMode]);

  // After loadAllData completes, continue any pending gated profile flow
  useEffect(() => {
    if (wasLoadingRef.current && !isLoading && isLoggedIn && pendingProfileId) {
      // isLoading just went from true → false while logged in with a pending profile
      if (!userProfile || userProfile.profileCompletionStatus !== 'COMPLETE') {
        // Onboarding wizard will show (isRegistering was set by loadAllData).
        // Keep pendingProfileId so handleRegisterSubmit can pick it up.
        wasLoadingRef.current = isLoading;
        return;
      }
      const hasAnyPackage = hasPaid300 || simulatedPackages.length > 0;
      if (!hasAnyPackage) {
        router.push(`/premium?returnProfile=${pendingProfileId}`);
        setPendingProfileId(null);
        wasLoadingRef.current = isLoading;
        return;
      }
      // Has full access — open the profile
      const matched = profiles.find(p => p.id === pendingProfileId);
      if (matched) setSelectedProfileForDetails(matched);
      setPendingProfileId(null);
    }
    wasLoadingRef.current = isLoading;
  }, [isLoading, isLoggedIn, pendingProfileId, userProfile, hasPaid300, simulatedPackages, profiles]);

  const handleViewProfile = useCallback((profile: Profile) => {
    if (!isLoggedIn) {
      setPendingProfileId(profile.id);
      setShowLoginModal(true);
      return;
    }
    if (!userProfile || userProfile.profileCompletionStatus !== 'COMPLETE') {
      setPendingProfileId(profile.id);
      setIsRegistering(true);
      setRegStep(1);
      // Navigate home so the onboarding wizard (in HomeClient) is visible
      if (typeof window !== 'undefined' && window.location.pathname !== '/') {
        router.push('/');
      }
      return;
    }
    const hasAnyPackage = hasPaid300 || simulatedPackages.length > 0;
    if (!hasAnyPackage) {
      setPendingProfileId(profile.id);
      router.push(`/premium?returnProfile=${profile.id}`);
      return;
    }
    setSelectedProfileForDetails(profile);
  }, [isLoggedIn, userProfile, hasPaid300, simulatedPackages, router]);

  const handleGoogleLogin = () => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  const toggleSaveProfile = (id: string) => {
    setSavedProfiles((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      setRegistrationError('Please accept the Terms & Conditions before submitting.');
      return;
    }
    if (!formData.consent || !formData.terms) {
      setRegistrationError('You must accept the terms and provide consent.');
      return;
    }

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: getSimulatorHeaders(),
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        if (pendingProfileId) {
          alert('Profile saved! Please choose a package to view full profiles.');
          setIsRegistering(false);
          setReloadTrigger((prev) => prev + 1);
          router.push(`/premium?returnProfile=${pendingProfileId}`);
          setPendingProfileId(null);
        } else {
          alert('Matrimonial profile saved successfully! Entering manual verification queue.');
          setReloadTrigger((prev) => prev + 1);
          setIsRegistering(false);
        }
      } else {
        const data = await res.json();
        setRegistrationError(data.error || 'Failed to save profile.');
      }
    } catch {
      setRegistrationError('Network error saving profile.');
    }
  };

  const handleRazorpayCheckout = async (packageType: string, amountInRupees = 300, planName = 'Standard Monthly Membership') => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    try {
      const res = await fetch('/api/payment/order', {
        method: 'POST',
        headers: getSimulatorHeaders(),
        body: JSON.stringify({ packageType }),
      });

      const data = await res.json();
      if (!data.success) {
        alert(data.error || 'Failed to create payment order.');
        return;
      }

      const { orderId, amount, currency, keyId, isSimulated } = data;

      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: 'Rishte Forever',
        description: `${planName} (₹${amountInRupees} + 18% GST)`,
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100',
        order_id: orderId,
        handler: async function (response: { razorpay_payment_id?: string; razorpay_signature?: string }) {
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: getSimulatorHeaders(),
              body: JSON.stringify({
                orderId: orderId,
                paymentId: response.razorpay_payment_id || 'mock_pay_id',
                signature: response.razorpay_signature || 'mock_sig',
                isSimulated: isSimulated,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              if (packageType === 'monthly_membership') {
                setHasPaid300(true);
              }
              setSimulatedPackages((prev) => Array.from(new Set([...prev, packageType])));
              const returnId = pendingProfileId;
              setPendingProfileId(null);
              alert(`Alhamdulillah! Payment verified and your ${planName} is now active.${returnId ? '\n\nRedirecting you to the selected profile.' : ''}`);
              setReloadTrigger((prev) => prev + 1);
              if (returnId) {
                router.push(`/?profile=${returnId}`);
              }
            } else {
              alert(verifyData.error || 'Payment verification failed.');
            }
          } catch {
            alert('Network error verifying payment.');
          }
        },
        prefill: {
          name: formData.fullName || 'User Name',
          contact: formData.phoneNumber || '+919999999999',
        },
        theme: {
          color: '#6F1D35',
        },
      };

      if (isSimulated) {
        if (confirm(`[SIMULATOR] Razorpay checkout popup triggered.\n\nOrder ID: ${orderId}\nAmount: ₹${amount/100}\n\nClick OK to simulate successful transaction approval.`)) {
          options.handler({
            razorpay_payment_id: 'pay_mock_' + Date.now(),
            razorpay_signature: 'sig_mock_' + Date.now(),
          });
        }
      } else {
        const loadScript = () => {
          return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
          });
        };

        const loaded = await loadScript();
        if (!loaded) {
          alert('Failed to load Razorpay payment widget. Check network connection.');
          return;
        }

        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Failed starting payment flow.');
    }
  };

  const handleReviewSubmit = async (status: 'APPROVED' | 'REJECTED' | 'NEEDS_FOLLOW_UP', request: VerificationRequest, notes: string) => {
    if (!request || !request.profile) return;
    try {
      const res = await fetch('/api/admin/verification', {
        method: 'POST',
        headers: getSimulatorHeaders(),
        body: JSON.stringify({
          profileId: request.profile.id,
          status,
          notes,
        }),
      });

      if (res.ok) {
        alert(`Status updated to ${status}! Audit log entry created.`);
        setReloadTrigger((prev) => prev + 1);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to update verification status.');
      }
    } catch {
      alert('Error updating status.');
    }
  };

  const handleAssignLead = async (buyerId: string, leadId: string) => {
    if (!buyerId || !leadId) {
      alert('Please select both a curated buyer and a lead profile.');
      return;
    }
    try {
      const res = await fetch('/api/admin/packages', {
        method: 'POST',
        headers: getSimulatorHeaders(),
        body: JSON.stringify({
          action: 'assign_lead',
          buyerProfileId: buyerId,
          leadProfileId: leadId,
        }),
      });
      if (res.ok) {
        alert('Curated lead assigned successfully!');
        setReloadTrigger((prev) => prev + 1);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to assign curated lead.');
      }
    } catch {
      alert('Error assigning lead.');
    }
  };

  const handleUpdateLeadStatus = async (assignmentId: string, status: string) => {
    try {
      const res = await fetch('/api/admin/packages', {
        method: 'POST',
        headers: getSimulatorHeaders(),
        body: JSON.stringify({
          action: 'update_lead_status',
          assignmentId,
          status,
        }),
      });
      if (res.ok) {
        alert(`Lead status updated to: ${status}`);
        setReloadTrigger((prev) => prev + 1);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update lead status.');
      }
    } catch {
      alert('Error updating lead status.');
    }
  };

  const handleUpdateHPStatus = async (purchaseId: string, status: 'APPROVED' | 'REJECTED', notes: string) => {
    try {
      const res = await fetch('/api/admin/packages', {
        method: 'POST',
        headers: getSimulatorHeaders(),
        body: JSON.stringify({
          action: 'update_eligibility',
          purchaseId,
          status,
          notes,
        }),
      });
      if (res.ok) {
        alert(`Eligibility status updated to: ${status}`);
        setReloadTrigger((prev) => prev + 1);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update eligibility status.');
      }
    } catch {
      alert('Error updating eligibility.');
    }
  };

  const handleConfirmMarriage = async (purchaseId: string, confirmed: boolean) => {
    try {
      const res = await fetch('/api/admin/packages', {
        method: 'POST',
        headers: getSimulatorHeaders(),
        body: JSON.stringify({
          action: 'confirm_marriage',
          purchaseId,
          confirmed,
        }),
      });
      if (res.ok) {
        alert(`Marriage status updated successfully.`);
        setReloadTrigger((prev) => prev + 1);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update marriage status.');
      }
    } catch {
      alert('Error updating marriage confirmation.');
    }
  };

  const handleUpdateSuccessFee = async (purchaseId: string, status: string) => {
    try {
      const res = await fetch('/api/admin/packages', {
        method: 'POST',
        headers: getSimulatorHeaders(),
        body: JSON.stringify({
          action: 'update_success_fee_status',
          purchaseId,
          status,
        }),
      });
      if (res.ok) {
        alert(`Success fee status updated to: ${status}`);
        setReloadTrigger((prev) => prev + 1);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update success fee status.');
      }
    } catch {
      alert('Error updating success fee payment.');
    }
  };

  const submitMasterAction = async (actionData: Record<string, unknown>) => {
    try {
      const res = await fetch('/api/admin/master-data', {
        method: 'POST',
        headers: getSimulatorHeaders(),
        body: JSON.stringify(actionData)
      });
      if (res.ok) {
        setReloadTrigger((prev) => prev + 1);
        return true;
      } else {
        const data = await res.json();
        alert(data.error || 'Master data action failed');
      }
    } catch {
      alert('Network error executing master data action');
    }
    return false;
  };

  return (
    <SimulatorContext.Provider
      value={{
        pendingProfileId,
        setPendingProfileId,
        handleViewProfile,

        isLoggedIn,
        setIsLoggedIn,
        hasPaid300,
        setHasPaid300,
        simulatedPackages,
        setSimulatedPackages,
        simulatedHighProfileApproved,
        setSimulatedHighProfileApproved,
        isAdminMode,
        setIsAdminMode,
        referralRate,
        setReferralRate,
        showLoginModal,
        setShowLoginModal,
        reloadTrigger,
        setReloadTrigger,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isLoading,
        setIsLoading,

        profiles,
        setProfiles,
        savedProfiles,
        setSavedProfiles,
        selectedProfileForDetails,
        setSelectedProfileForDetails,

        userProfile,
        setUserProfile,
        isRegistering,
        setIsRegistering,
        regStep,
        setRegStep,
        registrationError,
        setRegistrationError,

        adminRequests,
        setAdminRequests,
        auditLogs,
        setAuditLogs,
        adminPurchases,
        setAdminPurchases,
        adminAssignments,
        setAdminAssignments,
        isAdminMobileOpen,
        setIsAdminMobileOpen,

        masterMaslaks,
        setMasterMaslaks,
        masterCastes,
        setMasterCastes,
        masterLocations,
        setMasterLocations,

        formData,
        setFormData,

        getSimulatorHeaders,
        handleGoogleLogin,
        toggleSaveProfile,
        handleRegisterSubmit,
        handleRazorpayCheckout,
        handleReviewSubmit,
        handleAssignLead,
        handleUpdateLeadStatus,
        handleUpdateHPStatus,
        handleConfirmMarriage,
        handleUpdateSuccessFee,
        submitMasterAction,
      }}
    >
      {children}
    </SimulatorContext.Provider>
  );
};

export const useSimulator = () => {
  const context = useContext(SimulatorContext);
  if (context === undefined) {
    throw new Error('useSimulator must be used within a SimulatorProvider');
  }

  return context;
};
