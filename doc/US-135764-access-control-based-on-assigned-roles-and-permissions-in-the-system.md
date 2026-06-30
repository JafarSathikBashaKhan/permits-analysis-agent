# US-135764: Access Control Based on Assigned Roles and Permissions in the System

| Field | Value |
|-------|-------|
| **ID** | 135764 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Partial Complete |

## Acceptance Criteria

**Given **a permissioned user within the permission system,
**When** the user is assigned a specific role within a specific contract (whether it is a default role or a custom-created one),
**And** the user logs into the system with the assigned permissions, 
**Then** the user should have access *only* to the permissions explicitly associated with that role. 
**Then** I should be able to view and interact with only the permission types that are part of my role 
**Then** I should only be able to access the menu options granted to my role and not see options outside my permissions.
 
**Then** I should have access to all permissions granted by the parent role or those specifically granted to my assigned role.
 
**Then **the  user should be able to view the contracts, permission types, and menu-level permissions allocated to their assigned role. 
**Then **any newly created permission types should **not** impact the user's access unless those permissions are explicitly assigned to the user or their role. 
 
**Example:**

Given I am a system user assigned the role of **Back Office Manager**,

When I log in to the permission system,

Then I should only see the access permissions configured for the **Back Office Manager** role —

including only the parent and submenus explicitly allocated to that role. 
Another example: 
When a user is being allocated with only view permission  
then when the login and access the system should only be able to view the contents and options to create, edit and delete [Incl., action buttons] should be disabled.
