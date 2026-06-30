# US-182368: Application | Application Details | Application ID in Audit log events

| Field | Value |
|-------|-------|
| **ID** | 182368 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**Application ID in user action** 

 
Given a user performs an action on an application
When the system logs the event in the audit trail
 
Then the audit record should include the Application ID of the affected application
 

 
**Application ID in System Events**
 

 
Given the system performs an automated action (e.g., notification, status update)
When the audit log is generated
 
Then the audit record should include the Application ID linked to the system event
 

 
**Display Application ID in Audit Log** 

 
Given a BO user or Auditor views the audit log for any application
When the list of events is displayed
 
Then each event should show the associated Application ID in the audit table or details panel
 

 

 
For Below stories we need to capture Application ID (since these are all already completed one) 

 
[#160622](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/160622/)  
[#160629](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/160629/) 
[#160872](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/160872/) 
[#172046](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/172046/) 
[#160535](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/160535/) 
[#165891](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/165891/) 
[#164967](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/164967/) 
[#161845](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/161845/)
