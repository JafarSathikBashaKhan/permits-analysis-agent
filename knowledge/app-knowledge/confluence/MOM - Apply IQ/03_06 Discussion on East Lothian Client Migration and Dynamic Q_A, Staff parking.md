# 03/06 Discussion on East Lothian Client Migration and Dynamic Q/A, Staff parking,MEV,My work items,KeyIVR

> **Confluence ID:** 2018213907 · **Version:** 2 · **Last updated:** 2026-06-09T07:08:15.227Z
> **Path:** MOM - Apply IQ
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/2018213907/03+06+Discussion+on+East+Lothian+Client+Migration+and+Dynamic+Q+A+Staff+parking+MEV+My+work+items+KeyIVR

---

# **Minutes of Meeting (MoM)**

**Meeting Title:** Call with Joanne Archer  
**Participants:** Natarajan Arumugam, Joanne Archer  
**Meeting Type:** Discussion / Requirements Clarification  
**Transcription:** Available (used for details below) [\[Call with...Recording | Video\]](https://nsl365-my.sharepoint.com/personal/natarajan_a_logicvalley_in/Documents/Recordings/Call%20with%20Joanne%20Archer-20260603_171159-Meeting%20Recording.mp4)

Link: [https://teams.microsoft.com/l/meetingrecap?driveId=b%21QK8zJ6b950y6pFTbjMDi9G-zQ7Za\_5ZCiDTwncIRcsv6Xd9ZEINyRbiogzzELoB-&driveItemId=01NAIEAXIJCSD4CGTUKFALPWNL22Z7RPJR&sitePath=https%3A%2F%2Fnsl365-my.sharepoint.com%2F%3Av%3A%2Fg%2Fpersonal%2Fnatarajan\_a\_logicvalley\_in%2FIQAJFIfBGnRRQLfZq9az-L0xAQHmgzmgjlKggP5RxeTMh8s&fileUrl=https%3A%2F%2Fnsl365-my.sharepoint.com%2Fpersonal%2Fnatarajan\_a\_logicvalley\_in%2FDocuments%2FRecordings%2FCall+with+Joanne+Archer-20260603\_171159-Meeting+Recording.mp4%3Fweb%3D1&threadId=19%3A5abe373a-21c1-4c0a-bb9b-096de9a6b5a4\_944cc1d5-cb4f-443e-b154-5e0cb4140597%40unq.gbl.spaces&organizerId=5abe373a-21c1-4c0a-bb9b-096de9a6b5a4&tenantId=3734172a-e82a-4ac7-a3d3-02949970d5e6&callId=4c335fc1-b3f3-486f-affb-8d478a0a5189&threadType=OneOnOneChat&meetingType=Unknown&subType=RecapSharingLink\_RecapCore](https://teams.microsoft.com/l/meetingrecap?driveId=b%21QK8zJ6b950y6pFTbjMDi9G-zQ7Za_5ZCiDTwncIRcsv6Xd9ZEINyRbiogzzELoB-&driveItemId=01NAIEAXIJCSD4CGTUKFALPWNL22Z7RPJR&sitePath=https%3A%2F%2Fnsl365-my.sharepoint.com%2F%3Av%3A%2Fg%2Fpersonal%2Fnatarajan_a_logicvalley_in%2FIQAJFIfBGnRRQLfZq9az-L0xAQHmgzmgjlKggP5RxeTMh8s&fileUrl=https%3A%2F%2Fnsl365-my.sharepoint.com%2Fpersonal%2Fnatarajan_a_logicvalley_in%2FDocuments%2FRecordings%2FCall+with+Joanne+Archer-20260603_171159-Meeting+Recording.mp4%3Fweb%3D1&threadId=19%3A5abe373a-21c1-4c0a-bb9b-096de9a6b5a4_944cc1d5-cb4f-443e-b154-5e0cb4140597%40unq.gbl.spaces&organizerId=5abe373a-21c1-4c0a-bb9b-096de9a6b5a4&tenantId=3734172a-e82a-4ac7-a3d3-02949970d5e6&callId=4c335fc1-b3f3-486f-affb-8d478a0a5189&threadType=OneOnOneChat&meetingType=Unknown&subType=RecapSharingLink_RecapCore)

* * *

## **1\. Key Discussion Topics**

### **1.1 New Client Onboarding – East Lothian**

-   East Lothian is a **new client migrating from Old Apply**.
    
-   Scope includes **permits module only** with no new functionality required.
    
-   Existing features will cover requirements:
    
    -   Resident visitor
        
    -   Carer / essential user permits
        
-   Templates (e.g., car park / non-zonal) can be reused.
    

**Decision:**

-   Include this client in the **migration plan**; no additional feature development needed.
    

* * *

### **1.2 Migration Planning**

-   The client has **recently gone live**, so migration will be scheduled **later in the plan**, not immediately.
    

* * *

### **1.3 Work Queue / My Work Items**

-   Functionality includes:
    
    -   Assign / reassign applications
        
    -   Manage waiting list
        
    -   Back-office workflow handling
        
-   Already exists in both old and new systems.
    

**Clients likely to use:**

-   Lewisham
    
-   Possibly East Sussex
    

**Decision:**

-   Not required for **first five migrations**; needed in later phases.
    

* * *

### **1.4 Dynamic Q&A / Chatbot**

-   No immediate work required for existing clients (data migration only).
    
-   Decision pending discussion with stakeholder (Savit).
    

* * *

### **1.5 Staff Parking (Multiple Clients)**

-   Requirements still being consolidated.
    
-   Joanne to:
    
    -   Review client discussions
        
    -   Prepare detailed requirements and proposed design
        

* * *

### **1.6 Mobile Enforcement Vehicle (MEV)**

-   Required for:
    
    -   Welwyn Garden City (retained contract)
        
-   Current understanding:
    
    -   Vehicle integrates with **Illuminate**, not directly with Apply.
        
    -   Permit data is pushed to Illuminate.
        
    -   Vehicle checks:
        
        -   If permit exists
            
        -   If not → enforcement action triggered
            

**Action:**

-   Further clarification required with **KIVR team** on:
    
    -   Mapping of bays/zones
        
    -   Current implementation approach
        

* * *

### **1.7 Payment Flow**

-   Standard flow (except Lewisham):
    
    -   **Pre-authorization at “Pay Now”**
        
    -   **Full payment captured after approval**
        
-   Issue identified:
    
    -   Payment spec document indicates **immediate charge**, not pre-auth.
        

**Decision:**

-   Clarification required with KIVR.
    

* * *

### **1.8 Payment Plans (Monthly / Quarterly)**

-   Functional requirements exist but:
    
    -   No detailed **technical documentation** available.
        

**Action:**

-   Need tech-level flow including:
    
    -   Auto-debit handling
        
    -   Recurring payment logic
        

* * *

### **1.9 Refund & Emission-Based Pricing**

-   Requirement:
    
    -   Documentation on:
        
        -   Refund calculation logic
            
        -   System workflow (actions, user steps) [\[Call with...Recording | Video\]](https://nsl365-my.sharepoint.com/personal/natarajan_a_logicvalley_in/Documents/Recordings/Call%20with%20Joanne%20Archer-20260603_171159-Meeting%20Recording.mp4)
            
-   Scenario discussed:
    
    -   Vehicle change → price recalculation
        
    -   Refund based on updated pricing [\[Call with...Recording | Video\]](https://nsl365-my.sharepoint.com/personal/natarajan_a_logicvalley_in/Documents/Recordings/Call%20with%20Joanne%20Archer-20260603_171159-Meeting%20Recording.mp4)
        

* * *

### **1.10 Templates / Form Builder (Meeting Chat Insight)**

-   Templates:
    
    -   Created in **Form Builder by developers**
        
    -   Can be modified by users afterward [\[Call with...Recording | Video\]](https://nsl365-my.sharepoint.com/personal/natarajan_a_logicvalley_in/Documents/Recordings/Call%20with%20Joanne%20Archer-20260603_171159-Meeting%20Recording.mp4)
        
-   Creating templates is **not straightforward**. [\[Call with...Recording | Video\]](https://nsl365-my.sharepoint.com/personal/natarajan_a_logicvalley_in/Documents/Recordings/Call%20with%20Joanne%20Archer-20260603_171159-Meeting%20Recording.mp4)
    

* * *

## **2\. Key Decisions Summary**

-   No new functionality required for East Lothian
    
-   Migration to be planned later
    
-   Work queue not needed for initial migrations
    
-   Payment flow needs clarification (pre-auth vs direct charge)
    
-   MEV integration via Illuminate confirmed (not direct Apply integration)
    

* * *

## **3\. Action Items**

#

Action

Owner

1

Add East Lothian to migration plan

Joanne

2

Clarify Dynamic Q&A approach (chatbot vs manual)

Joanne

3

Share staff parking requirements & flow

Joanne

4

Arrange discussion with KIVR for MEV

Joanne

5

Send clarification points on payment flow

Prathiba

6

Get clarity on payment spec (pre-auth vs charge)

Joanne / KIVR

7

Provide payment plan technical documentation

Joanne

8

Share refund calculation + system flow documentation

Joanne

9

Review emission pricing scenarios and update requirements

Prathiba

* * *

## **4\. Risks / Open Questions**

-   Payment flow mismatch between **spec document and actual behavior**
    
-   Lack of technical documentation for:
    
    -   Payment plans
        
    -   Refund processing
        
-   MEV implementation details unclear
    

* * *

## **5\. Next Steps**

-   Share clarification email (payment + flows)
    
-   Conduct follow-up discussions (KIVR / stakeholders)
    
-   Review documentation once available
    
-   Schedule walkthrough for staff parking and MEV