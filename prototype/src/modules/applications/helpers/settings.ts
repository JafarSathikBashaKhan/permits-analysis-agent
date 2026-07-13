/**
 * Settings-seed helpers for the Applications module.
 *
 * These read from localStorage keys, seeding sensible defaults if absent.
 * Represents settings that in production come from MNPS Contract Settings /
 * Contract Settings / Permission Setup, but which are not yet fully implemented
 * in this prototype. When those modules land, drop the seed and read from the
 * real store.
 *
 * localStorage keys used:
 *   prototype:settings:suspend-reasons        US-179426
 *   prototype:settings:reject-reasons         US-160796
 *   prototype:settings:cancel-reasons         US-160872
 *   prototype:settings:hold-reasons           US-160894
 *   prototype:settings:hold-ttl-days          US-193198  (auto-revert TTL)
 *   prototype:settings:document-retention-months  US-193567/195183
 *   prototype:settings:reinstate-window-hours US-195186 (default 72)
 *   prototype:settings:renewal-window-days    US-169022/177255 (default 30 before, 30 grace)
 *   prototype:settings:start-date-policy      US-200211
 *   prototype:settings:pcn-lookup-enabled     US-160554 (contract-level toggle)
 *   prototype:settings:offline-payment-enabled US-194825 (contract-level toggle)
 */

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) {
      window.localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

// TODO(real-backend): US-179426 — read from MNPS Contract Settings
export function getSuspendReasons(): string[] {
  return read<string[]>('prototype:settings:suspend-reasons', [
    'Non-Compliance',
    'Pending Investigations / Audit',
    'Non-Payment of Fees',
    'Legal or Court Order',
    'Fraudulent or Misleading Information Found',
    'Applicant Request',
    'Other Reason',
  ]);
}

export function getRejectReasons(): string[] {
  return read<string[]>('prototype:settings:reject-reasons', [
    'Insufficient Evidence',
    'Ineligible Address',
    'Ineligible Vehicle',
    'Duplicate Application',
    'Applicant Request',
    'Other',
  ]);
}

export function getCancelReasons(): string[] {
  return read<string[]>('prototype:settings:cancel-reasons', [
    'Applicant Request',
    'Address No Longer Valid',
    'Vehicle Sold',
    'Duplicate Application',
    'Other',
  ]);
}

export function getHoldReasons(): string[] {
  return read<string[]>('prototype:settings:hold-reasons', [
    'Awaiting External Verification',
    'Awaiting Applicant Response',
    'System / Data Correction',
    'Investigation',
    'Other',
  ]);
}

export function getHoldExtensionOptions(): string[] {
  return read<string[]>('prototype:settings:hold-extension-options', [
    '7 days',
    '14 days',
    '30 days',
    '60 days',
  ]);
}

export function getHoldTtlDays(): number {
  return read<number>('prototype:settings:hold-ttl-days', 30);
}

export function getDocumentRetentionMonths(): number {
  return read<number>('prototype:settings:document-retention-months', 12);
}

export function getReinstateWindowHours(): number {
  return read<number>('prototype:settings:reinstate-window-hours', 72);
}

export function getRenewalWindowDaysBefore(): number {
  return read<number>('prototype:settings:renewal-window-days-before', 30);
}

export function getRenewalGraceDays(): number {
  return read<number>('prototype:settings:renewal-grace-days', 30);
}

export type StartDatePolicy = 'issue_now' | 'backdate_month_start' | 'backdate_app_start' | 'forward_set_date';

// TODO(real-backend): US-200211 — pull from Permission Setup at time of purchase
export function getStartDatePolicy(): {
  policy: StartDatePolicy;
  delayDays: number;
  includeTime: boolean;
  time: string; // HH:MM
} {
  return read('prototype:settings:start-date-policy', {
    policy: 'issue_now' as StartDatePolicy,
    delayDays: 0,
    includeTime: false,
    time: '00:00',
  });
}

export function isPcnLookupEnabled(): boolean {
  return read<boolean>('prototype:settings:pcn-lookup-enabled', true);
}

export function isFpnLookupEnabled(): boolean {
  return read<boolean>('prototype:settings:fpn-lookup-enabled', true);
}

export function isOfflinePaymentEnabled(): boolean {
  return read<boolean>('prototype:settings:offline-payment-enabled', true);
}

export function getEmailTemplates(): Record<string, { subject: string; body: string }> {
  return read('prototype:settings:email-templates', {
    Approve: {
      subject: 'Your permit application has been approved',
      body: 'Dear {{ApplicantName}},\n\nWe are pleased to inform you that your application {{PermitReference}} has been approved.\nStart date: {{StartDate}}\nEnd date: {{EndDate}}\n\nRegards,\nBack Office',
    },
    ApprovePostPayment: {
      subject: 'Please complete payment for your permit',
      body: 'Dear {{ApplicantName}},\n\nYour application {{PermitReference}} has been approved. Please complete payment of £{{Amount}} to activate it.\n\nRegards,\nBack Office',
    },
    Reject: {
      subject: 'Your permit application has been rejected',
      body: 'Dear {{ApplicantName}},\n\nWe regret to inform you that your application {{PermitReference}} has been rejected.\nReason: {{RejectionReason}}\n\nRegards,\nBack Office',
    },
    Cancel: {
      subject: 'Your permit application has been cancelled',
      body: 'Dear {{ApplicantName}},\n\nYour application {{PermitReference}} has been cancelled.\nReason: {{CancelReason}}\n\nRegards,\nBack Office',
    },
    Suspend: {
      subject: 'Your permit has been suspended',
      body: 'Dear {{ApplicantName}},\n\nYour permit {{PermitReference}} has been suspended.\nReason: {{SuspendReason}}\n\nRegards,\nBack Office',
    },
    Activate: {
      subject: 'Your permit has been reactivated',
      body: 'Dear {{ApplicantName}},\n\nYour permit {{PermitReference}} has been reactivated and is now Active.\n\nRegards,\nBack Office',
    },
    Hold: {
      subject: 'Your permit application is on hold',
      body: 'Dear {{ApplicantName}},\n\nYour application {{PermitReference}} has been placed on hold until {{HoldUntil}}.\nReason: {{HoldReason}}\n\nRegards,\nBack Office',
    },
    HoldExtend: {
      subject: 'Hold on your permit application extended',
      body: 'Dear {{ApplicantName}},\n\nThe hold on {{PermitReference}} has been extended. New expiry: {{HoldUntil}}.\n\nRegards,\nBack Office',
    },
    RequestEvidence: {
      subject: 'Additional evidence required',
      body: 'Dear {{ApplicantName}},\n\nPlease provide the following supporting documents for {{PermitReference}}:\n{{DocumentList}}\n\nRegards,\nBack Office',
    },
    RequestCustomerInfo: {
      subject: 'Additional information required',
      body: 'Dear {{ApplicantName}},\n\nPlease provide the following information to progress {{PermitReference}}:\n{{InfoRequested}}\n\nRegards,\nBack Office',
    },
    InternalReferral: {
      subject: 'Application referred to you',
      body: 'Hi {{ReferredTo}},\n\nApplication {{PermitReference}} has been internally referred to you by {{ReferredBy}}.\nNotes: {{ReferralNotes}}\n\nBack Office',
    },
    ChangeZone: {
      subject: 'Zone change confirmed',
      body: 'Dear {{ApplicantName}},\n\nThe zone for {{PermitReference}} has been changed from {{OldZone}} to {{NewZone}}.\n\nRegards,\nBack Office',
    },
    ChangeAddress: {
      subject: 'Address change confirmed',
      body: 'Dear {{ApplicantName}},\n\nThe address on your permit {{PermitReference}} has been updated.\nNew address: {{NewAddress}}\nZone: {{NewZone}}\n\nRegards,\nBack Office',
    },
    Renewal: {
      subject: 'Your permit renewal has started',
      body: 'Dear {{ApplicantName}},\n\nWe have started renewing your permit {{PermitReference}}.\nNew end date: {{EndDate}}\n\nRegards,\nBack Office',
    },
    Reactivate: {
      subject: 'Your permit has been reactivated',
      body: 'Dear {{ApplicantName}},\n\nYour expired permit {{PermitReference}} has been reactivated within the grace period.\n\nRegards,\nBack Office',
    },
    Reinstate: {
      subject: 'Your application has been reinstated',
      body: 'Dear {{ApplicantName}},\n\nYour application {{PermitReference}} has been reinstated.\n\nRegards,\nBack Office',
    },
  });
}
