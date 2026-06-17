'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useSimulator } from '../../context/SimulatorContext';
import Navbar from '../../components/Navbar';
import ProfileFilters from '../../components/ProfileFilters';
import ProfileGrid from '../../components/ProfileGrid';
import { SectionHeading, PremiumFooter } from '../../components/NikahComponents';

export default function SearchClient() {
  const { profiles, isLoggedIn, userProfile } = useSimulator();
  
  // Standard and advanced filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistance, setSelectedDistance] = useState('All');
  const [selectedCaste, setSelectedCaste] = useState('All');
  const [verificationFilter, setVerificationFilter] = useState('All');
  const [selectedMaslak, setSelectedMaslak] = useState('All');
  const [selectedFiqh, setSelectedFiqh] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedLocality, setSelectedLocality] = useState('All');
  const [willingToRelocateFilter, setWillingToRelocateFilter] = useState(false);
  const [sameCasteFilter, setSameCasteFilter] = useState(false);
  const [sameMaslakFilter, setSameMaslakFilter] = useState(false);

  // New Gender and Age filters
  const [selectedGender, setSelectedGender] = useState('No preference');
  const [minAge, setMinAge] = useState('Any');
  const [maxAge, setMaxAge] = useState('Any');

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
      return false;
    }
    const age = getProfileAge(p);
    if (parsedMin !== null) {
      if (age === null || age < parsedMin) return false;
    }
    if (parsedMax !== null) {
      if (age === null || age > parsedMax) return false;
    }

    // 1. Keyword search (name, occupation, education, city, state, bio)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = p.fullName.toLowerCase().includes(q);
      const occupationMatch = p.occupation.toLowerCase().includes(q);
      const educationMatch = p.education.toLowerCase().includes(q);
      const cityMatch = p.city ? p.city.toLowerCase().includes(q) : false;
      const stateMatch = p.state ? p.state.toLowerCase().includes(q) : false;
      const bioMatch = p.bio.toLowerCase().includes(q);
      if (!nameMatch && !occupationMatch && !educationMatch && !cityMatch && !stateMatch && !bioMatch) {
        return false;
      }
    }

    // 2. City distance simulation
    if (selectedDistance !== 'All') {
      if (selectedDistance === '50' && p.city !== 'Mumbai') return false;
      if (selectedDistance === '100' && p.city === 'Delhi') return false;
    }

    // 3. Sect / Maslak filter
    if (selectedMaslak !== 'All') {
      if (p.maslak !== selectedMaslak) return false;
    }

    // 4. Fiqh filter
    if (selectedFiqh !== 'All') {
      if (p.fiqh !== selectedFiqh) return false;
    }

    // 5. Caste / Biradari filter
    if (selectedCaste !== 'All') {
      if (p.biradari !== selectedCaste) return false;
    }

    // 6. Location hierarchies
    if (selectedState !== 'All' && p.state !== selectedState) return false;
    if (selectedDistrict !== 'All' && p.district !== selectedDistrict) return false;
    if (selectedLocality !== 'All' && p.locality !== selectedLocality) return false;

    // 7. Verification Status
    if (verificationFilter === 'Verified' && p.verificationStatus !== 'APPROVED') return false;
    if (verificationFilter === 'Unverified' && p.verificationStatus === 'APPROVED') return false;

    // 8. Relocation Openness
    if (willingToRelocateFilter && !p.willingToRelocate) return false;

    return true;
  });

  // Calculate soft matching compatibility scores to rank profiles
  const rankedProfiles = filteredProfiles.map((p) => {
    let score = 0;

    if (isLoggedIn && userProfile) {
      // Maslak / Sect matching
      const isMaslakMatch = p.maslak && userProfile.maslak && p.maslak === userProfile.maslak;
      if (isMaslakMatch) {
        if (sameMaslakFilter || userProfile.sameMaslakPreference) {
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
        if (sameCasteFilter || userProfile.sameCastePreference) {
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
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedDistance={selectedDistance}
            setSelectedDistance={setSelectedDistance}
            selectedCaste={selectedCaste}
            setSelectedCaste={setSelectedCaste}
            verificationFilter={verificationFilter}
            setVerificationFilter={setVerificationFilter}
            
            selectedMaslak={selectedMaslak}
            setSelectedMaslak={setSelectedMaslak}
            selectedFiqh={selectedFiqh}
            setSelectedFiqh={setSelectedFiqh}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
            selectedLocality={selectedLocality}
            setSelectedLocality={setSelectedLocality}
            willingToRelocateFilter={willingToRelocateFilter}
            setWillingToRelocateFilter={setWillingToRelocateFilter}
            sameCasteFilter={sameCasteFilter}
            setSameCasteFilter={setSameCasteFilter}
            sameMaslakFilter={sameMaslakFilter}
            setSameMaslakFilter={setSameMaslakFilter}

            selectedGender={selectedGender}
            setSelectedGender={setSelectedGender}
            minAge={minAge}
            setMinAge={setMinAge}
            maxAge={maxAge}
            setMaxAge={setMaxAge}

            totalResults={rankedProfiles.length}
          />

          <ProfileGrid filteredProfiles={rankedProfiles} />
        </div>
      </main>
      <PremiumFooter onNavigate={(view) => window.location.href = `/${view === 'home' ? '' : view}`} />
    </>
  );
}
