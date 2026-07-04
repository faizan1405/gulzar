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
        marginBottom: '20px',
        height: '200px', // controlled height so it does not dominate the form
      }}
    >
      <Image 
        src={registrationFormHeroImage} 
        alt="Muslim Matrimonial Matchmaking Journey"
        fill
        style={{
          objectFit: 'cover',
          objectPosition: 'center 25%'
        }}
        priority
      />
    </div>
  );
}
