# 02-06-26 Permission System Meeting: Key Issues and Action Items on Pricing, Configuration, and Application Problems

> **Confluence ID:** 2011529231 · **Version:** 1 · **Last updated:** 2026-06-02T10:19:31.717Z
> **Path:** MOM - Apply IQ
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/2011529231/02-06-26+Permission+System+Meeting+Key+Issues+and+Action+Items+on+Pricing+Configuration+and+Application+Problems

---

### **Meeting Title:** Permission System - Discussion with Jo

### **Date & Time:** Today, 3:00 PM – 3:30 PM

* * *

## ✅ **Key Discussion Points**

### 1\. **Dispensation Application Issue (Southend)**

-   Issue: Application fails to proceed to checkout on clicking _Save and Continue_.
    
-   Status: Not yet fixed.
    
-   Root Problem: Page does not navigate to checkout → application cannot be submitted. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3sA548IAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
    

* * *

### 2\. **Permission Builder / Thameside Configuration Issue**

-   Issue: Unable to configure Thameside in pre-prod/DM environment.
    
-   Missing functionality:
    
    -   Checkbox for selecting days (for multi-day permits) not appearing.
        
-   Dependency: Required for upcoming go-live (end of June). [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3sA548IAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
    

* * *

### 3\. **Incorrect Pricing (Support Ticket – Andrea)**

-   Issue: Price configured = £63, but customer charged = £70.
    
-   Challenge:
    
    -   Permit type not provided in ticket → making investigation difficult.
        
    -   Some permits are migrated → adds complexity.
        
-   Observation:
    
    -   Resident concessionary permit has multiple zone sets affecting pricing.
        
-   Approach:
    
    -   Manual validation required – check permit-by-permit. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3sA548IAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

* * *

### 4\. **Tier Pricing Issue (CR Discussion)**

-   Issue: Pricing incorrect for 2nd / 3rd permits.
    
-   Scenario:
    
    -   Multiple permits at same address but under different customers.
        
-   Gap Identified:
    
    -   System validates **property/postcode**, not **applicant/customer**.
        
-   Key Concern:
    
    -   System not calculating correct tier pricing in such mixed scenarios. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3sA548IAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

* * *

### 5\. **Migrated vs New Permit Behavior**

-   Findings:
    
    -   2 permits → Migrated
        
    -   1 permit → New application
        
-   Issue:
    
    -   New permit still picking incorrect tier price (Tier 1).
        
-   Root Cause:
    
    -   Migrated permits not properly considered in tier pricing logic.
        
-   Note:
    
    -   Existing fix released does not cover migrated data scenario. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3sA548IAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

* * *

### 6\. **Blob Storage / Printing Issue**

-   Issue:
    
    -   Error: _“Failed to download document from Blob Storage”_
        
    -   Users unable to print permits.
        
-   Behavior:
    
    -   Some users cannot interact with options (3 dots menu not responding).
        
-   Status:
    
    -   Requires investigation by dev team. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3sA548IAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

* * *

### 7\. **Search / Address Selection Issue**

-   Issue:
    
    -   Address not retrievable manually in some cases.
        
-   Status:
    
    -   Claimed resolved, but still partially inconsistent. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3sA548IAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

* * *

## 📌 **Decisions / Agreements**

-   Tier pricing logic must consider both:
    
    -   Migrated permits
        
    -   Mixed customer scenarios at the same address
        
-   Investigation required for:
    
    -   Blob storage failure
        
    -   Pricing discrepancies
        
-   Additional validation required for migrated data scenarios. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3sA548IAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
    

* * *

## 🧾 **Action Items**

#

Action

Owner

Notes

1

Investigate dispensation application checkout issue

Dev Team

Blocking submission

2

Validate Thameside configuration issue (checkbox missing)

Prathiba K

Check in pre-prod & confirm

3

Analyze incorrect pricing ticket with permit-level validation

Joanne Archer

Requires manual review

4

Fix tier pricing logic (migrated + mixed customer scenario)

Dev Team

Critical bug

5

Validate fix coverage for migrated permits

QA / Dev

Re-test scenario

6

Investigate Blob storage download failure

Dev Team

Impacting printing

7

Re-check search/address selection issue

Dev Team

Verify resolution

* * *

## ⚠️ **Risks / Dependencies**

-   Thameside go-live (end of June) depends on configuration fix.
    
-   Pricing issues may impact billing accuracy and customer trust.
    
-   Printing/Blob issue impacts operational usability.
    

* * *

## 📎 **Additional Notes**

-   Permit example discussed: Resident Concessionary Permit.
    
-   Sample reference used during debugging shared in meeting chat.