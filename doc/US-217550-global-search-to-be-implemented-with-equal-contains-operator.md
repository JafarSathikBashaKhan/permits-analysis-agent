# US-217550: Global Search to be implemented with Equal, Contains Operator

| Field | Value |
|-------|-------|
| **ID** | 217550 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Natarajan Arumugam  |
| **Tags** | cr; Priority 1 |

## Acceptance Criteria

Scenario: Search using Equal operator
 
 
Given the user selects "Status" as the search field
 
And the user selects "Equal" operator
 
And the user enters "Approved"
 
When the user performs the search
 
Then only applications with status "Approved" are displayed
 

 
Scenario: Search using Contains operator
 
Given the user selects "Applicant Name" as the search field
 
And the user selects "Contains" operator
 
And the user enters "John"
 
When the user performs the search
 
Then applications containing "John" in applicant name are displayed
 

 
**Below is the EXCEL which contains the global search details that needs to be implemented: ** 

 
[Permits _Global Search](https://nsl365-my.sharepoint.com/:x:/r/personal/natarajan_a_logicvalley_in/_layouts/15/Doc.aspx?sourcedoc=%7b2BAC34C4-C279-4FB6-834E-AACE8D221BA1%7d&file=Book%203.xlsx&action=editNew&mobileredirect=true&wdOrigin=WAC.EXCEL.END-OF-WORKFLOW%2cAPPHOME-WEB.BANNER.NEWBLANK&wdPreviousSession=3ac37f42-f08a-4a85-b979-411bb2ff622a&wdPreviousSessionSrc=AppHomeWeb&ct=1770027634616)
