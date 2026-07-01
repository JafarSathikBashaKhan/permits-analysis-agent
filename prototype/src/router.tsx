import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from './layout/AppLayout';
import { HomePage } from './modules/home/HomePage';
import { BuilderListPage } from './modules/builder/BuilderListPage';
import { BuilderGroupsPage } from './modules/builder/BuilderGroupsPage';
import { BuilderDesignPage } from './modules/builder/BuilderDesignPage';
import { ApplicationsListPage } from './modules/applications/ApplicationsListPage';
import { ApplicationDetailPage } from './modules/applications/ApplicationDetailPage';
import { UsersLandingPage } from './modules/users/UsersLandingPage';
import { RolesPage } from './modules/users/RolesPage';
import { SystemUsersPage } from './modules/users/SystemUsersPage';
import { ApplicantsPage } from './modules/users/ApplicantsPage';
import { StreetsPage } from './modules/area/StreetsPage';
import { ZonesPage } from './modules/area/ZonesPage';
import { LocationsPage } from './modules/area/LocationsPage';
import { SpecialEventsPage } from './modules/area/SpecialEventsPage';
import { ContractSettingsPage } from './modules/contractsettings/ContractSettingsPage';
import { PrintQueuePage } from './modules/print/PrintQueuePage';
import { ReportsPage } from './modules/reports/ReportsPage';

// Router basename follows the Vite base path so the app works both at the
// site root (dev) and under a sub-path (e.g. /permits001 on Azure).
const rawBase = ((import.meta as any).env?.BASE_URL as string) || '/';
const basename = rawBase.replace(/\/$/, '') || '/';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AppLayout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'home', element: <Navigate to="/" replace /> },
        { path: 'builder', element: <BuilderListPage /> },
        { path: 'builder/groups', element: <BuilderGroupsPage /> },
        { path: 'builder/:id', element: <BuilderDesignPage /> },
        { path: 'builder/:id/:tab', element: <BuilderDesignPage /> },
        { path: 'applications', element: <ApplicationsListPage /> },
        { path: 'applications/:id', element: <ApplicationDetailPage /> },
        { path: 'users', element: <UsersLandingPage /> },
        { path: 'users/roles', element: <RolesPage /> },
        { path: 'users/system', element: <SystemUsersPage /> },
        { path: 'users/applicants', element: <ApplicantsPage /> },
        { path: 'area/streets', element: <StreetsPage /> },
        { path: 'area/zones', element: <ZonesPage /> },
        { path: 'area/locations', element: <LocationsPage /> },
        { path: 'area/special-events', element: <SpecialEventsPage /> },
        { path: 'contract-settings', element: <ContractSettingsPage /> },
        { path: 'print', element: <PrintQueuePage /> },
        { path: 'reports', element: <ReportsPage /> },
      ],
    },
  ],
  { basename }
);

