'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { DEFAULT_MASLAKS, DEFAULT_CASTES, DEFAULT_LOCATIONS } from '../lib/masterData';
import { Profile, VerificationRequest, AuditLog, PackagePurchase, CuratedLeadAssignment, MaslakOption, CasteOption, LocationOption } from '@/types';

interface SessionContextType {
  // Gated profile view flow
  pendingProfileId: string | null;
  setPendingProfileId: (val: string | null) => void;
  handleViewProfile: (profile: Profile) => void;

  // Session States
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
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
  } | null;
  isRegistering: boolean;
  setIsRegistering: (val: boolean) => void;
  isSubmittingForm: boolean;
  setIsSubmittingForm: (val: boolean) => void;
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
  handleLogout: () => void;
  toggleSaveProfile: (id: string) => void;
  handleRegisterSubmit: (e: React.FormEvent) => Promise<void>;
  handleUPIPayment: (packageType: string, planName?: string) => Promise<void>;
  handleReviewSubmit: (status: 'APPROVED' | 'REJECTED' | 'NEEDS_FOLLOW_UP', request: VerificationRequest, notes: string) => Promise<void>;
  handleAssignLead: (buyerId: string, leadId: string) => void;
  handleUpdateLeadStatus: (assignmentId: string, status: string) => void;
  handleUpdateHPStatus: (purchaseId: string, status: 'APPROVED' | 'REJECTED', notes: string) => void;
  handleConfirmMarriage: (purchaseId: string, confirmed: boolean) => void;
  handleUpdateSuccessFee: (purchaseId: string, status: string) => void;

  // Headers helper for API requests
  getHeaders: () => Record<string, string>;

  // Purchase access (populated by loadAllData)
  activePackages: string[];
  hasPaid300: boolean;
  highProfileApproved: boolean;
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

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();

  // --- States ---
  const [pendingProfileId, setPendingProfileId] = useState<string | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [profileLoadError, setProfileLoadError] = useState('');

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [savedProfiles, setSavedProfiles] = useState<string[]>([]);
  const [selectedProfileForDetails, setSelectedProfileForDetails] = useState<Profile | null>(null);

  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [accountData, setAccountData] = useState<{ name?: string; email?: string; phone?: string; createdAt?: string | Date | null } | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [regStep, setRegStep] = useState(1);
  const [registrationError, setRegistrationError] = useState('');

  const [adminRequests, setAdminRequests] = useState<VerificationRequest[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [adminPurchases, setAdminPurchases] = useState<PackagePurchase[]>([]);
  const [adminAssignments, setAdminAssignments] = useState<CuratedLeadAssignment[]>([]);
  const [isAdminMobileOpen, setIsAdminMobileOpen] = useState(false);

  // Purchase access (populated by loadAllData)
  const [activePackages, setActivePackages] = useState<string[]>([]);
  const hasPaid300 = !!userProfile?.hasPaid || activePackages.includes('monthly_membership');
  const highProfileApproved = !!userProfile?.highProfileApproved;

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
  const [, setShowUPIModal] = useState(false);
  const [, setUpiModalData] = useState<{
    purchaseId: string;
    amount: number;
    planName: string;
    upiId: string;
    qrCodeUrl: string;
  } | null>(null);

  // Tracks isLoading transitions to run post-load logic for the gated profile flow
  const wasLoadingRef = useRef(false);
  const hasLoadedProfileRef = useRef(false);

  // Detect a real NextAuth session — runs on mount and whenever reloadTrigger changes
  const [, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function detectRealSession() {
      try {
        const res = await fetch('/api/auth/session', { cache: 'no-store' });
        if (!res.ok) throw new Error('Session fetch failed');
        const session = await res.json();
        if (session?.user) {
          setIsLoggedIn(true);
          if (session.user.role) setUserRole(session.user.role);
        } else {
          setIsLoggedIn(false);
          setUserRole(null);
        }
      } catch {
        setIsLoggedIn(false);
        setUserRole(null);
      } finally {
        if (!cancelled) {
          setAuthChecked(true);
        }
      }
    }

    detectRealSession();
    return () => { cancelled = true; };

  }, [reloadTrigger]);

  // Reset the loaded-profile guard whenever the auth state resets,
  // so that a fresh login triggers a new data load.
  useEffect(() => {
    hasLoadedProfileRef.current = false;
  }, [reloadTrigger]);

  // After a successful login, if the user has no complete profile yet,
  // auto-open the registration wizard so onboarding is seamless.
  // Uses a ref to only react to the logged-in transition, avoiding
  // re-triggers when userProfile updates from loadAllData.
  const prevLoggedInRef = useRef(isLoggedIn);
  useEffect(() => {
    if (!isLoggedIn || !userProfile) return;
    const justLoggedIn = prevLoggedInRef.current === false && isLoggedIn === true;
    if (justLoggedIn && userProfile.profileCompletionStatus !== 'COMPLETE') {
      setIsRegistering(true);
      setRegStep(1);
    }
    prevLoggedInRef.current = isLoggedIn;
  }, [isLoggedIn, userProfile, setIsRegistering, setRegStep]);

  // Fetch all data
  // userProfile is intentionally excluded from deps to prevent an infinite
  // render loop: loadAllData calls setUserProfile internally.
  const loadAllDataRef = useRef<(() => void) | null>(null);

  const [loadTick, setLoadTick] = useState(0);
  const loadTickRef = useRef(0);

  useEffect(() => {
    if (!isLoggedIn) return;
    if (hasLoadedProfileRef.current) return;
    loadTickRef.current += 1;
    setLoadTick(loadTickRef.current);
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;
    if (hasLoadedProfileRef.current) return;
    loadAllDataRef.current?.();
  }, [isLoggedIn, loadTick]);

  // After loadAllData completes, continue any pending gated profile flow
  useEffect(() => {
    if (wasLoadingRef.current && !isLoading && isLoggedIn && pendingProfileId) {
      if (!userProfile || userProfile.profileCompletionStatus !== 'COMPLETE') {
        wasLoadingRef.current = isLoading;
        return;
      }
      // Has full access — open the profile
      const matched = profiles.find(p => p.id === pendingProfileId);
      if (matched) setSelectedProfileForDetails(matched);

      setPendingProfileId(null);
    }
    wasLoadingRef.current = isLoading;
  }, [isLoading, isLoggedIn, pendingProfileId, userProfile, profiles]);

  // Headers helper — plain JSON
  const getHeaders = useCallback(() => {
    return {
      'Content-Type': 'application/json',
      credentials: 'include',
    } as Record<string, string>;
  }, []);

  // Data-loading function — defined outside useEffect so the ref can point to it.
  // userProfile is intentionally read from the closure at call time, not from deps,
  // to prevent an infinite render loop.
  const loadAllData = async () => {
    if (hasLoadedProfileRef.current) return;
    setIsLoading(true);
    setProfileLoadError('');
    try {
      const headers = getHeaders();

      // 1. Fetch current user profile
      if (isLoggedIn) {
        const res = await fetch('/api/profile', { headers });
        if (!res.ok) {
          throw new Error(`Unable to load your profile (status ${res.status}).`);
        }
        const data = await res.json();
        if (data.user) {
          setAccountData(data.user);
        }
        if (data.profile) {
          setUserProfile(data.profile);
          hasLoadedProfileRef.current = true;
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
          if (data.profile.profileCompletionStatus !== 'COMPLETE') {
            setIsRegistering(true);
          } else {
            setIsRegistering(false);
          }
        } else {
          setUserProfile(null);
          hasLoadedProfileRef.current = true;
          setIsRegistering(false);
        }
      } else {
        setUserProfile(null);
        setAccountData(null);
        setIsRegistering(false);
        hasLoadedProfileRef.current = true;
      }

      // 2. Fetch public profiles
      const resProfiles = await fetch('/api/profiles', { headers });
      const dataProfiles = await resProfiles.json();
      if (dataProfiles.profiles) {
        setProfiles(dataProfiles.profiles);

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

      // 3. Fetch user purchases
      if (isLoggedIn) {
        try {
          const resPkg = await fetch('/api/user/purchases', { headers });
          if (resPkg.ok) {
            const pkgData = await resPkg.json();
            const pkgs: string[] = Array.isArray(pkgData.purchases)
              ? pkgData.purchases
                  .filter((p: Record<string, unknown>) => (p as Record<string, unknown>).paymentStatus === 'PAID' && (p as Record<string, unknown>).accessStatus === 'ACTIVE')
                  .map((p: Record<string, unknown>) => typeof (p as Record<string, unknown>).packageType === 'string' ? (p as Record<string, unknown>).packageType as string : '')
              : [];
            setActivePackages(pkgs);
          }
        } catch {
          // ignore — purchases will just be empty if DB is down
        }
      } else {
        setActivePackages([]);
      }
    } catch (err) {
      console.error('Failed fetching database state', err);
      setProfileLoadError(err instanceof Error ? err.message : 'Failed to load account data.');
    } finally {
      setIsLoading(false);
    }
  };

  // Point the ref at the function now that it's defined
  loadAllDataRef.current = loadAllData;

  const handleViewProfile = useCallback((profile: Profile) => {
    if (!isLoggedIn) {
      setSelectedProfileForDetails(profile);
      return;
    }
    if (!userProfile || userProfile.profileCompletionStatus !== 'COMPLETE') {
      setSelectedProfileForDetails(profile);
      return;
    }
    setSelectedProfileForDetails(profile);
  }, [isLoggedIn, userProfile]);

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/' });
    } finally {
      setIsLoggedIn(false);
      setUserProfile(null);
      setAccountData(null);
      setActivePackages([]);
      setIsRegistering(false);
      setReloadTrigger((prev) => prev + 1);
    }
  };

  const toggleSaveProfile = (id: string) => {
    setSavedProfiles((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      router.push('/register');
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

    setIsSubmittingForm(true);
    let profileData = null;
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const data = await res.json().catch(() => ({ error: 'Unknown server error.' }));

      if (!res.ok) {
        setRegistrationError(data.error || `Server returned ${res.status}. Please try again.`);
        return;
      }

      // Success — set the profile directly from the API response so the UI updates immediately
      if (data.profile) {
        setUserProfile(data.profile);
      }
      // Set account data from session
      if (data.user) {
        setAccountData(data.user);
      }

      setRegistrationError('');
      setIsRegistering(false);
      setReloadTrigger((prev) => prev + 1);
      setLoadTick((prev) => prev + 1);

      if (typeof window !== 'undefined') {
        localStorage.setItem('rf_matrimonial_profile_completed', 'true');
        window.dispatchEvent(new Event('rf_profile_completed'));
      }

      if (pendingProfileId) {
        router.push(`/packages?returnProfile=${pendingProfileId}`);
        setPendingProfileId(null);
      }
    } catch {
      setRegistrationError('Network error saving profile. Please check your connection and try again.');
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const handleUPIPayment = async (packageType: string, planName: string = 'Standard Monthly Membership') => {
    if (!isLoggedIn) {
      router.push('/register');
      return;
    }

    const isFormComplete = userProfile?.profileCompletionStatus === 'COMPLETE';
    if (!isFormComplete) {
      router.push('/register');
      return;
    }

    try {
      const res = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ packageType }),
      });

      const data = await res.json();
      if (!data.success) {
        alert(data.error || 'Failed to initiate payment.');
        return;
      }

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
    }
  };

  const handleReviewSubmit = async (status: 'APPROVED' | 'REJECTED' | 'NEEDS_FOLLOW_UP', request: VerificationRequest, notes: string) => {
    if (!request || !request.profile) return;
    try {
      const res = await fetch('/api/admin/verification', {
        method: 'POST',
        headers: getHeaders(),
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
        headers: getHeaders(),
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
        headers: getHeaders(),
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
        headers: getHeaders(),
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
        headers: getHeaders(),
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
        headers: getHeaders(),
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
        alert(data.error || 'Failed to update success fee payment.');
      }
    } catch {
      alert('Error updating success fee payment.');
    }
  };

  return (
    <SessionContext.Provider
      value={{
        pendingProfileId,
        setPendingProfileId,
        handleViewProfile,

        isLoggedIn,
        setIsLoggedIn,
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
        isSubmittingForm,
        setIsSubmittingForm,
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

        activePackages,
        hasPaid300,
        highProfileApproved,

        masterMaslaks,
        setMasterMaslaks,
        masterCastes,
        setMasterCastes,
        masterLocations,
        setMasterLocations,

        formData,
        setFormData,

        handleLogout,
        toggleSaveProfile,
        handleRegisterSubmit,
        handleUPIPayment,
        handleReviewSubmit,
        handleAssignLead,
        handleUpdateLeadStatus,
        handleUpdateHPStatus,
        handleConfirmMarriage,
        handleUpdateSuccessFee,
        getHeaders,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }

  return context;
};
