# US-174573: Application | Application Details | Work Queue States | Internal referral

| Field | Value |
|-------|-------|
| **ID** | 174573 |
| **Type** | User Story |
| **Module** | Work Queue / Status |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

Pre-condition
:  In-Progress 

 
**Application referring Internally to another BO** 
Given a BO user is reviewing an application 
And identifies the need for additional review or
verification 
When the BO user selects “Internal Referral” button
from More Action 
And assigns to another BO user 
Then the system should update the application status
to “Internal
Referral” 
  
BO
User views the current work queue state in Permission Details page and in
Overview sections which is covered in [**#169334**](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/169334/)** ** 
** ** 
Updated
Work Queue state : “**Internal- referral**” 

 
Once
Assigned BO starts reviewing it , application will be moved to "In-Progress" state 
** ** 
Post Action
: 

- BO user can Approve,
Reject, Request information, Request support evidence , On-hold the application
