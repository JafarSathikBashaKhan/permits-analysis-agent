# US-110233: Create New User Role

| Field | Value |
|-------|-------|
| **ID** | 110233 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete; LV |

## Acceptance Criteria

**User Role Creation** 
 
 
 
 
Given a Super admin / Contract admin, 
When in the roles and permissions list screen, 
Then should have the provision to create new user role. 

 
When selected the button to add new role, 
Then should be able to add the new role. 

 
When in the screen to add new role, 
Then should be able to enter the below, 
_Role Name_: Only alphabetical characters up to 100 characters. 
_Description_: Alpha numeric up to 160 characters 

 
When enters role name, 
Then duplicate role names should not be allowed. 
 

 
**Types - Permission** 
When in Type permission section, 
Then should only see the Types that are enabled for a contract at the time of Contract creation. 
For Example: If Contract is created with only 'Permit' Type enabled, then only 'Permit' should be shown in that section. 

 
When want to give module or menu items permission to a user role, 
Then should be able to do by checking the boxes against each main or sub menu item. 
 

 
When in the Modules (menu) section, 
Then should see the list of main menus and sub menus. 
 

 
**Main Menus and Sub Menus**: 
 
_Home_ 
_My Work Item_ 
_Applications_: Under applications main menu should see the sub menus as TYPES which is configured against that contract like "Permits, Licenses, Suspension etc". 
 
When a type is checked in the 'Type' section, 
Then the 'View' and 'Manage' boxes should be checked for its type under applications menu. 
Eg: When 'Permit' is checked in the Type, then View and Manage boxes should be checked for 'Permit' sub menu of "Application". 

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

 
When in the menu items permission section, 
Then each line item should have a check box that allows him / her to enable or disable the access permission for that menu item. 

 
When viewing the menu items permissions for super admin role and contract, 
Then all the permissions should be in enabled state and should not be unchecked. 
 

 
When checked a parent menu item, 
Then all the sub menus should be checked by default. 
Note: Even though the user unchecks all the sub menus, and as the parent menu is being checked, then all the sub menus should be available to the users for access. 

 
When the role and created and permissions are done, 
Then that user should see the menu items in the application based on the permissions granted. 

 
_Audit / Events Capturing_ 
Event Type / Name: User Role Creation 
Event Description: New role '$RoleName' created 
Date and Time: 
 
User Role: $Role of the User 
User Name: First Name and Last Name of the user who created the role
