# 01-04-26 Discussion on Permission System: Pricing Configuration, Cloning Issues, and Compliance Concerns

> **Confluence ID:** 1995571221 · **Version:** 1 · **Last updated:** 2026-05-27T11:10:59.465Z
> **Path:** MOM - Apply IQ
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/1995571221/01-04-26+Discussion+on+Permission+System+Pricing+Configuration+Cloning+Issues+and+Compliance+Concerns

---

**Meeting Title:** Permission System – Discussion with Jo  
**Source:** Teams Meeting (Transcript available) [\[Permission...Recording | Video\]](https://nsl365-my.sharepoint.com/personal/gowtham_kandasamy_logicvalley_in/Documents/Recordings/Permission%20System%20-%20Discussion%20with%20Jo-20260401_093624UTC-Meeting%20Recording.mp4)

### Attendees

-   Joanne Archer
    
-   Natarajan Arumugam
    
-   Pugazh Vaanan V
    

_(Attendance based on meeting speakers listed in the transcript; invitees not assumed)_ [\[Permission...Recording | Video\]](https://nsl365-my.sharepoint.com/personal/gowtham_kandasamy_logicvalley_in/Documents/Recordings/Permission%20System%20-%20Discussion%20with%20Jo-20260401_093624UTC-Meeting%20Recording.mp4)

* * *

## Agenda

-   Review **Pricing configuration behaviour** in the Permission System
    
-   Validate **user story vs system behaviour**
    
-   Discuss issues with **cloning pricing**, **date handling**, and **pre‑programmable pricing**
    

* * *

## Key Discussion Points

### 1\. Pricing Change & Pre‑Programmable Pricing

-   Joanne reiterated the requirement that pricing must be **pre‑programmable**, allowing future price changes with defined start and end dates (e.g., different prices across financial years).
    
-   The system is currently **not switching prices automatically** based on configured date ranges as expected.
    
-   There is a concern that the system was **not built as per the original user story** provided to development. [\[Permission...Recording | Video\]](https://nsl365-my.sharepoint.com/personal/gowtham_kandasamy_logicvalley_in/Documents/Recordings/Permission%20System%20-%20Discussion%20with%20Jo-20260401_093624UTC-Meeting%20Recording.mp4)
    

* * *

### 2\. Pricing Clone Issue (Same Permission Type & Sub‑Type)

-   Joanne attempted to **clone an existing pricing** to create a new pricing for the same permission type and sub‑type with:
    
    -   A new price
        
    -   A new effective date range
        
-   The system throws an error:  
    **“The pricing entry with this configuration already exists.”**
    
-   Developers indicated that cloning only works if the **permission sub‑type is changed**, which Joanne explicitly does **not want**.
    
-   The original user story states:
    
    -   Permission Type and Sub‑Type **must remain the same**
        
    -   Only **Pricing Name** should be unique
        
    -   Start / End dates should differ
        
-   Conclusion: **Implementation does not match the user story**. [\[Permission...Recording | Video\]](https://nsl365-my.sharepoint.com/personal/gowtham_kandasamy_logicvalley_in/Documents/Recordings/Permission%20System%20-%20Discussion%20with%20Jo-20260401_093624UTC-Meeting%20Recording.mp4)
    

* * *

### 3\. Start Date / End Date Restrictions (Past Dates)

-   Joanne highlighted that:
    
    -   Existing pricing records (especially Southend) were created **without start/end dates**.
        
    -   To introduce a new pricing, the **current pricing must end the day before** the new pricing starts.
        
-   The system **does not allow selection of past dates**, preventing:
    
    -   Closing an existing pricing retrospectively (e.g., ending yesterday)
        
    -   Activating a new pricing from today
        
-   This blocks correction of live pricing issues when releases are delayed.
    
-   Agreement that the system **must allow past dates** for pricing end/start in such scenarios. [\[Permission...Recording | Video\]](https://nsl365-my.sharepoint.com/personal/gowtham_kandasamy_logicvalley_in/Documents/Recordings/Permission%20System%20-%20Discussion%20with%20Jo-20260401_093624UTC-Meeting%20Recording.mp4)
    

* * *

### 4\. Testing & Spec Compliance Concern

-   Joanne questioned how the current behaviour **passed testing**, given it does not align with the agreed user story.
    
-   Team acknowledged:
    
    -   The story wording was correct
        
    -   Behaviour needs to be reviewed with development and testing teams [\[Permission...Recording | Video\]](https://nsl365-my.sharepoint.com/personal/gowtham_kandasamy_logicvalley_in/Documents/Recordings/Permission%20System%20-%20Discussion%20with%20Jo-20260401_093624UTC-Meeting%20Recording.mp4)
        

* * *

## Decisions

-   ✅ Confirmed that **permission type and sub‑type should not be forced to change** when cloning pricing.
    
-   ✅ Confirmed that **pre‑programmable pricing** with future dates is a valid and required behaviour.
    
-   ✅ Identified that the system is **not compliant with the approved user story**. [\[Permission...Recording | Video\]](https://nsl365-my.sharepoint.com/personal/gowtham_kandasamy_logicvalley_in/Documents/Recordings/Permission%20System%20-%20Discussion%20with%20Jo-20260401_093624UTC-Meeting%20Recording.mp4)
    

* * *

## Action Items

Action

Owner

Review pricing user story vs implementation and identify gaps

Natarajan / Pugazh

Discuss cloning restriction (same permission type & sub‑type) with dev team

Pugazh

Enable **past date selection** for pricing start/end dates

Dev Team

Fix pricing configuration to support **sequential pricing schemes** (old ends → new starts)

Dev Team

Share FRD links for Dispensation & Suspension and request approval

Natarajan

Review and approve FRDs on Confluence (post Southend pricing update)

Joanne

[\[Permission...Recording | Video\]](https://nsl365-my.sharepoint.com/personal/gowtham_kandasamy_logicvalley_in/Documents/Recordings/Permission%20System%20-%20Discussion%20with%20Jo-20260401_093624UTC-Meeting%20Recording.mp4)

* * *

## Risks / Open Issues

-   Live councils (e.g., Southend) cannot correct pricing if releases are delayed.
    
-   Incorrect pricing may continue to apply if historical pricing cannot be ended.
    
-   Further releases may be blocked if pricing logic remains non‑compliant.