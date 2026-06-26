# Workflow TRUTH — Suspension

> **Source:** `CommonEnum.cs` L561 → `TypeOfPermission.Suspension = 3`
> Category enum: `TypeOfPermissionCategory.Suspension = 6`
> **Controllers:** `SuspensionController.cs`, `SuspensionApplicationController.cs`, `SuspensionPricingController.cs`
> **UI:** `MNPS-Permission-UI/src/app/(pages)/applications/page.tsx` (same page, type-conditional rules) + `suspensions/CeoTask/CeoTaskHistory.tsx` + `components/customFormio/suspensionDetails/SuspensionDetails.tsx`
> **NOT enabled on AutomationApplyIQ** — see contract-state-AutomationApplyIQ.md.

## What is a Suspension?
Suspension = a request to temporarily reserve / "freeze" parking on a street or bay (e.g. for a film shoot, road works, a moving van). It is approved by a CEO (Civil Enforcement Officer) who physically inspects the location.

## Lifecycle (CEO-task driven — unique to Suspension)

```
Applicant submits → PendingApproval
        ↓
   AssignTaskToCEO  ⇐  BO Manager clicks button; opens panel; one CEO or broadcast
        ↓
   CEO inspects on-site (mobile / Illumin8) → CEOTask created
        ↓
   ┌─── CompleteSuspensionTask ───→ Approved → Active
   │
   ├─── CancelSuspensionTask ────→ stays Active (task cleared; user can re-assign)
   │
   └─── CancelUserTask ──────────→ task cancelled (admin override)
        ↓
   Active → CEO updates EndDate (mid-suspension) → Active
        ↓
   Active → Suspension period elapses → Expired → Closed
   Active → Cancel (admin only — `cancel` button visible ONLY when Active+Suspension) → Cancelled
```

## Per-type button rules (from `applications/page.tsx` L1196-1207)

When `isSuspensionType = true`:

| Button | Visible? |
|---|---|
| `reinstate` | ❌ hidden |
| `reactivate` | ❌ hidden |
| `suspend` (the action to suspend) | ❌ hidden (you ARE a suspension, can't suspend yourself) |
| `cancel` (default) | ❌ hidden |
| **`cancelSuspensionTask`** | ✅ visible **only when status==Active** |
| `more` menu | ❌ hidden when status==Active |
| `assignTaskToCEO` | ✅ visible |

## Key API endpoints (verified)

| Action | Method | URL |
|---|---|---|
| Submit suspension | POST | `api/SuspensionApplication/Contract/{cId}/PermissionType/{ptId}` |
| Assign task to one CEO | POST | `api/Suspension/Contract/{cId}/Application/{aId}/AssignTaskToCEO` |
| Create CEO task (broadcast) | POST | `api/Suspension/Contract/{cId}/Application/{aId}/CEOTask` |
| Validate CEO logged in | GET | `api/Suspension/Contract/{cId}/Application/{aId}/ValidateCEOLoggedIn` |
| CEO completes task | POST | `api/Suspension/Application/{aId}/User/{uId}/CompleteSuspensionTask` |
| Cancel CEO task (BO) | POST | `api/Suspension/Contract/{cId}/Application/{aId}/CancelSuspensionTask` |
| Cancel user task | POST | `api/Suspension/Application/{aId}/User/{uId}/CancelUserTask` |
| Cancel from BO global | POST | `api/Suspension/CancelUserTaskFromBackOffice` |
| Get CEO task detail | GET | `api/Suspension/Contract/{cId}/CEOTask/{ceoTaskId}` |
| CEO notifications | GET | `api/Suspension/Contract/{cId}/Notifications` |
| Mark notification read | PUT | `api/Suspension/Contract/{cId}/Application/{aId}/Notification/{nId}/Read` |
| Mark all read | PUT | `api/Suspension/Contract/{cId}/Notifications/ReadAll` |
| Download CEO task report | GET | `api/Task/{taskId}/Contract/{cId}/DownloadCEOTaskReport` |
| **Update end date mid-suspension** | PUT | `api/SuspensionPricing/Contract/{cId}/Application/{aId}/EndDate` |
| Update start date | PUT | `api/SuspensionApplication/{aId}/Contract/{cId}/StartDate` |

## Vehicle management on suspension

| Action | Method | URL |
|---|---|---|
| List vehicles | GET | `api/SuspensionApplication/Contract/{cId}/Application/{aId}/Vehicle` |
| Add vehicle | POST | `api/SuspensionApplication/Contract/{cId}/Application/{aId}/Vehicle` |
| Update vehicle | PUT | `api/SuspensionApplication/ApplicationVehicle/{id}/Contract/{cId}/Application/{aId}/Vehicle` |
| Delete vehicle | DELETE | `api/SuspensionApplication/ApplicationVehicle/{id}/Contract/{cId}/Vehicle` |

## Pricing (per-bay)

`SuspensionPricing` controller exposes:
- `GET api/SuspensionPricing/Duration` — duration multipliers
- `GET api/SuspensionPricing/PricingRule` — pricing rule types
- `GET api/SuspensionPricing/Contract/{cId}/BayType` — bay types for this contract
- `GET api/SuspensionPricing/Contract/{cId}/Permission/{pId}` — pricing for a builder
- `POST api/SuspensionPricing/Contract/{cId}/Permission/{pId}/BayPricing` — set bay pricing
- `GET api/SuspensionPricing/Contract/{cId}/Permission/{pId}/Reasons` — suspension reasons list

Suspension pricing is set up under **Permission Builder → Pricing → Suspension** (POST `api/Pricing/Contract/{cId}/Suspension`).

## UI components

| File | Purpose |
|---|---|
| `suspensions/CeoTask/CeoTaskHistory.tsx` | History of CEO tasks for an application |
| `applications/AssignTaskToCEO/AssignTaskToCEO.tsx` | Side panel — select CEO or broadcast |
| `components/customFormio/suspensionDetails/SuspensionDetails.tsx` | Suspension custom form (Form.io extension) |
| `builder/(permissionBuilder)/SuspensionSettings.tsx` | Builder tab for suspension-specific config |
| `builder/(permissionBuilder)/SuspensionPricingRules.tsx` | Bay-type pricing rules |

## Roles that matter
- **CEO** (Civil Enforcement Officer) — receives tasks, completes them on-site
- **BO Manager** — assigns tasks, can cancel
- **Contract Admin** — sets up pricing rules + bay types
