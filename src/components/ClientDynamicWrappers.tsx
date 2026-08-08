'use client';

import dynamic from "next/dynamic";

export const ProfileDetails = dynamic(() => import("./ProfileDetails"));
export const CallButton = dynamic(() => import("./CallButton"));
export const WhatsAppButton = dynamic(() => import("./WhatsAppButton"));
export const RegistrationPopup = dynamic(() => import("./RegistrationPopup"));
