# Application Workflow — Per Permission Type (TRUTH)

> Source verified: `MNPS-Permission-UI/src/app/(pages)/applications/page.tsx` lines 259-1278.
> 
> CRITICAL INSIGHT: There are NOT 4 separate workflow implementations. There is ONE `applications` page that adapts its action buttons and tabs based on the application's `PermissionType` and `Category`. The differences below are **conditional rules**, not different pages.

---

## TypeOfPermission enum (5 values, from CommonEnum.cs:561)
| Id | Type | UI surface area | Notes |
|----|------|-----------------|-------|
| 1 | **Permit** | Full | Default flow. All standard actions. Visitor / Resident are *Categories* inside Permit. |
| 2 | **Licensing** | ❌ None | Enum exists but NO UI route, NO controller, NO buttons. **Treat as future feature — do NOT test.** |
| 3 | **Suspension** | Dedicated CEO Task page (`/suspensions/CeoTask`) + conditional buttons | Adds AssignTask/TaskAssigned states (30-35). |
| 4 | **Dispensation** | Custom Formio sections (`dispensationDetails`) inside standard `/applications` | Uses standard workflow but hides "Assign Task to CEO". |
| 5 | **Exemption** | Label-branch only in CustomerPortal `Explore.tsx` (line 208) | Behaves like Permit in Back Office. Front-end label difference only. |

---

## How the UI decides type behaviour

```ts
// applications/page.tsx
L259  const isSuspensionType  = selectedMenu?.name?.toLowerCase()?.includes('suspension');
L260  const isDispensationType = selectedMenu?.name?.toLowerCase()?.includes('dispensation');
L1361 const isSuspensionType  = onRowClickData?.categoryName?.toLowerCase() === 'suspension';
```
There are TWO triggers:
1. **Menu name** (top-level sidebar item, e.g. "Suspensions" submenu) → drives the LIST view filter.
2. **categoryName on the selected app** → drives DETAIL view button visibility.

---

## Button-Visibility Matrix (verified per type)

### Permit (Type=1, default)
ALL buttons available per status (no extra restrictions):
| Status | Visible buttons |
|--------|-----------------|
| Pending Approval | approve, reject, cancel, more (on-hold / requestCustomerInformation / requestSupportEvidence / internal-referral) |
| In Progress | approve, reject, more |
| On-Hold | resume, extend-postpone (max 2x), cancel |
| Active | suspend, renew (in renew window), change-zone, change-vehicle, change-address, cancel |
| Waiting for Payment | retry-payment (offline), reject (if offline payment) |
| Payment Failed | retry-payment, cancel |
| Expired | reactivate |
| ExpiredRenewable | renew |
| Cancelled | reinstate |
| Rejected | reinstate |

### Suspension (Type=3) — SPECIAL RULES
Hidden actions (verified lines 1196-1205):
- `reinstate` — **ALWAYS HIDDEN** (status irrelevant)
- `reactivate` — **ALWAYS HIDDEN**
- `suspend` — **ALWAYS HIDDEN** (a suspension can't be suspended)
- `cancel` — **ALWAYS HIDDEN**
- `more` menu — **HIDDEN when Active**
Special action:
- `cancelSuspensionTask` — **ONLY visible** when status=Active AND isSuspensionType
Allowed flow: PendingApproval → Approved → **AssignTask** → **TaskAssigned** → Active → (CancelSuspensionTask → CancelledTaskAssigned). End-of-life states 32, 33 (Expired Assign/Task Assigned).
Conditional tabs (L1364-1367): Documents and Emails tabs hidden unless `isDocumentConfigured`/`isEmailEnabled` set on the application.

### Dispensation (Type=4) — SEMI-SPECIAL
Hidden action (verified line 1207):
- `assignTaskToCEO` — **ALWAYS HIDDEN** (no CEO workflow for dispensation)
Everything else behaves like Permit. Custom `dispensationDetails` form section replaces standard fields.

### Visitor (Category=2 inside Type=1 Permit)
Same workflow as Permit. Visual difference: dedicated `VisitorVoucherPermit.tsx` for **voucher-based** visitor permits. Time-limited per-day vouchers instead of long-term permits.

### Exemption (Type=5)
Same as Permit in Back Office. Customer Portal renders different copy/label only.

---

## Common Workflow Backbone (applies to ALL types)

```
[Buy Now / Back Office Create]
        ↓
PendingApproval (1)  ←──┐
   │                    │
   ├─ approve ──→  Approved (9) ──→ WaitingForPayment (7) ──→ Active (13)
   │                                       │                       │
   │                                       └→ PaymentFailed (8)    │
   │                                                               │
   ├─ reject ──→ Rejected (11)                                    │
   ├─ cancel ──→ Cancelled (16)                                   │
   │                                                               │
   ├─ more > on-hold ──→ OnHold (12) ── resume ──┐                 │
   │                                              ↓                │
   ├─ more > requestCustomerInformation ──→ WaitingForCustomerInformation (4)
   │                                              ↓ evidence
   │                                       EvidenceProvided (6) ──→ back to In Progress
   │
   └─ more > on-hold from InProgress (3) / UnderReview etc.

Active (13)
   ├─ suspend ──→ Suspended (17) ── resume ──→ Active
   ├─ renew    ──→ PendingRenew (27) ──→ Active (new period)
   ├─ change-vehicle ──→ ChangeVehicle (19)
   ├─ change-zone    ──→ ChangeZone (18)
   ├─ change-address ──→ ChangeAddress (20)
   ├─ expiry tick    ──→ DueToBeClosed (15) ──→ Expired (25)
   │                                              ↓
   │                                       ExpiredRenewable (29) ── renew ──→ Active
   │                                       Reactivate (26) ── activate ──→ Active
   └─ cancel ──→ Cancelled (16) ── reinstate ──→ Active
```

Total states: **35** (see `application-workflow-TRUTH.md` for full table).

---

## Common MISTAKES I should catch

| User says… | Reality |
|------------|---------|
| "Suspend a suspension" | ❌ Impossible — `suspend` button hidden for Suspension type. |
| "Cancel a suspension permit" | ❌ Impossible — `cancel` button hidden. Use `cancelSuspensionTask` instead. |
| "Reinstate a suspension" | ❌ Impossible — `reinstate` hidden. |
| "Assign CEO task to dispensation" | ❌ Impossible — `assignTaskToCEO` hidden for Dispensation. |
| "Visitor permit is a separate Type" | ❌ Visitor is a Category (id=2) inside Type=1 (Permit). |
| "Resident permit is a separate Type" | ❌ Resident is also a Category (id=3) inside Type=1 (Permit). |
| "Test Licensing flow" | ⚠️ Licensing has no UI implementation. Enum only. |
| "Apply Exemption permit" | ⚠️ Exemption only renders different labels in Customer Portal Explore; identical to Permit in BO. |
| "Renew a Cancelled permit" | ❌ Must `reinstate` first → Active → then renew. |
| "Extend hold 3 times" | ❌ Hard-coded max 2 times (page.tsx:972 `if (extendCount < 2)`). |
| "Skip Group when creating Builder" | ❌ Group is required. Type cascades to Group. |
| "Skip T&C when publishing Builder" | ❌ T&C is mandatory in General Settings before publishing. |
| "Active permit can skip zone mapping" | ❌ Buy Now address validation rejects if zone unmapped. |
| "Set Permission Limit > 99 per property" | ⚠️ Need to verify — your env said 200, my notes said 0-99. |

---

## Prerequisite Chain (for Buy Now to work)

```
Contract (Apply) 
  ↓
Permission Group (Active, Permit type, Zonal or Non-Zonal)
  ↓
Terms & Conditions (Permit type)  ─┐
Street + Property (USRN/UPRN)      │
  ↓                                 │
Zone (Published, mapped to streets) │
  ↓                                 │
Location (mapped to property)       │
  ↓                                 ↓
Builder (Permission)
  - Basic Info: Name, Type, Group, Category, Description
  - General Settings: T&C (REQUIRED), Permit Mode, Admin Fee, etc.
  - Rules: Refund Settings, Max Vehicles, Duration
  - Pricing: Standard/Tiered + Diesel Surcharge
  - Vehicles: required vehicle fields
  - Zones: map this permission to zones
  - Templates: required document types
  - Payment Settings: which payment methods
  - PUBLISH ─→ becomes available in Buy Now
```

Each step in this chain has its own indexed module. Missing any step → Builder cannot publish OR Buy Now will reject the application.

---

## Files-as-truth (the authoritative source map)

| Question | File to consult |
|----------|----------------|
| What action buttons exist? | `applications/page.tsx` L933-1026 (handleStatusAction) |
| When is each button hidden? | `applications/page.tsx` L1180-1210 (filter) |
| What states exist? | `Infra/Common/CommonEnum.cs` L898-1004 (TypeOfApplicationStatus) |
| What permission types? | `Infra/Common/CommonEnum.cs` L561 (TypeOfPermission) |
| What categories? | `Infra/Common/CommonEnum.cs` L573 (TypeOfPermissionCategory) |
| What permission statuses? | `Infra/Common/CommonEnum.cs` L600 (TypeOfPermissionStatus) |
| Builder Basic Info fields? | `builder/(permissionBuilder)/BasicInformation.tsx` L424-540 |
| Suspension CEO task page? | `app/(pages)/suspensions/CeoTask/CeoTaskHistory.tsx` |
| Dispensation custom form? | `components/customFormio/dispensationDetails/` |
| Visitor voucher flow? | `app/(pages)/applications/VoucherPermit/VisitorVoucherPermit.tsx` |
