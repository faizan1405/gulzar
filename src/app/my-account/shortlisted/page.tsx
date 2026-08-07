'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { SectionHeading, PremiumFooter } from '@/components/NikahComponents';
import { Profile } from '@/types';
import { ProfileGrid } from '@/components/ProfileGrid';

import { useRouter } from 'next/navigation';

export default function ShortlistedProfilesPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchShortlistedProfiles = async () => {
    try {
      const res = await fetch('/api/user/shortlist?take=50');
      if (res.ok) {
        const data = await res.json();
        const mappedProfiles = (data.shortlists || []).map((s: Record<string, unknown>) => s.profile as Profile);
        setProfiles(mappedProfiles);
      }
    } catch (error) {
      console.error('Failed to fetch shortlisted profiles', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShortlistedProfiles();
  }, []);

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <div className="container" style={{ padding: '40px 0 80px 0' }}>
          <SectionHeading
            title="Shortlisted Profiles"
            scriptText="Favorites"
            subtitle="Profiles you have saved."
            as="h1"
          />

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
          ) : (
            <ProfileGrid filteredProfiles={profiles} isFiltered={true} />
          )}
        </div>
      </main>
      <PremiumFooter onNavigate={(view) => router.push(`/${view === 'home' ? '' : view}`)} />
    </>
  );
}
