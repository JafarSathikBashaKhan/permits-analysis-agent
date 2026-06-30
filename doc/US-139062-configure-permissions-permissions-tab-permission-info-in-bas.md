# User Story 139062: Configure Permissions | Permissions Tab | Permission Info in Basic Info Section

## Metadata
| Field | Value |
|-------|-------|
| ID | 139062 |
| Type | User Story |
| Title | Configure Permissions | Permissions Tab | Permission Info in Basic Info Section |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete; LV |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

**Relocation of Permission Info Section
** 
 
Given I am viewing the Permission Configuration screen,** 
When I navigate to the "Permissions" tab,
 
Then the "Permission Info" section (fields like name, type, group and description) should be displayed in basic info section. 

 
Removal from Top Section**** 
Given the "Permission Info" has been moved to the Basic info section, 
When the configuration screen loads,
 
Then the same section should no longer appear at the top of the screen (outside the layout).
 

 
Data Consistency**** 
Given a user edits the values in the "Permission Info" section within the Overview tab,
 
When they save the permission configuration,
 
Then the values should be stored and displayed correctly on reloading the screen. 

 
Add Permission** 
When in the basic information section,Then should see the following required fields ** 

 
    Permission Name
 
    Type
 
    Group
 
    Description
 

 
Permission Name - Free Text field, should accept maximum 100 characters, Duplicates permission name should be restricted through a validation message.
 
Type'- Drop down (The type that are created in the contract level should listed in the drop down, both default and custom types).
 
Group - Drop down (Groups created should be listed in this dropdown)
 
Description - Alpha numeric & special characters field should accept maximum of 500 characters.
 

 
When type is selected from the drop-down, 
Then the groups associated with that selected type should be listed in group field.  
** 
**
** 
**Edit Permission** 
**When want to create or edit the permission    
Then following fields should be editable  

- Permission Name  
- Type  
- Group  
- Description 
 
Auto Save (Applicable throughout all) 
When switches to any tab or other sub section, 
Then the field values should be auto saved. 

 

 
**
