# Builder → Permissions → Basic Information

> First sub-section of the Permissions tab in Permission Builder. Captures the
> identity of a permission: what it's called, what kind it is, which group and
> category it belongs to, and a free-text description.

---

## Location

| Path | Value |
| --- | --- |
| **Menu** | Permission Setup → Builder |
| **URL** | `/permissions/builder` |
| **Inner tab** | PERMISSIONS |
| **Left-rail sub-section** | Basic Information (first / default) |
| **Source file** | `src/app/(pages)/builder/(permissionBuilder)/BasicInformation.tsx` |
| **Container test-id** | `[data-testid='generalSettings-container']` (reused 2× across app — use with Builder route for uniqueness) |

---

## Purpose

This is **Step 1** when creating a new permission and the **first page** when
editing one. Until all three required dropdowns + Permission Name are filled,
the user cannot meaningfully proceed to General Settings or any later
configuration. Save Draft works from this screen alone if the four required
fields are filled.

---

## Fields

| # | Field | UI Label | Type | Required | Placeholder | Source of values |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Permission Name | **Permission Name** | Text input | ✅ Yes | `Enter Permission Name` | Free text — must be **unique within the contract** |
| 2 | Type | **Type** | Autocomplete dropdown | ✅ Yes | `Select` | Master list from **Contract Settings** (Apply IQ contract). Examples in AutomationApplyIQ: Resident, Visitor, Business, Permit, License |
| 3 | Group | **Group** | Autocomplete dropdown | ✅ Yes | `Select` | **Cascades from Type.** Only Groups created under the selected Type appear. e.g. if Type = Visitor → only Visitor-typed Groups show. Managed under Permission Setup → Groups. |
| 4 | Category | **Category** | Autocomplete dropdown | ✅ Yes | `Select` | Currently observed values in AutomationApplyIQ: `Scratch card`, `Visitor`, `Resident`, `Disabled Bay`, `Resident Exemptions`. (Source/cascade rule not yet confirmed — see Open questions.) |
| 5 | Description | **Description** *(optional)* | Textarea | ⬜ Optional | `Enter Description` | Free text |

The Description label explicitly shows the word `(optional)` next to it — the only optional field on this page.

---

## Selectors (from UI inventory)

| Field | Selector | Unique globally? |
| --- | --- | --- |
| Container | `[data-testid='generalSettings-container']` | ⚠ Reused 2× — scope by being on `/permissions/builder` |
| Permission Name | `#permissionName` | ⚠ Reused 2× — scope to container |
| Permission Name (alt) | `[placeholder='Enter Permission Name']` | ✅ Unique |
| Type dropdown | `[data-testid='permissionTypeAutoComplete']` | ✅ Unique |
| Group dropdown | `[data-testid='permissionGroupAutoComplete']` | ✅ Unique |
| Category dropdown | `[data-testid='permissionCategoryAutoComplete']` | ✅ Unique |
| Description | `#description` | ⚠ Reused 2× — scope to container |
| Description (alt) | `[placeholder='Enter Description']` | ✅ Unique |
| Generic dropdown placeholder | `[placeholder='Select']` | ✅ Unique to Basic Information |

**Recommended POM scoping** (matches `examples/BasicInformationPage.cs`):
```csharp
private readonly ILocator _container =
    _page.Locator("[data-testid='generalSettings-container']").First;

public ILocator PermissionNameInput  => _container.Locator("#permissionName");
public ILocator DescriptionInput     => _container.Locator("#description");
public ILocator TypeDropdown         => _page.Locator("[data-testid='permissionTypeAutoComplete']");
public ILocator GroupDropdown        => _page.Locator("[data-testid='permissionGroupAutoComplete']");
public ILocator CategoryDropdown     => _page.Locator("[data-testid='permissionCategoryAutoComplete']");
```

---

## Behavioural rules

### Create mode
- All five fields enabled
- All dropdowns start empty, show "Select" placeholder
- Type → Group → Category are a strict cascade (parent must be picked first)

### Edit mode (existing permission)
- **Type / Group / Category are DISABLED** — already saved, downstream pages depend on them
- Permission Name and Description remain editable
- Permission Name still validated for uniqueness on save

### Clone mode
- All fields pre-populated from source permission
- All fields **re-enabled** (this is the only way to change Type/Group/Category — by cloning)
- Permission Name must be changed to something unique before Save Draft (see L-007 in Validation messages)

### Cascading dropdowns (Type → Group → Category)
- All three are `<DPSAutoComplete>` components forwarding `dataTestId` → DOM `data-testid`
- Listbox renders in MUI portal: `.MuiAutocomplete-popper .MuiAutocomplete-option`
- **Changing Type clears Group + Category** and rebuilds Group's option list
- **Changing Group clears Category** and rebuilds Category's option list
- After picking an option, the popper must close before the next click (see L-003) — `SelectAutocompleteAsync` in the example POM handles this

---

## Top-right actions (visible from this page)

| Button | Behaviour from Basic Information |
| --- | --- |
| **Cancel** | If form is dirty → "Your work is unsaved. Are you sure want to cancel?" (Yes/No). See L-007. |
| **SAVE DRAFT** | Persists current state. Triggers all field validations + unique-name check. Status becomes Draft. |
| **PUBLISH** | Visible only when permission is in Draft state. Triggers full publish validation (across all sub-sections, not just this one). |
| **UNPUBLISH** | Visible only when permission is currently Published. |

---

## Validation messages

| Trigger | Exact message |
| --- | --- |
| Any required field empty on Save Draft / Publish | `This field is required.` (shown in red under the empty field) |
| Permission Name not unique within contract | (general) Save fails with toast; (clone) `Enter a unique permission name to save this clone as draft.` |
| Publish with duplicate Permission Name across contract | `Permission Name cannot be duplicate.` |
| Publish with duplicate Prefix + Permission Name + Special Events | `"Permission Name, Prefix and Special Events" cannot be duplicate.` |

(Prefix and Special Events live in other sub-sections but their duplicate
messages can fire from a Publish attempted on this page.)

---

## Cross-section dependencies

| If you change… | …it affects |
| --- | --- |
| Type | Group dropdown options + Category dropdown options |
| Group | Category dropdown options |
| Permission Name | Browser tab title, breadcrumb, all list/grid representations |

| Settings outside Basic Information affecting it |
| --- |
| Contract Settings → Permission Types (master list driving Type dropdown) |
| Permission Setup → Groups (defines Group options per Type) |

---

## Related user stories

| ID | Title | Relation |
| --- | --- | --- |
| US-132566 | Permission Setup → Builder list screen | Entry point to this page |
| US-156658 | Permission Setup → Builder Clone | Clone re-enables this page's dropdowns |
| US-157621 | Permission Setup → Builder Unpublish | Lifecycle adjacent |
| (various) | Permission Type / Group / Category management | Owns the dropdown source data |

---

## Test scenarios for this page

| # | Scenario | Type |
| --- | --- | --- |
| BI-01 | Permission Name field is required | Negative |
| BI-02 | Type field is required | Negative |
| BI-03 | Group field is required | Negative |
| BI-04 | Category field is required | Negative |
| BI-05 | Description is optional (form saves with it empty) | Positive |
| BI-06 | Group dropdown is empty until Type is selected | Cascade |
| BI-07 | Category dropdown is empty until Group is selected | Cascade |
| BI-08 | Changing Type clears Group + Category | Cascade |
| BI-09 | Saving with all 4 required fields → status = Draft | Happy path |
| BI-10 | Duplicate Permission Name on same contract → unique-name error | Negative |
| BI-11 | In Edit mode, Type / Group / Category are disabled | Behavioural |
| BI-12 | In Clone mode, Type / Group / Category are re-enabled | Behavioural |
| BI-13 | Cancel with dirty form shows unsaved-changes confirmation | L-007 |

---

## Open questions (still to confirm)

1. ❓ **Max length of Permission Name** — 50? 100? 255? Any character restrictions (e.g. no `/`, `<`, `>`)?
2. ❓ **Max length of Description** — likely 500 or 1000, not confirmed.
3. ❓ **Category source of values** — does Category cascade from Group too, or is it a flat master list? Where is it managed?
4. ❓ **Does Save Draft from this page alone succeed**, or do downstream sub-sections (General Settings, etc.) have their own minimums even for Draft?
5. ❓ **Prefix field location** — confirmed not on this page, but which sub-section owns it? (General Settings? Permission Label?)
6. ❓ **Special characters** in Permission Name — emojis, slashes, unicode?
7. ❓ **What happens to in-flight Applications** if you edit a Published permission's Name?

Add answers here as we learn them.
