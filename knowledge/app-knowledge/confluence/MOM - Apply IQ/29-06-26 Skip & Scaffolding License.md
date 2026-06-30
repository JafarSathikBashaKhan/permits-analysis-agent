# 29-06-26 Skip & Scaffolding License

> **Confluence ID:** 2090369040 · **Version:** 1 · **Last updated:** 2026-06-29T10:43:42.039Z
> **Path:** MOM - Apply IQ
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/2090369040/29-06-26+Skip+Scaffolding+License

---

[Apply for temporary structure licence - RBK - Licence type - Self](https://kingston-self.achieveservice.com/service/Apply_for_a_temporary_structure_licence_in_Kingston)

[Highways Licence Application | Licence Application – London Borough of Barnet](https://myforms.barnet.gov.uk/xfp/form/126)

# **Minutes of Meeting (MoM)**

### **Meeting Title:** [Permission System - Discussion with Jo](https://teams.microsoft.com/l/meetup-join/19%3ameeting_ZDNiZDEyYzYtNDYyZS00ZDJjLThiZjAtNGE2ZWY1ZTAwMzhi%40thread.v2/0?context=%7b%22Tid%22%3a%223734172a-e82a-4ac7-a3d3-02949970d5e6%22%2c%22Oid%22%3a%223fc51c78-f738-456f-a9ca-3221b8cea8f9%22%7d) [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3tVxXOlAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)

### **Date & Time:** Today, 3:00 PM – 3:30 PM [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3tVxXOlAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)

### **Organizer:** Gowtham K

### **Meeting Type:** Weekly Recurring Discussion

### **Transcript Availability:** Yes (transcribed)

* * *

# **Attendees**

-   Prathiba K
    
-   Joanne Archer
    
-   Pugazh Vaanan.V
    

* * *

# **Agenda**

-   Review of **Licensing module** (Skip & Scaffolding)
    
-   Identify **configuration gaps in staging**
    
-   Understand **application workflow & pricing models**
    
-   Define **inspection, deposit, and refund process**
    
-   Discuss **future enhancements & system behavior**
    

* * *

# **Detailed Discussion Summary**

## **1\. Licensing Configuration Issues**

-   Skip and scaffolding license types were **not available in the dropdown due to missing configuration**.
    
-   It was confirmed that:
    
    -   Licensing types must be **configured in the back office**, similar to permits.
        
    -   The issue may be due to a **recent staging release breaking existing configurations**.
        
-   Action proposed:
    
    -   Configure at least **two sample permission types** (skip & scaffolding) for testing.
        

* * *

## **2\. Licensing Templates & Structure**

-   Decision to use:
    
    -   **Common template approach**
        
    -   Separate templates for:
        
        -   Market licensing
            
        -   Payment licensing
            
        -   Skip & Scaffolding (shared template)
            

* * *

## **3\. Scaffolding License – Application Flow**

### **Applicant Context**

-   Application is submitted by:
    
    -   **Scaffolding company (business account)**, not residents.
        

### **Application Sections (as discussed in transcript)**

-   Applicant details (pre-populated)
    
-   Business details (mandatory if enabled)
    
-   Location selection:
    
    -   Map-based OR street-based selection
        
-   Work description (e.g., roof replacement)
    
-   Start & end dates
    
-   Document upload:
    
    -   Insurance details (mandatory)
        

* * *

## **4\. Mandatory Data Requirements**

-   Third-party liability insurance:
    
    -   **Mandatory for scaffolding license submission**
        
-   Required fields are **not optional** for this license type.
    

* * *

## **5\. Pricing Model Discussion**

Pricing varies across councils:

### **Supported Pricing Types Identified**

-   **Flat Fee** (e.g., fixed price for 28 days)
    
-   **Per Day Pricing** (based on duration)
    
-   **Tier-based Pricing** (based on road type or size)
    

### **Additional Charges Identified**

-   Inspection Fee (acts like admin fee)
    
-   Deposit Fee (refundable after inspection)
    

### **Key Behaviour**

-   If **flat fee** is configured:
    
    -   Same charge applies regardless of actual days selected (within period).
        
-   If not:
    
    -   Pricing is calculated based on **duration/days**.
        

* * *

## **6\. Deposit & Refund Logic**

-   Deposit is:
    
    -   Collected during application submission.
        

### **Refund Scenarios**

-   **Full Refund:** No damages
    
-   **Partial Refund:** Based on damage cost
    
-   Example logic:
    
    -   Deposit = 400
        
    -   Damage = 10 → Refund = 390
        
    -   Damage = 300 → Refund = 100
        

### **System Requirement**

-   Back office must support:
    
    -   Full / Partial refund selection
        
    -   Manual refund amount entry
        
    -   Reason capture
        

* * *

## **7\. Inspection Process**

### **Flow**

-   After license period ends:
    
    -   Application moves to **inspection status**
        
-   Inspection is:
    
    -   Conducted by **highways inspectors (not CEOs)**
        

### **System Capabilities Needed**

-   Upload:
    
    -   Inspection reports
        
    -   Photos
        
    -   Documents
        
-   Add notes to case
    
-   Optional:
    
    -   Handheld device integration (future possibility)
        

### **Two Possible Flows**

1.  **With handheld device**
    
    -   Task assigned → inspector completes → auto upload
        
2.  **Without handheld device**
    
    -   Manual upload of documents & photos
        

* * *

## **8\. Payment Handling**

-   Online payment preferred:
    
    -   Required for deposit & refund processing
        
-   Offline (invoice-based) possible:
    
    -   Refund handled outside system
        
    -   System only records refund status
        

* * *

## **9\. Application Workflow Behaviour**

-   Submission flow:
    
    -   Submit → Pending Approval → Approval/Rejection
        
-   Post approval:
    
    -   License becomes active
        

### **Restrictions Identified**

-   Disable:
    
    -   Change Zone
        
    -   Change Address
        

* * *

## **10\. Renewal & Extension Handling**

-   Both supported:
    
    -   **Renewal:** New license period
        
    -   **Extension:** Extend usage dates
        

### **Rules**

-   Cannot extend beyond license validity
    
-   If exceeded:
    
    -   Must **renew (new license cycle)**
        

* * *

## **11\. Functional Gaps Identified**

-   Missing configuration for:
    
    -   License types (skip, scaffolding)
        
-   Broken staging behavior:
    
    -   Tabs not loading
        
    -   Submission failure
        
-   Lack of:
    
    -   Defined inspection workflow
        
    -   Handheld integration clarity
        

* * *

## **12\. Key Decisions**

-   Introduce:
    
    -   Deposit + inspection fee models
        
-   Build:
    
    -   Flexible pricing configurations
        
-   Enable:
    
    -   Inspection recording capabilities
        
-   Support:
    
    -   Both automated & manual inspection flows
        

* * *

# **Action Items**

#

Action

Owner

1

Configure skip & scaffolding licensing types in staging

Team

2

Investigate and fix staging issues (dropdown, tabs)

Tech Team

3

Define configurable pricing model (flat + variable)

BA + Tech

4

Design deposit & refund workflow in BO

BA + Dev

5

Enable inspection status & documentation upload

Dev Team

6

Define handheld vs manual inspection flow

Product/BA

7

Validate required fields using real council references

BA

* * *

# **Next Steps**

-   Continue discussion in next session to:
    
    -   Finalize pricing configuration
        
    -   Detail inspection workflow
        
    -   Confirm UI/UX for licensing module