# User Story 25067: Permission setup | Builder | Documents Type Settings

## Metadata
| Field | Value |
|-------|-------|
| ID | 25067 |
| Type | User Story |
| Title | Permission setup | Builder | Documents Type Settings |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Figma Added; Fully Complete |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

**Navigation: Permission setup > Builder > Permission name > Permission Tab** 
**** 
Given a super admin/contract admin 
When in the permission tab 
Then should have the document type settings in the left side menu section. 
** 
When select the document type settings 
Then should display a checkbox with document types in rows and action types (Apply, Renew, Vehicle Change).  
'Proof Count' must accept only numeric input, with a maximum 1-5 . 
Note: Create document type covered in [#140263](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/140263/) 

 
Checked** 
When any of the checkbox is checked in the line item 
Then the 'Proof count' field should enable with the default value as 1. 
** 
Unchecked** 
When all the checkbox is unchecked in the line item 
Then the 'Proof Count' field should be disabled. 
** 
 
When the document type "Proof of Residence" is configured with 'Proof Count' set to 2,
Then the user should be required to upload **2 documents** under "Proof of Residence" by selecting the appropriate **subtypes** for each in the customer portal. 
 
  
When the user clicks a checkbox
 
Then the system should allow them to select or deselect whether the document is required for that action type 
And the selection should be reflected immediately in the UI 

 
The user can check the checkbox  
If the document type is required for the scenarios (Apply, Renew, Vehicle Change) in columns. 

 
 
Edit** 
**And the screen is always editable
** 
**
** 
**Save as draft** 
When want to save the document types settings as draft  
Then should no validation required 
** 
Publish (Cannot be developed in this story)** 
**** 
When attempting to publish the document types settings,Then the system should validate all required fields.If any mandatory field is left empty,Then an error message should be displayed: "This field is required."
