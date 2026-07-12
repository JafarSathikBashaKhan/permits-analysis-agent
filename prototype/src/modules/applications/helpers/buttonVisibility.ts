/**
 * US-195876 — central action-button visibility matrix driven by work queue state.
 * Also honours role for role-guarded actions (BO Manager delete on notes, etc.).
 */

import type { Application, ApplicationStatus } from '../../../data/mock';

export type ActionKey =
  | 'begin-review'
  | 'approve'
  | 'approve-post-payment'
  | 'reject'
  | 'cancel'
  | 'suspend'
  | 'activate-suspend'
  | 'resume'
  | 'extend-hold'
  | 'reinstate-cancelled'
  | 'reinstate-rejected'
  | 'reactivate'
  | 'renew'
  | 'request-evidence'
  | 'evidence-provided'
  | 'request-customer-info'
  | 'internal-referral'
  | 'on-hold'
  | 'change-zone'
  | 'change-address'
  | 'record-payment'
  | 'submit-to-process'
  | 'cancel-permit'
  | 'temporary-approve';

export type ActionButton = {
  key: ActionKey;
  label: string;
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'error' | 'warning' | 'success' | 'info';
  overflow?: boolean;  // shown in "More actions" menu
};

const ALL: Record<ActionKey, Omit<ActionButton, 'key'>> = {
  'begin-review':          { label: 'Begin Review', variant: 'contained' },
  'approve':               { label: 'Approve', variant: 'contained', color: 'success' },
  'approve-post-payment':  { label: 'Approve (Post-Payment)', variant: 'contained', color: 'success' },
  'reject':                { label: 'Reject', variant: 'outlined', color: 'error' },
  'cancel':                { label: 'Cancel Application', variant: 'outlined', color: 'error' },
  'suspend':               { label: 'Suspend Application', variant: 'outlined', color: 'warning' },
  'activate-suspend':      { label: 'Activate', variant: 'contained' },
  'resume':                { label: 'Resume', variant: 'contained' },
  'extend-hold':           { label: 'Extend Duration', variant: 'outlined' },
  'reinstate-cancelled':   { label: 'Reinstate', variant: 'outlined' },
  'reinstate-rejected':    { label: 'Reinstate', variant: 'outlined' },
  'reactivate':            { label: 'Reactivate', variant: 'contained' },
  'renew':                 { label: 'Renew', variant: 'outlined' },
  'request-evidence':      { label: 'Request Evidence', overflow: true },
  'evidence-provided':     { label: 'Evidence Provided', variant: 'contained' },
  'request-customer-info': { label: 'Request Customer Information', overflow: true },
  'internal-referral':     { label: 'Internal Referral', overflow: true },
  'on-hold':               { label: 'On-Hold', overflow: true },
  'change-zone':           { label: 'Change Zone', overflow: true },
  'change-address':        { label: 'Change Address', overflow: true },
  'record-payment':        { label: 'Record Payment', variant: 'contained' },
  'submit-to-process':     { label: 'Submit to Process', variant: 'contained' },
  'cancel-permit':         { label: 'Cancel Permit', variant: 'outlined', color: 'error' },
  'temporary-approve':     { label: 'Approve Address Challenge', variant: 'contained' },
};

// TODO(real-backend): US-195876 — full matrix in the linked spreadsheet
const MATRIX: Partial<Record<ApplicationStatus, ActionKey[]>> = {
  'Pending Approval':          ['begin-review'],
  'Pending Renew':             ['begin-review'],
  'In Progress':               ['approve', 'reject', 'request-customer-info', 'request-evidence', 'internal-referral', 'on-hold'],
  'Under Review':              ['approve', 'reject', 'request-evidence', 'on-hold'],
  'Waiting for Customer Info': ['reject'],
  'Request Support Evidence':  ['evidence-provided', 'reject', 'request-evidence'],
  'Evidence Provided':         ['approve', 'reject'],
  'Awaiting Customer Info':    ['reject'],
  'Waiting for Payment':       ['reject', 'record-payment'],
  'Payment Failed':            ['reject'],
  'Approved':                  ['record-payment'],
  'Active':                    ['cancel', 'suspend', 'change-zone', 'change-address', 'renew'],
  'Suspended':                 ['activate-suspend'],
  'On Hold':                   ['extend-hold', 'resume'],
  'Rejected':                  ['reinstate-rejected'],
  'Cancelled':                 ['reinstate-cancelled'],
  'Expired':                   ['reactivate', 'renew'],
  'NFI':                       ['reject', 'begin-review'],
  'Change Zone':               ['record-payment'],
  'Change Address':            ['record-payment'],
  'Waiting List':              ['submit-to-process', 'cancel-permit'],
};

export type UserRole = 'Super Admin' | 'Contract Admin' | 'BO Manager' | 'BO User' | 'Read Only' | 'CEO';

/** Compute visible action buttons for an application given its current state + role. */
export function getVisibleActions(app: Application, role: UserRole = 'BO User'): ActionButton[] {
  const keys = MATRIX[app.status] ?? [];
  const isSuspension = app.type === 'Suspension';

  return keys
    .filter((k) => {
      // Suspension applications cannot themselves be suspended
      if (k === 'suspend' && isSuspension) return false;
      // Read-only role sees no action buttons
      if (role === 'Read Only') return false;
      return true;
    })
    .map((k) => ({ key: k, ...ALL[k] }));
}

/** Filter for buttons that go in the "More Actions" overflow menu. */
export function splitPrimaryAndOverflow(actions: ActionButton[]): { primary: ActionButton[]; overflow: ActionButton[] } {
  return {
    primary: actions.filter((a) => !a.overflow),
    overflow: actions.filter((a) => a.overflow),
  };
}
