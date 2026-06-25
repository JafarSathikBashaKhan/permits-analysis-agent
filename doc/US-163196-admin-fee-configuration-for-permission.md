# User Story 163196: Admin fee configuration for permission

## Metadata
| Field | Value |
|-------|-------|
| ID | 163196 |
| Type | User Story |
| Title | Admin fee configuration for permission |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags |  |
| Module | Contract Settings |

---

## Acceptance Criteria

Given a super admin or contract admin 
 
 
 
When in the contract settings under Apply → Fee Section** 
Then they should see a field labeled: "Admin fee for permission" 

 
When configure the 'Admin fee for permission' in the contract settings 
Then should applicable for all the permissions under this contract 

 
Field Validation** 
The field must: 

- Accept numeric values only 
- Accept values between 0 and 1000 
- Allow up to two decimal places (for currency) 
 
 
If a value outside the valid range is entered, show this error message: "Amount must be between 0 and 1000." 
**Note:** Based on the MNPS contract settings the currency symbol should show** 

 
Example Scenario:** 
A resident applies for a permission. 
The base cost of the permission is £25. 
The admin fee configured in the contract settings is £5. 
During the checkout, the system adds the admin fee to the base cost. 
Total cost payable by the resident = £30 
** 
Event** 
Event Type/Name: Admin Fee for Permission updated 
Event Description: Admin fee configuration updated in contract settings 
Date and Time: $CurrentTimestamp 
User Role: $UserRole 
User Name: $FirstName $LastName 
Event Category/Type: Configuration
