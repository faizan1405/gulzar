'use client';

import dynamic from "next/dynamic";

export const ProfileDetails = dynamic(() => import("./ProfileDetails"), { ssr: false });
export const ChatbotWidget = dynamic(() => import("./ChatbotWidget"), { ssr: false });
export const CallButton = dynamic(() => import("./CallButton"), { ssr: false });
export const WhatsAppButton = dynamic(() => import("./WhatsAppButton"), { ssr: false });
