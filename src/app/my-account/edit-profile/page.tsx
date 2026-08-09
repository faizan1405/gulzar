'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import { SectionHeading, PremiumFooter } from '@/components/NikahComponents';
import { useSession } from '@/context/SessionContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { calculateProfileCompletion, type CompletionSection } from '@/lib/profileStore';
import type { Profile } from '@/types';

type SectionKey = 'personal' | 'location' | 'education' | 'career' | 'lifestyle' | 'family' | 'partner';

interface SectionDef {
  key: SectionKey;
  label: string;
  icon: string;
}

const SECTIONS: SectionDef[] = [
  { key: 'personal', label: 'Personal Details', icon: '👤' },
  { key: 'location', label: 'Location', icon: '📍' },
  { key: 'education', label: 'Education', icon: '🎓' },
  { key: 'career', label: 'Career', icon: '💼' },
  { key: 'lifestyle', label: 'Lifestyle', icon: '🌿' },
  { key: 'family', label: 'Family', icon: '👨‍👩‍👧' },
  { key: 'partner', label: 'Partner Preferences', icon: '💞' },
];

function EditProfileInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn, authChecked, userProfile, setUserProfile } = useSession();

  const [activeTab, setActiveTab] = useState<SectionKey>('personal');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [completion, setCompletion] = useState<{ percent: number; sections: CompletionSection[] }>({ percent: 0, sections: [] });

  const isEditMode = searchParams.get('edit') === 'true';

  // Load profile
  useEffect(() => {
    if (!authChecked) return;
    if (!isLoggedIn) {
      router.push('/');
      return;
    }
    if (!userProfile) {
      router.push('/register');
      return;
    }
    setProfile(userProfile);
    setCompletion(calculateProfileCompletion(userProfile as unknown as Record<string, unknown>));
    setLoading(false);
  }, [authChecked, isLoggedIn, userProfile, router]);

  const handleChange = useCallback((field: keyof Profile, value: string | number | boolean | string[] | null) => {
    setProfile((prev) => (prev ? { ...prev, [field]: value } : null));
    setError('');
    setSuccess('');
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save profile.');
      }
      setCompletion(data.completion || { percent: 0, sections: [] });
      setSuccess('Profile updated successfully!');
      if (data.profile && setUserProfile) {
        setUserProfile(data.profile as Profile);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex-grow flex items-center justify-center min-h-[50vh]">
          <p style={{ color: 'var(--text-muted)' }}>Loading profile…</p>
        </main>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Navbar />
        <main className="flex-grow flex items-center justify-center min-h-[50vh]">
          <p>No profile found.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow" style={{ paddingBottom: '80px' }}>
        <div className="container font-sans" style={{ maxWidth: '900px', padding: '40px 16px' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--deep-maroon)', fontSize: '28px', fontWeight: 'bold' }}>
              {isEditMode ? 'Edit Profile' : 'Complete Your Profile'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px' }}>
              Fill in as much as you like — all fields except the basics are optional.
            </p>
          </div>

          {/* Completion meter */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px 24px',
            boxShadow: 'var(--shadow-card)',
            border: '1px solid var(--border-color)',
            marginBottom: '24px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontWeight: 600, color: 'var(--primary-dark)' }}>Profile Completion</span>
              <span style={{ fontWeight: 'bold', color: completion.percent >= 80 ? '#16a34a' : '#d97706', fontSize: '18px' }}>
                {completion.percent}%
              </span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                width: `${completion.percent}%`,
                height: '100%',
                borderRadius: '4px',
                backgroundColor: completion.percent >= 80 ? '#16a34a' : '#d97706',
                transition: 'width 0.3s ease',
              }} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
              {completion.sections.map((s) => (
                <span
                  key={s.key}
                  title={s.label}
                  style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 500,
                    backgroundColor: s.complete ? '#dcfce7' : '#fef3c7',
                    color: s.complete ? '#15803d' : '#92400e',
                  }}
                >
                  {s.complete ? '✓' : '○'} {s.label}
                </span>
              ))}
            </div>
          </div>

          {/* Section tabs */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            marginBottom: '24px',
            justifyContent: 'center',
          }}>
            {SECTIONS.map((sec) => {
              const comp = completion.sections.find((s) => s.key === sec.key);
              const done = comp?.complete;
              return (
                <button
                  key={sec.key}
                  onClick={() => setActiveTab(sec.key)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1.5px solid',
                    borderColor: activeTab === sec.key ? 'var(--primary-brand)' : done ? '#bbf7d0' : '#e5e7eb',
                    backgroundColor: activeTab === sec.key ? 'var(--primary-brand)' : done ? '#f0fdf4' : 'white',
                    color: activeTab === sec.key ? 'white' : done ? '#15803d' : 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: activeTab === sec.key ? 600 : 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>{sec.icon}</span>
                  <span>{sec.label}</span>
                  {done && <span style={{ fontSize: '11px' }}>✓</span>}
                </button>
              );
            })}
          </div>

          {/* Error / success */}
          {error && (
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fca5a5',
              borderRadius: '8px',
              color: '#991b1b',
              marginBottom: '16px',
            }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#f0fdf4',
              border: '1px solid #86efac',
              borderRadius: '8px',
              color: '#15803d',
              marginBottom: '16px',
            }}>
              {success}
            </div>
          )}

          {/* Form */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: 'var(--shadow-card)',
            border: '1px solid var(--border-color)',
          }}>

            {/* PERSONAL */}
            {activeTab === 'personal' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ color: 'var(--deep-maroon)', fontSize: '18px', marginBottom: '4px' }}>👤 Personal Details</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Field label="Full Name" required value={profile.fullName} onChange={(v) => handleChange('fullName', v)} />
                  <Field label="Gender" required value={profile.gender} onChange={(v) => handleChange('gender', v)} type="select" options={['Male','Female']} />
                  <Field label="Date of Birth" required value={profile.dateOfBirth instanceof Date ? profile.dateOfBirth.toISOString().slice(0,10) : (profile.dateOfBirth as string).slice(0,10)} onChange={(v) => handleChange('dateOfBirth', v)} type="date" />
                  <Field label="Marital Status" required value={profile.maritalStatus} onChange={(v) => handleChange('maritalStatus', v)} type="select" options={['Single','Divorced','Widowed']} />
                  <Field label="Height" value={profile.height ?? ''} onChange={(v) => handleChange('height', v)} placeholder="e.g. 5'7&quot;" />
                  <Field label="Mother Tongue" value={profile.motherTongue ?? ''} onChange={(v) => handleChange('motherTongue', v)} placeholder="e.g. Hindi, Urdu" />
                  <Field label="Languages (comma-separated)" value={profile.languages?.join(', ') ?? ''} onChange={(v) => handleChange('languages', typeof v === 'string' ? v.split(',').map(s => s.trim()).filter(Boolean) : v)} placeholder="e.g. Hindi, English, Urdu" />
                </div>
                <Field label="About Me" value={profile.aboutMe ?? ''} onChange={(v) => handleChange('aboutMe', v)} type="textarea" rows={3} placeholder="A few words about yourself…" />
              </div>
            )}

            {/* LOCATION */}
            {activeTab === 'location' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ color: 'var(--deep-maroon)', fontSize: '18px', marginBottom: '4px' }}>📍 Location</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Field label="Country" required value={profile.country ?? ''} onChange={(v) => handleChange('country', v)} placeholder="India" />
                  <Field label="State" required value={profile.state ?? ''} onChange={(v) => handleChange('state', v)} placeholder="Maharashtra" />
                  <Field label="City / District" required value={profile.city ?? ''} onChange={(v) => handleChange('city', v)} placeholder="Mumbai" />
                  <Field label="Area / Locality" value={profile.areaOrLocality ?? ''} onChange={(v) => handleChange('areaOrLocality', v)} placeholder="Andheri West" />
                  <Field label="Native Place" value={profile.nativePlace ?? ''} onChange={(v) => handleChange('nativePlace', v)} placeholder="e.g. Lucknow" />
                  <Field label="Current Location" value={profile.currentLocation ?? ''} onChange={(v) => handleChange('currentLocation', v)} placeholder="Where you currently reside" />
                </div>
              </div>
            )}

            {/* EDUCATION */}
            {activeTab === 'education' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ color: 'var(--deep-maroon)', fontSize: '18px', marginBottom: '4px' }}>🎓 Education</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Field label="Education" required value={profile.education ?? ''} onChange={(v) => handleChange('education', v)} placeholder="e.g. B.Tech, MBBS" />
                  <Field label="Highest Qualification" value={profile.highestQualification ?? ''} onChange={(v) => handleChange('highestQualification', v)} placeholder="e.g. Master's Degree" />
                  <Field label="Degree" value={profile.degree ?? ''} onChange={(v) => handleChange('degree', v)} placeholder="e.g. B.E. Computer Science" />
                  <Field label="College / University" value={profile.college ?? ''} onChange={(v) => handleChange('college', v)} placeholder="e.g. IIT Bombay" />
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Field label="Certifications" value={profile.certifications ?? ''} onChange={(v) => handleChange('certifications', v)} placeholder="e.g. PMP, CFA (comma-separated)" />
                  </div>
                </div>
              </div>
            )}

            {/* CAREER */}
            {activeTab === 'career' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ color: 'var(--deep-maroon)', fontSize: '18px', marginBottom: '4px' }}>💼 Career</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Field label="Occupation" required value={profile.occupation ?? ''} onChange={(v) => handleChange('occupation', v)} placeholder="e.g. Software Engineer" />
                  <Field label="Job Title" value={profile.jobTitle ?? ''} onChange={(v) => handleChange('jobTitle', v)} placeholder="e.g. Senior Manager" />
                  <Field label="Company" value={profile.company ?? ''} onChange={(v) => handleChange('company', v)} placeholder="e.g. Tata Consultancy Services" />
                  <Field label="Industry" value={profile.industry ?? ''} onChange={(v) => handleChange('industry', v)} placeholder="e.g. IT, Healthcare" />
                  <Field label="Work Location" value={profile.workLocation ?? ''} onChange={(v) => handleChange('workLocation', v)} placeholder="e.g. Mumbai" />
                  <Field label="Employment Type" value={profile.employmentType ?? ''} onChange={(v) => handleChange('employmentType', v)} placeholder="e.g. Full-time, Self-employed" />
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Field label="Career Details" value={profile.careerDetails ?? ''} onChange={(v) => handleChange('careerDetails', v)} type="textarea" rows={2} placeholder="Brief about your career journey…" />
                  </div>
                </div>
              </div>
            )}

            {/* LIFESTYLE */}
            {activeTab === 'lifestyle' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ color: 'var(--deep-maroon)', fontSize: '18px', marginBottom: '4px' }}>🌿 Lifestyle</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Field label="Food Preference" value={profile.foodPreference ?? ''} onChange={(v) => handleChange('foodPreference', v)} placeholder="e.g. Vegetarian" />
                  <Field label="Smoking" value={profile.smoking ?? ''} onChange={(v) => handleChange('smoking', v)} placeholder="Never / Occasionally / Regularly" />
                  <Field label="Drinking" value={profile.drinking ?? ''} onChange={(v) => handleChange('drinking', v)} placeholder="Never / Occasionally / Regularly" />
                  <Field label="Hobbies (comma-separated)" value={profile.hobbies?.join(', ') ?? ''} onChange={(v) => handleChange('hobbies', typeof v === 'string' ? v.split(',').map(s => s.trim()).filter(Boolean) : v)} placeholder="e.g. Cricket, Reading, Cooking" />
                  <Field label="Interests" value={profile.interests ?? ''} onChange={(v) => handleChange('interests', v)} placeholder="e.g. Technology, Travel" />
                  <Field label="Sports" value={profile.sports ?? ''} onChange={(v) => handleChange('sports', v)} placeholder="e.g. Cricket, Football" />
                  <Field label="Fitness" value={profile.fitness ?? ''} onChange={(v) => handleChange('fitness', v)} placeholder="e.g. Gym, Yoga" />
                  <Field label="Travel" value={profile.travel ?? ''} onChange={(v) => handleChange('travel', v)} placeholder="e.g. Love to travel" />
                </div>
              </div>
            )}

            {/* FAMILY */}
            {activeTab === 'family' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ color: 'var(--deep-maroon)', fontSize: '18px', marginBottom: '4px' }}>👨‍👩‍👧 Family</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Field label="Father's Occupation" value={profile.fatherOccupation ?? ''} onChange={(v) => handleChange('fatherOccupation', v)} placeholder="e.g. Businessman" />
                  <Field label="Mother's Occupation" value={profile.motherOccupation ?? ''} onChange={(v) => handleChange('motherOccupation', v)} placeholder="e.g. Homemaker" />
                  <Field label="Siblings" value={profile.siblings ?? ''} onChange={(v) => handleChange('siblings', v)} placeholder="e.g. 1 Brother, 1 Sister" />
                  <Field label="Family Type" value={profile.familyType ?? ''} onChange={(v) => handleChange('familyType', v)} placeholder="e.g. Joint, Nuclear" />
                  <Field label="Family Values" value={profile.familyValues ?? ''} onChange={(v) => handleChange('familyValues', v)} placeholder="e.g. Traditional, Moderate" />
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Field label="Family Background" value={profile.familyBackground ?? ''} onChange={(v) => handleChange('familyBackground', v)} type="textarea" rows={2} placeholder="Brief about your family…" />
                  </div>
                </div>
              </div>
            )}

            {/* PARTNER */}
            {activeTab === 'partner' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ color: 'var(--deep-maroon)', fontSize: '18px', marginBottom: '4px' }}>💞 Partner Preferences</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Field label="Preferred Age (min)" type="number" value={profile.partnerAgeMin ?? ''} onChange={(v) => handleChange('partnerAgeMin', v ? Number(v) : null)} placeholder="e.g. 25" />
                  <Field label="Preferred Age (max)" type="number" value={profile.partnerAgeMax ?? ''} onChange={(v) => handleChange('partnerAgeMax', v ? Number(v) : null)} placeholder="e.g. 32" />
                  <Field label="Preferred Height (min)" value={profile.partnerHeightMin ?? ''} onChange={(v) => handleChange('partnerHeightMin', v)} placeholder="e.g. 5'3&quot;" />
                  <Field label="Preferred Height (max)" value={profile.partnerHeightMax ?? ''} onChange={(v) => handleChange('partnerHeightMax', v)} placeholder="e.g. 5'10&quot;" />
                  <Field label="Preferred Location(s)" value={profile.partnerPreferredLocations?.join(', ') ?? ''} onChange={(v) => handleChange('partnerPreferredLocations', typeof v === 'string' ? v.split(',').map(s => s.trim()).filter(Boolean) : v)} placeholder="e.g. Mumbai, Delhi" />
                  <Field label="Education Preference" value={profile.partnerEducationPref ?? ''} onChange={(v) => handleChange('partnerEducationPref', v)} placeholder="e.g. Graduate" />
                  <Field label="Profession Preference" value={profile.partnerProfessionPref ?? ''} onChange={(v) => handleChange('partnerProfessionPref', v)} placeholder="e.g. Doctor, Engineer" />
                  <Field label="Community / Biradari Preference" value={profile.partnerBiradariPref ?? ''} onChange={(v) => handleChange('partnerBiradariPref', v)} placeholder="e.g. Sunni Muslim" />
                  <Field label="Marital Status Preference" value={profile.partnerMaritalStatusPref ?? ''} onChange={(v) => handleChange('partnerMaritalStatusPref', v)} placeholder="e.g. Never Married" />
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Field label="Lifestyle Preferences" value={profile.partnerLifestylePref ?? ''} onChange={(v) => handleChange('partnerLifestylePref', v)} placeholder="e.g. Vegetarian, Non-smoker" />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Field label="Partner Expectations" value={profile.partnerExpectations ?? ''} onChange={(v) => handleChange('partnerExpectations', v)} type="textarea" rows={3} placeholder="Describe what you're looking for…" />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Field label="Other Preferences" value={profile.partnerOtherPrefs ?? ''} onChange={(v) => handleChange('partnerOtherPrefs', v)} type="textarea" rows={2} placeholder="Anything else…" />
                  </div>
                </div>
              </div>
            )}

            {/* Save */}
            <div style={{
              marginTop: '32px',
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
              flexWrap: 'wrap',
            }}>
              <button
                type="button"
                onClick={() => router.back()}
                className="btn btn-secondary"
                style={{ padding: '12px 24px' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="btn btn-primary"
                style={{ padding: '12px 32px', minWidth: '140px' }}
              >
                {saving ? 'Saving…' : 'Save Profile'}
              </button>
            </div>
          </div>
        </div>
      </main>
      <PremiumFooter onNavigate={(v) => router.push(`/${v === 'home' ? '' : v}`)} />
    </>
  );
}

export default function EditProfilePage() {
  return (
    <Suspense fallback={
      <>
        <Navbar />
        <main className="flex-grow flex items-center justify-center min-h-[50vh]">
          <p style={{ color: 'var(--text-muted)' }}>Loading…</p>
        </main>
      </>
    }>
      <EditProfileInner />
    </Suspense>
  );
}

/* ------------------------------------------------------------------ */
/*  Reusable field component                                          */
/* ------------------------------------------------------------------ */
function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
  placeholder,
  options,
  rows,
}: {
  label: string;
  value: string | number | string[];
  onChange: (v: string | number | string[]) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  rows?: number;
}) {
  const displayValue = Array.isArray(value) ? value.join(', ') : String(value ?? '');

  const handleChange = (raw: string) => {
    if (type === 'number') {
      onChange(raw === '' ? '' : Number(raw));
    } else if (type === 'select' && options) {
      onChange(raw);
    } else {
      onChange(raw);
    }
  };

  return (
    <div className="form-group">
      <label className="form-label">
        {label}{required ? ' *' : ''}
      </label>
      {type === 'select' && options ? (
        <select
          className="form-control"
          value={displayValue}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          className="form-control"
          value={displayValue}
          onChange={(e) => onChange(e.target.value)}
          rows={rows || 3}
          placeholder={placeholder}
          style={{ resize: 'vertical', minHeight: '80px' }}
        />
      ) : type === 'date' ? (
        <input
          type="date"
          className="form-control"
          value={displayValue}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : type === 'number' ? (
        <input
          type="number"
          className="form-control"
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          placeholder={placeholder}
        />
      ) : (
        <input
          type="text"
          className="form-control"
          value={displayValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
