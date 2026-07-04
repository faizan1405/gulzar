'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
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

interface AppContextType {
  // Gated profile view flow
  pendingProfileId: string | null;
  setPendingProfileId: (val: string | null) => void;
  handleViewProfile: (profile: Profile) => void;

  // Session States
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  activePackages: string[];
  setActivePackages: React.Dispatch<React.SetStateAction<string[]>>;
  highProfileApproved: boolean;
  setHighProfileApproved: (val: boolean) => void;
  hasPaidSubscription: boolean; // DB-backed membership state
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

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();

  // --- States ---
  const [pendingProfileId, setPendingProfileId] = useState<string | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activePackages, setActivePackages] = useState<string[]>([]);
  const [highProfileApproved, setHighProfileApproved] = useState(false);
  const [referralRate, setReferralRate] = useState(21);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Becomes true once the initial /api/auth/session probe resolves — lets
  // pages tell "still checking whether you're logged in" apart from
  // "confirmed logged out" (isLoggedIn starts false either way).
  const [authChecked, setAuthChecked] = useState(false);
  const [profileLoadError, setProfileLoadError] = useState('');

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

  // Computed state for active monthly membership
  const hasPaidSubscription = !!(userProfile?.hasPaid || activePackages.includes('monthly_membership'));

  // Detect a real NextAuth (Google) session on mount
  useEffect(() => {
    async function detectRealSession() {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const session = await res.json();
          if (session?.user) {
            setIsLoggedIn(true);
            setIsAdmin(session.user.role === 'ADMIN');
          }
        }
      } catch {
        // no session — stay logged out
      } finally {
        setAuthChecked(true);
      }
    }

    detectRealSession();
  }, []);

  // Fetch all data. Waits for the initial session probe (authChecked) so this
  // never runs with a stale, not-yet-resolved isLoggedIn value — otherwise a
  // logged-in user's data briefly resolves as "logged out", flips back once
  // the real session lands, and any page gating on that first pass mis-fires.
  useEffect(() => {
    if (!authChecked) return;

    async function loadAllData() {
      setIsLoading(true);
      setProfileLoadError('');
      try {
        // 1. Fetch current user profile
        if (isLoggedIn) {
          const res = await fetch('/api/profile');
          if (!res.ok) {
            throw new Error(`Unable to load your profile (status ${res.status}).`);
          }
          const data = await res.json();
          if (data.profile) {
            setUserProfile(data.profile);
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

        // 2. Fetch public profiles
        const resProfiles = await fetch('/api/profiles');
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
  }, [authChecked, isLoggedIn, reloadTrigger, isAdmin]);

  // After loadAllData completes, continue any pending gated profile flow
  useEffect(() => {
    if (wasLoadingRef.current && !isLoading && isLoggedIn && pendingProfileId) {
      if (!userProfile || userProfile.profileCompletionStatus !== 'COMPLETE') {
        wasLoadingRef.current = isLoading;
        return;
      }
      
      const hasStandardPkg = hasPaidSubscription;
      if (!hasStandardPkg) {
        router.push(`/premium?returnProfile=${pendingProfileId}`);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPendingProfileId(null);
        wasLoadingRef.current = isLoading;
        return;
      }
      
      const matched = profiles.find(p => p.id === pendingProfileId);
      if (matched) setSelectedProfileForDetails(matched);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPendingProfileId(null);
    }
    wasLoadingRef.current = isLoading;
  }, [isLoading, isLoggedIn, pendingProfileId, userProfile, hasPaidSubscription, profiles, router]);

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

    const hasStandardPkg = hasPaidSubscription;
    if (!hasStandardPkg) {
      setPendingProfileId(profile.id);
      router.push(`/premium?returnProfile=${profile.id}`);
      return;
    }
    setSelectedProfileForDetails(profile);
  }, [isLoggedIn, userProfile, hasPaidSubscription, router]);

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
        headers: { 'Content-Type': 'application/json' },
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

  const handleRazorpayCheckout = async (packageType: string, amountInRupees = 1, planName = 'Standard Monthly Membership') => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    try {
      const res = await fetch('/api/payment/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageType }),
      });

      const data = await res.json();
      if (!data.success) {
        alert(data.error || 'Failed to create payment order.');
        return;
      }

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
    }
  };

  const handleReviewSubmit = async (status: 'APPROVED' | 'REJECTED' | 'NEEDS_FOLLOW_UP', request: VerificationRequest, notes: string) => {
    if (!request || !request.profile) return;
    try {
      const res = await fetch('/api/admin/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
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
    <AppContext.Provider
      value={{
        pendingProfileId,
        setPendingProfileId,
        handleViewProfile,

        isLoggedIn,
        setIsLoggedIn,
        isAdmin,
        setIsAdmin,
        activePackages,
        setActivePackages,
        highProfileApproved,
        setHighProfileApproved,
        hasPaidSubscription,
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
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }

  return context;
};
