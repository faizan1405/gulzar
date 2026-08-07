'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useSession } from '../../context/SessionContext';
import Navbar from '../../components/Navbar';
import { SectionHeading, PremiumFooter } from '../../components/NikahComponents';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ROUTES } from '../../lib/routes';

export default function MyAccountPage() {
  const { isLoggedIn, authChecked, userProfile, hasPaid300, setIsRegistering, setRegStep, activePackages } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!authChecked) return;
    if (!isLoggedIn) {
      window.location.href = '/';
    }
  }, [isLoggedIn, authChecked]);

  const handleEditProfile = () => {
    router.push('/register');
  };

  if (!isLoggedIn) {
    return (
      <>
        <Navbar />
        <main className="flex-grow flex items-center justify-center min-h-[50vh]">
          <p>Loading...</p>
        </main>
      </>
    );
  }

  // User is logged in but has no profile yet — show onboarding prompt
  if (!userProfile) {
    return (
      <>
        <Navbar />
        <main className="flex-grow flex items-center justify-center min-h-[50vh]">
          <div style={{ textAlign: 'center', maxWidth: '500px', padding: '40px' }}>
            <h2 style={{ fontSize: '24px', color: 'var(--primary-dark)', marginBottom: '16px' }}>Welcome!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              You don&apos;t have a profile yet. Complete your registration to access your account dashboard.
            </p>
            <button
              onClick={() => router.push('/register')}
              className="btn btn-primary"
              style={{ padding: '12px 32px', fontSize: '16px' }}
            >
              Create Your Profile
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <div className="container font-sans" style={{ padding: '40px 0 80px 0' }}>
          <SectionHeading
            title="My Account"
            scriptText="Welcome"
            subtitle={`Salaam, ${userProfile.fullName}. Manage your profile and preferences.`}
          />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            marginTop: '40px'
          }}>
            {/* Profile Status Card */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: 'var(--shadow-card)',
              border: '1px solid var(--border-color)',
            }}>
              <h3 style={{ fontSize: '20px', color: 'var(--primary-dark)', marginBottom: '16px' }}>Profile Status</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Verification</span>
                  <span style={{ 
                    fontWeight: 600,
                    color: userProfile.verificationStatus === 'APPROVED' ? 'var(--primary-brand)' : 
                           userProfile.verificationStatus === 'REJECTED' ? 'red' : '#d97706'
                  }}>
                    {userProfile.verificationStatus}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Profile Completeness</span>
                  <span style={{ fontWeight: 600 }}>{userProfile.profileCompletionStatus}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Current Category</span>
                  <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                    {userProfile.category?.replace('_', ' ') || 'Normal'}
                  </span>
                </div>
              </div>
              <button 
                onClick={handleEditProfile}
                className="btn btn-secondary w-full" 
                style={{ marginTop: '24px' }}
              >
                Edit Profile Information
              </button>
            </div>

            {/* Profile Photo Card */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: 'var(--shadow-card)',
              border: '1px solid var(--border-color)',
            }}>
              <h3 style={{ fontSize: '20px', color: 'var(--primary-dark)', marginBottom: '16px' }}>Profile Photo</h3>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--cream-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  border: '2px dashed var(--border-color)'
                }}>
                  {userProfile.profileImageUrl ? (
                    <Image src={userProfile.profileImageUrl} alt="Profile" width={120} height={120} style={{ objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '32px', color: 'var(--text-muted)' }}>📷</span>
                  )}
                </div>
              </div>
            </div>

            {/* Membership & Subscription */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: 'var(--shadow-card)',
              border: '1px solid var(--border-color)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {hasPaid300 && (
                <div style={{
                  position: 'absolute',
                  top: 0, right: 0,
                  backgroundColor: 'var(--gold-accent)',
                  color: 'white',
                  padding: '4px 16px',
                  borderBottomLeftRadius: '12px',
                  fontWeight: 600,
                  fontSize: '12px'
                }}>PREMIUM</div>
              )}
              <h3 style={{ fontSize: '20px', color: 'var(--primary-dark)', marginBottom: '16px' }}>Membership</h3>
              
              <div style={{ marginBottom: '24px' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Active Subscription</p>
                <div style={{ fontSize: '18px', fontWeight: 600, color: hasPaid300 ? 'var(--primary-brand)' : 'var(--text-primary)' }}>
                  {hasPaid300 ? 'Standard Monthly Membership' : 'Free Basic Plan'}
                </div>
              </div>

              {activePackages.length > 0 && (
                <div style={{ marginBottom: '24px', backgroundColor: '#fdfbf7', padding: '16px', borderRadius: '8px', border: '1px solid var(--gold-accent)' }}>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 'bold' }}>Premium Packages</p>
                  <ul style={{ listStyleType: 'disc', paddingLeft: '20px', fontSize: '15px', color: 'var(--primary-dark)' }}>
                    {activePackages.map((pkg) => (
                      <li key={pkg} style={{ textTransform: 'capitalize' }}>
                        {pkg.replace(/_/g, ' ')}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {!hasPaid300 && (
                <div style={{ backgroundColor: 'var(--cream-bg)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    Unlock full profiles, photos, and direct contact numbers by upgrading to a premium membership.
                  </p>
                  <Link href="/packages" className="btn btn-gold w-full" style={{ textAlign: 'center', display: 'block' }}>
                    View Rishta Plans
                  </Link>
                </div>
              )}
              
              {hasPaid300 && (
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Your subscription is active. You can browse all standard verified profiles and view their contact details.
                </p>
              )}
            </div>

            {/* Quick Links */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: 'var(--shadow-card)',
              border: '1px solid var(--border-color)',
            }}>
              <h3 style={{ fontSize: '20px', color: 'var(--primary-dark)', marginBottom: '16px' }}>Quick Links</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link href="/search" className="btn btn-secondary" style={{ textAlign: 'center', backgroundColor: 'var(--cream-bg)', border: 'none' }}>
                  Browse New Profiles
                </Link>
                <Link href="/packages" className="btn btn-secondary" style={{ textAlign: 'center', backgroundColor: 'var(--cream-bg)', border: 'none' }}>
                  Upgrade Package
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <PremiumFooter onNavigate={(view) => router.push(`/${view === 'home' ? '' : view}`)} />
    </>
  );
}
