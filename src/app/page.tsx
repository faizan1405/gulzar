'use client';

import React, { useState, useEffect } from 'react';

// Controlled themes
const THEME_COLORS = [
  { name: 'Emerald Green', value: 'emerald' },
  { name: 'Royal Crimson', value: 'crimson' },
  { name: 'Gold Accent', value: 'gold' },
  { name: 'Ocean Navy', value: 'navy' },
  { name: 'Rose Petal', value: 'rose' },
  { name: 'Teal Whisper', value: 'teal' },
  { name: 'Plum Royalty', value: 'plum' },
  { name: 'Saffron Glow', value: 'saffron' }
];

interface Profile {
  id: string;
  userId: string;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  maritalStatus: string;
  phoneNumber: string;
  city: string;
  areaOrLocality: string;
  state: string;
  country: string;
  education: string;
  occupation: string;
  annualIncomeRange: string;
  familyInfo: string;
  bio: string;
  themeColor: string;
  verificationStatus: string;
  profileCompletionStatus: string;
  createdAt: string;
}

interface VerificationRequest {
  id: string;
  profileId: string;
  status: string;
  assignedAdminId: string | null;
  notes: string | null;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  profile: Profile | null;
}

interface AuditLog {
  id: string;
  actorUserId: string | null;
  action: string;
  targetType: string;
  targetId: string | null;
  metadata: string;
  createdAt: string;
}

export default function Home() {
  // --- Simulator & Session States ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasPaid300, setHasPaid300] = useState(false);
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [referralRate, setReferralRate] = useState(21);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // --- Profile List / Search Filters ---
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistance, setSelectedDistance] = useState('All');
  const [selectedCaste, setSelectedCaste] = useState('All');
  const [verificationFilter, setVerificationFilter] = useState('All');
  const [savedProfiles, setSavedProfiles] = useState<string[]>([]);
  const [selectedProfileForDetails, setSelectedProfileForDetails] = useState<Profile | null>(null);

  // --- Current User Profile Form & Registration State ---
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [regStep, setRegStep] = useState(1);
  const [registrationError, setRegistrationError] = useState('');

  // --- Admin Dashboard States ---
  const [adminRequests, setAdminRequests] = useState<VerificationRequest[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [adminActiveTab, setAdminActiveTab] = useState<'verification' | 'logs'>('verification');
  const [selectedRequestForReview, setSelectedRequestForReview] = useState<VerificationRequest | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  // --- Registration Form Fields ---
  const [formData, setFormData] = useState({
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
  });

  const getThemeClass = (color: string) => {
    if (!color) return 'theme-emerald';
    if (color.includes('hsl(')) {
      if (color.includes('150')) return 'theme-emerald';
      if (color.includes('345')) return 'theme-crimson';
      if (color.includes('42')) return 'theme-gold';
      return 'theme-navy';
    }
    return `theme-${color}`;
  };

  const getProfileImage = (gender: string, index: number) => {
    const maleImages = [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300&h=300',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300&h=300'
    ];
    const femaleImages = [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300',
      'https://images.unsplash.com/photo-1594744803329-e58b31de215f?auto=format&fit=crop&q=80&w=300&h=300',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=300'
    ];

    if (gender.toLowerCase() === 'male') {
      return maleImages[index % maleImages.length];
    }
    return femaleImages[index % femaleImages.length];
  };

  const toggleSaveProfile = (id: string) => {
    setSavedProfiles((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  // Simulator helper headers
  const getSimulatorHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'x-simulator-user-id': 'simulated-user-123',
      'x-simulator-logged-in': isLoggedIn ? 'true' : 'false',
      'x-simulator-paid': hasPaid300 ? 'true' : 'false',
      'x-simulator-admin': 'true', // Allow admin actions in simulator mode
      'x-simulator-admin-id': 'simulated-admin-999',
    };
  };

  // --- Fetch Data on State Changes ---
  useEffect(() => {
    async function loadAllData() {
      setIsLoading(true);
      try {
        const simulatorHeaders = {
          'Content-Type': 'application/json',
          'x-simulator-user-id': 'simulated-user-123',
          'x-simulator-logged-in': isLoggedIn ? 'true' : 'false',
          'x-simulator-paid': hasPaid300 ? 'true' : 'false',
          'x-simulator-admin': 'true',
          'x-simulator-admin-id': 'simulated-admin-999',
        };

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

        // 2. Fetch admin verification requests & logs
        const resReq = await fetch('/api/admin/verification', { headers: simulatorHeaders });
        const dataReq = await resReq.json();
        if (dataReq.requests) {
          setAdminRequests(dataReq.requests);
          // Extract profiles for general display
          const mappedProfiles = dataReq.requests.map((r: VerificationRequest) => r.profile).filter(Boolean) as Profile[];
          setProfiles(mappedProfiles);
        }

        const resLogs = await fetch('/api/admin/verification?mode=audit', { headers: simulatorHeaders });
        const dataLogs = await resLogs.json();
        if (dataLogs.logs) {
          setAuditLogs(dataLogs.logs);
        }
      } catch (err) {
        console.error('Failed fetching DB state', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadAllData();
  }, [isLoggedIn, hasPaid300, reloadTrigger]);

  // --- Google Login Simulation ---
  const handleGoogleLogin = () => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  // --- Registration / Profile Submission ---
  const handleNextStep = () => {
    if (regStep === 1) {
      if (!formData.fullName || !formData.dateOfBirth || !formData.phoneNumber || !formData.bio) {
        setRegistrationError('Please fill in all personal details.');
        return;
      }
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
      if (age < 18) {
        setRegistrationError('Registration is restricted to eligible adults (18 years and older).');
        return;
      }
    } else if (regStep === 2) {
      if (!formData.city || !formData.areaOrLocality || !formData.state) {
        setRegistrationError('Please fill in your complete location.');
        return;
      }
    } else if (regStep === 3) {
      if (!formData.education || !formData.occupation) {
        setRegistrationError('Please provide your education and occupation info.');
        return;
      }
    } else if (regStep === 4) {
      if (!formData.familyInfo) {
        setRegistrationError('Please enter family background details.');
        return;
      }
    }
    setRegistrationError('');
    setRegStep(regStep + 1);
  };

  const handlePrevStep = () => {
    setRegistrationError('');
    setRegStep(regStep - 1);
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

  // --- Razorpay Payment Checkout ---
  const handleRazorpayCheckout = async (amountInRupees = 300, planName = 'Standard Monthly Membership') => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    try {
      const res = await fetch('/api/payment/order', {
        method: 'POST',
        headers: getSimulatorHeaders(),
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
        name: 'MOM Matrimonial',
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
              if (amountInRupees === 300) {
                setHasPaid300(true);
              } else {
                setHasPremiumAccess(true);
              }
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
          color: '#876b2d',
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

  // --- Admin Actions ---
  const handleReviewSubmit = async (status: 'APPROVED' | 'REJECTED' | 'NEEDS_FOLLOW_UP') => {
    if (!selectedRequestForReview || !selectedRequestForReview.profile) return;
    try {
      const res = await fetch('/api/admin/verification', {
        method: 'POST',
        headers: getSimulatorHeaders(),
        body: JSON.stringify({
          profileId: selectedRequestForReview.profile.id,
          status,
          notes: reviewNotes,
        }),
      });

      if (res.ok) {
        alert(`Status updated to ${status}! Audit log entry created.`);
        setSelectedRequestForReview(null);
        setReviewNotes('');
        setReloadTrigger((prev) => prev + 1);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to update verification status.');
      }
    } catch {
      alert('Error updating status.');
    }
  };

  // Filter local profile display
  const filteredProfiles = profiles.filter((p) => {
    if (selectedDistance !== 'All') {
      if (selectedDistance === '50' && p.city !== 'Mumbai') return false;
      if (selectedDistance === '100' && p.city === 'Delhi') return false;
    }
    if (selectedCaste !== 'All') {
      const community = p.bio.toLowerCase() + p.familyInfo.toLowerCase();
      if (!community.includes(selectedCaste.toLowerCase())) return false;
    }
    if (verificationFilter === 'Verified' && p.verificationStatus !== 'APPROVED') return false;
    if (verificationFilter === 'Unverified' && p.verificationStatus === 'APPROVED') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.fullName.toLowerCase().includes(q) ||
        p.occupation.toLowerCase().includes(q) ||
        p.education.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <>
      {/* Demo Simulator Quick Bar */}
      <div className="demo-bar">
        <span className="demo-bar-label">🔒 DEMO MODE — For Internal Preview Only</span>
        <div className="demo-bar-controls">
          <label className="demo-bar-checkbox">
            <input
              type="checkbox"
              checked={isLoggedIn}
              onChange={(e) => {
                setIsLoggedIn(e.target.checked);
                if (!e.target.checked) {
                  setHasPaid300(false);
                  setHasPremiumAccess(false);
                }
              }}
              id="sim-logged-in-checkbox"
            />
            Logged In
          </label>
          <label className="demo-bar-checkbox">
            <input
              type="checkbox"
              checked={hasPaid300}
              onChange={(e) => setHasPaid300(e.target.checked)}
              id="sim-paid-300-checkbox"
            />
            Paid (₹300 Membership)
          </label>
          <label className="demo-bar-checkbox">
            <input
              type="checkbox"
              checked={hasPremiumAccess}
              onChange={(e) => setHasPremiumAccess(e.target.checked)}
              id="sim-premium-checkbox"
            />
            Premium Package Access
          </label>
          <label className="demo-bar-checkbox">
            <input
              type="checkbox"
              checked={isAdminMode}
              onChange={(e) => setIsAdminMode(e.target.checked)}
              id="sim-admin-checkbox"
            />
            Admin Preview Mode
          </label>
        </div>
      </div>

      {/* Header */}
      <header className="header">
        <div className="container nav-container">
          <a
            href="#"
            className="logo"
            id="header-logo-link"
            onClick={() => {
              setIsAdminMode(false);
              setIsRegistering(false);
            }}
          >
            MOM<span>.</span>
          </a>

          {/* Hamburger Menu Trigger */}
          <button
            className="modal-close-btn"
            style={{ display: 'none', border: 'none', background: 'none', cursor: 'pointer' }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            id="hamburger-btn"
          >
            ☰
          </button>
          <style>{`
            @media (max-width: 768px) {
              #hamburger-btn { display: block !important; }
              .nav-menu-desktop { display: none !important; }
            }
          `}</style>

          <nav className="nav-menu-desktop">
            <ul className="nav-menu">
              <li>
                <a
                  href="#"
                  className="nav-link"
                  onClick={() => {
                    setIsAdminMode(false);
                    setIsRegistering(false);
                  }}
                  id="nav-link-home"
                >
                  Home
                </a>
              </li>
              <li>
                <a href="#browse-profiles" className="nav-link" id="nav-link-browse" onClick={() => setIsAdminMode(false)}>
                  Browse Profiles
                </a>
              </li>
              <li>
                <a href="#premium-pricing" className="nav-link" id="nav-link-pricing" onClick={() => setIsAdminMode(false)}>
                  Pricing & Packages
                </a>
              </li>
              <li>
                <a href="#wedding-services" className="nav-link" id="nav-link-services" onClick={() => setIsAdminMode(false)}>
                  Wedding Services
                </a>
              </li>
              <li>
                {isLoggedIn && (
                  <button
                    onClick={() => {
                      setIsAdminMode(false);
                      setIsRegistering(true);
                      setRegStep(1);
                    }}
                    className="btn btn-secondary"
                  >
                    Edit Profile
                  </button>
                )}
              </li>
              <li>
                <button
                  onClick={() => setIsAdminMode(!isAdminMode)}
                  className="btn btn-secondary"
                  id="btn-toggle-admin"
                >
                  {isAdminMode ? 'View Website' : 'Admin Panel'}
                </button>
              </li>
              <li>
                {isLoggedIn ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary-brand)' }}>As-salamu alaykum</span>
                    <button
                      onClick={() => {
                        setIsLoggedIn(false);
                        setHasPaid300(false);
                        setHasPremiumAccess(false);
                      }}
                      className="btn btn-primary"
                      id="btn-logout"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className="btn btn-secondary"
                      id="btn-login-trigger"
                      style={{ padding: '8px 16px' }}
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setIsLoggedIn(true); // Simulate registration/onboard flow directly
                        setIsRegistering(true);
                        setRegStep(1);
                      }}
                      className="btn btn-gold"
                      style={{ padding: '8px 16px' }}
                    >
                      Register Free
                    </button>
                  </div>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
          style={{ justifyContent: 'flex-start', alignItems: 'stretch', padding: 0 }}
        >
          <div
            style={{
              backgroundColor: 'var(--cream-bg)',
              width: '280px',
              padding: '24px',
              boxShadow: 'var(--shadow-toast)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="logo">MOM<span>.</span></span>
              <button className="modal-close-btn" onClick={() => setIsMobileMenuOpen(false)}>×</button>
            </div>
            <hr style={{ borderColor: 'var(--border-color)' }} />
            <a
              href="#"
              onClick={() => {
                setIsAdminMode(false);
                setIsRegistering(false);
                setIsMobileMenuOpen(false);
              }}
              style={{ padding: '10px 0', fontWeight: '500' }}
            >
              Home
            </a>
            <a
              href="#browse-profiles"
              onClick={() => {
                setIsAdminMode(false);
                setIsMobileMenuOpen(false);
              }}
              style={{ padding: '10px 0', fontWeight: '500' }}
            >
              Browse Profiles
            </a>
            <a
              href="#premium-pricing"
              onClick={() => {
                setIsAdminMode(false);
                setIsMobileMenuOpen(false);
              }}
              style={{ padding: '10px 0', fontWeight: '500' }}
            >
              Pricing & Packages
            </a>
            <a
              href="#wedding-services"
              onClick={() => {
                setIsAdminMode(false);
                setIsMobileMenuOpen(false);
              }}
              style={{ padding: '10px 0', fontWeight: '500' }}
            >
              Wedding Services
            </a>

            {isLoggedIn && (
              <button
                onClick={() => {
                  setIsAdminMode(false);
                  setIsRegistering(true);
                  setRegStep(1);
                  setIsMobileMenuOpen(false);
                }}
                className="btn btn-secondary"
              >
                Edit Profile
              </button>
            )}

            <button
              onClick={() => {
                setIsAdminMode(!isAdminMode);
                setIsMobileMenuOpen(false);
              }}
              className="btn btn-secondary"
            >
              {isAdminMode ? 'View Website' : 'Admin Panel'}
            </button>

            {isLoggedIn ? (
              <button
                onClick={() => {
                  setIsLoggedIn(false);
                  setHasPaid300(false);
                  setHasPremiumAccess(false);
                  setIsMobileMenuOpen(false);
                }}
                className="btn btn-primary"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  setShowLoginModal(true);
                  setIsMobileMenuOpen(false);
                }}
                className="btn btn-gold"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}

      {isLoading && <div className="loading-spinner" />}

      {!isAdminMode ? (
        <main>
          {isRegistering ? (
            /* Multi-step registration form */
            <section style={{ padding: '60px 0' }} className="container">
              <div className="card-theme-wrapper reg-wizard-card">
                <div className="ornament ornament-tl"></div>
                <div className="ornament ornament-tr"></div>
                <div className="ornament ornament-bl"></div>
                <div className="ornament ornament-br"></div>

                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-dark)', marginBottom: '8px' }}>
                    {userProfile ? 'Update Matrimonial Profile' : 'Register Matrimonial Profile'}
                  </h2>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                    Step {regStep} of 5 — {regStep === 1 && 'Personal Information'}
                    {regStep === 2 && 'Location Details'}
                    {regStep === 3 && 'Professional Details'}
                    {regStep === 4 && 'Family Background'}
                    {regStep === 5 && 'Consent & Theme'}
                  </p>
                </div>

                {/* Progress Bar Dots */}
                <div className="step-indicator-bar">
                  <div className={`step-dot ${regStep >= 1 ? 'completed' : ''} ${regStep === 1 ? 'active' : ''}`}>1</div>
                  <div className={`step-dot ${regStep >= 2 ? 'completed' : ''} ${regStep === 2 ? 'active' : ''}`}>2</div>
                  <div className={`step-dot ${regStep >= 3 ? 'completed' : ''} ${regStep === 3 ? 'active' : ''}`}>3</div>
                  <div className={`step-dot ${regStep >= 4 ? 'completed' : ''} ${regStep === 4 ? 'active' : ''}`}>4</div>
                  <div className={`step-dot ${regStep >= 5 ? 'completed' : ''} ${regStep === 5 ? 'active' : ''}`}>5</div>
                </div>

                {registrationError && (
                  <div style={{ backgroundColor: 'rgba(230, 92, 92, 0.1)', color: 'var(--gold-dark)', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', border: '1px solid hsla(0, 50%, 50%, 0.2)' }}>
                    ⚠️ {registrationError}
                  </div>
                )}

                <form onSubmit={handleRegisterSubmit}>
                  {regStep === 1 && (
                    <div>
                      <div className="form-group">
                        <label className="form-label">Full Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="Enter legal full name"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Gender *</label>
                        <select
                          className="form-control"
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        >
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Date of Birth (Eligible adults &gt;= 18) *</label>
                        <input
                          type="date"
                          className="form-control"
                          value={formData.dateOfBirth}
                          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Marital Status *</label>
                        <select
                          className="form-control"
                          value={formData.maritalStatus}
                          onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                        >
                          <option value="Single">Single</option>
                          <option value="Divorced">Divorced</option>
                          <option value="Widowed">Widowed</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone Number (Call Verification Required) *</label>
                        <input
                          type="tel"
                          className="form-control"
                          value={formData.phoneNumber}
                          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                          placeholder="e.g. +91 9876543210"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">About Me (Bio) *</label>
                        <textarea
                          className="form-control"
                          rows={3}
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          placeholder="Describe your values, hobbies, and outlook on marriage..."
                          required
                        />
                      </div>
                    </div>
                  )}

                  {regStep === 2 && (
                    <div>
                      <div className="form-group">
                        <label className="form-label">City *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="e.g. Mumbai"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Area or Locality *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.areaOrLocality}
                          onChange={(e) => setFormData({ ...formData, areaOrLocality: e.target.value })}
                          placeholder="e.g. Bandra West"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">State *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          placeholder="e.g. Maharashtra"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Country *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          placeholder="e.g. India"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {regStep === 3 && (
                    <div>
                      <div className="form-group">
                        <label className="form-label">Education *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.education}
                          onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                          placeholder="e.g. MBBS, M.Tech, B.Com"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Occupation *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.occupation}
                          onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                          placeholder="e.g. Pediatrician, Software Engineer"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Annual Income Range *</label>
                        <select
                          className="form-control"
                          value={formData.annualIncomeRange}
                          onChange={(e) => setFormData({ ...formData, annualIncomeRange: e.target.value })}
                        >
                          <option value="Under ₹3 LPA">Under ₹3 LPA</option>
                          <option value="₹3 LPA - ₹5 LPA">₹3 LPA - ₹5 LPA</option>
                          <option value="₹5 LPA - ₹10 LPA">₹5 LPA - ₹10 LPA</option>
                          <option value="₹10 LPA - ₹15 LPA">₹10 LPA - ₹15 LPA</option>
                          <option value="₹15 LPA - ₹25 LPA">₹15 LPA - ₹25 LPA</option>
                          <option value="Above ₹25 LPA">Above ₹25 LPA</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {regStep === 4 && (
                    <div>
                      <div className="form-group">
                        <label className="form-label">Family Details (Parents, Siblings background) *</label>
                        <textarea
                          className="form-control"
                          rows={4}
                          value={formData.familyInfo}
                          onChange={(e) => setFormData({ ...formData, familyInfo: e.target.value })}
                          placeholder="Provide family background, parents occupation, number of siblings etc..."
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Partner Preferences Summary</label>
                        <textarea
                          className="form-control"
                          rows={3}
                          value={formData.partnerPref}
                          onChange={(e) => setFormData({ ...formData, partnerPref: e.target.value })}
                          placeholder="Preferred age, education, and religiosity..."
                        />
                      </div>
                    </div>
                  )}

                  {regStep === 5 && (
                    <div>
                      <div className="form-group">
                        <label className="form-label">Assigned Profile Theme *</label>
                        <select
                          className="form-control"
                          value={formData.themeColor}
                          onChange={(e) => setFormData({ ...formData, themeColor: e.target.value })}
                        >
                          {THEME_COLORS.map((tc) => (
                            <option key={tc.value} value={tc.value}>
                              {tc.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group" style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', margin: '20px 0' }}>
                        <input
                          type="checkbox"
                          style={{ marginTop: '4px' }}
                          checked={formData.consent}
                          onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                          required
                        />
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                          I consent to manual phone verification call from MOM Admin team to confirm these profile details.
                        </span>
                      </div>

                      <div className="form-group" style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', margin: '20px 0' }}>
                        <input
                          type="checkbox"
                          style={{ marginTop: '4px' }}
                          checked={formData.terms}
                          onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                          required
                        />
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                          I accept the MOM Matrimonial Terms of Service and Shariah-compliant match guidelines.
                        </span>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                    {regStep > 1 && (
                      <button type="button" onClick={handlePrevStep} className="btn btn-secondary">
                        Back
                      </button>
                    )}
                    {regStep < 5 ? (
                      <button type="button" onClick={handleNextStep} className="btn btn-primary" style={{ marginLeft: 'auto' }}>
                        Next Step
                      </button>
                    ) : (
                      <button type="submit" className="btn btn-gold" style={{ marginLeft: 'auto' }}>
                        Save Profile
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </section>
          ) : (
            /* Main Landing Page */
            <>
              {/* Premium Hero Section */}
              <section className="hero-split container">
                <div className="hero-content">
                  <div className="hero-subtitle">Halal & Secure Matrimony</div>
                  <h1 className="hero-title">Where meaningful matches begin.</h1>
                  <p className="hero-description">
                    Built for serious Nikah journeys, trusted by families. Welcome to MOM — a premium, Shariah-compliant Muslim matchmaking platform offering verified candidates, absolute privacy, and dedicated marriage-focused match assistance.
                  </p>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <a href="#browse-profiles" className="btn btn-gold" id="hero-browse-btn">
                      Explore Matches
                    </a>
                    <button
                      onClick={() => {
                        if (!isLoggedIn) {
                          setShowLoginModal(true);
                        } else {
                          setIsRegistering(true);
                          setRegStep(1);
                        }
                      }}
                      className="btn btn-primary"
                      id="hero-register-btn"
                    >
                      {userProfile ? 'Edit Your Profile' : 'Create Your Profile'}
                    </button>
                  </div>
                  
                  {/* Trust statistics strip */}
                  <div className="trust-strip">
                    <div className="stat-item">
                      <span className="stat-number">100%</span>
                      <span className="stat-label">Call Verified</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">Secure</span>
                      <span className="stat-label">Privacy First</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">Family</span>
                      <span className="stat-label">Focused Nikah</span>
                    </div>
                  </div>
                </div>

                <div className="hero-visual-container">
                  <div className="hero-visual-frame">
                    {/* Tasteful premium placeholder image representing matrimony trust */}
                    <img 
                      src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600&h=800" 
                      alt="Elegant Muslim Wedding Scene" 
                      className="hero-visual-img"
                    />
                  </div>
                  
                  {/* Floating preview cards with verification badges */}
                  <div className="floating-preview-card floating-card-1">
                    <span style={{ fontSize: '20px' }}>🟢</span>
                    <div>
                      <strong style={{ display: 'block', fontSize: '13px', color: 'var(--text-dark)' }}>Verified Match</strong>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Mumbai • Doctor</span>
                    </div>
                  </div>

                  <div className="floating-preview-card floating-card-2">
                    <span style={{ fontSize: '20px' }}>✨</span>
                    <div>
                      <strong style={{ display: 'block', fontSize: '13px', color: 'var(--text-dark)' }}>Active Search</strong>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Delhi • Engineer</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Smart Search Panel */}
              <div className="container" style={{ position: 'relative', zIndex: '20' }}>
                <div className="search-panel">
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--primary-brand)', marginBottom: '16px' }}>
                    Quick Match Search
                  </h3>
                  <div className="search-panel-grid">
                    <div>
                      <label className="form-label">Looking For</label>
                      <select className="form-control" style={{ backgroundColor: 'var(--cream-bg)' }}>
                        <option>Bride (Female)</option>
                        <option>Groom (Male)</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Age Range</label>
                      <select className="form-control" style={{ backgroundColor: 'var(--cream-bg)' }}>
                        <option>18 - 25 Yrs</option>
                        <option>26 - 32 Yrs</option>
                        <option>33 - 40 Yrs</option>
                        <option>40+ Yrs</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">City</label>
                      <select className="form-control" style={{ backgroundColor: 'var(--cream-bg)' }} value={selectedDistance} onChange={(e) => setSelectedDistance(e.target.value)}>
                        <option value="All">All India</option>
                        <option value="50">Mumbai Only</option>
                        <option value="100">Excluding Delhi</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Caste / Community</label>
                      <select className="form-control" style={{ backgroundColor: 'var(--cream-bg)' }} value={selectedCaste} onChange={(e) => setSelectedCaste(e.target.value)}>
                        <option value="All">All Communities</option>
                        <option value="Sunni">Sunni</option>
                        <option value="Syed">Syed</option>
                        <option value="Hanafi">Hanafi</option>
                        <option value="Sheikh">Sheikh</option>
                      </select>
                    </div>
                    <a href="#browse-profiles" className="btn btn-primary" style={{ width: '100%' }}>
                      Search
                    </a>
                  </div>
                </div>
              </div>

              {/* How It Works Section with Connected Timeline */}
              <section style={{ backgroundColor: 'var(--cream-card)', borderBottom: '1px solid var(--border-color)' }}>
                <div className="container">
                  <div className="section-header">
                    <h2>How MOM Works</h2>
                    <p>Designed for pure, respectful, and Shariah-compliant introductions</p>
                  </div>
                  
                  <div className="timeline-container">
                    <div className="timeline-line"></div>
                    <div className="timeline-grid">
                      <div className="timeline-step">
                        <div className="timeline-number">1</div>
                        <h3>Create Your Biodata</h3>
                        <p>Fill in details about yourself, education, career, family details, and choose your custom card accent theme.</p>
                      </div>
                      
                      <div className="timeline-step">
                        <div className="timeline-number">2</div>
                        <h3>Verification Call</h3>
                        <p>Our dedicated admin desk schedules a telephone call check to verify user information and maintain quality standards.</p>
                      </div>
                      
                      <div className="timeline-step">
                        <div className="timeline-number">3</div>
                        <h3>Connect Securely</h3>
                        <p>Approved candidates can unlock photos, access direct contact details, and start family-focused introductions.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* User Dashboard Summary (If Logged In) */}
              {isLoggedIn && (
                <section style={{ padding: '60px 0', backgroundColor: 'var(--cream-bg)', borderBottom: '1px solid var(--border-color)' }}>
                  <div className="container">
                    <div className="card-theme-wrapper" style={{ maxWidth: '960px', margin: '0 auto' }}>
                      <div className="ornament ornament-tl"></div>
                      <div className="ornament ornament-tr"></div>
                      <div className="ornament ornament-bl"></div>
                      <div className="ornament ornament-br"></div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                        <div>
                          <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary-brand)', fontSize: '24px', marginBottom: '8px' }}>
                            Assalamu Alaykum, {userProfile?.fullName || 'Valued Candidate'}!
                          </h3>
                          <p style={{ fontSize: '15px', color: 'var(--text-muted)' }}>
                            Welcome to your personalized matrimonial dashboard. Manage details, verification call, and active matches.
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <button
                            onClick={() => {
                              setIsRegistering(true);
                              setRegStep(1);
                            }}
                            className="btn btn-secondary"
                          >
                            Edit Profile Card
                          </button>
                        </div>
                      </div>

                      <div className="grid-3" style={{ marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                        <div style={{ backgroundColor: 'var(--white)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                          <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.5px' }}>Verification Status</span>
                          <div style={{ fontSize: '18px', fontWeight: 'bold', color: userProfile?.verificationStatus === 'APPROVED' ? 'green' : 'orange', marginTop: '6px' }}>
                            {userProfile?.verificationStatus || 'PENDING'}
                          </div>
                        </div>
                        <div style={{ backgroundColor: 'var(--white)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                          <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.5px' }}>Membership Status</span>
                          <div style={{ fontSize: '18px', fontWeight: 'bold', color: hasPaid300 ? 'green' : 'orange', marginTop: '6px' }}>
                            {hasPaid300 ? 'Standard Active' : 'Unpaid Preview'}
                          </div>
                        </div>
                        <div style={{ backgroundColor: 'var(--white)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                          <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.5px' }}>Saved Matches</span>
                          <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--primary-brand)', marginTop: '6px' }}>
                            {savedProfiles.length} Saved Profiles
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Profiles Section */}
              <section id="browse-profiles" style={{ backgroundColor: 'var(--cream-bg)' }}>
                <div className="container">
                  <div className="section-header">
                    <h2>Browse Matrimonial Candidates</h2>
                    <p>Connect with compatible, call-verified profiles</p>
                  </div>

                  {/* Filter Tabs */}
                  <div className="tabs-container">
                    <button className="tab-btn active">Recommended</button>
                    <button className="tab-btn" onClick={() => setVerificationFilter('Verified')}>Verified Profiles</button>
                    <button className="tab-btn" onClick={() => setSelectedDistance('50')}>Nearby Matches</button>
                    <button className="tab-btn" onClick={() => {
                      setSearchQuery('');
                      setSelectedDistance('All');
                      setSelectedCaste('All');
                      setVerificationFilter('All');
                    }}>Reset Filters</button>
                  </div>

                  {/* Search and Filters wrapper */}
                  <div style={{
                    backgroundColor: 'var(--white)',
                    padding: '28px',
                    borderRadius: 'var(--border-radius-lg)',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow-premium)',
                    marginBottom: '48px'
                  }}>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                      <div style={{ flexGrow: 1, minWidth: '280px' }}>
                        <label className="form-label">Search Keyword</label>
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search by occupation, education, city..."
                          className="form-control"
                        />
                      </div>

                      <div>
                        <label className="form-label">Distance Radius</label>
                        <select
                          value={selectedDistance}
                          onChange={(e) => setSelectedDistance(e.target.value)}
                          className="form-control"
                          style={{ minWidth: '180px' }}
                          id="filter-distance"
                        >
                          <option value="All">All India</option>
                          <option value="50">Within 50 km</option>
                          <option value="100">Within 100 km</option>
                        </select>
                      </div>

                      <div>
                        <label className="form-label">Caste / Community</label>
                        <select
                          value={selectedCaste}
                          onChange={(e) => setSelectedCaste(e.target.value)}
                          className="form-control"
                          style={{ minWidth: '180px' }}
                          id="filter-caste"
                        >
                          <option value="All">All Castes</option>
                          <option value="Sunni">Sunni</option>
                          <option value="Syed">Syed</option>
                          <option value="Hanafi">Hanafi</option>
                          <option value="Sheikh">Sheikh</option>
                        </select>
                      </div>

                      <div>
                        <label className="form-label">Verification</label>
                        <select
                          value={verificationFilter}
                          onChange={(e) => setVerificationFilter(e.target.value)}
                          className="form-control"
                          style={{ minWidth: '180px' }}
                          id="filter-verification"
                        >
                          <option value="All">All Profiles</option>
                          <option value="Verified">Call Verified Only</option>
                          <option value="Unverified">Pending Review Only</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Empty State */}
                  {filteredProfiles.length === 0 && (
                    <div className="empty-state card-theme-wrapper" style={{ maxWidth: '600px', margin: '0 auto' }}>
                      <div className="empty-state-icon">❀</div>
                      <h3>No Matches Found</h3>
                      <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
                        Try clearing keywords or adjusting filter parameters.
                      </p>
                    </div>
                  )}

                  {/* Profiles Grid */}
                  <div className="grid-3">
                    {filteredProfiles.map((profile, index) => {
                      const shouldBlur = !isLoggedIn || !hasPaid300;
                      const themeClass = getThemeClass(profile.themeColor);

                      return (
                        <article
                          key={profile.id}
                          className={`profile-card ${themeClass} theme-accent-border`}
                          style={{
                            '--profile-theme-color': `var(--theme-accent)`
                          } as React.CSSProperties}
                        >
                          <div className="profile-card-badge-container">
                            {profile.verificationStatus === 'APPROVED' && (
                              <span className="card-badge card-badge-verified">✓ Call Verified</span>
                            )}
                            <span className="card-badge card-badge-distance">
                              📍 Mumbai • {index === 0 ? '1.8' : index === 1 ? '5.4' : '12.0'} km away
                            </span>
                          </div>

                          <button
                            onClick={() => toggleSaveProfile(profile.id)}
                            className="card-save-btn"
                          >
                            {savedProfiles.includes(profile.id) ? '❤️' : '🤍'}
                          </button>

                          <div className="profile-image-wrapper">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={getProfileImage(profile.gender, index)}
                              alt={profile.fullName}
                              className={`profile-img ${shouldBlur ? 'blurred-media' : ''}`}
                            />

                            {shouldBlur && (
                              <div className="blur-blocker">
                                <div className="blur-blocker-title">🔓 Candidate Protected</div>
                                <p>
                                  {!isLoggedIn
                                    ? 'Log in using your secure account to view photos and contact'
                                    : 'Activate standard membership to view photos and contact'}
                                </p>
                                {!isLoggedIn ? (
                                  <button
                                    onClick={() => setShowLoginModal(true)}
                                    className="btn btn-gold"
                                    style={{ padding: '8px 20px', fontSize: '13px' }}
                                  >
                                    Log In
                                  </button>
                                ) : (
                                  <a
                                    href="#premium-pricing"
                                    className="btn btn-gold"
                                    style={{ padding: '8px 20px', fontSize: '13px' }}
                                  >
                                    Unlock Standard (₹300)
                                  </a>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="profile-card-details">
                            <h3 className="profile-card-name">
                              {shouldBlur ? 'Profile Details Blurred' : profile.fullName}
                            </h3>
                            <div className="profile-card-subtitle">
                              Muslim Matrimonial Candidate
                            </div>

                            <div className="profile-specs-grid">
                              <div className="spec-cell">
                                <span>Gender / Age</span>
                                <strong>{profile.gender} • {2026 - new Date(profile.dateOfBirth).getFullYear()} Yrs</strong>
                              </div>
                              <div className="spec-cell">
                                <span>Marital Status</span>
                                <strong>{profile.maritalStatus}</strong>
                              </div>
                              <div className="spec-cell">
                                <span>Location</span>
                                <strong>{profile.city}, {profile.state}</strong>
                              </div>
                              <div className="spec-cell">
                                <span>Profession</span>
                                <strong>{shouldBlur ? 'Hidden' : profile.occupation}</strong>
                              </div>
                              <div className="spec-cell" style={{ gridColumn: 'span 2' }}>
                                <span>Education</span>
                                <strong>{shouldBlur ? 'Hidden' : profile.education}</strong>
                              </div>
                            </div>

                            <div className="profile-card-footer">
                              <span style={{ fontSize: '13.5px', color: 'var(--text-muted)', fontWeight: '600' }}>
                                📞 {shouldBlur ? '+91-XXXXX-XXXXX' : profile.phoneNumber}
                              </span>
                              <button
                                onClick={() => setSelectedProfileForDetails(profile)}
                                className="btn btn-secondary"
                                style={{ padding: '8px 18px', fontSize: '13px' }}
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* Pricing & Premium Packages */}
              <section id="premium-pricing" style={{ backgroundColor: 'var(--cream-card)', borderBottom: '1px solid var(--border-color)' }}>
                <div className="container">
                  <div className="section-header">
                    <h2>Pricing & Tailored Packages</h2>
                    <p>Transparent pricing with dynamic 18% GST calculation</p>
                  </div>

                  <div className="grid-4">
                    {/* Standard Card */}
                    <div className="pkg-card pkg-card-popular">
                      <div className="pkg-badge">Popular</div>
                      <h3 className="pkg-title">Standard Monthly</h3>
                      <div className="pkg-price">
                        ₹300
                        <span>+ 18% GST (₹54) = ₹354/mo</span>
                      </div>
                      <ul className="pkg-features">
                        <li>View unblurred profile photos</li>
                        <li>Expose call-verified phone numbers</li>
                        <li>Search and filter matches</li>
                        <li>Direct candidate contacts</li>
                      </ul>
                      <button
                        onClick={() => handleRazorpayCheckout(300, 'Standard Monthly Membership')}
                        className="btn btn-gold"
                        style={{ marginTop: 'auto', width: '100%' }}
                        disabled={hasPaid300}
                      >
                        {hasPaid300 ? 'Active Subscription' : 'Activate Plan'}
                      </button>
                    </div>

                    {/* Curated Profiles */}
                    <div className="pkg-card">
                      <h3 className="pkg-title">Curated Matches</h3>
                      <div className="pkg-price">
                        ₹5,500
                        <span>+ 18% GST (₹990) = ₹6,490 one-time</span>
                      </div>
                      <ul className="pkg-features">
                        <li>Custom personal matchmaking</li>
                        <li>Leads provided until marriage</li>
                        <li>Separate dashboard support</li>
                        <li>Success Fee: ₹21,000</li>
                      </ul>
                      <button
                        onClick={() => handleRazorpayCheckout(5500, 'Curated Matches Package')}
                        className="btn btn-primary"
                        style={{ marginTop: 'auto', width: '100%' }}
                      >
                        Select Package
                      </button>
                    </div>

                    {/* Second Marriage */}
                    <div className="pkg-card">
                      <h3 className="pkg-title">Second-Marriage</h3>
                      <div className="pkg-price">
                        ₹11,000
                        <span>+ 18% GST (₹1,980) = ₹12,980 one-time</span>
                      </div>
                      <ul className="pkg-features">
                        <li>Private segregated directory</li>
                        <li>Specially customized match leads</li>
                        <li>1-on-1 advisor calls</li>
                        <li>No Success Fee</li>
                      </ul>
                      <button
                        onClick={() => handleRazorpayCheckout(11000, 'Second-Marriage Package')}
                        className="btn btn-primary"
                        style={{ marginTop: 'auto', width: '100%' }}
                      >
                        Select Package
                      </button>
                    </div>

                    {/* High-Profile Matches */}
                    <div className="pkg-card">
                      <h3 className="pkg-title">High-Profile</h3>
                      <div className="pkg-price">
                        ₹21,000
                        <span>+ 18% GST (₹3,780) = ₹24,780 one-time</span>
                      </div>
                      <ul className="pkg-features">
                        <li>For Doctors, Masters & Ultra-affluent</li>
                        <li>Exclusive private group</li>
                        <li>Dedicated personal matchmaker</li>
                        <li>Success Fee: ₹25,000</li>
                      </ul>
                      <button
                        onClick={() => handleRazorpayCheckout(21000, 'High-Profile Matches Package')}
                        className="btn btn-primary"
                        style={{ marginTop: 'auto', width: '100%' }}
                      >
                        Select Package
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Safety & Verification Section */}
              <section style={{ backgroundColor: 'var(--cream-bg)', borderBottom: '1px solid var(--border-color)' }}>
                <div className="container">
                  <div className="section-header">
                    <h2>Trust & Family Safety</h2>
                    <p>Designed from the ground up to protect members and their families</p>
                  </div>
                  
                  <div className="safety-wrapper">
                    <div>
                      {/* Premium editorial visual representation of safety */}
                      <img 
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=500&h=400" 
                        alt="Matrimonial Security Verification Process" 
                        style={{ width: '100%', height: 'auto', borderRadius: 'var(--border-radius-lg)', boxShadow: 'var(--shadow-premium)' }}
                      />
                    </div>
                    
                    <ul className="safety-list">
                      <li className="safety-item">
                        <div className="safety-icon">✓</div>
                        <div className="safety-text">
                          <h4>Manual Telephone Verification</h4>
                          <p>Every profile undergoes manual checks and validation by our dedicated admin queue before going public.</p>
                        </div>
                      </li>

                      <li className="safety-item">
                        <div className="safety-icon">✓</div>
                        <div className="safety-text">
                          <h4>Photo & Number Blur Protection</h4>
                          <p>Keep your contact details and photos hidden from unauthenticated visitors and standard unpaid members.</p>
                        </div>
                      </li>

                      <li className="safety-item">
                        <div className="safety-icon">✓</div>
                        <div className="safety-text">
                          <h4>Shariah-Compliant Process</h4>
                          <p>Matchmaking structured for serious life partners with high integrity, family consent, and zero dating app swipe systems.</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Referral Section */}
              <section style={{ backgroundColor: 'var(--cream-card)', borderBottom: '1px solid var(--border-color)' }}>
                <div className="container">
                  <div className="section-header">
                    <h2>MOM Referral Program</h2>
                    <p>Earn commissions by helping others find their matches</p>
                  </div>
                  <div className="grid-3" style={{ marginTop: '30px' }}>
                    <div className="card-theme-wrapper" style={{ gridColumn: 'span 2' }}>
                      <div className="ornament ornament-tl"></div>
                      <div className="ornament ornament-tr"></div>
                      <div className="ornament ornament-bl"></div>
                      <div className="ornament ornament-br"></div>
                      <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-dark)', marginBottom: '12px' }}>
                        Invite Friends & Family
                      </h3>
                      <p style={{ color: 'var(--text-dark)', fontSize: '14.5px', marginBottom: '20px' }}>
                        Invite eligible candidates to register on MOM Matrimonial. Whenever your referred candidate unlocks standard membership, you earn a <strong>{referralRate}%</strong> referral commission directly.
                      </p>
                      {isLoggedIn ? (
                        <div style={{ backgroundColor: 'var(--white)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 'bold' }}>YOUR REFERRAL LINK:</span>
                          <code style={{ fontSize: '14px', color: 'var(--gold-dark)', fontWeight: 'bold' }}>
                            https://mom-matrimonial.com/join?ref=simulated_u123
                          </code>
                          <button
                            onClick={() => alert('Referral link copied to clipboard!')}
                            className="btn btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '11px' }}
                          >
                            Copy Link
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setShowLoginModal(true)} className="btn btn-gold">
                          Log In to Get Referral Link
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '30px', boxShadow: 'var(--shadow-premium)' }}>
                      <h4 style={{ color: 'var(--gold-dark)', marginBottom: '16px' }}>Commission Estimator</h4>
                      <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                        ₹{Math.floor(300 * (referralRate / 100))} <span style={{ fontSize: '14px', fontWeight: 'normal', color: 'var(--text-muted)' }}>per referral checkout</span>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '12px' }}>
                        Calculated at {referralRate}% of the base standard monthly membership fee (₹300).
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Testimonials Section */}
              <section style={{ backgroundColor: 'var(--cream-bg)', borderBottom: '1px solid var(--border-color)' }}>
                <div className="container">
                  <div className="section-header">
                    <h2>Blessed Success Stories</h2>
                    <p>Alhamdulillah! Read stories from our blessed couples</p>
                  </div>
                  <div className="grid-3" style={{ marginTop: '40px' }}>
                    <div className="testimonial-card">
                      <p className="testimonial-text">
                        &ldquo;MOM made the search simple and extremely respectful. The manual call verification gave my family peace of mind. We found our match within two months of joining!&rdquo;
                      </p>
                      <div className="testimonial-author">— Dr. Sarah & Brother Tariq (Mumbai)</div>
                    </div>
                    <div className="testimonial-card">
                      <p className="testimonial-text">
                        &ldquo;Alhamdulillah! I registered under the Curated Matchmaking program. The personalized matches were highly compatible and respected all family parameters. Highly recommended platform.&rdquo;
                      </p>
                      <div className="testimonial-author">— Sister Aisha & Brother Khalid (Delhi)</div>
                    </div>
                    <div className="testimonial-card">
                      <p className="testimonial-text">
                        &ldquo;The standard ₹300 plan was very affordable, and the photos were blurred, keeping my privacy fully intact. I felt safe throughout my onboarding and matchmaking journey.&rdquo;
                      </p>
                      <div className="testimonial-author">— Brother Adnan & Sister Yasmin (Bangalore)</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Wedding Services Section */}
              <section id="wedding-services" style={{ backgroundColor: 'var(--cream-card)' }}>
                <div className="container">
                  <div className="section-header">
                    <h2>Wedding Invitation Services</h2>
                    <p>Explore trusted local Islamic vendors for your big day</p>
                  </div>
                  <div className="grid-3" style={{ marginTop: '40px' }}>
                    <div style={{ backgroundColor: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px', boxShadow: 'var(--shadow-premium)' }}>
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>📸 Pure Frame Photography</div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', marginBottom: '12px' }}>Shariah-compliant separated wedding capture. Modern cinematic portfolios.</p>
                      <span className="card-badge card-badge-distance">Mumbai • Bandra</span>
                    </div>
                    <div style={{ backgroundColor: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px', boxShadow: 'var(--shadow-premium)' }}>
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>🍲 Al-Barkat Catering</div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', marginBottom: '12px' }}>Gourmet Mughal & Arabic cuisine. 100% halal preparation and management.</p>
                      <span className="card-badge card-badge-distance">Delhi • Karol Bagh</span>
                    </div>
                    <div style={{ backgroundColor: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px', boxShadow: 'var(--shadow-premium)' }}>
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>🕌 Royal Shahi Venues</div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', marginBottom: '12px' }}>Spacious elegant wedding halls with custom partition and divider facilities.</p>
                      <span className="card-badge card-badge-distance">Bangalore • Indiranagar</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Footer */}
              <footer className="footer">
                <div className="container">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '40px' }}>
                    <div>
                      <div className="footer-logo">MOM<span>.</span></div>
                      <p style={{ fontSize: '13.5px', color: 'rgba(247, 245, 240, 0.75)', lineHeight: '1.8' }}>
                        Trusted Halal Matrimony. Dedicated to helping single, divorced, and high-profile Muslim candidates find compatible marriage partners.
                      </p>
                    </div>
                    <div>
                      <h4 style={{ color: 'var(--gold-accent)', fontSize: '15px', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quick Links</h4>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px' }}>
                        <li><a href="#browse-profiles" style={{ opacity: 0.8 }}>Browse Candidates</a></li>
                        <li><a href="#premium-pricing" style={{ opacity: 0.8 }}>Pricing Packages</a></li>
                        <li><a href="#wedding-services" style={{ opacity: 0.8 }}>Wedding Vendors</a></li>
                      </ul>
                    </div>
                    <div>
                      <h4 style={{ color: 'var(--gold-accent)', fontSize: '15px', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Safety & Privacy</h4>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px' }}>
                        <li><span style={{ opacity: 0.8 }}>Manual Phone Verification</span></li>
                        <li><span style={{ opacity: 0.8 }}>Photo & Number Blur protection</span></li>
                        <li><span style={{ opacity: 0.8 }}>Shariah-Compliant guidelines</span></li>
                      </ul>
                    </div>
                  </div>
                  <div className="footer-bottom">
                    &copy; 2026 MOM Matrimonial Site. All Rights Reserved. Created for premium internal launch preview.
                  </div>
                </div>
              </footer>
            </>
          )}
        </main>
      ) : (
        /* ADMIN PANEL */
        <div className="admin-grid container">
          <aside className="admin-nav-list">
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-accent)', marginBottom: '20px', paddingLeft: '16px' }}>MOM Admin</h2>
            <div
              className={`admin-nav-link ${adminActiveTab === 'verification' ? 'active' : ''}`}
              onClick={() => setAdminActiveTab('verification')}
            >
              👤 Verification Queue
            </div>
            <div
              className={`admin-nav-link ${adminActiveTab === 'logs' ? 'active' : ''}`}
              onClick={() => setAdminActiveTab('logs')}
            >
              📜 Audit Logs
            </div>

            <div style={{ marginTop: '50px', borderTop: '1px solid rgba(212,163,89,0.3)', paddingTop: '20px', padding: '0 16px' }}>
              <h4 style={{ color: 'var(--gold-accent)', fontSize: '14px', marginBottom: '12px' }}>Referral Rate Control</h4>
              <input
                type="range"
                min="20"
                max="23"
                value={referralRate}
                onChange={(e) => setReferralRate(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--gold-accent)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '6px' }}>
                <span>Commission:</span>
                <strong>{referralRate}%</strong>
              </div>
            </div>
          </aside>

          <main className="admin-view-area">
            {adminActiveTab === 'verification' ? (
              <div>
                <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-dark)', marginBottom: '24px' }}>
                  Verification Call Queue
                </h1>

                {selectedRequestForReview && selectedRequestForReview.profile ? (
                  <div className="card-theme-wrapper" style={{ marginBottom: '30px' }}>
                    <div className="ornament ornament-tl"></div>
                    <div className="ornament ornament-tr"></div>
                    <div className="ornament ornament-bl"></div>
                    <div className="ornament ornament-br"></div>
                    <h3>Review Application: {selectedRequestForReview.profile.fullName}</h3>
                    <div style={{ margin: '15px 0', fontSize: '13.5px', border: '1px solid var(--border-color)', padding: '15px', borderRadius: '8px', backgroundColor: '#fff' }}>
                      <p style={{ marginBottom: '6px' }}><strong>Phone:</strong> {selectedRequestForReview.profile.phoneNumber}</p>
                      <p style={{ marginBottom: '6px' }}><strong>Location:</strong> {selectedRequestForReview.profile.city}, {selectedRequestForReview.profile.state}</p>
                      <p style={{ marginBottom: '6px' }}><strong>Bio:</strong> {selectedRequestForReview.profile.bio}</p>
                      <p><strong>Family:</strong> {selectedRequestForReview.profile.familyInfo}</p>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Phone call verification notes</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        placeholder="Write details from phone call verification here..."
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
                      <button onClick={() => handleReviewSubmit('APPROVED')} className="btn btn-gold">
                        Approve Candidate
                      </button>
                      <button onClick={() => handleReviewSubmit('REJECTED')} className="btn btn-primary">
                        Reject Profile
                      </button>
                      <button onClick={() => handleReviewSubmit('NEEDS_FOLLOW_UP')} className="btn btn-secondary">
                        Needs Follow Up
                      </button>
                      <button onClick={() => setSelectedRequestForReview(null)} className="btn btn-secondary" style={{ marginLeft: 'auto' }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}

                <div style={{ backgroundColor: 'var(--white)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-color)', height: '40px', fontSize: '13px', textTransform: 'uppercase', color: 'var(--gold-dark)' }}>
                        <th style={{ padding: '8px' }}>Candidate</th>
                        <th style={{ padding: '8px' }}>Phone</th>
                        <th style={{ padding: '8px' }}>Location</th>
                        <th style={{ padding: '8px' }}>Status</th>
                        <th style={{ padding: '8px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminRequests.map((req) => (
                        <tr key={req.id} style={{ borderBottom: '1px solid var(--border-color)', height: '60px', fontSize: '14px' }}>
                          <td style={{ padding: '8px' }}>
                            <strong>{req.profile?.fullName || 'Incomplete Profile'}</strong>
                          </td>
                          <td style={{ padding: '8px' }}>{req.profile?.phoneNumber || 'N/A'}</td>
                          <td style={{ padding: '8px' }}>{req.profile?.city || 'N/A'}</td>
                          <td style={{ padding: '8px' }}>
                            <span
                              style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: 'bold',
                                backgroundColor:
                                  req.status === 'APPROVED'
                                    ? 'rgba(18, 46, 34, 0.1)'
                                    : req.status === 'REJECTED'
                                    ? 'rgba(230, 92, 92, 0.1)'
                                    : 'rgba(240, 190, 50, 0.1)',
                                color:
                                  req.status === 'APPROVED'
                                    ? 'green'
                                    : req.status === 'REJECTED'
                                    ? 'red'
                                    : 'orange',
                              }}
                            >
                              {req.status}
                            </span>
                          </td>
                          <td style={{ padding: '8px' }}>
                            {req.profile && (
                              <button
                                onClick={() => {
                                  setSelectedRequestForReview(req);
                                  setReviewNotes(req.notes || '');
                                }}
                                className="btn btn-gold"
                                style={{ padding: '6px 12px', fontSize: '11px' }}
                              >
                                Review Call
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div>
                <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-dark)', marginBottom: '24px' }}>
                  Admin Verification Audit Logs
                </h1>

                <div style={{ backgroundColor: 'var(--white)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-color)', height: '40px', fontSize: '13px', textTransform: 'uppercase', color: 'var(--gold-dark)' }}>
                        <th style={{ padding: '8px' }}>Timestamp</th>
                        <th style={{ padding: '8px' }}>Action By</th>
                        <th style={{ padding: '8px' }}>Action</th>
                        <th style={{ padding: '8px' }}>Target ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.map((log) => (
                        <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)', height: '50px', fontSize: '13.5px' }}>
                          <td style={{ padding: '8px' }}>{new Date(log.createdAt).toLocaleString()}</td>
                          <td style={{ padding: '8px' }}>{log.actorUserId}</td>
                          <td style={{ padding: '8px' }}>{log.action}</td>
                          <td style={{ padding: '8px' }}>{log.targetId}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {/* Google Login Simulator Modal */}
      {showLoginModal && (
        <div className="modal-overlay">
          <div className="card-theme-wrapper" style={{ maxWidth: '400px', width: '90%', margin: '20px' }}>
            <div className="ornament ornament-tl"></div>
            <div className="ornament ornament-tr"></div>
            <div className="ornament ornament-bl"></div>
            <div className="ornament ornament-br"></div>

            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--gold-dark)', marginBottom: '12px' }}>
                Join MOM Matrimonial
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                Create a profile or log in securely using your Google account to get verified.
              </p>

              <button
                onClick={handleGoogleLogin}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  backgroundColor: '#ffffff',
                  color: '#444',
                  border: '1px solid #ddd',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                  alt="Google logo"
                  style={{ width: '20px', height: '20px' }}
                />
                Continue with Google
              </button>

              <button
                onClick={() => setShowLoginModal(false)}
                className="btn btn-secondary"
                style={{ width: '100%', marginTop: '12px' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Profile Details Modal */}
      {selectedProfileForDetails && (
        <div className="modal-overlay" onClick={() => setSelectedProfileForDetails(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Biodata Preview</span>
              <button className="modal-close-btn" onClick={() => setSelectedProfileForDetails(null)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getProfileImage(selectedProfileForDetails.gender, 0)}
                  alt={selectedProfileForDetails.fullName}
                  style={{
                    width: '120px',
                    height: '120px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1.5px solid var(--gold-accent)',
                    filter: (!isLoggedIn || !hasPaid300) ? 'blur(10px)' : 'none'
                  }}
                />
                <div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-dark)', fontSize: '20px' }}>
                    {(!isLoggedIn || !hasPaid300) ? 'Name Hidden' : selectedProfileForDetails.fullName}
                  </h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {selectedProfileForDetails.gender} • {2026 - new Date(selectedProfileForDetails.dateOfBirth).getFullYear()} years old
                  </p>
                  <span style={{ display: 'inline-block', marginTop: '10px' }} className="card-badge card-badge-verified">
                    {selectedProfileForDetails.verificationStatus} Verification
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13.5px' }}>
                <div style={{ gridColumn: 'span 2', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                  <strong>Personal Bio</strong>
                  <p style={{ color: 'var(--text-dark)', marginTop: '4px', lineHeight: '1.6' }}>{selectedProfileForDetails.bio}</p>
                </div>
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                  <strong>Education & Occupation</strong>
                  <p style={{ color: 'var(--text-dark)', marginTop: '4px' }}>
                    {(!isLoggedIn || !hasPaid300) ? 'Hidden' : `${selectedProfileForDetails.education} • ${selectedProfileForDetails.occupation}`}
                  </p>
                </div>
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                  <strong>Income Range</strong>
                  <p style={{ color: 'var(--text-dark)', marginTop: '4px' }}>{selectedProfileForDetails.annualIncomeRange}</p>
                </div>
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', gridColumn: 'span 2' }}>
                  <strong>Family Background</strong>
                  <p style={{ color: 'var(--text-dark)', marginTop: '4px', lineHeight: '1.6' }}>{selectedProfileForDetails.familyInfo}</p>
                </div>
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', gridColumn: 'span 2' }}>
                  <strong>Phone / Contact Information</strong>
                  <p style={{ color: 'var(--text-dark)', marginTop: '4px', fontWeight: 'bold' }}>
                    {(!isLoggedIn || !hasPaid300) ? '+91-XXXXX-XXXXX (Membership unlock required)' : selectedProfileForDetails.phoneNumber}
                  </p>
                </div>
              </div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--cream-card)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              {(!isLoggedIn || !hasPaid300) && (
                <a href="#premium-pricing" onClick={() => setSelectedProfileForDetails(null)} className="btn btn-gold" style={{ padding: '8px 16px', fontSize: '12px' }}>
                  Unlock Details
                </a>
              )}
              <button className="btn btn-secondary" onClick={() => setSelectedProfileForDetails(null)} style={{ padding: '8px 16px', fontSize: '12px' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
