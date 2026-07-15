'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { SectionHeading, PremiumFooter } from '@/components/NikahComponents';
import { ProfileGrid } from '@/components/ProfileGrid';

export default function ViewedProfilesPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchViewedProfiles();
  }, []);

  const fetchViewedProfiles = async () => {
    try {
      const res = await fetch('/api/user/viewed-profiles?take=50');
      if (res.ok) {
        const data = await res.json();
        const mappedProfiles = (data.views || []).map((v: any) => v.viewedProfile);
        setProfiles(mappedProfiles);
      }
    } catch (error) {
      console.error('Failed to fetch viewed profiles', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (confirm('Are you sure you want to clear your viewed profile history?')) {
      try {
        const res = await fetch('/api/user/viewed-profiles?clearAll=true', { method: 'DELETE' });
        if (res.ok) {
          setProfiles([]);
        }
      } catch (error) {
        console.error('Failed to clear viewed profiles', error);
      }
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <div className="container" style={{ padding: '40px 0 80px 0' }}>
          <SectionHeading
            title="Recently Viewed Profiles"
            scriptText="History"
            subtitle="Profiles you have recently viewed."
            as="h1"
          />
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <button 
              onClick={handleClearHistory}
              disabled={profiles.length === 0}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: profiles.length === 0 ? 'not-allowed' : 'pointer',
                opacity: profiles.length === 0 ? 0.5 : 1
              }}
            >
              Clear History
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
          ) : (
            <ProfileGrid filteredProfiles={profiles} isFiltered={true} />
          )}
        </div>
      </main>
      <PremiumFooter onNavigate={(view) => window.location.href = `/${view === 'home' ? '' : view}`} />
    </>
  );
}
