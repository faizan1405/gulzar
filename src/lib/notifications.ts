// Resend removed — all notification functions are no-ops.
// They preserve their original signatures so callers don't need changes.

/* eslint-disable @typescript-eslint/no-unused-vars */

export async function sendEmail(_to: string, _subject: string, _html: string) {
  return { id: 'noop_email_id' };
}

export async function sendSMS(_to: string, _body: string) {
  return { id: 'noop_sms_id' };
}

export async function notifyRegistration(_userEmail: string | null, _userPhone: string, _userName: string) {
  // no-op
}

export async function notifyAdminNewProfile(_profileDetails: unknown) {
  // no-op
}

export async function notifyVerificationStatus(
  _userEmail: string | null,
  _userPhone: string,
  _userName: string,
  _status: string
) {
  // no-op
}

export async function notifyMembership(
  _userEmail: string | null,
  _userPhone: string,
  _userName: string,
  _packageType: string
) {
  // no-op
}

export async function notifyAdminNewLead(_leadDetails: unknown) {
  // no-op
}
