// Email templates removed — no-op stubs to preserve API for callers.

export const emailTemplates = {
  registrationSubmitted: (_name: string) => '',
  profileApproved: (_name: string) => '',
  profileRejected: (_name: string) => '',
  profileNeedsFollowUp: (_name: string) => '',
  adminNewProfileAlert: (_profileDetails: { fullName: string; gender: string; phoneNumber: string; city?: string; state?: string }) => '',
  membershipActivated: (_name: string, _packageType: string) => '',
  adminNewLeadAlert: (_leadDetails: Record<string, unknown>) => '',
};
