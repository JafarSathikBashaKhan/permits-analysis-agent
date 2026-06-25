# US-174571: Application | Application Details | Work Queue States | Waiting for customer information

| Field | Value |
|-------|-------|
| **ID** | 174571 |
| **Type** | User Story |
| **Module** | Work Queue / Status |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

Pre-Condition
: In-Progress 
** ** 
BO
user reviews the application 
Given a BO user is
reviewing an application which is in “in-progress” state 
And the BO user
identifies that additional information is required from the applicant 
When the BO user invokes
the button “**Request Customer Information”** from more actions 
Then the system should
update the work queue state of the application to “Waiting for Customer
Information” 
  
BO User views the current work queue
state in Permission Details page and in Overview sections which is covered
in [**#169334**](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/169334/)** ** 
  
**Updated Work Queue state** : “Waiting for Customer
Information”
