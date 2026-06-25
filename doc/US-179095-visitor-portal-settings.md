# User Story 179095: Visitor Portal settings

## Metadata
| Field | Value |
|-------|-------|
| ID | 179095 |
| Type | User Story |
| Title | Visitor Portal settings |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags |  |
| Module | Contract Settings |

---

## Acceptance Criteria

Given a Super Admin or Contract Admin ** 
When accessing the Contract Settings
 
Then the Visitor Portal section should be visible 

 
When in the Visitor Portal section
 
Then the system should: 

- Display the list of permission types created for the contract 
- Include a toggle switch next to each permission type 
 
 
When the toggle is enabled for a permission type 
 
Then all permissions created under that permission type should show a "Visitor Portal Settings" section in the Permissions tab of the Permission Builder 

 
Event/Audit** 
**Toggle Enabled** 
Event type/name: Visitor portal toggle enabled 
Event description: "Permission type"  Visitor portal toggle enabled 
Date and time: Current timestamp 
User role: role of the user 
User name: name of the user 
Event category: Configuration 
** 
Toggle Disabled** 
Event type/name: Visitor portal toggle disabled 
Event description: "Permission type"  Visitor portal toggle disabled 
Date and time: Current timestamp 
User role: role of the user 
User name: name of the user 
Event category: Configuration
