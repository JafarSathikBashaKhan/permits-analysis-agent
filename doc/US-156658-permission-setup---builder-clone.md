# User Story 156658: Permission Setup - Builder | Clone

## Metadata
| Field | Value |
|-------|-------|
| ID | 156658 |
| Type | User Story |
| Title | Permission Setup - Builder | Clone |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

**Clone Option Visibility
** 
 
 
 
 
Given a Super Admin or Contract Admin** 
When in the Permission Setup screen
 
Then the option to Clone the entire permission configuration should be visible for each permission entry
 

 
Confirmation Prompt**** 
Given the user is in the Permission Setup screen
 
When the user selects the Clone option for a permission
 
Then a confirmation pop-up should appear with the message "Are you sure wish to clone the $PermissionName configuration?" and Clone and Cancel buttons
 

 
Clone Execution to Edit Mode**** 
Given the confirmation pop-up is displayed
 
When the user selects Clone
 
Then the system should copy the entire permission configuration into a new Edit screen in Draft mode including the Permission Name and all other fields with the same values
 

 
No Immediate Save on Clone**** 
Given the cloned permission is in Edit mode
 
When the user has not yet selected Save Draft**** 
Then the cloned permission should not be added as a new entry in the list screen
 

 
Cancel Cloning**** 
Given the cloned permission is in Edit mode
 
When the user selects Cancel
 
Then the system should display a confirmation pop-up "Are you sure you want to discard this cloned permission?"
 
And if Yes is selected, the clone is discarded
 
And if No is selected, the user remains in Edit mode
 

 
Save as Draft Behavior
** 
Given the cloned permission is in Edit mode** 
When the user selects Save Draft
 
Then the cloned permission should be added as a new entry in the list screen in Draft status. 
Note: Unique permission name is required to 'Save as draft'. 
Error Message: Enter a unique permission name to save this clone as draft. 

 
Audit Or Events Capturing**: 
Event Name: Permission Setup Cloned 
Event Type: Permission Setup Cloned 
Date and Time:  
User Role: $Role of the user who made the change** 
User Name: First Name and Last Name of the user who done the change. 

 
For Understanding Only**: 
**Publish Validation Rules**** 
Given the cloned permission is in Edit mode
 
When the user attempts to Publish
 
Then the system should validate that the below configuration are not duplicates of any other saved permission.** 

- Permission Name  
- Prefix 
- Special Events  
 
And
 if any duplicates exist, publishing should be blocked and the following
 error messages should be displayed as based on the scenario 

- "Permission Name, Prefix and Special Events" cannot be duplicate. 
- Permission Name cannot be duplicate. 
- Prefix cannot be duplicate 
- Special Events cannot be duplicate. 
 
** 
General Validation Consistency**
 
Given the user attempts to publish a cloned permission
 
When validations are triggered
 
Then all standard field validations for publishing a new permission should also apply.
