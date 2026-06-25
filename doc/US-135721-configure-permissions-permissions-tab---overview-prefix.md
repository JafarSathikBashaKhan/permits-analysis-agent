# User Story 135721: Configure Permissions | Permissions Tab - Overview | Prefix

## Metadata
| Field | Value |
|-------|-------|
| ID | 135721 |
| Type | User Story |
| Title | Configure Permissions | Permissions Tab - Overview | Prefix |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

**Allowed Format Validation
** 
 
Given the Super admin / Contract admin, 
When in the Prefix field,** 
When enters a value,
 
Then it should only accept:
 

- Alphanumeric characters (A–Z, 0–9) 
- No special characters 
- Maximum length: 10 characters 
- No minimum length enforced 
- Spaces should be auto trimmed 
 
Tool tip Display**** 
Given the user hovers over or focuses on the Prefix field,
 
Then a tool tip should appear with the text:
 
“Enter a unique alphanumeric prefix up to 10 characters. This prefix will appear at the start of the application number (e.g., 'RP' in RP-8XF93Z2K).” 

 
Prefix Saving
**Given the user enters a valid prefix,** 
When the configuration is saved,
 
Then the prefix should be stored and used in the generated application numbers for that permission type. 

 
Duplicate Prefix Check (within same contract)
**Given a prefix already exists for another permission type in the same contract,** 
When the user tries to enter the same prefix,
 
Then the system should display an error: “This prefix is already in use for another permission type” 

 
Edit** 
Given a Super Admin / Contract Admin is on the Overview section of a previously configured permission type,**When a prefix is already set,
 
Then the Prefix field should be editable. 

 
Given the user modifies the prefix to match another permission type within the same contract,
Then the system should block the update and display:
 
“This prefix is already in use for another permission type"  

 
Given the updated prefix passes all validations,
When the configuration is saved,
 
Then the new prefix should be stored and used in future application number generation for that permission type. 

 
Mandatory Field**: 
When the prefix field is not filled, 
Then should see the error as "This field is required". 
** 
Audit** 
Given a prefix is changed from a previously saved value,
Then the system should log this change in backend for audit purposes with a timestamp, user role and user name.
