# User Story 160695: Templates | Terms and Conditions | Validation of Edit Permission Types Based on Publish Status

## Metadata
| Field | Value |
|-------|-------|
| ID | 160695 |
| Type | User Story |
| Title | Templates | Terms and Conditions | Validation of Edit Permission Types Based on Publish Status |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | dependency on publishh |
| Module | Templates |

---

## Acceptance Criteria

**Edit permissions when T&C template is not published (permission setup > builder)**** 
Given a Super Admin or Contract Admin is on the T&C edit screen 
When the T&C template is not linked to any permission (not published) 
Then the user can edit the  

- Template Name, 
-  Permission Type, 
-  Content in the text editor 
 
 
Edit permissions when T&C template is published (permission setup > builder)** 
Given a Super Admin or Contract Admin is on the T&C edit screen 
When the T&C template is linked to a permission (published) 
Then the user can edit the  

- Template Name  
-  Content in the text editor 
 
 
And the Permission Type field should be read-only (not editable)  
And should have the indication below the permission type as "This permission type cannot be modified. This template is associated with published permission."
