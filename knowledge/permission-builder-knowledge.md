# Permission Builder - Complete Knowledge Base

## Module Overview
**Navigation:** Permission Setup → Builder (left sidebar menu)
**Access:** Super Admin, Contract Admin only

---

## 1. BUILDER LIST SCREEN (US-132566)

### Grid Columns (Default)
| Column | Description |
|--------|-------------|
| Permission Name | Clickable → opens config screen |
| Type | Permission type (Permit, Visitor, Suspension, etc.) |
| Status | "Draft" or "Published" |
| Actions | Three-dot menu (⋮) |

### Column Picker (non-default, hidden by default)
- Created by (user name)
- Created on (date + time)
- Updated by (user name)
- Updated on (date + time)

### Actions Menu (three dots ⋮)
For **Draft** permissions:
- Clone
- Publish
- Version History
- Delete

For **Published** permissions:
- Clone
- **Unpublish** (replaces Publish)
- Version History
- Delete

### Features
- **Global Search**: Searches by Permission Name, Type, Group
- **Column Filter**: Hamburger icon per column → filter input
- **Sorting**: Click column header → Asc → Desc → Clear
- **Pagination**: Default pagination applied
- **Create Button**: "+ NEW PERMISSION" button

---

## 2. CREATE PERMISSION (US-132611)

### UI Behavior
- Clicking "+ NEW PERMISSION" opens a **right-side slider panel** (per story) OR navigates to detail page (per real UI observation)
- Fields are **required** for creation

### Fields
| Field | Type | Validation |
|-------|------|-----------|
| Permission Name | Free text | Max 100 chars, no duplicates |
| Type | Dropdown | Lists types from contract level (default + custom) |
| Group | Dropdown | Depends on Type selection — shows groups for selected type |
| Description | Alphanumeric + special chars | Max 500 chars |

### Type Options (from contract level)
- Permit
- Visitor
- Suspension
- License
- Exemption
- Car Permits
- Dispensation
- (+ any custom types created at contract)

### Group Dependency
- When Type is selected → Group dropdown populates with groups associated with that type
- If no groups exist for selected type → Error: "No groups yet. Create a group for this type."

### Buttons
- **Create / Save Draft** → saves as Draft status
- **Cancel** → confirmation popup: "Are you sure you want to cancel? As this will reset the data on the screen and close it" → Confirm/Cancel

### Success/Error Messages
- Success: "New Permission Created Successfully"
- Duplicate name: "The permission name already exists."
- No group for type: "No groups yet. Create a group for this type."
- Empty required field: "This field is required"
- Technical error: "Something went wrong Please try again"

---

## 3. PERMISSION CONFIGURATION SCREEN (US-135720)

### Navigation After Creating/Opening Permission
- Breadcrumb: **Builder > $PermissionName**
- Clicking "Builder" in breadcrumb → returns to list screen

### 3 Main Tabs
1. **Permissions** (default)
2. **Rules**
3. **Application Form**

### Top Action Buttons
- Cancel
- SAVE DRAFT
- PUBLISH (if Draft) / UNPUBLISH (if Published)

---

## 4. PERMISSIONS TAB - Sub Menus/Sections (US-135718)

Left sidebar navigation within Permissions tab (fixed order):
1. **Basic Information** (US-139062)
2. **General Settings** (US-132390, US-138267, US-138832, US-137750, US-135721, US-165020)
3. **Payment Settings** (US-135723)
4. **Discount Settings** (US-25058)
5. **Document Type Settings** (US-25067)
6. **Merchant Settings** (US-25030)
7. **Expiration and Renewals** (US-142840, US-177544)
8. **Email Templates** (US-143764)
9. **Operation Criteria** (Special Event - US-143256)
10. **Visitor Portal (VRN only) Setting** (US-160551) — only for Visitor group

---

## 5. PERMISSIONS TAB → BASIC INFORMATION (US-139062)

Same fields as Create:
| Field | Type | Validation |
|-------|------|-----------|
| Permission Name | Free text | Max 100 chars, unique |
| Type | Dropdown | Contract-level types |
| Group | Dropdown | Filtered by selected Type |
| Description | Alphanumeric + special chars | Max 500 chars |

**Auto-Save**: When switching tabs/sections, field values auto-save.

---

## 6. PERMISSIONS TAB → GENERAL SETTINGS

### Start Date Settings (US-132390)
| Field | Type | Options/Validation |
|-------|------|-------------------|
| Start Date Policy | Dropdown (Mandatory) | Issue Now, Backdated to Start of Month, Backdated to Start of Application, Forward to Set Date |
| Include Time | Checkbox | Enabled only when "Forward to Set Date" selected |
| Start Date Delay | Numeric (Mandatory) | 0–100, default 0 |

### Prefix (US-135721)
| Field | Type | Validation |
|-------|------|-----------|
| Prefix | Text (Mandatory for publish) | Alphanumeric only, max 10 chars, no special chars, unique per contract |
- Tooltip: "Enter a unique alphanumeric prefix up to 10 characters..."
- Duplicate error: "This prefix is already in use for another permission type"

### Terms & Conditions (US-135717)
- Dropdown showing templates configured under "Terms and Conditions" type
- Filtered by permission type
- Alphabetical order
- If none configured → dropdown empty

### Display Description (US-138832)
- Editable text field
- Max 1000 characters
- Mandatory for publish
- Default: "Purchase your permission with ease"

### Retention Period (US-137750)
- Numeric field: "Retention Period for Expired Permits (Days)"
- Only positive whole numbers + 0
- Default: 7
- Tooltip explains behavior

### Other Settings (US-138267)
Checkboxes/Toggles:
- Back-office Use
- VAT Applicable
- Hours of Operation
- Business Name
- Enable Experian Check

**Zone Related** (Radio buttons):
- Non-Zonal
- Zonal → shows multi-select zone dropdown
- If Zonal + no zone selected → error: "Please select at least one zone"
- Save Draft allowed without zone; Publish NOT allowed

**Permit Mode** (Checkboxes):
- Physical Permit
- Virtual Permit
- Cannot uncheck BOTH

### Admin Fee (US-165020)
- Numeric field: 0–1000, 2 decimal places
- Overrides contract-level default for this specific permission
- Error if out of range: "Amount must be between 0 and 1000."

---

## 7. PERMISSIONS TAB → PAYMENT SETTINGS (US-135723)

Checkboxes grouped by:

**Online Payment Methods:**
- Use Registered Card
- Pay Now
- Pay After Approval
- Pay Monthly
- Pay Quarterly
- Agent Assist
- Wallet

**Offline Payment Methods:**
- Postal Payment
- Pay on Collection
- Invoice
- Cost Centre / Budget Code

- Save Draft: no restrictions
- Publish: at least one method required → "At least one payment method is required to publish this permission"

---

## 8. PERMISSIONS TAB → DISCOUNT SETTINGS (US-25058)

| Field | Type | Validation |
|-------|------|-----------|
| Blue Badge Discount | Numeric + Radio (Percentage/Currency) | % → 0-100 (1 decimal), Currency → 0-1000 (2 decimals) |
| Pension Discount | Numeric + Radio (Percentage/Currency) | Same as above |

- Default values: 0
- Mandatory for publish
- Save Draft: no validation
- Errors: "Percentage must be between 0 and 100" / "Amount must be between 0 and 1000"

---

## 9. PERMISSIONS TAB → DOCUMENT TYPE SETTINGS (US-25067)

- Grid/table showing document types in rows
- Columns: Document Type Name | Apply | Renew | Vehicle Change | Proof Count
- Checkboxes for Apply/Renew/Vehicle Change
- Proof Count: numeric 1–5, enabled only when at least one checkbox checked, default 1
- Always editable
- Save Draft: no validation
- Publish: at least one document type must be checked/enabled

---

## 10. PERMISSIONS TAB → MERCHANT SETTINGS (US-25030)

| Field | Max Length | Notes |
|-------|-----------|-------|
| Back Office Merchant ID | 30 | Alphanumeric + special chars |
| Back Office Merchant User | 50 | Alphanumeric + special chars |
| Back Office Merchant Password | 20 | Masked, view toggle |
| Customer Merchant ID | 30 | Alphanumeric + special chars |
| Customer Merchant User | 50 | Alphanumeric + special chars |
| Customer Merchant Password | 20 | Masked, view toggle |

- ALL fields **OPTIONAL** for publish
- Save Draft: no validation required

---

## 11. PERMISSIONS TAB → RENEWALS & REMINDERS (US-142840, US-177544)

### Permission Renewal
- Enable/Disable toggle (default: Disabled)
- When enabled:
  - **Renewal Before Expiry**: Frequency (numeric) + Period dropdown
  - **Grace Period After Expiry**: 1–30 days (US-177544)

### Period Dropdown Options & Limits
| Period | Frequency Range |
|--------|----------------|
| Weeks | 1–100 |
| Days | 1–1000 |
| Months | 1–50 |
| Hours | 1–24 |
| Minutes | 1–1000 |

### Email Reminders (US-142854)
- Enable/Disable per reminder
- Up to 6 reminders max
- Each has Frequency + Period
- Same period limits as above
- When checkbox unchecked → fields disabled + cleared

- Save Draft: no validation (even if enabled with empty fields)
- Publish: if enabled, corresponding fields mandatory

---

## 12. PERMISSIONS TAB → EMAIL TEMPLATES (US-143764)

- Dropdown of predefined static event types (37 events listed)
- Select event → shows available global email templates for selection
- Can map multiple events with "Add Event" button
- "Select All" option for bulk event addition
- Warning: "These settings will override the default (global) email templates..."
- NON-MANDATORY for publish (but if event added, template selection IS mandatory)

---

## 13. PERMISSIONS TAB → SPECIAL EVENT (US-143256)

Only visible when Special Event is enabled in General Settings.

Configuration per event set:
- Duration (calendar picker: Start Date, End Date)
- Days (multi-select dropdown, dynamic based on date range)
- Time (From, Until time picker)
- Delete icon per set

Validations:
- Start Date < End Date → "Start date cannot be larger than end date"
- From time < Until time → "Start time must be before end time"
- At least one day selected → "At least one day must be selected"
- Overlapping time ranges → "Time range overlaps with an existing entry for the same day"
- Max 15 event configurations
- Duplicate button (copies existing block)
- Mandatory for publish if special event enabled

---

## 14. PERMISSIONS TAB → VISITOR PORTAL SETTINGS (US-160551)

Only visible for **Visitor permission group**.

Radio buttons (Enable/Disable):
- Visitor Portal access via VRN only
- Allow Back Dates → enables "Back Days Limit" field (max 90, default 1)
- End Session at End of Day

All NON-MANDATORY for publish.

---

## 15. RULES TAB - Sub Menus

1. **Refund Settings** (US-142761)
2. **Auto Approval Settings** (US-25052)
3. **Vehicle Settings** (US-142348)
4. **Template Settings** (US-142384, US-164476)
5. **Permission Limit** (US-142920) — only for Non-Zonal
6. **Zone Mapping** (US-161880) — only for Zonal
7. **Pricing** (US-163010) — linked to Zone Mapping

---

## 16. RULES TAB → REFUND SETTINGS (US-142761)

- **Refund Applicable**: Yes/No radio
- When Yes:
  - Refund Policy dropdown (single select):
    - Only if greater than 6 months
    - Only if greater than 3 months
    - Only if greater than 1 month
    - Only if greater than 3 weeks
    - Only if greater than 2 weeks
    - Only if greater than 1 week
    - Full months remaining
    - Days remaining
    - Unused vouchers
  - Cancellation Charge: Numeric + toggle (Percentage 0–100 / Currency 0–100000, 2 decimals)
- When No → fields hidden/disabled
- Publish: if enabled, all fields mandatory

---

## 17. RULES TAB → AUTO APPROVAL SETTINGS (US-25052)

Checkboxes with help text:
- Auto Approval on Renewal
- Auto Approval on New Applications
- Auto Approval on Change Number Plate Request
- Auto Approval Visitors Permissions

ALL non-mandatory for both Draft and Publish.

---

## 18. RULES TAB → VEHICLE SETTINGS (US-142348)

**Maximum Limit section:**
| Field | Type | Max |
|-------|------|-----|
| VRN Limit | Numeric | 1000 |
| Number Plate Change Limit | Numeric | 100000 |

**Eligible Vehicles for Permission section:**
Multi-select dropdowns (from contract settings toggles):
- Vehicle Type (Bus, Car, HGV, LGV, Motorcycle, Scooter, Van)
- Fuel Type
- CO2 emission (g/km)
- Euro Standard
- Type of engine
- Age of the vehicle
- Number plate tax band
- Number of seats

(Excludes Make, Model, Color even if enabled)

Publish: VRN Limit + Number Plate Change Limit MANDATORY

---

## 19. RULES TAB → TEMPLATE SETTINGS (US-142384, US-164476)

Two template sections:
1. **Physical Permission Print** (US-164476)
   - Upload .docx template (max 1 file)
   - Text editor with merge fields
   - Preview + Download + Zoom
   - Three-dot menu: Replace / Remove
   - Mandatory when Permit Mode = Physical or Both

2. **White Mail Reminder** (US-142384)
   - Dropdown to select from email templates
   - Text editor with merge fields
   - Mandatory when Permit Mode = Physical or Both

---

## 20. RULES TAB → PERMISSION LIMIT (US-142920) — Non-Zonal Only

- Hidden for Zonal groups
- Default: "Unlimited"
- "Set Limit" option → numeric field (1–1000, default 1)
- Help text: "Configure the maximum active permissions allowed per user..."
- Mandatory for publish (if "Set Limit" selected)

---

## 21. RULES TAB → ZONE MAPPING (US-161880) — Zonal Only

- Appears only when permission uses Zone-based group
- "New Zone Set" button → creates Zone Set 1, 2, 3...
- Each zone set: multi-select dropdown of zones (from General Settings)
- Zones unique across sets (no duplicates)
- No limit on zone sets or zones per set
- Delete icon per zone set
- Indicators: "Pricing not configured" / "Pricing Configured"
- Create Zone Set disabled when all zones mapped
- Cannot delete zone set if pricing configured
- At least one zone per set required
- Mandatory: at least one zone set to publish
- Syncs with Pricing Configuration tabs

---

## 22. RULES TAB → PRICING (US-163010)

- "Create Pricing" button (visible when zone sets exist but no pricing)
- "Edit Pricing" button (when pricing partially/fully configured)
- Navigates to separate Pricing screen (pre-populated with Permission Type, Sub-Type, Zone Sets)
- Button disabled if no zone sets configured

---

## 23. APPLICATION FORM TAB (US-179544)

- Template dropdown (Visitor Permit, Resident Permit, Suspension, Dispensation, etc.)
- Preview modal shows template layout
- Edit option → opens Form Builder
- Save Form / Save as Draft
- "Change Template" option with confirmation popup
- Publish: at least 1 application form must be configured → "Configure at least 1 form to publish"

---

## 24. PUBLISH (US-155975) — Mandatory Fields Summary

| Section | Mandatory Fields for Publish |
|---------|------------------------------|
| Basic Information | Permission Name, Type, Group, Description |
| General Settings | Start Date Policy, Prefix, Terms & Conditions, Display Description, Permit Mode; Zone (if zonal selected) |
| Zone Mapping | At least 1 zone set (if zonal) with all zones having pricing |
| Payment Settings | At least 1 payment method |
| Discount Settings | Blue Badge Discount, Pension Discount (default 0) |
| Document Type Settings | At least 1 document type enabled |
| Merchant Settings | OPTIONAL (all fields) |
| Renewals & Reminders | If enabled → Frequency + Period mandatory |
| Email Templates | If event added → template mandatory; otherwise optional |
| Visitor Portal | OPTIONAL |
| Special Event (if enabled) | At least 1 configuration set |
| Vehicle Settings | VRN Limit, Number Plate Change Limit |
| Template Settings | Physical Permit Print + White Mail Reminder (if mode = Physical/Both) |
| Permission Limit | Limit value (if "Set Limit" selected) |
| Pricing | All pricing fields filled |
| Application Form | At least 1 form configured |

### Error Display on Publish
- Red circular badge on section menu with error count
- Parent menu shows sum of child errors
- Badge updates in real-time as errors fixed
- Inline error: "This field is required"

---

## 25. UNPUBLISH (US-157621)

- Button visible only for Published permissions
- Confirmation: "Are you sure you want to unpublish this permission? This will revert it to Draft and prevent new applications."
- Changes status: Published → Draft
- Existing active permits remain valid
- All fields become editable again

---

## 26. CLONE (US-156658)

- Available from Actions menu on any permission
- Confirmation: "Are you sure wish to clone the $PermissionName configuration?"
- Clones all config into new Edit screen (Draft mode)
- NOT saved until "Save Draft" clicked
- Requires unique permission name to save → "Enter a unique permission name to save this clone as draft"
- Cancel clone: "Are you sure you want to discard this cloned permission?" → Yes/No
- Publish validation: Name, Prefix, Special Events cannot be duplicates

---

## 27. DELETE (US-136288)

### Single Delete
- Actions menu → Delete
- Popup: "Delete vehicle. Are you sure you want to delete '$PermissionName'?" → Delete/Cancel
- Success: permission removed from list

### Multi-Select Delete
- Select multiple → Delete button appears
- Popup: "Delete All Permission? Are you sure want to delete all the selected Permissions" → Delete All/Cancel
- Success: "Permissions Deleted successfully"

---

## 28. CROSS-MODULE DEPENDENCIES

| Source Setting | Affects Permission Builder |
|---------------|---------------------------|
| Contract Settings → Vehicle Fields Toggle | Which vehicle fields appear in Vehicle Settings |
| Contract Settings → Diesel Surcharge Toggle | Pricing calculations |
| Contract Settings → Admin Fee default | Default admin fee value |
| Contract Settings → Merchant Settings | Default merchant config |
| Groups (Permission Setup) | Available groups in Type-Group dependency |
| Zones (Area module) | Available zones for Zone Mapping |
| Document Types (Templates) | Available document types in Document Type Settings |
| Terms & Conditions (Templates) | Available T&C templates in General Settings |
| Email Templates (MNPS Template Settings) | Available templates for Email Templates section |
| Pricing (separate module) | Pricing configured for zone sets |

---

## 29. AUDIT EVENTS

| Action | Event Name | Event Description |
|--------|-----------|-------------------|
| Create | Permission Created | Permission Created successfully |
| Publish | Permission Setup Published | $PermissionName Published |
| Unpublish | Permission Unpublished | $PermissionName unpublished and status changed to draft |
| Clone | Permission Setup Cloned | Permission Setup Cloned |
| Delete (single) | Permission Deleted | "$PermissionName" Deleted Successfully |
| Delete (multi) | Permission Deleted | Permissions Deleted Successfully |

All audit entries include: Date/Time, User Role, User Name
