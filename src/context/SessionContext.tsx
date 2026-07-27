'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
<<<<<<<< HEAD:src/context/SessionContext.tsx
import dynamic from 'next/dynamic';
========
import { signIn } from 'next-auth/react';
>>>>>>>> 7a336b811732afadabe86bd40ec8d4222cc996e8:src/context/AppContext.tsx
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

<<<<<<<< HEAD:src/context/SessionContext.tsx
// Lazy-load the UPI modal — only needed when a user clicks "Buy"
const UPIPaymentModal = dynamic(() => import('../components/UPIPaymentModal'), { ssr: false });

interface SessionContextType {
========
interface AppContextType {
>>>>>>>> 7a336b811732afadabe86bd40ec8d4222cc996e8:src/context/AppContext.tsx
  // Gated profile view flow
  pendingProfileId: string | null;
  setPendingProfileId: (val: string | null) => void;
  handleViewProfile: (profile: Profile) => void;

  // Session States
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
<<<<<<<< HEAD:src/context/SessionContext.tsx
========
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  activePackages: string[];
  setActivePackages: React.Dispatch<React.SetStateAction<string[]>>;
  highProfileApproved: boolean;
  setHighProfileApproved: (val: boolean) => void;
  hasPaidSubscription: boolean; // DB-backed membership state
  referralRate: number;
  setReferralRate: (val: number) => void;
>>>>>>>> 7a336b811732afadabe86bd40ec8d4222cc996e8:src/context/AppContext.tsx
  showLoginModal: boolean;
  setShowLoginModal: (val: boolean) => void;
  reloadTrigger: number;
  setReloadTrigger: (val: number | ((prev: number) => number)) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (val: boolean) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
  authChecked: boolean;
  profileLoadError: string;

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
  accountData: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    createdAt?: string | Date | null;
    providers?: string[];
  } | null;
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

  // Actions
  handleGoogleLogin: () => void;
  toggleSaveProfile: (id: string) => void;
  handleRegisterSubmit: (e: React.FormEvent) => Promise<void>;
  handleUPIPayment: (packageType: string, amountInRupees?: number, planName?: string) => Promise<void>;
  handleReviewSubmit: (status: 'APPROVED' | 'REJECTED' | 'NEEDS_FOLLOW_UP', request: VerificationRequest, notes: string) => Promise<void>;
  handleAssignLead: (buyerId: string, leadId: string) => Promise<void>;
  handleUpdateLeadStatus: (assignmentId: string, status: string) => Promise<void>;
  handleUpdateHPStatus: (purchaseId: string, status: 'APPROVED' | 'REJECTED', notes: string) => Promise<void>;
  handleConfirmMarriage: (purchaseId: string, confirmed: boolean) => Promise<void>;
  handleUpdateSuccessFee: (purchaseId: string, status: string) => Promise<void>;
  submitMasterAction: (actionData: Record<string, unknown>) => Promise<boolean>;

  // Headers helper for API requests
  getHeaders: () => Record<string, string>;
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

<<<<<<<< HEAD:src/context/SessionContext.tsx
const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
========
const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
>>>>>>>> 7a336b811732afadabe86bd40ec8d4222cc996e8:src/context/AppContext.tsx
  const router = useRouter();

  // --- States ---
  const [pendingProfileId, setPendingProfileId] = useState<string | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
<<<<<<<< HEAD:src/context/SessionContext.tsx
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
========
  const [isAdmin, setIsAdmin] = useState(false);
  const [activePackages, setActivePackages] = useState<string[]>([]);
  const [highProfileApproved, setHighProfileApproved] = useState(false);
  const [referralRate, setReferralRate] = useState(21);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Starts true (not false): MyAccountPage's own effect runs before this
  // provider's loadAllData effect within the same commit (child effects fire
  // before parent effects), so if this defaulted to false, a page could read
  // a stale "not loading" for one render right as authChecked flips true —
  // before loadAllData has actually run even once — and act on an empty
  // profile that was simply never fetched yet.
  const [isLoading, setIsLoading] = useState(true);
  // Becomes true once the initial /api/auth/session probe resolves — lets
  // pages tell "still checking whether you're logged in" apart from
  // "confirmed logged out" (isLoggedIn starts false either way).
  const [authChecked, setAuthChecked] = useState(false);
  const [profileLoadError, setProfileLoadError] = useState('');
>>>>>>>> 7a336b811732afadabe86bd40ec8d4222cc996e8:src/context/AppContext.tsx

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [savedProfiles, setSavedProfiles] = useState<string[]>([]);
  const [selectedProfileForDetails, setSelectedProfileForDetails] = useState<Profile | null>(null);

  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [accountData, setAccountData] = useState<any>(null);
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

  // UPI Payment Modal state
  const [showUPIModal, setShowUPIModal] = useState(false);
  const [upiModalData, setUpiModalData] = useState<{
    purchaseId: string;
    amount: number;
    planName: string;
    upiId: string;
    qrCodeUrl: string;
  } | null>(null);

  // Tracks isLoading transitions to run post-load logic for the gated profile flow
  const wasLoadingRef = useRef(false);

<<<<<<<< HEAD:src/context/SessionContext.tsx
  // Detect a real NextAuth (Google) session on first mount
  useEffect(() => {
    if (isLoggedIn) return;
========
  // Computed state for active monthly membership
  const hasPaidSubscription = !!(userProfile?.hasPaid || activePackages.includes('monthly_membership'));
>>>>>>>> 7a336b811732afadabe86bd40ec8d4222cc996e8:src/context/AppContext.tsx

  // Detect a real NextAuth (Google) session on mount
  useEffect(() => {
    async function detectRealSession() {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const session = await res.json();
          if (session?.user) {
            setIsLoggedIn(true);
<<<<<<<< HEAD:src/context/SessionContext.tsx
========
            setIsAdmin(session.user.role === 'ADMIN');
>>>>>>>> 7a336b811732afadabe86bd40ec8d4222cc996e8:src/context/AppContext.tsx
          }
        }
      } catch {
        // no session — stay logged out
      } finally {
        setAuthChecked(true);
      }
    }

    detectRealSession();
<<<<<<<< HEAD:src/context/SessionContext.tsx
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Headers helper — plain JSON
  const getHeaders = useCallback(() => {
    return { 'Content-Type': 'application/json' } as Record<string, string>;
  }, []);

  // Fetch all data
  useEffect(() => {
========
  }, []);

  // Fetch all data. Waits for the initial session probe (authChecked) so this
  // never runs with a stale, not-yet-resolved isLoggedIn value — otherwise a
  // logged-in user's data briefly resolves as "logged out", flips back once
  // the real session lands, and any page gating on that first pass mis-fires.
  useEffect(() => {
    if (!authChecked) return;

>>>>>>>> 7a336b811732afadabe86bd40ec8d4222cc996e8:src/context/AppContext.tsx
    async function loadAllData() {
      setIsLoading(true);
      setProfileLoadError('');
      try {
<<<<<<<< HEAD:src/context/SessionContext.tsx
        const headers = getHeaders();

        // 1. Fetch current user profile
        if (isLoggedIn) {
          const res = await fetch('/api/profile', { headers });
========
        // 1. Fetch current user profile
        if (isLoggedIn) {
          const res = await fetch('/api/profile');
          if (!res.ok) {
            throw new Error(`Unable to load your profile (status ${res.status}).`);
          }
>>>>>>>> 7a336b811732afadabe86bd40ec8d4222cc996e8:src/context/AppContext.tsx
          const data = await res.json();
          if (data.user) {
            setAccountData(data.user);
          }
          if (data.profile) {
            setUserProfile(data.profile);
<<<<<<<< HEAD:src/context/SessionContext.tsx
            if (data.profile.hasPaid) {
              // hasPaid is tracked in userProfile
            }
========
>>>>>>>> 7a336b811732afadabe86bd40ec8d4222cc996e8:src/context/AppContext.tsx
            setFormData({
              fullName: data.profile.fullName || '',
              gender: data.profile.gender || 'Female',
              dateOfBirth: data.profile.dateOfBirth ? new Date(data.profile.dateOfBirth).toISOString().slice(0, 10) : '',
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

<<<<<<<< HEAD:src/context/SessionContext.tsx
            // If profile exists but is incomplete, show the registration wizard
            if (data.profile.profileCompletionStatus !== 'COMPLETE') {
              setIsRegistering(true);
              setRegStep(1);
            } else {
              setIsRegistering(false);
========
            // Even if profile exists but is incomplete, do NOT automatically open the wizard
            setIsRegistering(false);

            // Sync active packages from DB into state (so page-refresh preserves access)
            try {
              const resPkg = await fetch('/api/user/purchases');
              if (resPkg.ok) {
                const pkgData = await resPkg.json();
                if (pkgData.packages && pkgData.packages.length > 0) {
                  setActivePackages(prev => Array.from(new Set([...prev, ...pkgData.packages])));
                }
                setHighProfileApproved(pkgData.highProfileApproved || false);
              }
            } catch {
              // ignore — purchases will just be empty if DB is down
>>>>>>>> 7a336b811732afadabe86bd40ec8d4222cc996e8:src/context/AppContext.tsx
            }
          } else {
            setUserProfile(null);
            setIsRegistering(false);
          }
        } else {
          setUserProfile(null);
          setAccountData(null);
          setIsRegistering(false);
        }

        // 2. Fetch public profiles
<<<<<<<< HEAD:src/context/SessionContext.tsx
        const resProfiles = await fetch('/api/profiles', { headers });
========
        const resProfiles = await fetch('/api/profiles');
>>>>>>>> 7a336b811732afadabe86bd40ec8d4222cc996e8:src/context/AppContext.tsx
        const dataProfiles = await resProfiles.json();
        if (dataProfiles.profiles) {
          setProfiles(dataProfiles.profiles);

          // Check query parameters to open profile details automatically if a profile id is provided
          if (typeof window !== 'undefined') {
            const searchParams = new URLSearchParams(window.location.search);
            const profileId = searchParams.get('profile');
            if (profileId) {
              const matched = dataProfiles.profiles.find((p: Profile) => p.id === profileId);
              if (matched) {
                setSelectedProfileForDetails(matched);
              }
            }
          }
        }

<<<<<<<< HEAD:src/context/SessionContext.tsx
        // 3. Fetch user purchases (for package access checks on client side)
        if (isLoggedIn && userProfile) {
          try {
            const resPkg = await fetch('/api/user/purchases', { headers });
            if (resPkg.ok) {
              const pkgData = await resPkg.json();
              // Package data is used by components for access checks
            }
          } catch {
            // ignore — purchases will just be empty if DB is down
========
        // 3. Fetch admin dashboards if logged in user is admin
        if (isAdmin) {
          const resReq = await fetch('/api/admin/verification');
          if (resReq.ok) {
            const dataReq = await resReq.json();
            if (dataReq.requests) {
              setAdminRequests(dataReq.requests);
            }
          }

          const resLogs = await fetch('/api/admin/verification?mode=audit');
          if (resLogs.ok) {
            const dataLogs = await resLogs.json();
            if (dataLogs.logs) {
              setAuditLogs(dataLogs.logs);
            }
          }

          const resPurchases = await fetch('/api/admin/packages');
          if (resPurchases.ok) {
            const dataPurchases = await resPurchases.json();
            if (dataPurchases.purchases) {
              setAdminPurchases(dataPurchases.purchases);
            }
          }

          const resAssignments = await fetch('/api/admin/packages?mode=assignments');
          if (resAssignments.ok) {
            const dataAssignments = await resAssignments.json();
            if (dataAssignments.assignments) {
              setAdminAssignments(dataAssignments.assignments);
            }
          }

          const resMaster = await fetch('/api/admin/master-data');
          if (resMaster.ok) {
            const dataMaster = await resMaster.json();
            setMasterMaslaks(dataMaster.maslaks || []);
            setMasterCastes(dataMaster.castes || []);
            setMasterLocations(dataMaster.locations || []);
>>>>>>>> 7a336b811732afadabe86bd40ec8d4222cc996e8:src/context/AppContext.tsx
          }
        }
      } catch (err) {
        console.error('Failed fetching database state', err);
        setProfileLoadError(err instanceof Error ? err.message : 'Failed to load account data.');
      } finally {
        setIsLoading(false);
      }
    }

    loadAllData();
<<<<<<<< HEAD:src/context/SessionContext.tsx
  }, [isLoggedIn, reloadTrigger, getHeaders, userProfile]);
========
  }, [authChecked, isLoggedIn, reloadTrigger, isAdmin]);
>>>>>>>> 7a336b811732afadabe86bd40ec8d4222cc996e8:src/context/AppContext.tsx

  // After loadAllData completes, continue any pending gated profile flow
  useEffect(() => {
    if (wasLoadingRef.current && !isLoading && isLoggedIn && pendingProfileId) {
      if (!userProfile || userProfile.profileCompletionStatus !== 'COMPLETE') {
        wasLoadingRef.current = isLoading;
        return;
      }
<<<<<<<< HEAD:src/context/SessionContext.tsx
      // Has full access — open the profile
========
      
      const hasStandardPkg = hasPaidSubscription;
      if (!hasStandardPkg) {
        router.push(`/premium?returnProfile=${pendingProfileId}`);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPendingProfileId(null);
        wasLoadingRef.current = isLoading;
        return;
      }
      
>>>>>>>> 7a336b811732afadabe86bd40ec8d4222cc996e8:src/context/AppContext.tsx
      const matched = profiles.find(p => p.id === pendingProfileId);
      if (matched) setSelectedProfileForDetails(matched);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPendingProfileId(null);
    }
    wasLoadingRef.current = isLoading;
<<<<<<<< HEAD:src/context/SessionContext.tsx
  }, [isLoading, isLoggedIn, pendingProfileId, userProfile, profiles]);
========
  }, [isLoading, isLoggedIn, pendingProfileId, userProfile, hasPaidSubscription, profiles, router]);
>>>>>>>> 7a336b811732afadabe86bd40ec8d4222cc996e8:src/context/AppContext.tsx

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
      if (typeof window !== 'undefined' && window.location.pathname !== '/') {
        router.push('/');
      }
      return;
    }
<<<<<<<< HEAD:src/context/SessionContext.tsx
    setSelectedProfileForDetails(profile);
  }, [isLoggedIn, userProfile, router]);
========

    const hasStandardPkg = hasPaidSubscription;
    if (!hasStandardPkg) {
      setPendingProfileId(profile.id);
      router.push(`/premium?returnProfile=${profile.id}`);
      return;
    }
    setSelectedProfileForDetails(profile);
  }, [isLoggedIn, userProfile, hasPaidSubscription, router]);
>>>>>>>> 7a336b811732afadabe86bd40ec8d4222cc996e8:src/context/AppContext.tsx

  const handleGoogleLogin = () => {
    signIn('google');
  };

  const toggleSaveProfile = (id: string) => {
    setSavedProfiles((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
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
<<<<<<<< HEAD:src/context/SessionContext.tsx
        headers: getHeaders(),
========
        headers: { 'Content-Type': 'application/json' },
>>>>>>>> 7a336b811732afadabe86bd40ec8d4222cc996e8:src/context/AppContext.tsx
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('rf_matrimonial_profile_completed', 'true');
          window.dispatchEvent(new Event('rf_profile_completed'));
        }
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

<<<<<<<< HEAD:src/context/SessionContext.tsx
  const handleUPIPayment = async (packageType: string, amountInRupees = 300, planName = 'Standard Monthly Membership') => {
========
  const handleRazorpayCheckout = async (packageType: string, amountInRupees = 1, planName = 'Standard Monthly Membership') => {
>>>>>>>> 7a336b811732afadabe86bd40ec8d4222cc996e8:src/context/AppContext.tsx
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    try {
      const res = await fetch('/api/payment/initiate', {
        method: 'POST',
<<<<<<<< HEAD:src/context/SessionContext.tsx
        headers: getHeaders(),
========
        headers: { 'Content-Type': 'application/json' },
>>>>>>>> 7a336b811732afadabe86bd40ec8d4222cc996e8:src/context/AppContext.tsx
        body: JSON.stringify({ packageType }),
      });

      const data = await res.json();
      if (!data.success) {
        alert(data.error || 'Failed to initiate payment.');
        return;
      }

<<<<<<<< HEAD:src/context/SessionContext.tsx
      // Open the UPI payment modal
      setUpiModalData({
        purchaseId: data.purchaseId,
        amount: data.amount,
        planName,
        upiId: data.upiId,
        qrCodeUrl: data.qrCodeUrl,
      });
      setShowUPIModal(true);
    } catch {
      alert('Network error initiating payment.');
========
      const { orderId, amount, currency, keyId } = data;

      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: 'Rishte Forever',
        description: `${planName} (₹${amountInRupees})`,
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100',
        order_id: orderId,
        handler: async function (response: { razorpay_payment_id?: string; razorpay_signature?: string }) {
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: orderId,
                paymentId: response.razorpay_payment_id || '',
                signature: response.razorpay_signature || '',
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
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
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Failed starting payment flow.');
>>>>>>>> 7a336b811732afadabe86bd40ec8d4222cc996e8:src/context/AppContext.tsx
    }
  };

  const handleReviewSubmit = async (status: 'APPROVED' | 'REJECTED' | 'NEEDS_FOLLOW_UP', request: VerificationRequest, notes: string) => {
    if (!request || !request.profile) return;
    try {
      const res = await fetch('/api/admin/verification', {
        method: 'POST',
<<<<<<<< HEAD:src/context/SessionContext.tsx
        headers: getHeaders(),
========
        headers: { 'Content-Type': 'application/json' },
>>>>>>>> 7a336b811732afadabe86bd40ec8d4222cc996e8:src/context/AppContext.tsx
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
<<<<<<<< HEAD:src/context/SessionContext.tsx
        headers: getHeaders(),
========
        headers: { 'Content-Type': 'application/json' },
>>>>>>>> 7a336b811732afadabe86bd40ec8d4222cc996e8:src/context/AppContext.tsx
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
<<<<<<<< HEAD:src/context/SessionContext.tsx
        headers: getHeaders(),
========
        headers: { 'Content-Type': 'application/json' },
>>>>>>>> 7a336b811732afadabe86bd40ec8d4222cc996e8:src/context/AppContext.tsx
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
<<<<<<<< HEAD:src/context/SessionContext.tsx
        headers: getHeaders(),
========
        headers: { 'Content-Type': 'application/json' },
>>>>>>>> 7a336b811732afadabe86bd40ec8d4222cc996e8:src/context/AppContext.tsx
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
<<<<<<<< HEAD:src/context/SessionContext.tsx
        headers: getHeaders(),
========
        headers: { 'Content-Type': 'application/json' },
>>>>>>>> 7a336b811732afadabe86bd40ec8d4222cc996e8:src/context/AppContext.tsx
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
<<<<<<<< HEAD:src/context/SessionContext.tsx
        headers: getHeaders(),
========
        headers: { 'Content-Type': 'application/json' },
>>>>>>>> 7a336b811732afadabe86bd40ec8d4222cc996e8:src/context/AppContext.tsx
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
<<<<<<<< HEAD:src/context/SessionContext.tsx
        headers: getHeaders(),
========
        headers: { 'Content-Type': 'application/json' },
>>>>>>>> 7a336b811732afadabe86bd40ec8d4222cc996e8:src/context/AppContext.tsx
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
<<<<<<<< HEAD:src/context/SessionContext.tsx
    <SessionContext.Provider
========
    <AppContext.Provider
>>>>>>>> 7a336b811732afadabe86bd40ec8d4222cc996e8:src/context/AppContext.tsx
      value={{
        pendingProfileId,
        setPendingProfileId,
        handleViewProfile,

        isLoggedIn,
        setIsLoggedIn,
<<<<<<<< HEAD:src/context/SessionContext.tsx
========
        isAdmin,
        setIsAdmin,
        activePackages,
        setActivePackages,
        highProfileApproved,
        setHighProfileApproved,
        hasPaidSubscription,
        referralRate,
        setReferralRate,
>>>>>>>> 7a336b811732afadabe86bd40ec8d4222cc996e8:src/context/AppContext.tsx
        showLoginModal,
        setShowLoginModal,
        reloadTrigger,
        setReloadTrigger,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isLoading,
        setIsLoading,
        authChecked,
        profileLoadError,

        profiles,
        setProfiles,
        savedProfiles,
        setSavedProfiles,
        selectedProfileForDetails,
        setSelectedProfileForDetails,

        userProfile,
        setUserProfile,
        accountData,
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

        handleGoogleLogin,
        toggleSaveProfile,
        handleRegisterSubmit,
        handleUPIPayment,
        handleReviewSubmit,
        handleAssignLead,
        handleUpdateLeadStatus,
        handleUpdateHPStatus,
        handleConfirmMarriage,
        handleUpdateSuccessFee,
        submitMasterAction,
        getHeaders,
      }}
    >
      {children}
<<<<<<<< HEAD:src/context/SessionContext.tsx
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
========
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
>>>>>>>> 7a336b811732afadabe86bd40ec8d4222cc996e8:src/context/AppContext.tsx
  }

  return context;
};
