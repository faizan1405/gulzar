import React from 'react';

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
    <div className="flex justify-center my-6" aria-label="Bismillah-ir-Rahman-ir-Rahim calligraphy stamp">
      <svg width="280" height="65" viewBox="0 0 300 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
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
}> = ({ title, subtitle, scriptText }) => {
  return (
    <div className="section-header text-center" style={{ maxWidth: '700px', margin: '0 auto 48px auto', textAlign: 'center' }}>
      {scriptText && (
        <span className="script-accent block mb-2" style={{ display: 'block', marginBottom: '8px' }}>
          {scriptText}
        </span>
      )}
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '38px', color: 'var(--primary-brand)', fontWeight: 700, letterSpacing: '0.5px' }}>
        {title}
      </h2>
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
      <div className="arch-container max-w-2xl mx-auto p-8 text-center gold-rim gold-glow" style={{ maxWidth: '650px', margin: '0 auto', padding: '36px', textAlign: 'center' }}>
        <FloralCorner position="tl" />
        <FloralCorner position="tr" />
        <FloralCorner position="bl" />
        <FloralCorner position="br" />
        
        <div style={{ marginBottom: '16px' }}>
          {/* Heart shaped Quranic verse calligraphy stamp */}
          <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto' }}>
            <path d="M50 85 C 10 50, 20 20, 50 35 C 80 20, 90 50, 50 85 Z" fill="none" stroke="var(--gold-accent)" strokeWidth="1.5" />
            <text x="50" y="52" dominantBaseline="middle" textAnchor="middle" fill="var(--deep-maroon)" fontFamily="var(--font-arabic)" fontSize="16" fontWeight="bold">
              زوج
            </text>
          </svg>
        </div>

        <div className="arabic-calligraphy my-4" style={{ margin: '16px 0', fontSize: '2.4rem', color: 'var(--deep-maroon)' }}>
          وَخَلَقْنَاكُمْ أَزْوَاجًا
        </div>

        <div style={{ fontStyle: 'italic', fontSize: '18px', fontFamily: 'var(--font-serif)', color: 'var(--text-dark)', marginTop: '12px' }}>
          &ldquo;And We created you in pairs&rdquo;
        </div>
        
        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--gold-accent)', fontWeight: 700, marginTop: '8px' }}>
          — Al-Qur’an 78:8
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
  const profileCat = (profile as any).category || '';

  const isSecMarriage = profile.maritalStatus !== 'Single' || profileCat === 'second_marriage';
  const isHighProf = 
    profileCat === 'high_profile' ||
    profile.occupation.toLowerCase().includes('doctor') ||
    profile.occupation.toLowerCase().includes('engineer') ||
    profile.occupation.toLowerCase().includes('business') ||
    profile.annualIncomeRange.includes('₹10 LPA') ||
    profile.annualIncomeRange.includes('₹15 LPA') ||
    profile.annualIncomeRange.includes('Above');

  const isGoodProfile = profileCat === 'good_profile';

  const hasPaidMonthly = hasPaid300 || simulatedPackages.includes('monthly_membership');
  const hasSecMarriageAccess = simulatedPackages.includes('second_marriage_package');
  const hasHighProfAccess = simulatedPackages.includes('high_profile_package') && simulatedHighProfileApproved;
  const hasGoodProfileAccess = simulatedPackages.includes('good_profile_package');

  let shouldBlur = !isLoggedIn;
  let lockReason = '';
  let unlockText = 'Unlock Monthly Membership (₹300)';

  if (!isLoggedIn) {
    shouldBlur = true;
    lockReason = 'Log in to view wedding profile photos and contact details';
    unlockText = 'Log In';
  } else if (!hasPaidMonthly) {
    shouldBlur = true;
    lockReason = 'Activate monthly membership (₹300) to view normal profiles.';
    unlockText = 'Unlock Monthly (₹300)';
  } else if (isGoodProfile && !hasGoodProfileAccess) {
    shouldBlur = true;
    lockReason = 'Good Profile Candidate. Buy Good Profile Package for ₹5,500 to view.';
    unlockText = 'Buy Good Profile Package (₹5,500)';
  } else if (isSecMarriage && !hasSecMarriageAccess) {
    shouldBlur = true;
    lockReason = 'Second-Marriage Candidate. Unlock with Second Marriage Package.';
    unlockText = 'Unlock Second Marriage (₹11,000)';
  } else if (isHighProf && !hasHighProfAccess) {
    shouldBlur = true;
    lockReason = 'High-Profile Candidate. Requires High Profile Package and approval.';
    unlockText = 'Unlock High Profile (₹21,000)';
  }

  const themeClass = getThemeClass(profile.themeColor);
  const isSaved = savedProfiles.includes(profile.id);

  return (
    <article
      className={`profile-card ${themeClass} theme-accent-border`}
      style={{
        '--profile-theme-color': 'var(--theme-accent)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--white)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--border-radius-lg)',
        boxShadow: 'var(--shadow-premium)',
        overflow: 'hidden',
        transition: 'var(--transition-smooth)'
      } as React.CSSProperties}
    >
      {/* Decorative floral corner details inside card */}
      <FloralCorner position="tl" color="var(--gold-light)" />
      
      <div className="profile-card-badge-container" style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        {profile.verificationStatus === 'APPROVED' && <VerifiedBadge />}
        {isGoodProfile && (
          <span className="card-badge" style={{ backgroundColor: '#059669', color: '#fff', fontSize: '11px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '20px' }}>
            💖 Good Profile
          </span>
        )}
        {isHighProf && (
          <span className="card-badge" style={{ backgroundColor: 'var(--gold-accent)', color: '#fff', fontSize: '11px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '20px' }}>
            ⭐ High-Profile
          </span>
        )}
        {isSecMarriage && (
          <span className="card-badge" style={{ backgroundColor: 'var(--deep-maroon)', color: '#fff', fontSize: '11px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '20px' }}>
            👥 Second-Marriage
          </span>
        )}
        <span className="card-badge card-badge-distance" style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-dark)',
          fontSize: '11px',
          padding: '4px 10px',
          borderRadius: '20px'
        }}>
          📍 Mumbai • {index === 0 ? '1.8' : index === 1 ? '5.4' : '12.0'} km away
        </span>
      </div>

      <button
        onClick={() => onToggleSave(profile.id)}
        className="card-save-btn"
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          zIndex: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid var(--border-color)',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '16px',
          transition: 'var(--transition-smooth)'
        }}
      >
        {isSaved ? '❤️' : '🤍'}
      </button>

      <div className="profile-image-wrapper" style={{
        position: 'relative',
        width: '100%',
        paddingBottom: '105%',
        backgroundColor: 'var(--soft-cream)',
        overflow: 'hidden'
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.profileImageUrl || getProfileImage(profile.gender, index)}
          alt={profile.fullName}
          className={`profile-img ${shouldBlur ? 'blurred-media' : ''}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />

        {shouldBlur && (
          <div className="blur-blocker" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(111, 29, 53, 0.82)', /* Ivory tinted deep maroon block overlay */
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            textAlign: 'center',
            color: 'var(--white)',
            zIndex: 5
          }}>
            <div className="blur-blocker-title" style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 'bold', color: 'var(--gold-accent)', marginBottom: '8px' }}>
              🔒 Protected Profile
            </div>
            <p style={{ fontSize: '12px', opacity: 0.9, marginBottom: '20px', maxWidth: '240px', color: 'var(--soft-cream)' }}>
              {lockReason}
            </p>
            {!isLoggedIn ? (
              <button
                onClick={onShowLogin}
                className="btn btn-gold"
                style={{ padding: '8px 24px', fontSize: '13px' }}
              >
                Log In
              </button>
            ) : (
              <a
                href="#premium-pricing"
                className="btn btn-gold"
                style={{ padding: '8px 24px', fontSize: '13px', display: 'inline-block' }}
              >
                {unlockText.split('(')[0]}
              </a>
            )}
          </div>
        )}
      </div>

      <div className="profile-card-details" style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <h3 className="profile-card-name" style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--text-dark)', fontWeight: 700, marginBottom: '4px' }}>
          {shouldBlur ? 'Profile details blurred' : profile.fullName}
        </h3>
        <div className="profile-card-subtitle" style={{ fontSize: '13px', color: 'var(--gold-accent)', fontWeight: 600, marginBottom: '18px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {isHighProf ? 'High-Profile Candidate' : isSecMarriage ? 'Second-Marriage Candidate' : 'Muslim Matrimonial Match'}
        </div>

        <div className="profile-specs-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
          <div className="spec-cell">
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', fontWeight: 600, letterSpacing: '0.5px' }}>Gender / Age</span>
            <strong style={{ fontSize: '13.5px', color: 'var(--text-dark)' }}>{profile.gender} • {2026 - new Date(profile.dateOfBirth).getFullYear()} Yrs</strong>
          </div>
          <div className="spec-cell">
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', fontWeight: 600, letterSpacing: '0.5px' }}>Marital Status</span>
            <strong style={{ fontSize: '13.5px', color: 'var(--text-dark)' }}>{profile.maritalStatus}</strong>
          </div>
          <div className="spec-cell">
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', fontWeight: 600, letterSpacing: '0.5px' }}>City Location</span>
            <strong style={{ fontSize: '13.5px', color: 'var(--text-dark)' }}>{profile.city}, {profile.state}</strong>
          </div>
          <div className="spec-cell">
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', fontWeight: 600, letterSpacing: '0.5px' }}>Profession</span>
            <strong style={{ fontSize: '13.5px', color: 'var(--text-dark)' }}>{shouldBlur ? 'Hidden' : profile.occupation}</strong>
          </div>
        </div>

        <div className="profile-card-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '18px', marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '13.5px', color: 'var(--text-dark)', fontWeight: '600' }}>
            📞 {shouldBlur ? '+91-XXXXX-XXXXX' : profile.phoneNumber}
          </span>
          <button
            onClick={() => onViewDetails(profile)}
            className="btn btn-secondary"
            style={{ padding: '8px 18px', fontSize: '12px' }}
          >
            View Biodata
          </button>
        </div>
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
  onInquire
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
        <div style={{ width: '100%', height: '180px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--gold-light)', marginBottom: '20px' }}>
          <img src={placeholderIllustration} alt="Matched Couple Illustration" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <p style={{ fontStyle: 'italic', fontSize: '14px', color: 'var(--text-dark)', lineHeight: '1.7', marginBottom: '20px', position: 'relative', zIndex: 2 }}>
          &ldquo;{story}&rdquo;
        </p>
      </div>

      <div className="testimonial-author" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px', fontWeight: 'bold', color: 'var(--deep-maroon)', fontFamily: 'var(--font-serif)', fontSize: '15px' }}>
        {names}
        <div style={{ fontSize: '12px', fontWeight: 'normal', color: 'var(--text-muted)', marginTop: '2px' }}>
          {location} {weddingDate && `• Married ${weddingDate}`}
        </div>
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
            <div className="footer-logo" style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: 'bold', color: 'var(--white)', marginBottom: '18px' }}>
              Shadi Mubarak<span style={{ color: 'var(--gold-accent)' }}>.</span>
            </div>
            <p style={{ fontSize: '13.5px', color: 'rgba(248, 241, 231, 0.8)', lineHeight: '1.8', marginBottom: '16px' }}>
              Trusted Halal Matrimony. Helping single, divorced, and high-profile Muslim candidates find compatible marriage partners.
            </p>
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
              <li><button onClick={() => onNavigate('safety')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', opacity: 0.8, padding: 0 }}>Verification & Safety</button></li>
              <li><button onClick={() => onNavigate('success-stories')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', opacity: 0.8, padding: 0 }}>Success Stories</button></li>
              <li><button onClick={() => onNavigate('about')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', opacity: 0.8, padding: 0 }}>About Us</button></li>
              <li><button onClick={() => onNavigate('contact')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', opacity: 0.8, padding: 0 }}>Contact Support</button></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '30px', marginTop: '50px', fontSize: '13px', color: 'rgba(248, 241, 231, 0.6)', textAlign: 'center' }}>
          &copy; 2026 Shadi Mubarak. All Rights Reserved. Created for premium internal launch preview.
        </div>
      </div>
    </footer>
  );
};
