# ApplyIQ_Dispensation_FRD_V1.0_18032026

> **Confluence ID:** 1789558874 · **Version:** 3 · **Last updated:** 2026-04-01T10:40:17.675Z
> **Path:** Requirements / Dispensation
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/1789558874/ApplyIQ_Dispensation_FRD_V1.0_18032026

---

# Functional Requirements Document (FRD)

## Dispensation Feature – Enforcement Domain

* * *

## 1\. Document Control

Version

Date

Author

Description

0.1

2026-03-18

Natarajan Arumugam

Initial FRD draft derived from approved BRD

* * *

## 2\. Introduction

### 2.1 Purpose

This Functional Requirements Document (FRD) translates the approved business requirements for the **Dispensation feature in the Enforcement domain** into detailed functional behaviour, user flows, data structures, and integration points.

It is primarily aimed at:

-   Product Owners and Business Analysts (validation of scope and behaviour),
    
-   Development and QA teams (design, build and test),
    
-   Integration teams (Illumin8 and payment).
    

This FRD is fully traceable back to the BRD:  
ApplyIQ\_Dispensation\_BRD\_V1.0\_18032026

### 2.2 Scope of This FRD

In line with the BRD:

**In Scope (Southend initial implementation)**

-   Creation and management of **Dispensation permissions** within **Permission Builder**.
    
-   Support for **physical** and **virtual** dispensation types.
    
-   **Non‑zonal, address‑based** dispensations (street / address selection, no map UI for Southend).
    
-   Multiple dispensation templates:
    
    -   Suspension template.
        
    -   Car Park template.
        
    -   Generic Dispensation template.
        
-   **Configurable pricing** per bay (hour/day/week/month/year) including:
    
    -   Base price rules by template.
        
    -   Tiered pricing for Car Park and Dispensation templates.
        
    -   Admin fee and VAT.
        
-   **Application lifecycle**:
    
    -   Submission (back‑office only for Southend).
        
    -   Assessment/Approval.
        
    -   Issue of dispensation permission.
        
    -   Renewal (Car Park & Dispensation templates).
        
    -   Extension (where in scope per contract – initially limited for Southend as per BRD).
        
    -   Cancellation / Rejection.
        
-   Payment processing, including:
    
    -   Capturing total payable,
        
    -   Applying VAT and admin fee,
        
    -   Integration with existing payment solution if required (TBC).
        
-   **Integration with Illumin8**:
    
    -   Creation/update of dispensation information,
        
    -   Enforcement visibility (e.g., for CEOs, where relevant).
        
-   **Audit trail** and **notifications** (system logs + email where in scope).
    
-   Validation for **street, bay and reason selection**.
    
-   Permission limits and rule enforcement.
    
-   Handling of different **bay types and spaces**.
    

**Out of Scope (per BRD)**

-   **Blue Badge and Pension discounts**.
    
-   **P3 pricing rule** (not applicable to Southend).
    
-   **Map integration** (map toggle not available for Southend).
    
-   **Short notice and extend dispensation** (not for Southend, unless explicitly re‑scoped later).
    
-   **CEO task flow** at back office specifically for dispensation.
    
-   **Automated email communication** for Southend (notifications may exist as system events/logs; email automation per BRD is not required for Southend).
    

* * *

## 3\. Actors and User Roles

### 3.1 Actors

Actor / Role

Description

Back Office User (BOU)

Southend back office staff who create, review and approve dispensations.

Enforcement Team / CEOs

Consumers of dispensation data via Illumin8 (read only for Southend).

Applicant (Indirect)

External party requesting dispensation; request is keyed into system by BOU.

Illumin8 System

External enforcement system that must receive dispensation permissions.

Payment Service

Internal or 3rd‑party payment system to process dispensation payments.

System Administrator

Configures templates, pricing and limits in Permission Builder.

* * *

## 4\. High‑Level Functional Overview

The system must:

1.  Allow configuration of **Dispensation Permissions** in Permission Builder (BR‑001).
    
2.  Support creating **Dispensation Applications** using the configured templates (BR‑003).
    
3.  Handle address and bay‑based selection with validation (BR‑010, BR‑013).
    
4.  Calculate charges according to configurable pricing rules (BR‑004, BR‑012).
    
5.  Support the application lifecycle (submission → approval → issue → renewal / extension → end) (BR‑005, BR‑014).
    
6.  Process payments including admin fee and VAT (BR‑006).
    
7.  Synchronise dispensation permissions with **Illumin8** (BR‑007).
    
8.  Log all key actions for an **audit trail** (BR‑008).
    
9.  Generate notifications to applicants and enforcement where in scope (BR‑009, with the explicit constraint that automated email is not required for Southend per BR‑015).
    
10.  Enforce exclusions and constraints defined in the BRD (BR‑011, BR‑016, BR‑017).
     

Each functional area below is numbered **FR‑XXX** and mapped back to BR‑IDs.

* * *

## 5\. Detailed Functional Requirements

### 5.1 Permission Builder – Dispensation Configuration

#### FR‑001: Create Dispensation Permission Types

**Maps to:** BR‑001, BR‑003

-   The Permission Builder must offer a **“Dispensation”** permission category.
    
-   Within this category, the System Administrator can create/edit **permission types**:
    
    -   Suspension Dispensation Permission.
        
    -   Car Park Dispensation Permission.
        
    -   Generic Dispensation Permission.
        
-   For each permission type, the following attributes must be configurable:
    
    -   Name (display name).
        
    -   Code (unique system identifier).
        
    -   Template type (Suspension / Car Park / Dispensation).
        
    -   Allowed dispensation mode: Physical / Virtual / Both.
        
    -   Validity units (hour / day / week / month / year).
        
    -   Contract(s) / authority / region to which the permission applies (e.g., Southend).
        
    -   Maximum duration (per application).
        
    -   Maximum number of bays.
        
    -   Whether renewal is allowed (for Car Park and Dispensation).
        
    -   Whether extension is allowed (Southend initial scope: disabled if “short notice / extend” is out of scope).
        
-   The Permission Builder UI must validate:
    
    -   Name is mandatory.
        
    -   Code is unique and non‑empty.
        
    -   At least one validity unit is selected.
        
    -   Maximum duration and max bays are positive integers.
        

#### FR‑002: Dispensation Pricing Configuration

**Maps to:** BR‑004, BR‑006, BR‑012

-   For each dispensation permission type, the System Administrator can configure **base pricing rules**:
    
    -   Unit of charge (per bay, per time unit).
        
    -   Time units supported (hour, day, week, month, year).
        
    -   Base rate per time unit per bay.
        
    -   Minimum charge amount (overall).
        
-   **Tiered Pricing**:
    
    -   For Car Park and generic Dispensation templates, the system must support **tiered pricing**:
        
        -   Tier definition:
            
            -   Tier name (e.g., Tier 1, Tier 2).
                
            -   Applicability rule (e.g., number of bays, duration, time of day, or contract/schedule – concrete business rule to be refined).
                
            -   Rate multiplier or override rate.
                
        -   During price calculation, the system must evaluate tiers in a configured order until the first matching tier is found.
            
-   **Admin Fee and VAT**:
    
    -   For each permission type, the following must be configurable:
        
        -   Fixed admin fee amount (per application).
            
        -   VAT rate (%) applied to base charge + admin fee (subject to finance rules).
            
    -   System must calculate:
        
        -   Subtotal (charge before admin fee/VAT),
            
        -   Admin fee total,
            
        -   VAT amount,
            
        -   Grand total amount payable.
            

#### FR‑003: Permission Limit Rules

**Maps to:** BR‑011

-   For each permission type, the System Administrator can define **permission limits** such as:
    
    -   Max active dispensations per street / per applicant / per vehicle within a configured date range.
        
    -   Max duration per permission instance (already in FR‑001).
        
-   During application submission, the system must:
    
    -   Check current active dispensations matching the defined criteria.
        
    -   If a limit would be exceeded, the application:
        
        -   Is blocked from submission; and
            
        -   Shows a clear error message indicating which limit was exceeded.
            

* * *

### 5.2 Dispensation Application Management

#### FR‑010: Create Dispensation Application

**Maps to:** BR‑001, BR‑002, BR‑003, BR‑010, BR‑013

-   Only **Back Office Users** can create applications for Southend.
    
-   The “Create Dispensation Application” screen must allow the BOU to capture:
    

**Applicant Details**

-   Applicant name (mandatory).
    
-   Organisation (optional).
    
-   Contact email and phone (optional fields; may be used later for notification if in scope).
    
-   Applicant address (optional if not required by contract).
    

**Dispensation Details**

-   Permission Type (drop‑down restricted to configured Dispensation permission types).
    
-   Physical vs Virtual mode (radio buttons):
    
    -   Physical: requires physical permit printing/issuance.
        
    -   Virtual: relies on VRM/plate list for enforcement.
        
-   Template (auto‑derived from permission type).
    
-   Vehicle identification (mandatory if VRM‑based enforcement is required):
    
    -   Vehicle Registration Mark (VRM).
        
    -   Optionally, vehicle type.
        
-   Reason / Category for dispensation (mandatory):
    
    -   Select from a configurable list of “Dispensation Reasons” (e.g., utility works, removals, events).
        
-   Notes / Justification (free‑text, optional or mandatory depending on contract settings).
    

**Location and Bays**

-   For Southend:
    
    -   **Street Toggle only** (Map toggle disabled).
        
    -   Street selection:
        
        -   Searchable by street name / partial name.
            
        -   Returns a list of eligible streets sourced from existing dataset.
            
    -   Address / location detail:
        
        -   Option to add house number, landmark or description field.
            
    -   Bay selection:
        
        -   List of bays matching the selected street and contract rules.
            
        -   Bay attributes displayed: Bay ID, bay type (e.g., Pay & Display, Resident), capacity (spaces).
            
        -   BOU can select:
            
            -   One or more bays (subject to max bays limit).
                
            -   Number of spaces required per bay (up to bay capacity).
                
-   Validation:
    
    -   At least one bay must be selected.
        
    -   Total number of bays must not exceed the configured max for the permission type.
        
    -   Street and bays must be **within the contract/enforcement area**.
        

**Dates & Times**

-   Start date/time (mandatory).
    
-   End date/time (mandatory).
    
-   System must validate:
    
    -   Start < End.
        
    -   Duration does not exceed permission type’s maximum duration.
        
    -   Duration satisfies any contract business rules (e.g., minimum lead time, except “short notice” features, which are out of scope for Southend).
        

Upon saving:

-   The application is assigned a unique **Dispensation Application ID**.
    
-   Initial status is set to **“Pending Approval”**.
    

#### FR‑011: View / Edit / Cancel Draft or Pending Applications

**Maps to:** BR‑005

-   Back Office User can:
    
    -   View list of applications filtered by status, date, applicant name, street, VRM, template type.
        
    -   Open an application in **Pending** or **Draft** status and:
        
        -   Edit any field except Application ID.
            
        -   Save changes.
            
        -   Cancel application (status: “Cancelled”).
            
-   Once approved (status: “Approved/Issued”), only limited fields are editable:
    
    -   Correction of non‑financial details (e.g., notes) may be allowed.
        
    -   Any change impacting price, dates, location, or bays should be treated as:
        
        -   Either a new application; or
            
        -   A renewal/extension flow (see FR‑020/FR‑021).
            

#### FR‑012: Validation for Street, Bay and Reason Selection

**Maps to:** BR‑010

-   The system must implement synchronous validation on application creation/edit:
    
    -   Street must exist in reference dataset for the contract.
        
    -   Selected bay IDs must be valid and active for the contract.
        
    -   Reason code must be from configured list and active.
        
-   If any validation fails, the application cannot be submitted and:
    
    -   User sees meaningful error messages (field‑level where possible).
        
    -   Errors are logged for audit.
        

* * *

### 5.3 Pricing and Payment

#### FR‑015: Real‑Time Pricing Calculation

**Maps to:** BR‑004, BR‑012, BR‑006

-   On the application screen, when the BOU has:
    
    -   Selected permission type,
        
    -   Selected bays and spaces,
        
    -   Provided dates/times,
        
-   The system computes the **estimated charge** using:
    
    -   Base pricing rules from FR‑002.
        
    -   Applicable tier(s) based on configured criteria.
        
-   Pricing calculation must produce:
    
    -   Duration in each chosen time unit (e.g., days, weeks).
        
    -   Charge per bay and total charge for all bays.
        
    -   Admin fee and VAT.
        
    -   Grand total.
        
-   The UI displays a **breakdown**:
    
    -   “Charge before admin fee/VAT”,
        
    -   “Admin fee”,
        
    -   “VAT”,
        
    -   “Total amount payable”.
        
-   If pricing configuration is missing or inconsistent:
    
    -   System blocks submission with a clear error.
        
    -   Error is logged.
        

#### FR‑016: Payment Handling

**Maps to:** BR‑006

-   For Southend, payment process can follow one of the following patterns (to be confirmed with finance/contract):
    
    -   **Option A – Offline Payment**:
        
        -   System records the amount payable and a payment reference.
            
        -   BOU records payment status manually after receiving payment in external system.
            
    -   **Option B – Integrated Payment**:
        
        -   System creates a payment request via existing payment service.
            
        -   On success, payment status is updated automatically.
            
-   Functional requirements (both patterns):
    
    -   Application cannot transition to “Approved/Issued” until payment status is **Paid** or **Payment Not Required** (for fee‑free or waived cases, if allowed by contract).
        
    -   Payment details stored:
        
        -   Payment method (if known),
            
        -   Payment date/time,
            
        -   Transaction reference (if available),
            
        -   Amount paid.
            
    -   Partial payments or refunds are out of scope unless explicitly added later (TBC).
        

* * *

### 5.4 Lifecycle Management: Submission, Approval, Renewal, Extension

#### FR‑020: Application Submission and Approval Workflow

**Maps to:** BR‑005

-   Workflow states at minimum:
    
    -   Draft,
        
    -   Pending Approval,
        
    -   Approved/Issued,
        
    -   Rejected,
        
    -   Cancelled,
        
    -   Expired.
        
-   Transitions:
    
    -   Draft → Pending Approval (on “Submit”).
        
    -   Pending Approval → Approved/Issued (on “Approve” with conditions met).
        
    -   Pending Approval → Rejected (on “Reject” with reason).
        
    -   Approved/Issued → Cancelled (on manual cancellation before start or mid‑term per rules).
        
    -   Approved/Issued → Expired (automatically when end date/time passes).
        
-   Conditions:
    
    -   Only applications with valid data and computed pricing can be submitted.
        
    -   Payment must be marked as **Paid/Not Required** before approval.
        
    -   Approval requires BOU with appropriate permission; approver details are stored in audit trail.
        
-   On approval:
    
    -   System generates a **Dispensation Permission Reference** (could be same as or separate from Application ID).
        
    -   For physical dispensations:
        
        -   System produces a **printable output** (PDF or template) containing:
            
            -   Dispensation reference,
                
            -   Street and bays covered,
                
            -   Dates/times,
                
            -   Vehicle (if applicable),
                
            -   Any conditions or notes.
                
    -   For virtual dispensations:
        
        -   System marks VRM(s) as permitted in enforcement data for given time and location.
            

#### FR‑021: Renewal for Car Park & Dispensation Templates

**Maps to:** BR‑014

-   For applications created using **Car Park** or **generic Dispensation** templates where renewal is allowed:
    
    -   From an **Approved/Issued** dispensation, BOU can select “Renew”.
        
    -   Renewal must:
        
        -   Pre‑populate:
            
            -   Applicant details,
                
            -   Location/bays,
                
            -   Template and permission type,
                
            -   Reason.
                
        -   Allow modification of dates/times (usually new period after original end date).
            
        -   Recalculate pricing for the new period.
            
    -   Renewal creates a **new application** linked to the original:
        
        -   Parent reference stored as “Renewal of \[Original ID\]”.
            
    -   All validations and payment rules apply as for a new application.
        
-   Renewal must not violate:
    
    -   Max duration per permission where rule is cumulative (if such a contract rule exists),
        
    -   Permission limits (FR‑003).
        

#### FR‑022: Extension (if/when brought in scope)

**Maps to:** BR‑005 (not in initial Southend scope; documented for future)

-   For Southend initial release, extension is **disabled** (per BRD “Short notice and extend dispensation (not for Southend)”).
    
-   Implementation note:
    
    -   UI should hide/disable “Extend” actions where configuration states “Extensions not allowed”.
        
    -   Backend should reject extension operations invoked via API if not permitted for authority/contract.
        

* * *

### 5.5 Integration with Illumin8

#### FR‑030: Publish Dispensation to Illumin8

**Maps to:** BR‑007

-   When a dispensation is **Approved/Issued**, the system must send data to **Illumin8** including:
    
    -   Dispensation reference,
        
    -   Application ID,
        
    -   Permission type/template,
        
    -   Contract/authority,
        
    -   Vehicle VRM(s) (if virtual),
        
    -   Physical indicator (if physical),
        
    -   Start/end date/time,
        
    -   Street and bay IDs,
        
    -   Reason code,
        
    -   Status (Approved/Issued),
        
    -   Any key conditions/notes.
        
-   On **status changes** (Cancelled, Expired), the system must send corresponding updates so that:
    
    -   CEOs / enforcement team can see up‑to‑date dispensation permissions and avoid incorrect enforcement.
        
-   Integration mechanism:
    
    -   To be aligned with existing Illumin8 integration guidelines (e.g., API, message bus).
        
-   Failure handling:
    
    -   If integration call fails:
        
        -   The dispensation remains in Approved/Issued status locally.
            
        -   The system logs the failure in an integration log.
            
        -   A retry mechanism or manual re‑send function should be available (detail to be specified with Integration Team).
            

* * *

### 5.6 Audit Trail and Notifications

#### FR‑035: Audit Trail

**Maps to:** BR‑008

-   The system must maintain a **comprehensive audit history** for:
    
    -   Application creation, updates, and status transitions.
        
    -   Pricing configuration changes (who changed what, when).
        
    -   Permission Builder changes for dispensation types and templates.
        
    -   Integration calls to Illumin8 (success/failure).
        
-   Each audit entry contains:
    
    -   Timestamp (UTC),
        
    -   User ID or System,
        
    -   Action type (Create/Update/Approve/Reject/Cancel/Expire/ConfigChange/IntegrationCall),
        
    -   Entity reference (Application ID, Permission Type ID, etc.),
        
    -   Optional “before/after” values for critical fields.
        

#### FR‑036: Notifications

**Maps to:** BR‑009, BR‑015 (constraint)

-   The system must support **notification events** on key actions:
    
    -   Application submitted.
        
    -   Application approved or rejected.
        
    -   Application cancelled.
        
-   For Southend:
    
    -   Automated **email** notifications to applicants are **not required**, per BR‑015.
        
    -   However, the system should:
        
        -   Capture notification events in a log that can be surfaced to:
            
            -   Back office (e.g., “Applicant to be informed of approval manually”).
                
            -   Future integrations (if email is later turned on for other contracts).
                
-   Future‑proofing:
    
    -   Notification framework should be extensible to:
        
        -   Email,
            
        -   SMS,
            
        -   Internal alerts, etc.,  
            without changing the core lifecycle logic.
            

* * *

### 5.7 Exclusions and Constraints

#### FR‑040: Exclude Blue Badge and Pension Discounts

**Maps to:** BR‑016

-   **No automatic discounts** must be applied for:
    
    -   Blue Badge holders.
        
    -   Pensioners.
        
-   If the underlying system has generic discount features:
    
    -   They must be disabled for **Dispensation** permission types under the Southend contract.
        
    -   Any attempt to apply such discounts via backdoor configuration must be prevented or flagged.
        

#### FR‑041: Exclude CEO Task Flow for Dispensation

**Maps to:** BR‑017

-   The dispensation workflow must not introduce:
    
    -   New CEO tasks specific to dispensation management in back office.
        
-   For enforcement use:
    
    -   CEOs only consume dispensation data via **Illumin8**; they do not perform back‑office workflow steps.
        
-   Any existing generic CEO task creation logic:
    
    -   Must be configured not to trigger on dispensation permissions (unless a future contract explicitly requires it).
        

#### FR‑042: Street vs Map Toggle Constraint

**Maps to:** Constraints in BRD

-   For Southend:
    
    -   Only **“Street” toggle** option is available; **map‑based location selection is disabled**.
        
-   Implementation:
    
    -   UI must hide or grey out any map toggle or map‑based selector for Southend users and contracts.
        
    -   Backend must not require map coordinates for dispensation creation in Southend.
        

* * *

## 6\. Non‑Functional Requirements (High‑Level)

_(These can be expanded if you want a separate NFR section.)_

-   **Performance**: Price calculation and validation should respond in < 2 seconds under normal load.
    
-   **Security**:
    
    -   Only authorised back office users can create/approve dispensations.
        
    -   Integration endpoints for Illumin8 and payment must be authenticated and encrypted (TLS).
        
-   **Audit & Compliance**: Audit trail must meet Marston’s standard retention policy and be exportable for audit.
    
-   **Configurability**: Templates, pricing, and limits are data‑driven so the same core solution can be re‑used for authorities beyond Southend.
    

* * *

## 7\. Traceability Matrix (BR → FR) – Extract

BR‑ID

BR Description (Short)

Related FR‑IDs

BR‑001

Enable creation of Dispensation permissions in Permission Builder

FR‑001, FR‑002, FR‑003

BR‑002

Physical and virtual dispensation modes

FR‑010, FR‑020

BR‑003

Implement three dispensation templates

FR‑001, FR‑010

BR‑004

Configurable pricing per bay (hour/day/week/month)

FR‑002, FR‑015

BR‑005

Application lifecycle management

FR‑010, FR‑011, FR‑020, FR‑021

BR‑006

Payment, admin fee, VAT handling

FR‑002, FR‑015, FR‑016

BR‑007

Integration with Illumin8

FR‑030

BR‑008

Audit trail for all dispensation actions

FR‑035

BR‑009

Notifications

FR‑036

BR‑010

Validation for street, bay, and reason

FR‑010, FR‑012

BR‑011

Permission limit enforcement

FR‑003

BR‑012

Tier pricing configuration

FR‑002, FR‑015

BR‑013

Multiple bay types and spaces

FR‑010, FR‑015

BR‑014

Renewal process (car park & dispensation templates)

FR‑021

BR‑015

Automated email (not for Southend)

FR‑036 (constraints)

BR‑016

Exclude Blue Badge and Pension discounts

FR‑040

BR‑017

Exclude CEO task flow for dispensation

FR‑041