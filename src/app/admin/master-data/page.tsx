'use client';

import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { MaslakOption, CasteOption, LocationOption } from '../../../types';

export default function MasterDataAdminPage() {
  const {
    masterMaslaks,
    masterCastes,
    masterLocations,
    submitMasterAction,
    isLoading
  } = useApp();

  // Active tab state
  const [activeTab, setActiveTab] = useState<'maslak' | 'caste' | 'location' | 'merge'>('maslak');

  // Search/Filter states
  const [maslakSearch, setMaslakSearch] = useState('');
  const [casteSearch, setCasteSearch] = useState('');
  const [locationStateFilter, setLocationStateFilter] = useState('');
  const [locationSearch, setLocationSearch] = useState('');

  // Add/Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Maslak Form
  const [maslakLabel, setMaslakLabel] = useState('');
  const [maslakAliases, setMaslakAliases] = useState('');

  // Caste Form
  const [casteLabel, setCasteLabel] = useState('');
  const [casteAliases, setCasteAliases] = useState('');

  // Location Form
  const [locState, setLocState] = useState('');
  const [locDistrict, setLocDistrict] = useState('');
  const [locLocality, setLocLocality] = useState('');
  const [locIsHighPriority, setLocIsHighPriority] = useState(false);

  // Merge Form States
  const [casteMergeSource, setCasteMergeSource] = useState('');
  const [casteMergeTarget, setCasteMergeTarget] = useState('');

  const [locMergeSourceId, setLocMergeSourceId] = useState('');
  const [locMergeTargetId, setLocMergeTargetId] = useState('');

  // Form Submission Handlers
  const handleMaslakSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!maslakLabel.trim()) return;

    const aliasesArr = maslakAliases
      .split(',')
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

    let success = false;
    if (editingId) {
      success = await submitMasterAction({
        action: 'edit_maslak',
        id: editingId,
        label: maslakLabel.trim(),
        aliases: aliasesArr,
      });
    } else {
      success = await submitMasterAction({
        action: 'add_maslak',
        label: maslakLabel.trim(),
        aliases: aliasesArr,
      });
    }

    if (success) {
      setMaslakLabel('');
      setMaslakAliases('');
      setEditingId(null);
      alert(editingId ? 'Maslak updated successfully!' : 'Maslak option added successfully!');
    }
  };

  const handleCasteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!casteLabel.trim()) return;

    const aliasesArr = casteAliases
      .split(',')
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

    let success = false;
    if (editingId) {
      success = await submitMasterAction({
        action: 'edit_caste',
        id: editingId,
        label: casteLabel.trim(),
        aliases: aliasesArr,
      });
    } else {
      success = await submitMasterAction({
        action: 'add_caste',
        label: casteLabel.trim(),
        aliases: aliasesArr,
      });
    }

    if (success) {
      setCasteLabel('');
      setCasteAliases('');
      setEditingId(null);
      alert(editingId ? 'Caste updated successfully!' : 'Caste option added successfully!');
    }
  };

  const handleLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locState.trim() || !locDistrict.trim()) {
      alert('State and District are required');
      return;
    }

    const success = await submitMasterAction({
      action: 'add_location',
      state: locState.trim(),
      district: locDistrict.trim(),
      locality: locLocality.trim() || null,
      isHighPriority: locIsHighPriority,
    });

    if (success) {
      setLocState('');
      setLocDistrict('');
      setLocLocality('');
      setLocIsHighPriority(false);
      alert('Location option added successfully!');
    }
  };

  // Toggle handlers
  const handleToggleDisableMaslak = async (id: string, currentStatus: boolean) => {
    const success = await submitMasterAction({
      action: 'toggle_disable_maslak',
      id,
      isDisabled: !currentStatus,
    });
    if (success) {
      alert(`Maslak option ${!currentStatus ? 'disabled' : 'enabled'} successfully.`);
    }
  };

  const handleToggleDisableCaste = async (id: string, currentStatus: boolean) => {
    const success = await submitMasterAction({
      action: 'toggle_disable_caste',
      id,
      isDisabled: !currentStatus,
    });
    if (success) {
      alert(`Caste option ${!currentStatus ? 'disabled' : 'enabled'} successfully.`);
    }
  };

  const handleToggleLocationPriority = async (id: string, currentPriority: boolean) => {
    const success = await submitMasterAction({
      action: 'toggle_location_priority',
      id,
      isHighPriority: !currentPriority,
    });
    if (success) {
      alert(`Location priority toggled successfully.`);
    }
  };

  const handleToggleDisableLocation = async (id: string, currentStatus: boolean) => {
    const success = await submitMasterAction({
      action: 'toggle_disable_location',
      id,
      isDisabled: !currentStatus,
    });
    if (success) {
      alert(`Location option ${!currentStatus ? 'disabled' : 'enabled'} successfully.`);
    }
  };

  // Merge handlers
  const handleMergeCastes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!casteMergeSource || !casteMergeTarget) {
      alert('Select both source and target castes to merge');
      return;
    }
    if (casteMergeSource === casteMergeTarget) {
      alert('Source and target castes must be different');
      return;
    }

    if (
      confirm(
        `Are you sure you want to merge "${casteMergeSource}" into "${casteMergeTarget}"?\n\nThis will:\n1. Update all profiles containing caste "${casteMergeSource}" to "${casteMergeTarget}".\n2. Add "${casteMergeSource}" as an alias of "${casteMergeTarget}".\n3. Disable the option "${casteMergeSource}".`
      )
    ) {
      const success = await submitMasterAction({
        action: 'merge_castes',
        sourceLabel: casteMergeSource,
        targetLabel: casteMergeTarget,
      });
      if (success) {
        setCasteMergeSource('');
        setCasteMergeTarget('');
        alert('Castes merged successfully!');
      }
    }
  };

  const handleMergeLocations = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locMergeSourceId || !locMergeTargetId) {
      alert('Select both source and target locations to merge');
      return;
    }
    if (locMergeSourceId === locMergeTargetId) {
      alert('Source and target locations must be different');
      return;
    }

    const sourceLoc = masterLocations.find((l) => l.id === locMergeSourceId);
    const targetLoc = masterLocations.find((l) => l.id === locMergeTargetId);

    if (!sourceLoc || !targetLoc) return;

    const sourceLabel = `${sourceLoc.locality ? `${sourceLoc.locality}, ` : ''}${sourceLoc.district}, ${sourceLoc.state}`;
    const targetLabel = `${targetLoc.locality ? `${targetLoc.locality}, ` : ''}${targetLoc.district}, ${targetLoc.state}`;

    if (
      confirm(
        `Are you sure you want to merge location "${sourceLabel}" into "${targetLabel}"?\n\nThis will:\n1. Update all profiles matching the source location to the target location coordinates.\n2. Disable the source location option.`
      )
    ) {
      const success = await submitMasterAction({
        action: 'merge_locations',
        sourceId: locMergeSourceId,
        targetId: locMergeTargetId,
      });
      if (success) {
        setLocMergeSourceId('');
        setLocMergeTargetId('');
        alert('Locations merged successfully!');
      }
    }
  };

  // Helper to trigger edit mode
  const startEditMaslak = (opt: MaslakOption) => {
    setEditingId(opt.id);
    setMaslakLabel(opt.label);
    setMaslakAliases(opt.aliases?.join(', ') || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startEditCaste = (opt: CasteOption) => {
    setEditingId(opt.id);
    setCasteLabel(opt.label);
    setCasteAliases(opt.aliases?.join(', ') || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setMaslakLabel('');
    setMaslakAliases('');
    setCasteLabel('');
    setCasteAliases('');
  };

  // Filter options lists
  const filteredMaslaks = [...masterMaslaks.filter(
    (m) =>
      m.label.toLowerCase().includes(maslakSearch.toLowerCase()) ||
      m.aliases?.some((a: string) => a.toLowerCase().includes(maslakSearch.toLowerCase()))
  )].sort((a, b) => a.label.localeCompare(b.label));

  const filteredCastes = [...masterCastes.filter(
    (c) =>
      c.label.toLowerCase().includes(casteSearch.toLowerCase()) ||
      c.aliases?.some((a: string) => a.toLowerCase().includes(casteSearch.toLowerCase()))
  )].sort((a, b) => a.label.localeCompare(b.label));

  // Group locations for filter drop down
  const uniqueStates = Array.from(new Set(masterLocations.map((l) => l.state))).sort();

  const filteredLocations = [...masterLocations.filter((l) => {
    const matchesState = !locationStateFilter || l.state === locationStateFilter;
    const searchString = `${l.district} ${l.locality || ''}`.toLowerCase();
    const matchesSearch = !locationSearch || searchString.includes(locationSearch.toLowerCase());
    return matchesState && matchesSearch;
  })].sort((a, b) => {
    const stateCompare = a.state.localeCompare(b.state);
    if (stateCompare !== 0) return stateCompare;
    const districtCompare = a.district.localeCompare(b.district);
    if (districtCompare !== 0) return districtCompare;
    return (a.locality || '').localeCompare(b.locality || '');
  });

  return (
    <div style={{ paddingBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-dark)', marginBottom: '8px' }}>
            🛠️ Identity & Location Master Data
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14.5px' }}>
            Manage database-backed sectors, caste systems, locations hierarchy, and run deduplication merges.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid var(--border-color)', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
        <button
          className={`btn ${activeTab === 'maslak' ? 'btn-gold' : 'btn-secondary'}`}
          onClick={() => { setActiveTab('maslak'); cancelEdit(); }}
          style={{ padding: '8px 16px', fontSize: '13.5px', whiteSpace: 'nowrap' }}
        >
          ☪️ Maslak / Sect Options ({masterMaslaks.length})
        </button>
        <button
          className={`btn ${activeTab === 'caste' ? 'btn-gold' : 'btn-secondary'}`}
          onClick={() => { setActiveTab('caste'); cancelEdit(); }}
          style={{ padding: '8px 16px', fontSize: '13.5px', whiteSpace: 'nowrap' }}
        >
          👥 Caste / Biradari Options ({masterCastes.length})
        </button>
        <button
          className={`btn ${activeTab === 'location' ? 'btn-gold' : 'btn-secondary'}`}
          onClick={() => { setActiveTab('location'); cancelEdit(); }}
          style={{ padding: '8px 16px', fontSize: '13.5px', whiteSpace: 'nowrap' }}
        >
          📍 Locations (State/Dist/Locality) ({masterLocations.length})
        </button>
        <button
          className={`btn ${activeTab === 'merge' ? 'btn-gold' : 'btn-secondary'}`}
          onClick={() => { setActiveTab('merge'); cancelEdit(); }}
          style={{ padding: '8px 16px', fontSize: '13.5px', whiteSpace: 'nowrap' }}
        >
          🔄 Deduplication & Merges
        </button>
      </div>

      {isLoading && (
        <div style={{ textAlign: 'center', padding: '30px', color: 'var(--gold-accent)' }}>
          Loading master database state...
        </div>
      )}

      {/* TAB 1: Maslak / Sect */}
      {activeTab === 'maslak' && !isLoading && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
          {/* Add / Edit Section */}
          <div className="card-theme-wrapper">
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-dark)', marginBottom: '16px' }}>
              {editingId ? '✍️ Edit Maslak Option' : '➕ Add New Maslak Option'}
            </h3>
            <form onSubmit={handleMaslakSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 'bold', color: 'var(--deep-maroon)', marginBottom: '6px' }}>
                    Maslak Label
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={maslakLabel}
                    onChange={(e) => setMaslakLabel(e.target.value)}
                    placeholder="e.g. Sunni Deobandi"
                    required
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 'bold', color: 'var(--deep-maroon)', marginBottom: '6px' }}>
                    Search Aliases (Comma-separated)
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={maslakAliases}
                    onChange={(e) => setMaslakAliases(e.target.value)}
                    placeholder="e.g. Deoband, Thanvi, Tablighi"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                {editingId && (
                  <button type="button" className="btn btn-secondary" onClick={cancelEdit} style={{ padding: '8px 20px', fontSize: '13px' }}>
                    Cancel
                  </button>
                )}
                <button type="submit" className="btn btn-gold" style={{ padding: '8px 20px', fontSize: '13px' }}>
                  {editingId ? 'Update Option' : 'Add Option'}
                </button>
              </div>
            </form>
          </div>

          {/* List Section */}
          <div className="card-theme-wrapper">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-dark)' }}>
                Active Sect Options ({filteredMaslaks.length})
              </h3>
              <input
                type="text"
                placeholder="Search label or alias..."
                className="form-input"
                value={maslakSearch}
                onChange={(e) => setMaslakSearch(e.target.value)}
                style={{ maxWidth: '250px', fontSize: '13px', padding: '6px 12px' }}
              />
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', backgroundColor: 'rgba(212,163,89,0.05)' }}>
                    <th style={{ padding: '12px 16px' }}>Label</th>
                    <th style={{ padding: '12px 16px' }}>Search Aliases</th>
                    <th style={{ padding: '12px 16px', width: '100px' }}>Status</th>
                    <th style={{ padding: '12px 16px', width: '180px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMaslaks.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No Maslak options found matching search.
                      </td>
                    </tr>
                  ) : (
                    filteredMaslaks.map((opt) => (
                      <tr key={opt.id} style={{ borderBottom: '1px solid rgba(212,163,89,0.1)', opacity: opt.isDisabled ? 0.6 : 1 }}>
                        <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>{opt.label}</td>
                        <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                          {opt.aliases && opt.aliases.length > 0 ? (
                            opt.aliases.map((a: string) => (
                              <span key={a} style={{ display: 'inline-block', padding: '2px 6px', background: 'var(--soft-cream)', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '11px', marginRight: '4px', marginBottom: '2px' }}>
                                {a}
                              </span>
                            ))
                          ) : (
                            <em style={{ fontSize: '12px' }}>None</em>
                          )}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', background: opt.isDisabled ? 'rgba(220,53,69,0.1)' : 'rgba(40,167,69,0.1)', color: opt.isDisabled ? '#dc3545' : '#28a745' }}>
                            {opt.isDisabled ? 'Disabled' : 'Active'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            <button
                              className="btn btn-secondary"
                              onClick={() => startEditMaslak(opt)}
                              style={{ padding: '4px 8px', fontSize: '11.5px' }}
                            >
                              Edit
                            </button>
                            <button
                              className={`btn ${opt.isDisabled ? 'btn-gold' : 'btn-secondary'}`}
                              onClick={() => handleToggleDisableMaslak(opt.id, opt.isDisabled)}
                              style={{ padding: '4px 8px', fontSize: '11.5px', minWidth: '70px', color: opt.isDisabled ? 'var(--deep-maroon)' : '#dc3545' }}
                            >
                              {opt.isDisabled ? 'Enable' : 'Disable'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Caste / Biradari */}
      {activeTab === 'caste' && !isLoading && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
          {/* Add / Edit Section */}
          <div className="card-theme-wrapper">
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-dark)', marginBottom: '16px' }}>
              {editingId ? '✍️ Edit Caste/Biradari Option' : '➕ Add New Caste/Biradari Option'}
            </h3>
            <form onSubmit={handleCasteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 'bold', color: 'var(--deep-maroon)', marginBottom: '6px' }}>
                    Caste / Biradari Label
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={casteLabel}
                    onChange={(e) => setCasteLabel(e.target.value)}
                    placeholder="e.g. Qureshi"
                    required
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 'bold', color: 'var(--deep-maroon)', marginBottom: '6px' }}>
                    Search Aliases (Comma-separated)
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={casteAliases}
                    onChange={(e) => setCasteAliases(e.target.value)}
                    placeholder="e.g. Kureshi, Quraishi, Butcher"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                {editingId && (
                  <button type="button" className="btn btn-secondary" onClick={cancelEdit} style={{ padding: '8px 20px', fontSize: '13px' }}>
                    Cancel
                  </button>
                )}
                <button type="submit" className="btn btn-gold" style={{ padding: '8px 20px', fontSize: '13px' }}>
                  {editingId ? 'Update Option' : 'Add Option'}
                </button>
              </div>
            </form>
          </div>

          {/* List Section */}
          <div className="card-theme-wrapper">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-dark)' }}>
                Active Caste Options ({filteredCastes.length})
              </h3>
              <input
                type="text"
                placeholder="Search caste or alias..."
                className="form-input"
                value={casteSearch}
                onChange={(e) => setCasteSearch(e.target.value)}
                style={{ maxWidth: '250px', fontSize: '13px', padding: '6px 12px' }}
              />
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', backgroundColor: 'rgba(212,163,89,0.05)' }}>
                    <th style={{ padding: '12px 16px' }}>Label</th>
                    <th style={{ padding: '12px 16px' }}>Search Aliases</th>
                    <th style={{ padding: '12px 16px', width: '100px' }}>Status</th>
                    <th style={{ padding: '12px 16px', width: '180px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCastes.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No Caste options found matching search.
                      </td>
                    </tr>
                  ) : (
                    filteredCastes.map((opt) => (
                      <tr key={opt.id} style={{ borderBottom: '1px solid rgba(212,163,89,0.1)', opacity: opt.isDisabled ? 0.6 : 1 }}>
                        <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>{opt.label}</td>
                        <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                          {opt.aliases && opt.aliases.length > 0 ? (
                            opt.aliases.map((a: string) => (
                              <span key={a} style={{ display: 'inline-block', padding: '2px 6px', background: 'var(--soft-cream)', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '11px', marginRight: '4px', marginBottom: '2px' }}>
                                {a}
                              </span>
                            ))
                          ) : (
                            <em style={{ fontSize: '12px' }}>None</em>
                          )}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', background: opt.isDisabled ? 'rgba(220,53,69,0.1)' : 'rgba(40,167,69,0.1)', color: opt.isDisabled ? '#dc3545' : '#28a745' }}>
                            {opt.isDisabled ? 'Disabled' : 'Active'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            <button
                              className="btn btn-secondary"
                              onClick={() => startEditCaste(opt)}
                              style={{ padding: '4px 8px', fontSize: '11.5px' }}
                            >
                              Edit
                            </button>
                            <button
                              className={`btn ${opt.isDisabled ? 'btn-gold' : 'btn-secondary'}`}
                              onClick={() => handleToggleDisableCaste(opt.id, opt.isDisabled)}
                              style={{ padding: '4px 8px', fontSize: '11.5px', minWidth: '70px', color: opt.isDisabled ? 'var(--deep-maroon)' : '#dc3545' }}
                            >
                              {opt.isDisabled ? 'Enable' : 'Disable'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Locations */}
      {activeTab === 'location' && !isLoading && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
          {/* Add Section */}
          <div className="card-theme-wrapper">
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-dark)', marginBottom: '16px' }}>
              ➕ Add New Location (Hierarchical)
            </h3>
            <form onSubmit={handleLocationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', flexWrap: 'wrap' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 'bold', color: 'var(--deep-maroon)', marginBottom: '6px' }}>
                    State (Level 1) *
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={locState}
                    onChange={(e) => setLocState(e.target.value)}
                    placeholder="e.g. Uttar Pradesh"
                    required
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 'bold', color: 'var(--deep-maroon)', marginBottom: '6px' }}>
                    District/City (Level 2) *
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={locDistrict}
                    onChange={(e) => setLocDistrict(e.target.value)}
                    placeholder="e.g. Lucknow"
                    required
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 'bold', color: 'var(--deep-maroon)', marginBottom: '6px' }}>
                    Locality/Area (Level 3 - Optional)
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={locLocality}
                    onChange={(e) => setLocLocality(e.target.value)}
                    placeholder="e.g. Hazratganj"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="locIsHighPriority"
                  checked={locIsHighPriority}
                  onChange={(e) => setLocIsHighPriority(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--gold-accent)' }}
                />
                <label htmlFor="locIsHighPriority" style={{ fontSize: '13.5px', color: 'var(--text-dark)' }}>
                  Mark as High-Priority Location (Renders at the top of search filters)
                </label>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="submit" className="btn btn-gold" style={{ padding: '8px 20px', fontSize: '13px' }}>
                  Add Location Option
                </button>
              </div>
            </form>
          </div>

          {/* List Section */}
          <div className="card-theme-wrapper">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-dark)' }}>
                Active Locations Options ({filteredLocations.length})
              </h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <select
                  className="form-input"
                  value={locationStateFilter}
                  onChange={(e) => setLocationStateFilter(e.target.value)}
                  style={{ fontSize: '13px', padding: '6px 12px' }}
                >
                  <option value="">All States</option>
                  {uniqueStates.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Search District/Locality..."
                  className="form-input"
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  style={{ maxWidth: '200px', fontSize: '13px', padding: '6px 12px' }}
                />
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', backgroundColor: 'rgba(212,163,89,0.05)' }}>
                    <th style={{ padding: '12px 16px' }}>State (L1)</th>
                    <th style={{ padding: '12px 16px' }}>District (L2)</th>
                    <th style={{ padding: '12px 16px' }}>Locality (L3)</th>
                    <th style={{ padding: '12px 16px', width: '100px' }}>Priority</th>
                    <th style={{ padding: '12px 16px', width: '100px' }}>Status</th>
                    <th style={{ padding: '12px 16px', width: '180px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLocations.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No Location options found matching filters.
                      </td>
                    </tr>
                  ) : (
                    filteredLocations.map((opt) => (
                      <tr key={opt.id} style={{ borderBottom: '1px solid rgba(212,163,89,0.1)', opacity: opt.isDisabled ? 0.6 : 1 }}>
                        <td style={{ padding: '12px 16px' }}>{opt.state}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>{opt.district}</td>
                        <td style={{ padding: '12px 16px' }}>{opt.locality || <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>All District</span>}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 'bold', background: opt.isHighPriority ? 'rgba(212,163,89,0.15)' : 'rgba(0,0,0,0.05)', color: opt.isHighPriority ? 'var(--gold-dark)' : 'var(--text-muted)' }}>
                            {opt.isHighPriority ? '⭐ Priority' : 'Normal'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', background: opt.isDisabled ? 'rgba(220,53,69,0.1)' : 'rgba(40,167,69,0.1)', color: opt.isDisabled ? '#dc3545' : '#28a745' }}>
                            {opt.isDisabled ? 'Disabled' : 'Active'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            <button
                              className="btn btn-secondary"
                              onClick={() => handleToggleLocationPriority(opt.id, opt.isHighPriority)}
                              style={{ padding: '4px 8px', fontSize: '11.5px', color: 'var(--gold-dark)' }}
                            >
                              ⭐ Toggle Priority
                            </button>
                            <button
                              className={`btn ${opt.isDisabled ? 'btn-gold' : 'btn-secondary'}`}
                              onClick={() => handleToggleDisableLocation(opt.id, opt.isDisabled)}
                              style={{ padding: '4px 8px', fontSize: '11.5px', minWidth: '70px', color: opt.isDisabled ? 'var(--deep-maroon)' : '#dc3545' }}
                            >
                              {opt.isDisabled ? 'Enable' : 'Disable'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Merges & Deduplication */}
      {activeTab === 'merge' && !isLoading && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', flexWrap: 'wrap' }}>
          {/* Caste Merge Card */}
          <div className="card-theme-wrapper">
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-dark)', marginBottom: '8px' }}>
              🔄 Merge Duplicate Castes
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '12.5px', marginBottom: '20px' }}>
              Replaces all occurrences of the duplicate caste in profiles with the target caste. Adds the duplicate as an alias of the target and disables the duplicate.
            </p>

            <form onSubmit={handleMergeCastes} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 'bold', color: 'var(--deep-maroon)', marginBottom: '6px' }}>
                  Select Duplicate Caste (Source to merge out)
                </label>
                <select
                  className="form-input"
                  value={casteMergeSource}
                  onChange={(e) => setCasteMergeSource(e.target.value)}
                  required
                  style={{ width: '100%' }}
                >
                  <option value="">-- Choose Caste --</option>
                  {[...masterCastes.filter((c) => !c.isDisabled)]
                    .sort((a, b) => a.label.localeCompare(b.label))
                    .map((c) => (
                      <option key={c.id} value={c.label}>
                        {c.label}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 'bold', color: 'var(--deep-maroon)', marginBottom: '6px' }}>
                  Select Correct Caste (Target to keep)
                </label>
                <select
                  className="form-input"
                  value={casteMergeTarget}
                  onChange={(e) => setCasteMergeTarget(e.target.value)}
                  required
                  style={{ width: '100%' }}
                >
                  <option value="">-- Choose Caste --</option>
                  {[...masterCastes.filter((c) => !c.isDisabled && c.label !== casteMergeSource)]
                    .sort((a, b) => a.label.localeCompare(b.label))
                    .map((c) => (
                      <option key={c.id} value={c.label}>
                        {c.label}
                      </option>
                    ))}
                </select>
              </div>

              <div style={{ padding: '12px', borderRadius: '6px', backgroundColor: 'rgba(220,53,69,0.05)', border: '1px solid rgba(220,53,69,0.2)', fontSize: '12px', color: '#dc3545' }}>
                <strong>⚠️ Warning:</strong> This operation is permanent. Profile updates occur immediately.
              </div>

              <button type="submit" className="btn btn-gold" style={{ padding: '10px', width: '100%', fontSize: '13.5px', marginTop: '8px' }}>
                Merge and Update Castes
              </button>
            </form>
          </div>

          {/* Location Merge Card */}
          <div className="card-theme-wrapper">
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-dark)', marginBottom: '8px' }}>
              🔄 Merge Duplicate Locations
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '12.5px', marginBottom: '20px' }}>
              Replaces the State/District/Locality structure in matching profiles, disables the duplicate location entry, and safeguards profile search continuity.
            </p>

            <form onSubmit={handleMergeLocations} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 'bold', color: 'var(--deep-maroon)', marginBottom: '6px' }}>
                  Select Duplicate Location (Source to merge out)
                </label>
                <select
                  className="form-input"
                  value={locMergeSourceId}
                  onChange={(e) => setLocMergeSourceId(e.target.value)}
                  required
                  style={{ width: '100%' }}
                >
                  <option value="">-- Choose Location --</option>
                  {[...masterLocations.filter((l) => !l.isDisabled)]
                    .sort((a, b) => {
                      const labelA = `${a.locality ? `${a.locality}, ` : ''}${a.district}, ${a.state}`;
                      const labelB = `${b.locality ? `${b.locality}, ` : ''}${b.district}, ${b.state}`;
                      return labelA.localeCompare(labelB);
                    })
                    .map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.locality ? `${l.locality}, ` : ''}{l.district}, {l.state}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 'bold', color: 'var(--deep-maroon)', marginBottom: '6px' }}>
                  Select Correct Location (Target to keep)
                </label>
                <select
                  className="form-input"
                  value={locMergeTargetId}
                  onChange={(e) => setLocMergeTargetId(e.target.value)}
                  required
                  style={{ width: '100%' }}
                >
                  <option value="">-- Choose Location --</option>
                  {[...masterLocations.filter((l) => !l.isDisabled && l.id !== locMergeSourceId)]
                    .sort((a, b) => {
                      const labelA = `${a.locality ? `${a.locality}, ` : ''}${a.district}, ${a.state}`;
                      const labelB = `${b.locality ? `${b.locality}, ` : ''}${b.district}, ${b.state}`;
                      return labelA.localeCompare(labelB);
                    })
                    .map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.locality ? `${l.locality}, ` : ''}{l.district}, {l.state}
                      </option>
                    ))}
                </select>
              </div>

              <div style={{ padding: '12px', borderRadius: '6px', backgroundColor: 'rgba(220,53,69,0.05)', border: '1px solid rgba(220,53,69,0.2)', fontSize: '12px', color: '#dc3545' }}>
                <strong>⚠️ Warning:</strong> Profiles matching the source location will have their fields updated to target location coordinates immediately.
              </div>

              <button type="submit" className="btn btn-gold" style={{ padding: '10px', width: '100%', fontSize: '13.5px', marginTop: '8px' }}>
                Merge and Update Locations
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
