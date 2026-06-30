# Contract State TRUTH — AutomationApplyIQ

> **Source of truth:** live probe against `https://test-permits-restapi.azurewebsites.net`
> **Captured by:** `MNPS.Tests.ApiTests.TRContractStateProbe`
> **Snapshot:** [`contract-state/AutomationApplyIQ.json`](./contract-state/AutomationApplyIQ.json) (29 KB, 12 endpoints, all HTTP 200)
> **Probed at:** 2026-06-26T04:42 UTC
> **Refresh:** re-run `dotnet test --filter TRContractStateProbe` whenever the env changes.

This document is the **agent's authoritative reference** for what is actually
configured in the AutomationApplyIQ contract on the TEST environment. When the
user describes data ("the Resident Group", "the Resident Permission"), the agent
must reconcile against THIS doc, not against the user's free-typed examples.

---

## Contract identity
| Key | Value |
|---|---|
| Name | `AutomationApplyIQ` |
| Id | `12134` |
| Backend | `test-permits-restapi.azurewebsites.net` |
| UI | `nps-backoffice-test-c9bxa6bgg0a7htfn.z01.azurefd.net` |
| **Env-config rule** | `LOGIN_API_URL` in `.env` MUST match the UI environment. UI=TEST + Login=UAT returns 404 on every API. |

---

## 1. Enabled Permission Types (3)

`GET /api/ContractSetting/{contractId}/ContractPermissionType`

| permissionTypeId | permissionTypeName | Root enum (`TypeOfPermission`) |
|---|---|---|
| 1 | **Road Permit** | Permit (1) |
| 3 | **New Permission** | (custom — verify enum mapping) |
| 4 | **DMTest Permission** | (custom — verify enum mapping) |

> ⚠️ **Agent rule:** When user says "Permit" they usually mean **Road Permit** on this contract — not the bare enum. Never type the literal word `Permit` into the Type dropdown unless it actually exists; use the contract-specific display name.
>
> ⚠️ Suspension / Dispensation / Licensing / Exemption types are **NOT enabled** on this contract. Test cases that need them require enabling first.

---

## 2. Permission Groups (2)

`POST /api/Group/Contract/{contractId}/PermissionGroups`

| id | name | groupType | permissionTypeId | isZoneRelated | isBackOfficeUse |
|---|---|---|---|---|---|
| 231 | ` Resident Group` ⚠️ (leading space) | Zone | 1 (Road Permit) | true | false |
| 232 | `TestResidentGroup` | Zone | 66 (NOT in enabled types) | true | false |

> ⚠️ **Data-quality warnings**:
> - Group #231 has a **leading space** in the name. Tests filtering by `"Resident Group"` will miss it. Use exact-match `" Resident Group"` or trim before compare.
> - Group #232 references `permissionTypeId=66` which is NOT in the enabled-types list — likely orphaned after a type was disabled. Do not rely on this group.

---

## 3. Permission Builders (2)

`POST /api/Builder/Contract/{contractId}/PermissionBuilders`

| id | permissionName | type | group | category | status |
|---|---|---|---|---|---|
| 1493 | **Resident Permission** | Road Permit | ` Resident Group` | Resident | **Published** ✅ |
| 1625 | AutoTest_Perm_20260626_091123 | Road Permit | ` Resident Group` | Visitor | Draft |

> ✅ Only **Resident Permission (id=1493)** is Published → it is the only builder available in Buy Now today.
> Builder #1625 is auto-test residue (created by `TRApplyPermissionBuilderCRUD.Order12`).

---

## 4. Zones (5+)

`POST /api/Zone/Contract/{contractId}` — sample first 5:

| id | publishStatus |
|---|---|
| 1676 | Draft |
| 1675 | Draft |
| 1674 | Draft |
| 1673 | Draft |
| **1671** | **Published** ✅ |

> Only id=1671 is currently Published. All Buy Now address-validation must use a property whose street is in this published zone.

---

## 5. Streets

`POST /api/Street/Contract/{contractId}/Search` — **31 streets** captured. Full list in JSON.

---

## 6. Other captured slots (see JSON for full payload)

| Slot | Status | Notes |
|---|---|---|
| `towns` | 200 | Used by Street create autocomplete |
| `postCodes` | 200 | Used by Street create autocomplete |
| `locationStreets` | 200 | Streets mapped to Locations |
| `documentTypes` | 200 | Doc types available for Builder → Documents tab |
| `documentCategories` | **204 No Content** | No categories configured on this contract |
| `contractPermissionSetting` | 200 | Per-contract toggles (USRN/UPRN, Diesel, BlueBadge, etc.) |
| `vehicleSettings` | 200 | Vehicle field requirements |

---

## How to keep this fresh

```powershell
cd C:\Users\jafar.s\Automation_Codes\ApplyIQ\Task_306911\MNPS-Automation-Permission
# Make sure .env LOGIN_API_URL matches the UI env you're probing
dotnet test --filter "FullyQualifiedName~TRContractStateProbe"
# Output: bin\Debug\net8.0\TestResults\contract-state-AutomationApplyIQ.json
```

Copy the resulting JSON over `knowledge/contract-state/AutomationApplyIQ.json`
and update this doc's summary tables.

---

## Cross-references

- **State machine of an application**: [`application-workflow-TRUTH.md`](./application-workflow-TRUTH.md)
- **Per-type button visibility**: [`workflow-by-type-TRUTH.md`](./workflow-by-type-TRUTH.md)
- **Enum source**: `MNPS-Permission-RestAPI/Src/Infra/Common/CommonEnum.cs`
  - `TypeOfPermission` L561 (Permit=1, Licensing=2, Suspension=3, Dispensation=4, Exemption=5)
  - `TypeOfPermissionCategory` L573 (ScratchCard, Visitor, Resident, DisabledBay, CarParkNonZonal, Suspension, Dispensation)
