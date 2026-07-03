import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from './layout/AppLayout';
import { HomePage } from './modules/home/HomePage';
import { BuilderListPage } from './modules/builder/BuilderListPage';
import { BuilderGroupsPage } from './modules/builder/BuilderGroupsPage';
import { BuilderDesignPage } from './modules/builder/BuilderDesignPage';
import { ApplicationsListPage } from './modules/applications/ApplicationsListPage';
import { ApplicationDetailPage } from './modules/applications/ApplicationDetailPage';
import { RolesPage } from './modules/users/RolesPage';
import { SystemUsersPage } from './modules/users/SystemUsersPage';
import { ApplicantsPage } from './modules/users/ApplicantsPage';
import { StreetsPage } from './modules/area/StreetsPage';
import { ZonesPage } from './modules/area/ZonesPage';
import { LocationsPage } from './modules/area/LocationsPage';
import { SpecialEventsPage } from './modules/area/SpecialEventsPage';
import { BayListPage } from './modules/area/BayListPage';
import { ContractSettingsPage } from './modules/contractsettings/ContractSettingsPage';
import { ReportsPage } from './modules/reports/ReportsPage';
import { DashboardPage } from './modules/dashboard/DashboardPage';
import { PlaceholderPage } from './shared/PlaceholderPage';

const rawBase = ((import.meta as any).env?.BASE_URL as string) || '/';
const basename = rawBase.replace(/\/$/, '') || '/';

// Note: route slugs mirror the real MNPS-Permission-UI Next.js app so URLs
// stay identical to the developer's source. Some route folders in the real
// app use PascalCase (e.g. /SpecialEvents) — we mirror them exactly.
export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AppLayout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'home', element: <Navigate to="/" replace /> },
        { path: 'dashboard', element: <DashboardPage /> },

        // Applications & queues
        { path: 'applications', element: <ApplicationsListPage /> },
        { path: 'applications/:id', element: <ApplicationDetailPage /> },
        { path: 'myworkitems', element: <PlaceholderPage eyebrow="Applications" title="My Work Items" description="Unassigned / Assigned / Waiting list tabs for case ownership." /> },
        { path: 'exploreapplications', element: <PlaceholderPage eyebrow="Applications" title="Explore Applications" description="Advanced multi-criteria search across all applications." /> },
        { path: 'suspensions', element: <PlaceholderPage eyebrow="Applications" title="Suspensions" description="Suspension rules, duration and CEO task assignment." /> },
        { path: 'whitemailremainder', element: <PlaceholderPage eyebrow="Applications" title="White Mail Reminder" description="Physical permit reminder pipeline (6 tabs)." /> },
        { path: 'physicalpermission', element: <PlaceholderPage eyebrow="Applications" title="Physical Permission" description="Physical permit issuing & tracking (6 tabs)." /> },

        // Applicants
        { path: 'applicants', element: <ApplicantsPage /> },

        // Users
        { path: 'systemusers', element: <SystemUsersPage /> },
        { path: 'roleandpermission', element: <RolesPage /> },

        // Permission Setup
        { path: 'builder', element: <BuilderListPage /> },
        { path: 'builder/new', element: <BuilderDesignPage /> },
        { path: 'builder/:id', element: <BuilderDesignPage /> },
        { path: 'builder/:id/:tab', element: <BuilderDesignPage /> },
        { path: 'groups', element: <BuilderGroupsPage /> },
        { path: 'pricing', element: <PlaceholderPage eyebrow="Permission Setup" title="Pricing" description="Standard, Min-Incremental, Fixed Duration and Import pricing tabs." /> },
        { path: 'purchasereason', element: <PlaceholderPage eyebrow="Permission Setup" title="Purchase Reason" description="Reason codes for permit purchase (list + import)." /> },

        // Templates
        { path: 'documenttypes', element: <PlaceholderPage eyebrow="Templates" title="Document Types" description="Document types + preview." /> },
        { path: 'termsandcondition', element: <PlaceholderPage eyebrow="Templates" title="Terms and Condition" description="T&C templates + builder." /> },
        { path: 'alertsandtooltips', element: <PlaceholderPage eyebrow="Templates" title="Alerts and Tooltips" description="Cookie / Experian / Correspondence / Customer notification content." /> },
        { path: 'emails', element: <PlaceholderPage eyebrow="Templates" title="Emails" description="Email templates linked to permission events." /> },

        // Area
        { path: 'streets', element: <StreetsPage /> },
        { path: 'zones', element: <ZonesPage /> },
        { path: 'locations', element: <LocationsPage /> },
        { path: 'baylist', element: <BayListPage /> },
        { path: 'SpecialEvents', element: <SpecialEventsPage /> },

        // Reports
        { path: 'reports', element: <Navigate to="/reports/application" replace /> },
        { path: 'reports/address', element: <PlaceholderPage eyebrow="Reports" title="Address Report" description="Power BI embedded — address-level metrics." /> },
        { path: 'reports/application', element: <ReportsPage /> },
        { path: 'reports/financial', element: <PlaceholderPage eyebrow="Reports" title="Financial Report" description="Power BI embedded — revenue & payment tracking." /> },
        { path: 'reports/voucher', element: <PlaceholderPage eyebrow="Reports" title="Voucher Report" description="Power BI embedded — voucher distribution & redemption." /> },
        { path: 'reports/print', element: <PlaceholderPage eyebrow="Reports" title="Print Report" description="Print-optimised PDF export view." /> },

        // Governance / Config
        { path: 'systemaudits', element: <PlaceholderPage eyebrow="Governance" title="System Audits" description="Audit log across all modules (user / entity / date filters)." /> },
        { path: 'contractsettings', element: <ContractSettingsPage /> },
        { path: 'formbuilder', element: <PlaceholderPage eyebrow="Configuration" title="Form Builder" description="Formio dynamic form renderer (SSR-disabled in real app)." /> },
      ],
    },
  ],
  { basename }
);
