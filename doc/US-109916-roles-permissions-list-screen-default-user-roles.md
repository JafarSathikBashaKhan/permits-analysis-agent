# US-109916: Roles & Permissions - List Screen & Default User Roles

| Field | Value |
|-------|-------|
| **ID** | 109916 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete; LV |

## Acceptance Criteria

Given a Apply Permit system,
 
 
 
 
 
 
 
 
 
 
When wants to have user roles for the system, 
Then it should have the default user roles. 

Given a Super admin / Contract admin user, 
When lands in the 'Roles & Permissions' sub menu of 'Users' main menu, 
Then should see the following default roles, 

- Super Admin 
 
- Contract Admin 
- BO Manager (BO Team leader of As Is) 
- BO user 
 
- CEO (CEO User) 
- Market Inspector  (License Inspector of As Is) 
- Ready only  (Client of As Is) 
- Custom  (New user role to be created) 
 
When viewing the user roles, 
Then it should be listed against the columns as below. 
Role - Role name Eg: Super admin, Org admin etc. 
Descriptions - Description added manually 
Permissions Type - What is checked in the add screen (Ref Figma) 
No of Users - Count of users under that role 
Action - Edit icon 
 

 
When in the description section, 
Then should see the default description for each default roles. 

 
When wants those description to be edited, 
Then only super admin and contract admin can edit those. 
 

 
When in the list screen, 
Then should have filtering and sorting option the column level as default. 
 

 
**Non Editable Super admin and Contract Admin** 
When in the list screen, 
Then the Super admin and Contract admin user roles cannot be edited. 
(Edit option should be disabled) 

 
**Pagination** 
When in the list screen, 
Then the pagination should be there. 

 
Import
When want to import the user list,
 
~~Then should be able to import as CSV by selecting appropriate button in the UI. ~~ 

 
**Descriptions**: (Add descriptions for each roles below) 
 

- Super Admin - Access and manage all modules and functionalities across the MNPS and Permissions. 
- Contract Admin - Access and manage all modules and functionalities across the Permissions.
 
- BO Manager - Access and manage all functionalities related to Back Office operations as assigned. 
- BO user - Limited access to specific Back Office functionalities as assigned. 
- CEO - Limited access to specific Back Office functionalities as assigned.  
- Market Inspector - Limited access to specific Back Office functionalities as assigned.  
 
- Ready only - View-only access across designated modules without the ability to make changes or updates. 
- Custom  - Access to certain modules based on permissions enabled.
