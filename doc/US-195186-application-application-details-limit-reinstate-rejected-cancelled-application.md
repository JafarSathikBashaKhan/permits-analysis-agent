# US-195186: Application | Application Details | Limit Reinstate (Rejected / Cancelled) Application

| Field | Value |
|-------|-------|
| **ID** | 195186 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**** 
**** 
**** 
**Reinstate Cancelled Permit Application** 
**Pre-Condition : Rejected or Cancelled ** 

 
**BO User sees " Reinstate  Application" option** 
Given the application was in Cancelled state  
And the permit duration has not expired 
When the BO User invokes the application number 
Then the system must display the " Reinstate Application" option 

 
Given the application was in Rejected state  
And the permit duration has not expired 
When the BO User invokes the application number 
Then the system must display the " Reinstate Application" option 

 
**Scenario: Reinstate button visible within 3 days of cancellation** 
Given an application was cancelled 
When the BO User views the application detail page 
Then the system should display the "Reinstate" button 
And Reinstate button is visible for next 3 days of rejection or cancellation 
And the BO User should be able to invoke reinstate 

 
**Scenario: Reinstate button hidden after 3 days** 
Given an application was cancelled 
When the BO User views the application detail page after 3rd day 
Then the system should NOT display the "Reinstate" button 
And application remains in Rejected or Cancelled state
