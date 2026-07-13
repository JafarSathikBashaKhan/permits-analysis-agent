/**
 * Central audit-log helper for the Applications module.
 * Every workflow action, tab-level edit, or system event must append an entry
 * here so US-164970 (Audit Log tab) and US-182368 (Application ID in every event)
 * are satisfied consistently.
 *
 * Storage: localStorage key `prototype:applications:audit:{appId}` → AuditEntry[]
 */

export type AuditCategory =
  | 'Application Processing'
  | 'Permit Management'
  | 'Payment / Offline'
  | 'Workflow Action / Status Change'
  | 'Work Queue / Process Management'
  | 'Address Change / Initiated'
  | 'System Action'
  | 'User Action'
  | 'Communication';

export type AuditEntry = {
  id: string;
  timestamp: string;      // ISO
  applicationId: string;  // US-182368 — always present
  actor: string;          // "First Last"
  actorRole: string;      // "BO User", "BO Manager", "System" etc.
  eventName: string;
  eventDescription: string;
  eventCategory: AuditCategory;
  from?: string;
  to?: string;
  notes?: string;
};

const KEY = (appId: string) => `prototype:applications:audit:${appId}`;

export function readAudit(appId: string): AuditEntry[] {
  if (typeof window === 'undefined' || !appId) return [];
  try {
    const raw = window.localStorage.getItem(KEY(appId));
    if (!raw) return [];
    return JSON.parse(raw) as AuditEntry[];
  } catch {
    return [];
  }
}

export function pushAudit(appId: string, entry: Omit<AuditEntry, 'id' | 'timestamp' | 'applicationId'>): AuditEntry {
  const full: AuditEntry = {
    id: `AL-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    applicationId: appId,
    ...entry,
  };
  const list = readAudit(appId);
  list.unshift(full);
  try { window.localStorage.setItem(KEY(appId), JSON.stringify(list)); } catch { /* ignore */ }
  return full;
}

/** Default seeded events for freshly opened apps that have no audit trail yet. */
export function seedAuditIfEmpty(appId: string, submitted: string, status: string, assignedTo: string): AuditEntry[] {
  const existing = readAudit(appId);
  if (existing.length > 0) return existing;
  const seeded: AuditEntry[] = [
    {
      id: 'AL-seed-1',
      timestamp: `${submitted}T09:22:00.000Z`,
      applicationId: appId,
      actor: 'System', actorRole: 'System',
      eventName: 'Application Created',
      eventDescription: 'Application submitted by customer via portal.',
      eventCategory: 'System Action',
      from: '—', to: 'Pending Approval',
    },
    {
      id: 'AL-seed-2',
      timestamp: `${submitted}T09:35:00.000Z`,
      applicationId: appId,
      actor: 'System', actorRole: 'System',
      eventName: 'Application Assigned',
      eventDescription: `Application assigned to ${assignedTo}.`,
      eventCategory: 'System Action',
      from: '—', to: assignedTo,
    },
    {
      id: 'AL-seed-3',
      timestamp: `${submitted}T10:04:00.000Z`,
      applicationId: appId,
      actor: assignedTo, actorRole: 'BO User',
      eventName: 'Status Change',
      eventDescription: `Application moved to ${status}.`,
      eventCategory: 'Application Processing',
      from: 'Pending Approval', to: status,
    },
  ];
  try { window.localStorage.setItem(KEY(appId), JSON.stringify(seeded)); } catch { /* ignore */ }
  return seeded;
}
