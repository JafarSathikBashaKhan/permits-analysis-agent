# User Story 25058: Permission setup | Builder | Discount Settings

## Metadata
| Field | Value |
|-------|-------|
| ID | 25058 |
| Type | User Story |
| Title | Permission setup | Builder | Discount Settings |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Figma Added |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

**Navigation: Permission setup > Builder > Permission name > Permission Tab** 
**
** 
Given a super admin/contract admin 
When in the permission tab 
Then should have the discount settings in the left side menu section. 
** 
When select the discount settings 
Then should see the following mandatory** fields 

- Blue badge discount - Numeric field  
- Pension discount - Numeric field 
 
And should have radio button (percentage and currency) next to the both fields.And the screen is always editable. 
** 
Validation** 
When select 'Percentage' option for blue batch discount and pension discount 
Then the blue batch value and discount value should be 0 - 100 
And only one digit should be allowed for decimal 
And if the value is outside this range, show an error: "Percentage must be between 0 and 100. " 
** 
When select 'Currency' option for blue batch discount and pension discount 
Then the blue batch value and discount value should be 0 - 1000 
And two digits should allowed for currency 
And if the value is outside this range, show an error: "Amount must be between 0 and 1000. " 
 
Note:** Based on the MNPS contract settings the currency symbol should show** 

 
Save as draft** 
When want to save the discount settings as draft  
Then should no validation required 
** 
Publish (Cannot be developed in this story)** 
**** 
When attempting to publish the discount settings,**Then the system should validate all required fields.
If any mandatory field is left empty,
Then an error message should be displayed: "This field is required."** 
** 
Note:** For now there is no validation for the percentage and currency entered even 100% or currency value is more than the actual price of the application there is no restriction or validation. 
** 
 
 
  

**
