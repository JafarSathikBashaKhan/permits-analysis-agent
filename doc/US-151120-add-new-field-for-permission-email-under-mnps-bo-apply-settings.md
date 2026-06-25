# US-151120: Add New Field for Permission Email under MNPS BO 'Apply' Settings.

| Field | Value |
|-------|-------|
| **ID** | 151120 |
| **Type** | User Story |
| **Module** | MNPS Contract Settings |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete |

## Acceptance Criteria

**Contract Type Selection** 
Given a Super Admin/Contract Admin
 
When in MNPS BO contract settings
 
And selects the contract type as 'Apply'
 
Then a new 'Email' field should appear below the 'Permission Type' field 

 
**Permission Type Configuration** 
When in the Permission Type field
 
Then should be able to add multiple permissions for the selected contract 

 
**Email Field Behavior** 
When viewing the Email field
 
Then should see an indication: "Use commas to separate multiple entries" 

 
When permissions are added in the Permission Type field 
Then each added permission should appear in the Email section 
And should have a dedicated email input field beside it 
 
 
When a permission type is removed 
Then the corresponding permission entry and its Email field should be removed from the UI 

 
 
**Email Validation** 
When the user enter an invalid and duplicate 
Then those should be highlighted 
And should see the error message as 'Please ensure all email addresses are valid and not duplicated.' 

 
When the user press enter or tab 
Then the validation should be triggered 
And the error message should be shown 

 
When in the email field for each permission type 
Then should be able add 10 emails  
 

 
When want to add multiple emails for the permission type 
Then should use comma to add multiple emails 

 
**Save** 
Email fields are mandatory to be populated, without which SAVE action should not be enabled. 

 
_Note:_ Email should be registered in the send grid
