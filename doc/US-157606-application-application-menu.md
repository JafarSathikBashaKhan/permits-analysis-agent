# US-157606: Application | Application Menu

| Field | Value |
|-------|-------|
| **ID** | 157606 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Nivetha Mohan  |
| **Tags** | Fully Complete |

## Acceptance Criteria

**** 
**** 
Permissions
Based on Role 
Given
the user is logged in as either a Super Admin or Contract User, 
When
they access the Applications menu, 
Then
they should only see permissions that are relevant to their role and the
contract they're managing. 
  
Application
Menu Access 
Given
a Super Admin or Contract User is logged into the system, 
When
they view the main menu, 
Then
the "Applications" menu option should be available for selection. 
** ** 
Dynamic
List for Permission Types 
Given
the user is on the dashboard

When the user clicks on the "Applications" menu 
Then
the system must display the list (sub-menu) of permit types configured in the contract
settings 
And
each permit type must be available for user selection 
And
the list should be dynamic based on contract configuration, not a static list (sub-menu). 

Display permits in newest to oldest order

 
Given
the user navigates to the permit list (sub-menu)

When the system retrieves the permits 
Then
the permits must be displayed in descending order by creation date 
And
the newest permit must appear at the top of the list 
And
the oldest permit must appear at the bottom of the list

 
Viewing
Permit Details 
** ** 
Given
the user selects a specific permission type from the list (sub-menu),

When the user clicks on that permission type,

Then the corresponding permissions grid should be displayed, showing the
permissions the user has applied for or purchased for that specific type 

Additionally, the permit details displayed should align with the contract
settings associated with the selected permission type. 
  
Default
Selection of First Permission Type 
** ** 
Given
the user opens the "Applications" menu, 
When
the page loads, 
Then
the first permission type in the list should be automatically selected. 
And
its respective permission details should be displayed in the details tab by
default. 
  
Permission
Data One-to-One Mapping 
** ** 
Given
multiple permission types exist, 
When
each permission type is selected one by one, 
Then
the Details tab should only show data relevant to the currently selected
permission type, 
And
not mix data from other permission types. 
  
User
Interface (UI) 
Given
the user interacts with the Applications menu, 
When
the permission types are displayed, 
Then
the UI should be clean, intuitive, and visually separated (e.g., using borders,
tabs) for easy navigation between permission types and details. 

 
**Note:** 
Any
update on the contract settings like removal of permit type, update on permit
type should immediately reflect in applications menu
