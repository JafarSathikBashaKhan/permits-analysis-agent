# Test Scenarios — US-125847: Grid View of Street | White List

## Test Suite: Street Grid View

### TC-001: Verify page title
- **Steps:** Navigate to Area → Streets
- **Expected:** Page title shows "Streets"

### TC-002: Verify Import button visible
- **Steps:** Navigate to Area → Streets
- **Expected:** "IMPORT" button is visible (UI only, no action expected)

### TC-003: Verify "+ New Street" button visible
- **Steps:** Navigate to Area → Streets
- **Expected:** "+ NEW STREET" button is visible and clickable

### TC-004: Verify White List and Black List tabs
- **Steps:** Navigate to Area → Streets
- **Expected:** Two tabs visible — "WHITE LIST" (active by default) and "BLACK LIST"

### TC-005: Verify search by street name
- **Steps:** Type a known street name in the search box
- **Expected:** Grid filters to show matching streets

### TC-006: Verify grid columns
- **Steps:** Navigate to Area → Streets (White List tab)
- **Expected:** Columns displayed:
  - Selection Checkbox
  - Street Name
  - No. Of Properties
  - Created On
  - Created By
  - Updated On
  - Updated By
  - Status
  - Actions

### TC-007: Verify Status values
- **Steps:** Check Status column for different streets
- **Expected:**
  - "Active" — street has active permission associated
  - "Inactive" — no active permission associated

### TC-008: Verify pagination
- **Steps:** Create more streets than the page size (default 10)
- **Expected:** Pagination controls visible (rows per page, page numbers, next/prev)

### TC-009: Verify column sorting
- **Steps:** Click on a column header (e.g., "Street Name")
- **Expected:** Grid sorts by that column (asc/desc toggle)

### TC-010: Verify column filtering
- **Steps:** Use column filter options
- **Expected:** Grid filters results based on selected criteria

### TC-011: Verify selection checkbox per row
- **Steps:** Click checkbox on a street row
- **Expected:** Row is selected/highlighted

### TC-012: Verify "Select All" checkbox
- **Steps:** Click the header checkbox
- **Expected:** All visible rows are selected

### TC-013: Verify Actions column
- **Steps:** Click the action menu (⋮) on a street row
- **Expected:** Context menu appears with CRUD options

---

## Automation Coverage

| Test Case | Automated | Script |
|-----------|-----------|--------|
| TC-001 | ✅ | `permit_agent_master.js` (captures grid) |
| TC-006 | ✅ | `permit_agent_master.js` (captures columns) |
| TC-008 | 🔲 | Planned |
| TC-009 | 🔲 | Planned |
