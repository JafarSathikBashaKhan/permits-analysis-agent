# ApplyIQ_Dispensation_BRD_V1.0_18032026

> **Confluence ID:** 1789919275 · **Version:** 6 · **Last updated:** 2026-04-01T10:39:07.132Z
> **Path:** Requirements / Dispensation
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/1789919275/ApplyIQ_Dispensation_BRD_V1.0_18032026

---

1.  **Document Control**
    

Version

Date

Author

Description

1.0

2026-03-18

Natarajan Arumugam

Initial draft based on Dispensation requirements

* * *

2.  **Executive Summary**
    

This document outlines the business requirements for the Dispensation feature within the enforcement domain. Dispensation refers to a formal exemption, relaxation, or waiver from standard rules or penalties, granted by an authority. The feature is designed to provide controlled flexibility in enforcement, balancing compliance with practical realities, and ensuring transparency and auditability.

* * *

3.  **Business Objectives**
    

-   Enable authorities to grant dispensations efficiently and transparently.
    
-   Support multiple dispensation templates and pricing models.
    
-   Ensure compliance, auditability, and integration with existing systems (e.g., Illumin8).
    
-   Provide a user-friendly application and approval process for both back office and customer portal users.
    

* * *

4.  **Background**
    

Dispensation is a critical function in enforcement, allowing for exceptions to standard rules under specific circumstances. The initial scope focuses on back office operations for Southend, with pricing by day or week or Month, and non-zonal coverage. The system must support various templates, pricing rules, and integration points.

* * *

5.  **Scope**
    

**5.1 In Scope**

-   Creation and management of Dispensation permissions in the Permission Builder.
    
-   Support for physical and virtual dispensations.
    
-   Non-zonal, address-based dispensations.
    
-   Multiple templates (Suspension, Car Park, New Dispensation template).
    
-   Configurable pricing (hour/day/week/month/Year) per bay.
    
-   Application lifecycle management (submission, approval, renewal, extension).
    
-   Payment, admin fee, and VAT handling.
    
-   Integration with Illumin8.
    
-   Audit trail and notifications.
    

**5.2 Out of Scope**

-   Blue Badge and Pension discounts.
    
-   P3 pricing rule (not for Southend).
    
-   Map integration (not for Southend).
    
-   Short notice and extend dispensation (not for Southend).
    
-   CEO task flow at back office for dispensation.(This is not required for dispensation)
    
-   Automated Email communication (not for southend)
    

* * *

6.  **Stakeholders**
    

**External Stake holders**

Name

Department

Enforcement Team

Enforcement

Illumin8 Integration Team

IT

End Users (Back Office, Applicants)

Various

* * *

7.  **Business Requirements**
    

Requirement ID

Description

Priority (High/Med/Low)

Owner

BR-001

Enable creation of Dispensation permissions in Permission Builder

High

IT Dev

BR-002

Support for physical and virtual dispensation modes

High

IT Dev

BR-003

Implement three dispensation templates (Suspension, Car Park, Dispensation template)

High

IT Dev

BR-004

Configurable pricing per bay (hour/day/week/month)

High

IT Dev

BR-005

Application lifecycle management (submission, approval, renewal, extension)

High

IT Dev

BR-006

Payment, admin fee, VAT handling

High

IT Dev

BR-007

Integration with Illumin8

High

IT Dev

BR-008

Audit trail for all dispensation actions

High

IT Dev

BR-009

Notifications to applicants and enforcement team

Medium

IT Dev

BR-010

Validation for street, bay, and reason selection

High

IT Dev

BR-011

Permission limit enforcement

Medium

IT Dev

BR-012

Tier pricing configuration for car park template and dispensation template

Medium

IT Dev

BR-013

Support for multiple bay types and spaces

High

IT Dev

BR-014

Support for Renewal process for car park and dispensation template

High

IT Dev

BR-015

Support for Automated email communication for applicants via email (not required for southend)

High

IT Dev

BR-016

Exclude Blue Badge and Pension discounts

High

IT Dev

BR-017

Exclude CEO task flow for dispensation

High

IT Dev

* * *

8.  **Assumptions**
    

-   Only back office operations are in scope for Southend.
    
-   Pricing rules are configurable per contract/template.
    
-   Integration with Illumin8 is feasible and supported.
    
-   Users have access to required address and bay data.
    

* * *

9.  **Constraints**
    

-   No customer portal purchase for Southend in initial scope.
    
-   Only one of street toggle or map toggle can be active at a time.
    

* * *

**10\. Risks**

Risk Description

Impact

Likelihood

Mitigation Strategy

Integration with Illumin8 delayed

High

Medium

Early engagement with integration team

Incorrect pricing configuration

Medium

Medium

Thorough testing and validation

User confusion over templates

Medium

Low

Clear documentation and training

Data entry errors (address, bay)

Medium

Medium

Validation and audit trail

* * *

**11\. Approval**

Name

Role

Signature

Date

 Product Owner

Natarajan A

Business Analyst