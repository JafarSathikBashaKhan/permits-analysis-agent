# Module: Permission Setup → Builder

## Purpose

Builder is where Super Admins and Contract Admins **create, configure, clone,
publish, unpublish, and delete** permissions (permits / licences / suspensions /
exemptions / taxi cards) for a contract.

A permission only appears in the Buy Now flow once it is **Published**.

## URL

`/permissions/builder`

## Top-level structure

The Builder detail screen has **4 inner top tabs**:

| Tab | Owns |
| --- | --- |
| **PERMISSIONS** | Identity, settings, payment, discounts, documents, merchant, renewals, emails |
| **RULES** | Eligibility rules, limits, durations |
| **PRICING** | Standard / tiered / surcharge / admin fee |
| **APPLICATION FORM** | Buy Now form configuration (which fields/tabs the applicant sees) |

## PERMISSIONS tab — left-rail sub-sections

| # | Sub-section | Documented |
| --- | --- | --- |
| 1 | Basic Information | ✅ [basic-information.md](permissions/basic-information.md) |
| 2 | General Settings | ✅ [general-settings.md](permissions/general-settings.md) |
| 3 | Permission Label | ⏳ |
| 4 | Payment Settings | ⏳ |
| 5 | Discount Settings | ⏳ |
| 6 | Document Type Settings | ⏳ |
| 7 | Merchant Settings | ⏳ |
| 8 | Renewals and Reminders | ⏳ |
| 9 | Email Templates | ⏳ |

## Top-right actions (detail screen)

| Button | Visible when |
| --- | --- |
| Cancel | Always — discards changes (shows "unsaved" confirmation if dirty, see L-007) |
| SAVE DRAFT | Always |
| PUBLISH | When permission is in Draft state |
| UNPUBLISH | When permission is currently Published |
| Kebab (⋮) | List row only — Clone / Unpublish / Version History / Delete |

## Permission lifecycle

```
                  ┌─────────────┐
                  │   Create    │
                  └──────┬──────┘
                         │
                         ▼
   ┌──────────┐    ┌──────────┐    ┌──────────────┐
   │  Draft   │───▶│ Published│───▶│ Unpublished  │
   └────┬─────┘    └──────────┘    └──────────────┘
        │                ▲
        │     Clone      │
        └────────────────┘
```

- **Draft** — editable, not visible in Buy Now
- **Published** — visible in Buy Now, edits create a new Draft version (history kept)
- **Unpublished** — was published, now hidden; can be re-published

## Roles with access

| Role | What they can do |
| --- | --- |
| Super Admin | Full CRUD + publish/unpublish on all permissions |
| Contract Admin | Full CRUD + publish/unpublish on their contract |
| BO Manager | View + (configurable) edit |
| Read Only | View only |

## Key user stories

| Story | What it covers |
| --- | --- |
| US-132566 | Builder list screen |
| US-156658 | Clone permission |
| US-157621 | Unpublish permission |
| _Many others_ | See `doc/US-*` for full list |
