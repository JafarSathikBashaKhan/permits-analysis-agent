/**
 * US-137749 — Application Number Generation Based on Prefix
 *
 * Format: <PREFIX>-<8-char alphanumeric suffix>
 * Rules:
 *   - Prefix comes from Builder ▶ General Settings for the selected permission type
 *   - Suffix is 8 uppercase alphanumeric (A-Z, 0-9)
 *   - Full number must be unique across the system — if collision, regenerate suffix
 *   - Same suffix may repeat across DIFFERENT prefixes (only full string must be unique)
 *   - Total length max 19 chars (prefix ≤ 10 + '-' + suffix 8)
 */

const APPLICATIONS_KEY = 'prototype:applications:rows';
const BUILDER_KEY = 'prototype:builder:list:rows';
const ALPHABET = 'ABCDEFGHIJKLMNPQRSTUVWXYZ23456789';

function randomSuffix(len = 8): string {
  let out = '';
  for (let i = 0; i < len; i++) {
    out += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
  }
  return out;
}

function readExistingRefs(): Set<string> {
  try {
    const raw = localStorage.getItem(APPLICATIONS_KEY);
    if (!raw) return new Set();
    const rows = JSON.parse(raw) as Array<{ ref?: string }>;
    return new Set(rows.map((r) => r.ref || '').filter(Boolean));
  } catch {
    return new Set();
  }
}

export function generateApplicationNumber(rawPrefix: string | undefined | null, extraTaken?: Set<string>): string {
  const cleanPrefix = String(rawPrefix ?? 'APP').trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10) || 'APP';
  const taken = readExistingRefs();
  if (extraTaken) extraTaken.forEach((r) => taken.add(r));

  for (let attempt = 0; attempt < 20; attempt++) {
    const candidate = `${cleanPrefix}-${randomSuffix(8)}`;
    if (!taken.has(candidate)) return candidate;
  }
  return `${cleanPrefix}-${randomSuffix(4)}${String(Date.now()).slice(-4)}`;
}

export function resolvePrefixForPermission(permissionNameOrType: string | undefined | null): string {
  try {
    const rows = JSON.parse(localStorage.getItem(BUILDER_KEY) || '[]') as Array<{
      name?: string; type?: string; prefix?: string;
    }>;
    const target = String(permissionNameOrType ?? '').trim().toLowerCase();
    if (!target) return 'APP';
    const match = rows.find((r) => (r.name || '').toLowerCase() === target)
      ?? rows.find((r) => (r.type || '').toLowerCase() === target);
    const p = match?.prefix?.trim();
    return p && p.length > 0 ? p : 'APP';
  } catch {
    return 'APP';
  }
}
