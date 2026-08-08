'use client';

import dynamic from 'next/dynamic';

const ProfileDetails = dynamic(() => import('../components/ClientDynamicWrappers').then(m => m.ProfileDetails), { ssr: false });
const CallButton = dynamic(() => import('../components/ClientDynamicWrappers').then(m => m.CallButton), { ssr: false });
const WhatsAppButton = dynamic(() => import('../components/ClientDynamicWrappers').then(m => m.WhatsAppButton), { ssr: false });
const RegistrationPopup = dynamic(() => import('../components/ClientDynamicWrappers').then(m => m.RegistrationPopup), { ssr: false });

export default function CustomerOverlays() {
  return (
    <>
      <ProfileDetails />
      <CallButton />
      <WhatsAppButton />
      <RegistrationPopup />
    </>
  );
}
