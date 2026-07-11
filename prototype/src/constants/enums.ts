/**
 * Enums extracted from MNPS-Permission-RestAPI / Domain / CommonEnum.cs
 * SOURCE OF TRUTH for dropdown options across the prototype.
 * Numeric values match the C# enum IDs.
 */

export const APPLICATION_STATUS_LABELS: Record<number, string> = {
  1: 'Pending Approval', 2: 'Waiting List', 3: 'In Progress',
  4: 'Waiting for Customer Info', 5: 'Request Support Evidence', 6: 'Evidence Provided',
  7: 'Waiting for Payment', 8: 'Payment Failed', 9: 'Approved',
  10: 'Internal Referral', 11: 'Rejected', 12: 'On Hold',
  13: 'Active', 14: 'Print', 15: 'Due To Be Closed',
  16: 'Cancelled', 17: 'Suspended', 18: 'Change Zone',
  19: 'Change Vehicle', 20: 'Change Address', 21: 'Address Challenge Approved',
  22: 'Change Address Challenge', 23: 'Reinstate', 24: 'Activate',
  25: 'Expired', 26: 'Reactivate', 27: 'Pending Renew',
  28: 'Pending Pre-Approval', 29: 'Expired Renewable', 30: 'Assign Task',
  31: 'Task Assigned', 32: 'Expired Assign Task', 33: 'Expired Task Assigned',
  34: 'Cancelled Assign Task', 35: 'Cancelled Task Assigned', 36: 'Refund Failed',
};
export const APPLICATION_STATUS_OPTIONS = Object.entries(APPLICATION_STATUS_LABELS).map(([id, label]) => ({ id: Number(id), label }));

export const PERMISSION_STATUS_LABELS: Record<number, string> = {
  1: 'Active', 2: 'Cancelled', 3: 'Pending Approval', 4: 'Pending Renew',
  5: 'Under Review', 6: 'Internal Referral', 7: 'Change of Vehicle',
  8: 'Change of Address', 9: 'Waiting for Payment', 10: 'Waiting List',
  11: 'In Progress', 12: 'Rejected', 13: 'Awaiting Support Evidence',
  14: 'Approved', 15: 'Expired', 16: 'Print', 17: 'Postponed',
  18: 'Due To Be Closed (No Payment)', 19: 'Due To Be Closed (No Evidence)',
  20: 'Change of Zone', 21: 'Address Challenge', 22: 'Address Challenge Approved',
  23: 'Awaiting Customer Information', 24: 'Awaiting Assessment', 25: 'Assessment Complete',
};

export const PERMISSION_TYPE_LABELS: Record<number, string> = {
  1: 'Permit', 2: 'Licensing', 3: 'Suspension', 4: 'Dispensation', 5: 'Exemption',
};
export const PERMISSION_TYPE_OPTIONS = Object.entries(PERMISSION_TYPE_LABELS).map(([id, label]) => ({ id: Number(id), label }));

export const PERMISSION_CATEGORY_LABELS: Record<number, string> = {
  1: 'Scratch Card', 2: 'Visitor', 3: 'Resident', 4: 'Disabled Bay',
  5: 'Car Park (Non-Zonal)', 6: 'Suspension', 7: 'Dispensation',
  8: 'Seasonal Parking Car Park', 9: 'Resident Exemptions', 10: 'Non-Resident Exemptions',
};
export const PERMISSION_CATEGORY_OPTIONS = Object.entries(PERMISSION_CATEGORY_LABELS).map(([id, label]) => ({ id: Number(id), label }));

export const VEHICLE_TYPE_LABELS: Record<number, string> = {
  1: 'Bus', 2: 'Car', 3: 'Heavy Goods Vehicle', 4: 'Light Goods Vehicle',
  5: 'Motorcycle', 6: 'Scooter', 7: 'Van',
};
export const VEHICLE_TYPE_OPTIONS = Object.entries(VEHICLE_TYPE_LABELS).map(([id, label]) => ({ id: Number(id), label }));

export const FUEL_TYPE_LABELS: Record<number, string> = {
  1: 'Petrol', 2: 'Diesel', 3: 'Diesel Hybrid Electric', 4: 'Electric',
  5: 'Electricity', 6: 'Heavy Oil', 7: 'LPG', 8: 'Other',
  9: 'Petrol Hybrid Electric', 10: 'Petrol LPG',
};
export const FUEL_TYPE_OPTIONS = Object.entries(FUEL_TYPE_LABELS).map(([id, label]) => ({ id: Number(id), label }));

export const PAYMENT_STATUS_LABELS: Record<number, string> = { 1: 'Paid', 2: 'Pending', 3: 'Failed' };
export const PAYMENT_STATUS_OPTIONS = Object.entries(PAYMENT_STATUS_LABELS).map(([id, label]) => ({ id: Number(id), label }));

export const PAYMENT_METHOD_LABELS: Record<number, string> = {
  1: 'Registered Cards', 2: 'Pay by New Card', 3: 'Online After Approval',
  4: 'Wallet', 5: 'Agent Assist', 6: 'Pay on Collection', 7: 'Postal Payment',
  8: 'Cost Center & Budget Code', 9: 'Pay Monthly', 10: 'Pay Quarterly',
  11: 'Offline', 12: 'Invoice',
};
export const PAYMENT_METHOD_OPTIONS = Object.entries(PAYMENT_METHOD_LABELS).map(([id, label]) => ({ id: Number(id), label }));

export const REFUND_POLICY_LABELS: Record<number, string> = {
  1: 'Only if greater than 6 months', 2: 'Only if greater than 3 months',
  3: 'Only if greater than 1 month', 4: 'Only if greater than 3 weeks',
  5: 'Only if greater than 2 weeks', 6: 'Only if greater than 1 week',
  7: 'Full months remaining', 8: 'Days remaining', 9: 'Unused vouchers',
};
export const REFUND_POLICY_OPTIONS = Object.entries(REFUND_POLICY_LABELS).map(([id, label]) => ({ id: Number(id), label }));

export const ZONE_STATUS_LABELS: Record<number, string> = { 1: 'Published', 2: 'Draft' };

export const DOCUMENT_CATEGORY_LABELS: Record<number, string> = {
  1: 'Proof of Residence', 2: 'Proof of Vehicle Ownership',
};
export const DOCUMENT_CATEGORY_OPTIONS = Object.entries(DOCUMENT_CATEGORY_LABELS).map(([id, label]) => ({ id: Number(id), label }));

export const DURATION_PERIOD_LABELS: Record<number, string> = {
  1: 'Minutes', 2: 'Hours', 3: 'Days', 4: 'Weeks', 5: 'Months', 6: 'Years',
};
export const DURATION_PERIOD_OPTIONS = Object.entries(DURATION_PERIOD_LABELS).map(([id, label]) => ({ id: Number(id), label }));

export const VOUCHER_STATUS_LABELS: Record<number, string> = {
  1: 'Pending Activation', 2: 'Active', 3: 'Expired',
};
export const REFUND_STATUS_LABELS: Record<number, string> = { 1: 'Initiated', 2: 'Success', 3: 'Failed' };
export const WORKFLOW_STATUS_LABELS: Record<number, string> = { 1: 'Assigned', 2: 'Un-Assigned' };

// Field length limits from [MaxLength] attrs on Domain entities
export const FIELD_LIMITS = {
  REFERENCE_NUMBER: 20, POSTCODE: 20, UPRN: 20, USRN: 20,
  BLUE_BADGE_NUMBER: 20, MOBILE_NUMBER: 15, EMAIL: 100,
  FIRST_NAME: 100, LAST_NAME: 100, BUSINESS_NAME: 100,
  STREET_NAME: 100, ADDRESS_LINE: 100, TOWN_NAME: 100,
  PROPERTY_NAME: 200, LEGACY_SYSTEM_ID: 250,
} as const;

// Business rules
export const BUSINESS_RULES = {
  ON_HOLD_MAX_EXTENSIONS: 2,
  PERMISSION_LIMIT_MIN: 0,
  PERMISSION_LIMIT_MAX: 99,
  ADMIN_FEE_MIN: 0,
  ADMIN_FEE_MAX: 1000,
} as const;

// Helpers to convert a stored status id to a colored chip color
export function statusChipColor(statusId: number): 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' {
  if ([13, 9, 14, 21, 24, 26].includes(statusId)) return 'success'; // Active / Approved / Print / etc.
  if ([1, 2, 3, 4, 5, 6, 27, 28, 29].includes(statusId)) return 'info'; // pending flows
  if ([12, 17].includes(statusId)) return 'warning'; // OnHold / Suspended
  if ([11, 8, 16, 36].includes(statusId)) return 'error'; // Rejected / PaymentFailed / Cancelled / RefundFailed
  return 'default';
}
