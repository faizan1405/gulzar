/**
 * HTML escape utility to prevent XSS in user-provided text content.
 * Use this instead of regex-based stripping for safety.
 */

const ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/**
 * Escape HTML special characters in a string.
 * @param input - The raw user input to sanitize.
 * @returns The escaped string safe for HTML text content.
 */
export function escapeHTML(input: string): string {
  return input.replace(/[&<>"']/g, ch => ESCAPE_MAP[ch]);
}

/**
 * Sanitize an object's text fields by escaping HTML in each specified field.
 * Only top-level string fields are processed — nested objects/arrays are not
 * recursively traversed. Pass flat field names only.
 *
 * @param data - The object containing fields to sanitize.
 * @param fields - Array of top-level field names to escape.
 * @returns A new object with sanitized fields.
 */
export function sanitizeFields<T extends Record<string, unknown>>(
  data: T,
  fields: string[]
): T {
  const sanitized: Record<string, unknown> = { ...data };
  for (const field of fields) {
    if (typeof sanitized[field] === 'string') {
      sanitized[field] = escapeHTML(sanitized[field] as string);
    }
  }
  return sanitized as T;
}
