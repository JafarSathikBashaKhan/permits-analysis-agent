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
import { SuspensionsPage } from './modules/suspensions/SuspensionsPage';
import { FormBuilderPage } from './modules/formbuilder/FormBuilderPage';
import { AddressReportPage } from './modules/reports/AddressReportPage';
import { ApplicationReportPage } from './modules/reports/ApplicationReportPage';
import { FinancialReportPage } from './modules/reports/FinancialReportPage';
import { PrintReportPage } from './modules/reports/PrintReportPage';
import { VoucherReportPage } from './modules/reports/VoucherReportPage';
import { DashboardPage } from './modules/dashboard/DashboardPage';
import { SystemAuditsPage } from './modules/systemaudits/SystemAuditsPage';
import { VehiclesPage } from './modules/vehicles/VehiclesPage';
import { NotificationsPage } from './modules/notifications/NotificationsPage';
import { ApplyConfigPage } from './modules/applyconfig/ApplyConfigPage';

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
        { path: 'suspensions', element: <SuspensionsPage /> },
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
        { path: 'reports/address', element: <AddressReportPage /> },
        { path: 'reports/application', element: <ApplicationReportPage /> },
        { path: 'reports/financial', element: <FinancialReportPage /> },
        { path: 'reports/voucher', element: <VoucherReportPage /> },
        { path: 'reports/print', element: <PrintReportPage /> },

        // Governance / Config
        { path: 'systemaudits', element: <SystemAuditsPage /> },
        { path: 'contractsettings', element: <ContractSettingsPage /> },
        { path: 'formbuilder', element: <FormBuilderPage /> },

        // Fleet / Alerts / Apply-side config (top-level in real app)
        { path: 'vehicles', element: <VehiclesPage /> },
        { path: 'notifications', element: <NotificationsPage /> },
        { path: 'applyconfig', element: <ApplyConfigPage /> },
      ],
    },
  ],
  { basename }
);
