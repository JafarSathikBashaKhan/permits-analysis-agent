# 04-05-26Permission System Discussion: Key Points on Car Park Management and Configuration

> **Confluence ID:** 1996095505 · **Version:** 1 · **Last updated:** 2026-05-27T09:56:33.200Z
> **Path:** MOM - Apply IQ
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/1996095505/04-05-26Permission+System+Discussion+Key+Points+on+Car+Park+Management+and+Configuration

---

# **Minutes of Meeting (MoM)**

**Meeting Title:** [Permission System - Discussion with Jo](https://teams.microsoft.com/l/meetup-join/19%3ameeting_ZDNiZDEyYzYtNDYyZS00ZDJjLThiZjAtNGE2ZWY1ZTAwMzhi%40thread.v2/0?context=%7b%22Tid%22%3a%223734172a-e82a-4ac7-a3d3-02949970d5e6%22%2c%22Oid%22%3a%223fc51c78-f738-456f-a9ca-3221b8cea8f9%22%7d)  
**Date & Time:** May 4, 2026 | 3:00 PM – 3:30 PM  
**Organizer:** Gowtham K  
**Duration:** 30 minutes  
**Status:** Completed (Transcribed) [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3qlwFcdAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)

* * *

## **Objective**

-   Discuss permission system behavior and configuration related to **car park management, contract settings, and parking features**.
    

* * *

## **Key Discussion Points**

### 1\. **Permission & Toggle Configuration**

-   “Manage Car Park” functionality is controlled via **toggle settings at contract/configuration level**. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3qlwFcdAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
    
-   Enabling/disabling toggles determines whether:
    
    -   Car park management is accessible
        
    -   Contact settings are applied
        
-   Permissions can be **automatically applied based on configuration settings**. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3qlwFcdAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
    

* * *

### 2\. **Car Park Management Behavior**

-   Car park control is linked to feature toggles and contract-level configuration. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3qlwFcdAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
    
-   Users can manage car parks only when relevant toggles are enabled.
    
-   Distinction discussed between:
    
    -   Rental-related management
        
    -   General car park management
        

* * *

### 3\. **Bay Type & Capacity Configuration**

-   System supports **multiple bay types** within a car park. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3qlwFcdAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
    
-   Each bay type:
    
    -   Has its **own capacity configuration**
        
    -   Can be configured separately (e.g., residential, suspension, etc.)
        
-   Capacity is **dynamically managed by the system** based on permit issuance/expiry. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3qlwFcdAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
    

* * *

### 4\. **Dynamic Availability Management**

-   Availability updates dynamically based on:
    
    -   Space allocation
        
    -   Permit lifecycle (issue/expiry)
        
-   System must track:
    
    -   Available spaces per bay type
        
    -   Total capacity usage
        

* * *

### 5\. **On-Street vs Off-Street Classification**

-   Car parks can be categorized into:
    
    -   On-street
        
    -   Off-street
        
-   Classification influences:
    
    -   Parking rules
        
    -   Enforcement handling
        

* * *

### 6\. **Non-Enforcement Time Configuration**

-   Ability to configure **non-enforcement timings** per car park. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3qlwFcdAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
    
-   Similar behavior expected as:
    
    -   Zone-level non-enforcement configuration
        
-   Allows defining periods where enforcement rules do not apply.
    

* * *

### 7\. **Location & Mapping Configuration**

-   Car park locations include:
    
    -   Address details (property, postcode, etc.)
        
    -   Latitude/longitude
        
-   Map integration:
    
    -   Enables highlighting specific locations
        
    -   Supports selection and display of parking locations dynamically. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3qlwFcdAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

* * *

### 8\. **Pricing & Duration Configuration**

-   Parking durations discussed:
    
    -   Fixed durations (e.g., 1 week, 1 month, etc.) [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3qlwFcdAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        
-   Pricing:
    
    -   Can be configured per duration
        
    -   Applies across car parks or permission types
        
-   Supports:
    
    -   Zonal and non-zonal pricing configuration
        

* * *

### 9\. **Template & Address Handling (Non-Zonal)**

-   Non-zonal templates:
    
    -   Must use **corresponding address details dynamically**
        
-   Template reuse supported for:
    
    -   Non-zonal configuration scenarios
        

* * *

### 10\. **Customer Portal vs Back Office**

-   Car park selection and address capture:
    
    -   Driven from **customer portal workflows**
        
-   Discussion noted differentiation between:
    
    -   Customer portal
        
    -   Back office handling
        

* * *

## **Decisions**

-   Capacity must be defined **per bay type during configuration**. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3qlwFcdAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
    
-   Availability tracking will be **system-driven and dynamic**. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3qlwFcdAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
    
-   Non-enforcement time configuration should align with **zone-level behavior**. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3qlwFcdAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
    

* * *

## **Action Items**

#

Action

Owner

Status

1

Update documentation for bay type & capacity configuration

BA Team

Open

2

Finalize handling of non-enforcement time at car park level

Product/BA

Open

3

Validate toggle-based permission behavior across modules

Dev Team

Open

4

Confirm pricing model applicability (zonal vs non-zonal)

Product Team

Open

* * *

## **Notes / Observations**

-   Discussion included clarifications on **toggle dependency across modules**.
    
-   Some areas (e.g., pricing reuse, template behaviour) require **further confirmation and refinement**.
    
-   Transcript indicates ongoing clarification rather than finalized design in certain areas.