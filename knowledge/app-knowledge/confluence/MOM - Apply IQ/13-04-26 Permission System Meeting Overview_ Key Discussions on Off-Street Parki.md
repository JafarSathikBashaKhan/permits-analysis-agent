# 13-04-26 Permission System Meeting Overview: Key Discussions on Off-Street Parking, Basket Functionality, and Diesel Surcharge Logic

> **Confluence ID:** 1996652576 · **Version:** 1 · **Last updated:** 2026-05-27T10:58:16.002Z
> **Path:** MOM - Apply IQ
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/1996652576/13-04-26+Permission+System+Meeting+Overview+Key+Discussions+on+Off-Street+Parking+Basket+Functionality+and+Diesel+Surcharge+Logic

---

### **Meeting Title:** Permission System - Discussion with Jo

### **Date:** April 13, 2026

### **Organizer:** Gowtham K

### **Source:** Meeting transcript

* * *

## **1\. Key Discussion Topics**

### **1.1 Off-Street Vehicle Parking (Wokingham Requirement)**

-   A new configurable feature to capture **off-street parking availability** during permit application was discussed. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pjvmxqAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
    
-   A **toggle in Permission Builder** (or Contract Settings) will control this feature. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pjvmxqAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
    
-   When enabled:
    
    -   A question will be displayed in the application form (Address tab). [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pjvmxqAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        
    -   Configurable values such as _None, 1, 2, etc._ should be supported. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pjvmxqAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        
-   Applicable **only for zonal permits**. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pjvmxqAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
    
-   No strict validation required; used for informational/business decision purposes. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pjvmxqAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
    
-   The captured value must be visible in:
    
    -   Customer Portal (application flow)
        
    -   Back Office (overview for admin review) [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pjvmxqAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

* * *

### **1.2 Basket Functionality & Payment Method Handling**

-   When multiple permissions are added to the basket:
    
    -   Only **common payment methods across all items** should be allowed. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pjvmxqAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        
-   If a permission has incompatible payment methods:
    
    -   The system should **restrict adding it to the basket**.
        
    -   A user-facing message must be displayed. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pjvmxqAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

* * *

### **1.3 Terms & Conditions in Basket**

-   Each permission may have **different Terms & Conditions**. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pjvmxqAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
    
-   In the basket:
    
    -   Terms & Conditions must be displayed per permission.
        
    -   Users must accept them before checkout. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pjvmxqAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        
-   Final UI/UX design of the basket screen pending. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pjvmxqAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
    

* * *

### **1.4 Voucher Summary & Non-Enforcement Time**

-   Voucher summary toggle:
    
    -   Displays total vouchers purchased in a separate summary view. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pjvmxqAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        
-   Non-enforcement time:
    
    -   Introduced for **non-zonal permits**, mainly for staff parking scenarios. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pjvmxqAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

* * *

### **1.5 Staff Parking (Lewisham)**

-   Staff permits are:
    
    -   Accessible only when logging in using a **council email address**. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pjvmxqAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        
-   Requires separate discussion for:
    
    -   Standardization across councils (Lewisham, East Sussex, Buckinghamshire). [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pjvmxqAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

* * *

### **1.6 Diesel Surcharge Logic**

-   Diesel surcharge applies when:
    
    -   Vehicle fuel type = Diesel. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pjvmxqAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        
-   Not applicable for:
    
    -   Petrol or other fuel types. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pjvmxqAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        
-   Applies even for:
    
    -   Free permits and admin fee scenarios. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pjvmxqAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        
-   Euro 6 logic:
    
    -   Currently applicable only for Lewisham. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pjvmxqAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

* * *

### **1.7 Comment Box Placement**

-   Additional comment field introduced:
    
    -   Initially in suspension template. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pjvmxqAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        
-   Decision:
    
    -   Place the comment box in the **Pricing/Duration tab** across templates. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pjvmxqAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

* * *

### **1.8 Dispensation Template Changes**

-   Updates discussed:
    
    -   Time field should be **editable**. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pjvmxqAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        
    -   Discount section:
        
        -   Should not be forced hidden; depends on configuration. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pjvmxqAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
            
-   Screen flow adjustment:
    
    -   **Street & bay selection should come before pricing/duration**. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pjvmxqAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

* * *

### **1.9 Vehicle & Document UI Changes**

-   Customer Portal:
    
    -   Vehicle types split into **Personal and Visitor categories**. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pjvmxqAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        
-   Back Office:
    
    -   Maintain grouping:
        
        -   Personal vehicles first
            
        -   Visitor vehicles next [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pjvmxqAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
            
-   Documents:
    
    -   Tabs retained for document section. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pjvmxqAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

* * *

### **1.10 Customer Portal UI Enhancements**

-   Changes confirmed:
    
    -   Rename "Explore Application" → "Search Application". [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pjvmxqAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        
    -   Remove first-time user image. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pjvmxqAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

* * *

### **1.11 Payment Integration (Key IVR)**

-   Payment integration scope:
    
    -   Signed off by Joanne Archer due to lack of response from the LV team. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pjvmxqAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        
-   Current status:
    
    -   Development has begun but is in early stages. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pjvmxqAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        
-   No major clarifications pending from the development team. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pjvmxqAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
    

* * *

## **2\. Key Decisions**

-   Off-street parking question:
    
    -   Configurable and applicable only for zonal permits. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pjvmxqAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        
-   Basket:
    
    -   Only compatible payment-method permissions can be grouped. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pjvmxqAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        
-   Terms & Conditions:
    
    -   Must be shown per permission in the basket. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pjvmxqAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        
-   Diesel surcharge:
    
    -   Based on fuel type; Euro 6 for Lewisham only. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pjvmxqAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        
-   Dispensation:
    
    -   Revised flow and editable time field confirmed. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pjvmxqAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        
-   Vehicle UI:
    
    -   Personal and visitor segregation required. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pjvmxqAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

* * *

## **3\. Action Items**

#

Action

Owner

1

Design basket screen with per-permission Terms & Conditions

Product/Design Team

2

Implement validation for compatible payment methods in basket

Dev Team

3

Configure off-street parking toggle and question handling

Dev Team

4

Finalize staff parking approach across councils

Joanne Archer / Team

5

Implement diesel surcharge logic incl. Euro 6 (Lewisham)

Dev Team

6

Update dispensation template flow (street → pricing)

Dev Team

7

Apply UI improvements (vehicle grouping, rename labels, remove image)

Frontend Team

8

Send confirmation on payment integration scope (Key IVR)

Dev Team

* * *

## **4\. Open Points / Follow-ups**

-   Basket UI design (structure and UX) – not finalized. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pjvmxqAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
    
-   Staff parking standardization across councils – requires detailed discussion. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pjvmxqAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
    
-   Euro 6 applicability for other councils (Edinburgh, East Sussex) – pending confirmation.