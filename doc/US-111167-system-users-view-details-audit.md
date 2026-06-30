# US-111167: System Users - View Details | Audit

| Field | Value |
|-------|-------|
| **ID** | 111167 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete |

## Acceptance Criteria

Audit Log / Events Tab Availability
 
 
 
Given a Super admin / Contract admin user, 
 
When selects an account from the system users list, 
Then should see a dedicated "Audit Log" tab in the system users list screen. 

 
**Event Types Captured**
 
When any action is performed against a system user account, 
Then those events captured should be listed in this audit log tab. (All the events are captured in respective stories) 
**Example** 
Event Type  
Description (as per the event type)
 
Date and Time of event
 
User Role
 
Full Name of the user who performed the action 

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
