'use client';

import React from 'react';
import { useSimulator } from '../context/SimulatorContext';

interface ProfileFiltersProps {
  selectedGender: string;
  setSelectedGender: (val: string) => void;
  minAge: string;
  setMinAge: (val: string) => void;
  maxAge: string;
  setMaxAge: (val: string) => void;
  selectedState: string;
  setSelectedState: (val: string) => void;
  selectedCity: string;
  setSelectedCity: (val: string) => void;
  selectedCommunity: string;
  setSelectedCommunity: (val: string) => void;
  selectedCaste: string;
  setSelectedCaste: (val: string) => void;
  totalResults: number;
}

export const ProfileFilters: React.FC<ProfileFiltersProps> = ({
  selectedGender,
  setSelectedGender,
  minAge,
  setMinAge,
  maxAge,
  setMaxAge,
  selectedState,
  setSelectedState,
  selectedCity,
  setSelectedCity,
  selectedCommunity,
  setSelectedCommunity,
  selectedCaste,
  setSelectedCaste,
  totalResults
}) => {
  const { masterMaslaks, masterCastes, masterLocations } = useSimulator();

  const handleClearFilters = () => {
    setSelectedGender('No preference');
    setMinAge('Any');
    setMaxAge('Any');
    setSelectedState('All');
    setSelectedCity('All');
    setSelectedCommunity('All');
    setSelectedCaste('All');
  };

  const activeMaslaks = [...masterMaslaks.filter(m => !m.isDisabled)].sort((a, b) => a.label.localeCompare(b.label));
  const activeCastes = [...masterCastes.filter(c => !c.isDisabled)].sort((a, b) => a.label.localeCompare(b.label));
  const activeLocations = masterLocations.filter(l => !l.isDisabled);

  const states = Array.from(new Set(activeLocations.map(l => l.state))).sort((a, b) => a.localeCompare(b));
  const cities = selectedState !== 'All' 
    ? Array.from(new Set(activeLocations.filter(l => l.state === selectedState).map(l => l.district))).sort((a, b) => a.localeCompare(b))
    : [];

  const ageOptions = Array.from({ length: 53 }, (_, i) => 18 + i);

  return (
    <div className="search-panel font-sans" style={{ backgroundColor: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-lg)', padding: '24px', marginBottom: '40px', boxShadow: 'var(--shadow-premium)' }}>
      {/* Primary Filters Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', alignItems: 'flex-end', marginBottom: '24px' }}>
        <div>
          <label className="form-label" htmlFor="search-gender-select">Preference / Gender</label>
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="form-control"
            id="search-gender-select"
          >
            <option value="No preference">No preference / All</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div>
          <label className="form-label" htmlFor="search-minage-select">Minimum Age</label>
          <select
            value={minAge}
            onChange={(e) => setMinAge(e.target.value)}
            className="form-control"
            id="search-minage-select"
          >
            <option value="Any">Any</option>
            {ageOptions.map(age => (
              <option key={`min-${age}`} value={age}>{age}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label" htmlFor="search-maxage-select">Maximum Age</label>
          <select
            value={maxAge}
            onChange={(e) => setMaxAge(e.target.value)}
            className="form-control"
            id="search-maxage-select"
          >
            <option value="Any">Any</option>
            {ageOptions.map(age => (
              <option key={`max-${age}`} value={age}>{age}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', alignItems: 'flex-end' }}>
        <div>
          <label className="form-label">State</label>
          <select
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setSelectedCity('All');
            }}
            className="form-control"
          >
            <option value="All">All States</option>
            {states.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label">City</label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="form-control"
            disabled={selectedState === 'All'}
          >
            <option value="All">All Cities</option>
            {cities.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label">Community</label>
          <select
            value={selectedCommunity}
            onChange={(e) => setSelectedCommunity(e.target.value)}
            className="form-control"
          >
            <option value="All">All Communities</option>
            {activeMaslaks.map(m => (
              <option key={m.id} value={m.label}>{m.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label">Caste / Biradari</label>
          <select
            value={selectedCaste}
            onChange={(e) => setSelectedCaste(e.target.value)}
            className="form-control"
          >
            <option value="All">All Castes</option>
            {activeCastes.map(c => (
              <option key={c.id} value={c.label}>{c.label}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleClearFilters}
            className="btn btn-primary"
            style={{ flexGrow: 1, height: '42px', minWidth: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            Reset Filters
          </button>
        </div>
      </div>

      <div style={{ marginTop: '16px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>
        Found {totalResults} matching matrimonial profiles.
      </div>
    </div>
  );
};

export default ProfileFilters;
