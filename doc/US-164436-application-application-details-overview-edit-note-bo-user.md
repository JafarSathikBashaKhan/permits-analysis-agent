# US-164436: Application | Application Details | Overview | Edit Note (BO user)

| Field | Value |
|-------|-------|
| **ID** | 164436 |
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
**BO to Edit notes that are already added with respect to application** 

 
**** 
  **Background:** 
** ** 
    Given the BO user
is logged in and has access to the application 
    And notes have
already been added in the Notes section by respective BO 
    Then BO should have
option to edit the notes added by him 
     
  
**Display edit option for notes** 
  
    Given the BO user
views the Notes section 
    Then each
existing note must display an Edit icon/button 
  
**Open note in text editor** 
** ** 
    Given the BO user
clicks the Edit icon for a note 
    Then the system
must open a text editor 
    And the existing
note content must be pre-populated in the editor 
  
 **Edit and save a note** 
** ** 
    Given the BO user
updates the note in the editor 
    When the BO user
clicks "Save Changes" 
    Then the updated
note must replace the previous note in the Notes section 
     
 **Note**: Text related formatting only allowed, User should not be allowed to add background color, and also add/include image inside notes text editor 

 
  Cancel
editing a note 
** ** 
    Given the BO user
opens a note in the editor 
    When the BO user
clicks "Cancel" 
    Then no changes
must be applied 
    And the note must
remain unchanged 
  
**Note**:    Editing an existing note is applicable
for respective BO users who have added  
             Other BO
users note cannot be edited by a different BO user (Internal Referral option) 

 

 
**Audit Log details** 

 
 
Event:
Note Edited 

 - **Event Name:** Note Edited 

 - **Event Description:** An existing note associated
     with the application was modified by the BO user. 

 - **Event Category:** Notes Management 

 - **Date and Time:** Current $timestamp 

 - **User Role:** Role of the User 

 - **User Name:** First name and Last name of the
     user
