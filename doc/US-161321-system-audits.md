# US-161321: System Audits

| Field | Value |
|-------|-------|
| **ID** | 161321 |
| **Type** | User Story |
| **Module** | System Audit |
| **State** | Done |
| **Assigned To** | Karthikeyan RR  |
| **Tags** |  |

## Acceptance Criteria

**Menu Availability**
 
 
 
 
Given a Super admin / Contract admin, 
When in the menu section, 
Then should see a sub menu named "System Audits".  
Note: Rename the menu name "Audits" as "System Audits" 

 
**Menu Navigation**
 
Given a Super Admin or Contract Admin selects the System Audits menu,
 
When the menu is clicked,
 
Then the user should be taken to the System Audits screen where system/master-level events are displayed.
 

 
**Event Capture**
 
Given a back-office user performs a master data action (add, edit, delete),
 
When the change is saved,
 
Then those captured events are the source of data for this screen. 
(Including the previous captured events and the events that are going to be captured in future) 

 
**Screen Access**
 
Given a Super Admin or Contract Admin logs into the system,
 
When they navigate to the System Audits menu,
 
Then they should be able to view all relevant audit entries categorized as columns  

- Event Type / Name 
- Event Description 
- Date & Time 
- User Role 
- User Name 
 
**Exclusion of Applicant Data**
 
Given changes are made at the applicant/account level (e.g., vehicle added, document updated, permit purchased),
 
When these events occur,
 
Then they must not appear in the System Audits menu. 
_Note_: 
Applicant events will be tracked in the Audit log of respective applicant account. 
Users -> Applicants -> Applicant Account ->Audit Log Tab 

 
**Read-Only Records**
 
Given audit records are displayed in the System Audit screen,
 
When a user views the records,
 
Then the data should be read-only and cannot be modified or deleted. 

 
**Pagination**: 
When the user views the audit list,
 
Then should have pagination. 

 
Default Ordering
Given audit events exist in the system,
 
When the System Audits screen loads,
 
Then events must display in reverse chronological order (newest first). 

 
**No Records Found**: 
When there are no event entry to be shown, 
Then should show no rows or no records found information as per application standards. 

 
**Manage Column Option**: 
When in the grid screen, 
Then should be able to manage the column options as per the application standard. 

 
**Search**: 
When want to search for the event, 
Then should be able to search for event name based on contains for the below fields. (Because if we have equals, user may not know the exact event name to search) 

- Event Name / Type 
- User Name
