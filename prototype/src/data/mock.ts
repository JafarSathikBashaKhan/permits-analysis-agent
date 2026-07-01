// Mock data for the prototype. Values reflect the real AutomationApplyIQ contract
// concepts: permission types, applications lifecycle, users, zones, streets.

export type Permission = {
  id: string;
  name: string;
  type: 'Resident' | 'Visitor' | 'Business' | 'Permit' | 'Licence';
  group: string;
  category: 'Scratch card' | 'Visitor' | 'Resident' | 'Disabled Bay' | 'Resident Exemptions';
  status: 'Draft' | 'Published';
  prefix?: string;
  price: number;
  version: number;
  lastUpdated: string;
  createdBy: string;
  zones: number;
  documents: number;
};

export const permissions: Permission[] = [
  { id: 'P-1001', name: 'City Centre Resident 2026', type: 'Resident', group: 'City Centre', category: 'Resident', status: 'Published', prefix: 'CCR', price: 120, version: 4, lastUpdated: '2026-06-24', createdBy: 'Jafar Basha', zones: 3, documents: 2 },
  { id: 'P-1002', name: 'Visitor Book (25 hrs)',      type: 'Visitor',  group: 'Visitor Books', category: 'Visitor',  status: 'Published', prefix: 'VBK', price: 25,  version: 2, lastUpdated: '2026-06-14', createdBy: 'Jo Smith', zones: 5, documents: 0 },
  { id: 'P-1003', name: 'Business Season 6mo',        type: 'Business', group: 'Business',      category: 'Resident', status: 'Draft',     prefix: 'BSN', price: 480, version: 1, lastUpdated: '2026-06-27', createdBy: 'Priya R.', zones: 2, documents: 1 },
  { id: 'P-1004', name: 'Blue Badge Disabled Bay',    type: 'Permit',   group: 'Disabled',      category: 'Disabled Bay', status: 'Published', prefix: 'BBD', price: 0, version: 3, lastUpdated: '2026-05-30', createdBy: 'Jafar Basha', zones: 12, documents: 2 },
  { id: 'P-1005', name: 'Contractor Weekly',          type: 'Business', group: 'Contractor',    category: 'Visitor',  status: 'Draft',     prefix: 'CTW', price: 60,  version: 1, lastUpdated: '2026-06-29', createdBy: 'Priya R.', zones: 1, documents: 0 },
  { id: 'P-1006', name: 'Market Traders Licence',     type: 'Licence',  group: 'Market',        category: 'Resident Exemptions', status: 'Published', prefix: 'MTL', price: 200, version: 5, lastUpdated: '2026-04-12', createdBy: 'Jo Smith', zones: 1, documents: 3 },
  { id: 'P-1007', name: 'Visitor Scratchcard Book',   type: 'Visitor',  group: 'Visitor Books', category: 'Scratch card', status: 'Published', prefix: 'VSC', price: 30, version: 2, lastUpdated: '2026-06-21', createdBy: 'Jafar Basha', zones: 8, documents: 0 },
];

export const permissionTypes = ['Resident', 'Visitor', 'Business', 'Permit', 'Licence'] as const;
export const groupsByType: Record<string, string[]> = {
  Resident: ['City Centre', 'North', 'South'],
  Visitor:  ['Visitor Books'],
  Business: ['Business', 'Contractor'],
  Permit:   ['Disabled'],
  Licence:  ['Market'],
};
export const categories = ['Scratch card', 'Visitor', 'Resident', 'Disabled Bay', 'Resident Exemptions'] as const;

// -------- Applications --------
export type ApplicationType = 'Permit' | 'Suspension' | 'Dispensation' | 'Exemption';
export type Application = {
  id: string;
  ref: string;
  applicant: string;
  permission: string;
  type: ApplicationType;
  submitted: string;
  status: 'Pending Approval' | 'In Progress' | 'Under Review' | 'Approved' | 'Active' | 'Rejected' | 'Cancelled' | 'Suspended' | 'On Hold' | 'Awaiting Payment' | 'Payment Failed' | 'Expired' | 'Closed' | 'NFI';
  amount: number;
  zone: string;
  assignedTo: string;
};

const APPLICANTS = ['Alice Whittaker','Ben Turner','Cheryl Iyer','Danny O\'Neill','Eesha Patel','Frank Bell','Grace Adeyemi','Harjeet Singh','Isla Robertson','James Coates','Kim Lorenzo','Lena Kowalski','Marcus Reid','Nina Gauthier','Oliver Kwan','Pippa Bracknell','Quentin Ash','Rohit Sharma','Sofia Marín','Tomas Vetter'];
const STATUSES = ['Pending Approval','In Progress','Under Review','Approved','Active','Rejected','Cancelled','Suspended','On Hold','Awaiting Payment','Payment Failed','Expired','Closed','NFI'] as const;
const ZONES = ['Z01 City Centre','Z02 Northgate','Z03 Southbank','Z04 Riverside','Z05 Kingsway'];

const APP_TYPES: ApplicationType[] = ['Permit', 'Permit', 'Permit', 'Suspension', 'Dispensation', 'Exemption', 'Permit', 'Permit'];

export const applications: Application[] = Array.from({ length: 32 }).map((_, i) => {
  const perm = permissions[i % permissions.length];
  return {
    id: `A-${2000 + i}`,
    ref: `AP-${(2026).toString()}-${(1000 + i).toString().padStart(4, '0')}`,
    applicant: APPLICANTS[i % APPLICANTS.length],
    permission: perm.name,
    type: APP_TYPES[i % APP_TYPES.length],
    submitted: `2026-0${1 + (i % 6)}-${String(1 + (i % 27)).padStart(2, '0')}`,
    status: STATUSES[i % STATUSES.length],
    amount: perm.price,
    zone: ZONES[i % ZONES.length],
    assignedTo: ['Jafar Basha','Jo Smith','Priya R.','Unassigned'][i % 4],
  };
});

// -------- Users --------
export type SystemUser = {
  id: string; name: string; email: string; role: string; status: 'Active' | 'Invited' | 'Deactivated'; lastActive: string;
};
export const roles = ['Super Admin', 'Contract Admin', 'BO Manager', 'BO User', 'Read Only', 'CEO'];
export const systemUsers: SystemUser[] = [
  { id: 'U-01', name: 'Jafar Basha',  email: 'jafar.s@marston.co.uk',    role: 'Super Admin',     status: 'Active',      lastActive: '2 min ago' },
  { id: 'U-02', name: 'Jo Smith',     email: 'jo.smith@marston.co.uk',   role: 'Contract Admin',  status: 'Active',      lastActive: '1 hour ago' },
  { id: 'U-03', name: 'Priya R.',     email: 'priya.r@marston.co.uk',    role: 'BO Manager',      status: 'Active',      lastActive: 'Yesterday' },
  { id: 'U-04', name: 'Dan Iyer',     email: 'dan.i@marston.co.uk',      role: 'BO User',         status: 'Active',      lastActive: 'Yesterday' },
  { id: 'U-05', name: 'Mary Owens',   email: 'mary.o@marston.co.uk',     role: 'BO User',         status: 'Invited',     lastActive: '—' },
  { id: 'U-06', name: 'Tim Barlow',   email: 'tim.b@marston.co.uk',      role: 'Read Only',       status: 'Deactivated', lastActive: '3 months ago' },
];

// -------- Area --------
export type Street = { id: string; usrn: string; name: string; zone: string; status: 'White' | 'Black'; };
export const streets: Street[] = Array.from({ length: 24 }).map((_, i) => ({
  id: `ST-${i + 1}`,
  usrn: `USRN-${23100 + i}`,
  name: ['High Street','Old Mill Road','Cathedral Lane','Kingsway','Riverside Walk','Alma Road','Newton Crescent','Beech Grove','Kentish Street','Foundry Row','Priory Court','Elm Terrace'][i % 12] + (i > 11 ? ` (${Math.floor(i / 12)})` : ''),
  zone: ZONES[i % ZONES.length],
  status: i % 7 === 0 ? 'Black' : 'White',
}));

export type Zone = { id: string; code: string; name: string; streets: number; published: boolean; permissions: number; };
export const zones: Zone[] = ZONES.map((z, i) => ({
  id: `Z-${i + 1}`, code: z.split(' ')[0], name: z.split(' ').slice(1).join(' '),
  streets: 4 + i * 2, published: i < 4, permissions: 2 + i,
}));

export type LocationRow = { id: string; name: string; zone: string; properties: number; status: 'Published' | 'Draft'; };
export const locations: LocationRow[] = [
  { id: 'L-1', name: 'Central Car Park A',   zone: 'Z01', properties: 42, status: 'Published' },
  { id: 'L-2', name: 'Northgate Multistorey', zone: 'Z02', properties: 128, status: 'Published' },
  { id: 'L-3', name: 'Southbank Riverside',   zone: 'Z03', properties: 78, status: 'Draft' },
  { id: 'L-4', name: 'Kingsway Retail Park',  zone: 'Z05', properties: 210, status: 'Published' },
];

// -------- Print --------
export const printQueue = applications.filter(a => a.status === 'Approved' || a.status === 'Active').slice(0, 12).map((a, i) => ({
  id: `PRT-${1000 + i}`, ref: a.ref, applicant: a.applicant, permission: a.permission, requested: '2026-06-28', status: (['Ready','Sent','Awaiting Approval'] as const)[i % 3],
}));

// -------- KPIs --------
export const kpis = {
  activePermits: 4327,
  pendingApproval: applications.filter(a => a.status === 'Pending Approval').length,
  awaitingPayment: applications.filter(a => a.status === 'Awaiting Payment').length,
  upcomingRenewals: 187,
  applicationsThisMonth: 892,
};
