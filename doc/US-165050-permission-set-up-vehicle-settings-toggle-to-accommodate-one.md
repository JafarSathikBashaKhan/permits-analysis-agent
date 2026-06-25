# User Story 165050: Permission set up | Vehicle settings | Toggle to accommodate one or more vehicles per permission

## Metadata
| Field | Value |
|-------|-------|
| ID | 165050 |
| Type | User Story |
| Title | Permission set up | Vehicle settings | Toggle to accommodate one or more vehicles per permission |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

**Given** a Super Admin or Contract Admin,
 
 
 
 
 
**When** in the Permission Setup → Rules → Vehicle Settings,
**Then** should see a radio buttons as Enable and Disable for setting labelled as **"**Multiple Vehicles Allowed**".** 

- By default, Disable radio button should be marked. 
 
 
**When** this setting is enabled: 

- The permission should allow more than one vehicle to be associated within a single permit. 
 
- A maximum of **100 vehicles** can be entered per permission. 
 
 
**Note: In the Customer Portal**: 

- If a permission with this toggle enabled is selected by the user for purchase, 
 
- Then the system should allow the user to add **multiple vehicles** under that single permission during the purchase process. 
 
 
Note: When user selects Enable for Multiple Vehicles Allowed and then refreshing the page without saving then show alert pop up to save the selected option.
