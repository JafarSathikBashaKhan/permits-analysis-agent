# US-174588: Application | Application Details | Work Queue States | On-Hold

| Field | Value |
|-------|-------|
| **ID** | 174588 |
| **Type** | User Story |
| **Module** | Work Queue / Status |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

Pre-condition
:  In-Progress 
Given a BO user is reviewing an application 
And identifies a valid reason to pause processing 
When the BO user selects “Put On-Hold” and specifies
the reason 
Then the system should update the application status
to “On-Hold” 
  
BO
User views the current work queue state in Permission Details page and in
Overview sections which is covered in [**#169334**](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/169334/)** ** 
** ** 
Updated
Work Queue state : “**On-Hold**” 
** ** 
Post Action
: 

- BO user can Extend the
On-hold duration when application is in On-Hold state 
- BO user should also be
able to Resume back the application, when application is in On-Hold state 
- Once resumed
application moves to “in-Progress” state
