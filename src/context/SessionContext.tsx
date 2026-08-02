'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { signIn, signOut } from 'next-auth/react';
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

// Lazy-load the UPI modal — only needed when a user clicks "Buy"
const UPIPaymentModal = dynamic(() => import('../components/UPIPaymentModal'), { ssr: false });

interface SessionContextType {
  // Gated profile view flow
  pendingProfileId: string | null;
  setPendingProfileId: (val: string | null) => void;
  handleViewProfile: (profile: Profile) => void;

  // Session States
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
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
  handleLogout: () => void;
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
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [profileLoadError, setProfileLoadError] = useState('');

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [savedProfiles, setSavedProfiles] = useState<string[]>([]);
  const [selectedProfileForDetails, setSelectedProfileForDetails] = useState<Profile | null>(null);

  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [accountData, setAccountData] = useState<{ name?: string; email?: string; phone?: string; createdAt?: string | Date | null; providers?: string[] } | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
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

  // Detect a real NextAuth (Google) session on first mount
  const [userRole, setUserRole] = useState<string | null>(null);
  const isAdmin = userRole === 'ADMIN';

  useEffect(() => {
    if (isLoggedIn) return;
    async function detectRealSession() {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const session = await res.json();
          if (session?.user) {
            setIsLoggedIn(true);
            if (session.user.role) setUserRole(session.user.role);
          }
        }
      } catch {
        // no session — stay logged out
      } finally {
        setAuthChecked(true);
      }
    }

    detectRealSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Headers helper — plain JSON
  const getHeaders = useCallback(() => {
    return { 'Content-Type': 'application/json' } as Record<string, string>;
  }, []);

  // Fetch all data
  useEffect(() => {
    async function loadAllData() {
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
            // If profile exists but is incomplete, show the registration wizard
            if (data.profile.profileCompletionStatus !== 'COMPLETE') {
              setIsRegistering(true);
              setRegStep(1);
            } else {
              setIsRegistering(false);
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
        const resProfiles = await fetch('/api/profiles', { headers });
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

        // 3. Fetch user purchases (for package access checks on client side)
        if (isLoggedIn && userProfile) {
          try {
            const resPkg = await fetch('/api/user/purchases', { headers });
            if (resPkg.ok) {
              const pkgData = await resPkg.json();
              const pkgs: string[] = Array.isArray(pkgData.purchases)
                ? pkgData.purchases
                    .filter((p: any) => p.paymentStatus === 'PAID' && p.accessStatus === 'ACTIVE')
                    .map((p: any) => p.packageType)
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
    }

    loadAllData();
  }, [isLoggedIn, reloadTrigger, getHeaders, userProfile]);

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
    setSelectedProfileForDetails(profile);
  }, [isLoggedIn, userProfile, router]);

  const handleGoogleLogin = () => {
    signIn('google');
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
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
        headers: getHeaders(),
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
          router.push(`/packages?returnProfile=${pendingProfileId}`);
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

  const handleUPIPayment = async (packageType: string, amountInRupees = 300, planName = 'Standard Monthly Membership') => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
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

  const submitMasterAction = async (actionData: Record<string, unknown>) => {
    try {
      const res = await fetch('/api/admin/master-data', {
        method: 'POST',
        headers: getHeaders(),
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
    <SessionContext.Provider
      value={{
        pendingProfileId,
        setPendingProfileId,
        handleViewProfile,

        isLoggedIn,
        setIsLoggedIn,
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

        handleGoogleLogin,
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
        submitMasterAction,
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
