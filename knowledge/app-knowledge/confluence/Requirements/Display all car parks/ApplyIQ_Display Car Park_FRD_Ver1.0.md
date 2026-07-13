# ApplyIQ_Display Car Park_FRD_Ver1.0

> **Confluence ID:** 1858633730 · **Version:** 5 · **Last updated:** 2026-04-17T04:39:02.380Z
> **Path:** Requirements / Display all car parks
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/1858633730/ApplyIQ_Display+Car+Park_FRD_Ver1.0

---

**Functional Requirements Document (FRD)**

**ApplyIQ – Display Car Park\_ Functional Requirements Document (FRD)**

1.  **Document Control**
    

**Item**

**Value**

Version

1.1

Date

08 Apr 2026

Author

Natarajan Arumugam

Source Document

ApplyIQ\_Display Car Park\_Ver1.0 (BRD)

Purpose

Translate business requirements into functional system behaviour

* * *

2.  **Purpose**
    

This FRD defines **how the system shall behave** to satisfy the approved **Business Requirements (BRD)** for configuring, discovering, and purchasing Car Park permits across Back Office (BO) and Customer Portal (CP), including availability enforcement, permission mapping, and customer journeys.

## Background & Context

noteab0f6f32-8c1f-49ac-9dc2-44e884d238bb

Councils require a simple way to configure car parks (on/off-street), publish details to CP, and optionally prevent overselling through capacity enforcement, while providing customers an intuitive search/list/map experience.

Councils require a simple way to configure car parks (on/off-street), publish details to CP, and optionally prevent overselling through capacity enforcement, while providing customers an intuitive search/list/map experience.

-   Centralise car park master data at contract level in BO.
    
-   Expose searchable, filterable car parks (list and optional map) in CP.
    
-   Reuse existing permit and pricing frameworks; add optional capacity enforcement.
    

* * *

3.  **Scope**
    

**In Scope**

-   BO Car Park configuration and permission mapping
    
-   CP discovery, selection, and purchase
    
-   Optional capacity enforcement
    
-   Integration with existing permit, pricing, and vehicle rules
    

**Out of Scope**

-   New pricing engines
    
-   Physical enforcement hardware
    
-   External gateway integrations
    

* * *

4.  **Stakeholders & Actors**
    

**Actor**

**Description**

BO Admin

Manages car park configuration

BO Operator

Views availability and reports

Customer (Anonymous)

Browses car parks

Customer (Authenticated)

Purchases permits

System

Enforces rules and updates availability

* * *

5.  **BRD → FRD Traceability Matrix**
    

**BRD ID**

**BRD Description**

**FRD Reference**

BR01

Contract-level Car Park enablement

FR‑01

BR02

BO – Car Park Management

FR‑02

BR03

Permission mapping to car parks

FR‑04

BR04

Availability & capacity enforcement

FR‑03

BR05

Pricing configuration

FR‑05

BR06

Vehicle rules

FR‑06

BR07

CP discovery (menu, list, map)

FR-01A,FR‑07

BR08

CP search, filter, and sort

FR‑08

BR09

CP permit selection & purchase

FR‑10

BR10

Error handling & messaging

FR‑11

BR11

Data requirements & audit

FR‑12

* * *

6.  **Functional Requirements**
    

* * *

**FR‑01A: Map Integration Toggle (Contract Level)**  
**(Derived from BR07 – CP Discovery & Map View)**  
**Description**  
The system shall provide a configuration toggle to enable or disable Map integration for Car Park discovery in the Customer Portal (CP).

**Functional Behaviour**

-   System shall provide a **Map Integration** toggle at **contract configuration** in BO.
    
-   When **enabled**:
    
    -   CP Car Parks page shall support both **List** and **Map** views.
        
    -   Optional map view shall display car park pins when coordinates are configured.
        
    -   Distance-based sorting and display (see FR‑09) shall be available when postcode is provided and distance services are operational.
        
    -   If map services fail, CP shall fall back to list view with a non-blocking message (see FR‑11 / NFR‑10).
        
-   When **disabled**:
    
    -   CP shall present **List view only**; no map view, map controls, pins, or map-related UI shall be displayed.
        
    -   Distance-based sorting shall be hidden/disabled.
        
    -   Car park discovery and purchase flows shall remain functional via list view.
        
-   Only authorized BO users (see NFR‑04) shall be able to modify the toggle.
    
-   Changes to the toggle shall be audit logged (see FR‑12 / NFR‑09), including who changed it and when.
    

**FR‑01: Contract-Level Feature Enablement**

**(Maps to BR01)**

**Description**  
The system shall support enabling or disabling the Car Park feature at contract level.

**Functional Behaviour**

-   System shall provide a Car Park toggle at contract configuration.
    
-   When **disabled**:
    
    -   BO shall hide all Car Park management screens.
        
    -   CP shall suppress Car Park discovery and purchase flows.
        
-   When **enabled**:
    
    -   BO shall expose “Manage Car Parks”.
        
    -   CP shall allow discovery and selection of car parks.
        

* * *

**FR‑02: Car Park Master Data Management (BO)**

**(Maps to BR02)**

**Description**  
BO users shall create and manage Car Park master data.

**Functional Behaviour**

-   System shall allow Create, View, Edit, and Deactivate operations.
    
-   Mandatory attributes:
    
    -   Name
        
    -   Address
        
    -   On-street / Off-street flag
        
    -   Bay types and bay counts
        
    -   Status
        
-   Optional attributes:
    
    -   Description
        
    -   Coordinates
        
    -   Non-enforceable timings (per day)
        
-   System shall:
    
    -   Auto-calculate total bay count.
        
    -   Enforce mandatory field validation.
        
    -   Prevent deletion when active permits exist.
        
    -   Allow deactivation without impacting existing permits.
        

* * *

**FR‑03: Availability & Capacity Enforcement**

**(Maps to BR04)**

**Description**  
The system shall optionally enforce Car Park capacity to prevent overselling.

**Functional Behaviour**

-   Capacity enforcement configurable at:
    
    -   Contract level and/or
        
    -   Individual Car Park level
        
-   System shall maintain:
    
    -   Total capacity
        
    -   Available spaces
        
-   Availability shall update on:
    
    -   Permit issue
        
    -   Permit amendment (capacity impacting)
        
    -   Permit cancellation
        
    -   Permit expiry
        
-   When capacity reaches zero:
    
    -   System shall block selection and purchase in BO and CP.
        

* * *

**FR‑04: Permission to Car Park Mapping**

**(Maps to BR03)**

**Description**  
Car Park-related permissions shall be mapped to one or more car parks.

**Functional Behaviour**

-   Mapping shall be restricted to:
    
    -   Active car parks
        
    -   Same contract
        
-   System shall:
    
    -   Prevent mapping to unavailable car parks when enforcement is ON.
        
    -   Expose mapping data through APIs.
        
    -   Display mappings in BO for maintenance and audit.
        

* * *

**FR‑05: Pricing Configuration**

**(Maps to BR05)**

**Description**  
The system shall reuse existing pricing frameworks for Car Parks.

**Functional Behaviour**

-   Support:
    
    -   Duration-based pricing
        
    -   Tier-based pricing
        
    -   Optional diesel surcharge
        
-   No changes to pricing calculation engine.
    
-   Prices shall be displayed anonymously in CP.
    

* * *

**FR‑06: Vehicle Rules**

**(Maps to BR06)**

**Description**  
Permits shall support multiple registered vehicles.

**Functional Behaviour**

-   A permit may contain multiple vehicles.
    
-   Only one vehicle may be active at any time.
    
-   Vehicle switching shall follow existing permit rules. (Change Vehicle)
    
-   Capacity consumption remains unchanged during vehicle switches.
    

* * *

**FR‑07: CP – Car Park Discovery**

**(Maps to BR07)**

**Description**  
Customers shall discover car parks through list and optional map views.

**Functional Behaviour**

-   CP shall provide a Car Parks menu entry.
    
-   System shall default to list view.
    
-   If only one car park available, no need to display Map for selection, Applicant should be able to purchase application
    
-   If more than one car park available , then map should be displayed for applicant selection of car park with respect to location
    
-   Optional map view shall display car park pins when enabled.
    
-   Applicant should be able to choose start date and end date for the car park
    
-   Each car park result shall display:
    
    -   Car park Name \\
        
    -   Address
        
    -   On/off-street indicator
        
    -   Bay types and capacity/availability
        
    -   Non-enforceable timings
        
    -   Price indicator
        
    -   Availability status
        
    -   Walking & driving time
        
    -   **BUY NOW**
        

* * *

**FR‑08: CP – Search, Filter, and Sort**

**(Maps to BR08)**

**Description**  
Customers shall refine car park results using search and filters.

**Functional Behaviour**

-   Search supported by:
    
    -   Car Park Name
        
    -   Address
        
    -   Postcode keywords
        
-   Filters:
    
    -   Availability only
        
    -   Fee/rate band
        
    -   Accessibility attributes (if configured)
        
-   Sort options:
    
    -   Name (A–Z / Z–A)
        
    -   Availability
        
    -   Distance (when postcode provided)
        

* * *

**FR‑09: CP – Distance Calculation**

**(Derived from BR07 & BR08)**

**Description**  
The system shall calculate distance when postcode is provided.

**Functional Behaviour**

-   Postcode input shall be optional.
    
-   When provided:
    
    -   System shall calculate distance to each car park.
        
    -   Results shall re-sort dynamically.
        
-   When geolocation services fail:
    
    -   List view shall remain functional.
        

* * *

**FR‑10: CP – Permit Selection & Purchase**

**(Maps to BR09)**

**Description**  
Customers shall purchase permits for eligible car parks.

**Functional Behaviour**

-   CP shall display only car parks:
    
    -   Mapped to selected permission
        
    -   Available (when enforcement is ON)
        
-   Anonymous users may view durations and prices.
    
-   Authentication required before checkout.
    
-   Purchase flow:
    

1.  Select duration
    
2.  Select tier (if applicable)
    
3.  Enter vehicle details
    
4.  Review
    
5.  Payment
    

-   System shall update availability immediately upon successful payment.
    

* * *

**FR‑11: Error Handling & Messaging**

**(Maps to BR10)**

**Description**  
The system shall provide clear, non-blocking user messages.

**Functional Behaviour**

-   No results:
    
    -   Display informative message with suggestions.
        
-   Capacity reached mid-journey:
    
    -   Block checkout and prompt reselection.
        
-   Map service failure:
    
    -   Show list view with a non-blocking message.
        

* * *

**FR‑12: Data & Audit Requirements**

**(Maps to BR11)**

**Description**  
The system shall maintain data integrity and auditability.

**Functional Behaviour**

-   Store audit fields:
    
    -   Created by / Updated by
        
    -   Creation and update timestamps
        
-   Maintain relationships:
    
    -   Contract ↔ Car Park
        
    -   Permission ↔ Car Park
        
-   Log:
    
    -   Configuration changes
        
    -   Permit events impacting capacity
        

* * *

 **Acceptance Summary**

-   Every BRD item is mapped to at least one functional requirement.
    
-   Capacity enforcement is consistently applied across BO and CP.
    
-   CP delivers intuitive discovery and purchase flows.
    
-   System remains resilient to map or sync failures.
    
-   Functional behaviour reuses existing platform components where specified.
    

7.  **Non‑Functional Requirements (Derived from BRD)**
    

* * *

**NFR‑01: Performance**

**(Derived from BRD – Non‑Functional Requirements & CP Discovery)**

-   CP car park **list view** shall load within **3 seconds** under normal operating conditions.
    
-   CP map view (when enabled) shall:
    
    -   Load asynchronously without blocking list results.
        
    -   Maintain UI responsiveness during map interaction.
        
-   Availability updates shall be reflected in BO and CP within **near real time** (event‑driven propagation).
    
-   Search, filter, and sort operations shall complete within acceptable user‑perceived time (<2 seconds).
    

* * *

**NFR‑02: Availability & Reliability**

**(Derived from BRD – Risks, Assumptions & Dependencies)**

-   The system shall remain functional if:
    
    -   Mapping services are unavailable (fallback to list view).
        
    -   Distance calculation services fail (disable distance sort only).
        
-   Car park availability enforcement shall:
    
    -   Be consistently applied across BO and CP.
        
    -   Prevent overselling even during concurrent purchase attempts.
        
-   Availability counters shall use optimistic locking or equivalent mechanism to maintain consistency.
    

* * *

**NFR‑03: Scalability**

**(Derived from BRD – Contract-level centralisation & CP exposure)**

-   The system shall support:
    
    -   Multiple contracts with independent car park configurations.
        
    -   Multiple car parks per contract.
        
    -   High concurrent CP browsing without degradation.
        
-   Design shall allow future expansion of:
    
    -   Bay types
        
    -   Car park attributes
        
    -   Discovery filters
        

* * *

**NFR‑04: Security & Access Control**

**(Derived from BRD – Security & Access Control)**

-   BO access to Car Park configuration shall be restricted via role‑based access control.
    
-   CP browsing shall be allowed anonymously.
    
-   CP checkout shall require authenticated user session.
    
-   APIs exposing car park and availability data shall:
    
    -   Enforce authentication and authorization.
        
    -   Prevent unauthorized access across contracts.
        
-   All BO configuration actions shall be logged for audit.
    

* * *

**NFR‑05: Data Integrity & Consistency**

**(Derived from BRD – Availability Enforcement & Data Requirements)**

-   Car park master data shall be maintained as a **single source of truth** at contract level.
    
-   Changes to car park configuration shall not retroactively affect existing permits.
    
-   Availability counts shall:
    
    -   Never fall below zero.
        
    -   Be recalculated correctly on amend, cancel, and expiry events.
        
-   System shall prevent duplicate or conflicting mappings.
    

* * *

**NFR‑06: Usability**

**(Derived from BRD – CP Discovery, Search, Filters)**

-   CP user journeys shall:
    
    -   Be intuitive and navigable with minimal clicks.
        
    -   Clearly indicate availability status.
        
-   No‑result and error states shall provide actionable guidance.
    
-   BO forms shall include:
    
    -   Field‑level validation messages.
        
    -   Guardrails for capacity and configuration errors.
        

* * *

**NFR‑07: Accessibility**

**(Derived from BRD – Usability & Accessibility)**

-   BO and CP interfaces shall:
    
    -   Follow accessibility best practices (keyboard navigation, readable labels).
        
    -   Present filters, lists, and map controls in an accessible manner.
        
-   Information shall not rely solely on color to indicate availability.
    

* * *

**NFR‑08: Maintainability & Supportability**

**(Derived from BRD – Centralised BO Management)**

-   Configuration changes shall require no code deployment.
    
-   Car park entities shall be reusable across permissions.
    
-   System design shall allow:
    
    -   Easy addition of new attributes.
        
    -   Minimal configuration duplication.
        

* * *

**NFR‑09: Audit & Reporting**

**(Derived from BRD – Reporting & Audit)**

-   System shall record:
    
    -   Created by / updated by user
        
    -   Date/time of changes
        
-   BO shall provide visibility into:
    
    -   Capacity and availability summaries
        
    -   Configuration change history
        
-   Permit events impacting availability shall be traceable for investigation.
    

* * *

**NFR‑10: Resilience & Graceful Degradation**

**(Derived from BRD – Risks & Map Dependency)**

-   CP shall continue functioning in list mode when:
    
    -   Map loading fails
        
    -   Distance calculation fails
        
-   Messaging shall be:
    
    -   Informative
        
    -   Non‑blocking
        
    -   User‑friendly
        
-   System failures in optional components shall not block purchases unless capacity rules require it.
    

**Clarification**

Do we need a toggle for Map integration ? Or it is mandatory ? - Yes required included as FR-01A