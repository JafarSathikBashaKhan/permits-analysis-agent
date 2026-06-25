# User Story 157621: Permission Setup - Builder | Unpublish

## Metadata
| Field | Value |
|-------|-------|
| ID | 157621 |
| Type | User Story |
| Title | Permission Setup - Builder | Unpublish |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags |  |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

**Unpublish Button Visibility
** 
 
 
Given the permission setup is in Published status,** 
When a Super Admin or Contract Admin views the permission setup,
 
Then the Unpublish button should be visible and enabled.
 

 
Unpublish Button Hidden in Draft**** 
Given the permission setup is in Draft status,
 
When the user views the permission setup,
 
Then the Unpublish button should not be visible or should be disabled.
 

 
Confirmation Prompt**** 
Given the permission setup is in Published status,
 
When the user clicks the Unpublish button,
 
Then the system should display a confirmation prompt:
 
"Are you sure you want to unpublish this permission? This will revert it to Draft and prevent new applications."
 

 
Status Change to Draft**** 
Given the user confirms the Unpublish action,
 
When the confirmation is accepted,
 
Then the system should change the permission status from Published to Draft. 
& 
Then the data should be saved and retained. 

 
Block New Applications**** 
Given the permission setup status is changed to Draft,
 
When a customer attempts to apply for this permission in the Customer Portal,
 
Then the permission should not be listed in the available permissions for application.
 

 
Existing Permits Remain Active**** 
Given a permission setup is unpublished and reverted to Draft,
 
When there are existing active permits issued under this permission,
 
Then those permits should remain valid and unaffected.
 

 
Edit Access After Unpublish**** 
Given the permission setup is in Draft status after unpublishing,
 
When the Super Admin or Contract Admin edits any section,
 
Then all configuration fields should be editable without restriction.
 

 
Event / Audit Logging**
 
Given a permission setup is unpublished,
 
When the status changes from Published to Draft,
 
Then the system should record the following details in the audit trail:
 

 
Event Name: Permission Unpublished
 
Event Type: $PermissionName unpublished and status changed to draft. 
Category: Configuration 
Date & Time: Timestamp of the action
 
User Role: Role of acting user
 
User Name: First and Last Name of acting user
