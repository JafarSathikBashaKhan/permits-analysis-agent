import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from './layout/AppLayout';
import { HomePage } from './modules/home/HomePage';
import { BuilderListPage } from './modules/builder/BuilderListPage';
import { GroupsPage } from './modules/builder/GroupsPage';
import { BuilderDesignPage } from './modules/builder/BuilderDesignPage';
import { PricingPage } from './modules/pricing/PricingPage';
import { PurchaseReasonPage } from './modules/purchasereason/PurchaseReasonPage';
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
import { DocumentTypesPage } from './modules/templates/DocumentTypesPage';
import { TermsAndConditionPage } from './modules/templates/TermsAndConditionPage';
import { AlertsAndTooltipsPage } from './modules/templates/AlertsAndTooltipsPage';
import { EmailsPage } from './modules/templates/EmailsPage';
import { MyWorkItemsPage } from './modules/workqueue/MyWorkItemsPage';
import { ExploreApplicationsPage } from './modules/workqueue/ExploreApplicationsPage';
import { PhysicalPermissionPage } from './modules/print/PhysicalPermissionPage';
import { WhiteMailReminderPage } from './modules/print/WhiteMailReminderPage';
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
        { path: 'myworkitems', element: <MyWorkItemsPage /> },
        { path: 'exploreapplications', element: <ExploreApplicationsPage /> },
        { path: 'suspensions', element: <PlaceholderPage eyebrow="Applications" title="Suspensions" description="Suspension rules, duration and CEO task assignment." /> },
        { path: 'whitemailremainder', element: <WhiteMailReminderPage /> },
        { path: 'physicalpermission', element: <PhysicalPermissionPage /> },

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
        { path: 'groups', element: <GroupsPage /> },
        { path: 'pricing', element: <PricingPage /> },
        { path: 'purchasereason', element: <PurchaseReasonPage /> },

        // Templates
        { path: 'documenttypes', element: <DocumentTypesPage /> },
        { path: 'termsandcondition', element: <TermsAndConditionPage /> },
        { path: 'alertsandtooltips', element: <AlertsAndTooltipsPage /> },
        { path: 'emails', element: <EmailsPage /> },

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
