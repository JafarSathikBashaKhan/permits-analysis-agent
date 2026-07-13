# BRD_Apply IQ_Emission_Based_Pricing_V1.0_26-05-2026

> **Confluence ID:** 1992556556 · **Version:** 8 · **Last updated:** 2026-06-24T07:06:15.929Z
> **Path:** Requirements / Emission Based Pricing
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/1992556556/BRD_Apply+IQ_Emission_Based_Pricing_V1.0_26-05-2026

---

* * *

## **1\. Document Overview**

### **1.1 Purpose**

This document defines the business requirements for implementing **Emission-Based Pricing** in the Apply IQ system.

The document incorporates:

-   Existing business logic and prior design decisions
    
-   Enhancements and finalised behaviour from the latest FRD
    
-   Complete pricing lifecycle including configuration, calculation, recalculation, and refund handling
    

* * *

### **1.2 Scope**

#### **In Scope**

-   Contract-level configuration for emission-based pricing
    
-   CO₂ and Engine size enablement dependency
    
-   Tax band configuration (DVLA & Custom)
    
-   Emission band creation and mapping
    
-   Diesel surcharge and hybrid handling
    
-   Pricing configuration (band-level + tier pricing)
    
-   Dynamic pricing during:
    
    -   Application
        
    -   Change vehicle
        
    -   Change address / zone
        
    -   Renewal
        
-   Multi-vehicle pricing logic (highest band selection)
    
-   Refund and additional payment calculation (online & offline)
    
-   Reporting fields for pricing components
    

#### **Out of Scope**

-   UI design (visual layout only)
    
-   External payment gateway implementation logic
    
-   Non-permit pricing use cases
    

* * *

## **2\. Background / Context**

Emission-Based Pricing enables permit charges to be calculated based on:

-   CO₂ emissions
    
-   Engine size
    
-   Fuel type
    
-   Tier-based progression
    
-   Zone and address-based pricing
    

The solution has evolved into a **configurable pricing engine** supporting:

-   Dynamic pricing recalculation
    
-   Multi-vehicle handling
    
-   Diesel surcharge and hybrid logic
    
-   Prorated calculations for mid-cycle changes
    
-   Refund and payment adjustments
    

* * *

## **3\. High-Level Design**

Area

Requirement

Pricing Model

Emission → Tax Band → Pricing

Configuration

Contract-level configurable

Pricing Type

Band-based + Tier-based

Pricing Behaviour

Dynamic, real-time

Multi-Vehicle

Highest band pricing

Adjustment

Prorated calculation

Refund

Online + Offline

* * *

## **4\. Business Requirements**

### **4.1 Configuration Requirements**

BR ID

Requirement Title

Description

BR-01

Emission Pricing Toggle

System shall allow enabling/disabling emission-based pricing

BR-02

Tier Pricing Toggle

System shall allow enabling tier-based pricing

BR-03

Mandatory Dependency

CO₂ and Engine Size must be enabled for emission pricing

BR-04

Tax Band Selection

System shall support DVLA and Custom tax bands

BR-05

Custom Band Configuration

System shall allow creation of custom bands with CO₂ and engine ranges

BR-06

Band Validation

System shall enforce non-overlapping ranges and mandatory fields

BR-07

Emission Band Mapping

Each emission band must be mapped to a tax band

* * *

### **4.2 Pricing Configuration**

BR ID

Requirement

Description

BR-08

Band-Level Pricing

Pricing must be configured per emission band

BR-09

Tier Pricing

System shall support multiple tiers per band

BR-10

Tier Application

Tier must be applied after emission band selection

BR-11

Pricing Clone

System shall allow cloning pricing configuration

* * *

### **4.3 Pricing Calculation Logic**

BR ID

Requirement

Description

BR-12

Pricing Calculation

Price = Band Price + Tier Adjustment + Diesel Surcharge

BR-13

Dynamic Pricing

Pricing shall update based on vehicle selection and duration

BR-14

Real-Time Recalculation

Pricing must refresh when vehicle/zone/address changes

* * *

### **4.4 Multi-Vehicle Handling**

BR ID

Requirement

Description

BR-15

Multi-Vehicle Support

System shall support multiple vehicles

BR-16

Highest Band Logic

Highest emission band must be applied

* * *

### **4.5 Diesel & Hybrid Logic**

BR ID

Requirement

Description

BR-17

Diesel Surcharge

Apply based on configuration and vehicle condition

BR-18

Hybrid Handling

Hybrid vehicles must NOT apply diesel surcharge when enabled

* * *

### **4.6 Change Vehicle Behaviour**

BR ID

Requirement

Description

BR-19

Recalculation

Pricing must recalculate on vehicle change

BR-20

Proration

Pricing must be prorated based on duration

BR-21

Old Price Retention

Old permit price must not be recalculated

BR-22

Adjustment Logic

System shall calculate refund or additional payable amount

* * *

### **4.7 Refund Handling**

BR ID

Requirement

Description

BR-23

Refund Trigger

Refund when old amount > new amount

BR-24

Online Refund

Process automatically via payment method

BR-25

Offline Refund

Admin manually processes refund

BR-26

Status Tracking

Track refund status (Initiated / Success / Failed)

* * *

### **4.8 Address & Zone Impact**

BR ID

Requirement

Description

BR-27

Address Change

Pricing must recalculate when address changes

BR-28

Zone-Based Pricing

Pricing depends on selected zone

BR-29

Zone Adjustment

Additional payment or refund must be calculated

* * *

### **4.9 Renewal**

BR ID

Requirement

Description

BR-30

Renewal Pricing

Pricing must be recalculated at renewal

BR-31

Highest Band

Use highest emission band among vehicles

* * *

## **5\. Assumptions**

ID

Assumption

AS-01

Vehicle data (CO₂, engine size) will be available

AS-02

Band and pricing configurations are completed before use

AS-03

Tier pricing is configured where applicable

AS-04

Payment gateway supports refund processing

AS-05

Permit duration is always valid

* * *

## **6\. Constraints**

ID

Constraint

CS-01

Emission pricing requires CO₂ and engine fields enabled

CS-02

Bands must not overlap

CS-03

Old pricing cannot be recalculated during change vehicle

CS-04

Refund must always follow prorated logic

CS-05

Must follow emission decision table logic

* * *

## **7\. Risks & Mitigation**

Risk

Impact

Mitigation

Incorrect vehicle data

Wrong pricing

Validation & fallback logic

Band misconfiguration

Incorrect mapping

Enforce validation

Tier miscalculation

Revenue loss

Strict tier rules

Refund failure

Customer dissatisfaction

Manual fallback

Multi-vehicle complexity

Incorrect pricing

Highest band logic

* * *

## **8\. Requirement Traceability Matrix (RTM)**

BR ID

Requirement

Mapped Area

Test Coverage

BR-01

Toggle

Contract

Verify enablement

BR-08

Pricing Config

Pricing

Validate band pricing

BR-15

Multi-Vehicle

Application

Highest band validation

BR-19

Change Vehicle

Adjustment

Proration validation

BR-23

Refund

Payment

Refund flow validation

## **8\. Requirement Traceability Matrix (RTM)**

**BR ID**

**Requirement Title**

**Mapped Section**

**Test Scenario Coverage**

BR-01

Emission-Based Pricing Toggle

Contract Configuration

Verify toggle enables configuration section

BR-02

Tiered Pricing Toggle

Contract Configuration

Verify tier toggle impacts pricing logic

BR-03

Default Emission Bands

Band Configuration

Validate DVLA bands availability

BR-04

Custom Emission Bands

Band Configuration

Validate custom band creation

BR-05

Emission Range Handling

Band Configuration

Validate range boundaries and > conditions

BR-06

Pricing Bands

Pricing Configuration

Validate pricing band creation

BR-07

Emission Mapping

Mapping Logic

Validate one-to-one mapping enforcement

BR-08

Default Band

Default Logic

Validate mandatory default band behaviour

BR-09

Price Configuration

Pricing

Validate pricing per band/duration

BR-10

Tiered Pricing

Pricing Logic

Validate tier-based pricing applied

BR-11

Engine Size Config

Fallback Logic

Validate engine size mapping

BR-12

Standard Pricing

Pricing Logic

Validate emission-based pricing

BR-13

Missing Emissions

Pricing Logic

Validate default band usage

BR-14

CO�� = 0 Handling

Edge Case Handling

Validate vehicle-based conditions

BR-15

Pre-2001 Logic

Edge Case Handling

Validate engine size for older vehicles

BR-16

Engine Size Pricing

Fallback Logic

Validate pricing from engine size

BR-17

Diesel Surcharge

Pricing Logic

Validate surcharge application

BR-18

Diesel Logic

Edge Case Handling

Validate correct fallback behaviour

BR-19

Tier + Emission

Pricing Logic

Validate combined pricing

BR-20

Price Calculation

Overall Logic

Validate final price assembly

BR-21

Reporting Fields

Reporting

Validate data availability in reports

BR-22

Integration Dependency

Integration

Validate API-based behaviour

BR-23

Hybrid Handling

Pricing Logic

Validate hybrid vehicle pricing logic

BR-24

Config Visibility

UI/Config

Validate visibility of config sections

BR-25

Change Vehicle Impact

Pricing Logic

Validate recalculation on change

9.  Approval
    

Name

Role

Signature

Date

 Product Owner

Business Analyst