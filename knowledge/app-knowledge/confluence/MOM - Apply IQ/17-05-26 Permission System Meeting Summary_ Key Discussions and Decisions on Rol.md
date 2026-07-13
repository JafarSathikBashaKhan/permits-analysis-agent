# 17-05-26 Permission System Meeting Summary: Key Discussions and Decisions on Role-Based Access and Functionality Reuse

> **Confluence ID:** 1996914715 · **Version:** 1 · **Last updated:** 2026-05-27T10:47:07.781Z
> **Path:** MOM - Apply IQ
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/1996914715/17-05-26+Permission+System+Meeting+Summary+Key+Discussions+and+Decisions+on+Role-Based+Access+and+Functionality+Reuse

---

**Meeting:** [Permission System - Discussion with Jo](https://teams.microsoft.com/l/meetup-join/19%3ameeting_ZDNiZDEyYzYtNDYyZS00ZDJjLThiZjAtNGE2ZWY1ZTAwMzhi%40thread.v2/0?context=%7b%22Tid%22%3a%223734172a-e82a-4ac7-a3d3-02949970d5e6%22%2c%22Oid%22%3a%223fc51c78-f738-456f-a9ca-3221b8cea8f9%22%7d)  
**Date & Time:** April 17, 2026 | 3:00 PM – 3:30 PM  
**Organizer:** Gowtham K  
**Attendees (from transcript):** Joanne Archer, Natarajan Arumugam, Pugazh Vaanan, Prathiba K  
**Meeting Type:** Recurring weekly sync  
**Transcript Availability:** Yes (transcribed) [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pwURMGAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)

* * *

## **1\. Key Discussion Topics**

### **1.1 Permission System / Role-Based Access**

-   Discussion on implementing **role-based menu visibility** in back office.
    
-   Menu and submenu access (view/manage) should be controlled based on **user roles and permissions**.
    
-   Role configuration includes:
    
    -   Role name, description, and type
        
    -   Access control for modules and menu items
        
-   Need for **dynamic role handling** to manage access restrictions effectively. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pwURMGAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
    

* * *

### **1.2 Reuse of Existing Functionality**

-   Joanne Archer suggested:
    
    -   If similar functionality already exists, it should be **reused instead of rebuilt**.
        
-   Action to review existing stories and acceptance criteria before proceeding with new development. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pwURMGAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
    

* * *

### **1.3 Staff Parking – Requirement Clarification**

-   Initial proposal:
    
    -   Single customer portal with **role-based visibility**.
        
    -   Staff users should see additional menus (e.g., staff permits, visitor permits).
        
    -   Public users should not see staff-specific content.
        
-   Challenge identified:
    
    -   Staff parking implementation differs across councils:
        
        -   Lewisham
            
        -   Wokingham
            
        -   East Sussex
            
-   Decision:
    
    -   Further analysis required before finalizing design.
        
    -   Need to ensure **solution works across all councils (generic design)**. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pwURMGAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

* * *

### **1.4 Chatbot Integration**

-   Plan to integrate existing chatbot solution.
    
-   No changes required:
    
    -   Same Q&A set
        
    -   Existing functionality to be reused. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pwURMGAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

* * *

### **1.5 Map Integration (Car Park Feature)**

-   Map integration will be implemented at **contract level**.
    
-   Controlled via configuration toggle:
    
    -   Enable/disable “Manage Car Park” feature per contract. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pwURMGAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

* * *

### **1.6 User Guide Feature (Back Office + Customer Portal)**

#### Back Office:

-   Create and manage user guides with:
    
    -   Name, description, category
        
    -   File types: Document (PDF/PPT), Video, URL
        
-   Features:
    
    -   Draft & Publish states
        
    -   Preview before publishing
        

#### Customer Portal:

-   User guides accessible from profile section
    
-   Display categorized content
    
-   Supported formats:
    
    -   Document preview
        
    -   Video playback
        
    -   URL navigation
        

#### Decisions:

-   Remove unnecessary fields:
    
    -   Views count
        
    -   Published date
        
    -   URL preview section
        
-   Current approach (document-based preview) deemed acceptable. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pwURMGAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
    

* * *

### **1.7 Taxi Companies (Permission Type)**

-   Query raised regarding existing implementation.
    
-   Clarification:
    
    -   No active implementation in current system.
        
    -   Only historical change requests exist (Edinburgh), not developed. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pwURMGAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

* * *

### **1.8 UI/Content Improvements (Lewisham Review)**

-   Review feedback received from Lewisham client.
    
-   Key issue:
    
    -   Use of **internal terminology (e.g., PCN)** without explanation.
        
-   Recommendation:
    
    -   Expand abbreviations for customer clarity  
        (e.g., “PCN (Penalty Charge Notice)”).
        
-   Action:
    
    -   Apply improvements **across the application**. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3pwURMGAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

* * *

## **2\. Decisions Made**

-   Reuse existing functionality wherever available.
    
-   Staff parking requires further analysis before design finalization.
    
-   Chatbot integration to proceed without changes.
    
-   Map integration will be configurable at contract level.
    
-   User guide feature design is approved with minor UI refinements.
    
-   Ensure customer-friendly terminology across the system.
    

* * *

## **3\. Action Items**

#

Action

Owner

Status

1

Share existing stories & acceptance criteria for reuse

Natarajan Arumugam

Pending

2

Review staff parking implementations (3 councils)

Joanne Archer

Pending

3

Analyse staff parking demo (East Sussex recording)

Team

Pending

4

Validate and refine user guide UI changes

Pugazh Vaanan

In Progress

5

Review and apply Lewisham UI/content feedback

Team

Pending

6

Share sample user guide references (guidde tool)

Joanne Archer

Pending

7

Check chatbot integration details with respective team

Natarajan Arumugam

Pending

* * *

## **4\. Risks / Open Points**

-   Staff parking requirements unclear due to **multiple council variations**.
    
-   Lack of existing implementation for **taxi company permission type**.
    
-   Need alignment on **standard UX/content guidelines** across the product.
    

* * *

## **5\. Next Steps**

-   Conduct detailed analysis session for **staff parking design**.
    
-   Review existing system artifacts for reuse opportunities.
    
-   Implement UI/content improvements based on client feedback.