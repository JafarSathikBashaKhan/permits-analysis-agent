# 01-06-26 Payment Flow and Emission-Based Pricing Discussion Summary

> **Confluence ID:** 2006417524 · **Version:** 1 · **Last updated:** 2026-06-01T10:06:09.975Z
> **Path:** MOM - Apply IQ
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/2006417524/01-06-26+Payment+Flow+and+Emission-Based+Pricing+Discussion+Summary

---

**Date:** June 1, 2026  
**Time:** 3:00 PM – 3:30 PM  
**Organizer:** Gowtham K  
**Participants (from transcript):** Prathiba K, Joanne Archer, Natarajan Arumugam, Pugazh Vaanan.V [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3r9wuVhAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)

* * *

## **1\. Payment Flow Clarification**

-   Current understanding: Pre-authorization → Approval → Full payment capture.
    
-   **Exception (Lewisham):** Full payment is taken upfront, not post-approval.
    
-   **Action:** Joanne Archer to confirm with KVR regarding Lewisham payment handling. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3r9wuVhAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
    

* * *

## **2\. Emission-Based Pricing**

### **Hybrid Vehicle Handling**

-   Pricing depends on council rules (treated as electric or standard band).
    
-   If CO2 = 0 → falls under corresponding band (typically lowest band).
    
-   If CO2 = null:
    
    -   Use alternative criteria (e.g., engine size for vehicles registered before March 2001).
        

### **Key Decisions**

-   Engine size must be enabled for emission-based pricing due to older vehicles.
    
-   Hybrid vehicles:
    
    -   Diesel surcharge applicability requires **configurable toggle**.
        
    -   Toggle determines whether surcharge applies to hybrids only.
        

* * *

## **3\. Diesel Surcharge Rules**

-   Applies to diesel and optionally hybrid diesel vehicles (via toggle).
    
-   **Lewisham-specific rule:**
    
    -   Euro 6 compliant diesel vehicles **do not incur diesel surcharge**. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3r9wuVhAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

* * *

## **4\. Configuration & Data Requirements**

-   Mandatory configuration:
    
    -   CO2 emissions
        
    -   Engine size
        
-   System retrieves full vehicle data but displays only enabled fields.
    
-   Supports:
    
    -   DVLA bands or custom bands
        
    -   Tier-based pricing (zone/property/user level depending on setup)
        

* * *

## **5\. Reporting Requirements**

### **Fields to Include**

-   Band price & band name
    
-   Tier
    
-   Diesel surcharge indicator
    
-   Date registered
    
-   Fuel type
    
-   Vehicle type
    
-   Euro 6 compliance
    

### **Filters**

-   Existing: Permission type, name, date range
    
-   New requirement: **Fuel type filter**
    

### **Report Logic**

-   Only **primary vehicle** shown in report
    
-   However, pricing should consider **highest band vehicle**, not just primary
    

* * *

## **6\. Multi-Vehicle Pricing Logic**

-   Permit price is based on:
    
    -   Highest emission band vehicle across all vehicles in permit
        
-   Even if primary vehicle is lower band, pricing must use highest band vehicle. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3r9wuVhAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
    

* * *

## **7\. Change Vehicle Flow**

-   Two possible approaches:
    
    1.  **Flat Fee (if enabled):** Fixed charge regardless of difference
        
    2.  **Dynamic Calculation:**
        
        -   Based on old vs new permit price
            
        -   Considers remaining days
            
        -   May result in surcharge or refund
            
-   Refund setting for cancellation is **NOT applicable** to change vehicle.
    
-   Change vehicle always recalculates unless flat fee is enabled. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3r9wuVhAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
    

* * *

## **8\. Open Discussions / Clarifications**

-   Tier pricing vs band pricing clarification documented by Prathiba K for review
    
-   Inclusion of band details in diesel surcharge report confirmed
    
-   Filter enhancements under review
    

* * *

## **9\. Pending Items / Actions**

Action

Owner

Confirm Lewisham payment flow with KVR

Joanne Archer

Confirm hybrid pricing rules with client

Joanne Archer

Clarify flat fee behavior vs admin fee

Joanne Archer

Validate suspension & dispensation reports with client

Joanne Archer

Review pricing issue ticket shared via email

Joanne Archer

Share detailed emission-based pricing documentation

Prathiba K

* * *

## **10\. Additional Notes**

-   Vehicle lookup returns complete dataset; UI will show based on enabled fields.
    
-   Pricing and reporting must align with configurable contract settings.
    
-   Further confirmation required from council/client for some rules.