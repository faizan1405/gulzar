export interface BusinessLocation {
  name: string;
  address: string;
  phone: string;
  phoneRaw: string;
  mapEmbedUrl: string;
  mapOpenUrl: string;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  defaultPreviewImage?: string | null;
}

export const defaultBusinessLocation: BusinessLocation = {
  name: "Shadi Mubarak",
  address: "Innov8 44 Regal Building, 2nd Floor, Property No. 44, Above Madame Tussauds, Regal Building, Connaught Place, New Delhi - 110001",
  phone: "+91 96754 83125",
  phoneRaw: "+919675483125",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.9863412351234!2d77.2155!3d28.6315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd37e28329a5%3A0xcabf3ea44e830e26!2sInnov8%20Connaught%20Place!5e0!3m2!1sen!2sin!4v1718500000000!5m2!1sen!2sin",
  mapOpenUrl: "https://www.google.com/maps/search/?api=1&query=Innov8+44+Regal+Building%2C+Connaught+Place%2C+New+Delhi+-+110001",
  facebookUrl: "https://www.facebook.com/shadimubarak",
  instagramUrl: "https://www.instagram.com/shadimubarak",
  youtubeUrl: "https://www.youtube.com/shadimubarak",
  linkedinUrl: "https://www.linkedin.com/company/shadimubarak",
  twitterUrl: "https://x.com/shadimubarak",
  defaultPreviewImage: "/images/nikah-1.jpeg" // Elegant default preview
};

/**
 * Sanitizes map URLs to prevent potential XSS attacks.
 * Only allows protocols starting with http/https and filters malicious payloads.
 */
export function sanitizeMapsUrl(url: string | null | undefined, fallback: string): string {
  if (!url) return fallback;
  
  const trimmed = url.trim();
  
  // Basic sanity check to ensure it's a URL and starts with http or https
  if (!/^https?:\/\//i.test(trimmed)) {
    return fallback;
  }

  // Prevent javascript: protocol or other inline exploits
  if (trimmed.toLowerCase().includes('javascript:') || trimmed.toLowerCase().includes('data:')) {
    return fallback;
  }

  // Verify it belongs to Google Maps or dynamic maps providers (or starts with allowed patterns)
  // For extreme security, we verify it maps to google.com/maps or maps.google.com
  const isGoogleMaps = /^(https?:\/\/)?([\w-]+\.)*(google\.com|google\.co\.in|maps\.google\.com)\//i.test(trimmed);
  if (!isGoogleMaps) {
    return fallback;
  }

  return trimmed;
}

/**
 * Validates and sanitizes a social media URL to ensure it is a safe link.
 * Returns the sanitized URL, or null if it's invalid.
 */
export function validateSocialUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (trimmed === '') return null;

  // Basic check to ensure it starts with http:// or https://
  if (!/^https?:\/\//i.test(trimmed)) {
    return null;
  }

  // Prevent script/inline injections
  if (trimmed.toLowerCase().includes('javascript:') || trimmed.toLowerCase().includes('data:')) {
    return null;
  }

  return trimmed;
}

