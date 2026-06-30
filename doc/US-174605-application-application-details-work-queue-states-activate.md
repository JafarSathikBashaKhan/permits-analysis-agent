# US-174605: Application | Application Details | Work Queue States | Activate

| Field | Value |
|-------|-------|
| **ID** | 174605 |
| **Type** | User Story |
| **Module** | Work Queue / Status |
| **State** | Done |
| **Assigned To** | Natarajan Arumugam  |
| **Tags** |  |

## Acceptance Criteria

Linked to [#180625](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/180625/) 

 
**Pre-Condition : Suspended** 
  
**Activate a Suspended Application** 
** ** 
Given an application is in “Suspended” state 
And the reason for suspension has been resolved 
When the BO user selects “Activate” button available 
Then a confirmation pop-up triggers “**Are you sure want to Activate this Permit? Activating will move the  application to previous state**.” with   "Cancel" and "Activate " 
  
Activate work queue state [#174605](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/174605/) 
 
 
 
 
 
 
 
 
 
 
 
Given the application is in Activated state 
Then the system should update the application status from “Suspended” to “Active” state 
And an email is triggered automatically upon Activation to applicant. 
  
When BO User selects "Cancel" 
Then the Activate application should not be done 
And application remains in the same state. (Suspended) 
  
**Update Work Queue state **: **ACTIVE**
