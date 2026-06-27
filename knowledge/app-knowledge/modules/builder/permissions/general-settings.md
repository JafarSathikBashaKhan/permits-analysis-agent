# Builder → Permissions → General Settings

> Second sub-section of the Permissions tab. Captures operational defaults
> for the permission: dates, retention, prefix, T&Cs, permit medium,
> applicant fields, and admin fee.
>
> This page has the **most fields** of any sub-section in Permission Builder
> (~16 inputs).

---

## Location

| Path | Value |
| --- | --- |
| **Menu** | Permission Setup → Builder |
| **URL** | `/permissions/builder` (same as Basic Information — left rail switches the section) |
| **Inner tab** | PERMISSIONS |
| **Left-rail sub-section** | General Settings |
| **Source file** | `src/app/(pages)/builder/(permissionBuilder)/GeneralSettings.tsx` |

---

## Fields (in screen order)

| # | Field | UI Label | Type | Default | Required? |
| --- | --- | --- | --- | --- | --- |
| 1 | Special Event | **Special Event** | Radio: Enable / Disable | Disable | ✅ |
| 2 | Start Date Policy | **Start Date Policy** | Dropdown (API-driven) | — (placeholder: `Select`) | ✅ Required (loaded from `permissionBuilder.GetStartDatePolicy` API) |
| 3 | Permit Days Selection | **Permit Days Selection** | Radio: Enable / Disable | Disable | ✅ |
| 4 | Retention Period Expired Permits | **Retention Period Expired Permits** ⓘ | Number + `Days` suffix | `90` (NOT 7 — code default; screenshot showed an edited state) | ✅ Must be ≥ 0 |
| 5 | Prefix | **Prefix** ⓘ | Text input | — (placeholder: `Enter Prefix`) | ✅ Required on Publish (not on Save Draft — per Sprint 9 decision, line 597) |
| 6 | Terms and Conditions | **Terms and Conditions** | Dropdown (loaded from `templates.termsAndConditionTemplateRetrival` API) | — (placeholder: `Select`) | ✅ Required |
| 7 | Display Description | **Display Description** *(optional)* | Textarea, **max 1000 chars** | `Purchase your permission with ease` | ⬜ Optional |
| 8 | Permit Mode | **Permit Mode** | Radio: Virtual Permit / Physical Permit / Both | none (`defaultPermitMode`) | ✅ Required |
| 9 | Back Office Use | **Back Office Use** | Checkbox | `false` | ⬜ |
| 10 | VAT Applicable | **VAT Applicable** | Checkbox | `false` | ⬜ |
| 11 | Hours of Operation | **Hours of Operation** | Checkbox | `false` | ⬜ |
| 12 | Enable Experian Check | **Other Settings** *(optional)* → Enable Experian Check | Checkbox | `false` | ⬜ |
| 13 | Business Name | **Other Settings** *(optional)* → Business Name | Checkbox | `false` | ⬜ |
| 14 | Business Address | **Other Settings** *(optional)* → Business Address | Checkbox | `false` | ⬜ |
| 15 | Comment Box | **Comment Box** | Checkbox | `false` | ⬜ |
| 16 | Admin fee for Permission | **Admin fee for Permission** *(optional)* | £ Number input, **max 1000, 2 decimals** | `0.00` | ⬜ Optional |

### Field-level notes (from observation + earlier research)

- **Special Event = Enable** → likely reveals a "Special Event" dropdown elsewhere (already documented in the existing PageObject: `General_SpecialEventDropdown` with placeholder `Select`). Confirm.
- **Permit Days Selection = Enable** → likely reveals days-of-week checkboxes. Confirm.
- **Retention Period** — the ⓘ tooltip explains it; default 7 days.
- **Prefix** — the ⓘ tooltip explains it. Validated for uniqueness on Publish.
- **Permit Mode** — drives whether the permission can be issued virtually, physically (printed), or both. Likely interacts with Print module.
- **Back Office Use** — checked means only BO users can issue this permission (not visible in Buy Now / Customer Portal). Confirm.
- **VAT Applicable** — drives pricing calc to add VAT. Confirm rate source (Contract Settings?).
- **Hours of Operation** — likely opens a time-window editor when checked. Confirm.
- **Enable Experian Check** — checked means applicant identity will be verified via Experian on apply. Gated by Contract Settings → Experian toggle (cross-module dep).
- **Business Name / Business Address** — when checked, the apply form will show those fields to the applicant. Mostly used for business permits.
- **Comment Box** — when checked, the apply form shows a free-text comment field for applicants.
- **Admin fee** — added on top of the calculated price at checkout. 0–1000 per the global business rules.

---

## Selectors (from UI inventory)

Confirmed unique selectors so far:

| Field | Selector | Unique? |
| --- | --- | --- |
| Admin Fee input | `#adminFeeForPermission` / `[placeholder='Enter Admin Fee']` | ✅ Unique |
| Prefix input | `[placeholder='Enter Prefix']` | ✅ Unique (likely) |
| Retention Period input | needs scoping — likely `input[type='number']` near "Retention Period" label | ❓ |
| Display Description textarea | `[placeholder='Purchase your permission with ease']`? or generic textarea — needs DOM check | ❓ |

Selectors still to confirm by re-scanning `GeneralSettings.tsx` after we look at the DOM:
- All radio groups (use `name='specialEvent' value='enable|disable'` pattern that already works on existing PageObject)
- All 7 checkboxes (Back Office Use, VAT, Hours, Experian, Business Name, Business Address, Comment Box)
- Start Date Policy dropdown
- Terms and Conditions dropdown
- Permit Mode 3 radios

**Recommended approach:** generate selectors from the inventory's existing
`GeneralSettings` component data (23 elements catalogued). If gaps exist,
record DOM via a one-time scan with the page open.

---

## Behavioural rules

### Required-field validations (on Save Draft / Publish)
- Special Event radio (one of Enable/Disable must be selected — Disable is default so usually invisible)
- Start Date Policy
- Permit Days Selection radio
- Retention Period (positive integer, not blank)
- Prefix (not blank + unique on publish)
- Terms and Conditions
- Permit Mode (one of three radios must be picked)

### Conditional reveals (when Enable is picked)
| Toggle | Reveals |
| --- | --- |
| Special Event = Enable | Special Event selector dropdown (managed under Contract Settings → Special Events) |
| Permit Days Selection = Enable | Days-of-week checkboxes (Mon–Sun) |
| Hours of Operation checked | Time-window editor (start/end time per day) |

### Cross-module dependencies
| Setting | Affected by | Affects |
| --- | --- | --- |
| Enable Experian Check | Contract Settings → Experian toggle (must be on contract-wide) | Apply flow → identity check step |
| VAT Applicable | Contract Settings → VAT % | Pricing tab + Buy Now price |
| Permit Mode | Contract Settings → Print Partner toggle (for Physical/Both) | Print module → "Send to Print" eligibility |
| Business Name / Address | none | Buy Now apply form → shows extra fields |
| Comment Box | none | Buy Now apply form → free-text field |

---

## Top-right actions (same as Basic Information)

Cancel / SAVE DRAFT / PUBLISH / kebab. Same unsaved-changes confirmation if dirty (L-007).

---

## Validation messages (all source-verified from `GeneralSettings.tsx`)

| Trigger | Message | Source line |
| --- | --- | --- |
| Any required field empty on Save Draft / Publish | `This field is required` | 877, 898, 917, 961, 983, 1060, 1109, 1137, 1154, 1188, 1240 |
| Prefix contains non-alphanumeric / starts with digit | `Alphanumeric only allowed` | 556, 729 |
| Prefix not unique on Publish | `Prefix cannot be duplicate` | (cross-validated server-side) |
| Prefix + Name + Special Events all duplicate | `"Permission Name, Prefix and Special Events" cannot be duplicate.` | (server-side) |
| Admin Fee > 1000 or < 0 | `Amount must be between 0 and 1000.` | 471, 491 |
| Display Description > 1000 chars | (input is blocked at 1000) | 566 |

### Prefix rules (source-verified)
- **Tooltip text:** *"Enter a unique alphanumeric prefix up to 10 characters. This prefix will appear at the start of the application number (e.g., 'RP' in RP-8XF93Z2K)."* (line 266)
- **Max length:** 10 chars (`maxLength={10}` line 1105)
- **Regex:** `/^[a-zA-Z][a-zA-Z0-9]*$/` — must **start with a letter**, then letters/digits only (line 704)
- **Trimmed** on input (line 544)
- **Save Draft skips Prefix required check** (Sprint 9 decision — line 597 comment) — only Publish enforces

### Retention Period rules (source-verified)
- **Tooltip text:** *"Enter the number of days expired permits should remain visible after their expiry date. For example, if set to 7, expired permits will be displayed for 7 days before being hidden from the system view. Enter 0 to hide them immediately upon expiry."* (line 264)
- **Default value:** `90` days (line 70 + 192). Screenshot showed `7` which was an edited state.
- **Min:** 0 (0 = hide immediately)
- **Max:** no explicit cap

### Admin Fee rules (source-verified)
- **Default:** `0.00` (line 74)
- **Range:** 0–1000 inclusive
- **Decimals:** max 2 (auto-truncated, line 483)
- **Non-numeric input is silently ignored** (no error, line 500 comment)

### Display Description rules (source-verified)
- **Default:** `'Purchase your permission with ease'` (matches screenshot)
- **Max length:** 1000 chars (input blocked at 1001, line 1155)
- **Optional** — explicitly labelled `(optional)` in UI

### Start Date Policy (source-verified)
- **API-driven:** options loaded from `APIEndPoints.permissionBuilder.GetStartDatePolicy` (line 271)
- The actual values come from the server — to enumerate them in tests, hit that API or capture once during recording

### Terms and Conditions dropdown (source-verified)
- **API-driven:** options loaded from `APIEndPoints.templates.termsAndConditionTemplateRetrival` (line 232)
- Sourced from the Templates module (Templates → Terms & Conditions)

### Special Event (source-verified)
- Default: `'disable'` (line 88)
- When `'enable'`, a separate Special Event dropdown is revealed — values managed in Contract Settings → Special Events

### Permit Days Selection (source-verified)
- State key: `isDaysSelectionEnabled` (default `'disable'`, line 92)
- When `'enable'`, day-of-week selectors are revealed (need source dive into the conditional block to confirm exact UI)

---

## Test scenarios for this page

| # | Scenario | Type |
| --- | --- | --- |
| GS-01 | All required fields empty → Save Draft → 7 inline errors | Negative |
| GS-02 | Special Event = Enable reveals Special Event dropdown | Conditional |
| GS-03 | Special Event dropdown is required when Enabled | Negative |
| GS-04 | Permit Days Selection = Enable reveals day-of-week checkboxes | Conditional |
| GS-05 | Hours of Operation checked reveals time-window editor | Conditional |
| GS-06 | Retention Period defaults to 7 days | Sanity |
| GS-07 | Retention Period = 0 → validation fails | Negative |
| GS-08 | Prefix duplicate within contract → Publish blocked with exact error | Negative |
| GS-09 | Permit Mode required (no default) | Negative |
| GS-10 | Permit Mode = Virtual hides Print eligibility downstream | Cross-module |
| GS-11 | Permit Mode = Physical/Both shows Print eligibility downstream | Cross-module |
| GS-12 | Enable Experian Check disabled if Contract Settings → Experian = OFF | Cross-module |
| GS-13 | VAT Applicable checked → price calc on Pricing tab includes VAT | Cross-module |
| GS-14 | Business Name/Address checked → Buy Now form shows extra fields | Cross-module |
| GS-15 | Comment Box checked → Buy Now form shows free-text field | Cross-module |
| GS-16 | Admin fee 0–1000 accepted | Boundary |
| GS-17 | Admin fee > 1000 → validation fails | Negative |
| GS-18 | Admin fee non-numeric → cannot enter / validation fails | Negative |
| GS-19 | Save Draft persists all fields and reloads them correctly | Round-trip |
| GS-20 | Display Description (optional) saves blank without error | Positive |

---

## Open questions (mostly source-verified — only behavioural ones remain)

_Source-verified answers above; only true business/behavioural questions remain here:_

1. ✅ **Start Date Policy** — required, options from `permissionBuilder.GetStartDatePolicy` API. Enumerate by hitting the API.
2. ✅ **Terms and Conditions** — required, options from `templates.termsAndConditionTemplateRetrival` API (Templates module owns them).
3. ❓ **Special Event Enable dropdown source** — likely Contract Settings → Special Events. Need DOM/API confirm.
4. ❓ **Permit Days Selection Enable reveals what exactly** — code key `isDaysSelectionEnabled` toggles; need the conditional render block to confirm UI (probably 7 day-of-week checkboxes).
5. ❓ **Hours of Operation checkbox reveals what** — likely a time-window editor; needs source dive into the conditional block.
6. ❓ **Back Office Use** — does checking it actually hide the permission from Buy Now / Customer Portal? (business behaviour)
7. ❓ **VAT Applicable** — where is VAT % set? (Contract Settings? Hardcoded?)
8. ❓ **Comment Box** — what does the applicant see and where?
9. ✅ **Admin Fee:** 0–1000 inclusive, 2 decimals, default 0.00. (source-verified)
10. ✅ **Prefix:** max 10 chars, must start with letter, alphanumeric only, trimmed, required on Publish (not Save Draft). (source-verified)
11. ✅ **Retention Period:** default 90 days, min 0 (0 = hide immediately on expiry). No explicit max. (source-verified)
12. ✅ **Display Description:** max 1000 chars, default `'Purchase your permission with ease'`. (source-verified)
