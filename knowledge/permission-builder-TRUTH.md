# Permission Builder — Ground Truth (From Source Code)

## Two Forms Exist (but only ONE is currently used)

### 🟡 LEGACY: `PermissionBuilderForm.tsx` (Side Panel — NOT IN USE)
Old create form with: Name, Type, Group, Description (no Category)

### 🟢 CURRENT: `BasicInformation.tsx` inside full Edit page (USED for BOTH Create and Edit)
- Opens when clicking "+ New Permission" → `onRowClickFromList({}, false)` in `page.tsx:2847`
- Full page with tabs: PERMISSIONS, RULES, PRICING, APPLICATION FORM
- Header buttons: Cancel, SAVE DRAFT, PUBLISH

## Basic Information Fields (in order)

| Field | Required | DOM Selector | Notes |
|-------|----------|--------------|-------|
| Permission Name | ✅ | `id='permissionName'` placeholder `"Enter Permission Name"` | Max 100 chars |
| Type | ✅ | `data-testid='permissionTypeAutoComplete'` | Triggers Group fetch |
| Group | ✅ | `data-testid='permissionGroupAutoComplete'` | Filtered by Type; triggers Category fetch via `groupType` |
| Category | ⚠️ UI required, **API nullable** | `data-testid='permissionCategoryAutoComplete'` | Depends on Group's `groupType` |
| Description | ❌ Optional | `id='description'` placeholder `"Enter Description"` | Max 500 chars, multiline (5 rows) |

## API Endpoints (used by Create form)

```
GET  Permission/Contract/{contractId}/ContractPermissionTypes         → Type list
GET  Builder/Contract/{contractId}/PermitType/{typeId}/PermissionGroups → Group list (filtered by Type)
GET  ...PermissionCategoryList?isZonal=true/false                    → Category list (depends on group.groupType)
POST Builder/Contract/{contractId}/PermissionBuilder                  → Create
PUT  Builder/{permId}/Contract/{contractId}/PermissionBuilder         → Update
```

## API Request Body (POST PermissionBuilder)
```json
{
  "PermissionName": "string (required)",
  "Description": "string?",
  "PermissionTypeId": "long (required)",
  "PermissionGroupId": "long (required)",
  "PermissionCategoryId": "long? (NULLABLE — can submit without!)",
  "PermissionDraftJson": "string?",
  ...other tab JSONs
}
```

## Cascading Dependencies (CRITICAL for automation)

```
User picks TYPE
  ↓ triggers API: getPermissionGroupsList (filters by typeId)
  ↓ updates: selectedGroupList state
User picks GROUP
  ↓ stores: selectedGroupDatail.groupType (Zone | NonZonal | etc)
  ↓ triggers useEffect (line 168) → fetchPermissionCategoryData(groupType)
  ↓ API: getPermissionCategoryList?isZonal=<group.groupType === 'Zone'>
  ↓ updates: permissionCategoryData
User picks CATEGORY
  ↓ no further cascade
```

## Special Rules
- If Type = "Dispensation" → Category filtered to `['car park', 'dispensation', 'suspension']`
- After PUBLISH, Type/Group become disabled (line 470, 494: `disabled={... status === 'published'}`)
- If Group has pricing draft → Type/Group disabled (`hasPricingDraftJson?.length > 0`)

## Toast Messages
| Action | Message |
|--------|---------|
| Create success (legacy form) | "New Permission Created Successfully" |
| Create success (page.tsx:1625) | "Permission Builder created successfully." |
| Update success (page.tsx:673) | "Permission Builder updated successfully." |
| Duplicate name | "The permission name already exists." |
| No groups for type | "No groups yet. Create a group for this type." |
| Generic error | "Something went wrong. Please try again" |

## Cancel Dialog
- Content: "Are you sure you want to cancel?"
- Buttons: **No** (text/outlined) and **Yes** (contained)
- Only shows if `isInputChanged()` returns true

## Test Strategy (FINAL)
1. Click "New Permission" → wait for full page with PERMISSIONS tab
2. Fill `#permissionName`
3. Click `[data-testid="permissionTypeAutoComplete"]` → pick "Road Permit" (has groups)
4. **Wait for API:** `getPermissionGroupsList` response
5. Click `[data-testid="permissionGroupAutoComplete"]` → pick first group
6. **Wait for API:** `getPermissionCategoryList` response
7. Click `[data-testid="permissionCategoryAutoComplete"]` → pick a category (or skip — API allows null)
8. Fill `#description` (optional)
9. Click "SAVE DRAFT"
10. Wait for toast: "Permission Builder created successfully."
