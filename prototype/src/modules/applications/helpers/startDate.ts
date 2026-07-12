/**
 * US-200211 — Dynamic Start Date / End Date rendering.
 *
 * Real system: Start Date is calculated at the moment status becomes ACTIVE, using
 * the Start Date Policy configured on the Permission at purchase time.
 * Here we compute deterministically based on a policy + delayDays + optional time,
 * seeded per-application in localStorage so the value is stable across renders.
 */

import { getStartDatePolicy } from './settings';

const KEY = (appId: string) => `prototype:applications:start-end:${appId}`;

export type StartEnd = {
  startDate: string;   // YYYY-MM-DD
  endDate: string;     // YYYY-MM-DD
  time?: string;       // HH:MM if includeTime
  policyLabel: string;
};

const POLICY_LABEL: Record<string, string> = {
  issue_now: 'Issue Now',
  backdate_month_start: 'Backdated to Start of Month',
  backdate_app_start: 'Backdated to Start of Application',
  forward_set_date: 'Forward to Set Date',
};

/** Add days to an ISO YYYY-MM-DD string. */
function addDays(iso: string, days: number): string {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function addMonths(iso: string, months: number): string {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCMonth(d.getUTCMonth() + months);
  return d.toISOString().slice(0, 10);
}

function firstOfMonth(iso: string): string {
  const d = new Date(iso + 'T00:00:00Z');
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-01`;
}

export function computeStartEnd(appId: string, appliedOn: string, activatedOn?: string): StartEnd {
  // Cached per-application so we don't drift on re-render
  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(KEY(appId));
      if (raw) return JSON.parse(raw) as StartEnd;
    } catch { /* ignore */ }
  }

  const cfg = getStartDatePolicy();
  const anchor = activatedOn ?? appliedOn;
  let startDate: string;

  switch (cfg.policy) {
    case 'backdate_month_start':
      startDate = firstOfMonth(anchor);
      break;
    case 'backdate_app_start':
      startDate = appliedOn;
      break;
    case 'forward_set_date':
      startDate = addDays(anchor, cfg.delayDays || 30);
      break;
    case 'issue_now':
    default:
      startDate = addDays(anchor, cfg.delayDays || 0);
      break;
  }

  const endDate = addMonths(startDate, 12); // default 12-month duration
  const out: StartEnd = {
    startDate,
    endDate,
    time: cfg.includeTime ? cfg.time : undefined,
    policyLabel: POLICY_LABEL[cfg.policy] ?? 'Issue Now',
  };

  if (typeof window !== 'undefined') {
    try { window.localStorage.setItem(KEY(appId), JSON.stringify(out)); } catch { /* ignore */ }
  }
  return out;
}

/** BO user override of start/end date — writes to the same cache. */
export function setStartEnd(appId: string, startDate: string, endDate: string, time?: string): void {
  if (typeof window === 'undefined') return;
  const cur = readStartEnd(appId);
  const out: StartEnd = {
    startDate, endDate,
    time: time ?? cur?.time,
    policyLabel: cur?.policyLabel ?? 'Manual Override',
  };
  try { window.localStorage.setItem(KEY(appId), JSON.stringify(out)); } catch { /* ignore */ }
}

export function readStartEnd(appId: string): StartEnd | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(KEY(appId));
    if (!raw) return null;
    return JSON.parse(raw) as StartEnd;
  } catch { return null; }
}
