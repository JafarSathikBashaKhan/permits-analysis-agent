# US-164605: Application | Application Details | Overview | Notes Section

| Field | Value |
|-------|-------|
| **ID** | 164605 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Partial Complete |

## Acceptance Criteria

**Permissions Based on Role**

Given the user is logged in as either a Super Admin or Contract User,

When they access the Applications menu,

Then they should be able so permissions and its details

**1. Navigation**

 Given the Permissions details page

When the user selects a Reference Number

Then the system must open the Application View screen for that reference number

And display all the defined sections (Overview, Applicant, Vehicles, Documents, **Notes**, Emails, Audit Log, Payment History).

  

**Display existing notes added by BO notes**

  Given the Application View screen is open

  When the Notes section is displayed

  Then the system must show all notes that have been added by BO users

  And each note must display the note content, BO username, date, and timestamp

  And "See more" is visible if the notes are long more than six lines,

  And upon clicking "See more", respective notes section should expand down to view the entire note 

 
  **Add a new note**.

  Given the Application View screen is open

  When the Notes section is displayed

  Then BO user must see an option to add new note at the bottom section of notes

  

   Add new note is covered in #162155

 **Delete Note**

 Note: 

1.  Applicable only for BO manager role.
2.  BO users should not view delete option 
3.  BO Manager to Delete notes, upon request from BO User that are already added with respect to application**

    **Given the BO Manager views the Notes section**

    **Then each note must display a Delete icon for the BO Manager**

    **Note : Delete note is further developed in  #164507 

  

**Notes displayed in order**

  Given the Application View screen is open

  When the Notes section is displayed

  Then notes must be listed with the most recent note at the top

  

 **Default pagination is available**

  Given the table of permissions contains more rows than the default page size

  When the page loads

  Then the table should display only the default number of rows per page

  And pagination controls should be visible

  

  When the user navigates to another page using pagination controls

  Then the relevant set of rows should be displayed
