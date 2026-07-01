# Permits UX Prototype

Interactive UX prototype for the Marston Permits application, reimagining the Back Office experience with a cleaner, "classic UK niche application" look.

## Stack

- **Vite** + **React 18** + **TypeScript**
- **MUI 5** (+ `@mui/x-data-grid`)
- **React Router 6**
- **Zustand** (state — currently unused, ready for wiring)
- Google Fonts: **Fraunces** (headings) + **Inter** (body)

## Design tokens

| Token | Value | Purpose |
|---|---|---|
| Navy | `#0A2540` | Primary, sidebar, headings |
| Gold | `#B08A2E` | Accent, active state, tab indicator |
| Cream | `#F7F4EC` | Page background |
| Paper | `#FFFFFF` | Cards, tables |
| Line  | `#E4E1D8` | Borders |

Flat elevation, 1px borders, uppercase captions with letter-spacing, serif headings — evokes a British public-sector / classic-utility feel rather than a loud SaaS.

## Run

```bash
cd prototype
npm install
npm run dev
```

Then open <http://localhost:5173>.

Build:

```bash
npm run build
```

## Modules covered

| Route | Module |
|---|---|
| `/` | Dashboard (KPIs, recent applications, weekly workload, notices) |
| `/builder` | Permission Builder list |
| `/builder/:id` | Permission designer (9 tabs: Basic Info, General Settings, Rules, Pricing, Vehicles, Zones, Documents, Renewals, Special Events) |
| `/applications` | Applications grid with filters |
| `/applications/:id` | Application detail (Overview + 6 tab placeholders + workflow actions) |
| `/users` | Users landing (3 cards) |
| `/users/roles` | Roles & Permissions matrix |
| `/users/system` | System Users grid |
| `/users/applicants` | Applicants grid |
| `/area/streets` | Streets (White/Black tabs) |
| `/area/zones` | Zones card grid |
| `/area/locations` | Locations grid |
| `/contract-settings` | Contract-level toggles + values |
| `/print` | Print queue |
| `/reports` | Reports (NFI, Financial Income, Diesel Surcharge) |

## What's real vs. mock

- **Field rules** in the Builder — Basic Information and General Settings tabs mirror source-verified rules from `MNPS-Permission-UI` (max lengths, regex, defaults). See `knowledge/app-knowledge/modules/builder/permissions/`.
- **Everything else** is mocked in `src/data/mock.ts` for UI-only prototyping.

## Structure

```
prototype/
├── src/
│   ├── layout/            # AppLayout, Sidebar, Topbar
│   ├── shared/            # PageHeader, StatusChip, FieldHint, Section
│   ├── modules/
│   │   ├── home/
│   │   ├── builder/       # + tabs/
│   │   ├── applications/
│   │   ├── users/
│   │   ├── area/
│   │   ├── contractsettings/
│   │   ├── print/
│   │   └── reports/
│   ├── data/mock.ts
│   ├── theme.ts
│   ├── router.tsx
│   └── main.tsx
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Next steps

1. Wire real API calls in place of `data/mock.ts` (start with permissions list).
2. Add authentication hook that reads MFA-skipped session (existing framework provides `auth.json`).
3. Fill in the remaining Application tabs (Vehicles, Documents, Notes, Emails, Zones, History).
4. Code-split the router bundle (build warning about >500KB chunk).
