# 19-05-26 Emission Based Pricing and Data Handling

> **Confluence ID:** 1996619787 · **Version:** 1 · **Last updated:** 2026-05-27T09:39:32.796Z
> **Path:** MOM - Apply IQ
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/1996619787/19-05-26+Emission+Based+Pricing+and+Data+Handling

---

**Meeting Title:** [Permission System - Discussion with Jo](https://teams.microsoft.com/l/meetup-join/19%3ameeting_ZDNiZDEyYzYtNDYyZS00ZDJjLThiZjAtNGE2ZWY1ZTAwMzhi%40thread.v2/0?context=%7b%22Tid%22%3a%223734172a-e82a-4ac7-a3d3-02949970d5e6%22%2c%22Oid%22%3a%223fc51c78-f738-456f-a9ca-3221b8cea8f9%22%7d)  
**Date & Time:** 19-05-26, 3:00 PM – 3:30 PM  
**Organizer:** Gowtham K  
**Participants:** Discussion includes inputs from Prathiba K, Joanne Archer, Pugazh Vaanan.V, Natarajan Arumugam (based on transcript dialogue)  
**Meeting Type:** Recurring Weekly Discussion  
**Transcription Status:** Transcribed [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3rU5kfmAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)

* * *

## **1\. Agenda**

-   Permission Builder enhancements
    
-   Off-street parking question configuration
    
-   Emission-based pricing setup
    
-   Vehicle lookup & data handling
    
-   Tax band configuration (Default vs Custom)
    
-   Pricing logic (emissions vs engine size)
    
-   Reporting requirements
    

* * *

## **2\. Key Discussion Points**

### **2.1 Off-Street Parking Question (Permission Builder)**

-   A custom question will be enabled when _off-street parking_ is configured. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3rU5kfmAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
    
-   Values can be:
    
    -   Configurable options (e.g., 1, 2, none), OR
        
    -   Numeric input field
        
-   Decision:
    
    -   Proceed with **numeric input field approach** instead of predefined values. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3rU5kfmAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

* * *

### **2.2 Emission-Based Pricing – Prerequisites**

-   To enable emission-based pricing:
    
    -   **CO2 emissions field** must be enabled (mandatory) [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3rU5kfmAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        
    -   Engine size may also be used depending on scenarios
        
-   First date of registration:
    
    -   Not required as user input in frontend
        
    -   Used in backend (vehicle lookup data) [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3rU5kfmAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

* * *

### **2.3 Vehicle Lookup – Data Handling**

-   Current observation:
    
    -   API returns multiple data fields (e.g., CO2, engine size, etc.) [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3rU5kfmAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        
-   Open question:
    
    -   Whether system stores **all returned fields or only selected ones**
        
-   Decision:
    
    -   To be confirmed with technical team before finalizing logic [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3rU5kfmAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

* * *

### **2.4 Emission Band Configuration**

-   Bands defined using:
    
    -   Minimum and Maximum emission values
        
-   Enhancement:
    
    -   Support **operators (e.g., “greater than”)** for upper limit scenarios [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3rU5kfmAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

* * *

### **2.5 Tax Bands & Pricing Structure**

#### **a. Types of Bands**

-   **Custom Tax Bands**
    
    -   Define emission ranges
        
-   **Council Tax (Pricing) Bands**
    
    -   Define pricing groups
        
-   Mapping:
    
    -   Multiple emission bands → mapped to one pricing band [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3rU5kfmAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

* * *

#### **b. Default Band**

-   A **default pricing band is mandatory**
    
-   Used when:
    
    -   Emission value is not returned (null from lookup) [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3rU5kfmAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        
-   Only **one band can be marked as default**
    
-   Without default:
    
    -   System cannot determine pricing [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3rU5kfmAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

* * *

#### **c. Middle Band**

-   Not required
    
-   Decision:
    
    -   **Exclude middle band functionality** [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3rU5kfmAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

* * *

#### **d. Standard vs Custom Bands**

-   Default system uses **DVLA bands (A–M)**
    
-   Custom bands:
    
    -   Can be configured freely (numeric or custom naming)
        
-   Rule:
    
    -   Either use **default bands OR custom bands**, not both simultaneously [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3rU5kfmAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

* * *

### **2.6 Pricing Logic (Emission vs Engine Size)**

#### **Primary Logic**

1.  If emission value is available → use emission-based pricing
    
2.  If emission value is NOT available:
    
    -   Use engine size or fuel type
        

[\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3rU5kfmAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)

* * *

#### **Special Cases**

-   Vehicles registered before March 2001:
    
    -   No emission data → use **engine size** [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3rU5kfmAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        
-   Camper vans / Motorhomes:
    
    -   Emission = 0 → use engine size
        
-   Diesel vehicles:
    
    -   Emission = 0 → use engine size (not emission)
        
-   Electric vehicles:
    
    -   Emission = 0 → typically lowest band
        

[\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3rU5kfmAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)

* * *

#### **Hybrid Vehicles**

-   Behavior depends on:
    
    -   Returned fuel type from API
        
-   Action:
    
    -   Need to validate API response (VES / Auto Guru) for hybrid vehicles [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3rU5kfmAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

* * *

### **2.7 Tiered Pricing**

-   Tiered pricing can coexist with emission-based pricing
    
-   It is **optional** and controlled via toggle [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3rU5kfmAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
    

* * *

### **2.8 Reporting Requirement**

-   Required fields:
    
    -   Emission band
        
    -   Pricing band
        
-   Use case:
    
    -   Reporting for diesel surcharge validation and audits [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3rU5kfmAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

* * *

## **3\. Decisions Summary**

-   Use **numeric field** for off-street parking input
    
-   CO2 emission field is **mandatory prerequisite**
    
-   Include **“greater than” operator support** in emission bands
    
-   Default band is **mandatory (only one allowed)**
    
-   Remove **middle band functionality**
    
-   Support both:
    
    -   Default DVLA bands (A–M)
        
    -   Custom band configurations (toggle-based)
        
-   Tiered pricing supported alongside emission-based pricing
    

* * *

## **4\. Action Items**

#

Action

Owner

1

Confirm vehicle lookup data storage (all fields vs selected fields)

Prathiba K to check with technical team

2

Provide detailed pricing rule document (edge cases: diesel, hybrid, electric, etc.)

Joanne Archer

3

Validate hybrid vehicle API response (VES vs Auto Guru)

Team

4

Ensure reporting includes emission & pricing band fields

Team

* * *

## **5\. Open Questions**

-   How API lookup data is stored internally
    
-   Final handling logic for hybrid vehicles (based on API response)