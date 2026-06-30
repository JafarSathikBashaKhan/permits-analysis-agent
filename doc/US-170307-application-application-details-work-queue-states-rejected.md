# US-170307: Application | Application Details | Work Queue States | Rejected

| Field | Value |
|-------|-------|
| **ID** | 170307 |
| **Type** | User Story |
| **Module** | Work Queue / Status |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

Pre-condition
:  In-Progress 
Given a BO user is reviewing an application 
And the application has failed verification or
compliance checks 
When the BO user selects the “Reject” action 
Then the system should update the application status
to “**Rejected**” 
  
BO
User views the current work queue state in Permission Details page and in
Overview sections which is covered in  [#169334](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/169334/)** **** **  
 
 
 
 
 
 
 
Updated
Work Queue state : “**Rejected**” 

 
** ** 
Post Action
: 
** ** 
 

- Rejected
application can be “Reinstate” by BO for certain reject scenario’s.  
- So Bo
has option to reinstate , by invoking “Reinstate” button
