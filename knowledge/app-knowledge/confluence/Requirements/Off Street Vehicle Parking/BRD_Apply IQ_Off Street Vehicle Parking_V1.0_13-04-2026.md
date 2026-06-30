# BRD_Apply IQ_Off Street Vehicle Parking_V1.0_13-04-2026

> **Confluence ID:** 1869283381 · **Version:** 7 · **Last updated:** 2026-04-16T09:22:18.724Z
> **Path:** Requirements / Off Street Vehicle Parking
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/1869283381/BRD_Apply+IQ_Off+Street+Vehicle+Parking_V1.0_13-04-2026

---

## 1\. Document Control

Version

Date

Author

Description

1.0

13-Apr-2026

Prathiba K

Initial BRD for Off-Street Vehicle Parking feature

1.1

15-Apr-2026

Prathiba K

* * *

## 2\. Executive Summary

This document describes the business requirements for introducing an **Off‑Street Vehicle Parking** declaration capability within the Apply IQ system. The feature allows councils to optionally capture information from applicants on whether their property has off-street parking (e.g., driveway) during the permit application process. This requirement was discussed and agreed during the call with Joanne Archer on 13 April 2026.

* * *

## 3\. Business Objectives

-   Enable councils to capture off‑street vehicle parking information from applicants.
    
-   Provide a configurable solution that can be enabled per permission.
    
-   Ensure the captured information is visible to both customers and back office users.
    
-   Support council policy decisions without enforcing permit eligibility rules at this stage.
    

* * *

## 4\. Background

Certain councils (e.g., Wokingham) require customers to declare whether they have off‑street parking as part of resident permit applications. Currently, the system does not support capturing this data in a configurable and reusable manner. During the discussion with Joanne Archer, it was agreed that this should be introduced as an information-only question controlled via Permission Builder configuration.

* * *

## 5\. Scope

### 5.1 In Scope

-   Configuration of an **Off‑Street Vehicle Parking** toggle in Permission Builder.
    
-   **The Off‑Street Vehicle Parking option in Permission Builder shall be displayed only when the Permission Category is set to** _**Zonal**_.
    
-   Ability to configure selectable values (e.g., None / 0 / 1 / 2 / custom values).
    
-   Display of the question in the Customer Portal application form & buy now in Back-office application form when enabled.
    
-   Storage of the applicant’s response against the application.
    
-   Availability of Off‑Street Vehicle Parking as a **merge field** in email and template settings in merge field.
    
-   Inclusion of the Off‑Street Vehicle Parking field in the **Active Permits Report**
    
-   Visibility of the response in:
    
    -   Customer Portal – Application Overview
        
    -   Back Office – Application Overview
        
-   Applicability limited to **Zonal permissions**.
    

### 5.2 Out of Scope

-   Permit eligibility or entitlement validation based on off‑street parking.
    
-   Household limit or quota enforcement.
    
-   Reporting or analytics based on captured data.
    
-   Applicability to non‑zonal permissions.
    

* * *

## 6\. Stakeholders

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

## 7\. Business Requirements

Requirement ID

Description

Priority

Owner

BR-001

The Off‑Street Vehicle Parking option in Permission Builder shall be displayed **only when the Permission Category is set to Zonal**.

High

Product Owner

BR-002

The system shall provide a configurable toggle in Permission Builder to enable/disable Off‑Street Vehicle Parking for a permission.

High

Product Owner

BR-003

When enabled, the admin shall be able to configure selectable values including None/Zero.

High

Product Owner

BR-004

The system shall display the Off‑Street Vehicle Parking question in the Customer Portal application form & Buy Now in Back Office application form when the toggle is enabled.

High

Product Owner

BR-005

The applicant’s response shall be mandatory only when the question is enabled.

Medium

Product Owner

BR-006

The selected response shall be stored against the application.

High

Product Owner

BR-007

The response shall be visible in Customer Portal and Back Office application overviews.

Medium

Product Owner

BR-008

The system shall expose Off‑Street Vehicle Parking as a **merge field** in email and template settings in builder.

The merge field shall display the value captured against each permit application.

High

Product Owner

BR-009

The Off‑Street Vehicle Parking field shall be available within the **Active Permits Report**.

High

Product Owner

* * *

## 8\. Assumptions

-   The captured data is for information purposes only.
    
-   Councils may use the data externally for policy decisions.
    
-   Any enforcement or validation based on this data will be handled in a future phase.
    

* * *

## 9\. Constraints

-   Feature is limited to zonal resident permissions only.
    
-   Must not impact existing application validation or pricing flows.
    
-   Must be configurable without code changes.
    

* * *

## 10\. Risks

Risk Description

Impact

Likelihood

Mitigation Strategy

Misinterpretation of data as eligibility logic

Medium

Medium

Clearly label as information-only in both CP and BO

Incorrect configuration by admin

Low

Medium

Provide validation and clear labels in Permission Builder

* * *

## 11\. Approval

Name

Role

Signature

Date

Joanne Archer

Product Owner

12.  **Queries**
     

-   Would you like to add the **“Off Street Vehicle Parking”** field to the **‘Active’** report menu?
    
-   Would you like to include **“Off Street Vehicle Parking”** as a merge field?