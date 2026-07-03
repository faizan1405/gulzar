// Helper to normalize truthy environment variable strings
export function parseEnvBoolean(val: string | undefined): boolean {
  if (!val) return false;
  const normalized = val.toLowerCase().trim();
  return normalized === 'true' || normalized === '1' || normalized === 'yes';
}

/**
 * Checks if the backend API should be in demo (read-only) mode.
 * Primarily controlled by DEMO_MODE.
 */
export function isDemoMode() {
  const isBackendDemo = parseEnvBoolean(process.env.DEMO_MODE);
  const isFrontendDemo = parseEnvBoolean(process.env.NEXT_PUBLIC_DEMO_MODE);
  
  // Backward compatibility: If DEMO_MODE is missing but NEXT_PUBLIC_DEMO_MODE is true,
  // we still protect the backend to avoid accidental mutations if a user only sets the UI var.
  return isBackendDemo || isFrontendDemo;
}

/**
 * Checks if the frontend UI should display demo components/banners.
 */
export function isPublicDemoMode() {
  return parseEnvBoolean(process.env.NEXT_PUBLIC_DEMO_MODE);
}
