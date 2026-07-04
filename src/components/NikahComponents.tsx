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
    <div className="bismillah-container font-sans" aria-label="Bismillah-ir-Rahman-ir-Rahim calligraphy stamp">
      {/* Hanging Lantern Left */}
      <div className="lantern-wrapper lantern-left">
        <svg width="40" height="150" viewBox="0 0 40 150" fill="none">
          <line x1="20" y1="0" x2="20" y2="70" stroke="var(--gold-accent)" strokeWidth="1" strokeDasharray="3,3" />
          <path d="M12 70 L20 62 L28 70 Z" fill="var(--gold-accent)" />
          <path d="M10 70 L30 70 L34 78 L6 78 Z" fill="var(--gold-accent)" />
          <path d="M6 78 L34 78 L28 112 L12 112 Z" fill="var(--warm-ivory)" stroke="var(--gold-accent)" strokeWidth="1.2" />
          <circle cx="20" cy="95" r="7" fill="var(--gold-light)" opacity="0.6" style={{ filter: 'blur(2px)' }} />
          <path d="M20 89 C19 93 20 98 20 98 C20 98 21 93 20 89 Z" fill="#EBC5C8" />
          <path d="M12 112 L28 112 L24 120 L16 120 Z" fill="var(--gold-accent)" />
          <circle cx="20" cy="124" r="2.5" stroke="var(--gold-accent)" strokeWidth="1.2" fill="none" />
          <path d="M20 126.5 L20 142" stroke="var(--gold-accent)" strokeWidth="1" />
        </svg>
      </div>

      {/* Central Calligraphy Block */}
      <div className="bismillah-content">
        {/* Top Crescent + Star Ornament */}
        <div className="bismillah-ornament-top" style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <svg width="48" height="24" viewBox="0 0 48 24" fill="none">
            {/* Crescent */}
            <path d="M21 4 A8 8 0 1 0 21 20 A6 6 0 1 1 21 4 Z" fill="#C9A227" />
            {/* Star */}
            <polygon points="33,6 34.6,9.4 38.3,9.7 35.4,12.1 36.4,15.7 33,13.7 29.6,15.7 30.6,12.1 27.7,9.7 31.4,9.4" fill="#C9A227" />
          </svg>
        </div>

        {/* Bismillah row: line+diamond | TEXT | diamond+line */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(10px, 3vw, 20px)',
          padding: '8px 0',
        }}>
          {/* soft gold glow behind text */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 45% 75% at 50% 50%, rgba(201,162,39,0.12), transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Left decoration */}
          <svg width="54" height="12" viewBox="0 0 54 12" fill="none" style={{ flexShrink: 0 }}>
            <line x1="0" y1="6" x2="40" y2="6" stroke="#C9A227" strokeWidth="1" />
            <polygon points="48,2 52,6 48,10 44,6" fill="#C9A227" />
          </svg>

          {/* Arabic text */}
          <span style={{
            position: 'relative',
            color: '#1B5E3A',
            fontFamily: 'var(--font-arabic)',
            fontSize: 'clamp(24px, 6vw, 36px)',
            fontWeight: 'bold',
            lineHeight: 1.5,
            whiteSpace: 'nowrap',
            direction: 'rtl',
          }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </span>

          {/* Right decoration */}
          <svg width="54" height="12" viewBox="0 0 54 12" fill="none" style={{ flexShrink: 0 }}>
            <polygon points="6,2 10,6 6,10 2,6" fill="#C9A227" />
            <line x1="14" y1="6" x2="54" y2="6" stroke="#C9A227" strokeWidth="1" />
          </svg>
        </div>

        {/* Bottom Gold Line with Center Accent */}
        <div className="bismillah-divider-bottom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '14px' }}>
          <svg width="40" height="15" viewBox="0 0 40 15" fill="none">
            <path d="M20,0 L24,7.5 L20,15 L16,7.5 Z" fill="#1B5E3A" stroke="#C9A227" strokeWidth="1" />
            <circle cx="20" cy="7.5" r="2" fill="#C9A227" />
            <line x1="0" y1="7.5" x2="12" y2="7.5" stroke="#C9A227" strokeWidth="1" />
            <line x1="28" y1="7.5" x2="40" y2="7.5" stroke="#C9A227" strokeWidth="1" />
          </svg>
        </div>
      </div>

      {/* Hanging Lantern Right */}
      <div className="lantern-wrapper lantern-right">
        <svg width="40" height="150" viewBox="0 0 40 150" fill="none">
          <line x1="20" y1="0" x2="20" y2="70" stroke="var(--gold-accent)" strokeWidth="1" strokeDasharray="3,3" />
          <path d="M12 70 L20 62 L28 70 Z" fill="var(--gold-accent)" />
          <path d="M10 70 L30 70 L34 78 L6 78 Z" fill="var(--gold-accent)" />
          <path d="M6 78 L34 78 L28 112 L12 112 Z" fill="var(--warm-ivory)" stroke="var(--gold-accent)" strokeWidth="1.2" />
          <circle cx="20" cy="95" r="7" fill="var(--gold-light)" opacity="0.6" style={{ filter: 'blur(2px)' }} />
          <path d="M20 89 C19 93 20 98 20 98 C20 98 21 93 20 89 Z" fill="#EBC5C8" />
          <path d="M12 112 L28 112 L24 120 L16 120 Z" fill="var(--gold-accent)" />
          <circle cx="20" cy="124" r="2.5" stroke="var(--gold-accent)" strokeWidth="1.2" fill="none" />
          <path d="M20 126.5 L20 142" stroke="var(--gold-accent)" strokeWidth="1" />
        </svg>
      </div>
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
        {/* Full-card background image */}
        <div className="quran-verse-image-panel">
          <Image
            src="/images/couple.png"
            alt="Elegant Islamic matrimonial - Rishte Forever"
            fill
            sizes="(max-width: 640px) 100vw, 900px"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            priority
          />
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
  isFormComplete: boolean;
  hasPaidSubscription: boolean;
  activePackages: string[];
  highProfileApproved: boolean;
  savedProfiles: string[];
  onToggleSave: (id: string) => void;
  onViewDetails: (profile: Profile) => void;
  onViewProfile: (profile: Profile) => void;
  onShowLogin: () => void;
  getProfileImage: (gender: string, index: number) => string;
  getThemeClass: (color: string) => string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  index,
  isLoggedIn,
  isFormComplete,
  hasPaidSubscription,
  activePackages,
  highProfileApproved,
  savedProfiles,
  onToggleSave,
  onViewDetails,
  onViewProfile,
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

  const hasPaidMonthly = hasPaidSubscription || activePackages.includes('monthly_membership');
  const hasSecMarriageAccess = activePackages.includes('second_marriage_package');
  const hasHighProfAccess = activePackages.includes('high_profile_package') && highProfileApproved;
  const hasGoodProfileAccess = activePackages.includes('good_profile_package');

  // Photo visible only when logged in
  const photoVisible = isLoggedIn;

  // Contact phone shown only to paid members with unlocked category
  const contactVisible = hasPaidMonthly && !isLockedCategory;

  // Determine upgrade CTA — ordered: login → form → package → category upgrade
  let unlockCta = '';
  let showUpgradeCta = false;
  if (!isLoggedIn) {
    unlockCta = 'View Profile';
    showUpgradeCta = true;
  } else if (!isFormComplete) {
    unlockCta = 'Complete Form & Unlock Profile';
    showUpgradeCta = true;
  } else if (!hasPaidMonthly) {
    unlockCta = 'Choose Package';
    showUpgradeCta = true;
  } else if (isLockedCategory === 'good_profile_package' && !hasGoodProfileAccess) {
    unlockCta = 'Good Profile Package · ₹1';
    showUpgradeCta = true;
  } else if (isLockedCategory === 'second_marriage_package' && !hasSecMarriageAccess) {
    unlockCta = 'Silver Plan · ₹1';
    showUpgradeCta = true;
  } else if (isLockedCategory === 'high_profile_package' && !hasHighProfAccess) {
    unlockCta = 'Gold Package · ₹1';
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
        borderRadius: 'var(--border-radius-xl)',
        boxShadow: 'var(--shadow-premium)',
        border: '1.5px solid rgba(184, 146, 74, 0.22)',
        overflow: 'hidden',
        transition: 'var(--transition-smooth)',
        height: '100%',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = 'translateY(-8px) scale(1.01)';
        el.style.boxShadow = 'var(--shadow-hover)';
        el.style.borderColor = 'var(--gold-accent)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = 'translateY(0) scale(1)';
        el.style.boxShadow = 'var(--shadow-premium)';
        el.style.borderColor = 'rgba(184, 146, 74, 0.22)';
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
              ⭐ Gold Package
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
              ↺ Silver Plan
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
          fontSize: '21px',
          fontWeight: 800,
          color: isServerLocked ? 'var(--text-muted)' : 'var(--deep-maroon)',
          marginBottom: '8px',
          letterSpacing: '-0.3px',
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
            <button
              onClick={() => onViewProfile(profile)}
              style={{
                width: '100%',
                padding: '12px 18px',
                background: isLoggedIn
                  ? 'linear-gradient(135deg,var(--antique-gold) 0%,#c8a052 100%)'
                  : 'linear-gradient(135deg,var(--deep-maroon) 0%,#8b2252 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                letterSpacing: '0.2px',
                boxShadow: isLoggedIn
                  ? '0 4px 16px rgba(184,146,74,0.3)'
                  : '0 4px 16px rgba(111,29,53,0.25)',
              }}
            >
              {isLoggedIn ? `🔓 ${unlockCta}` : `🔒 ${unlockCta}`}
            </button>
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
  imageUrl?: string;
  badgeText?: string;
  planTier?: 'basic' | 'silver' | 'gold' | 'membership';
  hidePrices?: boolean;
  isLoggedIn?: boolean;
  onCompleteForm?: () => void;
  onShowLogin?: () => void;
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
  whatsappMessage,
  imageUrl,
  badgeText,
  planTier,
  hidePrices = true,
  isLoggedIn = false,
  onCompleteForm,
  onShowLogin,
}) => {
  const finalBadge = badgeText || (isPopular ? 'Recommended' : undefined);
  const borderStyle = planTier === 'gold' 
    ? '2.5px solid var(--gold-accent)' 
    : planTier === 'silver'
      ? '1.5px solid var(--gold-accent)'
      : '1.5px solid var(--border-color)';
  
  const shadowStyle = planTier === 'gold'
    ? 'var(--gold-glow-shadow)'
    : 'var(--shadow-premium)';

  const badgeBg = planTier === 'gold'
    ? 'var(--gold-gradient)'
    : planTier === 'silver'
      ? 'linear-gradient(135deg, var(--deep-maroon), var(--gold-accent))'
      : 'var(--soft-cream)';

  const badgeColor = planTier === 'basic' || planTier === 'membership' || !planTier
    ? 'var(--deep-maroon)'
    : 'var(--white)';

  const badgeBorder = planTier === 'basic' || planTier === 'membership' || !planTier
    ? '1px solid var(--gold-accent)'
    : 'none';

  return (
    <div className={`pkg-card ${isPopular ? 'pkg-card-popular' : ''}`} style={{
      backgroundColor: 'var(--white)',
      border: borderStyle,
      borderRadius: 'var(--border-radius-xl)',
      padding: '48px 30px',
      textAlign: 'center',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: shadowStyle,
      transition: 'var(--transition-smooth)',
      overflow: 'hidden'
    }}>
      {finalBadge && <div className="pkg-badge" style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        left: 'auto',
        transform: 'none',
        background: badgeBg,
        color: badgeColor,
        border: badgeBorder,
        padding: '6px 14px',
        borderRadius: '30px',
        fontSize: '11px',
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '1px',
        zIndex: 10,
        boxShadow: planTier === 'gold' ? 'var(--gold-glow-shadow)' : 'none'
      }}>{finalBadge}</div>}

      {imageUrl && (
        <div style={{
          position: 'relative',
          width: 'calc(100% + 60px)',
          height: '180px',
          margin: '-48px -30px 24px -30px',
          overflow: 'hidden',
          borderBottom: '1.5px solid var(--gold-light)'
        }}>
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        </div>
      )}

      {!imageUrl && <FloralCorner position="tl" color="var(--gold-light)" />}
      {!imageUrl && <FloralCorner position="tr" color="var(--gold-light)" />}

      <h3 className="pkg-title" style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', color: 'var(--primary-brand)', fontWeight: 800, marginBottom: '20px' }}>
        {title}
      </h3>

      {hidePrices ? (
        <div style={{
          background: 'linear-gradient(135deg, rgba(111,29,53,0.06) 0%, rgba(184,146,74,0.06) 100%)',
          border: '1.5px dashed var(--gold-accent)',
          borderRadius: '12px',
          padding: '20px 16px',
          marginBottom: '28px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', fontFamily: 'var(--font-sans)' }}>
            Pricing available after
          </div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--deep-maroon)', fontFamily: 'var(--font-serif)' }}>
            Complete your profile to view pricing
          </div>
        </div>
      ) : (
        <div className="pkg-price" style={{ fontSize: '42px', fontWeight: '800', color: 'var(--deep-maroon)', marginBottom: '28px', fontFamily: 'var(--font-serif)' }}>
          ₹{price.toLocaleString()}
          {gstRate > 0 && (
            <span style={{ fontSize: '12.5px', fontWeight: 'normal', color: 'var(--text-muted)', display: 'block', marginTop: '6px', fontFamily: 'var(--font-sans)' }}>
              + GST
            </span>
          )}
        </div>
      )}

      <ul className="pkg-features" style={{ listStyle: 'none', textAlign: 'left', marginBottom: '36px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {features.map((feat, i) => (
          <li key={i} style={{ fontSize: '13.5px', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--gold-accent)', fontWeight: 'bold' }}>✓</span> {feat}
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {hidePrices ? (
          <button
            onClick={isLoggedIn ? onCompleteForm : (onShowLogin || onCompleteForm)}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            {isLoggedIn ? 'Complete Form to View Price' : 'Register & Complete Profile'}
          </button>
        ) : (
          <button
            onClick={onActivate}
            className={`btn ${isPopular || isActive ? 'btn-gold' : 'btn-primary'}`}
            style={{ width: '100%' }}
            disabled={isActive}
          >
            {isActive ? 'Active Package' : ctaText}
          </button>
        )}
        {!hidePrices && onInquire && !isActive && (
          <button
            onClick={onInquire}
            type="button"
            className="btn btn-secondary"
            style={{ width: '100%', fontSize: '12.5px', padding: '8px 12px' }}
          >
            Inquire & Request Callback
          </button>
        )}
        {!hidePrices && whatsappMessage && !isActive && (
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
              }).catch(() => { });
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
  const successImages = [
    '/images/success_sarah_tariq.jpg',
    '/images/success_aisha_khalid.jpg',
    '/images/success_adnan_yasmin.jpg'
  ];

  const successAltTexts = [
    'Sarah and Tariq success story',
    'Aisha and Khalid success story',
    'Adnan and Yasmin success story'
  ];

  const currentImage = successImages[imageIndex % 3];
  const currentAltText = successAltTexts[imageIndex % 3];

  return (
    <div className="testimonial-card" style={{
      backgroundColor: 'var(--white)',
      border: '1.5px solid var(--border-color)',
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
          <Image src={currentImage} alt={currentAltText} fill sizes="(max-width: 768px) 100vw, 300px" style={{ objectFit: 'cover' }} />
        </div>
        <p style={{ fontStyle: 'italic', fontSize: '14px', color: 'var(--text-dark)', lineHeight: '1.7', marginBottom: '20px', position: 'relative', zIndex: 2 }}>
          &ldquo;{story}&rdquo;
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '14px', marginTop: '14px' }}>
        <div className="testimonial-author" style={{ fontWeight: '800', color: 'var(--deep-maroon)', fontFamily: 'var(--font-serif)', fontSize: '16px' }}>
          {names}
          <div style={{ fontSize: '12.5px', fontWeight: 'normal', color: 'var(--text-muted)', marginTop: '2px' }}>
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
              }).catch(() => { });
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
      borderRadius: 'var(--border-radius-lg)',
      border: '1.5px solid rgba(184, 146, 74, 0.25)',
      boxShadow: 'var(--shadow-sm)',
      transition: 'var(--transition-smooth)'
    }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = 'translateY(-3px)';
        el.style.boxShadow = 'var(--shadow-premium)';
        el.style.borderColor = 'var(--gold-accent)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = 'var(--shadow-sm)';
        el.style.borderColor = 'rgba(184, 146, 74, 0.25)';
      }}
    >
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

// 12. Zaicha / Kundli Promo Card
export const ZaichaPromoCard: React.FC = () => {
  return (
    <section style={{ padding: '80px 0', backgroundColor: 'var(--white)' }}>
      <div className="container">
        <div style={{
          position: 'relative',
          backgroundColor: 'var(--soft-cream)',
          borderRadius: 'var(--border-radius-xl)',
          border: '1.5px solid var(--gold-accent)',
          padding: '40px',
          boxShadow: 'var(--shadow-premium)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          overflow: 'hidden',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        }}
        className="zaicha-promo-card"
        >
          {/* Subtle Islamic pattern or visual element in the background */}
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            opacity: 0.05,
            transform: 'scale(1.5)',
            pointerEvents: 'none'
          }}>
            <svg width="150" height="150" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
          <div style={{
            position: 'absolute',
            bottom: '-20px',
            left: '-20px',
            opacity: 0.05,
            transform: 'scale(1.5) rotate(45deg)',
            pointerEvents: 'none'
          }}>
            <svg width="150" height="150" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21A9 9 0 1 1 21 12A9.01 9.01 0 0 1 12 21ZM12 4.5A7.5 7.5 0 1 0 19.5 12A7.51 7.51 0 0 0 12 4.5Z" />
              <path d="M12 16.5A4.5 4.5 0 1 1 16.5 12A4.5 4.5 0 0 1 12 16.5ZM12 9A3 3 0 1 0 15 12A3 3 0 0 0 12 9Z" />
            </svg>
          </div>
          
          <FloralCorner position="tl" color="var(--gold-accent)" />
          <FloralCorner position="tr" color="var(--gold-accent)" />
          <FloralCorner position="bl" color="var(--gold-accent)" />
          <FloralCorner position="br" color="var(--gold-accent)" />

          <div style={{
            backgroundColor: 'var(--white)',
            color: 'var(--gold-accent)',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 'bold',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '20px',
            border: '1px solid var(--gold-light)',
            position: 'relative',
            zIndex: 1
          }}>
            Islamic Perspective
          </div>

          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', color: 'var(--deep-maroon)', fontWeight: 'bold', marginBottom: '16px', position: 'relative', zIndex: 1 }}>
            Zaicha / Kundli Guidance
          </h2>
          
          <p style={{ color: 'var(--text-muted)', fontSize: '16px', maxWidth: '600px', lineHeight: '1.6', marginBottom: '32px', position: 'relative', zIndex: 1 }}>
            Get thoughtful compatibility guidance from an Islamic perspective to help families make informed marriage decisions with care, privacy, and trust.
          </p>

          <Link href="/zaicha" className="btn btn-gold" style={{ padding: '14px 40px', fontSize: '15px', position: 'relative', zIndex: 1, textDecoration: 'none' }}>
            Explore Zaicha
          </Link>
          
          <style>{`
            .zaicha-promo-card:hover {
              transform: translateY(-5px);
              box-shadow: 0 12px 24px rgba(0,0,0,0.12) !important;
            }
          `}</style>
        </div>
      </div>
    </section>
  );
};

// 13. Final CTA Block
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
              Trusted Halal Matrimony. Helping single, divorced, and high-profile Muslim candidates find compatible marriage partners. We also provide Zaicha guidance from an Islamic perspective.
            </p>
            {/* Social media icons grid inside footer */}
            {location && (location.facebookUrl || location.instagramUrl || location.youtubeUrl || location.linkedinUrl || location.twitterUrl) && (
              <div style={{ display: 'flex', gap: '14px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {location.facebookUrl && (
                  <a href={location.facebookUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-accent)', transition: 'var(--transition-smooth)', display: 'flex', alignItems: 'center' }} aria-label="Visit Rishte Forever on Facebook">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" style={{ display: 'block' }}>
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                    </svg>
                  </a>
                )}
                {location.instagramUrl && (
                  <a href={location.instagramUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-accent)', transition: 'var(--transition-smooth)', display: 'flex', alignItems: 'center' }} aria-label="Visit Rishte Forever on Instagram">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" style={{ display: 'block' }}>
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                    </svg>
                  </a>
                )}
                {location.youtubeUrl && (
                  <a href={location.youtubeUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-accent)', transition: 'var(--transition-smooth)', display: 'flex', alignItems: 'center' }} aria-label="Visit Rishte Forever on YouTube">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" style={{ display: 'block' }}>
                      <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11C4.483 20.455 12 20.455 12 20.455s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                )}
                {location.linkedinUrl && (
                  <a href={location.linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-accent)', transition: 'var(--transition-smooth)', display: 'flex', alignItems: 'center' }} aria-label="Visit Rishte Forever on LinkedIn">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" style={{ display: 'block' }}>
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                )}
                {location.twitterUrl && (
                  <a href={location.twitterUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-accent)', transition: 'var(--transition-smooth)', display: 'flex', alignItems: 'center' }} aria-label="Visit Rishte Forever on X">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" style={{ display: 'block' }}>
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
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
              <li><Link href="/event-management" className="footer-link" style={{ opacity: 0.8 }}>Event Management</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'var(--gold-accent)', fontSize: '14px', fontWeight: 'bold', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Safety & Support</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', padding: 0 }}>
              <li><Link href="/safety" className="footer-link">Verification & Safety</Link></li>
              <li><Link href="/zaicha" className="footer-link">Zaicha Guidance</Link></li>
              <li><Link href="/success-stories" className="footer-link">Success Stories</Link></li>
              <li><Link href="/about" className="footer-link">About Us</Link></li>
              <li><Link href="/contact" className="footer-link">Contact Support</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '30px', marginTop: '50px', fontSize: '13px', color: 'rgba(248, 241, 231, 0.6)', textAlign: 'center' }}>
          &copy; Rishte Forever. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
