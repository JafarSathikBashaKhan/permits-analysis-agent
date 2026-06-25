# US-193350: Application | Application Details | Renewal | Renew permit initiated by BO

| Field | Value |
|-------|-------|
| **ID** | 193350 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**Renewal Summary Page for BO-Initiated Renewal** 
**Pre-condition : Active** 
**Background:** 
Given a BO User with renewal permissions is logged into Back Office 
And an application exists with status "Active" 
And the renewal process has been initiated 
And the application work queue state is "Pending-Renewal" 

 
**Scenario: Display Renewal Summary page with read-only permit details** 
When the BO User opens the Renewal Summary page 
Then the system should display the title "Renewal Summary" 
And show the existing permit details: Plan, Address, and Vehicle (if applicable) 
And these fields should be non-editable and retrieved from the active permit 

 
**Scenario: Display applicable document types and validity status** 
When the BO User views the Documents section 
Then the system should display the list of document types required for this permission type 
And for each document type the system should show: 
| Document Name | 
| Validity Status (Valid or Expired) | 
And validity should be based on document retention configuration 

 
**Scenario: Display renewal pricing breakdown** 
When the BO User views the Pricing section 
Then the system should display: 
| Permit Price | 
| Admin Fee | 
| VAT | 
| Total Amount | 
And the Total should be the sum of the above values 

 
**Scenario: Display Renew and Cancel buttons** 
When the Renewal Summary page loads 
Then the system should show "Renew" and "Cancel" buttons 
And the BO user should be able to click them 

 
**Scenario: BO confirms renewal by clicking Renew** 
Given all renewal details are displayed correctly 
When the BO User clicks "Renew" 
Then the system should trigger the renewal process 

 
**Scenario: BO cancels renewal** 
When the BO User clicks "Cancel" 
Then the system should close the Renewal Summary view 
And no changes should be saved to the application 

 

 

 
**Event: Renewal Initiated by BO User** 
Event Name: Renewal Initiated 
Event Description: <BO User> triggered
the renewal process for the Active permit. 
Event Category: Renewal / Initiate 
Application ID: $ApplicationID 
User Role: BO User 
User Name: $UserName 
Date & Time: $Timestamp
