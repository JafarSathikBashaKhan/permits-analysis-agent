# 05-05-26 Discussion on Permission System: Season Ticket Model and Car Park Features

> **Confluence ID:** 1997013001 · **Version:** 1 · **Last updated:** 2026-05-27T09:53:46.263Z
> **Path:** MOM - Apply IQ
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/1997013001/05-05-26+Discussion+on+Permission+System+Season+Ticket+Model+and+Car+Park+Features

---

### **Meeting:** [Permission System - Discussion with Jo](https://teams.microsoft.com/l/meetup-join/19%3ameeting_ZDNiZDEyYzYtNDYyZS00ZDJjLThiZjAtNGE2ZWY1ZTAwMzhi%40thread.v2/0?context=%7b%22Tid%22%3a%223734172a-e82a-4ac7-a3d3-02949970d5e6%22%2c%22Oid%22%3a%223fc51c78-f738-456f-a9ca-3221b8cea8f9%22%7d) [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3qo5QDEAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)

### **Date:** May 5, 2026 [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3qo5QDEAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)

### **Duration:** 30 minutes [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3qo5QDEAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)

### **Organizer:** Gowtham K [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3qo5QDEAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)

* * *

## **1\. Objective**

-   To review **car park (season ticket) feature design**, validate competitor analysis, and confirm required functionalities for Apply IQ.
    

* * *

## **2\. Key Discussion Points**

### **2.1 Season Ticket vs Cashless Parking**

-   **Season Ticket**:
    
    -   Fixed duration (e.g., 3 months, 6 months, 1 year). [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3qo5QDEAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        
-   **Cashless Parking**:
    
    -   Typically short duration (hour-based usage). [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3qo5QDEAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        
-   Decision:
    
    -   System will focus on **season ticket model**, not cashless parking. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3qo5QDEAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

* * *

### **2.2 Car Park Search & Entry Flow**

-   Entry will include:
    
    -   Search by **location and start date**. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3qo5QDEAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        
-   UI approach:
    
    -   **Search-first approach** preferred (aligned with competitor products). [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3qo5QDEAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        
-   If only one car park is configured:
    
    -   User should be **directly navigated to purchase page** (skip list/map view). [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3qo5QDEAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        
-   If no car parks:
    
    -   Display message: _No car parks available for this area_. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3qo5QDEAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

* * *

### **2.3 List View & Card Information**

-   Current fields:
    
    -   Name, address, price, duration, distance. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3qo5QDEAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        
-   Confirmed enhancements:
    
    -   Optional features via configuration (checkbox-based):
        
        -   EV availability
            
        -   Security features
            
-   **Availability status (spaces available)**:
    
    -   Not feasible for general car parks due to mixed parking usage (e.g., pay & display, season tickets). [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3qo5QDEAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        
    -   Exception:
        
        -   Only possible for specific controlled environments (e.g., Lewisham staff parking). [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3qo5QDEAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
            
-   Allowed:
    
    -   Display **total number of spaces**, not real-time availability. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3qo5QDEAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

* * *

### **2.4 Scope of Coverage**

-   Car park data will be:
    
    -   **Restricted to council/local authority area only**. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3qo5QDEAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        
-   Not a global parking solution (unlike third-party cashless parking apps). [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3qo5QDEAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
    

* * *

### **2.5 Authentication Flow**

-   Decision:
    
    -   **Authentication required upfront** (before accessing/purchasing). [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3qo5QDEAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        
-   Not following competitor model of authentication during purchase. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3qo5QDEAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
    

* * *

### **2.6 Car Park Configuration (Back Office)**

#### **2.6.1 Manage Car Park Feature**

-   Controlled via:
    
    -   **“Manage Car Park” toggle** in contract settings. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3qo5QDEAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        
-   Enables:
    
    -   Car park creation and configuration.
        

#### **2.6.2 Configuration Elements**

-   Car park attributes include:
    
    -   Name
        
    -   Address (manual entry allowed)
        
    -   Total spaces
        
    -   Car park type (e.g., surface, multi-storey, underground) [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3qo5QDEAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

#### **2.6.3 Bay Types**

-   No need to define at detailed level.
    
-   Optional checkboxes:
    
    -   Electric vehicle bays
        
    -   Disabled bays [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3qo5QDEAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

#### **2.6.4 Status Handling**

-   Active/Inactive option supported:
    
    -   To hide a car park temporarily from display. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3qo5QDEAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

#### **2.6.5 Additional Configurations**

-   Non-enforcement time can be configured per car park. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3qo5QDEAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
    

* * *

### **2.7 Mapping & Pricing**

-   Car park mapping replaces:
    
    -   Existing **zone mapping concept**. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3qo5QDEAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        
-   Supports:
    
    -   Different pricing per car park set. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3qo5QDEAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

* * *

### **2.8 Search Filters**

-   Potential filters discussed:
    
    -   Distance
        
    -   Price
        
    -   Car park type (surface / underground etc.)
        
    -   Feature-based (e.g., EV availability) [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3qo5QDEAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

* * *

## **3\. Decisions Summary**

-   ✅ Season ticket model will be implemented (no cashless parking).
    
-   ✅ Search-first UI approach to be used.
    
-   ✅ Authentication to remain upfront.
    
-   ✅ Car parks limited to council area.
    
-   ✅ Availability (real-time) will not be shown.
    
-   ✅ Car park configuration via toggle-controlled back office setup.
    
-   ✅ Replace zone mapping with car park mapping for pricing.
    

* * *

## **4\. Action Items**

Action

Owner

Notes

Share UI snippets/screens for review

Pugazh Vaanan.V

For confirmation on search & flow design

Validate feasibility for distance calculation

Dev Team

Based on postcode/address

Finalize filter options

Team + Joanne Archer

Based on available configuration

Review updated BRD/FRD (Basket & Suspension)

Joanne Archer

Shared by Prathiba K [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3qo5QDEAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)

* * *

## **5\. Notes**

-   Availability is more relevant for short-term parking, which is not in scope. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3qo5QDEAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
    
-   Majority of parking bays are standard; advanced classification is unnecessary.