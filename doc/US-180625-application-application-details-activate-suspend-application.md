# US-180625: Application | Application Details | Activate Suspend Application

| Field | Value |
|-------|-------|
| **ID** | 180625 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**Pre-Condition : Suspended** 
  
**Activate a Suspended Application** 
** ** 
Given
an application is in “Suspended” state 
And
the reason for suspension has been resolved 
When
the BO user selects “Activate” button available 
Then
a confirmation pop-up triggers “Are you sure want to Activate this
Permit? Activating will move the  application
to previous state.” with   "Cancel" and "Activate
" 
  
Activate work queue state [#174605](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/174605/)     
 
 
 
 
 

 
Given
the application is in Activated state 
Then
the system should update the application status from “Suspended” to “Active”
state 
And
an email is triggered automatically upon Activation to applicant. 
  
When
BO User selects "Cancel" 
Then
the Activate application should not be done 
And
application remains in the same state. (Suspended) 
  
**Update Work Queue state **: **ACTIVE** 

 
**Once Application is in ACTIVE -> will have option to Cancel , Change Zone** 
** ** 
Event Name: Activate Suspended
Application  

 - A**pplication ID **: Application / reference
     number  

 - **Event Description:**
     Captures the BO user’s action of reactivating an application that was
     previously in a “Suspended” state 

 - **Event Category:** User
     Action 

 - **Date and Time:**
     Current $timestamp 

 - **User Role:** Back
     Office (BO) User 

 - **User Name:** First
     name and Last name of the user
