# Workflow TRUTH — Exemption

> **Source:** `CommonEnum.cs` L561 → `TypeOfPermission.Exemption = 5`
> **UI implementation:** label-only branching in Customer Portal `Explore.tsx` L208
> **Controllers:** **NONE** — no `ExemptionController.cs`

## Status: Label-only

Exemption is real-but-thin. There is:

- ❌ No `ExemptionController` in the REST API
- ❌ No backoffice `*exemption*.tsx` file
- ✅ Customer Portal `Explore.tsx` L208 branches on type==Exemption to **change a heading/label** ("Apply for Exemption" instead of "Apply for Permit") — but the underlying flow reuses the **standard Permit pipeline**.
- ❌ Not enabled on `AutomationApplyIQ`.

## What this means

An Exemption application:
- Goes through `api/Applicant/{id}/PermissionType/{ptId}/Contract/{cId}/Applications` (the **same** endpoint as a Permit).
- Uses the **standard** `ApplicationAction` state machine (Approve/Reject/etc.).
- Shows the **default** button set on `applications/page.tsx` — no per-type hide rules.
- Is built in Permission Builder the same way as a Permit (type dropdown picks Exemption, group must be Non-Zonal typically).

## When user says "Exemption"
Treat as a Permit clone with a different display label. Do not look for special endpoints — they don't exist.

If a user asks me for Exemption-specific workflow rules I must clarify: *"Exemption shares the Permit workflow exactly. The only difference is the title on the customer-portal apply page. Is that what you wanted, or were you expecting something more like Suspension/Dispensation?"*

## Common Exemption use cases (real-world)
- Resident with permanent disability who needs a free permanent permit
- Council staff vehicle
- Emergency services vehicle
- Anything that **bypasses** the pay step but still gets logged as a permit
