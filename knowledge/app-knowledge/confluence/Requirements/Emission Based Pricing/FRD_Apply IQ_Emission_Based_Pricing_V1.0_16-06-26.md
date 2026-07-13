# FRD_Apply IQ_Emission_Based_Pricing_V1.0_16-06-26

> **Confluence ID:** 2055045121 · **Version:** 5 · **Last updated:** 2026-06-16T10:27:24.638Z
> **Path:** Requirements / Emission Based Pricing
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/2055045121/FRD_Apply+IQ_Emission_Based_Pricing_V1.0_16-06-26

---

## **1\. Document Control**

Version

Date

Author

Description

1.0

16-06-2026

Prathiba K

Initial Draft

* * *

## **2\. Project Overview**

This FRD describes the functional requirements for **Emission-Based Pricing in Apply IQ**, enabling pricing calculation based on vehicle CO₂ emission, engine size, tax bands, fuel type, and permit configurations.

* * *

## **3\. Purpose**

To define detailed functional requirements for configuring, calculating, and processing pricing, including surcharge and refund handling based on emission logic

-   Define configuration rules for emission-based pricing
    
-   Describe pricing calculation logic used during application
    
-   Explain behaviour for surcharge, tier logic, and band mapping
    
-   Define change vehicle computation (pro-rata calculation)
    
-   Define refund handling (online & offline)
    

This ensures accurate, compliant, and configurable pricing aligned with council requirements.

## **4\. Scope**

### **4.1 In Scope**

-   Contract-level configuration for emission pricing
    
-   Tax band setup (DVLA & Custom bands)
    
-   Emission band mapping
    
-   Diesel and hybrid surcharge configuration
    
-   Permission Builder pricing setup
    
-   Tier pricing logic
    
-   Dynamic pricing display in application
    
-   Multi-vehicle pricing handling
    
-   Change vehicle pricing calculation
    
-   Refund calculation and processing
    

* * *

### **4.2 Out of Scope**

-   UI design outside pricing components
    
-   External payment gateway implementation logic
    
-   Non-permit pricing use cases
    

# 5\. FUNCTIONAL REQUIREMENTS

# 5.1 CONTRACT SETTINGS

## 5.2 Enable Emission-Based Pricing

FR ID

Requirement

Description

CS-FR-01

CO₂ Field Enablement

System shall allow enabling **CO₂ Emission** field in Vehicle Section

CS-FR-02

Engine Size Enablement

System shall allow enabling **Engine Size** field

CS-FR-03

Mandatory Dependency

Both CO₂ and Engine Size fields must be enabled to use emission pricing

CS-FR-04

Emission Pricing Toggle

System shall provide toggle to enable/disable Emission-Based Pricing

* * *

## 5.3 Tax Band Selection

FR ID

Requirement

Description

CS-FR-05

Tax Band Type Selection

System shall allow selection of:

-   DVLA Tax Band
    
-   Custom Tax Band
    

* * *

## 5.4 DVLA Tax Band Configuration

FR ID

Requirement

Description

CS-FR-06

Default DVLA Band

Default DVLA tax band must be available in system

CS-FR-07

Non-Editable Default Band

System shall NOT allow editing or deleting default DVLA band

CS-FR-08

Engine Range Mapping

System shall allow capturing:

-   Engine size From
    
-   Engine size To for DVLA band
    

* * *

## 5.5 Custom Tax Band Configuration

FR ID

Requirement

Description

CS-FR-09

Custom Band Creation

System shall allow creation of custom tax bands

CS-FR-10

Band Fields

Each custom band must have:

-   Name
    
-   Description (optional)
    
-   Min CO₂
    
-   Max CO₂
    
-   Engine Size From
    
-   Engine Size To
    

CS-FR-11

Field Validation

System shall validate:

-   Min < Max
    
-   No overlapping ranges
    
-   Mandatory fields validation
    

CS-FR-12

Edit/Delete

System shall allow editing/deleting custom bands

* * *

## 5.6 Emission Band Creation & Mapping

FR ID

Requirement

Description

CS-FR-13

Emission Band Enablement

Emission band creation allowed only when:

-   DVLA selected OR Custom band created
    

CS-FR-14

Display Bands

System shall display all available tax bands during emission band creation

CS-FR-15

Mapping

Each emission band must be mapped to a tax band

CS-FR-16

Validation

System shall enforce mandatory mapping before save

* * *

## 5.7 Diesel & Hybrid Configuration

FR ID

Requirement

Description

CS-FR-17

Diesel Surcharge Toggle

System shall allow enabling diesel surcharge

CS-FR-18

Hybrid Toggle

System shall provide toggle for hybrid vehicle handling

CS-FR-19

Hybrid Behaviour

When hybrid toggle enabled:

-   Diesel surcharge shall NOT be applied
    

CS-FR-20

Consistency

Same behaviour shall apply in pricing module

* * *

# PERMISSION BUILDER – PRICING CONFIGURATION

## 5.7 Pricing Setup

FR ID

Requirement

Description

PB-FR-01

Permit Pricing Setup

System shall allow pricing configuration for permits

PB-FR-02

Frequency & Period

System shall capture:

-   Frequency
    
-   Period
    

PB-FR-03

Emission Band Display

System shall display emission bands configured in contract

PB-FR-04

Band-Level Pricing

Pricing must be configured per emission band

* * *

## 5.8 Tier Pricing

FR ID

Requirement

Description

PB-FR-05

Tier Pricing Toggle

System shall allow enabling tier pricing

PB-FR-06

Multiple Tiers

System shall allow multiple tiers per emission band

PB-FR-07

Tier Application

Tier pricing applied AFTER band selection

* * *

## 5.9 Diesel Surcharge Configuration

FR ID

Requirement

Description

PB-FR-08

Surcharge Setup

Diesel surcharge must be configured per emission band

PB-FR-09

Conditional Application

Applied only when diesel condition satisfied

PB-FR-10

Hybrid Case

Not applied if hybrid toggle enabled

* * *

## 5.10 Pricing Cloning

FR ID

Requirement

Description

PB-FR-11

Clone Pricing

System shall allow cloning of pricing configuration

PB-FR-12

Clone Scope

Clone must include:

-   Bands
    
-   Tier pricing
    
-   Surcharge configuration
    

# APPLICATION – PRICING DISPLAY LOGIC (BASED ON VEHICLE)

## 5.11 Pricing Tab – Dynamic Band Display

FR ID

Requirement

Description

AP-FR-01

Initial Pricing Display

When a vehicle is selected and user navigates to the Pricing tab, the system shall display the **applicable emission band price** based on the selected vehicle and remaining duration of the permit

AP-FR-02

Duration-Based Pricing

Displayed price must be calculated proportionally based on **remaining duration of the permit**

* * *

## 5.12 Vehicle Change Behavior in Vehicle Tab

FR ID

Requirement

Description

AP-FR-03

Recalculate on Vehicle Change

When user navigates back to Vehicle tab and changes the vehicle, system shall **recalculate pricing** based on the new vehicle

AP-FR-04

Updated Pricing Display

On navigating again to Pricing tab, system shall display **updated band price** based on the newly selected vehicle

AP-FR-05

No Stale Data

System must not retain previous vehicle pricing once vehicle is changed

* * *

## 5.13 Multiple Vehicle Handling

FR ID

Requirement

Description

AP-FR-06

Multi-Vehicle Support

System shall support multiple vehicles added in Vehicle tab

AP-FR-07

Highest Band Selection

If multiple vehicles exist, Pricing tab shall display the **highest applicable emission band** among all vehicles

AP-FR-08

Highest Band Definition

Highest band means the **vehicle that results in the highest price after band selection logic is applied**

* * *

## 5.14 Diesel Surcharge Application

FR ID

Requirement

Description

AP-FR-09

Diesel Detection

System shall identify if any vehicle in the list is of **diesel type**

AP-FR-10

Surcharge Condition

Diesel surcharge shall be applied based on configured rules (Euro standard + toggle)

AP-FR-11

Multi-Vehicle Surcharge

If **any one of the vehicles** satisfies diesel surcharge condition, surcharge shall be applied to the displayed pricing

AP-FR-12

Hybrid Exception

If hybrid toggle is enabled, diesel surcharge must **not be applied**

## 5.15 Tier Progression Logic

FR ID

Requirement

Description

TP-FR-07

Tier Identification

System shall determine tier based on count of existing permits (property/user based on type)

TP-FR-08

Tier Increment

Each qualifying additional permit shall move pricing to the next available tier

TP-FR-09

Tier Selection

System shall apply the identified tier to the selected emission band price

* * *

## 5.16 Same Tier Retention Rule

FR ID

Requirement

Description

TP-FR-10

Same Tier Retention

When “Tier Price at Original Rate” option is enabled, system shall **retain the same tier** during pricing recalculation

TP-FR-11

No Tier Re-evaluation

In this scenario, system must not re-evaluate tier level even if permit count changes **if it is same vehicle.**

TP-FR-12

Scope

Same tier retention shall apply during:

1.  Change vehicle
    
2.  Renewal (if applicable)
    

## 5.17 Pricing logic - Emission Based Pricing - Decision Table V1.1 - Notice Processing v2 - Confluence

## 5.18 Change Address

FR ID

Requirement

Description

CA-FR-01

Address Change

System shall allow user to change address

CA-FR-02

Zone Identification

System shall identify applicable zone based on updated address

CA-FR-03

Emission Re-evaluation

On address change, system shall **re-evaluate emission-based pricing** based on active vehicle(s)

CA-FR-04

Pricing Recalculation

System shall recalculate pricing based on:

-   Zone pricing
    
-   Emission band
    
-   Tier pricing (if applicable)
    
-   Diesel surcharge (if applicable)
    

CA-FR-05

Updated Pricing Display

System shall display updated price

* * *

## 9.2 Change Zone

FR ID

Requirement

Description

CZ-FR-01

Zone Change

System shall allow user to change/select zone

CZ-FR-02

Emission Re-evaluation

On zone change, system shall **re-evaluate emission-based pricing** for the selected vehicle(s)

CZ-FR-03

Zone-Based Pricing

Pricing shall be based on selected zone

CZ-FR-04

Pricing Recalculation

System shall recalculate pricing based on:

-   Zone pricing
    
-   Emission band
    
-   Tier pricing (if applicable)
    
-   Diesel surcharge (if applicable) | | CZ-FR-05 | Cost Adjustment | System shall calculate:
    
-   Additional payment (if higher zone cost)
    
-   Refund (if lower zone cost) |
    

CZ-FR-06

Prorated Calculation

Adjustment must be based on remaining duration

* * *

## 5.20 Renewal Pricing

FR ID

Requirement

Description

RN-FR-01

Renewal Pricing

System shall recalculate pricing during renewal

RN-FR-02

Multi-Vehicle Logic

System shall consider all active vehicles

RN-FR-03

Highest Band Rule

Pricing shall be based on the highest emission band among vehicles

RN-FR-04

Vehicle Removal Impact

If highest band vehicle is removed, system shall recalculate using remaining vehicles

RN-FR-05

Updated Band Selection

System shall apply new highest band from remaining vehicles

RN-FR-06

Final Pricing

Pricing shall include:

-   Emission band
    
-   Tier pricing (if applicable)
    
-   Diesel surcharge (if applicable)
    

## **6\. CHANGE VEHICLE – CALCULATION & BEHAVIOUR**

### **6.1 Calculation Logic**

Step

Description

Formula / Details

Step 1

Determine Total Permit Duration

Total Days = End Date – Start Date

Step 2

Calculate Days Used

Days Used = Current Date – Start Date

Step 3

Calculate Days Remaining

Days Remaining = End Date – Current Date

* * *

### **6.2 Financial Calculation**

Calculation Type

Description

Formula

Old Vehicle – Amount Used

Proportionate cost for duration already used

Amount Used = (Days Used / Total Days) × Permit Cost

New Vehicle – Amount Remaining

Cost for remaining permit duration

Amount Remaining = (Days Remaining / Total Days) × New Permit Cost

* * *

### **6.3 Final Adjustment**

Scenario

Outcome

New Permit Cost > Old Used Amount

Applicant pays the difference

Old Used Amount > New Permit Cost

Refund is generated

Old Used Amount = New Permit Cost

No charge / No refund

* * *

### **6.4 Key Behaviour Rules**

Rule Category

Behaviour Description

Band Selection

New vehicle band must follow emission-based logic

Old Permit Pricing

Must use original band at time of purchase (no recalculation)

New Permit Pricing

Must use current configuration (band + tier + surcharge)

Surcharge Handling

Diesel surcharge and hybrid rules must be applied consistently

Pricing Coverage

Calculation must support band change, tier change, and surcharge inclusion/exclusion

* * *

### **6.5 Edge Cases**

Category

Scenario

Emission Band Changes

Vehicle moves across emission bands

Fuel Type Transitions

Electric → Petrol → Diesel transitions

Hybrid Logic

Change in hybrid status impacts pricing

Missing CO₂ Data

CO₂ value unavailable for old or new vehicle

Pre-2001 Vehicles

Fallback logic applies (engine size-based or default band)

Default Band Issue

Default band vs First band mismatch

Decision Table Alignment

Must align with defined emission decision table logic

## **6.6 Example Calculations**

* * *

### **Example 1 – Basic Band Change (No Surcharge, No Tier)**

Section

Details

Scenario

Duration = 365 days; Vehicle change on Day 100

Old Vehicle

Band 1; Price = £100

New Vehicle

Band 3; Price = £200

Old Calculation

Days Used = 100 → Amount Used = £27.40

New Calculation

Days Remaining = 265 → Amount Remaining = £145.20

Final Calculation

£145.20 – £27.40 = £117.80

Outcome

✅ User pays £117.80

* * *

### **Example 2 – Diesel Surcharge Applied**

Section

Details

Scenario

Diesel vehicle (Euro < 6); Surcharge = £50

Old Vehicle

Petrol; Band 2; Price = £150

New Vehicle

Diesel; Band 4; Base Price = £250; Surcharge = £50 → Final = £300

Old Calculation

Days Used = 120 → Amount Used = £49.32

New Calculation

Days Remaining = 245 → Amount Remaining = £201.37

Final Calculation

£201.37 – £49.32 = £152.05

Outcome

✅ User pays £152.05

* * *

### **Example 3 – Tier Pricing (Second Permit Scenario)**

Section

Details

Scenario

Tier pricing enabled; User has 1 existing permit → Tier 2 applies

Pricing Setup

Band 3 → Tier 1 = £200; Tier 2 = £300

Old Vehicle

Band 3; Tier 1; Price = £200

New Vehicle

Band 3; Tier 2; Price = £300

Old Calculation

Days Used = 150 → Amount Used = £82.19

New Calculation

Days Remaining = 215 → Amount Remaining = £176.71

Final Calculation

£176.71 – £82.19 = £94.52

Outcome

✅ User pays £94.52

* * *

### **Example 4 – Electric → Diesel (Full Complex Scenario)**

Section

Details

Scenario

Band change + Diesel surcharge + Emission logic change

Old Vehicle

Electric; CO₂ = 0 → First Band; Price = £50

New Vehicle

Diesel; CO₂ = NULL → Engine size band; Base = £180; Surcharge = £40 → Final = £220

Old Calculation

Days Used = 200 → Amount Used = £27.40

New Calculation

Days Remaining = 165 → Amount Remaining = £99.45

Final Calculation

£99.45 – £27.40 = £72.05

Outcome

✅ User pays £72.05

* * *

## **6.7. Critical Business Rules**

Rule ID

Rule

Description

BR-01

Recalculate Using New Logic

New vehicle pricing must re-evaluate emission band, tier, and diesel surcharge

BR-02

Old Price Fixed

Old permit price must NOT be recalculated; use original band and price

BR-03

Diesel Surcharge Conditions

Apply only if: Diesel vehicle + Euro < 6 + Toggle ON

BR-04

Hybrid Rules

Hybrid ON → No surcharge; CO₂ = 0 → First band

BR-05

CO₂ NULL Handling

Use engine size fallback logic

BR-06

Diesel CO₂ = 0

Use engine size; DO NOT assign default band

BR-07

Pre-2001 Vehicles

Always use engine size-based calculation

BR-08

Consistency Requirement

All calculations must align with emission decision table logic

## 6.8 CHANGE VEHICLE CALCULATION DECISION TABLE

Scenario

Old Band vs New Band

Old Price

New Price

Days Used

Days Remaining

Outcome

COV-01

Same band

Same

Same

X

Y

Only prorate → small adjustment

COV-02

Higher band

Low

High

X

Y

✅ User pays difference

COV-03

Lower band

High

Low

X

Y

✅ Refund generated

COV-04

Diesel added

No surcharge

With surcharge

X

Y

✅ Additional payment

COV-05

Diesel removed

With surcharge

No surcharge

X

Y

✅ Refund

COV-06

Tier increase

Tier 1 → 2

Higher price

X

Y

✅ Additional payment

COV-07

Tier decrease

Tier 2 → 1

Lower price

X

Y

✅ Refund

COV-08

Electric → Petrol

First band → Default

Higher

X

Y

✅ Pay more

COV-09

Petrol → Electric

Default → First

Lower

X

Y

✅ Refund

COV-10

CO₂ missing → engine

CO₂ band → engine

Depends on pricing rule

Condition

Formula

Result

New > Old

New Remaining – Old Used

✅ Payable

Old > New

Old Used – New Remaining

✅ Refund

Equal

Same

No change

# 7\. CHANGE VEHICLE – REFUND LOGIC (ONLINE & OFFLINE)

* * *

## 7.1 Refund Applicability

FR ID

Requirement

Description

RF-FR-01

Refund Trigger

Refund shall be initiated when **Old Amount Used > New Amount Remaining**

RF-FR-02

Additional Payment

Additional payment required when **New Amount Remaining > Old Amount Used**

RF-FR-03

No Adjustment

No refund or charge when both amounts are equal

* * *

## 7.2 Core Refund Calculation

Same for both online and offline:

wide1800

Where:

-   Old Amount Used = (Days Used / Total Days) × Old Permit Price
    
-   New Amount Remaining = (Days Remaining / Total Days) × New Permit Price
    

* * *

## 7.3 ONLINE REFUND PROCESS

FR ID

Requirement

Description

RF-FR-04

Online Refund Mode

Refund shall be processed automatically to the **original payment method**

RF-FR-05

Real-Time Calculation

Refund amount shall be calculated instantly during change vehicle submission

RF-FR-06

Payment Gateway Integration

System shall trigger refund via integrated payment gateway

RF-FR-07

Status Tracking

Refund status must be tracked (e.g., Initiated / Successful / Failed)

RF-FR-08

Failure Handling

If refund fails, system shall mark transaction as **Refund Failed** and require manual processing

* * *

## 7.4 OFFLINE REFUND PROCESS

FR ID

Requirement

Description

RF-FR-09

Offline Refund Mode

Refund shall be processed manually by back-office/admin

RF-FR-10

Refund Recording

System shall record refund amount and mark as **Offline Refund Required**

RF-FR-11

Manual Confirmation

Admin must confirm refund completion in system

RF-FR-12

Status Update

Refund status shall be updated manually (Pending / Completed / Rejected)

# 8\. NON-FUNCTIONAL REQUIREMENTS

NFR ID

Category

Requirement

NFR-01

Performance

System shall calculate emission pricing (band + tier + surcharge) in **real-time without noticeable delay** during application and change vehicle flow

NFR-02

Scalability

System shall support pricing calculation for **multiple vehicles per application** without performance degradation

NFR-03

Accuracy

All pricing calculations (proration, tier, surcharge) must be **mathematically accurate and consistent** across modules

NFR-04

Consistency

Pricing logic must be consistent across:

-   Application form
    
-   Change vehicle
    
-   Renewal
    
-   Refund processing |
    

NFR-05

Availability

Pricing calculation service shall be available during all application flows (no downtime impact on pricing) |

NFR-06

Auditability

System shall log:

-   Band selected
    
-   Tier applied
    
-   Surcharge applied
    
-   Final calculation values
    

NFR-07

Reliability

-   System shall ensure no data loss during pricing recalculation or vehicle change
    

NFR-08

Usability

-   Pricing displayed to users must be **clear, transparent, and understandable** (band + breakdown) |
    

## 9\. ASSUMPTIONS

AS ID

Assumption

AS-01

Vehicle data (CO₂, engine size, fuel type) will be available and correctly provided

AS-02

DVLA and custom tax band configurations are correctly set up before pricing is used

AS-03

Tier pricing configuration exists where required

AS-04

Diesel surcharge rules (Euro standards, toggle settings) are properly configured

AS-05

Permit duration (start and end date) is always valid and available

AS-06

Users will not bypass vehicle validation rules before reaching pricing tab

AS-07

Payment/refund integration (for online refunds) will function independently as per system integration

# 10\. CONSTRAINTS

CT ID

Constraint

CT-01

System must strictly follow defined emission decision table logic

CT-02

Pricing must always consider both:

-   Vehicle emission band
    
-   Zone (if applicable)
    

CT-03

Default DVLA bands cannot be modified or deleted

CT-04

Emission pricing cannot work unless CO₂ and engine size fields are enabled

CT-05

Refund calculation must be strictly prorated (no manual override in system logic)

CT-06

-   Tier logic must follow:
    
-   Property level (zonal)
    
-   User level (non-zonal)
    

CT-07

Old permit pricing must not be recalculated during change vehicle

CT-08

System must rely on external payment gateway for online refund execution

# 11\. RISKS & MITIGATION

Risk ID

Risk Description

Impact

Mitigation

RS-01

Incorrect CO₂ or vehicle data

Wrong pricing

Add validation & fallback (engine size logic)

RS-02

Misconfiguration of tax bands

Incorrect band mapping

Validation to prevent overlap / missing mapping

RS-03

Tier miscalculation

Over/under charging

Clear logic: property vs user level validation

RS-04

Diesel surcharge misapplication

Financial discrepancy

Enforce Euro rule + toggle validation

RS-05

Pricing inconsistency across modules

Audit failure

Use single pricing engine across all flows

RS-06

Refund failure (online)

Customer dissatisfaction

Add refund failure handling + manual fallback

RS-07

Multiple vehicle edge cases

Incorrect band selection

Always enforce highest band logic

RS-08

Performance issues with complex calculations

Slow UI response

Optimize calculation and caching

RS-09

First vs Default band confusion

Incorrect pricing

Explicit validation and separation rules

12.  Approval