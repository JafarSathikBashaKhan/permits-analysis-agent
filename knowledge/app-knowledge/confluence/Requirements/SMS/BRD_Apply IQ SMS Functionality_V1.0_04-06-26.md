# BRD_Apply IQ SMS Functionality_V1.0_04-06-26

> **Confluence ID:** 2019229743 · **Version:** 3 · **Last updated:** 2026-06-08T07:14:41.108Z
> **Path:** Requirements / SMS
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/2019229743/BRD_Apply+IQ+SMS+Functionality_V1.0_04-06-26

---

## **1\. Document Control**

Version

Date

Author

Description

1.0

04-Jun-2026

Prathiba K

Initial BRD for SMS Feature based on discussion with Jo

* * *

## **2\. Executive Summary**

This document outlines the requirements for introducing SMS functionality in the Apply IQ system. The feature enables communication via SMS in addition to email, with configurable charging models, opt-in mechanisms, reporting, and integration with permit, voucher, and notification workflows.

The solution allows councils to either absorb SMS costs or pass them to customers, while ensuring audit, reporting, and payment traceability. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3sHMOJWAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)

* * *

## **3\. Business Objectives**

-   Provide SMS as an additional communication channel alongside email
    
-   Enable councils to configure SMS charging (Council vs Customer)
    
-   Improve customer notification experience (reminders, vouchers, alerts)
    
-   Ensure transparency through reporting and audit tracking
    
-   Support bulk communication and operational use cases
    

* * *

## **4\. Background**

Currently, the system supports only email communication. Based on business needs discussed with Joanne Archer, SMS functionality is required to enhance communication, especially for reminders, visitor vouchers, and notifications. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3sHMOJWAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)

SMS provider integration will supply message delivery and billing details, which must be tracked within the system. [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3sHMOJWAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)

* * *

## **5\. Scope**

### **5.1 In Scope**

-   SMS enablement via contract settings
    
-   Customer opt-in and verification process
    
-   SMS sending (single and bulk)
    
-   Charging configuration (Council / Customer)
    
-   SMS templates
    
-   Payment handling for SMS charges
    
-   Reporting and audit tracking
    
-   Integration with:
    
    -   Permit reminders
        
    -   Visitor vouchers (send, activation, expiry)
        
    -   Bulk communication
        

### **5.2 Out of Scope**

-   SMS provider selection (pending confirmation)
    
-   Delivery retry and failure handling enhancements
    
-   Advanced analytics/dashboard
    

* * *

## **6\. Business Requirements**

Requirement ID

Description

Priority

BR-001

System shall provide a toggle in contract settings to enable/disable SMS functionality

High

BR-002

System shall allow customers to opt-in for SMS communication; default communication is email

High

BR-003

System shall verify phone number during SMS opt-in

High

BR-004

System shall allow councils to configure whether SMS cost is charged to customer or council

High

BR-005

System shall support SMS pricing configuration at contract level

High

BR-006

System shall allow override of SMS pricing at permission/permit level

High

BR-007

System shall include SMS charges during permit purchase based on configured reminders

High

BR-008

System shall charge SMS cost when sending/activating visitor vouchers (per usage)

High

BR-009

System shall support bulk SMS functionality for opted-in users only

High

BR-010

Bulk SMS cost shall always be borne by the council

High

BR-011

System shall support SMS templates similar to email templates

Medium

BR-012

System shall allow selection between Email and SMS where applicable

High

BR-013

System shall store SMS transaction details in payment history

High

BR-014

System shall track SMS communications in audit & Email section

High

BR-015

System shall generate SMS reports (overall and filtered)

Medium

BR-016

System shall capture SMS data from provider (phone number, date, count)

Medium

BR-018

System shall validate that the provided phone number is valid for SMS (not landline)

High

BR-019

System shall support SMS charge configuration as a **total price for reminders (per application)**

High

BR-020

System shall support **per usage SMS charge for visitor vouchers (send/activation)**

High

BR-021

System shall collect SMS charges **during permit purchase (for reminders)**

High

BR-022

System shall collect SMS charges **at the time of voucher send/activation**

High

BR-023

System shall allow SMS pricing configuration at both contract level and permission level and apply **permission override logic**

High

BR-024

System shall display SMS payment option only when SMS is selected by user

High

BR-025

System shall restrict SMS for contracts where payment functionality is not enabled

High

BR-026

System shall capture SMS transactions in **application audit trail**

High

* * *

## **7\. Assumptions**

-   SMS provider will supply usage reports (phone number, message count) [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3sHMOJWAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
    
-   SMS pricing may depend on character limits (e.g., >120 characters may result in multiple charges) [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3sHMOJWAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
    
-   Customers must opt-in before receiving SMS
    
-   Payment gateway is available for customer-paid SMS scenarios
    

* * *

## **8\. Constraints**

-   SMS cannot be enabled for customer-paid scenarios if payment functionality is unavailable [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3sHMOJWAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
    
-   Contracts operating in back-office-only mode will not support SMS for customers [\[Permission...on with Jo | Meeting\]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkADRhODcwMTc5LWU5MmItNDcwYy05MzIzLWE0MzNmZmM5YmViYgFRAAgI3sHMOJWAAEYAAAAA8Yjw7HkDgkGw78Fblge0OgcAkdj41iWNBEKgL1IpqCBSmgAAAAABDQAAkdj41iWNBEKgL1IpqCBSmgABjJCOoQAAEA%3d%3d)
    
-   SMS availability depends on provider integration
    

### **8A. Business Rules**

1.  SMS is available only if:
    
    -   Contract-level toggle is enabled AND
        
    -   User has opted-in
        
2.  Charging rules:
    
    -   Customer-paid OR Council-paid based on configuration [\[BRD\_Apply+...0\_04-06-26 | Word\]](https://nsl365-my.sharepoint.com/personal/prathiba_k_logicvalley_in/_layouts/15/Doc.aspx?sourcedoc=%7B08934452-024E-4F48-B06B-5A99A46C0022%7D&file=BRD_Apply%2BIQ%2BSMS%2BFunctionality_V1.0_04-06-26.doc&action=default&mobileredirect=true)
        
    -   Bulk SMS always council-paid
        
3.  Pricing rules:
    
    -   Contract-level pricing acts as default
        
    -   Permission-level pricing overrides contract-level configuration [\[BRD\_Apply+...0\_04-06-26 | Word\]](https://nsl365-my.sharepoint.com/personal/prathiba_k_logicvalley_in/_layouts/15/Doc.aspx?sourcedoc=%7B08934452-024E-4F48-B06B-5A99A46C0022%7D&file=BRD_Apply%2BIQ%2BSMS%2BFunctionality_V1.0_04-06-26.doc&action=default&mobileredirect=true)
        
4.  Charging scenarios:
    
    -   Permit purchase → Includes SMS reminder cost upfront
        
    -   Voucher sending → Charged per SMS usage
        
5.  SMS selection:
    
    -   SMS option appears only for opted-in users
        
    -   If user not opted-in → System prompts opt-in
        
6.  Payment rules:
    
    -   SMS charges must be paid via:
        
        -   Card / saved card only
            
    -   Offline payment not applicable
        
7.  Tracking rules:
    
    -   All SMS must be:
        
        -   Logged in audit
            
        -   Available in communication history
            

* * *

## **9\. Risks**

Risk Description

Impact

Likelihood

Mitigation Strategy

Incorrect pricing configuration

High

Medium

Validation and testing of pricing setup

SMS provider integration failure

High

Medium

Fallback to email communication

Missing opt-in compliance

High

Low

Mandatory opt-in validation and prompts

Payment failures for SMS charges

Medium

Medium

Restrict usage to successful card payments

Incomplete SMS tracking/reporting

Medium

Medium

Ensure audit and reporting capture all transactions

* * *

## **10\. Approval**

Name

Role

Signature

Date

Joanne Archer

Product Owner

—

—

Prathiba K

Business Analyst

—

—