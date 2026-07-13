# BRD_Apply IQ_Basket Function Back Office & Customer Portal_V1.0_04-06-2026

> **Confluence ID:** 1850900501 · **Version:** 18 · **Last updated:** 2026-04-28T06:52:18.104Z
> **Path:** Requirements / Basket Function
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/1850900501/BRD_Apply+IQ_Basket+Function+Back+Office+Customer+Portal_V1.0_04-06-2026

---

## Basket Function – Back Office & Customer Portal

* * *

### Document Information

Item

Details

Document Name

BRD – Basket Function Back Office & Customer Portal

Product

Apply IQ

Module

Customer Portal

Version

V1.1

Date

27‑Apr‑2026

Prepared By

Prathiba.K

Based On

Permission System Discussion – 31‑Mar‑2026; Basket Functionality & Payment Methods Discussion – 27‑Apr‑2026

* * *

## 1\. Introduction

Apply IQ currently supports purchasing permissions individually. To enhance customer experience and support combined purchases, a **Basket Function** is being introduced in the Apply Customer Portal. This functionality enables users to purchase **multiple permissions in a single transaction**, while respecting permission‑specific rules, payment configurations, limits, and user journeys.

* * *

## 2\. Business Objective

-   Enable customers to purchase **multiple different permissions** in one payment
    
-   Support **mixed permission types** in a single transaction
    
-   Enforce correct **payment method resolution**
    
-   Provide clear UX flows for repeated purchases
    
-   Handle **limits, payment plans, and edge cases** gracefully
    
-   Ensure completed applications are visible post‑purchase
    

* * *

## 3\. In Scope

-   Basket functionality in Apply Customer Portal
    
-   Add‑to‑Basket behaviour
    
-   Basket item display and navigation
    
-   Payment and payment plan handling
    
-   Limit validation and error handling
    
-   Post‑payment confirmation and visibility
    

* * *

## 4\. Out of Scope

-   Refund processing logic
    
-   Back‑office reconciliation rules
    
-   Contract‑specific UX customization beyond configuration
    

* * *

## 5\. Stakeholders

Role

Name

Product Owner

Joanne Archer

Business Analyst

Prathiba K

Applicants / Customers

Apply IQ customers

Local Authority / Client Admins (Back-office)

TBD

* * *

## 6\. High‑Level Process Flow

1.  User selects a permission and completes application
    
2.  User selects **Add to Basket**
    
3.  System prompts for **Same / Different permission**
    
4.  User continues adding permissions or proceeds to checkout
    
5.  System validates limits, payment rules, and payment plans
    
6.  User completes single payment
    
7.  Applications created and visible in **My Applications**
    

* * *

## 7\. Applicability – Back Office & Customer Portal

The Basket Function is applicable to both the Back Office and the Customer Portal purchase flows. Where relevant, back‑office users and applicants may add eligible applications to a basket and complete a combined purchase in a single checkout, following the same payment resolution, plan eligibility, and limit validation rules defined in this BRD.

* * *

## 8\. Business Requirements

### 8.1 Basket & Permission Handling

BR ID

Business Requirement

Description

BR‑01

Add to Basket Availability in the application form (Purchase flow) back office and customer portal

The system shall provide an **“Add to Basket”** action on applicable application flows when the basket toggle is enabled in the contract settings.

BR-02

Separate Application Handling

Each application added to the basket shall be treated as a **separate application**, with its own unique reference number.

BR‑03

Mixed Permission Support

The system shall allow different permission types (Resident, Visitor, Suspension, Licensing, Dispensation, etc.) to be added to the same basket.

BR‑04

Same / Different Permission Prompt

When Add to Basket is invoked, the system shall display a pop‑up asking whether the user wants to purchase the same permission or a different permission.

BR‑05

Same Permission – Suspension Flow

If Same Permission is selected for Suspension, the system shall remain on the **Bay Details tab**.

BR‑06

Same Permission – Resident Permit Flow

If Same Permission is selected for Resident Permit, the system shall navigate to the **Vehicle tab**.

BR‑07

Same Permission – Visitor Permit Flow

If Same Permission is selected for Visitor Permit, the system shall navigate to the **Price tab**.

BR‑08

Same Permission – Other Permissions

For other permissions (Licensing, Dispensation), the system shall navigate to the **Price tab**. This may change in future if flows differ.

BR‑09

Different Permission Navigation

If Different Permission is selected, the system shall navigate to the **Explore Applications page**, while retaining previous permission context.

* * *

### 8.2 Basket Display & Navigation

BR ID

Business Requirement

Description

BR‑09

Basket Item Display

Basket shall display Permission Name, Concatenated Address, and Total Price for each item.

BR‑10

Basket Total Amount

Basket shall display the total amount payable for all added permissions.

BR‑11

Resume Application

Selecting an item from the basket shall redirect the user to the respective application form with all data persisted.

BR‑12

Empty Basket Handling

If no permissions are added, the system shall either hide the View Basket option or display an empty basket message (UX decision).

* * *

### 8.3 Payment & Payment Plan Handling

BR ID

Business Requirement

Description

BR‑13

Basket‑Level Payment Resolution

System shall determine a single payment method for the basket.

BR‑14

Mixed Payment Methods

If permissions have both online and offline payment methods, **common payment** shall be displayed.

BR‑15

Offline‑Only Basket

If all permissions support offline payment only, the system shall display **offline payment methods alone**.

BR‑16

Payment Plan Eligibility

When a payment plan is selected, system shall validate that all permission durations are divisible by the plan period.

BR‑17

Payment Plan Visibility

If valid, system shall display payment plan details for **each permission** in the basket.

BR‑18

Instalment Breakdown

For each permission, instalment count, instalment amount, and due dates shall be displayed.

BR‑19

Basket‑Level Instalments

System shall calculate and display total instalment amount per period across all permissions.

BR‑20

Invalid Payment Plan Error

If any permission does not support the plan, system shall display an error with reason and prompt alternative payment method.

BR-21

Payment Method Grouping Display

The basket shall visually group permissions by compatible payment method, enabling the user to see which items can be paid for together.

BR-22

Multi-Select Checkout

At checkout, the system shall allow the user to select a subset of basket items to pay for in a single transaction, rather than requiring all items to be processed together.

BR-23

Checkout Payment Messaging

At checkout, the system shall display clear messaging indicating which items can be paid for immediately with the selected payment method and which items require an alternative payment method or separate submission.

BR-24

Payment Method Validation at Payment Stage

The system shall perform a final payment method validation at the payment stage to confirm that all selected items are compatible with the chosen payment method before processing.

BR-25

Remaining Items After Partial Checkout

After a partial checkout, remaining unpaid items shall be preserved in the basket with recalculated totals and revalidated payment method compatibility.

* * *

### 8.4 Limits & Voucher Handling Overall - Common Rules

BR ID

Business Requirement

Description

BR‑27

Limit Validation per Permission

System shall validate household/quantity limits independently for each permission in the basket.

BR‑28

Partial Limit Exceed Handling

If any permission exceeds its limit, system shall display an error identifying the permission.

BR‑29

Remove Exceeded Permission

User shall be able to remove the exceeded permission and proceed with remaining valid permissions.

BR‑30

Limit Validation at Basket View

Limits shall be revalidated when viewing basket and before checkout.

BR‑31

Voucher Quantity Reduction

For voucher permissions, system shall reduce available quantity based on purchased quantity.

BR‑32

Voucher Reduction Messaging

System shall clearly indicate voucher quantity reduction and remaining available quantity.

## 8.4.1 BR‑HL: Household Limit (Per Property)

BR ID

Business Requirement

Description

BR‑HL‑33

Household Limit Definition

The system shall enforce a _**configurable**_ maximum number of applications that can be purchased per household or property.

BR‑HL‑34

Basket‑Only Scenario

If no applications are submitted and basket contains more items than the household limit, excess items shall be marked as _Household limit exceeded_ in basket view.

BR‑HL‑35

Partial Submission Scenario

If some applications are already submitted, remaining allowable quantity shall be calculated as _Household limit − Submitted applications_.

BR‑HL‑36

Basket Revalidation

Basket items shall be revalidated when viewing the basket to reflect changes caused by parallel submissions.

* * *

## 8.4.2 BR‑UL: Permit per User Limit (Zonal Permissions)

BR ID

Business Requirement

Description

BR‑UL‑37

User Limit Definition

The system shall restrict the _**configurable**_ maximum number of permits per user can purchase for zonal permissions.

BR‑UL‑38

Basket Behaviour

Basket items shall not be counted toward the permit‑per‑user limit until submission.

BR‑UL‑39

User Limit Validation

If the number of permit applications added to the basket exceeds the configured permit‑per‑user limit (calculated using submitted applications only), the system shall display the ‘User limit exceeded’ error message on the _last application added_ that exceeds the limit, while the earlier applications within the limit remain valid.”

* * *

## 8.4.3 BR‑NZUL: Non‑Zonal Permission Limit per User

BR ID

Business Requirement

Description

BR‑NZUL‑01

Non‑Zonal User Limit

_The system shall enforce a **configurable maximum number of non‑zonal permits per user** (non‑zonal user limit_

BR‑NZUL‑02

Basket Validation

Non‑zonal user‑level limits shall be validated in basket view using submitted applications only.

BR‑NZUL‑03

Exceed Scenario

If basket items exceed the non‑zonal user limit, excess items shall be marked as _User limit exceeded_ and be removable on the _last application added_ that exceeds the limit, while the earlier applications within the limit remain valid.”

* * *

## 8.4.4 BR‑ZL: Permit per Zone / Waiting List (Zone Capacity)

BR ID

Business Requirement

Description

BR‑ZL‑01

Zone Capacity Definition

The system shall enforce a _**configurable**_ maximum number of active permits allowed per zone.

BR‑ZL‑02

Basket Waiting List Validation

Zone capacity and waiting‑list status shall be validated and displayed in the basket view.

BR‑ZL‑03

Waiting List Message

If zone capacity is full, a waiting‑list message shall be displayed against the affected basket item.

BR‑ZL‑04

User Choice

The user shall be allowed to remove the waiting‑list item or proceed knowing the application will be placed on the waiting list.

* * *

## 8.4.5 BR‑VL: Voucher / Scratch Card Limit per Household

BR ID

Business Requirement

Description

BR‑VL‑01

Voucher Limit Definition

The system shall enforce a _**configurable**_ maximum voucher or scratch card quantity per household, typically on a rolling‑year basis.

BR‑VL‑02

Basket Quantity Validation

Remaining voucher allowance shall be calculated and displayed in basket view using submitted applications only.

BR‑VL‑03

Exceed Allowance

If basket quantity exceeds the remaining allowance, excess quantity shall be marked as _Voucher limit exceeded_ on the _last application added_ that exceeds the limit, while the earlier applications within the limit remain valid.”

BR‑VL‑04

Parallel Purchase Impact

Parallel voucher purchases shall reduce remaining allowance and trigger basket revalidation.

* * *

## 8.5 Basket Item Removal & Draft Behaviour

BR ID

Business Requirement

Description

BR‑BK‑01

Remove Item from Basket

The system shall allow users to remove any permission from the basket before checkout.

BR‑BK‑02

Draft Option for User‑Initiated Removal

If a user voluntarily removes a permission from the basket (without any limit violation), the system shall prompt the user to confirm whether the application should be saved as a draft.

BR‑BK‑03

Save as Draft – Yes

If the user chooses to save as draft, the system shall save the application in **My Applications → Drafts** and remove it from the basket.

BR‑BK‑04

Save as Draft – No

If the user chooses not to save as draft, the system shall permanently remove the application from the basket.

BR‑BK‑05

No Draft for Limit Exceed

If a permission is removed from the basket due to a **limit‑exceed condition** (household, user, zone, voucher, etc.), the system shall **not** prompt the user to save the application as a draft.

BR‑BK‑06

System‑Driven Removal

Removal of limit‑exceeded permissions shall be treated as a **system‑driven action** and the application shall be discarded without being saved as a draft.

### 8.6 Post‑Payment Handling

BR ID

Business Requirement

Description

BR‑ PH - 01

Successful Payment Confirmation

System shall display a success message upon successful payment.

BR‑ PH - 02

Application Visibility

Purchased applications shall be visible in **My Applications** after payment completion.

### 8.7 Change Log

Version

Date

Author

Changes

V1.0

06-Apr-2026

Prathiba K

Initial version based on Permission System Discussion – 31-Mar-2026

V1.1

27-Apr-2026

Prathiba K

Added payment-method compatibility rules and multi-select checkout (BR-PM-01..06); added Pugazh and Savit as stakeholders; updated Risks, Constraints, and Open Queries.

* * *

## 9\. Assumptions

-   Basket feature is enabled via configuration
    
-   Online payment methods are available where basket is enabled
    
-   Current licensing flow aligns with permit flow
    

* * *

## 10\. Risks

Risk

Impact

Mitigation

Mixed payment methods and payment plan incompatibility across items

Checkout blocked or confusing options shown; user unable to proceed

Resolve to online methods when mixed; validate plan eligibility across items; surface clear error and alternative (BR-13, BR-14, BR-16, BR-20)

Limit revalidation timing vs parallel purchases leading to stale basket

Items appear valid but fail at checkout or get removed unexpectedly

Revalidate on basket view and pre-checkout; show deltas and next steps (BR-24, BR-HL-04, BR-VL-04)

Voucher allowance reduction race conditions

Over-allocation or sudden quantity drop during checkout

Lock and re-check remaining allowance; display remaining quantity and guidance (BR-25, BR-26, BR-VL-04)

Zone capacity changes causing unexpected waiting list

Customer confusion or abandoned checkout

Validate zone capacity in basket; show waiting-list message and allow removal or proceed (BR-ZL-02..04)

Duplicate submissions/double-click at checkout

Multiple charges or duplicate applications

Idempotent checkout and disable repeated actions; server-side token to prevent duplicates

Data persistence failures when resuming basket items

Lost progress or incorrect details submitted

Ensure form autosave and restore on resume; add retries and validation (BR-11)

Performance degradation with large baskets/revalidation

Slow page loads and timeouts; poor UX

Batch validations; lazy-load details; backoff and caching; set practical basket size limits

Accessibility/clarity of errors and removal/draft prompts

Users miss why items were removed or how to proceed

Consistent, WCAG-compliant messaging; explicit reasons and actions; align with BR-BK-05..06 for draft prompts

Audit/traceability gaps for system-driven removals and plan calculations

Inability to support investigations or disputes

Log validation outcomes, removals, and plan evaluations with BR IDs in context (BR-24, BR-20, BR-BK-06)

Offline-only basket constraints leading to customer confusion

Customer expects online payment but only offline shown

Explain offline-only context and provide next steps (BR-15)

Payment method incompatibility not detected until checkout

User frustration; abandoned transactions; support overhead

Validate payment method compatibility at add-to-basket stage; block incompatible additions with clear error messaging (BR-PM-01, BR-PM-05)

### 11\. Constraints

-   Basket-level payment method resolution: when items have mixed online and offline methods, show online only; when all are offline-only, show offline only (BR-13, BR-14, BR-15).
    

-   Payment plan eligibility: all item durations must be divisible by selected plan period; any non-divisible item invalidates the plan and requires alternate method/plan (BR-16, BR-20).
    
-   Limit validation timing: limits are final only at basket view and pre-checkout; basket must be revalidated due to possible parallel submissions (BR-24, BR-HL-04, BR-VL-04).
    
-   Household/user/voucher exceed behavior: only last-added excess item(s) show as exceeded and are removable; earlier in-limit items remain valid (BR-UL-03, BR-NZUL-03, BR-VL-03, BR-HL-02).
    
-   Permit-per-user counts: basket items don’t count toward user limits until submission; calculations use submitted applications only (BR-UL-02).
    
-   Voucher remaining allowance: rolling-year calculation based on submitted applications only; allowance may reduce due to parallel purchases (BR-VL-01, BR-VL-02, BR-VL-04).
    
-   Zone capacity/waiting-list status must be shown in basket; user can remove item or proceed knowing it will waitlist (BR-ZL-02, BR-ZL-03, BR-ZL-04).
    
-   System-driven removal for limit exceed: do not prompt to save as draft; item is discarded (BR-BK-05, BR-BK-06).
    
-   Resume application depends on persisted draft state; incomplete persistence may prevent resume (BR-11).
    
-   Payment method compatibility at basket entry: items can only be added if they share at least one common payment method with existing basket items; otherwise addition is blocked (BR-PM-01).
    
-   Multi-select checkout: users may select a subset of basket items to pay for in one transaction; remaining items stay in the basket with recalculated totals (BR-PM-03, BR-PM-06).
    

**12\. Approval**

Name

Role

Signature

Date

 Product Owner

Business Analyst