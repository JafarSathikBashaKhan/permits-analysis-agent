# US-174578: Application | Application Details | Work Queue States | Suspended

| Field | Value |
|-------|-------|
| **ID** | 174578 |
| **Type** | User Story |
| **Module** | Work Queue / Status |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

Pre-condition
:  Active 
**BO Suspends an Application** 
** ** 
Given a BO user is reviewing an application 
And identifies a valid reason to pause processing 
When the BO user selects “Suspend” and specifies the
reason 
Then the system should update the application status
to “**Suspended**” 
  
BO
User views the current work queue state in Permission Details page and in
Overview sections which is covered in [**#169334**](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/169334/)** ** 
** ** 
Updated
Work Queue state : “**Suspended**”  
  
Post
action: 
BO should
be able to **Activate** the suspended application , using **Activate **button 
After
Activate application moves to Active state
