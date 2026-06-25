# US-110232: Roles and Permissions List Screen - Edit / Delete

| Field | Value |
|-------|-------|
| **ID** | 110232 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sureshkumar M  |
| **Tags** | Fully Complete; LV |

## Acceptance Criteria

**Editing & Managing Roles:** 
Given a Super Admin / Contract Admin 
When selects Edit icon in the Roles and Permissions list screen, 
Then they should be able to edit the role name, role description and menu access. 

 
When in the Role field, 
Then should be able to edit the role name. 

 
When edits the role name, 
Then duplicate role name entry should not be allowed. 

 
When edits the description, 
Then should only be allowed to input the field with less than or equal to 160 characters. 

 
Menu Edit permissions: 
Given a Super admin / Contract admin, 
When in the edit screen, 
Then should be able to edit the access permissions to all the menu and sub menu items. 
 

 
When in the menu permissions edit section, 
Then should see all the menus and their sub menus. 

 
When wants to edit permission, 
Then should be able to check or uncheck 'View' and 'Manage' options against menu & sub menu items.  
 

 
When edits, 
 Then the logic mentioned in _User Story 110233: Create New User Role_ applies here. 

 
_Home:_ 
_My Work Items_ - This is a main menu that doesn't have any sub menus 

 
_Applications_ 
Permits 
Licenses 
Suspension 
Exemptions 

 
 
_Users:_ 
Should see the below sub menus, 
Roles and Permissions 
System Users 
Applicants 

 
_Permission Setup_ 
Should see the below sub menus, 
Types 
Builder 
Groups 

 
_Templates_ 
Emails 
Document Types 
Terms and Conditions 
Alerts/Tooltips 

 
_Print_ 
Permits Reminder 
Permits 

 
_Area_ 
Street 
Zones 
Location 

 
The below will only have main menus 
Reports 
Audits 
Council Settings 
Vehicles 
Notifications 

 
~~When viewing the menu items permissions for super admin / contract admin role, ~~ 
~~Then all the permissions should be in enabled state and should not be unchecked. ~~ 
 

 
When done with the edits, 
Then should be able to save the entry. 

 
When doesn't want to save the edited entry, 
Then should have the provision to exit without saving the entry  
 

 
When wants to edit the default user role names, 
Then should not be allowed to edit the default user roles. 

 
When want to edit the role names for the ones that is created in the UI, 
Then should be allowed to edit. 

 
**Delete:** 
When want to delete the custom or user roles created via UI, 
Then should be able to delete. (Soft Delete) 

 
When deleted a user role, 
Then all the user accounts of that role should be un-mapped. 
 

 
**Events Capturing / Audit** 
****Event Type / Name: Role name updated 
Event Description: Role name changed from '$RoleName' to '$RoleName'. 
Date and Time: 
 
User Role: $Role of the user who made the change 
User Name: First Name and Last Name of the user who done the change 

 
_Permissions Update_ 
Event Type / Name: User Role Permission Updated 
Event Description: User role permission updated 
Date and Time: 
 
User Role: $Role of the user who made the change 
User Name: First Name and Last Name of the user who done the change 

 
_Delete Event: (Only in Back end for tracking purpose)_ 
Event Type / Name: Custom User Role Deleted
Event Description: Custom user role deleted
 
Date and Time:
 
User Role: $Role of the user who made the change
 
User Name: First Name and Last Name of the user who done the change
 

 

 

 
 
****
