'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { SectionHeading, PremiumFooter, ProfileCard } from '@/components/NikahComponents';
import { useApp } from '@/context/AppContext';
import { getProfileImage, getThemeClass } from '@/lib/helpers';

export default function InterestsPage() {
  const {
    isLoggedIn,
    hasPaidSubscription,
    activePackages,
    highProfileApproved,
    savedProfiles,
    toggleSaveProfile,
    setSelectedProfileForDetails,
    setShowLoginModal,
    handleViewProfile,
    userProfile,
  } = useApp();

  const isFormComplete = userProfile?.profileCompletionStatus === 'COMPLETE';
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('received');
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterests();
  }, [activeTab]);

  const fetchInterests = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/user/interests?type=${activeTab}&take=50`);
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      }
    } catch (error) {
      console.error('Failed to fetch interests', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId: string, action: string) => {
    try {
      const res = await fetch('/api/user/interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action })
      });
      if (res.ok) {
        fetchInterests(); // Refresh list
      }
    } catch (error) {
      console.error('Action failed', error);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <div className="container" style={{ padding: '40px 0 80px 0' }}>
          <SectionHeading
            title="Interest Requests"
            scriptText="Connections"
            subtitle="Manage your sent and received interests."
            as="h1"
          />

          <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', justifyContent: 'center' }}>
            <button
              onClick={() => setActiveTab('received')}
              className={activeTab === 'received' ? 'btn btn-primary' : 'btn btn-secondary'}
            >
              Received Interests
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={activeTab === 'sent' ? 'btn btn-primary' : 'btn btn-secondary'}
            >
              Sent Interests
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
          ) : requests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              No {activeTab} interests found.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {requests.map((req, idx) => {
                const profile = activeTab === 'sent' ? req.receiver : req.sender;
                return (
                  <div key={req.id} style={{ position: 'relative' }}>
                    <ProfileCard 
                      profile={profile}
                      index={idx}
                      isLoggedIn={isLoggedIn}
                      isFormComplete={isFormComplete}
                      hasPaidSubscription={hasPaidSubscription}
                      activePackages={activePackages}
                      highProfileApproved={highProfileApproved}
                      savedProfiles={savedProfiles}
                      onToggleSave={toggleSaveProfile}
                      onViewDetails={setSelectedProfileForDetails}
                      onViewProfile={handleViewProfile}
                      onShowLogin={() => setShowLoginModal(true)}
                      getProfileImage={getProfileImage}
                      getThemeClass={getThemeClass}
                    />
                    
                    <div style={{
                      marginTop: '12px',
                      padding: '12px',
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    }}>
                      <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary-dark)' }}>
                          Status: {req.status}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {new Date(req.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {activeTab === 'received' && req.status === 'PENDING' && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => handleAction(req.id, 'ACCEPT')}
                            className="btn btn-primary" 
                            style={{ flex: 1, padding: '8px', fontSize: '13px' }}
                          >
                            Accept
                          </button>
                          <button 
                            onClick={() => handleAction(req.id, 'REJECT')}
                            className="btn btn-secondary" 
                            style={{ flex: 1, padding: '8px', fontSize: '13px' }}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      
                      {activeTab === 'sent' && req.status === 'PENDING' && (
                        <button 
                          onClick={() => handleAction(req.id, 'WITHDRAW')}
                          className="btn btn-secondary" 
                          style={{ width: '100%', padding: '8px', fontSize: '13px' }}
                        >
                          Withdraw
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <PremiumFooter onNavigate={(view) => window.location.href = `/${view === 'home' ? '' : view}`} />
    </>
  );
}
