# US-164971: Application | Application Details | Overview | Payment History tab

| Field | Value |
|-------|-------|
| **ID** | 164971 |
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
Notes, Emails, Audit Log,** Payment History**). 

 
** Payment History Section**
 

 
Display all payments linked to
application 
  
  Given the
Application View screen is open 
  When the Payment
History section is displayed 
  Then the system
must show all payments made against the application reference number 
  
**Display payment details for each record** 
** ** 
  Given the
Application View screen is open 
  And the Payment
History section is displayed 
  When payment
history records are shown 
  Then each record
must include: 
    | Date &
Time     | 
    | Payment
Amount  | 
    | Payment
Status  | 
  
Payment history is displayed in
chronological order 
** ** 
  Given the
Application View screen is open 
  And the Payment
History section is displayed 
  When payments are
displayed 
  Then the records
must be sorted from newest to oldest
