# Taxi Companies Discussion Document:

> **Confluence ID:** 1910538264 · **Version:** 1 · **Last updated:** 2026-04-24T09:06:07.497Z
> **Path:** Requirements / Taxi Companies
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/1910538264/Taxi+Companies+Discussion+Document

---

## 1\. Purpose of This Document

This document consolidates and restructures the Taxi Card requirements provided, converting them into a clear **business and functional understanding** without omitting any requirements. It is intended to support **solution design, backlog creation, BRD/FRD preparation, and stakeholder alignment**.

* * *

## 2\. Business Objectives

The Taxi Card system aims to:

-   Manage Taxi Card applications end-to-end
    
-   Control and monitor journey (trip) allocation and usage
    
-   Integrate with taxi operators and enforcement systems
    
-   Support customer communications, reminders, and compliance
    
-   Maintain full auditability and GDPR compliance
    

* * *

## 3\. High-Level Scope Overview

### In Scope

-   Taxi Card application management
    
-   Trip / journey allocation and tracking
    
-   Customer portal visibility
    
-   Back-office administration
    
-   Imports from taxi companies
    
-   Integrations (Illumin8, print partner, third party photo)
    
-   Communications (email, paper letters, reminders)
    

### Out of Scope (Explicitly Not Mentioned)

-   Payment processing beyond recording payments
    
-   Taxi dispatch or booking systems
    

* * *

## 4\. Core Functional Areas

### 4.1 Taxi Card & Permit Identification

-   Generate a **unique Taxi Card number** in addition to the permit number
    
-   Taxi Card number must:
    
    -   Be visible in:
        
        -   Customer Account (permit window)
            
        -   Approved customer application
            
    -   Follow a specific format and length:
        
        -   Similar length/style to existing cards
            
        -   Avoid prefixes: **F, I, M, O**
            
-   Support linkage between:
    
    -   Old and renewed Taxi Card numbers
        
    -   Historical trip usage
        

* * *

## 5\. Application & Customer Data Management

### 5.1 Applicant Data

The system must store and maintain:

-   Personal details (name, address, phone, DOB, postcode)
    
-   GP details
    
-   Mobility levels (with history)
    
-   Communication preferences
    
-   Application status
    

### 5.2 Change & Audit History

-   Full audit trail including:
    
    -   User
        
    -   Date & time
        
    -   Action performed
        
-   History tracking for:
    
    -   Name, address, telephone changes
        
    -   GP detail changes
        
    -   Mobility level changes
        

### 5.3 Document & Image Management

-   Upload and store:
    
    -   Application documents
        
    -   Applicant photograph
        
-   Photo requirements:
    
    -   Exportable to print partner
        
    -   Integrated with third party (e.g., **Kippa** or equivalent)
        
    -   GDPR-compliant deletion routines for old images
        

* * *

## 6\. Taxi Card Permit Template (New Requirement)

### 6.1 New Journey-Based Permit Template

A new template is required that:

-   Sells **journeys / trips** (similar to Visitor Vouchers)
    
-   Supports **configurable journey quantities**
    

### 6.2 Configurable Question Framework

Unlike the Disabled Bay template, this new template must allow **flexible question types per question**, including:

-   Free text box
    
-   Tick box (multi-select)
    
-   Radio buttons (Yes/No)
    
-   Dropdown list
    

Each question can have a different answer type.

* * *

## 7\. Journey Allocation & Validity Rules

### 7.1 Journey Configuration

-   Journey limits configurable:
    
    -   Zonal permits → Set at **Permit Category / Zone** level
        
    -   Non-zonal permits → Set on **Manage Pricing** page
        

### 7.2 Journey Validity Duration

-   Journeys expire after a defined duration, regardless of remaining balance:
    
    -   Examples: 12 months, 6 weeks, 2 days
        

### 7.3 Application Limits (Non-Zonal)

-   Ability to limit:
    
    -   Number of applications per user
        
    -   Within a defined time period
        

* * *

## 8\. Trip Usage Recording & Integration

### 8.1 Taxi Company Data Imports

-   Taxi companies provide monthly usage data via spreadsheet
    
-   Standard file format:
    
    1.  Taxicard Number
        
    2.  Trip Date
        
    3.  Total Cost
        
    4.  Taxicard Discount
        
    5.  Driver Number
        
    6.  Invoice Number
        

### 8.2 Import Methods

-   Flat file upload with scheduled script/routine
    
-   OR real-time API integration
    

### 8.3 Enforcement System Integration

-   Import journey usage into **Illumin8**
    
-   System must:
    
    -   Update journeys used and remaining
        
    -   Display usage on customer permit view
        

* * *

## 9\. Journey Monitoring, Limits & Bans

### 9.1 Annual & Lifetime Rules

-   Typical configuration:
    
    -   104 journeys per year
        
    -   Taxi Card validity: 3 years
        
-   Excess journeys:
    
    -   Rolled over into next year (if applicable)
        
    -   Card banned if exceeded in final year
        

### 9.2 Threshold Indicators

-   Visual indicators when:
    
    -   Approaching limit (e.g., 80 trips)
        
    -   Exceeded allocation
        
-   Clearly display:
    
    -   Ban status
        
    -   When card can be used again
        
    -   Allowed journeys & timeframe
        

* * *

## 10\. Communications & Reminders

### 10.1 Email Events

New configurable email event:

-   Notifies customers of remaining journeys
    
-   Triggered based on **journey count**, not time
    
-   Configurable thresholds (e.g., 10, 5, 1 journeys)
    
-   Configuration stored at Permit Category level
    

### 10.2 Paper Reminders

-   Ability to send **paper reminders** when journeys drop below threshold
    
-   Must:
    
    -   Reuse existing paper reminder capability
        
    -   Link to newly created journey-based event
        

### 10.3 Letters & Notices

-   Standard letters:
    
    -   Near limit
        
    -   Over limit
        
    -   Banned
        
-   Produce only **one letter per customer**, not per taxi company
    
-   Facility to log:
    
    -   Sent letters
        
    -   Undelivered mail
        

* * *

## 11\. Back Office Administration Functions

-   Log all notes
    
-   Log all communications (calls, emails, letters)
    
-   Log taxi cards issued, lost, banned
    
-   Record:
    
    -   Deceased users
        
    -   Users moved away
        
-   Maintain:
    
    -   Banned list
        
    -   Over 80s indicators
        

* * *

## 12\. Reporting Requirements

On-demand reports including:

-   Total Taxi Cards on issue
    
-   Taxi Cards by date range
    
-   Usage reports
    
-   Card status, mobility level, issue date
    
-   Trips over threshold
    
-   Taxi company charges per card
    

* * *

## 13\. Renewal Rules

-   Renewal applications:
    
    -   Must be received within **1 year of expiry**
        
    -   Otherwise treated as **new application**
        
-   New card number issued by default
    
-   Ability to link previous card history strongly preferred
    

* * *

## 14\. Compliance & Risk Considerations

-   GDPR compliance for image retention and deletion
    
-   Security:
    
    -   Unique user accounts (no shared logins)
        
-   Audit and accountability mandatory
    

* * *

## 15\. Open Considerations / Assumptions

-   Disabled Bay template zonal/non-zonal behaviour needs confirmation
    
-   Renewal carry-over logic to align with existing permit behaviour in Apply for Permits
    

* * *

## 16\. Summary

This consolidated understanding captures **all business, functional, integration, and operational requirements** for the Taxi Card system. It provides a foundation for:

-   BRD / FRD creation
    
-   Jira epics and stories
    
-   Technical design and integration planning
    
-   Stakeholder validation