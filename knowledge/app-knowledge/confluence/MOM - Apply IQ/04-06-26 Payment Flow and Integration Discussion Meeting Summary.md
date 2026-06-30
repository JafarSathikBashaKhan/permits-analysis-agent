# 04-06-26 Payment Flow and Integration Discussion Meeting Summary

> **Confluence ID:** 2018836569 · **Version:** 2 · **Last updated:** 2026-06-05T05:42:49.171Z
> **Path:** MOM - Apply IQ
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/2018836569/04-06-26+Payment+Flow+and+Integration+Discussion+Meeting+Summary

---

**Meeting:** [Payments](https://teams.microsoft.com/l/meetup-join/19%3ameeting_NDFkMjVhNzMtMDE2Ni00ODJmLWE1NGEtOTVkMDMwYmFhNDU2%40thread.v2/0?context=%7b%22Tid%22%3a%223734172a-e82a-4ac7-a3d3-02949970d5e6%22%2c%22Oid%22%3a%22944cc1d5-cb4f-443e-b154-5e0cb4140597%22%7d)  
**Date & Time:** Today, 5:30 PM – 6:00 PM  
**Organizer:** Joanne Archer  
**Attendees (key participants):** Joanne Archer, Radu Scripnic, Mark Clough, Pugazh Vaanan.V, Sureshsankar, Prathiba K and team  
**Meeting Type:** Payment flow & integration discussion  
**Transcript Availability:** Yes (transcribed meeting) [\[Payments | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAALbNjKHAAA%3d)

* * *

## **1\. Objective**

-   To clarify payment flow, pre-authorization logic, recurring payment handling, and API integration with Key IVR.
    
-   To address implementation queries raised by the development team.
    

* * *

## **2\. Key Discussion Points**

### **2.1 Payment Flow & Pre-Authorization**

-   Payment is initiated at the end of application submission.
    
-   Current approach:
    
    -   A **£1 (or minimal amount) pre-authorization** is performed. [\[Payments | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAALbNjKHAAA%3d)
        
    -   If **amount = 0 → only tokenization/verification**. [\[Payments | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAALbNjKHAAA%3d)
        
    -   If **amount > 0 → amount is captured immediately**. [\[Payments | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAALbNjKHAAA%3d)
        
-   Card details are collected on the **Key IVR payment page**, not within Apply. [\[Payments | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAALbNjKHAAA%3d)
    

* * *

### **2.2 Client-Specific Payment Handling**

-   Behaviour varies by client:
    
    -   Standard flow: pre-authorization followed by capture on approval.
        
    -   **Lewisham exception:**
        
        -   Full amount is taken upfront for specific cases (e.g., deferred evidence flow). [\[Payments | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAALbNjKHAAA%3d)
            
-   Requirement: payment behaviour must be **configurable per client**. [\[Payments | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAALbNjKHAAA%3d)
    

* * *

### **2.3 Tokenization & Card Handling**

-   On successful payment/pre-auth:
    
    -   Token, expiry date, and card details (last 4 digits) are returned. [\[Payments | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAALbNjKHAAA%3d)
        
-   Token is stored in Apply and reused for:
    
    -   Recurring payments
        
    -   Future transactions
        

* * *

### **2.4 Recurring Payment Plan**

-   Payment plans (e.g., monthly installments):
    
    -   Stored and managed in **Apply system**. [\[Payments | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAALbNjKHAAA%3d)
        
    -   Key IVR does **not manage plans** (only payment execution). [\[Payments | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAALbNjKHAAA%3d)
        
-   Flow:
    
    -   First payment taken during approval.
        
    -   Remaining payments executed via **scheduled job (daily check)**. [\[Payments | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAALbNjKHAAA%3d)
        
-   Job responsibilities:
    
    -   Check due payments
        
    -   Trigger API using stored token
        
-   Payment calculation:
    
    -   If total is not divisible equally → **first installment slightly higher**. [\[Payments | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAALbNjKHAAA%3d)
        

* * *

### **2.5 Retry & Failure Handling**

-   Current behavior:
    
    -   System retries failed payments automatically. [\[Payments | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAALbNjKHAAA%3d)
        
    -   No confirmed limit in existing system; may retry until success. [\[Payments | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAALbNjKHAAA%3d)
        
-   Suggested approach:
    
    -   Configurable retry logic (e.g., limited attempts). [\[Payments | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAALbNjKHAAA%3d)
        
-   Alternative approach referenced:
    
    -   Retry multiple times (same day + next day) before cancelling plan. [\[Payments | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAALbNjKHAAA%3d)
        

* * *

### **2.6 Payment Failure Scenarios**

-   If payment fails:
    
    -   Status moves to **“Waiting for Payment”**. [\[Payments | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAALbNjKHAAA%3d)
        
    -   Customer is notified. [\[Payments | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAALbNjKHAAA%3d)
        
-   If card expired:
    
    -   Customer must:
        
        -   Log in
            
        -   Add a new card
            
        -   Re-tokenize
            
-   If repeated failures:
    
    -   Permit moves to **“Due to be Closed” → eventually cancelled**. [\[Payments | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAALbNjKHAAA%3d)
        
-   **No penalty charges** applied to customer. [\[Payments | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAALbNjKHAAA%3d)
    

* * *

### **2.7 Notification Requirements**

-   System must notify customer for:
    
    -   Successful payment
        
    -   Failed payment
        
-   Notifications triggered based on Key IVR response. [\[Payments | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAALbNjKHAAA%3d)
    

* * *

### **2.8 API & Integration**

-   Same API used for:
    
    -   One-time payments
        
    -   Recurring payments
        
-   Two types of interaction:
    
    1.  **UI-based (redirect to payment page)**
        
    2.  **API-based (token + amount for recurring payments)** [\[Payments | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAALbNjKHAAA%3d)
        
-   Webhooks are used to return:
    
    -   Payment status
        
    -   Token details
        

* * *

### **2.9 UI / Redirection**

-   Card entry always on **Key IVR hosted page**. [\[Payments | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAALbNjKHAAA%3d)
    
-   After payment:
    
    -   Redirect back to Apply:
        
        -   Success page OR
            
        -   Failure page
            
-   For “Save card only”:
    
    -   Show confirmation (card saved / validation failed).
        

* * *

### **2.10 Data Storage**

-   Apply system must store:
    
    -   Payment plans
        
    -   Payment schedule
        
    -   Token details
        
-   UI example discussed:
    
    -   Payment plan view (monthly schedule + status per installment). [\[Payments | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAALbNjKHAAA%3d)
        

* * *

## **3\. Decisions**

-   Payment plans will be **managed in Apply**, not Key IVR. [\[Payments | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAALbNjKHAAA%3d)
    
-   A **scheduled job must be implemented** to handle recurring payments. [\[Payments | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAALbNjKHAAA%3d)
    
-   Retry logic should be **configurable in new system**. [\[Payments | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAALbNjKHAAA%3d)
    
-   Payment behaviour (pre-auth vs upfront payment) will be **client-specific configurable**. [\[Payments | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgBGAAAAAADxiPDseQOCQbDvwVuWB7Q6BwCR2PjWJY0EQqAvUimoIFKaAAAAAAENAACR2PjWJY0EQqAvUimoIFKaAALbNjKHAAA%3d)
    

* * *

## **4\. Action Items**

#

Action

Owner

1

Implement payment plan storage in Apply

Dev Team

2

Create scheduled job for recurring payments

Dev Team

3

Define configurable retry mechanism for failed payments

BA/Dev

4

Confirm API endpoints for recurring & token payments

Radu Scripnic

5

Validate webhook handling and response mapping

Dev Team

6

Ensure client-level configuration for payment behaviour

BA/Dev

7

Implement customer notifications (success/failure)

Dev Team

* * *

## **5\. Open Questions / Clarifications**

-   Exact retry limit and configuration rules for failed payments.
    
-   Final API endpoint confirmation from Key IVR.
    
-   Choice of scheduling mechanism (replacement for Quartz job in new Apply).