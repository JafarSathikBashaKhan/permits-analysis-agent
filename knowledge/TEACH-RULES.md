# TEACH-RULES — Catching User Mistakes

> **Audience:** the Permit QA Agent itself (me).
> **When the user describes something, run their statement through these rules FIRST and politely correct any mismatch before acting.**

These rules are derived from the indexed source + contract-state probe + workflow-by-type investigation. Each rule cites the file it came from so I can re-verify.

---

## Type & Category vocabulary

| Rule | If user says… | I must respond with… |
|---|---|---|
| T1 | "Permit" (as a Type) on AutomationApplyIQ | "On this contract Type 1 is named **Road Permit** in the UI. Use that exact label in tests." (source: `contract-state-AutomationApplyIQ.md`) |
| T2 | "Visitor permit" as a Type | "Visitor is a **Category** inside Type=Permit (enum `TypeOfPermissionCategory.Visitor=2`), not a Type. Tests should set Type=Road Permit, Category=Visitor." (source: `CommonEnum.cs` L573) |
| T3 | "Resident permit" as a Type | Same as T2 — Resident=3 is a Category. |
| T4 | "Suspension permit" | "Suspension is its own Type (enum=3), not a Permit category. It uses a CEO-task workflow." (source: `workflow-suspension-TRUTH.md`) |
| T5 | "Licensing permit" | "Licensing is enum-only — no UI, no controller, no test cases. Did you mean a different type?" (source: `workflow-licensing-TRUTH.md`) |
| T6 | "Exemption workflow" expecting custom rules | "Exemption shares the Permit workflow exactly — only a label change on the Customer Portal apply page." (source: `workflow-exemption-TRUTH.md`) |

## Prerequisite chain

| Rule | If user says… | I must respond with… |
|---|---|---|
| P1 | "Create a new Group called Resident Group" | "A group ` Resident Group` (with a **leading space**) already exists as id=231. Want me to reuse it, or create a fresh group with a different name to avoid the duplicate?" |
| P2 | "Create Resident Permission" | "Builder `Resident Permission` (id=1493) already exists and is Published. Reuse, rename, or skip?" |
| P3 | "Create a zone for the test" | "Only zone id=1671 is currently Published. Either map the new builder to it OR create+publish a new zone (publish requires at least one mapped street)." |
| P4 | Asks to write a Permit Buy Now test without verifying zone mapping | Remind: "Buy Now Address tab will fail if applicant address is not in a Published zone. Make sure step 14 of `prerequisite-chain-TRUTH.md` is satisfied." |
| P5 | "Write the test without Group setup first" | "Type → Group → Category dropdowns are cascading AJAX-loaded. Without Group, the Builder save will fail validation. Want me to also seed a Group?" |

## Workflow state machine

| Rule | If user says… | I must respond with… |
|---|---|---|
| W1 | "Reactivate a Cancelled application" | "There is no Reactivate from Cancelled — Cancelled is terminal. Did you mean Resume from Suspended, or Off Hold from OnHold?" (source: `application-workflow-TRUTH.md`) |
| W2 | "Extend the OnHold 5 times" | "Hard cap is 2 extensions (`page.tsx` L972 `if (extendCount < 2)`). Test should expect rejection on the 3rd attempt." |
| W3 | "Suspend a Suspension" | "The `suspend` button is hidden when the application's type IS Suspension (`page.tsx` L1196-1207). The flow doesn't allow it." |
| W4 | "Cancel an Active Suspension via the standard Cancel button" | "Default `cancel` is hidden for Suspension type. Use `cancelSuspensionTask` instead — and that's only visible when status==Active." |
| W5 | "Approve a Closed application" | "Closed is terminal. Approve only works from PendingApproval / UnderReview." |
| W6 | "CEO approves Dispensation" | "Dispensation has no CEO step — `assignTaskToCEO` is hidden. Standard BO Approve only." |

## API & environment

| Rule | If user says… | I must respond with… |
|---|---|---|
| A1 | "API tests are returning 404 on everything" | First check: `.env LOGIN_API_URL` host vs the UI host. They MUST be the same environment (test-permits-restapi for TEST UI, uat-... for UAT). Mixed envs = 404 on every endpoint, auth works because login token is valid for *its* host. (source: `contract-state-AutomationApplyIQ.md`) |
| A2 | "API tests pass but UI tests use different data" | Re-run `TRContractStateProbe` to refresh `contract-state-AutomationApplyIQ.json` — UI and API may have drifted. |
| A3 | "Use API_BASE for the call" | NO — `API_BASE` points at `test-activedays-func.azurewebsites.net` (an Azure Function). For Permission API, derive from `LOGIN_API_URL`. |
| A4 | "ROPC auth keeps failing" | Expected — tenant Marston Holdings doesn't have the resource principal (`AADSTS500011`). Code auto-falls-back to interactive Chrome login. ~1m4s overhead is normal. |

## Selectors (Page Objects)

| Rule | If user says… | I must respond with… |
|---|---|---|
| S1 | Wants to select Permission Builder Type | Use `[data-testid='permissionTypeAutoComplete']` — not label text XPath. |
| S2 | Wants the Permission name field | Use `#permissionName` (max 100 chars). |
| S3 | Wants the Description | Use `#description` (max 500 chars, optional). |
| S4 | Wants the success toast | Match exact string `"Permission Builder created successfully."` from `page.tsx` L1625. |
| S5 | Tries `page.click('.MuiAutocomplete...')` directly | Use the `SelectAutoCompleteAsync` helper in `PermissionBuilderCRUDFunctionality.cs` — handles open + type + wait for popper. |

## Data-quality landmines (from probe)

| Rule | If user says… | I must respond with… |
|---|---|---|
| D1 | Asks me to find Group "Resident Group" by exact name | Trim & compare — actual stored value has a leading space. |
| D2 | Filters Builders by type name "Permit" | Use `"Road Permit"` (id=1 → that's the contract-specific display name for enum value 1 here). |
| D3 | Asks "why is Group 232 (TestResidentGroup) showing permissionTypeId 66?" | Orphan reference — type 66 is not in the contract's enabled types list. Don't trust this group for new tests. |

## How I should respond when a rule triggers

1. **Stop** — don't proceed with the action.
2. **State the discrepancy** in one sentence, citing the rule number (e.g. "[T1] applies here…").
3. **Offer 2-3 concrete options** ("(a) use existing X, (b) create Y, (c) clarify the goal").
4. **Wait for user choice** with `ask_user`.

## Maintenance

This file is generated from authority docs in this `knowledge/` folder. When a new rule is discovered:
1. Verify against source code in `MNPS-Permission-RestAPI` / `MNPS-Permission-UI`.
2. Add a row here with a citation.
3. Re-run `TRContractStateProbe` if the rule depends on env state.
