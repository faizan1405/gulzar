'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

  // Actions
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


const SimulatorContext = createContext<SimulatorContextType | undefined>(undefined);

export const SimulatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();

  // --- States ---
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

  // Headers generator
  const getSimulatorHeaders = useCallback(() => {
    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
    if (!isDemoMode) {
      return { 'Content-Type': 'application/json' } as Record<string, string>;
    }
    
    return {
      'Content-Type': 'application/json',
      'x-simulator-user-id': 'simulated-user-123',
      'x-simulator-logged-in': isLoggedIn ? 'true' : 'false',
      'x-simulator-paid': hasPaid300 ? 'true' : 'false',
      'x-simulator-admin': 'true',
      'x-simulator-admin-id': 'simulated-admin-999',
      'x-simulator-packages': simulatedPackages.join(','),
      'x-simulator-high-profile-approved': simulatedHighProfileApproved ? 'true' : 'false',
    } as Record<string, string>;
  }, [isLoggedIn, hasPaid300, simulatedPackages, simulatedHighProfileApproved]);

  // Fetch all data
  useEffect(() => {
    async function loadAllData() {
      setIsLoading(true);
      try {
        const simulatorHeaders = getSimulatorHeaders();

        // 1. Fetch current user profile
        if (isLoggedIn) {
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

            setIsRegistering(false);
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
        alert('Matrimonial profile saved successfully! Entering manual verification queue.');
        setReloadTrigger((prev) => prev + 1);
        setIsRegistering(false);
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
        name: 'Shadi Mubarak',
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
              alert(`Alhamdulillah! Payment verified and your ${planName} is now active.`);
              setReloadTrigger((prev) => prev + 1);
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
