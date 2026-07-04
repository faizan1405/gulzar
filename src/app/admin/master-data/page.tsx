'use client';

import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { MaslakOption, CasteOption, LocationOption } from '../../../types';
import { AdminPageHeader, AdminCard, AdminButton, AdminTable, AdminBadge } from '../../../components/AdminUI';

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
    <div className="font-sans">
      <AdminPageHeader
        title="Identity & Location Master Data"
        subtitle="Manage database-backed sectors, caste systems, locations hierarchy, and run deduplication merges."
      />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', marginBottom: '24px', overflowX: 'auto', paddingBottom: '12px' }}>
        <AdminButton
          variant={activeTab === 'maslak' ? 'primary' : 'ghost'}
          onClick={() => { setActiveTab('maslak'); cancelEdit(); }}
          style={{ whiteSpace: 'nowrap' }}
        >
          ☪️ Maslak / Sect Options ({masterMaslaks.length})
        </AdminButton>
        <AdminButton
          variant={activeTab === 'caste' ? 'primary' : 'ghost'}
          onClick={() => { setActiveTab('caste'); cancelEdit(); }}
          style={{ whiteSpace: 'nowrap' }}
        >
          👥 Caste / Biradari Options ({masterCastes.length})
        </AdminButton>
        <AdminButton
          variant={activeTab === 'location' ? 'primary' : 'ghost'}
          onClick={() => { setActiveTab('location'); cancelEdit(); }}
          style={{ whiteSpace: 'nowrap' }}
        >
          📍 Locations (State/Dist/Locality) ({masterLocations.length})
        </AdminButton>
        <AdminButton
          variant={activeTab === 'merge' ? 'primary' : 'ghost'}
          onClick={() => { setActiveTab('merge'); cancelEdit(); }}
          style={{ whiteSpace: 'nowrap' }}
        >
          🔄 Deduplication & Merges
        </AdminButton>
      </div>

      {isLoading && (
        <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
          <div style={{ fontSize: '16px', fontWeight: 500, color: '#334155' }}>Loading master database state...</div>
        </div>
      )}

      {/* TAB 1: Maslak / Sect */}
      {activeTab === 'maslak' && !isLoading && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          {/* Add / Edit Section */}
          <AdminCard>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>
              {editingId ? '✍️ Edit Maslak Option' : '➕ Add New Maslak Option'}
            </h3>
            <form onSubmit={handleMaslakSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="admin-label">Maslak Label</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={maslakLabel}
                    onChange={(e) => setMaslakLabel(e.target.value)}
                    placeholder="e.g. Sunni Deobandi"
                    required
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label className="admin-label">Search Aliases (Comma-separated)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={maslakAliases}
                    onChange={(e) => setMaslakAliases(e.target.value)}
                    placeholder="e.g. Deoband, Thanvi, Tablighi"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                {editingId && (
                  <AdminButton type="button" variant="secondary" onClick={cancelEdit}>
                    Cancel
                  </AdminButton>
                )}
                <AdminButton type="submit">
                  {editingId ? 'Update Option' : 'Add Option'}
                </AdminButton>
              </div>
            </form>
          </AdminCard>

          {/* List Section */}
          <AdminCard style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: 0 }}>
                Active Sect Options ({filteredMaslaks.length})
              </h3>
              <input
                type="text"
                placeholder="Search label or alias..."
                className="admin-input"
                value={maslakSearch}
                onChange={(e) => setMaslakSearch(e.target.value)}
                style={{ width: '250px' }}
              />
            </div>

            <AdminTable headers={['Label', 'Search Aliases', 'Status', 'Actions']}>
              {filteredMaslaks.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                    No Maslak options found matching search.
                  </td>
                </tr>
              ) : (
                filteredMaslaks.map((opt) => (
                  <tr key={opt.id} style={{ opacity: opt.isDisabled ? 0.6 : 1 }}>
                    <td style={{ fontWeight: 600, color: '#0f172a' }}>{opt.label}</td>
                    <td>
                      {opt.aliases && opt.aliases.length > 0 ? (
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {opt.aliases.map((a: string) => (
                            <span key={a} style={{ display: 'inline-block', padding: '2px 8px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '11px', color: '#475569' }}>
                              {a}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <em style={{ fontSize: '12px', color: '#94a3b8' }}>None</em>
                      )}
                    </td>
                    <td>
                      <AdminBadge status={opt.isDisabled ? 'REJECTED' : 'APPROVED'}>
                        {opt.isDisabled ? 'Disabled' : 'Active'}
                      </AdminBadge>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <AdminButton
                          variant="secondary"
                          onClick={() => startEditMaslak(opt)}
                          style={{ padding: '4px 8px', fontSize: '11px' }}
                        >
                          Edit
                        </AdminButton>
                        <AdminButton
                          variant={opt.isDisabled ? 'primary' : 'danger'}
                          onClick={() => handleToggleDisableMaslak(opt.id, opt.isDisabled)}
                          style={{ padding: '4px 8px', fontSize: '11px', minWidth: '70px' }}
                        >
                          {opt.isDisabled ? 'Enable' : 'Disable'}
                        </AdminButton>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </AdminTable>
          </AdminCard>
        </div>
      )}

      {/* TAB 2: Caste / Biradari */}
      {activeTab === 'caste' && !isLoading && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          {/* Add / Edit Section */}
          <AdminCard>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>
              {editingId ? '✍️ Edit Caste/Biradari Option' : '➕ Add New Caste/Biradari Option'}
            </h3>
            <form onSubmit={handleCasteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="admin-label">Caste / Biradari Label</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={casteLabel}
                    onChange={(e) => setCasteLabel(e.target.value)}
                    placeholder="e.g. Qureshi"
                    required
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label className="admin-label">Search Aliases (Comma-separated)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={casteAliases}
                    onChange={(e) => setCasteAliases(e.target.value)}
                    placeholder="e.g. Kureshi, Quraishi, Butcher"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                {editingId && (
                  <AdminButton type="button" variant="secondary" onClick={cancelEdit}>
                    Cancel
                  </AdminButton>
                )}
                <AdminButton type="submit">
                  {editingId ? 'Update Option' : 'Add Option'}
                </AdminButton>
              </div>
            </form>
          </AdminCard>

          {/* List Section */}
          <AdminCard style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: 0 }}>
                Active Caste Options ({filteredCastes.length})
              </h3>
              <input
                type="text"
                placeholder="Search caste or alias..."
                className="admin-input"
                value={casteSearch}
                onChange={(e) => setCasteSearch(e.target.value)}
                style={{ width: '250px' }}
              />
            </div>

            <AdminTable headers={['Label', 'Search Aliases', 'Status', 'Actions']}>
              {filteredCastes.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                    No Caste options found matching search.
                  </td>
                </tr>
              ) : (
                filteredCastes.map((opt) => (
                  <tr key={opt.id} style={{ opacity: opt.isDisabled ? 0.6 : 1 }}>
                    <td style={{ fontWeight: 600, color: '#0f172a' }}>{opt.label}</td>
                    <td>
                      {opt.aliases && opt.aliases.length > 0 ? (
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {opt.aliases.map((a: string) => (
                            <span key={a} style={{ display: 'inline-block', padding: '2px 8px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '11px', color: '#475569' }}>
                              {a}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <em style={{ fontSize: '12px', color: '#94a3b8' }}>None</em>
                      )}
                    </td>
                    <td>
                      <AdminBadge status={opt.isDisabled ? 'REJECTED' : 'APPROVED'}>
                        {opt.isDisabled ? 'Disabled' : 'Active'}
                      </AdminBadge>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <AdminButton
                          variant="secondary"
                          onClick={() => startEditCaste(opt)}
                          style={{ padding: '4px 8px', fontSize: '11px' }}
                        >
                          Edit
                        </AdminButton>
                        <AdminButton
                          variant={opt.isDisabled ? 'primary' : 'danger'}
                          onClick={() => handleToggleDisableCaste(opt.id, opt.isDisabled)}
                          style={{ padding: '4px 8px', fontSize: '11px', minWidth: '70px' }}
                        >
                          {opt.isDisabled ? 'Enable' : 'Disable'}
                        </AdminButton>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </AdminTable>
          </AdminCard>
        </div>
      )}

      {/* TAB 3: Locations */}
      {activeTab === 'location' && !isLoading && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          {/* Add Section */}
          <AdminCard>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>
              ➕ Add New Location (Hierarchical)
            </h3>
            <form onSubmit={handleLocationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="admin-label">State (Level 1) *</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={locState}
                    onChange={(e) => setLocState(e.target.value)}
                    placeholder="e.g. Uttar Pradesh"
                    required
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label className="admin-label">District/City (Level 2) *</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={locDistrict}
                    onChange={(e) => setLocDistrict(e.target.value)}
                    placeholder="e.g. Lucknow"
                    required
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label className="admin-label">Locality/Area (Level 3 - Optional)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={locLocality}
                    onChange={(e) => setLocLocality(e.target.value)}
                    placeholder="e.g. Hazratganj"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <input
                  type="checkbox"
                  id="locIsHighPriority"
                  checked={locIsHighPriority}
                  onChange={(e) => setLocIsHighPriority(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary-brand)' }}
                />
                <label htmlFor="locIsHighPriority" style={{ fontSize: '13px', color: '#334155', fontWeight: 500, cursor: 'pointer' }}>
                  Mark as High-Priority Location (Renders at the top of search filters)
                </label>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <AdminButton type="submit">
                  Add Location Option
                </AdminButton>
              </div>
            </form>
          </AdminCard>

          {/* List Section */}
          <AdminCard style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: 0 }}>
                Active Locations Options ({filteredLocations.length})
              </h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <select
                  className="admin-input"
                  value={locationStateFilter}
                  onChange={(e) => setLocationStateFilter(e.target.value)}
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
                  className="admin-input"
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  style={{ width: '200px' }}
                />
              </div>
            </div>

            <AdminTable headers={['State (L1)', 'District (L2)', 'Locality (L3)', 'Priority', 'Status', 'Actions']}>
              {filteredLocations.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                    No Location options found matching filters.
                  </td>
                </tr>
              ) : (
                filteredLocations.map((opt) => (
                  <tr key={opt.id} style={{ opacity: opt.isDisabled ? 0.6 : 1 }}>
                    <td style={{ color: '#475569' }}>{opt.state}</td>
                    <td style={{ fontWeight: 600, color: '#0f172a' }}>{opt.district}</td>
                    <td>{opt.locality || <span style={{ color: '#94a3b8', fontSize: '12px', fontStyle: 'italic' }}>All District</span>}</td>
                    <td>
                      <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, background: opt.isHighPriority ? '#fef3c7' : '#f1f5f9', color: opt.isHighPriority ? '#d97706' : '#64748b' }}>
                        {opt.isHighPriority ? '⭐ Priority' : 'Normal'}
                      </span>
                    </td>
                    <td>
                      <AdminBadge status={opt.isDisabled ? 'REJECTED' : 'APPROVED'}>
                        {opt.isDisabled ? 'Disabled' : 'Active'}
                      </AdminBadge>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <AdminButton
                          variant="ghost"
                          onClick={() => handleToggleLocationPriority(opt.id, opt.isHighPriority)}
                          style={{ padding: '4px 8px', fontSize: '11px', color: '#d97706' }}
                        >
                          ⭐ Toggle
                        </AdminButton>
                        <AdminButton
                          variant={opt.isDisabled ? 'primary' : 'danger'}
                          onClick={() => handleToggleDisableLocation(opt.id, opt.isDisabled)}
                          style={{ padding: '4px 8px', fontSize: '11px', minWidth: '70px' }}
                        >
                          {opt.isDisabled ? 'Enable' : 'Disable'}
                        </AdminButton>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </AdminTable>
          </AdminCard>
        </div>
      )}

      {/* TAB 4: Merges & Deduplication */}
      {activeTab === 'merge' && !isLoading && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Caste Merge Card */}
          <AdminCard>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🔄 Merge Duplicate Castes
            </h3>
            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '24px', lineHeight: 1.5 }}>
              Replaces all occurrences of the duplicate caste in profiles with the target caste. Adds the duplicate as an alias of the target and disables the duplicate.
            </p>

            <form onSubmit={handleMergeCastes} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="admin-label">Select Duplicate Caste (Source to merge out)</label>
                <select
                  className="admin-input"
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
                <label className="admin-label">Select Correct Caste (Target to keep)</label>
                <select
                  className="admin-input"
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

              <div style={{ padding: '12px', borderRadius: '6px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', fontSize: '13px', color: '#991b1b', marginTop: '8px' }}>
                <strong>⚠️ Warning:</strong> This operation is permanent. Profile updates occur immediately.
              </div>

              <AdminButton type="submit" variant="danger" style={{ width: '100%', marginTop: '8px' }}>
                Merge and Update Castes
              </AdminButton>
            </form>
          </AdminCard>

          {/* Location Merge Card */}
          <AdminCard>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🔄 Merge Duplicate Locations
            </h3>
            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '24px', lineHeight: 1.5 }}>
              Replaces the State/District/Locality structure in matching profiles, disables the duplicate location entry, and safeguards profile search continuity.
            </p>

            <form onSubmit={handleMergeLocations} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="admin-label">Select Duplicate Location (Source to merge out)</label>
                <select
                  className="admin-input"
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
                <label className="admin-label">Select Correct Location (Target to keep)</label>
                <select
                  className="admin-input"
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

              <div style={{ padding: '12px', borderRadius: '6px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', fontSize: '13px', color: '#991b1b', marginTop: '8px' }}>
                <strong>⚠️ Warning:</strong> Profiles matching the source location will have their fields updated to target location coordinates immediately.
              </div>

              <AdminButton type="submit" variant="danger" style={{ width: '100%', marginTop: '8px' }}>
                Merge and Update Locations
              </AdminButton>
            </form>
          </AdminCard>
        </div>
      )}
    </div>
  );
}
