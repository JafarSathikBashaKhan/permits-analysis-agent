# User Story 25030: Configure Permissions - Permissions Tab | Merchant Settings

## Metadata
| Field | Value |
|-------|-------|
| ID | 25030 |
| Type | User Story |
| Title | Configure Permissions - Permissions Tab | Merchant Settings |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Car Park; Figma Added; Fully Complete |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

Given a Super admin and Contract admin, 
When wants to configure Merchant settings, 
Then should see the below fields, 

- Back Office Merchant ID 
- Back Office Merchant User 
- Back Office Merchant Password 
- Customer Merchant ID 
- Customer Merchant User 
- Customer Merchant Password 
 
 
**Back Office Merchant ID Field
**Allowed Characters: Alphanumeric (A-Z, 0-9) including special characters. 
Max Length: 30 characters** 
Validation:
 
If empty → show: “This field is required.”
 
Entering more than 30 characters should be restricted. 

 
Back Office Merchant User Field** 
Allowed Characters: Alphanumeric (A-Z, 0-9) including special characters.Max Length: 50 characters** 
Validation:
 
If empty → show: “This field is required.”
 
Entering more than 50 characters should be restricted. 

 
Back Office Merchant Password Field
**Allowed Characters: Combination of alphanumeric and special characters 
Max Length: 20 characters** 
Field Behavior:
 
Always masked  
Must not show existing password as text on the screen unless view option is clicked.
 
Should have the option to view the password. 
If not entered → show: “This field is required.” 
If not entered in the allowed format -> Show "Password should be in the combination of alphanumeric and special characters. 

 
Customer Merchant ID Field
**Allowed Characters: Alphanumeric (A-Z, 0-9) including special characters. 
Max Length: 30 characters** 
Required → “Customer Merchant ID is required.”
 
Invalid format → “Only letters, numbers, hyphens, and underscores allowed.”
 
Exceeds length → “Maximum 30 characters allowed.”
 
If not selected → show: “This field is required.” 

 
Customer Merchant User Field** 
Allowed Characters: Alphanumeric (A-Z, 0-9) including special characters.Max Length: 50 characters** 
Validation:
 
If empty → show: “This field is required.”
 
Entering more than 50 characters should be restricted. 

 
Customer Merchant Password Field
**Allowed Characters: Combination of alphanumeric and special character ** 
 
Max Length: 20 characters
 
Field Behavior:
 
Always masked  
Must not show existing password as text on the screen unless view option is clicked. 
Should have the option to view the password. 
If not entered → show: “This field is required.” 
If not entered in the allowed format -> Show "Password should be in the combination of alphanumeric and special characters. 

 
 
 
 
 
When want to save as draft, 
Then mandatory field validation is not required. 

 
For Understanding Purpose Only (Cannot be developed in this story)** 
When want to publish, 
If mandatory fields are not filled, 
Then should be restricted from Publishing.
