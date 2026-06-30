# Payment Plan Flow

> **Confluence ID:** 2032599118 · **Version:** 13 · **Last updated:** 2026-06-10T12:48:04.797Z
> **Path:** Requirements
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/2032599118/Payment+Plan+Flow

---

### Overview

This document outlines the end-to-end payment plan flow covering application submission, approval, payment processing, and handling of failed payments (with and without grace periods).

* * *

### Step 1 — Application Submission

**Flow:** Customer selects "Pay Monthly" or “Pay Quarterly “→ Show Installment Details → Pre-auth Card → Application Submitted  
**Status:** 🟡 **Pending Approval**

Application menu - Overview tab - Show the installment details and update the payment status on every sucessfull installment basis

* * *

### Step 2 — Application Review & Approval (Success Path)

**Flow:** Review Application → Approve → Token First Installment → Auto Debit → Payment Success  
**Status:** 🟢 **Active**

**System Actions on Success:**

-   **BO:** Payment History updated — first installment details shown with status **Paid**
    
-   **Audit Log:** Entry added to the Audit Log tab
    
-   **Email:** Payment Success email triggered to the customer
    

* * *

### Step 2.1 — First/any Installment Failed (No Grace Period)

**Flow:** First/Any Installment Payment Failed → No Grace Period  
**Status:** 🔴 **Payment Failed**

**System Actions:**

-   **CP:** "Pay" button displayed under My Application should be able to pay the first installment alone
    
-   **BO:** Payment History — first installment details with status **Pending**
    
-   **Audit & Email:** Audit log entry + Payment Failed email triggered
    

**Recovery Path:**

1.  Auto debits retry based on the configuration & Manual payment - Customer pays via "Pay" button on CP
    
2.  Payment History status and Payment Made Date are updated
    
3.  On success → Application moves to 🟢 **Active**
    

* * *

### Step 2.2 — First/any Installment Failed (With Grace Period)

**Flow:** First/Any Installment Failed → Grace Period → 🟠 Waiting for Payment → 🔴 Due to be Closed (if expired) → ⚫ **Cancelled (**Auto cancelled the application)

**System Actions:**

-   **Auto Debit Retry** within the grace period
    
-   **CP:** Manual payment option available when the grace period is breached 🔴 Due to be Closed
    
-   **BO:** Payment History — installment details with status **Pending**
    

**Recovery Path:**

1.  Customer pays manually on CP, or Auto debits retry based on the configuration
    
2.  On success → Application moves to 🟢 **Active**
    
3.  If grace period expires → 🔴 **Due to be Closed**
    
4.  If Closure Period expires → ⚫ **Cancelled**
    

* * *

### Step 2.3 — Reinstate Application

**Flow with Grace Period:** Reinstate Application → Grace Period applies → 🔴 **Due to be Closed** again flows the closure period → ⚫ **Cancelled** if the closure period is breached

**CP:** When the application is in **Due to be Closed** status, the Customer Portal should display the **Pay** button.

**Recovery Path:** Customer uses the Pay button to pay the missed installments. On successful payment, the application moves to 🟢 **Active**.

**Flow without Grace Period:** Reinstate Application → No grace period applies → 🔴 **Payment Failed**

**CP:** When the application is in **Payment Failed** status, the Customer Portal should display the **Pay** button.

**Recovery Path:** Customer uses the Pay button to pay the missed installments. On successful payment, the application moves to 🟢 **Active**.

* * *

### Status Summary

Status

Description

Triggered When

🟡 Pending Approval

Application submitted, awaiting review

After submission

🟢 Active

Payment plan is active

After successful first installment

🔴 Payment Failed

First/Any installment failed, no grace period

Payment fails without grace period

🟠 Waiting for Payment

Grace period active

Payment fails with grace period

🔴 Due to be Closed

Grace period expired

No payment before grace period ends

⚫ **Cancelled**

Closure period expired

Auto cancelled the application

**Key:** CP = Customer Portal | BO = Back Office

1.  **Payment History** — Each installment should have a separate payment entry with a receipt button. Receipt button should be available on the paid status.
    
2.  **Audit Log** — Every payment success, failure, and each installment should be recorded in the audit log tab.
    
3.  **Note** — If any installment is made apart from the due date (due to failure), the next installment should still be taken on the originally defined due date.