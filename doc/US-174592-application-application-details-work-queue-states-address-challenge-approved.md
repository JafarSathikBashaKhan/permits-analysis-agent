# US-174592: Application | Application Details | Work Queue States | Address Challenge Approved

| Field | Value |
|-------|-------|
| **ID** | 174592 |
| **Type** | User Story |
| **Module** | Work Queue / Status |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**Current work queue : Challenge address** 
**** 
**Scenario : Application Moves to “Change Address Challenge” State** 
**** 
Given the application is created with a temporary address flag 
When the Back Office user starts reviewing the application which are in "Change Address Challenge" state 
And has verified the address and supporting documents 
When the address is validated as a legitimate and valid address 
Then the Back Office user can include the address in the respective zone list and approve address challenge 
And the application status should move to "Address Challenge Approved" 

 

 
**Updated Work queue state : "Address Challenge Approved**
