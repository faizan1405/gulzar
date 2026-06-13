'use client';

import React, { useState, useEffect, useRef } from 'react';

interface ComboboxOption {
  value: string;
  label: string;
  aliases?: string[];
  isHighPriority?: boolean;
  isDisabled?: boolean;
}

interface SearchableComboboxProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  options: ComboboxOption[];
  allowCustom?: boolean;
  required?: boolean;
}

export const SearchableCombobox: React.FC<SearchableComboboxProps> = ({
  label,
  placeholder,
  value,
  onChange,
  options,
  allowCustom = true,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync internal search with external value when value changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearch(value);
  }, [value]);

  // Close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        // If search doesn't match any option and custom is allowed, save the search text.
        // Otherwise, reset to the current selected value.
        const matches = options.some(opt => opt.label.toLowerCase() === search.toLowerCase());
        if (!matches && search.trim()) {
          if (allowCustom) {
            onChange(search);
          } else {
            setSearch(value);
          }
        } else if (!search.trim()) {
          onChange('');
        }
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [search, options, value, allowCustom, onChange]);

  // Filter options based on search query, including aliases
  const activeOptions = options.filter(opt => !opt.isDisabled);
  const filtered = activeOptions.filter(opt => {
    const term = search.toLowerCase();
    const matchesLabel = opt.label.toLowerCase().includes(term);
    const matchesAlias = opt.aliases?.some(alias => alias.toLowerCase().includes(term));
    return matchesLabel || matchesAlias;
  });

  // Group high-priority (popular) options vs other options
  const popularOptions = filtered.filter(opt => opt.isHighPriority);
  const regularOptions = filtered.filter(opt => !opt.isHighPriority);

  const handleSelect = (val: string) => {
    onChange(val);
    setSearch(val);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setIsOpen(true);
  };

  return (
    <div className="form-group searchable-combobox-container" ref={containerRef} style={{ position: 'relative' }}>
      <label className="form-label">{label} {required && '*'}</label>
      <div className="input-dropdown-wrapper" style={{ position: 'relative' }}>
        <input
          type="text"
          className="form-control"
          placeholder={placeholder}
          value={search}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          required={required}
          style={{ width: '100%', paddingRight: '30px' }}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '12px',
            color: 'var(--gold-accent)'
          }}
        >
          ▼
        </button>
      </div>

      {isOpen && (
        <div
          className="combobox-dropdown"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: '#fff',
            border: '1.5px solid var(--gold-accent)',
            borderRadius: '8px',
            marginTop: '4px',
            maxHeight: '220px',
            overflowY: 'auto',
            zIndex: 9999,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          {popularOptions.length > 0 && (
            <div>
              <div style={{ padding: '6px 12px', fontSize: '11px', fontWeight: 'bold', color: 'var(--gold-accent)', backgroundColor: 'var(--warm-ivory)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                ⭐ Popular Options
              </div>
              {popularOptions.map(opt => (
                <div
                  key={opt.value}
                  onClick={() => handleSelect(opt.label)}
                  style={{ padding: '10px 16px', fontSize: '13.5px', cursor: 'pointer', borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}
                  className="combobox-item"
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--soft-cream)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          )}

          {regularOptions.length > 0 && (
            <div>
              {popularOptions.length > 0 && (
                <div style={{ padding: '6px 12px', fontSize: '11px', fontWeight: 'bold', color: 'var(--text-muted)', backgroundColor: '#fafafa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  All Options
                </div>
              )}
              {regularOptions.map(opt => (
                <div
                  key={opt.value}
                  onClick={() => handleSelect(opt.label)}
                  style={{ padding: '10px 16px', fontSize: '13.5px', cursor: 'pointer', borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}
                  className="combobox-item"
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--soft-cream)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          )}

          {allowCustom && search.trim() && !options.some(opt => opt.label.toLowerCase() === search.toLowerCase()) && (
            <div
              onClick={() => handleSelect(search)}
              style={{
                padding: '12px 16px',
                fontSize: '13px',
                fontStyle: 'italic',
                cursor: 'pointer',
                backgroundColor: 'rgba(212,163,89,0.08)',
                color: 'var(--deep-maroon)',
                fontWeight: 'bold',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--soft-cream)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(212,163,89,0.08)'}
            >
              ✍️ Not listed? Click to enter: &quot;{search}&quot;
            </div>
          )}

          {filtered.length === 0 && !search.trim() && (
            <div style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>
              No options available.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableCombobox;
