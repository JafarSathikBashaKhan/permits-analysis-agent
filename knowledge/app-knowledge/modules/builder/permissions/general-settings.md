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
| 2 | Start Date Policy | **Start Date Policy** | Dropdown | — (placeholder: `Select`) | ❓ (likely required) |
| 3 | Permit Days Selection | **Permit Days Selection** | Radio: Enable / Disable | Disable | ✅ |
| 4 | Retention Period Expired Permits | **Retention Period Expired Permits** ⓘ | Number + `Days` suffix | `7` | ✅ |
| 5 | Prefix | **Prefix** ⓘ | Text input | — (placeholder: `Enter Prefix`) | ✅ (must be unique on publish — see Basic Information validation messages) |
| 6 | Terms and Conditions | **Terms and Conditions** | Dropdown | — (placeholder: `Select`) | ❓ (likely required) |
| 7 | Display Description | **Display Description** *(optional)* | Textarea | `Purchase your permission with ease` | ⬜ Optional |
| 8 | Permit Mode | **Permit Mode** | Radio: Virtual Permit / Physical Permit / Both | none | ✅ |
| 9 | Back Office Use | **Back Office Use** | Checkbox | unchecked | ⬜ |
| 10 | VAT Applicable | **VAT Applicable** | Checkbox | unchecked | ⬜ |
| 11 | Hours of Operation | **Hours of Operation** | Checkbox | unchecked | ⬜ |
| 12 | Enable Experian Check | **Other Settings** *(optional)* → Enable Experian Check | Checkbox | unchecked | ⬜ |
| 13 | Business Name | **Other Settings** *(optional)* → Business Name | Checkbox | unchecked | ⬜ |
| 14 | Business Address | **Other Settings** *(optional)* → Business Address | Checkbox | unchecked | ⬜ |
| 15 | Comment Box | **Comment Box** | Checkbox | unchecked | ⬜ |
| 16 | Admin fee for Permission | **Admin fee for Permission** *(optional)* | £ Number input | — (placeholder: `Enter Admin Fee`) | ⬜ Optional |

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

## Validation messages

| Trigger | Message |
| --- | --- |
| Required field empty on save | `This field is required.` |
| Prefix not unique on Publish | `Prefix cannot be duplicate` |
| Prefix + Name + Special Events all duplicate | `"Permission Name, Prefix and Special Events" cannot be duplicate.` |
| Retention Period = 0 or negative | ❓ to confirm |
| Admin Fee > 1000 | ❓ to confirm (rule says 0–1000) |
| Admin Fee with non-numeric | ❓ to confirm |

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

## Open questions (please confirm)

1. ❓ Is **Start Date Policy** required? What are its options? (e.g. "From application date", "From approval date", "Fixed date"?)
2. ❓ Is **Terms and Conditions** required? Where are the T&C templates managed? (Templates → Terms and Conditions?)
3. ❓ When **Special Event = Enable**, where do the Special Event options come from? (Contract Settings → Special Events configuration?)
4. ❓ When **Permit Days Selection = Enable**, what gets revealed exactly? (7 day-of-week checkboxes? A range picker?)
5. ❓ When **Hours of Operation** is checked, what UI appears? (Start/end time picker per day? Single global window?)
6. ❓ **Back Office Use** — does checking it actually hide the permission from Buy Now / Customer Portal?
7. ❓ **VAT Applicable** — where is the VAT rate set? (Contract Settings? Hardcoded?)
8. ❓ **Comment Box** — what does the applicant see? (Free text "Comments" field on Buy Now Documents tab? Application form?)
9. ❓ **Admin Fee** — exact min/max (0–1000?), decimals allowed?
10. ❓ **Prefix** — max length? Character restrictions (letters only? letters+digits?)
11. ❓ **Retention Period** — max value? What does it actually retain after expiry (data? PII? document?)
12. ❓ **Display Description** — max length? Where is it shown to the applicant?
