# US-162155: Application | Application Details | Overview | Add New Note (BO user)

| Field | Value |
|-------|-------|
| **ID** | 162155 |
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
**BO to add new note with respect to application** 

 
**Add a new note to an application** 

 
    Given a BO user is
viewing an application under a specific permission type 
    When the BO user wants to add a new note with respect to application 
    Then BO user should be able to click +New Note button available 

 
    Given when the user clicks on +New note " button 
    When the text editor opens in a new window and User should be able to enter notes using text editor and click "Add
Note" icon 
    Then the note
should be saved successfully 
    And the entry should be recorded in the audit
history 

 
 **Note**: Text related formatting only allowed, User should not be allowed to add background color, and also add/include image inside notes text editor
 

 
 
** Cancel ** 
** ** 
    Given the BO user wants to cancel  
    When the BO user selects "Cancel" in the window, 
    Then the note must not be saved and it should returns back to overview screen. 
 
  
**View notes under an application** 

 
    Given a BO user has
added notes to an application 
    When they open the
Notes section 
    Then all notes
should be listed in newest to oldest order 
    And each note
should include the note content, author, and timestamp 

 
    And added new note should be displayed at the top 

 
 
** Default pagination is available** 
   
  Given the table of permissions contains more rows than the default page size 
  When the page loads 
  Then the table should display only the default number of rows per page 
  And pagination controls should be visible 
 
  When the user navigates to another page using pagination controls 
  Then the relevant set of rows should be displayed 
  
  
**Validation when adding an empty note** 
    Given a BO user in
is in the New Note section 
    When they try to
click "Add Note" button without entering any content 
    Then the system
should display a validation message "Note cannot be empty" 
    And the note should
not be saved 
  
**System error while saving a note** 
    Given a BO Admin is
adding a note in the New Note section 
    When they click
"Add Note" and the system encounters an internal error 
    Then the system
should display an error message "Unable to save the note, please try again
later" 
    And the note should
not be added to the Notes section 

 
**Note **: No maximum character length to add note 

 
 
Event:
Note Added 

 - **Event Name:** Note Added 

 - **Event Description:** A new note was added to the
     application by the BO user. 

 - **Event Category:** Notes Management 

 - **Date and Time:** Current $timestamp 

 - **User Role:** Role of the User 

 - **User Name:** First name and Last name of the
     user
