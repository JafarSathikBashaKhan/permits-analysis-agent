# User Story 165020: Permission setup | General setting | Configure admin fees for permission

## Metadata
| Field | Value |
|-------|-------|
| ID | 165020 |
| Type | User Story |
| Title | Permission setup | General setting | Configure admin fees for permission |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

Given a Super Admin or Contract Admin 
When in the General Settings section 
Then they should see a field labeled: "Admin Fee for Permission" 
 
**
** 
**Field Validation** 
The field must: 

- Accept numeric values only 
- Accept values between 0 and 1000 
- Allow up to two decimal places (for currency) 
 
 
If a value outside the valid range is entered, show this error message: "Amount must be between 0 and 1000." 
**Note:** Based on the MNPS contract settings the currency symbol should show** 

 
 
Default Value in contract settings:** 
The default value for "Admin Fee for Permission" is configured at the contract level under Apply > Contract Settings. 
If a value is configured in the Permission Builder, it will override the default set at the contract level for that specific permission only. 
** 
Example Scenario:** 
A resident applies for a Parking Bay permission. 
Base cost of the permission: £25 
Admin fee configured in the Permission Builder: £5 
Total cost payable at checkout: £30 (Base cost + Admin fee) 
** 
Audit/Event Logging** 
Event Type/Name: Admin Fee for  Permission Updated 
Event Description: Admin fee configuration updated in 'Permission Name' 
Date and Time: $CurrentTimestamp 
User Role: $UserRole 
User Name: $FirstName $LastName 
Event Category/Type: Configuration
