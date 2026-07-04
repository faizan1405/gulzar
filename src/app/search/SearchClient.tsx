'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import Navbar from '../../components/Navbar';
import ProfileFilters from '../../components/ProfileFilters';
import ProfileGrid from '../../components/ProfileGrid';
import { SectionHeading, PremiumFooter } from '../../components/NikahComponents';

export default function SearchClient() {
  const { profiles, isLoggedIn, userProfile, isLoading } = useApp();
  
  const searchParams = useSearchParams();
  const queryLocation = searchParams?.get('location');
  const queryGender = searchParams?.get('gender');
  const queryAgeMin = searchParams?.get('ageMin');
  const queryAgeMax = searchParams?.get('ageMax');
  const queryState = searchParams?.get('state');
  const queryCity = searchParams?.get('city');
  const queryCommunity = searchParams?.get('community');
  const queryCaste = searchParams?.get('caste');

  const { masterLocations } = useApp();

  // Parse initial state/city: direct params take priority, then legacy location param
  let initialState = 'All';
  let initialCity = 'All';

  if (queryState) {
    initialState = queryState;
    if (queryCity) initialCity = queryCity;
  } else if (queryLocation && queryLocation !== 'All India') {
    const isState = masterLocations.some(l => l.state === queryLocation);
    const isCity = masterLocations.some(l => l.district === queryLocation);

    if (queryLocation === 'Delhi NCR') {
      initialState = 'Delhi';
    } else if (isState) {
      initialState = queryLocation;
    } else if (isCity) {
      initialCity = queryLocation;
      const foundLoc = masterLocations.find(l => l.district === queryLocation);
      if (foundLoc) {
        initialState = foundLoc.state;
      }
    } else {
      const partialState = masterLocations.find(l => l.state.includes(queryLocation));
      if (partialState) initialState = partialState.state;
    }
  }

  // Standard and advanced filters — initialized from URL query params
  const [selectedCaste, setSelectedCaste] = useState(queryCaste || 'All');
  const [selectedCommunity, setSelectedCommunity] = useState(queryCommunity || 'All');
  const [selectedState, setSelectedState] = useState(initialState);
  const [selectedCity, setSelectedCity] = useState(initialCity);

  // Gender and Age filters — initialized from URL query params
  const [selectedGender, setSelectedGender] = useState(queryGender || 'No preference');
  const [minAge, setMinAge] = useState(queryAgeMin || 'Any');
  const [maxAge, setMaxAge] = useState(queryAgeMax || 'Any');

  const parsedMin = minAge !== 'Any' ? Number(minAge) : null;
  const parsedMax = maxAge !== 'Any' ? Number(maxAge) : null;
  const isAgeRangeInvalid = parsedMin !== null && parsedMax !== null && parsedMin > parsedMax;

  // Calculate age dynamically from dateOfBirth, fallback to age, or null
  const getProfileAge = (p: any): number | null => {
    if (p.dateOfBirth) {
      const dob = new Date(p.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      return age;
    }
    if (p.age !== undefined && p.age !== null) {
      return Number(p.age);
    }
    return null;
  };

  // Detect whether the user has set any filter away from defaults
  const hasActiveFilters = (): boolean => {
    return (
      selectedGender !== 'No preference' ||
      minAge !== 'Any' ||
      maxAge !== 'Any' ||
      selectedState !== 'All' ||
      selectedCity !== 'All' ||
      selectedCommunity !== 'All' ||
      selectedCaste !== 'All'
    );
  };

  // Apply strict filtering
  const filteredProfiles = profiles.filter((p) => {
    // 0a. Gender filter (hard filter)
    if (selectedGender !== 'No preference') {
      if (p.gender.toLowerCase() !== selectedGender.toLowerCase()) {
        return false;
      }
    }

    // 0b. Age range filter (hard filter)
    if (isAgeRangeInvalid) {
      return false; // Return empty results if range is invalid
    }
    const age = getProfileAge(p);
    if (parsedMin !== null) {
      if (age === null || age < parsedMin) return false;
    }
    if (parsedMax !== null) {
      if (age === null || age > parsedMax) return false;
    }

    // 1. Sect / Maslak / Community filter
    if (selectedCommunity !== 'All') {
      if (p.maslak !== selectedCommunity) return false;
    }

    // 2. Caste / Biradari filter
    if (selectedCaste !== 'All') {
      if (p.biradari !== selectedCaste) return false;
    }

    // 3. Location hierarchies
    if (selectedState !== 'All' && p.state !== selectedState) return false;
    if (selectedCity !== 'All' && p.district !== selectedCity) return false;

    return true;
  });

  // Calculate soft matching compatibility scores to rank profiles
  const rankedProfiles = filteredProfiles.map((p) => {
    let score = 0;

    if (isLoggedIn && userProfile) {
      // Maslak / Sect matching
      const isMaslakMatch = p.maslak && userProfile.maslak && p.maslak === userProfile.maslak;
      if (isMaslakMatch) {
        if (userProfile.sameMaslakPreference) {
          score += 25; // Higher priority
        } else {
          score += 12;
        }
      } else if (userProfile.noMaslakPreference || p.noMaslakPreference) {
        score += 6; // Minor points for neutral preferences
      }

      // Caste / Biradari matching
      const isCasteMatch = p.biradari && userProfile.biradari && p.biradari === userProfile.biradari;
      if (isCasteMatch) {
        if (userProfile.sameCastePreference) {
          score += 25;
        } else {
          score += 12;
        }
      } else if (userProfile.noCastePreference || p.noCastePreference) {
        score += 6;
      }

      // Location compatibility
      if (p.state && userProfile.state && p.state === userProfile.state) {
        score += 15;
      }
      if (p.district && userProfile.district && p.district === userProfile.district) {
        score += 10;
      }
      if (userProfile.preferredLocations && p.state && userProfile.preferredLocations.includes(p.state)) {
        score += 12;
      }
      if (userProfile.willingToRelocate || p.willingToRelocate) {
        score += 5;
      }
    }

    return { ...p, compatibilityScore: score };
  });

  // Sort descending by compatibility score
  rankedProfiles.sort((a, b) => (b.compatibilityScore || 0) - (a.compatibilityScore || 0));

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        {/* Subtle top banner */}
        <div style={{ position: 'relative', padding: '60px 0 20px 0', overflow: 'hidden', marginBottom: '20px' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
            <Image
              src="/images/nikah-2.jpeg"
              alt="Search Muslim Profiles"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
              priority
            />
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'linear-gradient(to bottom, rgba(253, 248, 245, 0.9), rgba(253, 248, 245, 1))'
            }} />
          </div>
          <div className="container font-sans" style={{ position: 'relative', zIndex: 1 }}>
            <SectionHeading
              title="Matrimonial Candidate Directory"
              scriptText="Browse Profiles"
              subtitle="Browse call-verified brides and grooms. Use filters to narrow down compatibility matches."
              as="h1"
            />
          </div>
        </div>

        <div className="container font-sans" style={{ padding: '0 0 80px 0' }}>

          {isAgeRangeInvalid && (
            <div style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#991B1B',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14.5px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }} className="error-banner">
              ⚠️ Minimum age cannot be greater than maximum age.
            </div>
          )}

          <ProfileFilters
            selectedGender={selectedGender}
            setSelectedGender={setSelectedGender}
            minAge={minAge}
            setMinAge={setMinAge}
            maxAge={maxAge}
            setMaxAge={setMaxAge}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            selectedCommunity={selectedCommunity}
            setSelectedCommunity={setSelectedCommunity}
            selectedCaste={selectedCaste}
            setSelectedCaste={setSelectedCaste}

            totalResults={rankedProfiles.length}
          />

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: '36px', marginBottom: '14px', animation: 'spin 1.2s linear infinite', display: 'inline-block' }}>⏳</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px', fontWeight: 500 }}>Loading profiles…</p>
            </div>
          ) : (
            <ProfileGrid filteredProfiles={rankedProfiles} isFiltered={hasActiveFilters()} />
          )}
        </div>
      </main>
      <PremiumFooter onNavigate={(view) => window.location.href = `/${view === 'home' ? '' : view}`} />
    </>
  );
}
