/**
 * Input sanitization utilities for form submissions and API inputs.
 */

/**
 * Strip HTML tags and dangerous characters from user input.
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/<[^>]*>/g, "") // Strip HTML tags
    .replace(/[<>"'`]/g, "") // Remove potentially dangerous characters
    .trim();
}

/**
 * Sanitize and validate an email address.
 */
export function sanitizeEmail(email: string): string | null {
  const cleaned = email.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(cleaned) ? cleaned : null;
}

/**
 * Sanitize a phone number — keep only digits, parentheses, dashes, spaces, and +.
 */
export function sanitizePhone(phone: string): string {
  return phone.replace(/[^0-9()\-+\s]/g, "").trim();
}

/**
 * Validate and sanitize a monetary amount.
 */
export function sanitizeAmount(amount: unknown): number | null {
  const num = typeof amount === "string" ? parseFloat(amount) : Number(amount);
  if (isNaN(num) || num < 1 || num > 1_000_000) return null;
  return Math.round(num * 100) / 100; // Round to 2 decimal places
}

/**
 * Truncate a string to a maximum length.
 */
export function truncate(input: string, maxLength: number): string {
  if (input.length <= maxLength) return input;
  return input.slice(0, maxLength);
}
