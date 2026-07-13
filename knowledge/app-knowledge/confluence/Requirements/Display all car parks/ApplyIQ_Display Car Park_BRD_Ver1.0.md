# ApplyIQ_Display Car Park_BRD_Ver1.0

> **Confluence ID:** 1857454081 · **Version:** 6 · **Last updated:** 2026-04-08T10:13:07.983Z
> **Path:** Requirements / Display all car parks
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/1857454081/ApplyIQ_Display+Car+Park_BRD_Ver1.0

---

### Version History

### Approvals

**Name**

**Role**

**Signature**

**Date**

Natarajan Arumugam

Author

—

Joanne Archer

Product Owner

—

## Purpose

Define the business requirements for configuring, discovering, and purchasing Car Park permits across Back Office (BO) and Customer Portal (CP), ensuring data consistency, optional capacity enforcement, and a streamlined user journey.

## Background & Context

note6788d93c6a6a

Councils require a simple way to configure car parks (on/off-street), publish details to CP, and optionally prevent overselling through capacity enforcement, while providing customers an intuitive search/list/map experience.

Councils require a simple way to configure car parks (on/off-street), publish details to CP, and optionally prevent overselling through capacity enforcement, while providing customers an intuitive search/list/map experience.

-   Centralise car park master data at contract level in BO.
    
-   Expose searchable, filterable car parks (list and optional map) in CP.
    
-   Reuse existing permit and pricing frameworks; add optional capacity enforcement.
    

## Business Objectives

1.  Enable contract-level Car Park feature toggle and BO configuration UX.
    
2.  Allow mapping of car park-related permissions to one or more car parks.
    
3.  Support optional capacity and availability enforcement to avoid overselling.
    
4.  Deliver intuitive CP discovery (search, filters, list, optional map, distance sort).
    
5.  Support multiple registered vehicles per permit with a single active vehicle at a time.
    

## Stakeholders

**Role**

**Responsibilities**

**Notes**

Business Analyst

Elicit, document, validate requirements; maintain BRD

Product Owner

Prioritise scope, approve acceptance criteria and changes

## Scope

### In Scope

-   Contract-level enable/disable of Car Park feature and BO management UIs.
    
-   Car park entity fields: name, description, address, on/off-street, bay types and counts, non-enforceable timings, optional coordinates, status.
    
-   Mapping permissions to one or more car parks within the same contract.
    
-   Optional capacity and availability enforcement; near real-time updates on issue/expire/cancel/amend.
    
-   CP discovery (menu, search, filters, list, optional map, optional postcode proximity and distance sort).
    

### Out of Scope

-   New pricing engine; physical enforcement hardware; external gateway contracting.
    
-   Fundamental enforcement logic changes beyond capacity gating.
    

## Assumptions & Dependencies

-   Mapping provider available for optional map and distance; graceful degradation to list when unavailable.
    
-   BO roles/permissions control access to Car Park admin features.
    
-   Availability synchronised via platform APIs/events near real time.
    

## Definitions

**Term**

**Definition**

BO (Back Office)

Administration portal for councils to manage configuration and capacity

CP (Customer Portal)

Public-facing portal for discovering car parks and purchasing permits

Availability Enforcement

Configuration that blocks selection/purchase when capacity is reached

## High-Level Solution Overview

-   Contract-level toggle exposes BO “Manage Car Parks” and CP Car Parks discovery.
    
-   Permissions mapped to car parks; CP shows only eligible options (and available when enforced).
    
-   Availability updates on issue/expire/cancel; CP/BO reflect up-to-date counts.
    

## Requirements (BO/CP)

### BR01 -Contract-Level Enablement

1.  Provide a contract-level toggle to enable/disable the Car Park feature.
    
2.  When disabled: hide car park UIs in BO and suppress CP presentation.
    
3.  When enabled: expose Manage Car Parks in BO and allow CP selection per availability rules.
    

### BR02 -BO – Car Park Management

Car Park fields include: name, description, full address, on/off-street, bay types and counts, derived total bays, non-enforceable timings per day, optional coordinates, availability tracking flag, status.

1.  Create, view, edit, deactivate car parks with mandatory field validation.
    
2.  Show availability (overall and/or per bay type) when tracking is enabled.
    
3.  Deactivation removes from new selections without affecting existing permits.
    

### BR03 -BO – Permission Mapping

1.  Map car park-related permissions to one or more car parks within the same contract.
    
2.  Block mapping or sales when capacity is reached if enforcement is enabled.
    
3.  Expose mapped car parks via APIs; display mappings in BO for maintenance.
    

### BR04 -Availability & Space Consumption

1.  Configure enforcement at contract and/or car park level; track capacity and available spaces.
    
2.  Update availability on issue, amend (capacity-affecting), expire, cancel; block BO/CP when full.
    
3.  Support configuration of how many bays a permit consumes.
    

### BR05 -Pricing Configuration

-   Reuse existing pricing frameworks; duration and tier-based pricing; optional diesel surcharge.
    

### BR06 -Vehicle Rules

-   Multiple vehicles may be registered; one active at a time; switching per existing rules.
    

### BR07 -CP – Discovery (Menu, List & Map)

1.  Provide Car Parks menu; optional postcode proximity input (not mandatory).
    
2.  If only one parking is available with respect to the postcode , then user should be displayed with parking details and doesnot require a map to pick
    
3.  If multiple parking is available with respect to car park , then Show list view and optional map pins with name, address, on/off-street, bay types/counts or capacity, non-enforceable timings, price indicator, availability status.
    
4.  List Card (What the applicant sees first)
    

-   Car Park Name
    
-   Address / Area
    
-   On‑Street / Off‑Street
    
-   Price (+ duration context)
    
-   Availability status
    
-   Walking & driving time
    
-   **BUY NOW - Moves the user to car park application form**
    

4.  When postcode provided, compute distances and support distance sort; update dynamically on change.
    

### BR08 -CP – Search, Filter & Sort

-   Search by name and address/postcode keywords.
    
-   Filters: availability only, fee/rate band, accessibility attributes (if configured).
    
-   Sort: name A–Z/Z–A, availability, distance (when postcode given).
    

### BR09 -CP – Permit Selection & Purchase

1.  Display car parks associated with selected permission and availability rules.
    
2.  View durations and prices anonymously; require authentication before checkout.
    
3.  Follow standard purchase flow: duration, tier (if any), vehicle details, review, payment; update availability on success.
    

### BR10 -Error Handling & Messaging

-   No results: show clear message and suggest search/filter adjustments.
    
-   Map load failure: keep list usable; show informative message.
    
-   Capacity reached mid-journey: block checkout and prompt reselection.
    

## BR11 -Data Requirements

-   Master fields per Car Park; derived available spaces; computed distance; basic rate label.
    
-   Audit: created/updated by, timestamps; activation/deactivation history; mapping between car parks, permissions, and contracts.
    

## Integration & APIs

1.  APIs to read car parks by contract and by permission (with availability and coordinates).
    
2.  Optional sync/ingest from council sources; define mechanism/frequency at design.
    
3.  Near real-time propagation of availability via events/APIs.
    

## Security & Access Control

-   Restrict BO configuration to authorised roles; secure APIs with platform authN/Z.
    
-   CP browsing may be anonymous; checkout requires authentication; log admin actions for audit.
    

## Non-Functional Requirements

### Performance

-   List/map should load within ~3 seconds under normal conditions; smooth map interactions.
    

### Usability & Accessibility

-   Responsive design across devices; follow accessibility guidance for inputs, filters, lists, and map controls.
    

### Reliability & Resilience

-   Graceful degradation to list when map/unavailable; consistent enforcement rules across BO/CP.
    

## Reporting & Audit

-   BO visibility of capacity/availability summaries and details; audit logs for configuration changes and permit events affecting capacity.
    

## Acceptance Criteria (High Level)

1.  Contract-level toggle controls BO/CP exposure and behaviour.
    
2.  BO users can fully manage car parks with validation and status controls.
    
3.  Permissions can be mapped to car parks; capacity blocks when enforced.
    
4.  CP supports discovery (search, filters, list, optional map, distance sort).
    
5.  Purchase flow reuses platform steps; availability updates on success.
    

## Risks

**Risk**

**Impact**

**Likelihood**

**Mitigation**

Sync delays cause overselling

High

Medium

Near real-time sync; validations; optimistic locking on counters

Incorrect capacity configuration blocks sales

Medium

Low

Admin training; field guardrails and validation

Map dependency degrades UX on outage

Medium

Medium

Graceful fallback to list; clear messaging; monitoring

## Open Questions

-   Toggleability of map at contract level; behaviour when disabled (list-only).
    
-   Definitive set of bay types and council-specific extensions.
    
-   Diesel surcharge configuration locus (contract, permission, car park).
    

## References

-   [https://marston.atlassian.net/wiki/x/EYCxaw](https://marston.atlassian.net/wiki/x/EYCxaw)
    
-   Business Requirements for Car Park Feature Configuration and Management