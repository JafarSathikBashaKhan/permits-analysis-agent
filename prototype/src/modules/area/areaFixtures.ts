// Shared types & fixtures for the Area modules (streets / zones / locations / special events / bay list).
// Mirrors the shape used by the real MNPS-Permission-UI without duplicating the property list per file.

export type PropertyRow = {
  id: string;
  name: string;
  uprn: string;
  postcode: string;
  permissionLimit: number;
};

export type Street = {
  id: string;
  name: string;
  usrn: string;
  town: string;
  noOfProperties: number;
  status: 'Active' | 'Inactive';
  createdOn: string;
  createdByUser: string;
  updatedOn: string;
  updatedByUser: string;
  properties: PropertyRow[];
};

export const TOWNS = ['Colchester', 'Chelmsford', 'Camden', 'Islington', 'Hackney', 'Southwark', 'Lambeth'];

const makeProps = (seed: number): PropertyRow[] =>
  Array.from({ length: (seed % 4) + 2 }, (_, i) => ({
    id: `p-${seed}-${i}`,
    name: `${(seed * 3 + i) + 1}A`,
    uprn: `10000${seed}${i}00`,
    postcode: `CC${seed % 9 + 1} ${i}${((seed + i) % 9) + 1}AA`,
    permissionLimit: (i % 5) + 1,
  }));

export const seedStreets = (): Street[] => {
  const names = [
    'Baker Street', 'Church Lane', 'High Street', 'Kingsway', 'Market Square', 'Mill Road',
    'Oak Avenue', 'Pearl Street', 'Queens Road', 'Rose Crescent', 'St. Andrews Place',
    'Union Terrace', 'Victoria Lane', 'Wells Court', 'Yew Road', 'Zebra Way',
  ];
  return names.map((n, i) => ({
    id: `st-${1000 + i}`,
    name: n,
    usrn: `USRN-${20000 + i}`,
    town: TOWNS[i % TOWNS.length],
    noOfProperties: (i % 6) + 3,
    status: i % 7 === 0 ? 'Inactive' : 'Active',
    createdOn: `2025-${String((i % 12) + 1).padStart(2, '0')}-14 09:12`,
    createdByUser: 'admin.user',
    updatedOn: `2026-${String((i % 6) + 1).padStart(2, '0')}-02 14:22`,
    updatedByUser: 'ops.team',
    properties: makeProps(i),
  }));
};

export const BLACKLIST_DURATIONS = [
  'One Week',
  'One Month',
  'Six Months',
  'One Year',
  'Mark Indefinite',
  'Custom Date Range',
];
