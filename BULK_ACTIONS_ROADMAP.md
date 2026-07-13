# Prototype Bulk Actions Implementation - Complete Pattern Guide

## ✅ Pages Completed (6 of 38)

### Phase 1 - Critical User-Facing Pages ✓
1. **ApplicationsListPage** - Bulk Approve, Reject, Delete
2. **ApplicationDetailPage** - Fixed "coming soon" edit button
3. **ApplicantsPage** - Bulk Email All, Reset Password, Delete
4. **VehiclesPage** - Bulk Export, Delete
5. **ApplyConfigPage** - Removed all "coming soon" toasts
6. **SystemUsersPage** - Bulk Send Invitation, Deactivate, Delete

### Non-List Pages (Already Complete, No DataGrid)
- DashboardPage (dashboard view, no list)
- NotificationsPage (custom list component, not DataGrid)
- BuilderDesignPage (form page, no list)
- ContractSettingsPage (settings form, no list)
- FormBuilderPage (drag-drop builder, no list)
- HomePage (landing page, no list)

## 🔧 Standard Implementation Pattern

Every DataGrid list page follows this pattern:

### Step 1: Imports
```typescript
import { Card, CardContent } from '@mui/material';
import { GridRowSelectionModel } from '@mui/x-data-grid';
```

### Step 2: State
```typescript
const [selection, setSelection] = useState<GridRowSelectionModel>([]);
```

### Step 3: Bulk Handlers (after existing handlers, before columns definition)
```typescript
const handleBulkAction1 = () => {
  setRows((prev) => prev.map((r) => selection.includes(r.id) ? { ...r, field: 'newValue' } : r));
  showToast(`${selection.length} row(s) actioned`, 'success');
  setSelection([]);
};

const handleBulkDelete = () => {
  setRows((prev) => prev.filter((r) => !selection.includes(r.id)));
  showToast(`${selection.length} row(s) deleted`, 'success');
  setSelection([]);
};
```

### Step 4: Bulk Toolbar (after search/filter Card, before DataGrid)
```typescript
{selection.length > 0 && (
  <Card sx={{ mb: 2, bgcolor: '#EAF3FB' }}>
    <CardContent>
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography sx={{ fontWeight: 600, color: '#0D3E66' }}>
          {selection.length} row(s) selected
        </Typography>
        <Button variant="outlined" size="small" startIcon={<Icon />} onClick={handleBulkAction1}>Action 1</Button>
        <Button variant="outlined" size="small" color="error" startIcon={<DeleteOutline />} onClick={handleBulkDelete}>Delete</Button>
      </Stack>
    </CardContent>
  </Card>
)}
```

### Step 5: DataGrid Props
```typescript
<DataGrid
  rows={filtered}
  columns={columns}
  checkboxSelection
  rowSelectionModel={selection}
  onRowSelectionModelChange={setSelection}
  // ... other props
/>
```

## 📋 Remaining Pages (32 pages)

### High Priority - User Management & Core Workflows
1. **RolesPage** - Bulk: Delete, Duplicate
2. **MyWorkItemsPage** - Bulk: Assign, Complete, Delete
3. **ExploreApplicationsPage** - Bulk: Assign, Export

### Medium Priority - Builder & Area Management
4. **BuilderListPage** - Bulk: Publish/Unpublish, Clone, Delete
5. **GroupsPage** - Bulk: Delete, Assign Permissions
6. **ZonesPage** - Bulk: Publish/Unpublish, Delete
7. **LocationsPage** - Bulk: Delete, Export
8. **BayListPage** - Bulk: Delete, Export
9. **SpecialEventsPage** - Bulk: Delete, Archive

### Medium Priority - Templates & Configuration
10. **DocumentTypesPage** - Bulk: Delete, Assign to Permissions
11. **TermsAndConditionPage** - Bulk: Delete, Publish/Unpublish
12. **EmailsPage** - Bulk: Delete, Set as Default
13. **AlertsAndTooltipsPage** - Bulk: Delete, Enable/Disable

### Low Priority - Print & Reports
14. **PrintList** - Bulk: Send to Print, Download
15. **PrintQueuePage** - Bulk: Cancel Print, Reprint
16. **PhysicalPermissionPage** - Bulk: Mark Dispatched, Download
17. **WhiteMailReminderPage** - Bulk: Send Reminder, Mark Sent

### Low Priority - Financial & Specialized
18. **PricingPage** - Bulk: Delete, Export
19. **SuspensionsPage** - Bulk: Approve, Reject, Delete
20. **PurchaseReasonPage** - Bulk: Delete, Enable/Disable

### Low Priority - System & Reporting
21. **SystemAuditsPage** - Bulk: Export, Delete (older than N days)
22. **ApplicationReportPage** - Bulk: Export, Schedule
23. **FinancialReportPage** - Bulk: Export, Email
24. **AddressReportPage** - Bulk: Export
25. **PrintReportPage** - Bulk: Export
26. **VoucherReportPage** - Bulk: Export

## 🎯 Domain-Specific Bulk Actions by Page

| Page | Suggested Bulk Actions |
|------|----------------------|
| RolesPage | Delete, Duplicate Role |
| MyWorkItemsPage | Assign to Me, Mark Complete, Delete |
| BuilderListPage | Publish, Unpublish, Clone, Delete |
| GroupsPage | Delete, Assign to Permissions |
| ZonesPage | Publish, Unpublish, Delete |
| LocationsPage | Delete, Export to CSV |
| DocumentTypesPage | Delete, Assign to Permission Type |
| TermsAndConditionPage | Publish, Unpublish, Delete |
| EmailsPage | Delete, Set as Default Template |
| PrintList | Send to Print, Download PDFs |
| PrintQueuePage | Cancel Print Job, Retry/Reprint |
| SuspensionsPage | Approve, Reject, Cancel, Delete |
| SystemAuditsPage | Export (CSV/PDF), Delete (older than 90 days) |
| Report Pages | Export to Excel/PDF, Schedule Email |

## ⚡ Quick Implementation Script

For any remaining page, follow these 5 steps:

1. **Add imports** (top of file):
   ```typescript
   import { Card, CardContent } from '@mui/material';
   import { GridRowSelectionModel } from '@mui/x-data-grid';
   ```

2. **Add state** (with other useState hooks):
   ```typescript
   const [selection, setSelection] = useState<GridRowSelectionModel>([]);
   ```

3. **Add handlers** (after existing save/delete handlers):
   ```typescript
   const handleBulkX = () => {
     // Your logic here
     showToast(`${selection.length} row(s) X'd`, 'success');
     setSelection([]);
   };
   ```

4. **Add toolbar** (after filter Card, before DataGrid):
   ```tsx
   {selection.length > 0 && (
     <Card sx={{ mb: 2, bgcolor: '#EAF3FB' }}>
       <CardContent>
         <Stack direction="row" spacing={2} alignItems="center">
           <Typography sx={{ fontWeight: 600, color: '#0D3E66' }}>
             {selection.length} selected
           </Typography>
           <Button variant="outlined" size="small" onClick={handleBulkX}>Action</Button>
         </Stack>
       </CardContent>
     </Card>
   )}
   ```

5. **Update DataGrid**:
   ```tsx
   <DataGrid
     checkboxSelection
     rowSelectionModel={selection}
     onRowSelectionModelChange={setSelection}
   />
   ```

## 🧪 Testing Checklist

For each page after implementation:

- [ ] Select single row → bulk toolbar appears
- [ ] Select multiple rows → count updates
- [ ] Click bulk action → state mutates, toast shows, selection clears
- [ ] Verify persistence (refresh page → changes persist via usePersistentState)
- [ ] TypeScript: `npx tsc --noEmit` passes
- [ ] No console errors in browser

## 📊 Progress Summary

- **Total Pages**: 38
- **Completed**: 6 (15.8%)
- **Remaining**: 32 (84.2%)
- **Pattern Established**: ✅ Fully documented
- **TypeScript Errors**: 0
- **"Coming Soon" Toasts Removed**: 6 pages

## 🚀 Next Steps

1. **High Priority** (RolesPage, MyWorkItemsPage, ExploreApplicationsPage) - directly impacts core user workflows
2. **Medium Priority** (Builder & Area pages) - impacts setup and configuration
3. **Low Priority** (Reports & specialized pages) - less frequently used

All patterns are now established. Each remaining page is a 5-minute copy-paste exercise following the Standard Implementation Pattern above.
