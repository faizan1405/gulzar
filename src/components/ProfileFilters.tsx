'use client';

import React, { useState } from 'react';
import { useSimulator } from '../context/SimulatorContext';
import { DEFAULT_FIQHS } from '../lib/masterData';

interface ProfileFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedDistance: string;
  setSelectedDistance: (val: string) => void;
  selectedCaste: string;
  setSelectedCaste: (val: string) => void;
  verificationFilter: string;
  setVerificationFilter: (val: string) => void;
  
  selectedMaslak: string;
  setSelectedMaslak: (val: string) => void;
  selectedFiqh: string;
  setSelectedFiqh: (val: string) => void;
  selectedState: string;
  setSelectedState: (val: string) => void;
  selectedDistrict: string;
  setSelectedDistrict: (val: string) => void;
  selectedLocality: string;
  setSelectedLocality: (val: string) => void;
  willingToRelocateFilter: boolean;
  setWillingToRelocateFilter: (val: boolean) => void;
  sameCasteFilter: boolean;
  setSameCasteFilter: (val: boolean) => void;
  sameMaslakFilter: boolean;
  setSameMaslakFilter: (val: boolean) => void;

  totalResults: number;
}

export const ProfileFilters: React.FC<ProfileFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedDistance,
  setSelectedDistance,
  selectedCaste,
  setSelectedCaste,
  verificationFilter,
  setVerificationFilter,
  
  selectedMaslak,
  setSelectedMaslak,
  selectedFiqh,
  setSelectedFiqh,
  selectedState,
  setSelectedState,
  selectedDistrict,
  setSelectedDistrict,
  selectedLocality,
  setSelectedLocality,
  willingToRelocateFilter,
  setWillingToRelocateFilter,
  sameCasteFilter,
  setSameCasteFilter,
  sameMaslakFilter,
  setSameMaslakFilter,
  totalResults
}) => {
  const { masterMaslaks, masterCastes, masterLocations } = useSimulator();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedDistance('All');
    setSelectedCaste('All');
    setVerificationFilter('All');
    setSelectedMaslak('All');
    setSelectedFiqh('All');
    setSelectedState('All');
    setSelectedDistrict('All');
    setSelectedLocality('All');
    setWillingToRelocateFilter(false);
    setSameCasteFilter(false);
    setSameMaslakFilter(false);
  };

  const activeMaslaks = masterMaslaks.filter(m => !m.isDisabled);
  const activeCastes = masterCastes.filter(c => !c.isDisabled);
  const activeLocations = masterLocations.filter(l => !l.isDisabled);

  const states = Array.from(new Set(activeLocations.map(l => l.state)));
  const districts = selectedState !== 'All' 
    ? Array.from(new Set(activeLocations.filter(l => l.state === selectedState).map(l => l.district)))
    : [];
  const localities = (selectedState !== 'All' && selectedDistrict !== 'All')
    ? Array.from(new Set(activeLocations.filter(l => l.state === selectedState && l.district === selectedDistrict && l.locality).map(l => l.locality!)))
    : [];

  return (
    <div className="search-panel font-sans" style={{ backgroundColor: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-lg)', padding: '24px', marginBottom: '40px', boxShadow: 'var(--shadow-premium)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', alignItems: 'flex-end' }}>
        <div>
          <label className="form-label">Search Keyword</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, occupation, city..."
            className="form-control"
          />
        </div>

        <div>
          <label className="form-label">Sect / Maslak</label>
          <select
            value={selectedMaslak}
            onChange={(e) => setSelectedMaslak(e.target.value)}
            className="form-control"
          >
            <option value="All">All Sects / Maslaks</option>
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
            <option value="All">All Castes / Biradaris</option>
            {activeCastes.map(c => (
              <option key={c.id} value={c.label}>{c.label}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="btn btn-secondary"
            style={{ flexGrow: 1, height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            ⚙️ {showAdvanced ? 'Hide advanced' : 'More preferences'}
          </button>
          <button
            onClick={handleClearFilters}
            className="btn btn-primary"
            style={{ height: '42px', minWidth: '80px' }}
          >
            Reset
          </button>
        </div>
      </div>

      {showAdvanced && (
        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div>
            <label className="form-label">Fiqh / School of Thought</label>
            <select
              value={selectedFiqh}
              onChange={(e) => setSelectedFiqh(e.target.value)}
              className="form-control"
            >
              <option value="All">All Fiqhs</option>
              {DEFAULT_FIQHS.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">State / UT</label>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedDistrict('All');
                setSelectedLocality('All');
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
            <label className="form-label">District / City</label>
            <select
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setSelectedLocality('All');
              }}
              className="form-control"
              disabled={selectedState === 'All'}
            >
              <option value="All">All Districts</option>
              {districts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Locality / Area</label>
            <select
              value={selectedLocality}
              onChange={(e) => setSelectedLocality(e.target.value)}
              className="form-control"
              disabled={selectedDistrict === 'All'}
            >
              <option value="All">All Localities</option>
              {localities.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Verification Filter</label>
            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className="form-control"
            >
              <option value="All">All Candidates</option>
              <option value="Verified">Call Verified Only</option>
              <option value="Unverified">Pending Review Only</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: 'span 2', justifyContent: 'center' }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={willingToRelocateFilter}
                onChange={(e) => setWillingToRelocateFilter(e.target.checked)}
              />
              <span>Open / willing to relocate</span>
            </label>
            
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={sameCasteFilter}
                onChange={(e) => setSameCasteFilter(e.target.checked)}
              />
              <span>Filter same caste candidates (soft ranking)</span>
            </label>

            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={sameMaslakFilter}
                onChange={(e) => setSameMaslakFilter(e.target.checked)}
              />
              <span>Filter same maslak candidates (soft ranking)</span>
            </label>
          </div>
        </div>
      )}

      <div style={{ marginTop: '16px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>
        Found {totalResults} matching matrimonial profiles.
      </div>
    </div>
  );
};

export default ProfileFilters;

