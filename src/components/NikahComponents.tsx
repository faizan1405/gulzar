import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Profile } from '../types';
import { getSupportWhatsAppLink } from '../lib/whatsapp';

export const DecorativeArch: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`arch-container ${className}`}>
      {children}
    </div>
  );
};

export const BismillahCalligraphy: React.FC = () => {
  return (
    <div className="bismillah-container font-sans" aria-label="Bismillah-ir-Rahman-ir-Rahim calligraphy stamp">
      <div className="bismillah-content">
        <div className="bismillah-row">
          <span className="bismillah-arabic">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </span>
        </div>
      </div>
    </div>
  );
};

export const SectionHeading: React.FC<{
  title: string;
  subtitle?: string;
  scriptText?: string;
  as?: 'h1' | 'h2';
}> = ({ title, subtitle, scriptText, as = 'h2' }) => {
  const HeadingTag = as;
  return (
    <div className="section-heading-wrap">
      {scriptText && (
        <span className="script-accent section-heading-script">
          {scriptText}
        </span>
      )}
      <HeadingTag className="section-heading-title">{title}</HeadingTag>
      {subtitle && (
        <p className="section-heading-subtitle">{subtitle}</p>
      )}
    </div>
  );
};

export const QuranVerseBlock: React.FC = () => {
  return (
    <div className="container quran-verse-mt">
      <div className="quran-verse-split gold-glow">
        <div className="quran-verse-image-panel">
          <Image
            src="/images/couple.png"
            alt="Elegant Islamic matrimonial - Rishte Forever"
            fill
            sizes="(max-width: 640px) 100vw, 900px"
            className="decorative-arch-img"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export const VerifiedBadge: React.FC = () => {
  return (
    <span className="card-badge card-badge-verified">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      Call Verified
    </span>
  );
};

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
  getProfileImage,
  getThemeClass
}) => {
  const profileCat = profile.category || '';
  const isLockedCategory = (profile as unknown as Record<string, unknown>).isLockedCategory as string || '';

  const isSecMarriage = profileCat === 'second_marriage' || isLockedCategory === 'second_marriage_package';
  const isHighProf = profileCat === 'high_profile' || isLockedCategory === 'high_profile_package';
  const isGoodProfile = profileCat === 'good_profile' || isLockedCategory === 'good_profile_package';

  const hasPaidMonthly = hasPaidSubscription || activePackages.includes('monthly_membership');
  const hasSecMarriageAccess = activePackages.includes('second_marriage_package');
  const hasHighProfAccess = activePackages.includes('high_profile_package') && highProfileApproved;
  const hasGoodProfileAccess = activePackages.includes('good_profile_package');

  const contactVisible = hasPaidMonthly && !isLockedCategory;

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

  const photoVisible = !showUpgradeCta;
  const themeClass = getThemeClass(profile.themeColor);
  const isSaved = savedProfiles.includes(profile.id);

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

  const displayName = profile.fullName;

  const educationHidden =
    !profile.education || profile.education.startsWith('Hidden (');
  const occupationHidden =
    !profile.occupation
    || profile.occupation === 'Hidden'
    || profile.occupation.startsWith('Hidden (');

  return (
    <article
      className={`profile-card ${themeClass}`}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = 'translateY(-8px) scale(1.01)';
        el.style.boxShadow = 'var(--shadow-hover)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = 'translateY(0) scale(1)';
        el.style.boxShadow = 'var(--shadow-premium)';
      }}
    >
      <div className="profile-card-accent-bar" />

      <div className="profile-photo-section">
        {photoVisible ? (
          <>
            <Image
              src={profile.profileImageUrl || getProfileImage(profile.gender, index)}
              alt={displayName}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="profile-img"
              priority={index < 6}
            />
            <div className="profile-photo-gradient" />
          </>
        ) : (
          <>
            <div className="profile-photo-overlay" />
            <div className="profile-photo-private">
              <div className="profile-avatar-circle">
                {profile.gender?.toLowerCase() === 'female' ? '👩' : '👨'}
              </div>
              <span className="profile-private-label">Photo Private</span>
            </div>
          </>
        )}

        <div className="profile-badges-wrap">
          {profile.verificationStatus === 'APPROVED' && (
            <span className="profile-badge-verified">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Call Verified
            </span>
          )}
          {isGoodProfile && (
            <span className="profile-badge-good">✦ Good Profile</span>
          )}
          {isHighProf && (
            <span className="profile-badge-gold">⭐ Gold Package</span>
          )}
          {isSecMarriage && (
            <span className="profile-badge-silver">↺ Silver Plan</span>
          )}
          {isLockedCategory && (
            <span className="profile-badge-locked">🔒 Package Required</span>
          )}
        </div>

        <button
          onClick={() => onToggleSave(profile.id)}
          aria-label={isSaved ? 'Remove from saved' : 'Save profile'}
          className="profile-save-btn"
        >
          {isSaved ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="profile-card-info">
        <h3 className="profile-card-name">{displayName}</h3>

        <div className="profile-stats-row">
          {age !== null && (
            <span className="profile-stat-chip">{age} yrs</span>
          )}
          {profile.gender && (
            <span className={profile.gender.toLowerCase() === 'female' ? 'profile-stat-gender-female' : 'profile-stat-gender-male'}>
              {profile.gender}
            </span>
          )}
          {profile.maritalStatus && (
            <span className="profile-stat-marital">· {profile.maritalStatus}</span>
          )}
        </div>

        {(profile.city || profile.state) && (
          <div className="profile-location-row">
            <span className="profile-location-emoji">📍</span>
            <span>{[profile.city, profile.state].filter(Boolean).join(', ')}</span>
          </div>
        )}

        <div className="profile-divider" />

        <div className="profile-attributes">
          {!educationHidden && profile.education && (
            <div className="profile-attr-row">
              <span className="profile-attr-emoji">🎓</span>
              <span className="profile-attr-value">{profile.education}</span>
            </div>
          )}
          {!occupationHidden && profile.occupation && (
            <div className="profile-attr-row">
              <span className="profile-attr-emoji">💼</span>
              <span className="profile-attr-value">{profile.occupation}</span>
            </div>
          )}
          {profile.maslak && (
            <div className="profile-attr-row">
              <span className="profile-attr-emoji">🕌</span>
              <span className="profile-attr-value">{profile.maslak}</span>
            </div>
          )}
          {profile.biradari && (
            <div className="profile-attr-row">
              <span className="profile-attr-emoji">👪</span>
              <span className="profile-attr-value">{profile.biradari}</span>
            </div>
          )}
        </div>

        <div className="profile-divider" />

        {showUpgradeCta ? (
          <div className="profile-cta-area">
            <button
              onClick={() => onViewProfile(profile)}
              className={`profile-cta-primary ${isLoggedIn ? 'profile-cta-primary-gold' : 'profile-cta-primary-maroon'}`}
            >
              {isLoggedIn ? `🔓 ${unlockCta}` : `🔒 ${unlockCta}`}
            </button>
            <button
              onClick={() => onViewDetails(profile)}
              className="profile-cta-secondary"
            >
              View Preview
            </button>
          </div>
        ) : (
          <div className="profile-cta-area">
            {contactVisible && profile.phoneNumber && profile.phoneNumber !== '+91-XXXXX-XXXXX' && (
              <div className="profile-contact-row">
                <span>📞</span>
                <span>{profile.phoneNumber}</span>
              </div>
            )}
            <button
              onClick={() => onViewDetails(profile)}
              className="profile-cta-primary profile-cta-primary-maroon"
            >
              View Full Profile →
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

interface PremiumPlanCardProps {
  title: string;
  price: number;
  gstRate?: number;
  billingText?: string;
  features: string[];
  isPopular?: boolean;
  isActive?: boolean;
  onActivate?: () => void;
  ctaText?: string;
  onInquire?: () => void;
  whatsappMessage?: string;
  imageUrl?: string;
  badgeText?: string;
  planTier?: string;
  positioning?: string;
  hidePrices?: boolean;
  isLoggedIn?: boolean;
  onCompleteForm?: () => void;
}

interface SuccessStoryCardProps {
  names: string;
  location: string;
  story: string;
  weddingDate?: string;
  imageIndex: number;
}

interface SafetyFeatureCardProps {
  title: string;
  desc: string;
  icon: string;
}

interface FinalCTAProps {
  onRegister: () => void;
  onBrowse: () => void;
  isLoggedIn: boolean;
  hasProfile: boolean;
}

interface PremiumFooterProps {
  onNavigate: (view: string) => void;
}

export const PremiumPlanCard: React.FC<PremiumPlanCardProps> = ({
  title,
  price,
  gstRate,
  features,
  isPopular = false,
  isActive,
  onActivate,
  ctaText,
  whatsappMessage,
  imageUrl,
  badgeText,
  planTier,
  positioning,
  hidePrices = true,
}: PremiumPlanCardProps) => {
  const finalBadge = badgeText || (isPopular ? 'Recommended' : undefined);

  return (
    <div className={`pkg-card ${isPopular ? 'pkg-card-popular' : ''} ${planTier === 'gold' ? 'pkg-card-gold' : ''} ${planTier === 'silver' ? 'pkg-card-silver' : ''}`}>
      {finalBadge && (
        <div className={`pkg-badge ${planTier === 'basic' || !planTier ? 'pkg-badge-basic' : ''}`}>
          {finalBadge}
        </div>
      )}

      {imageUrl && (
        <div className="pkg-image-wrap">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
          />
        </div>
      )}

      <h3 className="pkg-title">{title}</h3>

      {positioning && (
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '16px' }}>
          {positioning}
        </p>
      )}

      {hidePrices ? (
        <div className="pkg-pricing-box">
          <div className="pkg-pricing-label">Starting from</div>
          <div className="pkg-pricing-value">₹{price.toLocaleString()}{(gstRate ?? 0) > 0 ? ' + GST' : ''}</div>
          <div className="pkg-pricing-note">Complete profile for member-only discounts</div>
        </div>
      ) : (
        <div className="pkg-price">
          ₹{price.toLocaleString()}
          {(gstRate ?? 0) > 0 && (
            <span>+ GST</span>
          )}
        </div>
      )}

      <ul className="pkg-features">
        {features.map((feat, i) => (
          <li key={i}>{feat}</li>
        ))}
      </ul>

      <div className="pkg-cta-area">
        <button
          onClick={onActivate}
          className={`btn btn-primary btn-full`}
        >
          {hidePrices ? 'Register & Buy Package' : (isActive ? 'Active Package' : ctaText)}
        </button>
        {whatsappMessage && !isActive && (
          <a
            href={getSupportWhatsAppLink(whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="pkg-whatsapp-btn"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M12.012 2c-5.506 0-9.97 4.478-9.97 10.012 0 1.77.458 3.43 1.258 4.887L2 22l5.253-1.378c1.402.766 3 1.2 4.759 1.2 5.506 0 9.97-4.478 9.97-10.012 0-5.534-4.464-10.012-9.97-10.012zm5.795 13.91c-.244.694-1.22 1.268-1.745 1.355-.472.079-.938.293-3.04-.542-2.527-.998-4.14-3.565-4.267-3.731-.127-.166-.991-1.32-.991-2.518 0-1.2.626-1.79.847-2.029.221-.24.479-.3.639-.3a.46.46 0 0 1 .332.155c.105.155.434 1.058.471 1.139.037.081.062.176.009.282-.053.106-.079.171-.157.262-.078.09-.166.2-.236.269-.079.078-.162.162-.07.32.092.158.411.678.88 1.096.604.538 1.111.704 1.267.782.157.078.249.066.342-.04.093-.106.402-.469.511-.627.109-.158.217-.132.366-.077.148.055.942.443 1.103.524.161.081.268.121.308.19.04.069.04.4-.204 1.094z" />
            </svg>
            Inquire on WhatsApp
          </a>
        )}
      </div>
    </div>
  );
};

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
    <div className="testimonial-card">
      <div>
        <div className="story-card-image-wrap">
          <Image src={currentImage} alt={currentAltText} fill sizes="(max-width: 768px) 100vw, 300px" />
        </div>
        <p className="story-card-text">&ldquo;{story}&rdquo;</p>
      </div>

      <div className="story-card-footer">
        <div className="story-card-author-name">
          {names}
          <div className="story-card-author-meta">
            {location} {weddingDate && `· Married ${weddingDate}`}
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
          className="story-card-share-btn"
          title="Share Story"
        >
          <span>Share 🔗</span>
        </button>
      </div>
    </div>
  );
};

export const SafetyFeatureCard: React.FC<SafetyFeatureCardProps> = ({ title, desc, icon }) => {
  return (
    <div
      className="safety-card"
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
      <div className="safety-card-icon">{icon}</div>
      <div className="safety-text">
        <h4 className="safety-card-title">{title}</h4>
        <p className="safety-card-desc">{desc}</p>
      </div>
    </div>
  );
};

export const ZaichaPromoCard: React.FC = () => {
  return (
    <section className="zaicha-section">
      <div className="container">
        <div className="zaicha-card">
          <div className="zaicha-pattern zaicha-pattern-top">
            <svg width="150" height="150" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
          <div className="zaicha-pattern zaicha-pattern-bottom">
            <svg width="150" height="150" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21A9 9 0 1 1 21 12A9.01 9.01 0 0 1 12 21ZM12 4.5A7.5 7.5 0 1 0 19.5 12A7.51 7.51 0 0 0 12 4.5Z" />
              <path d="M12 16.5A4.5 4.5 0 1 1 16.5 12A4.5 4.5 0 0 1 12 16.5ZM12 9A3 3 0 1 0 15 12A3 3 0 0 0 12 9Z" />
            </svg>
          </div>

          <div className="zaicha-chip">Islamic Perspective</div>

          <h2 className="zaicha-heading">Zaicha / Kundli Guidance</h2>

          <p className="zaicha-desc">
            Get thoughtful compatibility guidance from an Islamic perspective to help families make informed marriage decisions with care, privacy, and trust.
          </p>

          <Link href="/zaicha" className="btn btn-gold zaicha-cta-btn">
            Explore Zaicha
          </Link>
        </div>
      </div>
    </section>
  );
};

export const FinalCTA: React.FC<FinalCTAProps> = ({ onRegister, onBrowse, isLoggedIn, hasProfile }) => {
  return (
    <section className="final-cta-section">
      <div className="container">
        <div className="final-cta-inner">
          <span className="script-accent section-heading-script">Start Your Blessed Future</span>
          <h2 className="final-cta-title">Begin Your Journey Towards a Meaningful Nikah</h2>
          <p className="final-cta-desc">
            Join a respectful, family-focused platform designed to help you discover compatible matches with manual telephone verification checks and complete privacy controls.
          </p>

          <div className="final-cta-buttons">
            <button onClick={onRegister} className="btn btn-gold">
              {isLoggedIn ? (hasProfile ? 'Edit Your Profile' : 'Complete Profile') : 'Register Free'}
            </button>
            <button onClick={onBrowse} className="btn btn-primary">
              Browse Profiles
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

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
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo-wrap">
              <Image
                src="/images/rishte-forever-logo.png"
                alt="Rishte Forever — Where Faith Meets Forever"
                width={260}
                height={98}
              />
            </div>
            <p className="footer-address">
              Trusted Halal Matrimony. Helping single, divorced, and high-profile Muslim candidates find compatible marriage partners. We also provide Zaicha guidance from an Islamic perspective.
            </p>
            {location && (location.facebookUrl || location.instagramUrl || location.youtubeUrl || location.linkedinUrl || location.twitterUrl) && (
              <div className="footer-social-row">
                {location.facebookUrl && (
                  <a href={location.facebookUrl} target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Visit Rishte Forever on Facebook">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                    </svg>
                  </a>
                )}
                {location.instagramUrl && (
                  <a href={location.instagramUrl} target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Visit Rishte Forever on Instagram">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                    </svg>
                  </a>
                )}
                {location.youtubeUrl && (
                  <a href={location.youtubeUrl} target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Visit Rishte Forever on YouTube">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11C4.483 20.455 12 20.455 12 20.455s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                )}
                {location.linkedinUrl && (
                  <a href={location.linkedinUrl} target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Visit Rishte Forever on LinkedIn">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                )}
                {location.twitterUrl && (
                  <a href={location.twitterUrl} target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Visit Rishte Forever on X">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                )}
              </div>
            )}
            <div className="footer-contact-block">
              <div>📍 {location ? location.address : 'Innov8 44 Regal Building, 2nd Floor, Connaught Place, New Delhi - 110001'}</div>
              <div>📞 Call: <a href={`tel:${location ? location.phoneRaw : '+919675483125'}`}>{location ? location.phone : '+91 96754 83125'}</a></div>
            </div>
            <div className="footer-dua">
              May Allah bless your search and grant you a righteous life partner.
            </div>
          </div>
          <div>
            <h4 className="footer-col-heading">Explore</h4>
            <ul className="footer-nav-list">
              <li><button onClick={() => onNavigate('home')} className="footer-link">Home</button></li>
              <li><button onClick={() => onNavigate('search')} className="footer-link">Browse Profiles</button></li>
              <li><button onClick={() => onNavigate('packages')} className="footer-link">Pricing & Packages</button></li>
              <li><button onClick={() => onNavigate('how-it-works')} className="footer-link">How It Works</button></li>
              <li><Link href="/event-management" className="footer-link">Event Management</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-col-heading">Safety & Support</h4>
            <ul className="footer-nav-list">
              <li><Link href="/faq" className="footer-link">FAQ</Link></li>
              <li><Link href="/safety" className="footer-link">Verification & Safety</Link></li>
              <li><Link href="/zaicha" className="footer-link">Zaicha Guidance</Link></li>
              <li><Link href="/success-stories" className="footer-link">Success Stories</Link></li>
              <li><Link href="/about" className="footer-link">About Us</Link></li>
              <li><Link href="/contact" className="footer-link">Contact Support</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; Rishte Forever. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
