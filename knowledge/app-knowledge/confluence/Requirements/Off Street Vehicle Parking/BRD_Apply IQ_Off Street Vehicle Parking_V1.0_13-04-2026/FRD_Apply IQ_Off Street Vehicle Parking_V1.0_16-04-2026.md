# FRD_Apply IQ_Off Street Vehicle Parking_V1.0_16-04-2026

> **Confluence ID:** 1884848129 · **Version:** 2 · **Last updated:** 2026-04-16T09:21:52.410Z
> **Path:** Requirements / Off Street Vehicle Parking / BRD_Apply IQ_Off Street Vehicle Parking_V1.0_13-04-2026
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/1884848129/FRD_Apply+IQ_Off+Street+Vehicle+Parking_V1.0_16-04-2026

---

## 1\. Document Control

Version

Date

Author

Description

1.0

16-Apr-2026

Prathiba K

Initial FRD derived from BRD\_Apply IQ\_Off Street Vehicle Parking\_V1.0

* * *

## 2\. Project Overview

This Functional Requirements Document (FRD) describes the functional requirements for implementing the **Off‑Street Vehicle Parking** feature in the **Apply IQ System**. The feature enables councils to capture information from applicants regarding the availability of off‑street vehicle parking at a property, in a configurable and information‑only manner.

This FRD has been derived directly from the approved business requirements documented in **BRD\_Apply IQ\_Off Street Vehicle Parking\_V1.0\_13‑04‑2026**.

* * *

## 3\. Purpose

The purpose of this document is to define the detailed functional behaviour of the Off‑Street Vehicle Parking feature so that:

-   System configuration aligns with council requirements
    
-   Customer and Back‑Office user journeys are clearly defined
    
-   Data capture, storage, and visibility are consistent
    
-   No eligibility or pricing logic is enforced in this phase
    

* * *

## 4\. Scope

### 4.1 In Scope

-   Configuration of an Off‑Street Vehicle Parking toggle in Permission Builder
    
-   Display of the Off‑Street Vehicle Parking question for zonal permissions only
    
-   Capture of applicant response in Customer Portal and Back Office flows
    
-   Mandatory validation when the question is enabled
    
-   Storage of the captured value against the application
    
-   Visibility of the value in CP & BO application overview
    
-   Availability of the field in:
    
    -   Email and document templates (merge field)
        
    -   Active Permits Report
        

### 4.2 Out of Scope

-   Permit eligibility enforcement based on off‑street parking
    
-   Household, property, or quota limits
    
-   Permit pricing rules based on off‑street parking
    
-   Non‑zonal permission applicability
    

* * *

## 5\. Stakeholders

Name

Role

Department

Contact Info

Joanne Archer

Product Owner

NSL

[joanne.archer@nslservices.co.uk](mailto:joanne.archer@nslservices.co.uk)

Prathiba K

Business Analyst

Logic Valley

[prathiba.k@logicvalley.in](mailto:prathiba.k@logicvalley.in)

Gokulakannan Murugesan

Project Manager

Logic Valley

[gokulakannan.murugesan@logicvalley.in](mailto:gokulakannan.murugesan@logicvalley.in)

* * *

## 6\. Functional Requirements

Req ID

Requirement Description

Priority

Acceptance Criteria

FR-001

The system shall display the Off‑Street Vehicle Parking configuration option only when Permission Category is set to Zonal in Permission Builder.

High

Option is visible only for Zonal permissions- Option is hidden and not configurable for non‑zonal permissions

FR-002

The system shall provide a toggle to enable or disable Off‑Street Vehicle Parking per permission.

High

Admin can enable or disable the toggle- When disabled, the question is not shown in CP or BO

FR-003

The system shall allow admins to configure a selectable list of Off‑Street Vehicle Parking options, including standard and custom values.

High

When off street vehicle parking is enable Predefined values (1 / 2/ None) are available by default

-   Admin can add /edit / remove custom numeric options
    

-   Custom values must be positive whole numbers only- Configured list is Published and used across CP and BO
    

FR-004

When enabled, the system shall display the Off‑Street Vehicle Parking question in Customer Portal and Buy Now (BO) application flows.

High

Given any templates selected.

Question appears in the correct application form Address tab - Same options are shown in CP and BO purchase flow

FR-005

The Off‑Street Vehicle Parking question shall be mandatory when enabled.

Medium

User cannot proceed without selecting a value- Appropriate validation message is shown if skipped

FR-006

The system shall store the selected Off‑Street Vehicle Parking value against the application.

High

Selected value is persisted on save/submit- Value is retrievable for reporting and display

FR-007

The system shall display the captured value in Application Overview screens in CP and BO.

Medium

Value is visible post‑submission in CP- Value is visible to BO users in application overview (CP&BO)

FR-008

The system shall expose Off‑Street Vehicle Parking as a merge field in templates and emails.

High

Merge field is selectable in template settings builder & Email configuration (MNPS for apply contract)- Correct value is populated in generated outputs

FR-009

The system shall include Off‑Street Vehicle Parking as a column in the Active Permits Report.

High

Column is available in the report- Captured value is displayed per permit

* * *

## 8\. Data Requirements

### Data Inputs

-   Off‑Street Vehicle Parking value (configured list – e.g., None / 0 / 1 / 2)
    

### Data Outputs

-   Display of captured value in Application Overview (CP & BO)
    
-   Inclusion in Active Permits Report
    
-   Merge field output in email/templates
    

### Data Validation Rules

-   Field is mandatory and available in CP & BO purchase flow only when enabled in Permission Builder
    

* * *

## 9\. Integration Requirements

-   No new external system integrations
    
-   Must utilise existing reporting and template merge‑field framework
    

* * *

## 10\. Non‑Functional Requirements

-   Performance: No noticeable impact to application flow
    
-   Security: Data stored under existing Apply security model
    
-   Compliance: GDPR‑compliant handling of applicant data
    
-   Availability: Feature must adhere to existing Apply availability standards
    

* * *

## 11\. Assumptions

-   Data captured is for information purposes only
    
-   Councils will interpret and use the data outside the system if required
    

* * *

## 12\. Constraints

-   Applicable only to zonal permissions
    
-   No eligibility or pricing validation to be introduced in this phase
    

* * *

## 13\. Dependencies

-   Availability of Permission Builder configuration enhancements
    
-   Reporting framework supporting new column addition
    

* * *

## 14\. Risks & Mitigations

**Risk**

**Mitigation**

Misinterpretation of off‑street parking as eligibility logic

Clearly label question as informational only

Incorrect admin configuration

Use clear labels and validation in Permission Builder

* * *

## 15\. Approval

Name

Role

Signature

Date

Joanne Archer

Product Owner