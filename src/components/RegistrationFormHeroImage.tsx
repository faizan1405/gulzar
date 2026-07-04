import React from 'react';
import Image from 'next/image';

// The image source is stored here as a shared constant so it can be configured in one place
export const registrationFormHeroImage = '/images/matrimonial-hero.png';

export default function RegistrationFormHeroImage() {
  if (!registrationFormHeroImage) {
    return null;
  }

  return (
    <div 
      className="registration-hero-image-container"
      style={{
        width: '100%',
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        marginBottom: '24px',
        aspectRatio: '16 / 7', // Better aspect ratio for banner so it doesn't crop too aggressively
        minHeight: '200px',
        maxHeight: '340px',
      }}
    >
      <Image 
        src={registrationFormHeroImage} 
        alt="Muslim Matrimonial Matchmaking Journey"
        fill
        style={{
          objectFit: 'cover',
          objectPosition: 'center 15%' // Aligns closer to the top to keep faces fully visible
        }}
        priority
      />
    </div>
  );
}
