/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Hardcoded Permanent Admin / Owner Accounts for MUAVER
 * These accounts are permanently guaranteed full executive Owner privileges
 * regardless of Firestore "admins" collection state.
 */
export const PERMANENT_ADMIN_EMAILS: readonly string[] = [
  'ai.alizaib@gmail.com',
  'zevnora.agency@gmail.com',
] as const;

/**
 * Check whether an email matches any of the permanent owner accounts (case-insensitive)
 */
export function isPermanentAdminEmail(email?: string | null): boolean {
  if (!email || typeof email !== 'string') return false;
  const normalized = email.trim().toLowerCase();
  return PERMANENT_ADMIN_EMAILS.some((adminEmail) => adminEmail.toLowerCase() === normalized);
}
