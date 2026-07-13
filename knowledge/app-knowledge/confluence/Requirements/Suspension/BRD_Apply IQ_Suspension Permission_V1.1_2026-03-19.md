# BRD_Apply IQ_Suspension Permission_V1.1_2026-03-19

> **Confluence ID:** 1794539529 · **Version:** 3 · **Last updated:** 2026-04-02T05:56:52.711Z
> **Path:** Requirements / Suspension
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/1794539529/BRD_Apply+IQ_Suspension+Permission_V1.1_2026-03-19

---

1.  **Document Control**
    

**System**: Apply Permit System  
**Module**: Parking Suspensions  
**Document Type**: Business Requirements Document (BRD)  
**Audience**: Product, Business Analysis, UX, Development, QA, Operations, Client Authorities  
**Status**: Baseline Requirements  
**Related Modules**: Permits, Dispensations, Payments, GIS/TRO, Enforcement (HHD), Reporting

* * *

2.  **Background & Context**
    

Local Authorities require the ability to temporarily suspend parking bays or spaces to facilitate activities such as removals, utilities works, construction, events, or highway works. The Apply Permit System provides a **customer self‑service and back‑office managed suspension capability**, enabling end‑to‑end digital management of suspension requests, approvals, payments, on‑street execution, and audit trails.​

The suspension capability must support **contract‑specific rules**, varying pricing models, lead times, enforcement visibility, and statutory obligations while maintaining accessibility, transparency, and operational efficiency.

* * *

3.  **Business Objectives**
    

Enable councils to manage temporary parking suspensions through a fully digital, end-to-end lifecycle that is efficient, transparent, and compliant.

-   Provide a fully digital, end-to-end suspension lifecycle (apply, assess, approve, pay, execute, monitor, close).
    
-   Reduce manual processing and errors through validation, workflow, and automation.
    
-   Improve customer experience and transparency via clear status tracking, notifications, and self-service management.
    
-   Support operational delivery across Back Office, Civil Enforcement Officers (CEOs), and signage/operations teams.
    
-   Ensure compliance with local authority rules and provide a complete audit trail for all actions and decisions.
    
-   Provide flexible configuration to meet differing contract requirements without code changes.
    
-   Ensure accurate pricing, fee calculation, and payment handling in line with contract rules.
    
-   Integrate with enforcement (NPS PCN) and visibility (Illumin8) systems.
    
-   Integrate seamlessly with payments, GIS/TRO services, and reporting to support end-to-end operational management.
    
-   Support both Back Office and Customer Portal flows for application and management.
    

* * *

4.  **Scope**
    

**4.1 In Scope**

-   Suspension permission configuration in Builder (category, permit mode, bay selection, comments)
    
-   Pricing configuration (P1, P2, P3 rules, admin fees, VAT, short notice)
    
-   Contract settings (street selection, map enablement, town/area)
    
-   Contract setting in MNPS for Apply (PCN CEO mapping)
    
-   Customer Portal and Back Office application flows
    
-   Validation rules (duration, fees, permission limits)
    
-   Bay selection and pricing calculation
    
-   CEO task management and NPS PCN integration
    
-   Illumin8 integration for enforcement visibility
    
-   Reporting and merge fields for templates
    

**4.2 Out of Scope**

-   Physical erection/removal of signage (operational activity only)
    
-   Third‑party contractor scheduling systems (unless explicitly integrated)
    
-   Southend (phase 1): Customer Portal purchase is out of scope (Back Office only initially)
    
-   Southend (phase 1): Email communications/notifications are out of scope
    

* * *

5.  **Stakeholders & User Roles**
    

**5.1 Customer Roles**

-   Resident
    
-   Business user
    
-   Contractor / authorised requester
    
-   Event organiser
    

**5.2 Internal Roles**

-   Back‑office suspension officer
    
-   Supervisor / manager
    
-   Civil Enforcement Officer (CEO)
    
-   Suspension signage / operations team
    
-   Finance / reconciliation users
    
-   NPS PCN Integration Team
    
-   Illumin8 Integration Team
    

* * *

6.  **Functional Requirements**
    

**6.1 Suspension Types & Configuration**

The system shall support **multiple configurable suspension types**, including but not limited to:

-   Resident permit bays
    
-   Pay‑to‑park bays
    
-   Council‑owned car parks
    
-   Yellow line dispensations
    

System provides a Suspension category in Permission Builder.

Each suspension type must be configurable per contract with:

-   Minimum lead time
    
-   Maximum duration
    
-   Pricing model (per bay / per day / flat fee)
    
-   Express or short‑notice fees
    
-   Validation for Short Notice lead time and fee when enabled.
    
-   Required documentation
    
-   Approval workflow rules ​​
    
-   Start Date Policy defaults to “Forward to Set Date”; Include Time enabled by default
    
-   Permit Mode defaults to Physical; Permit Days field hidden.
    
-   Enable Multiple Bay toggle allows multi-bay selection per street.
    
-   Enable Comment Box toggle for optional comments in application.
    
-   Short Notice toggle in Suspension Settings (not used for Southend).
    
-   Extend Suspension configuration option (not used for Southend).
    
-   Extend action hidden when disabled; Cancel becomes primary action.
    
-   Pricing configuration adapts for Suspension category; supports P1/P2/P3 rules.
    
-   Permission-specific pricing rules.
    
-   Admin can select period types (Hour, Day, Week, Month) for P1.
    
-   Price per bay configurable; Different Bay Price toggle available.
    
-   Total price calculated as Price × Bay Spaces × Duration.
    
-   P2 rule supports min/max suspension, min charge, incremental pricing.
    
-   Minimum Suspension Charge applied for minimum duration; incremental for extra.
    
-   P2 supports Different Bay Price toggle.
    
-   P2 Minimum & incremental pricing not used for Southend.
    
-   P3 supports Fixed Duration Pricing and Fixed Price options.
    
-   Fixed Duration: price per bay type, regardless of bay spaces.
    
-   Fixed Price: single price regardless of duration or bay spaces.
    
-   Contract Settings include Suspension section.
    
-   Street Selection: Use System Streets or free-text entry.
    
-   Map Integration toggle (not required for Southend).
    
-   Display Town Field toggle (not required for Southend).
    
-   PCN CEO Mapping toggle for task assignment.
    
-   Non-zonal address-based suspension; address search via using Path integration and manual entry.
    
-   Document Tab for supporting documents (if configured).
    
-   Suspension Details tab captures all mandatory fields with validation.
    
-   End Date & Time auto-calculated; editable time portion.
    
-   Purchase Reason logic and contract-specific options.
    
-   Validation rules for min/max duration, min fee, permission limits.
    
-   Bay selection supports contract-specific bay types and multi-bay per street.
    
-   Pricing calculation per bay type, additional fees, and transparent breakdown.
    
-   Back Office and Customer Portal views display all relevant details.
    
-   CEO Task Management and NPS PCN integration for task assignment and status sync.
    
-   Illumin8 integration for enforcement and visibility.
    
-   Reporting and merge fields for templates and documents.
    
-   Merge fields for templates and documents.
    

* * *

**6.2 Customer Application Journey**

The system shall provide a **self‑service suspension application journey** via web and mobile devices.

The application must capture:

-   Applicant details (derived from account)
    
-   Suspension reason
    
-   Start and end date/time
    
-   Location and bay selection
    
-   Vehicle registration(s), where required
    
-   Supporting documents or photos
    
-   Acknowledgement of terms and conditions
    

The system must validate mandatory fields prior to submission and prevent invalid or conflicting selections.​

* * *

**6.3 Map & Location Selection**

Where enabled, the system shall integrate with **TRO/TMO or GIS mapping services** to allow customers to:

-   Select bays or parking spaces visually
    
-   View bay availability
    
-   Prevent selection of already suspended or restricted bays
    
-   Capture bay metadata (type, length, restrictions) ​​
    

* * *

**6.4 Pricing & Payments**

The system shall automatically calculate suspension charges based on:

-   Bay type
    
-   Location
    
-   Duration
    
-   Contract‑specific pricing rules
    
-   Express or short‑notice fees
    

Payment handling must support:

-   Online card payments (PCI‑DSS compliant)
    
-   Pre‑authorisation with capture on approval
    
-   Invoice payments for large or complex suspensions (where enabled)
    
-   Automated refunds for cancellations (subject to rules)​
    

* * *

**6.5 Back‑Office Review & Workflow**

Suspension applications must enter a **back‑office review queue** upon submission.

Back‑office users must be able to:

-   Review application details and maps
    
-   Approve, reject, or request further information
    
-   Record rejection reasons from a configurable list
    
-   Trigger automated correspondence
    
-   Flag applications requiring site inspection
    
-   Apply overrides where authorised
    

All actions must be fully audited. ​

* * *

**6.6 Suspension Execution & Monitoring**

The system shall support operational execution by allowing:

-   Creation of suspension tasks for signage teams
    
-   Recording date/time of suspension erection
    
-   Upload of photographic evidence
    
-   Recording CEO patrol checks
    
-   Recording date/time of suspension removal
    
-   Upload of removal evidence
    

Data may be captured manually or via handheld devices (HHDs) where configured.​

* * *

**6.7 Enforcement Visibility**

Civil Enforcement Officers must have access via HHD to:

-   View active and upcoming suspensions
    
-   Identify suspended bays during patrol
    
-   Validate enforcement decisions without accessing personal data
    

Suspension data must be near real‑time and reliable. ​​

* * *

**6.8 Notifications & Correspondence**

The system shall issue automated notifications at key stages:

-   Submission confirmation
    
-   Status changes (under review, approved, rejected)
    
-   Requests for additional information
    
-   Approval letters and suspension notices
    

Templates must be configurable per contract and channel (email, letter).

* * *

7.  **Non‑Functional Requirements**
    

**7.1 Accessibility**

-   WCAG 2.1 AA compliant (moving toward WCAG 2.2 AA) ​
    

**7.2 Performance**

-   Application submission < 3 seconds under normal load
    
-   Map interactions responsive on mobile and desktop
    

**7.3 Security & Compliance**

-   PCI‑DSS compliant payments
    
-   Role‑based access control
    
-   Full audit trail of actions
    
-   GDPR and UK DPA compliance
    

**7.4 Availability**

-   Browser‑based, no local installation
    
-   Multi‑tenant, contract‑isolated configuration ​
    

* * *

8.  **Reporting Requirements**
    

The system shall produce reports including:

-   Suspensions by date, location, type
    
-   Revenue and refunds
    
-   Outstanding and upcoming suspensions
    
-   Operational execution status
    
-   Enforcement visibility reports ​
    
-   KPI performance; 
    
-   Suspensions/dispensations issued; 
    
-   Short and long term Suspensions/dispensations issued; 
    
-   Suspension/dispensation payments; 
    
-   End of day financial reconciliation reports; 
    
-   Suspension/dispensation locations; and 
    
-   Suspension/dispensation trends. 
    

* * *

9.  **Suspension, Assumptions & Constraints**
    

**Dependencies**

-   TRO/TMO or GIS integration (where applicable)
    
-   Payment provider integration
    
-   HHD enforcement systems
    
-   Document storage services
    

**Assumptions**

-   Contract-level rules are fully configured prior to go‑live
    
-   Authorities provide accurate bay and restriction data
    

·        Users have internet access and can access the Apply portal and Back Office.

·        Customers provide valid and accurate address and permit information.

·        Council administrators and enforcement officers are trained on the new system.

·        All required integrations (NPS PCN, Illumin8) are ready and tested before launch.

**Constraints**

·        The solution must be delivered within the existing Apply and NPS PCN tech stacks.

·        Some features (P2, Map Integration, Display Town, Extend Suspension, Short Notice) are defined but not required for Southend.

·        Customer Portal purchase is not available for Southend at launch (Back Office only).

·        Only authorized roles can configure and approve suspensions.

·        Integration endpoints must use existing authentication mechanisms.

·        System must comply with council and data protection regulations.

* * *

**10\. Success Criteria**

The suspension module will be deemed successful when:

-   Customers can complete suspension requests without manual intervention
    
-   Back‑office processing time is reduced
    
-   Enforcement teams have reliable, real‑time suspension visibility
    
-   All actions are auditable and reportable
    
-   The solution supports multiple authority contracts without code changes
    

* * *

**11\. Risks**

Risk Description

Impact

Likelihood

Mitigation Strategy

Misconfiguration of pricing rules leading to incorrect charges

High

Medium

Validation in Builder, test scenarios, clear admin guidance

Integration downtime between Apply and PCN/Illumin8

High

Medium

Error handling, retry strategy, surface integration status to admins

Complex status flows causing user confusion

Medium

Medium

UI/UX consistency, training materials, concise labels

Incomplete contract configuration before go-live

High

Medium

Early configuration workshops, readiness checklists

Data quality issues from manual address entry

Medium

Medium

Validation rules, user guidance, address lookup integration

Delays in stakeholder training or communication

Medium

Medium

Early engagement, clear documentation, support channels