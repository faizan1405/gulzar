export const WHATSAPP_NUMBER = '919675483125';

/**
 * Cleans a phone number by stripping non-digit characters, removing leading zeros,
 * and prepending country code 91 if it is a 10-digit number.
 */
export function cleanPhoneNumber(phone: string): string {
  if (!phone) return '';
  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0')) {
    digits = digits.substring(1);
  }
  if (digits.length === 10) {
    return '91' + digits;
  }
  return digits;
}

/**
 * Returns a fully formatted and URL-encoded WhatsApp link.
 */
export function getWhatsAppLink(phone: string, message: string): string {
  const cleanedPhone = cleanPhoneNumber(phone);
  return `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Returns a WhatsApp link to the Shadi Mubarak support number.
 */
export function getSupportWhatsAppLink(message: string): string {
  return getWhatsAppLink(WHATSAPP_NUMBER, message);
}
