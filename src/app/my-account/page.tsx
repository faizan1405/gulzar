'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useApp } from '../../context/AppContext';
import Navbar from '../../components/Navbar';
import { SectionHeading, PremiumFooter, DecorativeArch } from '../../components/NikahComponents';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MyAccountPage() {
  const { isLoggedIn, userProfile, hasPaid300, activePackages, setIsRegistering, setRegStep } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, router]);

  const handleEditProfile = () => {
    setIsRegistering(true);
    setRegStep(1);
    router.push('/');
  };

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');
    setUploadSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        // Using simulator headers to mimic the active session in demo mode
        headers: process.env.NEXT_PUBLIC_DEMO_MODE === 'true' && userProfile ? {
          'x-simulator-user-id': userProfile.id
        } : {}
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setUploadSuccess(data.message || 'Photo uploaded successfully!');
      
      // Update local profile state
      if (userProfile) {
        (userProfile as any).profileImageUrl = data.url;
        (userProfile as any).profileImageStatus = 'PENDING';
      }
    } catch (err: any) {
      setUploadError(err.message || 'An error occurred during upload.');
    } finally {
      setUploading(false);
    }
  };

  if (!isLoggedIn || !userProfile) {
    return (
      <>
        <Navbar />
        <main className="flex-grow flex items-center justify-center min-h-[50vh]">
          <p>Loading...</p>
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
                    {(userProfile as any).category?.replace('_', ' ') || 'Normal'}
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

                <div style={{ textAlign: 'center', width: '100%' }}>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    {(userProfile as any).profileImageStatus === 'PENDING' ? 'Your photo is pending admin approval.' : 
                     (userProfile as any).profileImageStatus === 'REJECTED' ? 'Your previous photo was rejected.' : 
                     'Upload a clear, front-facing photo.'}
                  </p>
                  
                  <label className="btn btn-secondary" style={{ display: 'inline-block', cursor: 'pointer', opacity: uploading ? 0.7 : 1 }}>
                    {uploading ? 'Uploading...' : 'Choose Photo'}
                    <input 
                      type="file" 
                      accept="image/jpeg,image/png,image/webp" 
                      onChange={handlePhotoUpload} 
                      disabled={uploading}
                      style={{ display: 'none' }} 
                    />
                  </label>
                  
                  {uploadError && <p style={{ color: 'red', fontSize: '12px', marginTop: '12px' }}>{uploadError}</p>}
                  {uploadSuccess && <p style={{ color: 'green', fontSize: '12px', marginTop: '12px' }}>{uploadSuccess}</p>}
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
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 'bold' }}>Premium Packages (Simulator)</p>
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
                  <Link href="/premium" className="btn btn-gold w-full" style={{ textAlign: 'center', display: 'block' }}>
                    View Premium Packages
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
                <Link href="/premium" className="btn btn-secondary" style={{ textAlign: 'center', backgroundColor: 'var(--cream-bg)', border: 'none' }}>
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
