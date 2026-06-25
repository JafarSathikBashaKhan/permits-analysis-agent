# US-164507: Application | Application Details | Overview | Delete Note (BO Manager)

| Field | Value |
|-------|-------|
| **ID** | 164507 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Partial Complete |

## Acceptance Criteria

**** 
**** 
**** 
**** 
**BO Manager to Delete notes, upon request from BO User that are already added with respect to application** 

 
As a **BO Manager**,

I want to delete notes added by **BO users** upon request,

So that unnecessary or incorrect notes are removed while maintaining an audit record of the deletion.
 

 
 
Note:  
 
- Applicable only for BO manager role. 
- BO users should not view delete option  
- BO Manager to Delete notes, upon request from BO User that are already added with respect to applicatio**n** 
 
 

  

 
**** 
  **Background**: 
  
    Given the BO
Manager is logged in 
    And the BO
Manager has access to the Notes section of an application 
    And at least one
note exists in the Notes section 
  
  Display
delete option for each note 
** ** 
    Given the BO
Manager views the Notes section 
    Then each note
must display a Delete icon for the BO Manager 
  
  Confirm
note deletion 
** ** 
    Given the BO
Manager clicks the Delete icon for a note (As requested by BO user) 
    Then a
confirmation pop-up must appear "**Are you sure want to delete the note** ?" , with options "Confirm" and
"Cancel" 
  
**Successful note deletion** 
** ** 
    Given the BO
Manager confirms deletion 
    Then the note
must be permanently removed from the Notes section 
    And the note must
not be visible in the respective application 
    And the system
must record the deletion in the audit log 
  
  Cancel
deletion 
** ** 
    Given the BO
Manager clicks the Delete icon for a note 
    When the BO
Manager selects "Cancel" in the confirmation pop-up 
    Then the note
must remain unchanged and visible in the Notes section 

 
 
**Audit logging ** 
**** 
    When the BO Manager Deletes the note 
    Then the audit log must be captured for all the events with respect to application 

 
 
Event:
Note Deleted 

 - **Event Name:** Note Deleted 

 - **Event Description:** A note associated with the
     application was permanently deleted by the BO Manager on behalf of BO user 

 - **Event Category:** Notes Management 

 - **Date and Time:** Current $timestamp 

 - **User Role:** Role of the User 

 - **User Name:** First name and Last name of the
     user
