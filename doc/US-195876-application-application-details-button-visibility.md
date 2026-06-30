# US-195876: Application | Application Details | Button visibility

| Field | Value |
|-------|-------|
| **ID** | 195876 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sureshsankar  |
| **Tags** |  |

## Acceptance Criteria

**Scenario: Action buttons are driven by work queue state** 
Given an application exists in the back-office work queue 
And the application has a current work queue state 
When the BO user opens the application details screen 
Then the system displays only those action buttons that are allowed for the current work queue state 
And any actions not allowed for the current state are not displayed or are disabled 

 

 
**Action Buttons set 1:** 

 
BO ACTION BUTTONS WITH RESPECT TO WORK QUEUE STATES Work queue state   Display Action buttons Waiting List   Submit to Process

Cancel Permit Pending-approval

Pending-renewal   Begin Review  In-Progress   Reject,

Approve,

More Actions ->Request Customer information, Request Further Evidence,Internal referral ,On-Hold Waiting for customer information   Reject Request Support Evidence if customer sends documents in email, we need Evidence provided button Reject ,

Request further evidence

Evidence Provided  

 

 

 

 
[https://nsl365-my.sharepoint.com/:x:/r/personal/natarajan_a_logicvalley_in/_layouts/15/Doc.aspx?sourcedoc=%7BEB41D6AC-5FB1-4EEB-8974-30D84D206007%7D&file=Book%201.xlsx&action=editnew&mobileredirect=true&wdPreviousSession=26fd1cb6-da65-b064-1655-1685e9b04932&wdNewAndOpenCt=1764588213660&wdo=4&wdOrigin=wacFileNew&wdPreviousCorrelation=13b27765-0e8e-42b4-ae2b-b0dfa765112d&wdnd=1](https://nsl365-my.sharepoint.com/:x:/r/personal/natarajan_a_logicvalley_in/_layouts/15/Doc.aspx?sourcedoc=%7bEB41D6AC-5FB1-4EEB-8974-30D84D206007%7d&file=Book%201.xlsx&action=editnew&mobileredirect=true&wdPreviousSession=26fd1cb6-da65-b064-1655-1685e9b04932&wdNewAndOpenCt=1764588213660&wdo=4&wdOrigin=wacFileNew&wdPreviousCorrelation=13b27765-0e8e-42b4-ae2b-b0dfa765112d&wdnd=1) 
 

 
Above is the link that gives Action buttons for BO based on the each work queue states.
