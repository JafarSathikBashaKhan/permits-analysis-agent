# FRD_Apply IQ_Basket Function Customer Portal_V1.0_04-06-2026

> **Confluence ID:** 1850933322 · **Version:** 10 · **Last updated:** 2026-04-28T06:48:02.282Z
> **Path:** Requirements / Basket Function
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/1850933322/FRD_Apply+IQ_Basket+Function+Customer+Portal_V1.0_04-06-2026

---

This Functional Requirements Document (FRD) specifies system behavior for the Apply IQ Basket Function in the Back Office and the Customer Portal. It is derived from the approved BRD V1.1. All requirements include clear flows, validations, and traceability to BR IDs. Unless otherwise configured, the same rules apply across Back Office and Customer Portal.

## Document Control

**Field**

**Value**

Document Name

FRD – Basket Function – Back Office & Customer Portal

Product

Apply IQ

Module

Back Office & Customer Portal

Version

V1.1

FRD Prepared By

Prathiba K

Source BRD

BRD\_Apply IQ\_Basket Function Back Office & Customer Portal\_V1.0\_04-06-2026

FRD Effective Date

## Purpose and Scope

Purpose: Define the detailed functional behavior, validations, data handling, and UX interactions for the Basket Function, enabling multiple permissions to be purchased in a single transaction while enforcing all rules.

Scope: Back Office and Customer Portal basket flows: add-to-basket availability, prompts, navigation, basket view, totals, resume, payment method resolution, payment plans, limit validations (HL, UL, NZUL, ZL, VL), revalidation timing, item removal and draft behaviour, voucher quantity handling, checkout controls, post-payment confirmation, audit/logging and autosave/persistence.

## Definitions and Abbreviations

-   Basket: A temporary collection of one or more permission applications to be paid together.
    
-   Permission: A purchasable application such as Resident, Visitor, Suspension, Licensing, Dispensation, Voucher/Scratch Card.
    
-   HL: Household limit per property; UL: Permit-per-user limit (zonal); NZUL: Non-zonal permit-per-user limit; ZL: Zone capacity/waitlist; VL: Voucher/scratch card household limit.
    
-   Payment plan: Structured instalments for eligible permissions with divisible durations.
    

## Actors and Roles

-   Applicant/Customer: Creates applications, adds to basket, manages basket, completes checkout.
    
-   System: Applies business rules, validations, calculations, autosave, and audit logging.
    
-   Back-office/Client Admin: Configures limits, payment methods, and plan options (outside scope of UI here).
    

## Assumptions and Constraints

-   System shall support basket feature only when enabled by configuration.
    
-   System shall resolve basket-level payment methods: when mixed online/offline, only online methods shall be displayed; when all offline-only, offline shall be displayed.
    
-   System shall revalidate limits at basket view and pre-checkout due to potential parallel submissions.
    
-   System shall require all items in a payment plan to be duration-divisible by the plan period; otherwise the plan shall not be available.
    

* * *

## 3\. Scope

Area

Functional Scope

In Scope

Implement basket mechanics, Add to Basket, basket view/navigation, payment & payment, Multi select & Payment method logic, plan logic, limit/voucher validation, post‑payment handling.

Out of Scope

Refund processing, back‑office reconciliation specifics, bespoke contract‑level UX beyond configuration.

* * *

## 4\. Stakeholders (for reference)

Role

Responsibility (FRD impact)

Product Owner – Joanne Archer

Approves behaviour and constraints.

Business Analyst – Prathiba K

Owns requirements and traceability.

Applicants / Customers

End users of Customer Portal basket.

Local Authority / Client Admins

Configure limits, payment methods, plans, and contract toggles.

* * *

## 5\. High‑Level Functional Flow

Step

Functional Requirement

1

User completes a permission application flow to the point where Add to Basket / checkout actions are available.

2

On selecting **Add to Basket**, system validates eligibility **and payment-method compatibility** and places the application into a basket if compatible; otherwise it blocks the addition and shows an incompatibility error.

3

System prompts user to choose **Same** or **Different** permission.

4

User continues adding items via same/different permission journeys.

5

On basket view/checkout, system revalidates limits, payment rules, plans, **and payment-method compatibility**

6

At checkout, the user may select a subset of compatible basket items (multi-select) to pay now; UI clearly indicates which items are payable with the chosen method.

7

System processes payment for selected items only; remaining items stay in basket with updated totals and validations; paid items appear in **My Applications**.

* * *

## 6\. Functional Requirements

## 6.1 Applicability – Back Office & Customer Portal

FR ID

BR Mapping

Functional Requirement

Priority

Acceptance Criteria

FR‑001

Sec. 7

System shall support **Basket Function** in both Customer Portal and Back Office purchase flows, including “Buy Now” where configured. In Back office the basket function should be against the applicant.

High

1.  For contracts with basket enabled, Back Office purchase screens (including Buy Now) show Add to Basket where applicable. 2) Rules for payment, plans, and limits are identical between Portal and BO.
    

* * *

## 6.2. Functional Requirements – Basket & Permission Handling

FR ID

BR Mapping

Functional Requirement (System shall…)

Priority

Acceptance Criteria

FR‑02

BR‑01

Provide an **“Add to Basket”** action on applicable application forms in both Customer Portal and Back Office when the **basket toggle is enabled** in the contract settings.

High

1.  When basket toggle = ON, Add to Basket is visible next to relevant purchase actions. 2) When basket toggle = OFF, Add to Basket is hidden.
    

FR‑03

BR‑02

Treat each permission added to the basket as a **separate application record** with its own unique reference number, persisted in the database.

High

1.  Adding two items results in two distinct application IDs. 2) Deleting one basket item does not affect the other’s reference.
    

FR‑04

BR‑02

Allow users to add **different permission types** (Resident, Visitor, Suspension, Licensing, Dispensation, etc.) to the **same basket**, subject to existing eligibility and configuration.

High

1.  Basket can contain mixed types in a single session. 2) Any restriction to mixing types is driven solely by configuration, not hard-coded limits.
    

FR‑05

BR‑03

When Add to Basket is invoked, display a **Same / Different permission** pop‑up asking whether user wants to buy the same permission again or a different permission.

High

1.  Pop‑up shows clearly labelled “Same permission” and “Different permission” options. 2) Closing popup leaves basket unchanged.
    

FR‑06

BR‑04

If user selects **Same permission** for a **Suspension** application, keep user on the **Bay Details** tab with appropriate data pre‑populated as configured.

Medium

1.  Flow does not navigate away from Bay Details tab. 2) Re‑usable data from previous suspension application is populated in accordance with config.
    

FR‑07

BR‑05

If user selects **Same permission** for a **Resident Permit**, navigate to the **Vehicle** tab for the new application, using existing Resident flows.

Medium

1.  Screen transitions to Vehicle tab. 2) Any configured contextual data (e.g., property already selected) is retained.
    

FR‑08

BR‑06

If user selects **Same permission** for a **Visitor Permit**, navigate to the **Price** tab for the new application.

Medium

1.  Screen transitions to Price tab for Visitor.
    

FR‑09

BR‑07

For other permissions such as **Licensing** or **Dispensation**, when **Same permission** is selected, navigate to the **Price** tab by default, with ability to change behaviour by configuration in future.

Low

1.  For non‑Resident/Visitor/Suspension, Same permission always routes to Price tab by default. 2) Behaviour can be overridden through configuration if new flows are introduced.
    

FR‑010

BR‑08

If the user selects **Different permission**, navigate to the **Explore Applications** page while retaining context (customer, property, contract etc.) from the previous permission where relevant.

High

1.  Explore Applications page opens. 2) Returning to a new application still allows adding to the same basket. 3) Context such as customer and contract is preserved.
    

* * *

## 6.3. Functional Requirements – Basket Display & Navigation

FR ID

BR Mapping

Functional Requirement

Priority

Acceptance Criteria

FR‑011

BR‑09

In basket view, display for each item: **Permission Name**, **concatenated address** (where applicable), Terms & Conditions and **Total Price**.

High

1.  Basket row shows the three fields. 2) For permissions without address, address field is blank/hidden as per UX spec.
    

FR‑012

BR‑10

Display a **basket total amount** representing the sum of total prices for all current basket items, recalculated on each addition/removal/update.

High

1.  Basket total equals sum of visible items. 2) Any item removal or price change immediately updates total.
    

FR‑013

BR‑11

When user selects (clicks) any basket item, redirect to the respective application form with all data previously entered **persisted and restorable** for editing.

High

1.  Opening an item shows all previously entered form fields. 2) Saving and returning to basket updates any changed prices/values.
    

FR‑014

BR‑12

If **no permissions** are in the basket, either hide the **View Basket** entry point or display an **empty basket** message, as configured in UX settings.

Medium

1.  Basket empty state is correctly displayed or hidden. 2) No navigation to a blank basket page when zero items.
    

* * *

## 6.4. Payment & Payment Plan Handling

FR ID

BR Mapping

Functional Requirement

Priority

Acceptance Criteria

FR‑015

BR‑13

At checkout, determine a **single payment method set** applicable for the **currently selected basket items**, based on methods available for those items and BR‑14/BR‑15 rules.

High

1.  Only one unified set of payment options is shown per checkout attempt. 2) No per‑item payment selection within a single payment.
    

FR‑016

BR‑14

If the selected items collectively involve both **online** and **offline‑only** payment capabilities, should display the common payment method.

High

1.  Common payment methods are shown for the selected items to proceed checkout
    

FR‑017

BR‑15

If **all selected items** support **offline payment only**, display **offline payment methods alone** in checkout.

High

1.  Selection comprised solely of offline‑only items shows no online options.
    

FR‑018

BR‑16

When a **payment plan** is selected, validate that the duration of **each permission** is divisible by the plan period; mark the plan as invalid if any permission fails the divisibility rule.

High

1.  If any item fails duration divisibility, plan cannot be used. 2) Validation occurs before confirming plan at checkout.
    

FR‑019

BR‑17

If the selected payment plan is valid for all selected basket items, display **payment plan details per permission**, including number of instalments and plan duration aspects.

Medium

1.  Each permission shows its own plan details aligned with configured plan.
    

FR‑020

BR‑18

For each permission under a payment plan, calculate and display **instalment count**, **instalment amount**, and **instalment due dates** according to plan configuration and permission amount/duration.

Medium

1.  Sum(instalments) = permission total (considering rounding rules). 2) Due dates follow plan pattern (e.g. monthly).
    

FR‑021

BR‑19

Calculate and display **basket‑level instalment totals per period** (e.g. total monthly amount) by aggregating instalment amounts across all permissions in the selection.

Medium

1.  Basket summary shows total per period. 2) Sum of all aggregated instalments across periods equals basket total.
    

FR‑022

BR‑20

If any permission in the selection does not support the selected payment plan (duration not divisible or configuration invalid), show a **clear error** identifying the reason and prompt user to choose an alternative plan/method.

High

1.  Error message highlights offending permission(s) and reason. 2) System prevents proceeding with invalid plan. 3) User can change plan or revert to standard payment and successfully check out.
    

* * *

### 6.5 Payment Method Compatibility (Additional – BRD V1.1)

FR ID

BR Mapping

Functional Requirement

Priority

Acceptance Criteria

FR‑023

BR‑21

Validate payment method compatibility at Basket checkout

High

Incompatible item blocked

FR‑024

BR‑22

Group basket items by compatible payment methods

Medium

Visual grouping displayed

* * *

### 6.6 Multi‑Select & Partial Checkout (Additional – BRD V1.1)

These requirements extend the existing checkout behaviour without altering previously defined payment or basket flows.

FR ID

BR Mapping

Functional Requirement

Priority

Acceptance Criteria

FR‑025

BR‑23

Allow multi‑select checkout

High

User selects subset of items

FR‑026

BR‑24

Display checkout messaging for payable vs non‑payable items

High

Clear guidance shown

FR‑027

BR‑25

Final payment method validation before payment

High

Block payment if invalid

FR‑028

BR‑26

Preserve remaining items after partial checkout

High

Unpaid items remain in basket

## 6.5. Limits & Voucher Handling (Common Rules)

FR ID

BR Mapping

Functional Requirement

Priority

Acceptance Criteria

FR‑029

BR‑21

Validate **household/quantity limits** independently for each permission in the basket according to configured rules.

High

1.  Each item’s eligibility is assessed against its configured limits. 2) Valid items do not inherit errors from invalid items.
    

FR‑030

BR‑22

When any permission exceeds its configured limit, display an error message clearly **identifying the specific permission** that exceeded the limit.

High

1.  Error shows permission name and/or reference.
    

FR‑031

BR‑23

Allow user to **remove** permissions that exceed limits and to proceed with remaining valid permissions in the basket.

High

1.  After removing exceeded item(s), checkout can proceed with remaining items.
    

FR‑032

BR‑24

**Revalidate limits** whenever user views basket and again **immediately before checkout**, taking into account any external submissions or changes.

High

1.  Changes from parallel submissions are reflected when reopening basket and just before payment.
    

FR‑033

BR‑25

For voucher‑type permissions, **reduce available voucher quantity** based on quantity purchased in successfully submitted applications.

High

1.  Remaining voucher allowance is updated after payment.
    

FR‑034

BR‑26

Clearly indicate **voucher quantity reduction** and remaining available quantity in basket/checkout messaging for relevant voucher permissions.

Medium

1.  Users can see remaining voucher quantity and how new purchases impact it.
    

* * *

### 6.6. Household Limit – Per Property (BR‑HL)

FR ID

BR Mapping

Functional Requirement

Priority

Acceptance Criteria

FR‑035

BR‑HL‑01

Enforce a **configurable maximum household limit** (applications per property) by property/household configuration.

High

1.  Configurable maximum value exists per property. 2) Applications plus basket items never exceed this limit once validated.
    

FR‑036

BR‑HL‑02

If no applications are yet submitted and basket alone exceeds the household limit, mark the **excess basket items** as **“Household limit exceeded”** in basket view.

High

1.  Excess items are clearly flagged and cannot be checked out until removed/adjusted.
    

FR‑037

BR‑HL‑03

When some applications are already submitted, compute remaining allowable quantity as **Household Limit – Submitted Applications** and apply that when validating basket items.

High

1.  Remaining allowance is correctly calculated based on previously submitted applications.
    

FR‑038

BR‑HL‑04

Revalidate all basket items against household limit each time the basket is viewed and before checkout, reflecting changes caused by parallel submissions or updates.

High

1.  Basket reflects most recent state of household usage whenever user reopens basket or proceeds to checkout.
    

* * *

### 6.7. Permit per User Limit – Zonal (BR‑UL)

FR ID

BR Mapping

Functional Requirement

Priority

Acceptance Criteria

FR‑039

BR‑UL‑01

Enforce a **configurable maximum number of zonal permits per user** (permit‑per‑user limit) for zonal permission types.

High

1.  Configuration stores a numeric limit per user for zonal permits.
    

FR‑040

BR‑UL‑02

Ensure **basket items are not counted** towards this zonal permit‑per‑user limit until they are **submitted**; calculations shall use **submitted applications only**.

High

1.  Limit evaluation includes only submitted applications, not in‑basket drafts, except when validating new additions.
    

FR‑041

BR‑UL‑03

If the number of zonal permit applications in the basket + submitted applications **exceeds** the configured limit, mark only the **last‑added basket item(s)** that exceed the limit as **“User limit exceeded”**.

High

1.  The application that pushes the count beyond the limit receives the error flag. 2) Earlier items within the limit remain valid and can proceed.
    

* * *

### 6.7 Non‑Zonal Permission Limit per User (BR‑NZUL)

FR ID

BR Mapping

Functional Requirement

Priority

Acceptance Criteria

FR‑042

BR‑NZUL‑01

Enforce a **configurable maximum number of non‑zonal permits per user** (non‑zonal user limit).

High

1.  A configurable non‑zonal permit limit parameter exists per user.
    

FR‑043

BR‑NZUL‑02

Validate non‑zonal user‑level limits in **basket view** using **submitted applications only** for counting already‑used allowance.

High

1.  Non‑zonal limit calculation uses only submitted applications, not current basket items, for baseline.
    

FR‑044

BR‑NZUL‑03

If basket items exceed the remaining non‑zonal user limit, mark the **excess items** (starting from last‑added that cause exceedance) as **“User limit exceeded”**, while earlier items within the limit remain valid/removable.

High

1.  Last‑added non‑zonal item that breaks the limit is flagged. 2) Valid items are still available to check out.
    

* * *

### 6.8. Zone Capacity / Waiting List (BR‑ZL)

FR ID

BR Mapping

Functional Requirement

Priority

Acceptance Criteria

FR‑045

BR‑ZL‑01

Enforce a **configurable maximum number of active permits per zone** (zone capacity).

High

1.  Zone capacity configuration present per zone.
    

FR‑046

BR‑ZL‑02

Validate **zone capacity** and **waiting‑list status** for relevant zonal permissions and display this status in **basket view**.

High

1.  Basket view indicates whether a zonal item will be active or placed in a waiting list upon submission.
    

FR‑047

BR‑ZL‑03

If zone capacity is full, display a **waiting‑list message** against the affected basket item(s) indicating that application will go to waiting list.

High

1.  Message appears for all capacity‑exceeded zonal items.
    

FR‑048

BR‑ZL‑04

Allow user either to **remove** the waiting‑list item from the basket or to **proceed** with checkout knowing that the application will be placed on a waiting list.

High

1.  User can remove waiting‑list item and proceed. 2) If user proceeds, resulting application is flagged as waiting list (per existing Apply IQ semantics).
    

* * *

### 6.9. Voucher / Scratch Card Limit per Household (BR‑VL)

FR ID

BR Mapping

Functional Requirement

Priority

Acceptance Criteria

FR‑049

BR‑VL‑01

Enforce a **configurable maximum voucher/scratch card quantity per household**, typically calculated on a **rolling‑year** basis.

High

1.  Configurable maximum voucher quantity exists per household. 2) Rolling‑year period is respected in allowance calculations.
    

FR‑050

BR‑VL‑02

In basket view, display remaining voucher allowance by **calculating based on submitted applications only**, not counting unsent basket items.

High

1.  Remaining allowance shown is derived from previously submitted usage.
    

FR‑051

BR‑VL‑03

If basket quantity for voucher permissions exceeds remaining allowance, mark the **last‑added quantity** that exceeds the limit as **“Voucher limit exceeded”**, while earlier quantities within limit remain valid.

High

1.  Only the part that breaks the limit is flagged. 2) Valid quantities remain purchasable.
    

FR‑052

BR‑VL‑04

On detection of parallel voucher purchases in other sessions, **revalidate basket** and update remaining allowance and limit‑exceed flags accordingly.

High

1.  Basket revalidation reflects reduced allowance and may newly flag items as exceeded.
    

* * *

## 6.10. Basket Item Removal & Draft Behaviour (BR‑BK)

FR ID

BR Mapping

Functional Requirement

Priority

Acceptance Criteria

FR‑053

BR‑BK‑01

Allow users to **remove any permission** from the basket at any time before checkout.

High

1.  Each basket item has a remove action. 2) Upon removal, basket total is updated.
    

FR‑054

BR‑BK‑02

When a user voluntarily removes a permission (not due to limit violation), prompt: **“Do you want to save this application as a draft?”**

Medium

1.  Prompt appears only on user‑initiated non‑limit removals.
    

FR‑055

BR‑BK‑03

If user chooses **Yes** to save as draft, store the application under **My Applications → Drafts** and remove it from basket.

Medium

1.  Draft record appears under My Applications → Drafts with all current data.
    

FR‑056

BR‑BK‑04

If user chooses **No**, permanently discard the application associated with that basket item.

Medium

1.  Application is not present in Drafts or active applications after removal.
    

FR‑057

BR‑BK‑05

If a permission is removed due to a **limit‑exceed condition** (household/user/zone/voucher), do **not** prompt the user to save draft.

High

1.  No draft prompt in system‑driven removal scenarios.
    

## 6.11. Post‑Payment Handling (BR‑27, BR‑28)

FR ID

BR Mapping

Functional Requirement

Priority

Acceptance Criteria

FR‑058

BR‑27

On successful basket payment, system shall display a payment success confirmation including transaction reference and summary of purchased permissions/items.

High

1.  Success page shown only after provider success
    
2.  Includes transaction reference
    
3.  Includes count and list summary
    

FR‑059

BR‑28

After successful basket payment, system shall mark all basket items as submitted/paid and make each resulting application visible under My Applications with correct final status.

High

1.  Each item appears in My Applications
    
2.  No item remains only as basket
    
3.  Statuses correct
    

## 7\. Non-Functional Requirements

-   NFR-001 Performance: System shall validate baskets up to a configured maximum item count with p95 basket view load under 2 seconds under normal load; validations may be batched and cached.
    
-   NFR-002 Reliability: System shall ensure idempotent checkout with exactly-once application creation semantics per successful payment provider confirmation.
    
-   NFR-003 Security: System shall authorise basket access to the authenticated owner only; sensitive PII shall be encrypted at rest and in transit.
    
-   NFR-004 Accessibility: System shall present validation and error messages following WCAG AA guidance, including programmatic identification and focus management on errors.
    
-   NFR-005 Observability: System shall emit structured logs and metrics for validation outcomes, plan eligibility checks, and checkout idempotency decisions.
    

## 8\. Error Handling

-   ERR-001: System shall present item-level inline errors for limit violations with specific reason (household, user, non-zonal, zone capacity/waitlist, voucher allowance) and a clear primary action (Remove) and secondary action (Learn more) when applicable.
    
-   ERR-002: System shall block checkout when any blocking errors persist (e.g., invalid payment plan, incompatible payment methods) and provide guidance to resolve.
    
-   ERR-003: System shall handle payment gateway failures by retrying idempotently and resuming to basket with preserved state, showing a non-duplicative failure message.
    

## 9\. Open Items and Decisions Needed

OPN-001 – RESOLVED: Add to Basket shall be available alongside Buy Now in Back Office contexts where configured, using the same basket and checkout rules.

## 10\. Traceability Matrix (BR to FR)

**BR ID**

**BR Summary**

**Mapped FR ID(s)**

BR‑01

Add to Basket availability

FR‑02

BR‑02

Separate application, mixed permissions

FR‑03, FR‑04

BR‑03

Same/Different prompt

FR‑05

BR‑04..BR‑08

Same/Different navigation per permission

FR‑06, FR‑07, FR‑08, FR‑010

BR‑09..BR‑12

Basket view items, totals, resume, empty

FR‑011, FR‑012, FR‑013, FR‑014

BR‑13..BR‑15

Payment method resolution

FR‑015, FR‑016, FR‑017

BR‑16..BR‑20

Plan eligibility and instalments

FR‑018, FR‑019, FR‑020, FR‑021

BR‑21..BR‑26

Limit validation and voucher rules

FR‑022..FR‑024, FR‑044..FR‑047

BR‑HL‑01..04

Household limit rules

FR‑029..FR‑033

BR‑UL‑01..03

Zonal user limit

FR‑034..FR‑036

BR‑NZUL‑01..03

Non-zonal user limit

FR‑037..FR‑039

BR‑ZL‑01..04

Zone capacity and waitlist

FR‑040..FR‑043

BR‑BK‑01..06

Item removal and drafts

FR‑048..FR‑052

BR‑27..BR‑28

Post-payment confirmation and visibility

FR‑110, FR‑111

## 11\. Appendix: Example Validation Sequence

1.  User adds Item A and Item B; Add to Basket prompt appears; user selects Same or Different flows as applicable.
    
2.  On Basket View, system triggers validations: payment method resolution, plan eligibility check, limits (HL, UL, NZUL, ZL, VL).
    
3.  System marks any exceeded items with precise reasons and disables checkout until resolved if blocking.
    
4.  User removes or adjusts items; draft prompt is shown for user-initiated removals not caused by exceedances.
    
5.  Pre-checkout, system revalidates; if unchanged, generates an idempotency token and proceeds to payment.
    

## 11\. Approval

**Name**

**Role**

**Signature**

**Date**

Product Owner

Business Analyst