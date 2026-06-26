# Workflow TRUTH — Permit (root type)

> **Source:** `CommonEnum.cs` L561 → `TypeOfPermission.Permit = 1`
> **UI:** `MNPS-Permission-UI/src/app/(pages)/applications/page.tsx` (shared page, no Permit-specific branch — Permit uses the default button set)
> **Backoffice categories:** Visitor (2), Resident (3), Disabled Bay (4), Car Park Non-Zonal (5), Scratch Card (1)
> **Note:** On `AutomationApplyIQ` this type is displayed as **"Road Permit"** (id=1), NOT "Permit".

## Lifecycle (default — no buttons hidden)

```
Applicant submits  →  PendingApproval
        ↓
   InProgress  →  UnderReview  →  Approved  →  AwaitingPayment  →  Paid  →  Active
        ↓                ↓               ↓
   Rejected        Rejected         Rejected
        ↓
   OnHold ↔ OffHold (extend up to 2x — page.tsx L972 `extendCount < 2`)
        ↓
   NFI (AdditionalInfoRequired) → applicant updates → Resume
        ↓
   Active → Renewal Window → AutoRenew | ManualRenew → new Active
        ↓
   Active → Expired (date) | Cancelled (manual) → Closed
   Active → Suspended → Resumed → back to Active
```

## Default action buttons visible (status-driven)

| Status | Visible buttons (BO User+) |
|---|---|
| PendingApproval | Approve, Reject, Cancel, Assign, Note, Email |
| InProgress | Begin Review, Reject, On Hold, NFI, Cancel |
| UnderReview | Approve, Reject, On Hold, NFI |
| AwaitingPayment | Mark Paid, Mark Payment Failed, Cancel |
| Active | Suspend, Cancel, Renew, On Hold, **(NO `cancelSuspensionTask`)** |
| OnHold | Off Hold, Extend Hold (max 2), Cancel |
| Suspended | Resume, Cancel |
| Closed / Expired / Cancelled / Rejected | View-only |

## Key API endpoints (verified from `apiEndPoint.tsx`)

| Action | Method | URL |
|---|---|---|
| Approve | POST | `api/ApplicationAction/Contract/{cId}/Application/{aId}/ActionType/Approve/Action` |
| Reject | POST | same with `ActionType/Reject` |
| On Hold | POST | `…/ActionType/OnHold/Action` |
| Off Hold | POST | `…/ActionType/OffHold/Action` |
| NFI | POST | `…/ActionType/AdditionalInformationRequired/Action` |
| Cancel | POST | `…/ActionType/Cancel/Action` |
| Begin Review | PUT  | `api/ApplicationReview/Contract/{cId}/PermissionType/{ptId}/Application/{aId}/ApplicantUser/{auId}/BeginReview` |

## Category-specific notes

### Visitor
- BO file: `applications/VoucherPermit/VisitorVoucherPermit.tsx`
- Customer Portal: `voucherpermit/VisitorVoucherPermit.tsx`, `voucheractivation/VisitorPermitActivation.tsx`
- Visitor permits use **vouchers** — codes generated for guests to activate.
- Settings exposed via `builder/(permissionBuilder)/VisitorPortalSettings.tsx`.

### Resident
- Standard zone-validated permit. No special UI branch.
- The published `Resident Permission` (id=1493) on AutomationApplyIQ is a Visitor (sic) example — see `contract-state-AutomationApplyIQ.md`.

### Disabled Bay / Car Park / Scratch Card
- Scratch Card (category=1) uses pre-paid booklet flow — purchased via Buy Now → bulk codes.

## Buttons that are HIDDEN for non-Permit types (so they ARE visible here)
- `reinstate`, `reactivate`, `suspend` button itself, `cancel` on suspended row, `more` menu when Active+Suspension, `assignTaskToCEO`
  (see `workflow-by-type-TRUTH.md` for the full hide matrix)
