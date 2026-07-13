# 25-06-26 Permission System Meeting: Licensing, Change Vehicle Functionality, and Payment Handling Discussion

> **Confluence ID:** 2079621159 · **Version:** 2 · **Last updated:** 2026-06-25T12:40:57.596Z
> **Path:** MOM - Apply IQ
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/2079621159/25-06-26+Permission+System+Meeting+Licensing+Change+Vehicle+Functionality+and+Payment+Handling+Discussion

---

## **Meeting Details**

Field

Details

**Meeting Title**

Permission System – Discussion with Jo

**Date**

Today

**Time**

3:00 PM – 3:30 PM

**Organizer**

Gowtham K

**Participants**

Prathiba K, Joanne Archer, Pugazh Vaanan.V

**Meeting Type**

Weekly Recurring

**Transcript**

Available (Meeting Transcribed)

* * *

## **Agenda**

1.  Licensing backlog and requirements
    
2.  Change vehicle functionality (documents & payment)
    
3.  Basket/payment logic
    
4.  Emission-based pricing scenarios
    
5.  Tax band validation
    
6.  Experian integration
    

* * *

## **Discussion Summary**

* * *

### **1\. Licensing Requirements**

-   Licensing feature **needs to be developed**, but:
    
    -   No detailed backlog stories available
        
    -   No complete requirement specification
        
-   Dependency:
    
    -   Waiting for **Lewisham data access**
        
-   Update:
    
    -   Joanne Archer will review recent bids and share requirements
        

✅ **Conclusion:**  
Proceed with current knowledge; refine requirements once inputs are available

* * *

### **2\. Change Vehicle Functionality**

* * *

#### **2.1 Current Implementation**

-   Available:
    
    -   At **application level**
        
-   Not available:
    
    -   At **applicant account level**
        

* * *

#### **2.2 Document Handling**

-   Only **vehicle-related documents** required
    
-   Non-relevant documents:
    
    -   Proof of residency ❌
        
-   Document source:
    
    -   Collected at **vehicle level**
        
-   Upload behaviour:
    
    -   Should support **mandatory / optional** configuration
        

* * *

#### **2.3 Multi-Application Scenario (Key Complexity)**

**Problem:**

-   One vehicle linked to multiple applications:
    
    -   Different document counts
        
    -   Different payment setups
        

**Final Decision:**

-   Use:
    
    -   Common **vehicle document type**
        
-   Document count:
    
    -   Take **maximum count across all permissions**
        
-   Allocation logic:
    
    -   If **V5 doc uploaded → prioritize it**
        
    -   Else → use **upload sequence order**
        

* * *

#### **2.4 Builder Configuration**

-   Remove:
    
    -   ✅ Change vehicle-specific document column
        
-   Retain:
    
    -   ✅ Vehicle document type
        
    -   ✅ Document count configuration
        
-   Behaviour:
    
    -   Same rules apply for:
        
        -   Purchase
            
        -   Change vehicle
            

* * *

### **3\. Payment Handling – Change Vehicle**

* * *

#### **Key Rules**

-   Only **online payment supported**:
    
    -   Registered card / New card
        
-   Independent of:
    
    -   Original payment method
        

* * *

#### **Payment Workflow**

Scenario

Behaviour

Pre-auth available

Use tokenized card

No saved card

Prompt for card details

Approval flow

Payment captured after approval

* * *

### **4\. Basket / Payment Approach**

-   Basket supports:
    
    -   Multiple applications
        
    -   Multiple payment types
        
-   Functionality:
    
    -   Select payment method → filter applicable applications
        

✅ **Decision:**  
Basket approach is **accepted and validated**; reusable for similar scenarios

* * *

### **5\. Emission-Based Pricing**

* * *

#### **Applicability**

Feature

Applicability

Permit

✅ Applicable

Car Park Template

✅ Applicable

Dispensation

✅ Conditional

Suspension Template

❌ Not applicable

Licensing

❌ Not applicable

* * *

#### **Special Cases**

**Visitor / Scratch Cards:**

-   No vehicle input during purchase
    
-   Requirement:
    
    -   Add toggle:
        
        -   Standard pricing
            
        -   Emission-based pricing
            

* * *

**Exemptions:**

-   Usually free
    
-   Issue:
    
    -   Currently requires setting all bands to 0
        
-   Suggested improvement:
    
    -   Add toggle:
        
        -   Flat fee
            
        -   Emission pricing
            

* * *

### **6\. Tax Band Validation**

-   Must follow:
    
    -   **Sequential order**
        
    -   **No overlap allowed**
        

**Example:**

-   Band 1 → 0–100
    
-   Band 2 → Starts from 101
    

* * *

#### **Types of Tax Bands**

Type

Behaviour

DVLA

Common across contracts

Custom

Contract-specific

* * *

### **7\. Experian Integration**

-   Requirement:
    
    -   API needed for integration
        
-   Dependency:
    
    -   Product confirmation pending
        

**Owner Update:**

-   Joanne Archer to:
    
    -   Confirm product decision
        
    -   Share API details
        

* * *

## **Decisions Summary**

-   Licensing → Proceed with gradual refinement
    
-   Change vehicle:
    
    -   Online payment only
        
    -   Common document logic
        
    -   Max document count approach
        
-   Remove change vehicle document config column
    
-   Basket → Accepted
    
-   Pricing → Introduce toggles (emission vs standard / flat fee)
    
-   Tax band → Must be sequential
    

* * *

## **Action Items**

#

Action

Owner

1

Share licensing requirements from recent bids

Joanne Archer

2

Confirm Experian product & share API details

Joanne Archer

3

Prepare and share DVLA tax band list

Prathiba K

4

Update user stories with agreed logic

Prathiba K

5

Implement basket/payment approach where applicable

Pugazh Vaanan.V

* * *

## **Risks / Open Points**

-   Licensing requirements not fully defined
    
-   Dependency on external data (Lewisham)
    
-   Experian API confirmation pending