# 29-06-26 Southend Visitor Scratchcards Meeting Minutes: Implementation Approach and Key Discussion Points

> **Confluence ID:** 2090173160 · **Version:** 1 · **Last updated:** 2026-06-29T13:12:42.220Z
> **Path:** MOM - Apply IQ
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/2090173160/29-06-26+Southend+Visitor+Scratchcards+Meeting+Minutes+Implementation+Approach+and+Key+Discussion+Points

---

# **Minutes of Meeting (MoM)**

**Meeting:** [Southend Visitor Scratchcards](https://teams.microsoft.com/l/meetup-join/19%3ameeting_MWQ2NjA3NWEtOWJhNS00ZjM3LThjMWItZjJhMmI0ZDQ5NTdj%40thread.v2/0?context=%7b%22Tid%22%3a%223734172a-e82a-4ac7-a3d3-02949970d5e6%22%2c%22Oid%22%3a%222b579230-cfef-4e9f-9054-a63ee22eaeca%22%7d)  
**Date:** Today (as per meeting record)  
**Organizer:** Ashok Kumar M [\[Southend V...ratchcards | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAANqOgt5AAA%3d)

* * *

## **1\. Objective**

-   Discuss implementation approach for Southend visitor scratchcards, including printing, serial number handling, and system integration with Integrity. [\[Southend V...ratchcards | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAANqOgt5AAA%3d)
    

* * *

## **2\. Key Discussion Points**

### **2.1 Scratchcard Format & Printing Approach**

-   Scratchcards will be **physical booklets (20 cards per booklet)**. [\[Southend V...ratchcards | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAANqOgt5AAA%3d)
    
-   Integrity will:
    
    -   Print scratchcard booklets
        
    -   Distribute them to customers
        
    -   Send confirmation files after dispatch [\[Southend V...ratchcards | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAANqOgt5AAA%3d)
        
-   Data will be shared via **CSV file (similar to stat docs process in Notice IQ)**. [\[Southend V...ratchcards | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAANqOgt5AAA%3d)
    

* * *

### **2.2 Required Fields / Merge Data**

The following fields were identified for inclusion in the CSV file:

-   Zone name
    
-   Serial number range for booklet (start and end)
    
-   Individual scratchcard serial numbers
    
-   Product reference (optional / may be removed or mapped to application reference) [\[Southend V...ratchcards | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAANqOgt5AAA%3d)
    

* * *

### **2.3 Serial Number Handling**

-   Serial numbers are **not pre-printed**, discussion raised concerns about this approach. [\[Southend V...ratchcards | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAANqOgt5AAA%3d)
    
-   System may need to:
    
    -   Generate serial numbers internally
        
    -   Ensure uniqueness (no duplication over long contract durations) [\[Southend V...ratchcards | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAANqOgt5AAA%3d)
        
-   Logic considerations:
    
    -   Sequential allocation
        
    -   Handling concurrent applications
        
    -   Handling long-term volume (potentially unlimited range) [\[Southend V...ratchcards | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAANqOgt5AAA%3d)
        

* * *

### **2.4 Integration & File Handling**

-   CSV file will be sent to Integrity via **SFTP**. [\[Southend V...ratchcards | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAANqOgt5AAA%3d)
    
-   Integrity will return a **confirmation file** containing dispatched records. [\[Southend V...ratchcards | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAANqOgt5AAA%3d)
    
-   System requirement:
    
    -   Attach confirmation file to permit/application
        
    -   Support ingestion of returned file for updates [\[Southend V...ratchcards | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAANqOgt5AAA%3d)
        

* * *

### **2.5 System Workflow Impact (Apply & NPS)**

Key system challenges identified:

-   Scratchcards currently treated as **physical permits → go to print queue**
    
-   New approach requires:
    
    -   **Bypassing print workflow**
        
    -   Introducing **alternative application status (instead of “Print”)** [\[Southend V...ratchcards | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAANqOgt5AAA%3d)
        

Proposed changes:

-   Introduce **new application status** (e.g., batch sent / pending confirmation)
    
-   Update audit trail:
    
    -   Record batch sent details
        
    -   Record confirmation receipt
        

* * *

### **2.6 Configuration Requirements**

-   Need for **toggle configuration** in contract settings to support:
    
    -   Integration-based scratchcard flow (Southend model)
        
    -   Existing manual/local issuance flow (other councils) [\[Southend V...ratchcards | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAANqOgt5AAA%3d)
        

* * *

### **2.7 Reporting Requirement**

-   Separate CR exists for **scratchcard issuance reporting**. [\[Southend V...ratchcards | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAANqOgt5AAA%3d)
    
-   Requirement: track number of scratchcards issued.
    

* * *

### **2.8 Alternative Solution Discussion**

Two possible approaches identified:

1.  **CSV + Integrity printing (new approach)**
    
    -   Requires system changes and impact assessment
        
2.  **Existing approach (cover letter + booklet handling by council)**
    
    -   Simpler implementation
        
    -   Less system change
        

* * *

## **3\. Decisions**

-   No final implementation approach confirmed. [\[Southend V...ratchcards | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAANqOgt5AAA%3d)
    
-   Further validation required with Integrity and client before finalizing.
    

* * *

## **4\. Action Items**

Action

Owner

Status

Confirm serial number handling approach with Integrity

Nicholas Skelton

Pending

Update Change Request with detailed requirements

Joanne Archer

In Progress

Perform impact assessment and propose solutions

BA/Dev Team

Pending

Validate product reference field usage with client

Team

Pending

Confirm CSV file structure including application reference

Team

Pending

Share requirements and proceed with user story creation

Joanne Archer / Prathiba K

Planned

* * *

## **5\. Next Steps**

-   Gather clarified requirements from Integrity and Southend client.
    
-   Finalize implementation approach (CSV vs standard flow).
    
-   Prepare user stories for development after impact assessment.