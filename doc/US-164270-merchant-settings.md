# User Story 164270: Merchant Settings

## Metadata
| Field | Value |
|-------|-------|
| ID | 164270 |
| Type | User Story |
| Title | Merchant Settings |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Contract Settings |

---

## Acceptance Criteria

Given a Super Admin or Contract Admin, 
When in the merchant settings of contract settings screen, 
Then should be able to configure merchant settings individually for each permission type. 
& 
Then each permission type should have the below set of merchant setting fields (**mandatory**), 

- Back Office Merchant Provider Field** 
- Back Office Merchant ID 
- Back Office Merchant User 
- Back Office Merchant Password 
- Customer Merchant Provider Field 
 
- Customer Merchant ID 
- Customer Merchant User 
- Customer Merchant Password 
 
 
For example:****If a Contract "XYZ" has 3 permission type "Permission, Licensing and Suspension",Then 3 individual merchant settings needs to be configured. 

 
Default vs. Permission-Level Configuration** 
Merchant settings configured in Contract Settings are treated as defaults for the selected permission type. 
If merchant settings are configured in the Permission Builder, 
Then those settings override the contract-level defaults and apply only to the specific permission. 
** 
Example** 
Permission Type: Permission 
Permission Name: Resident Permission 
** 
When merchant settings are configured in the Permission Builder, 
Then those settings apply only to Resident Permission and not to all permissions of that type. 
 

 
Field Validation** 
**** 
**Back Office Merchant Provider Field** 
Type: Text 
Validation: Maximum of 50 characters allowed. 
** 
Back Office Merchant ID Field** 
Type: Alphanumeric with special characters 
Validation: 

- Accepts letters (A–Z, a–z), numbers (0–9), and special characters. 
- Maximum of 30 characters allowed. 
 
 
**Back Office Merchant User Field** 
Type: Alphanumeric with limited special characters 
Validation: 

- Accepts letters (A–Z, a–z), numbers (0–9), hyphens (-), and underscores (_) only. 
- Maximum of 50 characters allowed. 
 
 
**Back Office Merchant Password Field** 
Type: Alphanumeric with special characters 
Validation: 

- Must be a combination of letters, numbers, and special characters. 
- Maximum of 20 characters allowed. 
 
 
Field Behavior: 

- Always masked by default. 
- Password should not be displayed as plain text unless the "View" option is clicked. 
- A "View Password" option must be available. 
- If the input does not meet the required format, show the error message: "Password should be a combination of alphanumeric and special characters." 
 
 
**Customer Merchant Provider Field** 
Type: Text 
Validation: Maximum of 50 characters allowed. 
**** 
**Customer Merchant ID Field** 
Type: Alphanumeric with limited special characters 
Validation: 

- Accepts letters (A–Z, a–z), numbers (0–9), hyphens (-), and underscores (_) only. 
- Maximum of 30 characters allowed. 
 
 
**Customer Merchant User Field** 
Type: Alphanumeric with special characters 
Validation: 

- Accepts letters (A–Z, a–z), numbers (0–9), and special characters. 
- Maximum of 50 characters allowed. 
 
 
**Customer Merchant Password Field** 
Type: Alphanumeric with special characters 
Validation: 

- Must be a combination of letters, numbers, and special characters. 
- Maximum of 20 characters allowed. 
 
 
Field Behavior: 

- Always masked by default. 
- Password should not be displayed as plain text unless the "View" option is clicked. 
- A "View Password" toggle option must be available. 
- If the input does not meet the required format, show the error message:"Password should be a combination of alphanumeric and special characters." 
 
 
**Error ** 
If a mandatory field is left empty, display the error message: 
"This field is required." 
** 
Event** 
Event Type/Name: Merchant Settings updated 
Event Description: Merchant Settings updated in contract settings 
Date and Time: $CurrentTimestamp 
User Role: $UserRole 
User Name: $FirstName $LastName 
Event Category/Type: Configuration
