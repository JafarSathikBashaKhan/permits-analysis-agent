# Workflow TRUTH — Dispensation

> **Source:** `CommonEnum.cs` L561 → `TypeOfPermission.Dispensation = 4`
> Category enum: `TypeOfPermissionCategory.Dispensation = 7`
> **Controller:** `DispensationController.cs`
> **UI:** `applications/page.tsx` (shared) + `components/customFormio/dispensationDetails/DispensationDetails.tsx`
> **NOT enabled on AutomationApplyIQ** — see contract-state-AutomationApplyIQ.md.

## What is a Dispensation?
Dispensation = a one-off **waiver** from normal parking restrictions for a specific vehicle (e.g. a delivery van that needs to wait in a loading bay longer than allowed). Faster, lighter-touch than a Suspension — no CEO inspection required.

## Lifecycle

```
Applicant submits → PendingApproval
        ↓
   InProgress → Approved → Active
        ↓
   Active → Expires (date-driven) → Closed
   Active → Cancel (admin) → Cancelled
```

Standard application flow — same buttons as Permit **EXCEPT** `assignTaskToCEO` is hidden (no CEO involvement).

## Per-type button rules (from `applications/page.tsx` L1196-1207)

When `isDispensationType = true`:

| Button | Visible? |
|---|---|
| `assignTaskToCEO` | ❌ hidden (no CEO step) |
| `cancelSuspensionTask` | ❌ hidden |
| Everything else | ✅ default visibility |

## Key API endpoints

| Action | Method | URL |
|---|---|---|
| Submit dispensation | POST | `api/Dispensation/Contract/{cId}/PermissionType/{permissionTypeId}` |

The dispensation type then uses the **standard** `ApplicationAction` controller for state transitions (Approve / Reject / Cancel / OnHold / etc.) — no Dispensation-specific workflow endpoints exist.

## UI components

| File | Purpose |
|---|---|
| `components/customFormio/dispensationDetails/DispensationDetails.tsx` | Dispensation custom form fields |
| `components/customFormio/dispensationDetails/DispensationDetailsWrapper.tsx` | Wrapper that registers it with Form.io |

## How Dispensation is built

1. Contract Admin enables Dispensation type via `MNPS Contract Settings → Apply Settings`.
2. Permission Builder created with Type=Dispensation.
3. No pricing tier setup — typically free or flat admin fee.
4. No zone mapping required if Group is set to Non-Zonal.
5. Published → appears in Buy Now under the same dynamic-type grid as everything else.

## Common dispensation scenarios
- Delivery vehicle waiver
- Healthcare visitor (district nurse, etc.)
- Tradesperson short-stay
- Council vehicle exemption (often modelled as Dispensation rather than Exemption)
