# US-130534: View Applicant Details | Audit Log

| Field | Value |
|-------|-------|
| **ID** | 130534 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Karthikeyan RR  |
| **Tags** | LV; southend |

## Acceptance Criteria

Audit Log / Events Tab Availability
 
 
 
Given a Super Admin / Contract Admin / BO Manager / BO User
 
When selects an applicant account from the list, 
Then should see a dedicated "Audit Log" tab in the applicant's detail screen
 

 
**Event Types Captured**
 
When any action is performed against an applicant account (Eg: Upload, Replace, Delete, Purchasing new application)
 
Then those events captured should be listed in this audit log tab. (All the events are captured in respective stories) 
**Example** 
Event Type (e.g., "New Document Uploaded", "Document Replaced", "Document Deleted")
 
Description (as per the event type)
 
Date and Time of event
 
User Role
 
Full Name of the user who performed the action 

 
**Customer Portal Events** 
When any action is performed in the customer portal by Citizen or Customer user, (Eg: Upload, Replace, Delete, Purchasing new application) 
Then those events should also be shown in the Audit log tab. 

 
**Consolidated View**
 
When in the Audit / Events tab
 
Then all events should be displayed in chronological order with filters and pagination (if needed)
 
_Display Format_
 
Each log entry should clearly show:
 
Event Type / Name
 
Event Description
 
Date and Time
 
User Role
 
User Name (First + Last Name)
 

 
**Filter and Sort Options**
 
When viewing the list, 
Then should have default sort option. 

 
**Read Only** 
When viewing the events, 
Then all the events should be read only. 

 
**Note** 
Ignore search in this story as it will be captured in the story [#133602](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/133602/) .
