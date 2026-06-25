# US-164970: Application | Application Details | Overview | Audit log tab

| Field | Value |
|-------|-------|
| **ID** | 164970 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Natarajan Arumugam  |
| **Tags** |  |

## Acceptance Criteria

**** 
**** 
**** 
**** 
Permissions
Based on Role 

 
Given
the user is logged in as either a Super Admin or Contract User, 
When
they access the Applications menu, 
Then
they should be able so permissions and its details 
  
1.
Navigation 

 
 Given
the Permissions details page 
When
the user selects a Reference Number 
Then
the system must open the Application View screen for that reference number 
And
display all the defined sections (Overview, Applicant, Vehicles, Documents,
Notes, Emails, **Audit Log**, Payment History). 
  
 
**** 
**Access the Audit Log section** 
** ** 
  Given the
Application View screen is open 
  When the user
clicks on the Audit Log tab 
  Then the system
must display the complete history of events, changes, and actions performed
against the application 
  
**Display audit log event details** 
** ** 
  Given the
Application View screen is open 
  And the Audit Log
tab is selected 
  When audit logs are
displayed 
  Then each record
must include: 
    | Event Type /
Name | 
    | Event
Description | 
    | Date &
Time       | 
    | User Role         | 
    | User Name         | 
  
Audit logs are displayed in
chronological order 
** ** 
  Given the
Application View screen is open 
  And the Audit Log
tab is selected 
  When audit logs are
displayed 
  Then logs must be
sorted from newest to oldest 
  
**Audit logs must be non-editable** 
** ** 
  Given the
Application View screen is open 
  And the Audit Log
tab is selected 
  When audit logs are
displayed 
  Then the system
must ensure all records are read-only 
  And no user is
allowed to edit or delete audit log entries
