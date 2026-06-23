import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Color types matching schema & UI
import { Profile } from '../types';

// 1. Floral Corner Ornaments
export const FloralCorner: React.FC<{ position: 'tl' | 'tr' | 'bl' | 'br'; color?: string }> = ({
  position,
  color = 'var(--gold-accent)'
}) => {
  const rotationClass = {
    tl: '',
    tr: 'rotate-90',
    bl: '-rotate-90',
    br: 'rotate-180'
  }[position];

  return (
    <div className={`absolute p-0 pointer-events-none opacity-50 z-0 ${rotationClass}`} style={{
      top: position.startsWith('t') ? '10px' : 'auto',
      bottom: position.startsWith('b') ? '10px' : 'auto',
      left: position.endsWith('l') ? '10px' : 'auto',
      right: position.endsWith('r') ? '10px' : 'auto',
      transform: position === 'tr' ? 'rotate(90deg)' : position === 'bl' ? 'rotate(-90deg)' : position === 'br' ? 'rotate(180deg)' : 'none'
    }}>
      <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 10 C 30 10, 50 30, 50 50 C 30 50, 10 30, 10 10" fill="none" stroke={color} strokeWidth="2" />
        <path d="M10 10 C 10 30, 30 50, 50 50 C 50 30, 30 10, 10 10" fill="none" stroke={color} strokeWidth="2" />
        <circle cx="50" cy="50" r="5" fill={color} />
        <path d="M10 10 L 80 10" stroke={color} strokeWidth="1" strokeDasharray="3,3" />
        <path d="M10 10 L 10 80" stroke={color} strokeWidth="1" strokeDasharray="3,3" />
        <path d="M30 30 C 45 20, 60 45, 75 35" stroke={color} strokeWidth="1.5" fill="none" />
      </svg>
    </div>
  );
};

// 2. Gold Decorative Arch Wrapper
export const DecorativeArch: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`arch-container gold-rim gold-glow ${className}`}>
      {children}
    </div>
  );
};

// 3. Bismillah Calligraphy (SVG representation)
export const BismillahCalligraphy: React.FC = () => {
  return (
    <div className="flex justify-center my-6" aria-label="Bismillah-ir-Rahman-ir-Rahim calligraphy stamp" style={{ display: 'flex', justifyContent: 'center', width: '100%', margin: '24px 0' }}>
      <svg width="280" height="65" viewBox="0 0 300 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto" style={{ display: 'block', maxWidth: '100%', height: 'auto' }}>
        {/* Background elegant calligraphic shape */}
        <path d="M10 35 C 70 5, 230 5, 290 35 C 230 65, 70 65, 10 35 Z" fill="#F8F1E7" stroke="var(--gold-accent)" strokeWidth="0.75" />
        {/* Stylized high-quality Arabic Bismillah lettering paths */}
        <text x="50%" y="46" dominantBaseline="middle" textAnchor="middle" fill="var(--deep-maroon)" fontFamily="var(--font-arabic)" fontSize="32" fontWeight="bold">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </text>
        <path d="M80 50 Q 150 58 220 50" stroke="var(--gold-accent)" strokeWidth="1" fill="none" strokeDasharray="4,4" />
      </svg>
    </div>
  );
};

// 4. Gold Divider
export const GoldDivider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center my-8 ${className}`}>
      <div style={{ width: '80px', height: '1px', background: 'linear-gradient(90deg, transparent, var(--gold-accent))' }} />
      <span className="mx-3 text-gold-accent" style={{ fontSize: '16px', color: 'var(--gold-accent)' }}>❀</span>
      <div style={{ width: '80px', height: '1px', background: 'linear-gradient(270deg, transparent, var(--gold-accent))' }} />
    </div>
  );
};

// 5. Section Heading
export const SectionHeading: React.FC<{
  title: string;
  subtitle?: string;
  scriptText?: string;
  as?: 'h1' | 'h2';
}> = ({ title, subtitle, scriptText, as = 'h2' }) => {
  const HeadingTag = as;
  return (
    <div className="section-header text-center" style={{ maxWidth: '700px', margin: '0 auto 48px auto', textAlign: 'center' }}>
      {scriptText && (
        <span className="script-accent block mb-2" style={{ display: 'block', marginBottom: '8px' }}>
          {scriptText}
        </span>
      )}
      <HeadingTag style={{ fontFamily: 'var(--font-serif)', fontSize: '38px', color: 'var(--primary-brand)', fontWeight: 700, letterSpacing: '0.5px' }}>
        {title}
      </HeadingTag>
      {subtitle && (
        <p style={{ color: 'var(--text-muted)', fontSize: '15.5px', marginTop: '10px', fontFamily: 'var(--font-sans)' }}>
          {subtitle}
        </p>
      )}
      <GoldDivider />
    </div>
  );
};

// 6. Quran Verse Block
export const QuranVerseBlock: React.FC = () => {
  return (
    <div className="container" style={{ margin: '40px auto' }}>
      <div className="quran-verse-split gold-glow">
        <div className="quran-verse-image-panel">
          <Image
            src="/images/nikah-3.jpeg"
            alt="Elegant Islamic matrimonial - Rishte Forever"
            fill
            sizes="(max-width: 640px) 100vw, 380px"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            priority
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, transparent 60%, rgba(245,235,210,0.55) 100%)',
            pointerEvents: 'none',
          }} />
        </div>

        <div className="quran-verse-text-panel">
          <FloralCorner position="tr" />
          <FloralCorner position="br" />

          <div style={{ marginBottom: '18px' }}>
            <svg width="54" height="54" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto' }}>
              <path d="M50 85 C 10 50, 20 20, 50 35 C 80 20, 90 50, 50 85 Z" fill="none" stroke="var(--gold-accent)" strokeWidth="1.5" />
              <text x="50" y="52" dominantBaseline="middle" textAnchor="middle" fill="var(--deep-maroon)" fontFamily="var(--font-arabic)" fontSize="16" fontWeight="bold">
                زوج
              </text>
            </svg>
          </div>

          <div className="arabic-calligraphy" style={{ fontSize: '2.2rem', color: 'var(--deep-maroon)', lineHeight: 1.4, marginBottom: '14px' }}>
            وَخَلَقْنَاكُمْ أَزْوَاجًا
          </div>

          <div style={{ fontStyle: 'italic', fontSize: '17px', fontFamily: 'var(--font-serif)', color: 'var(--text-dark)', marginBottom: '10px' }}>
            &ldquo;And We created you in pairs&rdquo;
          </div>

          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--gold-accent)', fontWeight: 700 }}>
            — Al-Qur&apos;an 78:8
          </div>
        </div>
      </div>
    </div>
  );
};

// 7. Verified Badge
export const VerifiedBadge: React.FC = () => {
  return (
    <span className="card-badge card-badge-verified font-sans" style={{
      backgroundColor: 'var(--theme-accent, var(--primary-brand))',
      color: 'var(--white)',
      border: '1px solid var(--gold-light)',
      fontSize: '11px',
      fontWeight: 'bold',
      padding: '4px 10px',
      borderRadius: '20px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px'
    }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      Call Verified
    </span>
  );
};

// 8. Reusable Matrimonial Profile Card
interface ProfileCardProps {
  profile: Profile;
  index: number;
  isLoggedIn: boolean;
  hasPaid300: boolean;
  simulatedPackages: string[];
  simulatedHighProfileApproved: boolean;
  savedProfiles: string[];
  onToggleSave: (id: string) => void;
  onViewDetails: (profile: Profile) => void;
  onShowLogin: () => void;
  getProfileImage: (gender: string, index: number) => string;
  getThemeClass: (color: string) => string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  index,
  isLoggedIn,
  hasPaid300,
  simulatedPackages,
  simulatedHighProfileApproved,
  savedProfiles,
  onToggleSave,
  onViewDetails,
  onShowLogin,
  getProfileImage,
  getThemeClass
}) => {
  const profileCat = profile.category || '';
  const isLockedCategory = (profile as any).isLockedCategory || '';

  const isSecMarriage =
    profile.maritalStatus !== 'Single'
    || profileCat === 'second_marriage'
    || isLockedCategory === 'second_marriage_package';

  const isHighProf =
    profileCat === 'high_profile'
    || isLockedCategory === 'high_profile_package'
    || (!isLockedCategory && (
      profile.occupation.toLowerCase().includes('doctor') ||
      profile.occupation.toLowerCase().includes('engineer') ||
      profile.occupation.toLowerCase().includes('business') ||
      profile.occupation.toLowerCase().includes('professional') ||
      profile.annualIncomeRange.includes('₹10 LPA') ||
      profile.annualIncomeRange.includes('₹12 LPA') ||
      profile.annualIncomeRange.includes('₹15 LPA') ||
      profile.annualIncomeRange.includes('Above')
    ));

  const isGoodProfile = profileCat === 'good_profile' || isLockedCategory === 'good_profile_package';

  const hasPaidMonthly = hasPaid300 || simulatedPackages.includes('monthly_membership');
  const hasSecMarriageAccess = simulatedPackages.includes('second_marriage_package');
  const hasHighProfAccess = simulatedPackages.includes('high_profile_package') && simulatedHighProfileApproved;
  const hasGoodProfileAccess = simulatedPackages.includes('good_profile_package');

  // Photo visible only when logged in
  const photoVisible = isLoggedIn;

  // Contact phone shown only to paid members with unlocked category
  const contactVisible = hasPaidMonthly && !isLockedCategory;

  // Determine upgrade CTA
  let unlockCta = '';
  let showUpgradeCta = false;
  if (!isLoggedIn) {
    unlockCta = 'Sign In to View Full Profile';
    showUpgradeCta = true;
  } else if (isLockedCategory === 'good_profile_package' && !hasGoodProfileAccess) {
    unlockCta = 'Good Profile Package · ₹5,500';
    showUpgradeCta = true;
  } else if (isLockedCategory === 'second_marriage_package' && !hasSecMarriageAccess) {
    unlockCta = 'Second Marriage Package · ₹11,000';
    showUpgradeCta = true;
  } else if (isLockedCategory === 'high_profile_package' && !hasHighProfAccess) {
    unlockCta = 'High Profile Package · ₹21,000';
    showUpgradeCta = true;
  } else if (!hasPaidMonthly) {
    unlockCta = 'Monthly Membership · ₹300';
    showUpgradeCta = true;
  }

  const themeClass = getThemeClass(profile.themeColor);
  const isSaved = savedProfiles.includes(profile.id);

  // Dynamic age — gracefully handle locked proxy DOB (1900)
  const dobDate = profile.dateOfBirth ? new Date(profile.dateOfBirth) : null;
  const dobYear = dobDate ? dobDate.getFullYear() : 0;
  const isAgeHidden = dobYear <= 1905;
  let age: number | null = null;
  if (!isAgeHidden && dobDate) {
    const today = new Date();
    age = today.getFullYear() - dobDate.getFullYear();
    const m = today.getMonth() - dobDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) age--;
  }

  // Display name: show profile code when server has locked the name
  const isServerLocked =
    profile.fullName === 'Profile Locked'
    || profile.fullName.includes('(Locked)');
  const displayName = isLoggedIn && !isServerLocked
    ? profile.fullName
    : `Profile #RF-${String(index + 1).padStart(3, '0')}`;

  // Education/occupation: skip if server returned "Hidden ..."
  const educationHidden =
    !profile.education || profile.education.startsWith('Hidden (');
  const occupationHidden =
    !profile.occupation
    || profile.occupation === 'Hidden'
    || profile.occupation.startsWith('Hidden (');

  return (
    <article
      className={`profile-card ${themeClass}`}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--white)',
        borderRadius: '18px',
        boxShadow: '0 2px 12px rgba(111,29,53,0.06), 0 8px 32px rgba(111,29,53,0.04)',
        border: '1px solid rgba(184,146,74,0.14)',
        overflow: 'hidden',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        height: '100%',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = 'translateY(-4px)';
        el.style.boxShadow = '0 8px 32px rgba(111,29,53,0.12), 0 20px 48px rgba(111,29,53,0.08)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = '0 2px 12px rgba(111,29,53,0.06), 0 8px 32px rgba(111,29,53,0.04)';
      }}
    >
      {/* Accent top gradient bar */}
      <div style={{
        height: '4px',
        background: 'linear-gradient(90deg, var(--theme-accent) 0%, var(--gold-accent) 60%, var(--theme-accent) 100%)',
        flexShrink: 0,
      }} />

      {/* Photo / avatar section */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '200px',
        flexShrink: 0,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, var(--soft-cream) 0%, var(--warm-ivory) 40%, var(--gold-light) 100%)',
      }}>
        {photoVisible ? (
          <>
            <Image
              src={profile.profileImageUrl || getProfileImage(profile.gender, index)}
              alt={displayName}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              style={{ objectFit: 'cover', objectPosition: 'top center' }}
              priority={index < 6}
            />
            {/* Gradient at bottom for text legibility */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '60px',
              background: 'linear-gradient(to top, rgba(255,255,255,0.55), transparent)',
              pointerEvents: 'none',
            }} />
          </>
        ) : (
          <>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(155deg, rgba(111,29,53,0.05) 0%, rgba(184,146,74,0.07) 100%)',
            }} />
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}>
              <div style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--theme-accent) 0%, var(--gold-accent) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                boxShadow: '0 4px 20px rgba(111,29,53,0.2)',
                border: '3px solid rgba(255,255,255,0.85)',
              }}>
                {profile.gender?.toLowerCase() === 'female' ? '👩' : '👨'}
              </div>
              <span style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                letterSpacing: '0.6px',
                textTransform: 'uppercase',
                background: 'rgba(255,255,255,0.7)',
                padding: '3px 10px',
                borderRadius: '20px',
              }}>
                Photo Private
              </span>
            </div>
          </>
        )}

        {/* Category / verification badges — top left */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
          zIndex: 10,
        }}>
          {profile.verificationStatus === 'APPROVED' && (
            <span style={{
              background: '#059669',
              color: '#fff',
              fontSize: '11px',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '20px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 2px 8px rgba(5,150,105,0.35)',
              backdropFilter: 'blur(4px)',
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Call Verified
            </span>
          )}
          {isGoodProfile && (
            <span style={{
              background: 'linear-gradient(135deg,#2e7d32,#43a047)',
              color: '#fff',
              fontSize: '11px',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '20px',
              boxShadow: '0 2px 8px rgba(46,125,50,0.3)',
              backdropFilter: 'blur(4px)',
            }}>
              ✦ Good Profile
            </span>
          )}
          {isHighProf && (
            <span style={{
              background: 'linear-gradient(135deg,var(--antique-gold),#c8a052)',
              color: '#fff',
              fontSize: '11px',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '20px',
              boxShadow: '0 2px 8px rgba(184,146,74,0.35)',
              backdropFilter: 'blur(4px)',
            }}>
              ⭐ High Profile
            </span>
          )}
          {isSecMarriage && (
            <span style={{
              background: 'linear-gradient(135deg,var(--deep-maroon),#8b2252)',
              color: '#fff',
              fontSize: '11px',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '20px',
              boxShadow: '0 2px 8px rgba(111,29,53,0.3)',
              backdropFilter: 'blur(4px)',
            }}>
              ↺ Second Marriage
            </span>
          )}
          {isLockedCategory && (
            <span style={{
              background: 'rgba(20,20,20,0.72)',
              color: '#fff',
              fontSize: '11px',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '20px',
              backdropFilter: 'blur(6px)',
            }}>
              🔒 Package Required
            </span>
          )}
        </div>

        {/* Save / heart button — top right */}
        <button
          onClick={() => onToggleSave(profile.id)}
          aria-label={isSaved ? 'Remove from saved' : 'Save profile'}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 10,
            background: 'rgba(255,255,255,0.92)',
            border: '1px solid rgba(184,146,74,0.25)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '16px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(4px)',
            transition: 'transform 0.2s ease',
          }}
        >
          {isSaved ? '❤️' : '🤍'}
        </button>
      </div>

      {/* Profile info section */}
      <div style={{
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
      }}>
        {/* Name */}
        <h3 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '19px',
          fontWeight: 700,
          color: isServerLocked ? 'var(--text-muted)' : 'var(--deep-maroon)',
          marginBottom: '8px',
          letterSpacing: '-0.2px',
          lineHeight: 1.3,
        }}>
          {displayName}
        </h3>

        {/* Stats chips: age · gender · marital status */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '10px',
          flexWrap: 'wrap',
        }}>
          {age !== null && (
            <span style={{
              background: 'var(--soft-cream)',
              color: 'var(--text-dark)',
              fontSize: '12.5px',
              fontWeight: 600,
              padding: '3px 10px',
              borderRadius: '20px',
              border: '1px solid rgba(184,146,74,0.2)',
            }}>
              {age} yrs
            </span>
          )}
          {profile.gender && (
            <span style={{
              background: profile.gender.toLowerCase() === 'female' ? '#fce4ec' : '#e8f4fd',
              color: profile.gender.toLowerCase() === 'female' ? '#c2185b' : '#1565c0',
              fontSize: '12.5px',
              fontWeight: 600,
              padding: '3px 10px',
              borderRadius: '20px',
            }}>
              {profile.gender}
            </span>
          )}
          {profile.maritalStatus && (
            <span style={{
              color: 'var(--text-muted)',
              fontSize: '12.5px',
              fontWeight: 500,
            }}>
              · {profile.maritalStatus}
            </span>
          )}
        </div>

        {/* Location */}
        {(profile.city || profile.state) && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            marginBottom: '14px',
            color: 'var(--text-muted)',
            fontSize: '13px',
            fontWeight: 500,
          }}>
            <span style={{ color: 'var(--gold-accent)', fontSize: '14px' }}>📍</span>
            <span>{[profile.city, profile.state].filter(Boolean).join(', ')}</span>
          </div>
        )}

        {/* Thin gold divider */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg,transparent,rgba(184,146,74,0.22) 30%,rgba(184,146,74,0.22) 70%,transparent)',
          marginBottom: '14px',
        }} />

        {/* Profile attributes: education, occupation, community, caste */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '9px',
          marginBottom: '16px',
          flexGrow: 1,
        }}>
          {!educationHidden && profile.education && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'var(--text-dark)' }}>
              <span style={{ flexShrink: 0, lineHeight: 1.45 }}>🎓</span>
              <span style={{ fontWeight: 500, lineHeight: 1.45 }}>{profile.education}</span>
            </div>
          )}
          {!occupationHidden && profile.occupation && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'var(--text-dark)' }}>
              <span style={{ flexShrink: 0, lineHeight: 1.45 }}>💼</span>
              <span style={{ fontWeight: 500, lineHeight: 1.45 }}>{profile.occupation}</span>
            </div>
          )}
          {profile.maslak && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'var(--text-dark)' }}>
              <span style={{ flexShrink: 0, lineHeight: 1.45 }}>🕌</span>
              <span style={{ fontWeight: 500, lineHeight: 1.45 }}>{profile.maslak}</span>
            </div>
          )}
          {profile.biradari && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'var(--text-dark)' }}>
              <span style={{ flexShrink: 0, lineHeight: 1.45 }}>👪</span>
              <span style={{ fontWeight: 500, lineHeight: 1.45 }}>{profile.biradari}</span>
            </div>
          )}
        </div>

        {/* Divider before CTA */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg,transparent,rgba(184,146,74,0.22) 30%,rgba(184,146,74,0.22) 70%,transparent)',
          marginBottom: '14px',
        }} />

        {/* CTA area */}
        {showUpgradeCta ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {!isLoggedIn ? (
              <button
                onClick={onShowLogin}
                style={{
                  width: '100%',
                  padding: '12px 18px',
                  background: 'linear-gradient(135deg,var(--deep-maroon) 0%,#8b2252 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  letterSpacing: '0.2px',
                  boxShadow: '0 4px 16px rgba(111,29,53,0.25)',
                }}
              >
                🔒 Sign In to View Full Profile
              </button>
            ) : (
              <a
                href="#premium-pricing"
                style={{
                  display: 'block',
                  padding: '12px 18px',
                  background: 'linear-gradient(135deg,var(--antique-gold) 0%,#c8a052 100%)',
                  color: '#fff',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-sans)',
                  textAlign: 'center',
                  textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(184,146,74,0.3)',
                }}
              >
                🔓 {unlockCta}
              </a>
            )}
            <button
              onClick={() => onViewDetails(profile)}
              style={{
                width: '100%',
                padding: '10px 18px',
                background: 'transparent',
                color: 'var(--text-muted)',
                border: '1px solid rgba(184,146,74,0.3)',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
              }}
            >
              View Preview
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {contactVisible && profile.phoneNumber && profile.phoneNumber !== '+91-XXXXX-XXXXX' && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                color: 'var(--text-muted)',
                fontWeight: 500,
                padding: '6px 12px',
                background: 'var(--soft-cream)',
                borderRadius: '8px',
                border: '1px solid rgba(184,146,74,0.15)',
              }}>
                <span>📞</span>
                <span>{profile.phoneNumber}</span>
              </div>
            )}
            <button
              onClick={() => onViewDetails(profile)}
              style={{
                width: '100%',
                padding: '12px 18px',
                background: 'linear-gradient(135deg,var(--deep-maroon) 0%,#8b2252 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                letterSpacing: '0.2px',
                boxShadow: '0 4px 16px rgba(111,29,53,0.25)',
              }}
            >
              View Full Profile →
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

// 9. Premium Plan Card
interface PremiumPlanCardProps {
  title: string;
  price: number;
  gstRate: number;
  billingText: string;
  features: string[];
  isPopular?: boolean;
  isActive: boolean;
  onActivate: () => void;
  ctaText: string;
  onInquire?: () => void;
  whatsappMessage?: string;
}

export const PremiumPlanCard: React.FC<PremiumPlanCardProps> = ({
  title,
  price,
  gstRate,
  billingText,
  features,
  isPopular = false,
  isActive,
  onActivate,
  ctaText,
  onInquire,
  whatsappMessage
}) => {
  const gstAmount = Math.floor(price * gstRate);
  const totalAmount = price + gstAmount;

  return (
    <div className={`pkg-card ${isPopular ? 'pkg-card-popular' : ''}`} style={{
      backgroundColor: 'var(--white)',
      border: isPopular ? '2px solid var(--gold-accent)' : '1px solid var(--border-color)',
      borderRadius: 'var(--border-radius-xl)',
      padding: '48px 30px',
      textAlign: 'center',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: 'var(--shadow-premium)',
      transition: 'var(--transition-smooth)'
    }}>
      {isPopular && <div className="pkg-badge" style={{
        position: 'absolute',
        top: '-13px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'var(--gold-accent)',
        color: 'var(--white)',
        padding: '4px 16px',
        borderRadius: '20px',
        fontSize: '10.5px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.8px'
      }}>Recommended</div>}

      <FloralCorner position="tl" color="var(--gold-light)" />
      <FloralCorner position="tr" color="var(--gold-light)" />

      <h3 className="pkg-title" style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--primary-brand)', fontWeight: 700, marginBottom: '20px' }}>
        {title}
      </h3>
      
      <div className="pkg-price" style={{ fontSize: '38px', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '28px' }}>
        ₹{price.toLocaleString()}
        <span style={{ fontSize: '12px', fontWeight: 'normal', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
          + 18% GST (₹{gstAmount.toLocaleString()}) = <strong>₹{totalAmount.toLocaleString()}</strong> {billingText}
        </span>
      </div>

      <ul className="pkg-features" style={{ listStyle: 'none', textAlign: 'left', marginBottom: '36px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {features.map((feat, i) => (
          <li key={i} style={{ fontSize: '13.5px', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--gold-accent)', fontWeight: 'bold' }}>✓</span> {feat}
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={onActivate}
          className={`btn ${isPopular || isActive ? 'btn-gold' : 'btn-primary'}`}
          style={{ width: '100%' }}
          disabled={isActive}
        >
          {isActive ? 'Active Package' : ctaText}
        </button>
        {onInquire && !isActive && (
          <button
            onClick={onInquire}
            type="button"
            className="btn btn-secondary"
            style={{ width: '100%', fontSize: '12.5px', padding: '8px 12px' }}
          >
            Inquire & Request Callback
          </button>
        )}
        {whatsappMessage && !isActive && (
          <a
            href={`https://wa.me/919675483125?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{
              width: '100%',
              backgroundColor: '#25D366',
              color: '#ffffff',
              border: 'none',
              fontSize: '12.5px',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              textDecoration: 'none',
              borderRadius: 'var(--border-radius-lg)',
              transition: 'var(--transition-smooth)',
              fontWeight: 600
            }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M12.012 2c-5.506 0-9.97 4.478-9.97 10.012 0 1.77.458 3.43 1.258 4.887L2 22l5.253-1.378c1.402.766 3 1.2 4.759 1.2 5.506 0 9.97-4.478 9.97-10.012 0-5.534-4.464-10.012-9.97-10.012zm5.795 13.91c-.244.694-1.22 1.268-1.745 1.355-.472.079-.938.293-3.04-.542-2.527-.998-4.14-3.565-4.267-3.731-.127-.166-.991-1.32-.991-2.518 0-1.2.626-1.79.847-2.029.221-.24.479-.3.639-.3a.46.46 0 0 1 .332.155c.105.155.434 1.058.471 1.139.037.081.062.176.009.282-.053.106-.079.171-.157.262-.078.09-.166.2-.236.269-.079.078-.162.162-.07.32.092.158.411.678.88 1.096.604.538 1.111.704 1.267.782.157.078.249.066.342-.04.093-.106.402-.469.511-.627.109-.158.217-.132.366-.077.148.055.942.443 1.103.524.161.081.268.121.308.19.04.069.04.4-.204 1.094z" />
            </svg>
            Inquire on WhatsApp
          </a>
        )}
        <button
          onClick={() => {
            let path = '/premium';
            if (title.toLowerCase().includes('good')) path = '/packages/good-profiles';
            else if (title.toLowerCase().includes('second')) path = '/packages/second-marriage';
            else if (title.toLowerCase().includes('high')) path = '/packages/high-profile';
            
            const shareUrl = `${window.location.origin}${path}`;
            const shareText = `Check out the ${title} on Rishte Forever matrimonial site:`;
            if (navigator.share) {
              navigator.share({
                title: `Rishte Forever - ${title}`,
                text: shareText,
                url: shareUrl
              }).catch(() => {});
            } else {
              navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
              alert(`${title} link copied to clipboard!`);
            }
          }}
          type="button"
          className="btn btn-secondary"
          style={{
            width: '100%',
            fontSize: '12.5px',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            backgroundColor: 'var(--soft-cream)',
            border: '1px solid var(--gold-accent)',
            color: 'var(--deep-maroon)',
            fontWeight: 600,
            borderRadius: 'var(--border-radius-lg)',
            cursor: 'pointer',
            transition: 'var(--transition-smooth)'
          }}
        >
          <span>Share Package 🔗</span>
        </button>
      </div>
    </div>
  );
};


// 10. Success Story Card
interface SuccessStoryCardProps {
  names: string;
  location: string;
  story: string;
  weddingDate?: string;
  imageIndex: number;
}

export const SuccessStoryCard: React.FC<SuccessStoryCardProps> = ({
  names,
  location,
  story,
  weddingDate,
  imageIndex
}) => {
  // Original placeholder illustrations of couples
  const placeholderIllustration = [
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400&h=300',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=400&h=300',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=400&h=300'
  ][imageIndex % 3];

  return (
    <div className="testimonial-card" style={{
      backgroundColor: 'var(--white)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--border-radius-xl)',
      padding: '28px',
      boxShadow: 'var(--shadow-premium)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative'
    }}>
      <FloralCorner position="tl" color="var(--gold-light)" />
      <FloralCorner position="br" color="var(--gold-light)" />
      
      <div>
        <div style={{ position: 'relative', width: '100%', height: '180px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--gold-light)', marginBottom: '20px' }}>
          <Image src={placeholderIllustration} alt={`Matched Muslim couple success story - ${names} on Rishte Forever`} fill sizes="(max-width: 768px) 100vw, 300px" style={{ objectFit: 'cover' }} />
        </div>
        <p style={{ fontStyle: 'italic', fontSize: '14px', color: 'var(--text-dark)', lineHeight: '1.7', marginBottom: '20px', position: 'relative', zIndex: 2 }}>
          &ldquo;{story}&rdquo;
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '14px', marginTop: '14px' }}>
        <div className="testimonial-author" style={{ fontWeight: 'bold', color: 'var(--deep-maroon)', fontFamily: 'var(--font-serif)', fontSize: '15px' }}>
          {names}
          <div style={{ fontSize: '12px', fontWeight: 'normal', color: 'var(--text-muted)', marginTop: '2px' }}>
            {location} {weddingDate && `• Married ${weddingDate}`}
          </div>
        </div>
        <button
          onClick={() => {
            const shareText = `Read the beautiful matrimonial success story of ${names} on Rishte Forever!`;
            const shareUrl = `${window.location.origin}/success-stories`;
            if (navigator.share) {
              navigator.share({
                title: 'Rishte Forever Success Story',
                text: shareText,
                url: shareUrl
              }).catch(() => {});
            } else {
              navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
              alert('Success story link copied to clipboard!');
            }
          }}
          className="btn"
          style={{
            padding: '6px 12px',
            fontSize: '11.5px',
            backgroundColor: 'var(--soft-cream)',
            color: 'var(--deep-maroon)',
            border: '1px solid var(--gold-accent)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            transition: 'var(--transition-smooth)',
            fontWeight: 600
          }}
          title="Share Story"
        >
          <span>Share 🔗</span>
        </button>
      </div>
    </div>
  );
};

// 11. Safety Feature Card
interface SafetyFeatureCardProps {
  title: string;
  desc: string;
  icon: string;
}

export const SafetyFeatureCard: React.FC<SafetyFeatureCardProps> = ({ title, desc, icon }) => {
  return (
    <div className="safety-item" style={{
      display: 'flex',
      gap: '16px',
      alignItems: 'flex-start',
      backgroundColor: 'var(--warm-ivory)',
      padding: '24px',
      borderRadius: '16px',
      border: '1.5px solid var(--border-color)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="safety-icon" style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: 'var(--deep-maroon)',
        color: 'var(--white)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        flexShrink: 0,
        fontSize: '16px'
      }}>
        {icon}
      </div>
      <div className="safety-text">
        <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--deep-maroon)', fontWeight: 'bold', marginBottom: '6px' }}>
          {title}
        </h4>
        <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
          {desc}
        </p>
      </div>
    </div>
  );
};

// 12. Final CTA Block
interface FinalCTAProps {
  onRegister: () => void;
  onBrowse: () => void;
  isLoggedIn: boolean;
  hasProfile: boolean;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onRegister, onBrowse, isLoggedIn, hasProfile }) => {
  return (
    <section style={{ backgroundColor: 'var(--soft-cream)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '80px 0', position: 'relative' }}>
      <div className="container" style={{ position: 'relative', zIndex: 5 }}>
        <div className="arch-container max-w-4xl mx-auto text-center" style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 40px', textAlign: 'center' }}>
          <FloralCorner position="tl" color="var(--gold-accent)" />
          <FloralCorner position="tr" color="var(--gold-accent)" />
          <FloralCorner position="bl" color="var(--gold-accent)" />
          <FloralCorner position="br" color="var(--gold-accent)" />

          <span className="script-accent block mb-2" style={{ display: 'block', marginBottom: '12px' }}>Start Your Blessed Future</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', color: 'var(--deep-maroon)', fontWeight: 'bold', marginBottom: '20px' }}>
            Begin Your Journey Towards a Meaningful Nikah
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15.5px', maxWidth: '600px', margin: '0 auto 30px auto', lineHeight: '1.6' }}>
            Join a respectful, family-focused platform designed to help you discover compatible matches with manual telephone verification checks and complete privacy controls.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={onRegister} className="btn btn-gold" style={{ minWidth: '180px' }}>
              {isLoggedIn ? (hasProfile ? 'Edit Your Profile' : 'Complete Profile') : 'Register Free'}
            </button>
            <button onClick={onBrowse} className="btn btn-primary" style={{ minWidth: '180px' }}>
              Browse Profiles
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// 13. Premium Footer
interface PremiumFooterProps {
  onNavigate: (view: 'home' | 'browse' | 'how-it-works' | 'safety' | 'premium' | 'success-stories' | 'about' | 'contact') => void;
}

export const PremiumFooter: React.FC<PremiumFooterProps> = ({ onNavigate }) => {
  const [location, setLocation] = React.useState<{
    address: string;
    phone: string;
    phoneRaw: string;
    facebookUrl?: string;
    instagramUrl?: string;
    youtubeUrl?: string;
    linkedinUrl?: string;
    twitterUrl?: string;
  } | null>(null);

  React.useEffect(() => {
    fetch('/api/business-location')
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setLocation(data);
        }
      })
      .catch((err) => console.error('Error fetching location for footer:', err));
  }, []);

  return (
    <footer className="footer" style={{
      backgroundColor: 'var(--deep-maroon)',
      color: 'var(--warm-ivory)',
      padding: '80px 0 40px 0',
      borderTop: '4px solid var(--gold-accent)',
      position: 'relative'
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '40px' }}>
          <div>
            <div className="footer-logo" style={{ marginBottom: '18px', display: 'inline-block', background: 'var(--white)', padding: '12px 16px', borderRadius: '12px', boxShadow: '0 4px 14px rgba(0,0,0,0.25)' }}>
              <Image
                src="/images/rishte-forever-logo.png"
                alt="Rishte Forever — Where Faith Meets Forever"
                width={260}
                height={98}
                style={{ height: '60px', width: 'auto' }}
              />
            </div>
            <p style={{ fontSize: '13.5px', color: 'rgba(248, 241, 231, 0.8)', lineHeight: '1.8', marginBottom: '16px' }}>
              Trusted Halal Matrimony. Helping single, divorced, and high-profile Muslim candidates find compatible marriage partners.
            </p>
            {/* Social media icons grid inside footer */}
            {location && (location.facebookUrl || location.instagramUrl || location.youtubeUrl || location.linkedinUrl || location.twitterUrl) && (
              <div style={{ display: 'flex', gap: '14px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {location.facebookUrl && (
                  <a href={location.facebookUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-accent)', transition: 'var(--transition-smooth)', display: 'flex', alignItems: 'center' }} aria-label="Visit Rishte Forever on Facebook">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" style={{ display: 'block' }}>
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                    </svg>
                  </a>
                )}
                {location.instagramUrl && (
                  <a href={location.instagramUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-accent)', transition: 'var(--transition-smooth)', display: 'flex', alignItems: 'center' }} aria-label="Visit Rishte Forever on Instagram">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" style={{ display: 'block' }}>
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                    </svg>
                  </a>
                )}
                {location.youtubeUrl && (
                  <a href={location.youtubeUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-accent)', transition: 'var(--transition-smooth)', display: 'flex', alignItems: 'center' }} aria-label="Visit Rishte Forever on YouTube">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" style={{ display: 'block' }}>
                      <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11C4.483 20.455 12 20.455 12 20.455s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                )}
                {location.linkedinUrl && (
                  <a href={location.linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-accent)', transition: 'var(--transition-smooth)', display: 'flex', alignItems: 'center' }} aria-label="Visit Rishte Forever on LinkedIn">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" style={{ display: 'block' }}>
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                )}
                {location.twitterUrl && (
                  <a href={location.twitterUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-accent)', transition: 'var(--transition-smooth)', display: 'flex', alignItems: 'center' }} aria-label="Visit Rishte Forever on X">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" style={{ display: 'block' }}>
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                )}
              </div>
            )}
            <div style={{ fontSize: '13px', color: 'rgba(248, 241, 231, 0.9)', marginBottom: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div>📍 {location ? location.address : 'Innov8 44 Regal Building, 2nd Floor, Connaught Place, New Delhi - 110001'}</div>
              <div>📞 Call: <a href={`tel:${location ? location.phoneRaw : '+919675483125'}`} style={{ color: 'var(--gold-accent)', fontWeight: 'bold', textDecoration: 'underline' }}>{location ? location.phone : '+91 96754 83125'}</a></div>
            </div>
            {/* Dua closing phrase */}
            <div style={{ fontStyle: 'italic', fontSize: '12px', color: 'var(--gold-light)', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px' }}>
              May Allah bless your search and grant you a righteous life partner.
            </div>
          </div>
          <div>
            <h4 style={{ color: 'var(--gold-accent)', fontSize: '14px', fontWeight: 'bold', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Explore</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', padding: 0 }}>
              <li><button onClick={() => onNavigate('home')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', opacity: 0.8, padding: 0 }}>Home</button></li>
              <li><button onClick={() => onNavigate('browse')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', opacity: 0.8, padding: 0 }}>Browse Profiles</button></li>
              <li><button onClick={() => onNavigate('premium')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', opacity: 0.8, padding: 0 }}>Pricing & Packages</button></li>
              <li><button onClick={() => onNavigate('how-it-works')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', opacity: 0.8, padding: 0 }}>How It Works</button></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'var(--gold-accent)', fontSize: '14px', fontWeight: 'bold', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Safety & Support</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', padding: 0 }}>
              <li><Link href="/safety" className="footer-link">Verification & Safety</Link></li>
              <li><Link href="/success-stories" className="footer-link">Success Stories</Link></li>
              <li><Link href="/about" className="footer-link">About Us</Link></li>
              <li><Link href="/contact" className="footer-link">Contact Support</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '30px', marginTop: '50px', fontSize: '13px', color: 'rgba(248, 241, 231, 0.6)', textAlign: 'center' }}>
          &copy; 2026 Rishte Forever. All Rights Reserved. Created for premium internal launch preview.
        </div>
      </div>
    </footer>
  );
};
