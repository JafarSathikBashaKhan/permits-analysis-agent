# (Initial Discussion ) Staff Parking System

> **Confluence ID:** 1910603779 · **Version:** 1 · **Last updated:** 2026-04-24T08:42:56.019Z
> **Path:** Requirements / Staff Parking
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/1910603779/Initial+Discussion+Staff+Parking+System

---

# Staff Parking System – Summary

## 1\. Big Picture

The discussion covered the current Staff Parking setup (East Sussex and other councils), requirements for integrating Staff Parking into the new Apply platform, access control and login challenges, alternative design approaches (separate vs integrated portal), and immediate next steps for reviewing current stories and upcoming work.

## 2\. Current System (Deductions from Discussion)

-   Staff currently access permits through the same customer portal used by the public.
    
-   Harry uses a personal email for customer access because his work email is assigned to back-office and the system disallows using the same email for both back-office and customer logins.
    
-   The system does not automatically recognise staff users.
    
-   No separate staff-only portal exists today.
    
-   Staff identification likely involves email domain checks, admin verification, or manual setup, but this is not clearly defined.
    
-   Staff parking flows operate today in East Sussex, Lewisham, and Wokingham.
    

Current-state takeaway: Staff use the standard customer portal with workarounds, causing email conflicts and role ambiguity. There is no dedicated staff area.

## 3\. Expectations for Apply (Jo’s Direction)

### 3.1 Dedicated Staff Parking Module

Create a distinct Staff Parking section within Apply that is generic and reusable across councils (East Sussex, Lewisham, Wokingham, etc.).

### 3.2 Hide Staff Permits from the Public

Staff permits must not be visible, discoverable, or purchasable by the general public.

### 3.3 Support Dual-Role Users

Enable users to be both back-office users and staff permit applicants without email conflicts or separate personal/work accounts.

### 3.4 Example UX

Show an additional, conditional tab for eligible users on the customer account (e.g., “Staff Permits” alongside “My Permits”).

### 3.5 Collaboration

-   Jo to review notes and potential designs.
    
-   Radiance to explore options and reconvene to align.
    

## 4\. Rules, Constraints, and Open Design Areas

### 4.1 Visibility and Access

-   Staff permit products and flows must be hidden from non-staff users.
    

### 4.2 Email and Identity

-   Remove the limitation that blocks the same email from being used for both back-office and customer roles.
    
-   Allow the same email across roles under a unified identity.
    
-   Introduce a role and permission model to support multiple roles per account.
    

### 4.3 Staff Identification Options

-   Email domain checks.
    
-   Staff verification flow.
    
-   Admin assignment of staff status.
    
-   Internal linking of back-office and customer identities.
    

Staff identification mechanism is not finalised and requires design validation, especially regarding security, privacy, and false-positive prevention.

### 4.4 Portal Strategy (Decision Pending)

-   Separate Staff Portal (Radiance preference) to avoid conflicts and simplify isolation.
    
-   Single Integrated Portal with role-based access and hidden catalogue (Jo’s preference).
    

## 5\. Key Questions and Current Positions

-   **Separate portal?** Radiance leaning yes; Jo prefers integrated with robust role controls. Decision pending.
    
-   **Harry’s personal email use?** Due to current restriction on reusing work email for customer login when it’s already used in back-office.
    
-   **Dual-role handling?** Identify staff and surface a Staff Permits tab/flow within the same account. Details to be refined.
    
-   **Prevent public access?** Options include separate portal, role-based access, email/staff verification, and hidden product catalogue. Final approach TBD.
    
-   **Weekly dev reviews?** Jo shared availability; Radiance to schedule accordingly.
    

## 6\. Proposed Product Approach (Strawman)

-   **Identity and Roles**
    
    -   Single identity per user with support for multiple roles (e.g., back-office, staff-applicant, public).
        
    -   Permit the same email to hold multiple roles; enforce strong authentication and clear session context switching.
        
-   **Access Control**
    
    -   Role-based feature flags to conditionally show the Staff Permits tab and staff-only catalogue items.
        
    -   Hard authorization checks server-side for all staff endpoints and products.
        
-   **Staff Verification**
    
    -   Configurable methods per council: admin assignment, domain-based auto-suggest plus verification, or HR file import.
        
    -   Expiry and re-verification policy to keep staff status up to date.
        
-   **UX**
    
    -   Single portal with conditional navigation: My Permits, Staff Permits (if role granted).
        
    -   Clear labelling to prevent users from confusing staff vs public flows.
        

## 7\. Risks and Mitigations

-   **Risk:** Public discovery of staff permits. **Mitigation:** Hidden catalogue, RBAC, server-side checks, and direct-link gating.
    
-   **Risk:** Identity collisions and account duplication. **Mitigation:** Unified account model, duplicate detection, and email reuse allowed across roles.
    
-   **Risk:** False-positive staff identification via domain. **Mitigation:** Require verification or admin approval before granting staff role.
    

## 8\. Decisions, Open Questions, and Next Steps

ca992753-e5cf-4a39-845e-5ffdbc04ca7212b6de80-a0bf-4354-9f55-088b6bc4bb5eDECIDEDStaff permits must be hidden from the public and protected by role-based authorization.b584039f-a91e-4ac0-bd75-1029a9ed5491PROPOSEDAdopt a single-portal approach with role-based access and allow the same email for multiple roles.

-   Staff permits must be hidden from the public and protected by role-based authorization.
-   Adopt a single-portal approach with role-based access and allow the same email for multiple roles.

### Open Questions

-   Confirm portal strategy: separate portal vs integrated with RBAC.
    
-   Select the primary staff identification method per council (domain, verification, admin assignment, HR import).
    
-   Define re-verification cadence and audit requirements.
    

### Next Steps

16 19e1362b-d3d9-40ea-b12e-734d745a8374 incomplete Jo to consolidate design notes and preferred portal strategy 17 2b7c0bb7-599e-45a8-a1d0-655d998dab19 incomplete Radiance to draft an identity and RBAC model supporting dual roles 18 530f19a2-9972-4c60-bc20-0fdd4425a2a7 incomplete Prepare a prototype of the Staff Permits tab and hidden catalogue behaviour 19 d895e383-388d-48d0-b039-ff629ed5f55f incomplete Align on verification method and data sources with council stakeholders 20 d1587835-b26c-46ad-9ba3-ec06a402a9dc incomplete Schedule weekly requirement reviews with Jo’s availability windows

* * *

_Prepared as a concise summary for planning and alignment. Convert into a formal specification by adding user stories, acceptance criteria, and non-functional requirements as decisions solidify._