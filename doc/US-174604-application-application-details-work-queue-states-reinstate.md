# US-174604: Application | Application Details | Work Queue States | Reinstate

| Field | Value |
|-------|-------|
| **ID** | 174604 |
| **Type** | User Story |
| **Module** | Work Queue / Status |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**Pre-Condition : Rejected / Cancelled** 

 
Given an application is in “Cancelled” or “Rejected” state
When the BO user selects “Reinstate” and provides a valid reason
 
Then the system should update the application status to the appropriate active state (e.g., Pending-Renewal or Active)
 
And notify the applicant about the reinstatement
 

 
**Updated QUEUE : ** 

 
If Rejected  
Reinstate ---> Pending-approval / Pending-renewal 

 
if Cancelled 
Reinstate --->Active
 

 
for Reinstate stories covered in  [#174813](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/174813/)  and  [#163987](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/163987/)
