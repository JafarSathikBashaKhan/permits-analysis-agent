# Bulk Actions Patch Plan

## Pages Fixed ✓
- ✓ ApplyConfigPage.tsx - removed "coming soon" toasts
- ✓ VehiclesPage.tsx - added bulk actions (Delete, Export)
- ✓ ApplicationsListPage.tsx - added bulk actions (Approve, Reject, Delete)
- ✓ ApplicationDetailPage.tsx - fixed "coming soon" edit button
- ✓ ApplicantsPage.tsx - added bulk actions (Email, Reset Password, Delete) + fixed edit button
- ✓ DashboardPage.tsx - already complete (no list, dashboard only)
- ✓ NotificationsPage.tsx - already complete (custom list, not DataGrid)

## Pages Needing Bulk Actions (DataGrid but no bulk toolbar)
1. SystemUsersPage.tsx - need: Deactivate, Invite, Delete
2. RolesPage.tsx - need: Delete, Duplicate
3. ZonesPage.tsx - need: Publish/Unpublish, Delete
4. LocationsPage.tsx - need: Delete, Export
5. BayListPage.tsx - need: Delete, Export
6. SpecialEventsPage.tsx - need: Delete, Archive
7. BuilderListPage.tsx - need: Publish/Unpublish, Clone, Delete
8. GroupsPage.tsx - need: Delete
9. DocumentTypesPage.tsx - need: Delete, Assign
10. TermsAndConditionPage.tsx - need: Delete, Publish
11. EmailsPage.tsx - need: Delete, Set Default
12. PrintList.tsx - need: Send to Print, Download
13. PrintQueuePage.tsx - need: Cancel Print, Reprint
14. PricingPage.tsx - need: Delete, Export
15. SuspensionsPage.tsx - need: Approve, Reject, Delete
16. PurchaseReasonPage.tsx - need: Delete
17. SystemAuditsPage.tsx - need: Export, Delete
18. MyWorkItemsPage.tsx - need: Assign, Complete, Delete

## Non-list pages (no DataGrid, already complete or detail-only)
- BuilderDesignPage.tsx (form page, no list)
- ContractSettingsPage.tsx (settings page, no list)
- FormBuilderPage.tsx (builder page, no list)
- HomePage.tsx (dashboard, no list)
- AlertsAndTooltipsPage.tsx (check if has DataGrid)
- Report pages (check individually)
