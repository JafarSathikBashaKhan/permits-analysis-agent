# User Story 138267: Configure Permissions | Permissions Tab - Overview | Set of check boxes

## Metadata
| Field | Value |
|-------|-------|
| ID | 138267 |
| Type | User Story |
| Title | Configure Permissions | Permissions Tab - Overview | Set of check boxes |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | LV; Partial Complete |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

**Display of Other Settings Section
** 
 
 
Given the Super Admin / Contract Admin user on the Permission Overview screen** 
When the page is loaded
 
Then a dedicated categorization titled “Other Settings” should be displayed
 

 
Available Options in the Section**** 
Given the user views the “Other Settings” section
 
Then the following fields should be available as check boxes or toggles:
 

- Back-office Use 
- VAT Applicable 
- Hours of Operation 
- Business Name 
- Enable Experian Check 
 
Zone Related**: Radio Buttons 
When want to select non-zonal, 
Then should be allowed to set. 
** 
When sets zonal, 
Then should see the drop-down with list of zone already configured. 
(Multi select should be allowed for zone) 

 
Attempt to Publish Without Required Zone** Given the user enables “Zone Related”** 
When no zone is selected , 
Then display error: “Please select at least one zone". 

 
When not selected zone, 
Then save draft is allowed. 
But 
Publish is not allowed. 
 
 

 
Attempt to Save Without Required Zone** Given the user enables “Zone Related”** 
When no zone is selected , 
Then display error: “Please select at least one zone". 
 

 
Permit Mode Selection**: 
- Should see "Physical Permit" and "Virtual Permit" 
- & 
 
- Then shouldn't be allowed to uncheck both the check boxes. 
 

 
**Optionality of Settings**** 
Given the user is configuring a permission
 
Then none of the settings under “Other Settings” should be mandatory
 
& 
The user should be able to save the permission setup without enabling any of these options
 

 
Persist and Load Settings**
 
Given the user enables or disables the options and saves the permission setup
 
When the same permission is reopened, 
Then all previously selected settings should be retained and displayed
