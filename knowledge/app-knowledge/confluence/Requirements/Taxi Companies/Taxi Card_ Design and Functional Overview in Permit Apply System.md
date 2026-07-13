# Taxi Card: Design and Functional Overview in Permit Apply System

> **Confluence ID:** 1910374408 · **Version:** 1 · **Last updated:** 2026-04-24T09:04:04.550Z
> **Path:** Requirements / Taxi Companies
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/1910374408/Taxi+Card+Design+and+Functional+Overview+in+Permit+Apply+System

---

# Taxi Card – Permission Type Design & Scope

## 1\. Purpose of this Document

This document captures the agreed understanding, scope, and system design considerations for modelling **Taxi Cards** within the **Permit Apply system**. It is based on stakeholder discussion and is intended to support product, architecture, and delivery alignment.

* * *

## 2\. High-Level Classification

### Decision

A **Taxi Card** should be implemented as a **Permission Type** within Permit Apply.

### Rationale

·       Users submit an application

·       Eligibility is assessed

·       A permission is issued

·       The permission has a validity period

·       Usage is limited and tracked over time

This aligns with the Permit Apply permission lifecycle, even though Taxi Cards are **not regulatory licences**.

* * *

## 3\. What a Taxi Card Is (and Is Not)

### Taxi Card IS:

·       A **non-zonal permission**

·       An **entitlement-based permission**

·       Time-bound (typically annual)

·       Limited by **number of discounted journeys**

·       Eligibility-driven (e.g. disability / Blue Badge)

### Taxi Card IS NOT:

·       A regulatory licence

·       A location-based or zonal permit

·       An enforcement-driven permission

·       A monetary discount record (the system tracks journeys, not money)

* * *

## 4\. Functional Scope

### Core Capability

The system tracks **the number of discounted journeys used**, not the value of the discount.

Key data points: - Total journeys allocated per period - Journeys used - Journeys remaining - Permission validity period

* * *

## 5\. Application Model

### Application Type

·       Non-zonal application

·       Based on an existing Permit Apply base template (Car Park)

### Applicant Inputs (configurable)

·       Personal details

·       Correspondence address

·       Photo ID

·       Proof of address

·       Medical evidence / disability proof

·       Blue Badge (if required)

### Payment Handling

·       Configurable via existing Permit Apply settings

·       If Taxi Card is free → no payment step

·       If paid → standard payment flow applies

* * *

## 6\. Approval & Issuing

·       Application submitted by customer

·       Back office reviews eligibility

·       Permission approved and issued

·       Journey allowance is allocated for the validity period

* * *

## 7\. Journey Usage & Updates

### What Is Recorded

·       Each **journey where a Taxi Card discount is applied**

·       The journey count is reduced by 1 per usage

The system does **not** record: - Fare amount - Discount value

* * *

## 8\. Integration & Data Flow

### Current / MVP Approach

·       Taxi companies record journeys

·       Usage data is provided via spreadsheet (SFTP)

·       Data is ingested into the system

### System of Record

·       **Illuminate** acts as the primary system for reporting and analytics

·       **Permit Apply** displays the current journey balance to the customer

### Update Order

·       Order of updates (Illuminate vs Apply) is not critical

·       Key requirement: **latest journey counts must be reflected consistently**

* * *

## 9\. Future Enhancements (Out of Scope for MVP)

Potential future capabilities (not committed): - QR code issued to customer - Taxi driver scans QR code - Automatic journey decrement

Constraints: - Dependency on taxi company capability - Limited availability of APIs or technical teams

* * *

## 10\. Comparison with Permits & Licences

Aspect

Permit / Licence

Taxi Card

Purpose

Permission to act

Entitlement to benefit

Zonal

Often yes

No

Enforcement

Physical enforcement

Usage tracking

Consumption

Static

Consumab

le (journeys)

Third-party dependency

Low

High

* * *

## 11\. Key Risks & Considerations

·       Dependency on external taxi companies for usage data

·       Manual or semi-manual updates in early phases

·       Data consistency between Illuminate and Apply

·       Clear communication that journeys (not discounts) are being tracked

* * *

## 12\. Summary

Taxi Cards fit naturally into the Permit Apply platform as a **non-zonal Permission Type**. While they differ from traditional licences, the existing application, approval, payment, and permission lifecycle fully supports Taxi Card requirements with minimal extension. The primary difference lies in tracking consumable journey usage rather than enforcing physical or location-based permissions.

# Application Form for Taxi card

New Application Card

1.  Address tab
    

Yes

No

Replacement Card

1.  Similar address tab
    

2.  Replacement card section
    

3.  Summary
    

Renewal Taxi Card

1.  Address tab
    

2.  Doctor surgery
    

3.  Renew an existing taxi card
    

4.  Summary
    

Questions

1.  Vehicle settings field not applicable to the permission builder.
    

2.  Permits category type as ‘Taxi Card’
    

3.  While setting up the Pricing? Do we need Journey Count field only one duration should be configurable?
    

4.  Static report for taxi card?
    

5.  How frequently does the taxi card journey ingested in our system as well as apply?
    

6.  What are the data from the taxi companies that got injected to apply and illuminate?
    

7.  Does it have application start date?
    

8.  Should unused journeys expire at the end of the validity period?
    

9.  Can applicants hold more than one active Taxi Card at a time?
    

10.  Do new, renewal, and replacement applications follow the same base template?

11.  Should applicants see journey balance during the application journey CP?

12.  Is “Buy Again” is required for taxi card?

13.  What are the action buttons that should be displayed against this permission type application?

14.  Do we have provision to cancel the application?

15.  Should replacement cards be chargeable? If yes where we must configure that charge?

16.  Renew cards also chargeable?

**Journey Usage & Ingestion**

17.  How frequently will taxi journey data be provided (daily / weekly)?

18.  Can journeys be reversed or adjusted by back-office users?

19.  What happens if usage exceeds the allocated journey count?

**Notifications & Communications**

20.  Should applicants be notified when journeys are fully used?

21.  Is a low-balance warning required (e.g. 10 journeys remaining)? If yes, need to configure

22.  Should expiry reminders be separated from journey exhaustion emails?

Make –

Model –

208399

208401

208404

Address & Applicant Details

Fields in London council application form –

Title, Gender, National Insurance no, Your local council, Telephone\* (landline):