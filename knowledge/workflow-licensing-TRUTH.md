# Workflow TRUTH — Licensing

> **Source:** `CommonEnum.cs` L561 → `TypeOfPermission.Licensing = 2`
> **UI implementation:** **NONE** — enum-only; future feature
> **Controllers:** **NONE** — no `LicensingController.cs` exists in `MNPS-Permission-RestAPI`

## Status: Not implemented

Licensing exists **only as a value in the `TypeOfPermission` enum**. There is:

- ❌ No `LicensingController` in the REST API
- ❌ No `licensing` route in the UI
- ❌ No `Licensing*.tsx` component anywhere in `MNPS-Permission-UI` or Customer Portal
- ❌ No DB tables prefixed with `Licensing`
- ❌ No test cases for it in the 882 indexed ADO test cases

## Implication for the QA agent

If a user asks me to write tests for **Licensing**, I must:
1. Politely stop and clarify — "Licensing is enum-only today, with no UI or API behind it. Did you mean a different permission type?"
2. Do NOT generate placeholder tests that will fail silently.
3. Suggest the user check `MNPS Contract Settings → Apply Settings` to see if Licensing has been enabled for any contract — it currently is not enabled on `AutomationApplyIQ`.

## If/when implemented

The enum value `2` is reserved, so when the feature lands it will fit the same plumbing as Permit:
- Workflow likely follows the default `ApplicationAction` state machine.
- Will probably get its own controller `LicensingController.cs` mirroring `DispensationController`.
- Will need a Permission Builder type entry per contract.

Re-run `TRContractStateProbe` after any deployment to detect the feature appearing in `contractPermissionType`.
