# User Story 135717: Configure Permissions | Permissions Tab - Overview | Terms & Conditions

## Metadata
| Field | Value |
|-------|-------|
| ID | 135717 |
| Type | User Story |
| Title | Configure Permissions | Permissions Tab - Overview | Terms & Conditions |
| Assigned To | Sudha Selvaraj |
| State | Ready for UAT |
| Tags | Fully Complete; LV |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

**Dropdown Availability
** 
 
 
Given the Super Admin / Contract Admin on the Permission Setup screen, 
When in the overview section, 
Then a drop down labeled "Terms and Conditions" should be visible** 

 
Pre-configured Template List**** 
When the user clicks the dropdown
 
Then all templates configured under the type 'Terms and Condition' should be listed. (templates are configured under template type “Terms and Conditions” in the Template Configuration screen) 
& 
Templates should be displayed in alphabetical order. 

 
Filtering by Permission Type**** 
Given these templates are permission type specific
 
Then the list should display all the templates of type 'Terms and Conditions' based on Permission type. 

 
Template Selection and Save**** 
Given the user selects a template
 
When saving the permission configuration
 
Then the selected template should be saved against that permission type
 
& 
Should be accessible in downstream customer portal or permit generation logic 

 
No Templates Configured
**Given there are no templates configured under "Terms and Conditions"** 
When the user clicks the drop-down
 
Then no templates should be listed. 

 
Note:** 
Dummy values can be used for Terms and Condition templates for now.
