# Prerequisite Chain TRUTH — "What must exist before you can buy a permit"

> **Purpose:** Every time the user or agent creates Permission Builder or runs a Buy Now test, the **exact** prerequisite order matters. This doc is the single source.
> **Contract under test:** AutomationApplyIQ (already configured — most steps below are SKIP-able). See [`contract-state-AutomationApplyIQ.md`](./contract-state-AutomationApplyIQ.md).

## The ordered chain

```
1. Apply Contract exists              ← AutomationApplyIQ (contractId=12134) ✅
2. Permission Type enabled            ← Road Permit / DMTest Permission / New Permission ✅
3. Permission Group created           ← " Resident Group" (id=231) ✅ [⚠ leading space]
4. Terms & Conditions template        ← (verify in Templates module; not in current probe)
5. Town / Postcode reference          ← /api/Street/.../Towns + /PostCodes (read-only lookups) ✅
6. Street with USRN + Property w/UPRN ← 31 streets exist ✅
7. Zone created + streets mapped      ← Only id=1671 is Published ⚠
8. Location created + properties mapped (zonal flows only)
9. Pricing structure
   ├─ Standard pricing
   ├─ Tier pricing (if Contract Settings toggle on)
   ├─ Diesel surcharge (if toggle on)
   └─ Admin fee per permission (0-1000)
10. Document Types configured         ← (returns 200 — read body for list)
11. Document Categories               ← 204 No Content on AutomationApplyIQ ⚠
12. Permission Builder
    ├─ Basic Information (Name, Type, Group, Category, Description)
    ├─ General Settings (Special Event, Start Date Policy, Days Selection, Retention, T&C, Mode, Admin Fee)
    ├─ Payment Settings
    ├─ Rules (Refund, Max Vehicles, Min/Max Duration, Permit Limits)
    ├─ Pricing (linked from #9)
    ├─ Vehicles (which Autoguru fields are required)
    ├─ Zones (must include a Published zone from #7)
    ├─ Templates (T&C from #4, Doc Types from #10)
    ├─ Renewals (auto/manual config)
    ├─ Special Events (if Special Event toggle on)
    └─ Single / Multi Select custom fields
13. Publish Permission Builder        ← Only Published builders show in Buy Now
14. Applicant exists with address in #7's zone
15. Buy Now → pick permission → Address → Documents → Vehicles → Price → Checkout
```

## Validation rules surfaced along the chain

| If you skip… | …Builder UI / API error |
|---|---|
| 3 Group | Type dropdown loads but Group dropdown empty → cannot proceed past Basic Info |
| 4 T&C | General Settings T&C dropdown empty → cannot save |
| 7 Zone | Builder → Zones tab empty → publish fails with `"This zone is not mapped to any streets. Please map streets before publishing."` |
| 9 Pricing | Builder publish blocked → "Pricing not configured" |
| 13 Publish | Buy Now grid does not include the permission |
| 14 Applicant zone | Buy Now Address tab → red error "address not in a serviced zone" |

## Cascading dropdown contract (Builder → Basic Info)

From `BasicInformation.tsx` L424-540 + `BuilderController` L34, L166:

```
[Type] selected (e.g. "Road Permit")
        ↓ triggers GET api/Builder/Contract/{cId}/PermitType/{typeId}/PermissionGroups
[Group] dropdown populates
        ↓ user selects a group; resolve group.groupType === 'Zone' ? true : false → isZonal
        ↓ triggers GET api/Builder/Contract/{cId}/PermissionType/{typeId}/PermissionCategories?isZonal={bool}
[Category] dropdown populates
```

**Tests MUST wait** between each selection — categories are AJAX-loaded after group selection. Use `2s + NetworkIdle` wait.

## Per-type prerequisite delta

| Type | Extra prereqs |
|---|---|
| Permit (Visitor) | Visitor Portal Settings configured (BO file `VisitorPortalSettings.tsx`) |
| Permit (Resident) | Standard chain |
| Permit (Scratch Card) | Scratch Card book/bundle setup |
| Suspension | Bay Types + Suspension Pricing Rules + at least one CEO user assigned |
| Dispensation | None extra (lightweight) — Group should be Non-Zonal |
| Exemption | None extra (shares Permit pipeline) |
| Licensing | **Not implementable today** — enum-only |

## Quick-start data on AutomationApplyIQ (already exists, reuse don't recreate)

| Asset | Use |
|---|---|
| Type `Road Permit` (id=1) | for new Permit builders |
| Group ` Resident Group` (id=231) | reuse — DON'T type plain "Resident Group" |
| Builder `Resident Permission` (id=1493, Published) | reuse for Buy Now happy path |
| Zone id=1671 (Published) | only zone safe to map a new builder to |
| 31 existing streets | reuse for Buy Now Address step |
