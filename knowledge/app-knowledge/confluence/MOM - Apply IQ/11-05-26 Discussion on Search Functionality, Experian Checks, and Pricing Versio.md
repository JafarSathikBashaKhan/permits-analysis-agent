# 11-05-26 Discussion on Search Functionality, Experian Checks, and Pricing Version History

> **Confluence ID:** 1995964430 · **Version:** 1 · **Last updated:** 2026-05-27T09:47:26.795Z
> **Path:** MOM - Apply IQ
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/1995964430/11-05-26+Discussion+on+Search+Functionality+Experian+Checks+and+Pricing+Version+History

---

**Meeting Title:** [Permission System - Discussion with Jo](https://teams.microsoft.com/l/meetup-join/19%3ameeting_ZDNiZDEyYzYtNDYyZS00ZDJjLThiZjAtNGE2ZWY1ZTAwMzhi%40thread.v2/0?context=%7b%22Tid%22%3a%223734172a-e82a-4ac7-a3d3-02949970d5e6%22%2c%22Oid%22%3a%223fc51c78-f738-456f-a9ca-3221b8cea8f9%22%7d)  
**Date:** May 11, 2026  
**Time:** 3:00 PM – 3:30 PM  
**Organizer:** Gowtham K [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3q7wPquAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)

* * *

## **Attendees**

-   Joanne Archer
    
-   Prathiba K
    
-   Pugazh Vaanan.V
    
-   Natarajan Arumugam  
    _(Others invited but not listed here as participation cannot be assumed from invite list)_
    

* * *

## **Agenda / Discussion Points**

### 1\. **Search Functionality Enhancement (Permit & Applicant Screens)**

-   Issue raised: Search results are not retained when navigating back from an application. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3q7wPquAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
    
-   Requirement:
    
    -   Retain search results after navigating back.
        
    -   Provide a “clear search” option.
        
-   Scope:
    
    -   Priority: Permit search & Applicant screens.
        
    -   Also consider Builder and other search screens (if feasible). [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3q7wPquAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

* * *

### 2\. **Experian Check Configuration**

-   Clarified that:
    
    -   Experian is an API-based validation, not a document. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3q7wPquAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        
    -   Two types of checks:
        
        -   Proof of Residency
            
        -   Proof of Business [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3q7wPquAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
            
-   Key requirements:
    
    -   Ability to associate Experian checks with specific document types.
        
    -   Configuration settings to control:
        
        -   Pass score threshold
            
        -   Lookup limits
            
    -   Mandatory vs optional behaviour:
        
        -   Mandatory for some clients (e.g., Lewisham).
            
        -   Optional for others (e.g., Edinburgh). [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3q7wPquAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
            
-   Outcome:
    
    -   System must support both mandatory and optional configurations.
        

* * *

### 3\. **Pricing Version History**

-   Challenge discussed:
    
    -   Pricing involves multi-level hierarchy (date range → duration → price/band).
        
    -   Capturing and displaying all changes is complex. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3q7wPquAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        
-   Key expectations:
    
    -   User should see:
        
        -   What changed
            
        -   When it changed
            
        -   Who changed it
            
    -   Version history should be easy for back-office users.
        
-   Concern:
    
    -   Changes made in pricing menu may not be captured in builder version history. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3q7wPquAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        
-   Decision:
    
    -   Discuss with architects/developers to implement a unified version history approach.
        

* * *

### 4\. **Future / Low Priority Items**

-   Oxford & Reading bid-related permit stories:
    
    -   Marked for later development (not immediate priority). [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3q7wPquAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        
-   Staff permits:
    
    -   Pending discussion with East Sussex council.
        
    -   Not part of initial rollout. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3q7wPquAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

* * *

### 5\. **Email Change Feature**

-   Proposal:
    
    -   Introduce alternative email instead of changing login email.
        
-   Concern raised:
    
    -   Users losing access to primary email may not receive communications.
        
-   Outcome:
    
    -   Joanne Archer to review and discuss further before decision. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3q7wPquAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

* * *

### 6\. **Suspension FRD Approval**

-   Topic:
    
    -   Updated FRD version (v1.1) for suspension flow changes.
        
-   Discussion:
    
    -   Development already completed and demoed.
        
    -   Question raised on need for approval post-development.
        
-   Clarification:
    
    -   Approval mainly for documentation traceability, not development sign-off. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3q7wPquAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
        

* * *

## **Decisions Made**

-   Search result retention to be implemented (priority screens first).
    
-   Experian check:
    
    -   Must support both mandatory and optional modes.
        
-   Pricing version history:
    
    -   To be finalized after technical discussion with architects.
        
-   Oxford/Reading and Staff permit items:
    
    -   Deferred to later stages.
        

* * *

## **Action Items**

#

Action

Owner

Status

1

Define and implement search result retention logic

Prathiba K / Dev team

Open

2

Design Experian configuration (mandatory/optional + document mapping)

Dev team

Open

3

Discuss pricing version history approach with architects

Pugazh Vaanan.V / Dev team

Open

4

Review email change proposal and provide confirmation

Joanne Archer

Pending

5

Confirm approach for version history consolidation

Dev team

Open

* * *

## **Open Questions**

-   Final approach to unify pricing version history across builder and pricing menu.
    
-   Email change vs alternative email handling strategy.