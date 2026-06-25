# US-174607: Application | Application Details | Work Queue States | Reactivate

| Field | Value |
|-------|-------|
| **ID** | 174607 |
| **Type** | User Story |
| **Module** | Work Queue / Status |
| **State** | Done |
| **Assigned To** | Natarajan Arumugam  |
| **Tags** |  |

## Acceptance Criteria

** Reactivate an Expired Application**
 

 
 
**Pre-condition : Expired** 
**** 
 
Given an application is in "Expired" state 
And the applicant has requested BO to reactivate the application for renewal 
When the Back Office (BO) user selects the "Reactivate" option 
Then the system should change the application status to "Active" 
And “Renew” button will be enabled for BO action. 
 
**Updated Work queue state : ACTIVE** 
 

 
Configuration is covered in [#177255](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/177255/)
