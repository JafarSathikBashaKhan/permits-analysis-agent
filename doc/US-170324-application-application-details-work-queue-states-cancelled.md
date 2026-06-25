# US-170324: Application | Application Details | Work Queue States | Cancelled

| Field | Value |
|-------|-------|
| **ID** | 170324 |
| **Type** | User Story |
| **Module** | Work Queue / Status |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

Pre-condition
:  Active 
**BO Cancels an Application** 
** ** 
Given a BO user is reviewing an application 
When the BO user selects “Cancel” and provides a
reason 
Then the system should update the application status
to “**Cancelled**” 
And send a notification to the applicant including
the reason 
  
BO
User views the current work queue state in Permission Details page and in
Overview sections which is covered in [**#169334**](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/169334/)** ** 
** ** 
Updated
Work Queue state : “**Cancelled**”  
  
Post
action: 
BO should
be able to Reinstate the cancelled application , using Reinstate button 
After
Reinstate application moves to Active state
